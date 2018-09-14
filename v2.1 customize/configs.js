var server_base = "https://ungdungquanly.vn";
if(!server_base){
  server_base = window.location.protocol + "//" + window.location.hostname;
  console.log("server",server_base);
}
var server_url = server_base+ ":3001";
var server_url_list = server_base+ ":3001";
var server_url_report = server_base + ":3001";
var server_url_import = server_base + ":3001";
var server_url_backup_restore = server_base + ":3001";
var servers = {
  list: server_url_list,
  report: server_url_report,
  import: server_url_import
}
var MAIN_APPLICATION_NAME = "ỨNG DỤNG QUẢN LÝ";
var STPModules = {}; //important
var modulesD = [
  //,'ngTouch'
  'templates',
  'ngRoute',
  'angular-barcode',
  'mobile-angular-ui',
  'mobile-angular-ui.gestures',
  'ui.bootstrap',
  'ngAnimate',
  'luegg.directives',
  'ngCookies',
  //,'textAngular'
  'ngTextcomplete',
  'xeditable',
  "checklist-model",
  "ui.select",
  'dndLists',
  //,'chart.js'
  'ui.calendar',
  'mwl.calendar',
  'ui.tinymce',
  'multipleSelect',
  'ngCordova',
  'ng-mfb',
  'ImgCache',
  'stp-cache',
  'stp-untils',
  'adf',
  'adf.structures.base',
  'adf.widget.linklist',
  'adf.widget.counter',
  'adf.widget.balance',
  'adf.widget.pttct',
  'adf.widget.sosanhkhvatt',
  'adf.widget.task',
  'adf.widget.taskgroup',
  'toastr',
  'react.components',
  //system
  'appInfoService',
  'loginModule',
  'usersModule',
  'dashboardModule',
  'vatvaoModule',
  'vatraModule',
  'ctcpmhModule',
  'ctcpbhModule',
  'tdttnoModule',
  'tdttcoModule',
  'searchModule'
]

//danh sach module
/*CRM,//quan ly quan he khac hang
SALE,//quan ly ban hang
PURCHASE,//quan ly mua hang
STOCK,//hang ton kho
ASSET,//tai san co dinh
HRM,//nhan su tien luong
MONEY,//tien mat, tien gui ngan hang
COST,//gia thanh san xuat
TONGHOP,//ke toan tong hop
SYSTEM//he thong*/

var interfaces = [
  {name:'Giao diện mặc định',default:"dashboard"}
  ,{id:'default',name:'Giao diện đầy đủ',default:"dashboard"}
  ,{id:'crm',name:'CRM',modules:["CRM"],default:"dashboard"}
  ,{id:'pos',name:'POS',modules:["SALE"],default:'pbl'}
  ,{id:'sale',name:'SALE',modules:["SALE","PURCHASE","STOCK","SYSTEM"],default:'dashboard'}
]
//
var dashboarModelDefault = {
  title: " ",
  structure: "4-8",
  "rows": [
    {
      "columns": [
        {
          "styleClass": "col-md-4",
          "widgets": [
            {
              "type": "linklist",
              "config": {
                "links": [
                  {

                    "title": "Phiếu bán lẻ",
                    "href": "#!/pbl"
                  }, {

                    "title": "Phiếu thu",
                    "href": "#!/pt1"
                  }, {

                    "title": "Phiếu chi",
                    "href": "#!/pc1"
                  }, {

                    "title": "Hóa đơn mua hàng",
                    "href": "#!/pn1"
                  }, {

                    "title": "Hóa đơn bán hàng",
                    "href": "#!/hd2"
                  }, {

                    "title": "Phiếu kế toán",
                    "href": "#!/pkt"
                  }
                ]
              },
              "title": "Liên kết nhanh"

            }
          ]
        }, {
          "styleClass": "col-md-8",
          "widgets": [
            {
              "type": "taskgroup",
              "config": {},
              "title": "Công việc"
            },
            /*{
                "type":"pttct",
                "config":{

                },
                "title":"BC phân tích"

            }*/
          ]

        }
      ]
    }
  ]
};
