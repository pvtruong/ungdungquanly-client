var $jscomp={scope:{},findInternal:function(d,f,a){d instanceof String&&(d=String(d));for(var b=d.length,g=0;g<b;g++){var p=d[g];if(f.call(a,p,g,d))return{i:g,v:p}}return{i:-1,v:void 0}}};$jscomp.defineProperty="function"==typeof Object.defineProperties?Object.defineProperty:function(d,f,a){if(a.get||a.set)throw new TypeError("ES3 does not support getters and setters.");d!=Array.prototype&&d!=Object.prototype&&(d[f]=a.value)};
$jscomp.getGlobal=function(d){return"undefined"!=typeof window&&window===d?d:"undefined"!=typeof global&&null!=global?global:d};$jscomp.global=$jscomp.getGlobal(this);$jscomp.polyfill=function(d,f,a,b){if(f){a=$jscomp.global;d=d.split(".");for(b=0;b<d.length-1;b++){var g=d[b];g in a||(a[g]={});a=a[g]}d=d[d.length-1];b=a[d];f=f(b);f!=b&&null!=f&&$jscomp.defineProperty(a,d,{configurable:!0,writable:!0,value:f})}};
$jscomp.polyfill("Array.prototype.find",function(d){return d?d:function(d,a){return $jscomp.findInternal(this,d,a).v}},"es6-impl","es3");
accApp.directive("ngSelector",["$http","$cache_lists",function(d,f){return{restrict:"E",scope:{ngModel:"=",label:"=?",ngChange:"&",onSelect:"&?",ngDisabled:"=?",module:"@",fields:"@",fieldModel:"@",fieldLabel:"@",defaultValues:"@",condition:"@",parentData:"=?",setFields:"@"},template:function(a,b){a="";if(b.hasOwnProperty("button"))b=eval("({"+b.button+"})"),b.class||(b.class="btn btn-default"),b.text||(b.text="..."),a=a+"<a class='"+b.class+"'  ng-click='showList()'>"+b.text+"</a>";else if(b.hasOwnProperty("multiple")){a=
'<multiple-autocomplete ng-model="selectedList" object-property="label" suggestions-arr="items" ';if(void 0==b.showButtonList||1==b.showButtonList)b.hasOwnProperty("ngDisabled")||(a+='show-list="showList" ');a+="></multiple-autocomplete>"}else{a="<div>";if(void 0==b.showButtonList||1==b.showButtonList)a="<div class='inner-addon right-addon'>";a+="<select ng-model='ngModel' ng-disabled ='ngDisabled' ng-change='itemSelected()'";a=b.hasOwnProperty("options")?a+' ng-options="'+b.options+'"':b.hasOwnProperty("showCode")?
a+' ng-options="item.'+b.fieldModel+" as item."+b.fieldModel+" + ' - ' +  item."+b.fieldLabel+'  for item in items" ':a+' ng-options="item.'+b.fieldModel+" as item."+b.fieldLabel+'  for item in items" ';a+=" class='form-control'></select>";if(void 0==b.showButtonList||1==b.showButtonList)b.hasOwnProperty("ngDisabled")||(a+="<i class='glyphicon glyphicon-triangle-bottom'  ng-show='show_btn_list'   ng-click='showList()'></i>");a+="</div>"}return a},controller:["$scope","$uibModal","$window","$interval",
"$rootScope","$q",function(a,b,g,p,q,r){if(g=STPModules[a.module.toLowerCase()]){var l=g.obj;a.pathService=l.server_path;a.fieldsSearch=l.fields_find;var k=!1,n=!1;a.selectedList=[];a.itemSelected=function(){if(a.items){var e=_.find(a.items,function(e){return e[a.fieldModel]==a.ngModel});a.ngChange({$item:e});if(a.onSelect)a.onSelect({$item:e});e&&(a.fieldLabel&&(a.label=e[a.fieldLabel]),a.setData4Fields(e))}else a.ngChange({$item:null})};a.setData4Fields=function(e){if(a.parentData&&a.setFields){var b=
eval("({"+a.setFields+"})"),c;for(c in b)a.parentData[c]=e[b[c]]}};a.$watch("selectedList",function(e,b){a.multiple&&(k=!0,e&&!n&&(a.ngModel=[],a.ngModel=_.pluck(e,a.fieldModel)),k=!1)},!0);a.$watch("items",function(e,b){if(e&&a.ngModel&&a.multiple){var c=(a.fieldLabel||a.fieldModel).split(",");a.items.forEach(function(a){a.label="";c.forEach(function(c){a.label=a.label?a.label+" - "+a[c]:a[c]})});k=n=!0;a.selectedList=[];a.ngModel.forEach(function(c){var e=_.find(a.items,function(e){return e[a.fieldModel]==
c});e&&a.selectedList.push(e)});k=n=!1}},!0);a.$watch("ngModel",function(e,b){n=!0;_.isArray(e)&&!k&&(a.selectedList=[],e.forEach(function(c){var e=_.find(a.items,function(e){return e[a.fieldModel]==c});e&&a.selectedList.push(e)}));n=!1});a.list=function(e,b,c,g){var f=r.defer(),t=q.getCacheFactory(e,"SYSTEM"),m=a.pathService,m=_.isObject(b)?m+JSON.stringify(b):m+b?b:"";if(_online){var h=_.contains(paths_not_require_id_app,a.pathService)?server_url+"/api/"+a.pathService+"?t=1":server_url+"/api/"+
e+"/"+a.pathService+"?t=1";g&&(h=h+"&limit="+g);if(b)if(angular.isObject(b))var u=JSON.stringify(b),h=h+"&q="+u;else h=h+"&"+b;!c&&a.fields&&(c=a.fields);c&&(h=h+"&fields="+c);d.get(h).then(function(a){t.put(m,a.data);f.resolve(a)},function(a){a.data?f.reject(a):(a=t.get(m))?f.resolve({data:a}):l.getService(d,r,q).filterOffline(e,{condition:b,fields:c,limit:g}).then(function(a){f.resolve(a)},function(a){f.reject(a)})})}else(h=t.get(m))?f.resolve({data:h}):l.getService(d,r,q).filterOffline(e,{condition:b,
fields:c,limit:g}).then(function(a){f.resolve(a)},function(a){f.reject(a)});return f.promise};a.refresh=function(){var b={status:!0};if(a.condition){var d=eval("({"+a.condition+"})");_.extend(b,d)}a.list(id_app,b).then(function(c){c=c.data;a.condition||(f[a.module+"_"+id_app]=c);a.items=[];if(a.emptyYn&&!a.multiple){var b=eval("({"+a.fieldModel+":'',"+a.fieldLabel+":'"+a.headerText+"'})");a.items.push(b)}angular.forEach(c,function(c){a.items.push(c)});!a.ngModel&&0<a.items.length&&(a.ngModel=a.items[0][a.fieldModel],
a.fieldLabel&&(a.label=a.items[0][a.fieldLabel]),a.itemSelected())})};a.showList=function(){b.open({templateUrl:"templates/"+a.group+"/"+a.module+"/templates/dialog-select.html",controller:["$scope","$uibModalInstance","parentScope",a.module,"$rootScope",function(a,d,c,g,k){a.getList=function(b,d){var e={};c.condition&&(e=eval("({"+c.condition+"})"));b&&("$text"==c.fieldsSearch?e.$text={$search:b}:(e.$or=[],c.fieldsSearch.forEach(function(a){a=eval("({'"+a+"':{$regex:'"+b+"',$options:'i'}})");e.$or.push(a)})));
c.list(id_app,e,null,d).then(function(c){a.items=c.data})};a.keyup=function(c,b){13==c.keyCode&&b&&a.getList(b)};a.getList("",10);a.select=function(a){c.multiple?(_.isArray(c.ngModel)||(c.ngModel=[]),c.ngModel.push(a[c.fieldModel]),c.selectedList.push(a)):c.ngModel=a[c.fieldModel];c.fieldLabel&&(c.label=a[c.fieldLabel]);if(c.onSelect)c.onSelect({$item:a});c.setData4Fields(a);d.close()};a.cancel=function(){d.close()};a.openList=function(){var a=c.module;if(c.condition){var b=eval("({"+c.condition+
"})"),e="",g;for(g in b)e=e?e+"&"+g+"="+b[g]:g+"="+b[g];e&&(a=a+"?"+e)}k.openUrl(a,null,function(){c.refresh()});d.close()};a.quickadd=function(){var a={};c.defaultValues&&(a=eval("({"+c.defaultValues+"})"));l.quickadd(b,function(a){c.items.push(a);c.multiple?(_.isArray(c.ngModel)||(c.ngModel=[]),c.ngModel.push(a[c.fieldModel]),c.selectedList.push(a)):(c.ngModel=a[c.fieldModel],c.setData4Fields(a));c.fieldLabel&&(c.label=a[c.fieldLabel]);if(c.onSelect)c.onSelect({$item:a});var b=c.module+"_"+id_app;
f[b]&&f[b].push(a)},a);d.close()};a.quickedit=function(a){l.quickedit(b,a._id,function(b){var e;c.multiple?(e=_.find(c.selectedList,function(a){return a._id==b._id}))&&_.extend(e,b):(_.extend(a,b),c.setData4Fields(a));(e=_.find(c.items,function(a){return a._id==b._id}))&&_.extend(e,b)})};a.delete=function(b){k.confirm("B\u1ea1n c\u00f3 ch\u1eafc ch\u1eafn x\u00f3a kh\u00f4ng?").then(function(e){1==e&&g.delete(id_app,b._id).then(function(e){c.items=_.filter(c.items,function(a){return a._id!==b._id});
e=c.module+"_"+id_app;f[e]&&(f[e]=c.items);a.items=_.filter(a.items,function(a){return a._id!==b._id})},function(a){(a=a.data)||(a="Kh\u00f4ng th\u1ec3 k\u1ebft n\u1ed1i v\u1edbi m\u00e1y ch\u1ee7");k.alert(a)})})}}],size:"xs",resolve:{parentScope:function(){return a}}})};a.getList=function(){var b=a.module+"_"+id_app;if(f[b]&&!a.condition&&a.cache){b=f[b];a.items=[];if(a.emptyYn&&!a.multiple){var d=eval("({"+a.fieldModel+":'',"+a.fieldLabel+":'"+a.headerText+"'})");a.items.push(d)}angular.forEach(b,
function(b){a.items.push(b)});if(!a.ngModel&&0<a.items.length&&(a.ngModel=a.items[0][a.fieldModel],a.fieldLabel&&(a.label=a.items[0][a.fieldLabel]),a.onSelect))a.onSelect({$item:a.items[0]})}else a.refresh()};a.$watch("condition",function(b,d){b&&b!==d&&a.getList()})}}],link:function(a,b,d){a.show_btn_list=!0;d.hasOwnProperty("multiple")?a.multiple=!0:a.multiple=!1;d.hasOwnProperty("cache")?a.cache=d.cache:a.cache=a.multiple;d.hasOwnProperty("headerText")?a.headerText=d.headerText:d.hasOwnProperty("placeholder")?
a.headerText=d.placeholder:a.headerText="--";d.hasOwnProperty("group")?a.group=d.group:a.group="lists";d.hasOwnProperty("ngRequired")||d.hasOwnProperty("required")?a.emptyYn=!1:a.emptyYn=!0;a.getList()}}}]);
