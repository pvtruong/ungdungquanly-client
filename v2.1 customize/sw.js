importScripts('serviceworker-cache-polyfill.js');
var CACHE_VERSION = 'v6.69';
var CACHE_FILES = [
  'images/favicon.ico',
  'images/avatar.jpg',
  'getfile/others/noimage.png.thumb.png',
  'images/btn_google_signin.png',
  'images/page-loading.gif',
  'libs/font-awesome/css/font-awesome.min.css',
  'libs/simple-line-icons/simple-line-icons.min.css',
  'libs/bootstrap/dist/css/bootstrap.min.css',
  'libs/angular-xeditable/dist/css/xeditable.css',
  'libs/angular-bootstrap-calendar/dist/css/angular-bootstrap-calendar.min.css',
  'libs/angular-chart.js/dist/angular-chart.css',
  'libs/textAngular/dist/textAngular.css',
  'libs/semantic-ui-step/step.min.css',
  'libs/jquery/dist/jquery.min.js',
  'libs/bootstrap/dist/js/bootstrap.min.js',
  'libs/SocketIO.js',
  'libs/angular/angular.min.js',
  'libs/angular-locale_vi-vn.js',
  'libs/angular-cookies/angular-cookies.min.js',
  'libs/angular-route/angular-route.min.js',
  'libs/ui-bootstrap.min.js',
  'libs/checklist-model.js',
  'libs/angular-xeditable/dist/js/xeditable.min.js',
  'libs/angular-animate/angular-animate.min.js',
  'libs/Chart.js/Chart.min.js',
  'libs/angular-chart.js/dist/angular-chart.js',
  'libs/ng-infinite-scroll.min.js',
  'libs/slimscroll.js',
  'libs/underscore/underscore-min.js',
  "libs/underscore/underscore.js",
  'libs/async/dist/async.min.js',
  'libs/scrollglue.js',
  'libs/angular-multiple-select/build/multiple-select.min.js',
  'libs/ng-textcomplete/ng-textcomplete.min.js',
  'libs/textAngular/dist/textAngular-rangy.min.js',
  'libs/textAngular/dist/textAngular.min.js',
  'libs/textAngular/dist/textAngular-sanitize.min.js',
  'libs/moment/min/moment-with-locales.min.js',
  'libs/angular-bootstrap-calendar/dist/js/angular-bootstrap-calendar-tpls.min.js',
  'libs/webshim/js-webshim/minified/polyfiller.js',
  "libs/Highcharts/js/highcharts.js",
  "libs/fullcalendar/fullcalendar.css",
  'libs/fullcalendar/fullcalendar.print.min.css',
  "libs/fullcalendar/fullcalendar.css",
  'libs/fullcalendar/fullcalendar.print.min.css',
  "libs/Highcharts/js/modules/exporting.js",
	"libs/mobile-angular-ui/dist/css/mobile-angular-ui-hover.min.css",
	"libs/mobile-angular-ui/dist/css/mobile-angular-ui-base.min.css",
	"libs/mobile-angular-ui/dist/css/mobile-angular-ui-desktop.min.css",
	"libs/mobile-angular-ui/dist/js/mobile-angular-ui.min.js",
	"libs/mobile-angular-ui/dist/js/mobile-angular-ui.gestures.min.js",
	"libs/floating-button/modernizr.touch.js",
	"libs/floating-button/mfb-directive.js",
	"libs/mermaid/dist/mermaid.min.js",
	"libs/mermaid/dist/mermaid.forest.css",
	"libs/jsbarcode/dist/JsBarcode.all.min.js",
	"libs/angular-barcode/dist/angular-barcode.js",
  "libs/imgcache.js/js/imgcache.js",
  "libs/angular-imgcache/angular-imgcache.js",
  "libs/angular-cache/dist/angular-cache.min.js",
  "libs/jquery-ui/jquery-ui.min.js",
  "libs/jquery-ui-touch.js",
	"libs/c3/c3.min.css",
	"libs/c3/c3.min.js",
	"libs/pivottable/dist/pivot.min.js",
	"libs/pivottable/dist/c3_renderers.min.js",

  "libs/angular-drag-and-drop-lists/angular-drag-and-drop-lists.min.js",

  "libs/file-saver/FileSaver.min.js",

  "libs/Sortable/Sortable.js",
  "libs/angular-toastr/dist/angular-toastr.tpls.min.js",
  "libs/angular-toastr/dist/angular-toastr.min.css",
  "libs/angular-bootstrap/ui-bootstrap.js",
  "libs/angular-bootstrap/ui-bootstrap-tpls.js",
  "libs/multiple-select.js",
  "audio/alert.mp3",
  "libs/ng-cordova-master/dist/ng-cordova.js",
  "cordova.js",
  "libs/cache.js",
  "libs/stp.js",
  "css/angular-dashboard-framework.min.css",
  "css/ionicons.min.css",
  "css/effect.css",
  "css/main.min.css",
  "libs/semantic-ui-css/semantic.css",
  "templates.js",
  "configs.js",
  "react.js",
  "app.min.js"
];

