var d3locale = d3.locale({
  "decimal": ",",
  "thousands": ".",
  "grouping": [3],
  "currency": [
    "", " đ."
  ],
  "dateTime": "%A, %e %B %Y г. %X",
  "date": "%d.%m.%Y",
  "time": "%H:%M:%S",
  "periods": [
    "AM", "PM"
  ],
  "days": [
    "CN",
    "T2",
    "T3",
    "T4",
    "T5",
    "T6",
    "T7"
  ],
  "shortDays": [
    "CN",
    "T2",
    "T3",
    "T4",
    "T5",
    "T6",
    "T7"
  ],
  "months": [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12"
  ],
  "shortMonths": [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12"
  ]
});

angular.module('adf.widget.counter', ['adf.provider']).config([
  'dashboardProvider',
  function(dashboardProvider) {
    dashboardProvider.widget('counter', {
      title: 'Đếm số lượng',
      description: 'Đếm số đối tượng',
      templateUrl: 'templates/widgets/counter/view.html',
      reload: true,
      edit: {
        templateUrl: 'templates/widgets/counter/edit.html',
        controller: 'counterEditCtrl'
      },
      controller: [
        "$scope",
        "$http",
        function($scope, $http) {
          $scope.count = 0
          $scope.collection = $scope.config.collection;
          if ($scope.collection && $scope.collection.trim() == "customer")
            $scope.collection = "dmkh";
          if ($scope.collection) {
            var url = server_url_report + '/api/' + id_app + '/' + $scope.config.collection + '?fields=_id&count=1';
            $http.get(url).then(function(res) {
              $scope.count = res.data.rows_number;
            }, function(res) {
              console.log('can not get info', url, res.data);
            })
          }
        }
      ]
    });
  }
]).controller('counterEditCtrl', [
  function() {}
]);


angular.module('adf.widget.balance', ['adf.provider']).config([
  'dashboardProvider',
  function(dashboardProvider) {
    dashboardProvider.widget('balance', {
      title: 'Số dư',
      description: 'Hiện số dư của một đối tượng',
      templateUrl: 'templates/widgets/balance/view.html',
      reload: true,
      edit: {
        templateUrl: 'templates/widgets/balance/edit.html',
        controller: 'balanceEditCtrl'
      },
      controller: [
        "$scope",
        "$http",
        function($scope, $http) {
          //$scope.STP = STP;
          $scope.du00 = 0;
          if ($scope.config.tk) {
            var url = server_url_report + '/api/' + id_app + '/cktk?tk=' + $scope.config.tk;
            //
            if($scope.config.ma_kh){
              url = url + "&ma_kh=" + $scope.config.ma_kh;
            }
            //
            if($scope.config.ma_kho){
              url = url + "&ma_kho=" + $scope.config.ma_kho;
            }
            if($scope.config.ma_bp){
              url = url + "&ma_bp=" + $scope.config.ma_bp;
            }
            if($scope.config.ma_nv){
              url = url + "&ma_nv=" + $scope.config.ma_nv;
            }

            if($scope.config.ma_hd){
              url = url + "&ma_hd=" + $scope.config.ma_hd;
            }
            if($scope.config.ma_phi){
              url = url + "&ma_phi=" + $scope.config.ma_phi;
            }
            //
            $http.get(url).then(function(res) {

              $scope.du00 = STP.sum(res.data,"du_no00") - STP.sum(res.data,"du_co00");
              if($scope.config.du_co_yn){
                $scope.du00 = 0-$scope.du00;
              }
            }, function(res) {
              console.log('can not get info', url, res.data);
            })
          }

        }
      ]
    });
  }
]).controller('balanceEditCtrl', [
  function() {}
]);

angular.module('adf.widget.linklist', ['adf.provider']).config([
  'dashboardProvider',
  function(dashboardProvider) {
    dashboardProvider.widget('linklist', {
      title: 'Liên kết',
      description: 'Tạo danh sách truy cập nhanh',
      templateUrl: 'templates/widgets/linklist/view.html',
      edit: {
        templateUrl: 'templates/widgets/linklist/edit.html',
        controller: 'linklistEditCtrl'
      }
    });
  }
]).controller('linklistEditCtrl', [
  '$scope',
  function($scope) {

    function getLinks() {
      if (!$scope.config.links) {
        $scope.config.links = [];
      }
      return $scope.config.links;
    }

    $scope.addLink = function() {
      getLinks().push({});
    };

    $scope.removeLink = function(index) {
      getLinks().splice(index, 1);
    };
  }
]);

