var dmvtModule = new baseInput('dmvt', 'dmvt', [
  "ma_vt", "ten_vt", "ma_vt2"
], 'Danh mục vật tư, hàng hóa', {
  modal_size: 'md',
  has_view: true,
  onLoading: function($scope, options) {
    $scope.view = 'grid';
    $scope.setView = function(vname) {
      $scope.view = vname;
    }
    $scope.printBarcode = function() {
      var modalInstance = options.$uibModal.open({
        template: "<div style='height:" + (
        innerHeight - 10).toString() + "px'><div class='scrollable'><div class='scrollable-content'><barcode data='list' field-code='ma_vt'  field-price='gia_ban_le' field-qty='sl_nhap' field-label='ten_vt' on-close='cancel()'></barcode></div></div></div>",
        controller: [
          '$scope',
          '$rootScope',
          '$controller',
          '$http',
          '$uibModalInstance',
          '$window',
          'appInfo',
          function($scope, $rootScope, $controller, $http, $uibModalInstance, $window, appInfo) {
            $scope.list = [];
            $scope.cancel = function() {
              $uibModalInstance.close();
            }
          }
        ],
        size: "md", //size:'lg',
        resolve: {
          parentScope: function() {
            return $scope;
          }
        }
      });
    }

    options.$rootScope.nextTick(function() {
      STPModules['dmnvt'].obj.getService(options.$http, options.$q, options.$rootScope).load(id_app).then(function(groups) {
        $scope.groups = groups.data;
      })
    })

    $scope.searchGroup = function(m) {
      $scope.ma_nvt = m._id;
      var filter = $scope.filter;
      if (!filter) {
        filter = {};
      }
      if ($scope.ma_nvt) {
        filter['ma_nvt'] = $scope.ma_nvt;
      } else {
        delete filter['ma_nvt'];
      }
      $scope.changeFilter({filter: filter})
    }
    $scope.searchType = function(m) {
      $scope.type_filter = m;
      var filter = $scope.filter;
      if (!filter) {
        filter = {};
      }
      delete filter.hot;
      delete filter.bestseller;
      delete filter.banner_small;
      delete filter.banner_large;
      if (m) {
        filter[m] = true;
      }
      $scope.changeFilter({filter: filter})
    }
  }
});
dmvtModule.defaultValues = {
  gia_xuat: '1',
  tk_vt: '1561'
};
dmvtModule.init = function($scope, $controller) {
  $scope.updatePrice = function(r) {
    if (r.gia_ban_le && r.ty_le_ck) {
      r.tien_ck = STP.round(r.gia_ban_le * r.ty_le_ck, 0)
    }
    $scope.update(r)
  }
  $scope.$watch('data.ty_le_ck', function(newData) {
    if ($scope.isDataLoaded && $scope.data.gia_ban_le && $scope.data.ty_le_ck) {
      $scope.data.tien_ck = STP.round($scope.data.ty_le_ck * $scope.data.gia_ban_le / 100, 0);
    }
  });
  $scope.$watch('data.gia_ban_le', function(newData) {
    if ($scope.isDataLoaded && $scope.data.gia_ban_le && $scope.data.ty_le_ck) {
      $scope.data.tien_ck = STP.round($scope.data.ty_le_ck * $scope.data.gia_ban_le / 100, 0);
    }
  });
}
var listItemsGrid = {};
dmvtModule.module.directive('products', [
  '$rootScope',
  function($rootScope) {
    return {
      restrict: 'E',
      scope: {
        onSelect: '&',
        buy: '=?',
        tyGia: '=?',
        where: '=?',
        loaiGia: '@?',
        scrollable: '=?'
      },
      templateUrl: function(elm, attrs) {
        return 'templates/lists/dmvt/templates/gridview.html'
      },
      controller: [
        '$scope',
        '$http',
        '$uibModal',
        'dmvt',
        '$cordovaBarcodeScanner',
        '$window','$localStorage',
        function($scope, $http, $uibModal, service, $cordovaBarcodeScanner, $window,$localStorage) {
          $scope.STP = $rootScope.STP;
          $scope.server_url = $rootScope.server_url;
          $scope.app_info = $rootScope.app_info;
          $scope.list = []
          $scope.showNumberProducts =  12;
          $scope.currentView = $localStorage.get("productView");//"gridview";
          if(!$scope.currentView) $scope.currentView = "gridview";
          $scope.changeView = function(){
            if($scope.currentView=="gridview"){
              $scope.currentView = "listview";
            }else{
                $scope.currentView = "gridview";
            }
            $localStorage.set("productView",$scope.currentView);
          }

          if (!$scope.loaiGia) {
            $scope.loaiGia = $scope.buy
              ? 'M'
              : 'B';
          }
          //
          $scope.limitOpts = {
            limit: 18,
            begin: 0
          }
          $scope.loadPage = function() {
            $scope.limitOpts.limit = $scope.limitOpts.limit + 5;
          }
          //
          $scope.f_gia = $rootScope.app_info.options.f_gia_nt || 2;
          $scope.f_tien = $rootScope.app_info.options.f_tien_nt || 2;
          if (!$scope.tyGia)
            $scope.tyGia = 1;
          if ($scope.tyGia === 1) {
            $scope.f_gia = $rootScope.app_info.options.f_gia || 0;
            $scope.f_tien = $rootScope.app_info.options.f_tien || 0;
          }
          $scope.$watch('tyGia', function(nv, ov) {
            if (nv && listItemsGrid[id_app]) {
              $scope.list = JSON.parse(JSON.stringify(listItemsGrid[id_app]));
              var ty_gia = nv;
              if (ty_gia == 1) {
                $scope.f_gia = $rootScope.app_info.options.f_gia || 0;
                $scope.f_tien = $rootScope.app_info.options.f_tien || 0;
              } else {
                $scope.f_gia = $rootScope.app_info.options.f_gia_nt || 2;
                $scope.f_tien = $rootScope.app_info.options.f_tien_nt || 2;
              }
              $scope.list.forEach(function(r) {
                r.gia_ban_le = STP.round(r.gia_ban_le / ty_gia, $scope.f_gia)
                r.gia_mua = STP.round(r.gia_mua / ty_gia, $scope.f_gia);
                r.tien_ck = STP.round(r.tien_ck / ty_gia, $scope.f_tien);
              });
            }
          });
          $scope.filter = function(condition, limit, callback) {

            if (!limit)
              limit = 100;
            $scope.limitOpts.limit = limit;
            $scope.$emit("$dataChangeStart")
            service.load(id_app, {
              condition: condition,
              limit: limit
            }).then(function(res) {
              listItemsGrid[id_app] = res.data;
              var list = JSON.parse(JSON.stringify(listItemsGrid[id_app]));

              var ty_gia = $scope.tyGia
                ? $scope.tyGia
                : 1;
              list.forEach(function(r) {
                r.gia_ban_le = STP.round(r.gia_ban_le / ty_gia, $scope.f_gia)
                r.gia_mua = STP.round(r.gia_mua / ty_gia, $scope.f_gia);
                r.tien_ck = STP.round(r.tien_ck / ty_gia, $scope.f_tien);
              });
              $scope.list = JSON.parse(JSON.stringify(list));

              $scope.$emit("$dataChangeSuccess")
              if (callback)
                callback(null, res.data);
              }
            , function(error) {
              $scope.$emit("$dataChangeError")
              if (!error)
                return $rootScope.alert("Không kết nối được với máy chủ");
              if (!callback) {
                $rootScope.alert(error.message);
              } else {
                callback(error.message);
              }

            });
          }
          $scope.searchKeyup = function(event, condition) {
            if (!condition)
              return;
            if (event.keyCode == 13) {
              $scope.condition = "";
              $scope.filter(condition, $scope.showNumberProducts, function(e, rs) {
                if (e)
                  return $rootScope.alert(e);
                if (rs && rs.length > 0) {
                  if (rs.length === 1) {
                    $scope.onClick(rs[0], function() {
                      //$scope.condition ="";
                      $scope.focus();
                    })
                  } else {
                    $scope.focus();
                  }
                } else {
                  $rootScope.confirm("Không tìm thấy sản phẩm này, bạn có muốn tạo không?").then(function(buttonIndex) {
                    var btnIndex = buttonIndex;
                    if (btnIndex === 1) {
                      dmvtModule.quickadd($uibModal, function(item) {
                        var ty_gia = $scope.tyGia
                          ? $scope.tyGia
                          : 1;

                        item.gia_ban_le = STP.round(item.gia_ban_le / ty_gia, $scope.f_gia)
                        item.gia_mua = STP.round(item.gia_mua / ty_gia, $scope.f_gia);
                        item.tien_ck = STP.round(item.tien_ck / ty_gia, $scope.f_tien);
                        $scope.onClick(item, function() {
                          //$scope.condition ="";
                          $scope.focus();
                        })
                      }, {
                        ma_vt: condition
                      }, function() {
                        $scope.condition = "";
                        $scope.focus();
                      })
                    } else {
                      $scope.condition = "";
                      $scope.focus();
                    }
                  })
                }

              });
            }

          }
          $scope.searchBarcode = function() {
            document.addEventListener("deviceready", function() {
              $cordovaBarcodeScanner.scan().then(function(barcodeData) {
                if (!barcodeData.text)
                  return;
                $scope.condition = barcodeData.text;
                $scope.filter($scope.condition, $scope.showNumberProducts, function(e, rs) {
                  if (e)
                    return $rootScope.alert(e);
                  if (rs && rs.length > 0) {
                    if (rs.length == 1) {
                      $scope.onClick(rs[0], function() {
                        $scope.searchBarcode();
                      })
                    }
                  } else {
                    $rootScope.confirm("Không tìm thấy sản phẩm này, bạn có muốn tạo không?").then(function(buttonIndex) {
                      var btnIndex = buttonIndex;
                      if (btnIndex === 1) {
                        dmvtModule.quickadd($uibModal, function(item) {
                          var ty_gia = $scope.tyGia
                            ? $scope.tyGia
                            : 1;
                          item.gia_ban_le = STP.round(item.gia_ban_le / ty_gia, $scope.f_gia)
                          item.gia_mua = STP.round(item.gia_mua / ty_gia, $scope.f_gia);
                          item.tien_ck = STP.round(item.tien_ck / ty_gia, $scope.f_tien);
                          $scope.onClick(item, function() {
                            $scope.searchBarcode();
                          })
                        }, {
                          ma_vt: $scope.condition
                        }, function() {
                          //cancel turn online camera for scanning
                          $scope.searchBarcode();
                        })
                      } else {
                        $scope.searchBarcode();
                      }
                    })
                  }

                });
              }, function(error) {
                // An error occurred
              });

            }, false);
          }
          $scope.onClick = function(item, callback) {
            if (!callback)
              callback = function() {};
            if ($scope.onSelect) {
              $rootScope.toast("Đã chọn " + item.ten_vt);
              if (item.ma_lo_yn || item.ma_tt1_yn || item.ma_tt2_yn || item.ma_tt3_yn) {
                var modalInstance = $uibModal.open({
                  templateUrl: "templates/lists/dmvt/templates/select-lo.html",
                  controller: [
                    '$scope',
                    '$rootScope',
                    '$controller',
                    '$http',
                    '$uibModalInstance',
                    'parentScope',
                    'appInfo',
                    function($scope, $rootScope, $controller, $http, $uibModalInstance, $parentScope, appInfo) {
                      initLabel($rootScope, $scope, appInfo, "DMVT", $http);
                      $scope.buy = $parentScope.buy;
                      $scope.item = item;
                      $scope.parameters = {
                        ma_vt: item.ma_vt
                      };
                      if ($parentScope.where) {
                        _.extend($scope.parameters, $parentScope.where);
                      }

                      $scope.cancel = function() {
                        $uibModalInstance.close();
                        callback();
                      }

                      $scope.select = function(lo) {
                        item.ma_lo = (lo.ma_lo || "");
                        item.ma_kho = (lo.ma_kho || "");
                        item.ma_tt1 = (lo.ma_tt1 || "");
                        item.ma_tt2 = (lo.ma_tt2 || "");
                        item.ma_tt3 = (lo.ma_tt3 || "");
                        item.han_sd = lo.han_sd;
                        $parentScope.onSelect({$item: item});
                        $uibModalInstance.close();
                        callback();
                      }

                    }
                  ],
                  size: "md", //size:'lg',
                  resolve: {
                    parentScope: function() {
                      return $scope;
                    }

                  }
                });
              } else {
                item.ma_lo = (item.ma_lo || "");
                item.ma_kho = (item.ma_kho || "");
                item.ma_tt1 = (item.ma_tt1 || "");
                item.ma_tt2 = (item.ma_tt2 || "");
                item.ma_tt3 = (item.ma_tt3 || "");

                $scope.onSelect({$item: item});
                callback();
              }
            }
          }
          $scope.add = function() {
            dmvtModule.quickadd($uibModal, function(data) {
              $scope.list.push(data);
            })
          }
          if ($scope.list.length === 0) {
            $scope.filter("", $scope.showNumberProducts);
          }

        }
      ],
      link: function($scope, elem, atrr) {
        $scope.focus = function() {}
      }
    }
  }
]);
