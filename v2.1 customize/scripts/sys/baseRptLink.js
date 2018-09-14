var baseRptLink=function(c,u,m,d){this.rptId=c;var q=c+"Module";_.contains(modulesD,q)||modulesD.push(q);this.rptModuleName=q;this.module=angular.module(this.rptModuleName,["ngRoute"]);var e=this;d||(d={});d.onInit&&(e.init=d.onInit);d.onAfterLoadData&&(e.afterLoadData=d.onAfterLoadData);d.onFetchData&&(e.fetchData=d.onFetchData);d.onDefaultCondition&&(e.defaultCondition=d.onDefaultCondition);d.onPrepareCondition&&(e.prepareCondition=d.onPrepareCondition);this.module.factory(c+"Config",function(){return{}});
this.getData=function(a,c,b,h,f){var g=server_url_report+"/api/"+id_app+"/ent-report/"+u+"?t=1";f&&f.$emit("$dataChangeStart");b&&angular.forEach(b,function(a,b){a&&(angular.isDate(a)?a=a.getFullYear().toString()+"-"+(a.getMonth()+1).toString()+"-"+a.getDate().toString():angular.isObject(a)&&(a=JSON.stringify(a)),g=g+"&"+b+"="+encodeURI(a))});a.get(g,{headers:{},timeout:18E5}).then(function(a){a=a.data;if(0<=a.indexOf("ERROR"))f&&f.$emit("$dataChangeError"),h(a);else{if(_.isString(a))try{a=eval("("+
a+")")}catch(l){return h(l)}h(null,a);f&&f.$emit("$dataChangeSuccess");e.fetchData&&e.fetchData(g,a)}},function(a){a=a.data;f&&f.$emit("$dataChangeError");if(a){var b="L\u1ed7i: ",b=a.message?b+a.message:"ECONNREFUSED"==a.code?b+"Kh\u00f4ng th\u1ec3 k\u1ebft n\u1ed1i v\u1edbi ch\u01b0\u01a1ng tr\u00ecnh STP ENTERPISE t\u1ea1i "+f.appInfo.stp_api_address:b+JSON.stringify(a);h(b)}else h("Kh\u00f4ng th\u1ec3 k\u1ebft n\u1ed1i v\u1edbi ch\u01b0\u01a1ng tr\u00ecnh STP ENTERPISE t\u1ea1i "+f.appInfo.stp_api_address)})};
this.module.controller(c+"Controller",["$scope","excel","$http","$filter","$location",c+"Config","$controller","$rootScope","$window","appInfo",function(a,v,b,h,f,g,k,l,t,r){l.function_title=m;l.function_code=c;initLabel(l,a,r,c,b);var n=f.search();if(!a.condition){a.condition={};e.defaultCondition&&e.defaultCondition(a.condition);if(_.isEqual(n,{})&&g.condition)for(var p in g.condition)f.search(p,g.condition[p]),n[p]=g.condition[p];_.extend(a.condition,n)}e.init&&e.init(a,b,h,f,g,k);r.info(c,function(t,
r,p){if(!t){a.appInfo=p;a.title=m;g.id_app==id_app&&_.isEqual(n,g.condition)&&(a.data=g.data);a.data?(a.condition_show=!1,e.afterLoadData&&e.afterLoadData(a,a.data)):a.condition_show=!0;a.hideCondition=function(){a.condition_show=!a.condition_show};a.viewVoucher=function(a,b){a&&b&&(a=a.toLowerCase()+"/edit/"+b+"?redirect=back",f.url(a))};a.order=function(b,c){a.data=h("orderBy")(a.data,b,c)};a.limit=100;a.begin=0;a.loadPage=function(){a.limit+=5};a.getData=function(){a.limit=100;if(d.onStartGetData)d.onStartGetData(a,
function(b){b?l.alert(b):a.getDataFromServer()});else a.getDataFromServer()};a.getDataFromServer=function(){f.$$search={};for(var c in a.condition){var d=a.condition[c];angular.isDate(d)&&(d=h("date")(d,"yyyy-MM-dd"));d&&""!=d&&f.search(c,d)}e.prepareCondition?e.prepareCondition(a.condition,h,function(c,d){c?a.error=c:e.getData(b,h,d,function(b,c){a.data=c;a.error=b;b||(a.condition_show=!1,g.condition=f.search(),g.data=c,g.id_app=id_app,e.afterLoadData&&e.afterLoadData(a,c))},a)}):e.getData(b,h,a.condition,
function(b,c){a.data=c;a.error=b;b||(a.condition_show=!1,g.condition=f.search(),g.data=c,g.id_app=id_app,e.afterLoadData&&e.afterLoadData(a,c))},a)};a.exportExcel=function(a){v.tableToExcel("#exportable","Report")};if(d.onLoading)d.onLoading(a,{$http:b,$filter:h,$location:f,$config:g,$controller:k});a.condition.isDrillDown&&(a.condition_show=!1,a.getData());a.isLike=!1;id_app&&(b.get(server_url+"/api/"+id_app+"/like_module?q={module:'"+c+"'}").then(function(b){(b=b.data)&&1==b.length&&(a.isLike=b[0].like)},
function(a){console.log(a.data)}),a.like=function(){b.post(server_url+"/api/"+id_app+"/like_module",{id_app:id_app,module:c,like:!0}).then(function(b){b.data&&(a.isLike=!0)},function(a){console.log(a.data)})},a.unlike=function(){b.post(server_url+"/api/"+id_app+"/like_module",{id_app:id_app,module:c,like:!1}).then(function(b){b.data&&(a.isLike=!1)},function(a){console.log(a.data)})});a.$on("keydown",function(b,c){116==c.which?a.getData():c.ctrlKey&&(69==c.which?a.exportExcel():80==c.which&&a.print())})}})}]);
this.module.directive(c+"Print",function(){return{restrict:"E",templateUrl:"templates/ent-reports/"+c+"/templates/print.html",controller:["$controller","appInfo","$scope",c+"Config","$timeout","$location","$rootScope","$http",function(a,c,b,d,f,g,k,l){b.parameters={};b.title=m;e.setParameters&&e.setParameters(b,a);b.printRpt=function(a){a||(a=m);var b=document.getElementById("printView");if(!b)return k.alert("M\u1eabu in thi\u1ebfu id 'printView'");k.printS(b.innerHTML,a)}}]}});this.module.controller(c+
"PrintController",["$controller","appInfo","$scope",c+"Config","$timeout","$location","$rootScope","$http",function(a,d,b,h,f,g,k,l){k.function_title=m;k.function_code=c;initLabel(k,b,d,c,l);d.info(c,function(d,l,n){d||(b.parameters={},b.condition=h.condition,b.title=m,b.data=h.data,b.appInfo=n,e.setParameters&&e.setParameters(b,a),b.print=function(){b.printing=!0;k.printing=!0;f(function(){window.print();b.printing=!1;k.printing=!1},100)},b.back=function(){g.url("/"+c)},b.$on("keydown",function(a,
c){c.ctrlKey&&80==c.which&&b.print()}))})}]);this.module.filter("sdate",["$filter",function(a){return function(c){var b="";c&&(b=new Date(c),b=a("date")(b,"dd/MM/yyyy"));return b}}]);this.module.config(["$routeProvider","$locationProvider",function(a,d){a.when("/"+c,{templateUrl:"templates/ent-reports/"+c+"/templates/browser.html",controller:c+"Controller",reloadOnSearch:!1}).when("/"+c+"/print",{templateUrl:"templates"+c+"/templates/print.html",controller:c+"PrintController",reloadOnSearch:!1})}])};