function getEndpoint() {
  return self.registration.pushManager.getSubscription()
  .then(function(subscription) {
    if (subscription) {
      return subscription.endpoint;
    }

    throw new Error('User not subscribed');
  });
}
self.addEventListener('install', function(event) {
  event.waitUntil(
        caches.open(CACHE_VERSION)
            .then(function (cache) {
                console.log("Install server worker...",CACHE_VERSION);
                return cache.addAll(CACHE_FILES);
            })
  );
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
      caches.match(event.request).then(function(response){
        if(response){
          return response;
        }else{
          return fetch(event.request);
        }

      })
    )
});
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName!=CACHE_VERSION;
        }).map(function(cacheName) {
          console.log("delete old cache",cacheName);
          return caches.delete(cacheName);
        })
      );
    })
  );
});
self.addEventListener('push', function(event) {

  getEndpoint().then(function(endpoint){
      return fetch('/public/payload?ep=' + endpoint);
  }).then(function(res){
      return res.text();
  }).then(function(payload){
      var _ids ={};
      var payloads = JSON.parse(payload);
      payloads.forEach(function(pl){
         var data = JSON.parse(pl.payload);
         if(data._id){
             if(_ids[data._id]) return;
             _ids[data._id] = true;
         }
         //url
         if(data.action){
             data.action = data.action.toLowerCase();
             if(data.action=='update' || data.action =='new'){
                 data.action ="edit";
             }
         }else{
             data.action ='edit';
         }

         if(data.code){
             //only show notification if status of pbl equal 0
             if(data.code.toLowerCase()==="pbl" && data.trang_thai!==0){
                 return;
             }
             //create url
             data.url ="/" + data.code.toLowerCase();
             if(data.code.toLowerCase()==="message" && data.sender){
                 data.url =data.url + "/chat/" + data.sender;
             }else{
                 if(data.action==='edit' || data.action==='view'){
                     if(data.obj_id){
                         data.url =data.url +  "/" + data.action + "/" + data.obj_id;
                     }
                 }else{
                     data.url =data.url +  "/" + data.action;
				 }
             }
         }else{
             data.url ="/";
         }
         //title
         var title = data.title;
         if(!title){
             title ="ỨNG DỤNG QUẢN LÝ";
         }
         //body
         var body =data.body;
         var notificationOptions = {
            body:body,
            icon: '/images/icon/256x256.png',
            vibrate: [200, 100, 200, 100, 200, 100, 200],
            data:data
         };
         //show
         self.registration.showNotification(title, notificationOptions)
      })
  })
});
self.addEventListener('notificationclick', function(event) {
 if(!event.notification.data){
     event.notification.data ={};
 }
 var url =event.notification.data.url;
  event.notification.close();

  // This looks to see if the current is already open and
  // focuses if it is
  event.waitUntil(clients.matchAll({
    type: "window"
  }).then(function(clientList) {
    if(!url){
        url ="/";
    }else{
        if(url==="/task") url = "/task/groups";
        url ="/#!" + url;
    }
    if (clients.openWindow) return clients.openWindow(url);
  }));
});