angular.module('adf.widget.pttct', ['adf.provider']).config([
  'dashboardProvider',
  function(dashboardProvider) {
    dashboardProvider.widget('pttct', {
      title: 'BC phân tích',
      description: 'Hiện báo cáo phân tích theo chỉ tiêu',
      templateUrl: 'templates/widgets/pttct/view.html',
      reload: true,
      edit: {
        templateUrl: 'templates/widgets/pttct/edit.html',
        controller: 'pttctEditCtrl'
      },
      controller: [
        '$scope',
        '$localStorage',
        'user',
        '$rootScope',
        '$location',
        '$timeout',
        '$shttp',
        'api',
        '$window',
        '$interval',
        'appInfo',
        '$uibModal',
        '$filter',
        function($scope, $localStorage, user, $rootScope, $location, $timeout, $http, api, $window, $interval, appInfo, $uibModal, $filter) {
          $scope.id_widget = (new Date()).getTime().toString(); //moment().format("YYYYMMDDhhmmssxxxx");
          if (!$scope.config.tu_ngay) {
            $scope.config.tu_ngay = new Date();
            $scope.config.tu_ngay.setMonth(0);
            $scope.config.tu_ngay.setDate(1);
          } else
            $scope.config.tu_ngay = new Date($scope.config.tu_ngay);
          if (!$scope.config.den_ngay)
            $scope.config.den_ngay = new Date();
          else
            $scope.config.den_ngay = new Date($scope.config.den_ngay);

          var types;
          $scope.opt_chart_close = true;

          var chart;
          var createChart = function(datas) {
            chart = c3.generate({
              bindto: '#chart' + $scope.id_widget,
              data: {
                x: 'x',
                columns: datas,
                type: 'bar',
                order: null,
                types: types,
                onclick: function(d) {
                  console.log("dashboard chart click", d);
                }
              },
              axis: {
                y: {
                  label: {
                    text: '1000 đ',
                    position: 'outer-middle'
                  },
                  tick: {
                    format: d3locale.numberFormat(",")
                  }

                },
                x: {
                  type: 'category'
                }

              },
              grid: {
                y: {
                  lines: [
                    {
                      value: 0
                    }
                  ]
                }
              }
            });
          }

          var fetchData = function(callback) {
            var url_rpt = server_url_report + "/api/" + id_app + "/pttct?t=1";
            if ($scope.config.id_rptform) {
              $localStorage.set(id_app + "_dash_chart", $scope.config.id_rptform);
              url_rpt = url_rpt + "&id_rptform=" + $scope.config.id_rptform;
            } else {
              return;
            }

            //xac dinh danh sach thang
            $scope.thangs = [];
            var thang,
              nam,
              thang_nam,
              _thang;

            for (thang = $scope.config.tu_ngay.getFullYear() * 12 + $scope.config.tu_ngay.getMonth() + 1; thang <= $scope.config.den_ngay.getFullYear() * 12 + $scope.config.den_ngay.getMonth() + 1; thang++) {
              _thang = thang - $scope.config.tu_ngay.getFullYear() * 12;

              nam = $scope.config.tu_ngay.getFullYear();
              if (_thang > 12) {
                _thang = _thang - 12;
                nam = nam + 1;
              }
              thang_nam = _thang.toString() + "/" + nam.toString();

              $scope.thangs.push({name: thang_nam, thang: _thang, nam: nam})
            }

            var datas = []; //this array is data of chart
            var rows = {}; //this object is used to managing the rows
            //fetch data from server
            async.mapSeries($scope.thangs, function(d, callback) {
              //detect url
              var tu_ngay = new Date(Date.UTC(d.nam, d.thang - 1, 1, 0, 0, 0, 0))
              if (d.nam == $scope.config.tu_ngay.getFullYear() && d.thang == $scope.config.tu_ngay.getMonth() + 1) {
                tu_ngay = $scope.config.tu_ngay;
              }
              var den_ngay = new Date(Date.UTC(d.nam, d.thang, 0, 0, 0, 0, 0))
              if (d.nam == $scope.config.den_ngay.getFullYear() && d.thang == $scope.config.den_ngay.getMonth() + 1) {
                den_ngay = $scope.config.den_ngay;
              }

              var url = url_rpt + "&tu_ngay=" + moment(tu_ngay).format("YYYY-MM-DD")
              url = url + "&den_ngay=" + moment(den_ngay).format("YYYY-MM-DD");
              $http.get(url).then(function(res) {
                res.data.forEach(function(r) {
                  //the 'thang_nam' property is used to specify the data of month.
                  r.thang_nam = d.name;
                  //create new row if not exist
                  if (!rows[r.ma_so])
                    rows[r.ma_so] = {
                      name: r.chi_tieu,
                      chart: r.chart,
                      data: []
                    };

                  //push data for this row
                  rows[r.ma_so].data.push(r);
                });

                callback(null, res.data);
              }, function(error) {
                callback(error.data || "Không kết nối được với máy chủ");
              })

            }, function(e, rs) {
              if (e)
                return callback(e);

              //prepare datas
              types = {};
              var value_of_thang,
                vs,
                r,
                row;
              for (r_name in rows) {
                row = rows[r_name];
                //get chart type
                types[row.name] = row.chart
                  ? row.chart
                  : 'bar';
                //creating new row for data of chart
                r = [row.name];
                datas.push(r);
                //calculating data for each month of this row
                $scope.thangs.forEach(function(thang) {
                  //filter datas of this month by property named 'thang_nam'
                  vs = _.filter(row.data, function(d) {
                    return d.thang_nam == thang.name;
                  });
                  //sum data at all
                  value_of_thang = 0;
                  vs.forEach(function(v) {
                    value_of_thang = value_of_thang + Math.round(v.so_kn / 1000, 0);
                  });
                  //
                  r.push(value_of_thang);
                });
              }
              //header of month
              var x = _.pluck($scope.thangs, "name");
              x = ['x'].concat(x);
              datas = [x].concat(datas);
              //result
              callback(null, datas)

            })
          }
          //set auto refresh each 15 minutes
          var stopTime = $interval(function() {
            $scope.error = "";
            fetchData(function(e, datas) {
              if (e)
                return $scope.error = e;
              if (!chart) {
                createChart(datas);
              } else {
                chart.load({columns: datas});
              }

            });
          }, 1000 * 60 * 15);

          $scope.$on('$destroy', function() {
            console.log("interval cancel")
            $interval.cancel(stopTime);
          });
          $scope.fetchData = function() {
            $scope.error = "";
            fetchData(function(e, datas) {
              if (e)
                $scope.error = e;
              else
                createChart(datas);
              }
            );
          }
          if ($scope.config.id_rptform) {
            $scope.fetchData();
          } else {
            $timeout(function() {
              $scope.fetchData();
            }, 1000);
          }

        }
      ]
    });
  }
]).controller('pttctEditCtrl', ['$scope', function($scope) {}]);


