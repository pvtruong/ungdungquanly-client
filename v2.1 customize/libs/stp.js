var stpUntils= angular.module('stp-untils',[]);
var STP={math:Math}
STP.sum = function(arr,field){
  if(!arr || !field) return 0;
  var kq =0;
  arr.forEach(function(a){
    if(_.isNumber(a[field])){
      kq = kq + a[field];
    }
  })
  return kq;
}
STP.round = function(number, precision) {
    if(!precision) precision =0;
    var factor = Math.pow(10, precision);
    var tempNumber = number * factor;
    var roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;

};
STP.toDate = function(string){
    if(!string) return new Date();
    return new Date(string);
}
STP.tructed = function(string,len,direction){
    if(!string) return "";
    if(string.length>len){
        if(direction==='right'){
             string = '...' + string.slice(-(len-3));
        }else{
             string = string.substring(0,len-3) + '...';
        }


    }
    return string;
}
STP.add = function(arr,item,notResetLine,properties,sumFields){
    if(!arr) arr =[];
    if(!item){
        return arr;
    }
    if(properties){
        var _item = _.find(arr,function(r){
            return _.isMatch(r,properties);
        })
        if(_item){
           if(sumFields){
               sumFields.forEach(function(s){
                   _item[s] = (_item[s]?_item[s]:0) + (item[s]?item[s]:0)
               })
           }
        }else{
            arr.push(item);
        }
    }else{
         arr.push(item);
    }
   

    if(!notResetLine){
        for(var line=0;line<arr.length;line++){
            arr[line].line = line;
        }
    }
    return arr;
}
STP.reject = function(arr,properties,notResetLine){
    if(!properties){
        return arr;
    }
    for(var k in properties){
        if(properties[k] == undefined){
            delete properties[k];
        }
    }
    for(var i=0;i<arr.length;i++){
        if(_.isMatch(arr[i],properties)){
            arr.splice(i,1);
        }
    }
    
    
    
    if(!notResetLine){
        for(var line=0;line<arr.length;line++){
            arr[line].line = line;
        }
    }
    return arr;
}
STP.encodeBase64 = function(string){
    return window.btoa(unescape(encodeURIComponent(string)));
}
STP.where = function(arr,properties,notResetLine){
    if(!properties){
        return arr;
    }
    var kq =  _.where(arr,properties);

    if(!notResetLine){
        for(var line=0;line<kq.length;line++){
            kq.line = line;
        }
    }
    return kq;
}

STP.queryStringToJSON = function(queryString) {
  if(queryString.indexOf('?') > -1){
    queryString = queryString.split('?')[1];
  }else{
      return {};
  }
  var pairs = queryString.split('&');
  var result = {};
  pairs.forEach(function(pair) {
    pair = pair.split('=');
    result[pair[0]] = decodeURIComponent(pair[1] || '');
  });
  return result;
}
STP.browser = function() {
    var name = "Unknown";
    if(navigator.userAgent.indexOf("MSIE")!=-1){
        name = "MSIE";
    }
    else if(navigator.userAgent.indexOf("Firefox")!=-1){
        name = "firefox";
    }
    else if(navigator.userAgent.indexOf("Opera")!=-1){
        name = "opera";
    }
    else if(navigator.userAgent.indexOf("Chrome") != -1){
        name = "chrome";
    }
    else if(navigator.userAgent.indexOf("Safari")!=-1){
        name = "safari";
    }
    return name;   
}
stpUntils.factory('untils',['$timeout', function($timeout) {
    return STP;
}])
stpUntils.filter('propsFilter', function() {
  return function(items, props) {
    var out = [];

    if (angular.isArray(items)) {
      var keys = Object.keys(props);

      items.forEach(function(item) {
        var itemMatches = false;

        for (var i = 0; i < keys.length; i++) {
          var prop = keys[i];
          var text = props[prop].toString().toLowerCase();
          if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
            itemMatches = true;
            break;
          }
        }

        if (itemMatches) {
          out.push(item);
        }
      });
    } else {
      // Let the output be the input untouched
      out = items;
    }

    return out;
  };
});
STP.cfilter = function(arr,condition){
	return _.filter(arr,function(item){
		return _.isMatch(item,condition);
	})
}
