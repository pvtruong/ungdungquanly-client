var stpCache = angular.module('stp-cache',[]);
stpCache.factory('indexCache',['$timeout', function($timeout) {
    window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
    window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange
    
    window.IDBKeyRange.prototype.includes = IDBKeyRange.prototype.includes || function(key) {
      var r = this, c;
      if (r.lower !== undefined) {
        c = indexedDB.cmp(key, r.lower);
        if (r.lowerOpen && c <= 0) return false;
        if (!r.lowerOpen && c < 0) return false;
      }
      if (r.upper !== undefined) {
        c = indexedDB.cmp(key, r.upper);
        if (r.upperOpen && c >= 0) return false;
        if (!r.upperOpen && c > 0) return false;
      }
      return true;
    }
    var dbs={};
   
    var openDB= function(id_app,name,fn){
        var dbName = id_app?name + id_app:name;
        var request = indexedDB.open(dbName,1);
        request.onerror = function(event) {
            fn("KHông thể mở database",dbName,event);
        };
        request.onsuccess = function(event) {
            var db =  event.target.result;
            if(db.objectStoreNames.contains(name)) {
                fn(null,db);
            }else{
                console.log("store",name, "không tồn tại. Thử mở lại sau 50ms")
                $timeout(function(){
                    console.log("thử mở lại store",name);
                    openDB(id_app,name,fn);
                },50)
            }
        };
        request.onupgradeneeded = function(event) {
          
           var db = event.target.result;
           if(!db.objectStoreNames.contains(name)) {
                var s_objectStore = db.createObjectStore(name, { keyPath: "pkey"});
                var s = STPModules[name];
                if(s && s.obj && s.obj.fields_find){
                    s.obj.fields_find.forEach(function(index){
                         s_objectStore.createIndex(index, index, { unique: false });
                    });
                }
                s_objectStore.transaction.oncomplete = function(event){
                    console.log("created store " ,name);
                }
                s_objectStore.transaction.onerror = function(event){
                    console.error("create store ", name,event) 
                }
             }
        }
    }
    //
    var openStore = function(id_app,store,fn){
        var storeName;
       
        if(_.isObject(store)){
            storeName = store.name;
        }else{
            storeName = store;
        }
        openDB(id_app,storeName,function(e,db){
            if(db){
                
                var transaction = db.transaction(storeName, "readwrite").objectStore(storeName);
                fn(null,transaction);
            }else{
                fn(e)
                
            }
        });
    }
    var getCacheFactory = function(id_app,name,byUser){
        var createKey = function(key){
            var _key = id_app?id_app:'';

            if(byUser){
                _key = _key + byUser;
            }
            _key = _key + key;
            return _key;
        }
        var nameCache = {name:name?name:"SYSTEM"}
        return {
            put:function(key,obj,fn){
                if(!fn) fn = function(){}
                if(!key) return fn("Yêu cầu khoá chính");
                openStore(id_app,nameCache,function(e,trans){
                    if(e) return fn(e)
                    obj.pkey = createKey(key);
                    var del = trans.delete(obj.pkey);
                    
                    del.onsuccess = function(){
                        var request = trans.add(obj);
                        request.onsuccess = function(event){
                            
                            fn(null,obj);
                        }
                        request.onerror = function(event){
                            fn(event);
                        }
                    }
                    del.onerror= function(event){
                        console.log("error","delete obj")
                        fn("Lỗi khi xoá đối tượng trước khi thêm mới")
                    }
                    
                })
            },
            get:function(key,fn){
                if(!fn) fn = function(){}
                var pkey = createKey(key);
                
                openStore(id_app,nameCache,function(e,trans){
                    if(e) return fn(e)
                    var request = trans.get(pkey);
                    request.onsuccess = function(event){
                       fn(null,event.target.result)
                    }
                    request.onerror = function(event){
                        console.log("can't get pkey",pkey,event);
                        fn(event);
                    }
                })
               
            },
            remove:function(key,fn){
                if(!fn) fn = function(){}
                var pkey = createKey(key);
                 openStore(id_app,nameCache,function(e,trans){
                    if(e) return fn(e)
                    var request = trans.delete(pkey);
                    request.onsuccess = function(event){
                       fn(null)
                    }
                    request.onerror = function(event){
                        fn(event);
                    }
                })
                
            },
            values:function(fn){
                if(!fn) fn = function(){}
                openStore(id_app,nameCache,function(e,trans){
                    if(e) return fn(e);
                    var objs =[];
                    var request = trans.openCursor();
                    request.onsuccess = function(event) {
                      var cursor = event.target.result;
                      if (cursor) {
                        objs.push(cursor.value);
                        cursor.continue();
                      }
                      else {
                        fn(null,objs)
                      }
                    }
                    request.onerror = function(event){
                        fn(event);
                    }
                })
                
               
            },
            find:function(indexs,key,fn){
                openStore(id_app,nameCache,function(e,trans){
                    if(e) return fn(e);
                    var objs =[];
                    if(!key){
                        var request = trans.openCursor();
                        request.onsuccess = function(event) {
                          var cursor = event.target.result;
                          if (cursor) {
                            objs.push(cursor.value);
                            cursor.continue();
                          }
                          else {
                            fn(null,objs)
                          }
                        }
                        request.onerror = function(event){
                            fn(event);
                        }
                    }else{
                        //var range = IDBKeyRange.bound('0000000000000000' + key.toUpperCase(),key.toLowerCase() + 'zzzzzzzzzzzzzzzzzzz', false, false);
                        
                        var range =IDBKeyRange.bound(key, key + "\uffff");
                        async.mapSeries(indexs,function(index_name,callback){
                            
                            var index = trans.index(index_name);
                            if(index){
                                index.openCursor(range).onsuccess = function(event) {
                                  var cursor = event.target.result;
                                  if (cursor) {
                                    if(!_.find(objs,function(o){return o.pkey==cursor.pkey})){
                                         objs.push(cursor.value);
                                    }
                                    cursor.continue();
                                  }else{
                                    
                                      callback();
                                  }
                                }
                            }else{
                                callback();
                            }
                            
                        },function(e,rs){
                            console.log("end find",new Date(),nameCache);
                            fn(e,objs)
                        })
                    }
                    
                    
                })
            },
            destroy:function(fn){
                if(!fn) fn = function(){}
                openStore(id_app,nameCache,function(e,trans){
                    if(e) return fn(e)
                    var request = trans.clear();
                    request.onsuccess = function(event){
                        fn(null);
                    }
                    request.onerror = function(event){
                        fn(event);
                    }
                })
            }
        }
    }
    return {
            openDB:openDB,
            openStore:openStore,
            getCacheFactory:getCacheFactory
        
    }
}])