angular.module('adf.widget.sosanhkhvatt', ['adf.provider']).config([
  'dashboardProvider',
  function(dashboardProvider) {
    dashboardProvider.widget('sosanhkhvatt', {
      title: 'So sánh kế hoạch và thực tế',
      description: 'Hiện báo cáo so sánh kế hoạch và thực tế',
      templateUrl: 'templates/widgets/sosanhkhvatt/view.html',
      reload: true,
      edit: {
        templateUrl: 'templates/widgets/sosanhkhvatt/edit.html',
        controller: 'sosanhkhvattEditCtrl'
      },
      controller: [
        '$scope',
        '$localStorage',
        'user',
        '$rootScope',
        '$location',
        '$timeout',
        '$shttp',
        'api',
        '$window',
        '$interval',
        'appInfo',
        '$uibModal',
        '$filter',
        function($scope, $localStorage, user, $rootScope, $location, $timeout, $http, api, $window, $interval, appInfo, $uibModal, $filter) {
          $scope.id_widget = (new Date()).getTime().toString(); //moment().format("YYYYMMDDhhmmssxxxx");
          if (!$scope.config.nam)
            $scope.config.nam = new Date().getFullYear();
          //
          if (!$scope.config.tu_thang)
            $scope.config.tu_thang = new Date().getMonth()+1;
          //
          if (!$scope.config.den_thang)
            $scope.config.den_thang = new Date().getMonth()+1;
          //
          if (!$scope.config.type)
            $scope.config.type = 'bar';
          if (!$scope.config.groupby)
            $scope.config.groupby = 'ten_kho';
          //
          var types;
          $scope.opt_chart_close = true;

          var chart;
          var createChart = function(datas) {
            chart = c3.generate({
              bindto: '#chart' + $scope.id_widget,
              data: {
                x: 'x',
                columns: datas,
                type: $scope.config.type,
                order: null,
                types: types,
                onclick: function(d) {
                  console.log("dashboard chart click", d);
                }
              },
              axis: {
                y: {
                  label: {
                    text: '1000 đ',
                    position: 'outer-middle'
                  },
                  tick: {
                    format: d3locale.numberFormat(",")
                  }

                },
                x: {
                  type: 'category'
                }

              },
              grid: {
                y: {
                  lines: [
                    {
                      value: 0
                    }
                  ]
                }
              }
            });
          }

          var fetchData = function(callback) {
            var baocaotheo = $scope.config.groupby||'ten_kho';

            var url_rpt = server_url_report + "/api/" + id_app + "/sosanhkhvatt?nam=" +   $scope.config.nam + "&tu_thang=" +   $scope.config.tu_thang + "&den_thang=" + $scope.config.den_thang + "&groupby=" + baocaotheo;
            if($scope.config.group_id){
                url_rpt = url_rpt + "&group_id=" + $scope.config.group_id;
            }


            $http.get(url_rpt).then(function(res){
              //xac dinh danh sach thang
              var datas = []; //this array is data of chart
              var rows = {}; //this object is used to managing the rows
              var kehoachs=["Kế hoạch"];
              var thuctes=["Thực tế"];


              //datas =[["Ke hoach",1,2,10,40],["thu te",3,43,21,20]]
              res.data.forEach(function(r){
                if(!r.bold){
                  kehoachs.push(Math.round(r.chi_tieu/1000,0));
                  thuctes.push(Math.round(r.ps/1000,0));
                }
              })
              //header of month
              datas = [kehoachs,thuctes];

              //header of month
              var x = [];
              var i=0;
              res.data.forEach(function(r){
                x.push(r[baocaotheo]||i);
                i+=1;
              })
              x = ['x'].concat(x);
              datas = [x].concat(datas);
              //result
              callback(null, datas)
            },function(err){
              console.log("error fetch data",url_rpt);
              callback(err.data||"Không thể kết nối với máy chủ")
            })
          }
          //set auto refresh each 15 minutes
          var stopTime = $interval(function() {
            $scope.error = "";
            fetchData(function(e, datas) {
              if (e)
                return $scope.error = e;
              if (!chart) {
                createChart(datas);
              } else {
                chart.load({columns: datas});
              }

            });
          }, 1000 * 60 * 15);

          $scope.$on('$destroy', function() {
            console.log("interval cancel")
            $interval.cancel(stopTime);
          });
          $scope.fetchData = function() {
            $scope.error = "";
            fetchData(function(e, datas) {
              if (e)
                $scope.error = e;
              else
                createChart(datas);
              }
            );
          }
          $timeout(function() {
            $scope.fetchData();
          }, 1000);
        }
      ]
    });
  }
]).controller('sosanhkhvattEditCtrl', ['$scope', function($scope) {}]);

angular.module('adf.widget.task', ['adf.provider']).config([
  'dashboardProvider',
  function(dashboardProvider) {
    dashboardProvider.widget('task', {
      title: 'Công việc',
      description: 'Công việc',
      templateUrl: 'templates/widgets/task/view.html',
      reload: true,
      edit: {
        templateUrl: 'templates/widgets/task/edit.html',
        controller: 'taskEditCtrl'
      },
      controller: [
        "$scope",
        "$http",
        function($scope, $http) {}
      ]
    });
  }
]).controller('taskEditCtrl', [
  '$scope',
  '$http',
  function($scope, $http) {
    if (!$scope.config.progresses) {
      $scope.config.progresses = [
        {
          code: 0,
          name: 'Chưa thực hiện',
          sel: true
        }, {
          code: 1,
          name: 'Đang thực hiện',
          sel: true
        }, {
          code: 2,
          name: 'Hoàn thành',
          sel: false
        }, {
          code: 3,
          name: 'Tạm dừng',
          sel: true
        }, {
          code: 4,
          name: 'Đang chờ',
          sel: true
        }
      ]
    }

  }
]);

angular.module('adf.widget.taskgroup', ['adf.provider']).config([
  'dashboardProvider',
  function(dashboardProvider) {
    dashboardProvider.widget('taskgroup', {
      title: 'Nhóm công việc',
      description: 'Nhóm công việc',
      templateUrl: 'templates/widgets/taskgroup/view.html',
      reload: true,
      edit: {
        templateUrl: 'templates/widgets/taskgroup/edit.html',
        controller: 'taskgroupEditCtrl'
      },
      controller: [
        "$scope",
        "$http",
        function($scope, $http) {}
      ]
    });
  }
]).controller('taskgroupEditCtrl', [
  '$scope',
  '$http',
  function($scope, $http) {
  }
]);
