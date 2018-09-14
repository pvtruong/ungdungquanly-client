var hd3Module = new baseVoucher('hd3', 'hd3', [], 'Phiếu nhập hàng bán bị trả lại', {
  onInput: function(scope, options) {
    scope.selectItem = function(data, item, callback) {
      if (!callback)
        callback = function() {};
      if (item.ma_lo_yn || item.ma_tt1_yn || item.ma_tt2_yn || item.ma_tt3_yn) {
        var modalInstance = options.$uibModal.open({
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
              $scope.item = item;
              $scope.parameters = {
                ma_vt: item.ma_vt,
                ma_kho: data.ma_kho
              };
              $scope.cancel = function() {
                $uibModalInstance.close();
                callback();
              }

              $scope.select = function(lo) {
                item.ma_lo = lo.ma_lo;
                item.ma_kho = lo.ma_kho;
                item.ma_tt1 = lo.ma_tt1;
                item.ma_tt2 = lo.ma_tt2;
                item.ma_tt3 = lo.ma_tt3;
                item.han_sd = lo.han_sd;

                data.details_doi = STP.add(data.details_doi, {
                  ma_vt: item.ma_vt,
                  ten_vt: item.ten_vt,
                  ma_lo: item.ma_lo,
                  ma_tt1: item.ma_tt1,
                  ma_tt2: item.ma_tt2,
                  ma_tt3: item.ma_tt3,
                  han_sd: item.han_sd,
                  sl_xuat: 1,
                  gia_ban_nt: item.gia_ban_le,
                  ma_dvt: item.ma_dvt,
                  tien_nt: item.gia_ban_le
                }, null, {
                  ma_vt: item.ma_vt,
                  ma_lo: item.ma_lo,
                  ma_tt1: item.ma_tt1,
                  ma_tt2: item.ma_tt2,
                  ma_tt3: item.ma_tt3,
                  han_sd: item.han_sd
                }, ['sl_xuat', 'tien_nt'])
                $uibModalInstance.close();
                callback();
              }

            }
          ],
          size: "md", //size:'lg',
          resolve: {
            parentScope: function() {
              return scope;
            }

          }
        });
      } else {
        data.details_doi = STP.add(data.details_doi, {
          ma_vt: item.ma_vt,
          ten_vt: item.ten_vt,
          sl_xuat: 1,
          gia_ban_nt: item.gia_ban_le,
          ma_dvt: item.ma_dvt,
          tien_nt: item.gia_ban_le
        }, null, {
          ma_vt: item.ma_vt
        }, ['sl_xuat', 'tien_nt'])
        callback();
      }
    }
  }
});
hd3Module.defaultValues = {
  vatvaos: []
}
hd3Module.defaultValues4Detail = {
  sl_nhap: 0,
  gia_von_nt: 0,
  gia_von: 0,
  gia_ban_nt: 0,
  gia_ban: 0,
  tien_nt: 0,
  tien: 0,
  tien_ck_nt: 0,
  tien_ck: 0,
  tien_nhap_nt: 0,
  tien_nhap: 0
}
hd3Module.defaultCondition4Search = {
  tu_ngay: new Date(),
  den_ngay: new Date(),
  so_ct: '',
  dien_giai: '',
  ma_kh: ''
};
hd3Module.prepareCondition4Search = function($scope, vcondition) {
  return {
    so_ct: {
      $regex: $scope.vcondition.so_ct,
      $options: 'i'
    },
    dien_giai: {
      $regex: $scope.vcondition.dien_giai,
      $options: 'i'
    },
    ma_kh: {
      $regex: $scope.vcondition.ma_kh,
      $options: 'i'
    },
    ngay_ct: {
      $gte: dateTime2Date($scope.vcondition.tu_ngay),
      $lte: dateTime2Date($scope.vcondition.den_ngay)
    }
  };
}

hd3Module.watchDetail = function(scope) {
  scope.$watch('dt_current.sl_nhap', function(newData) {
    if (newData != undefined && scope.status.isOpened) {
      scope.dt_current.tien_nt = STP.round(scope.dt_current.sl_nhap * scope.dt_current.gia_ban_nt, scope.round);
      scope.dt_current.tien_ck_nt = STP.round(scope.dt_current.tien_nt * scope.dt_current.ty_le_ck / 100, scope.round);

      scope.dt_current.tien = STP.round(scope.dt_current.tien_nt * scope.ngMasterData.ty_gia, scope.f_tien);
      scope.dt_current.tien_ck = STP.round(scope.dt_current.tien_ck_nt * scope.ngMasterData.ty_gia, scope.f_tien);

      scope.dt_current.tien_nhap_nt = STP.round(scope.dt_current.sl_nhap * scope.dt_current.gia_von_nt, scope.round);
      scope.dt_current.tien_nhap = STP.round(scope.dt_current.sl_nhap * scope.dt_current.gia_von_nt, scope.f_tien);
    }
  });
  scope.$watch('dt_current.gia_ban_nt', function(newData) {
    if (newData != undefined && scope.status.isOpened) {
      scope.dt_current.gia_ban = STP.round(scope.dt_current.gia_ban_nt * scope.ngMasterData.ty_gia, scope.f_tien);
      scope.dt_current.tien_nt = STP.round(scope.dt_current.sl_nhap * scope.dt_current.gia_ban_nt, scope.round);
      scope.dt_current.tien = STP.round(scope.dt_current.tien_nt * scope.ngMasterData.ty_gia, scope.f_tien);

      scope.dt_current.tien_ck_nt = STP.round(scope.dt_current.tien_nt * scope.dt_current.ty_le_ck / 100, scope.round);
      scope.dt_current.tien_ck = STP.round(scope.dt_current.tien_ck_nt * scope.ngMasterData.ty_gia, scope.f_tien);

    }
  });
  scope.$watch('dt_current.gia_ban', function(newData) {
    if (newData != undefined && scope.status.isOpened) {
      scope.dt_current.tien = STP.round(scope.dt_current.sl_nhap * scope.dt_current.gia_ban, scope.f_tien);
    }
  });

  scope.$watch('dt_current.gia_von_nt', function(newData) {
    if (newData != undefined && scope.status.isOpened) {
      scope.dt_current.gia_von = STP.round(scope.dt_current.gia_von_nt, 0);
      scope.dt_current.tien_nhap_nt = STP.round(scope.dt_current.sl_nhap * scope.dt_current.gia_von_nt, scope.round);;
      scope.dt_current.tien_nhap = STP.round(scope.dt_current.sl_nhap * scope.dt_current.gia_von_nt, scope.f_tien);
    }
  });
  scope.$watch('dt_current.tien_nhap_nt', function(newData) {
    if (newData != undefined && scope.status.isOpened) {
      scope.dt_current.tien_nhap = STP.round(scope.dt_current.tien_nhap_nt * scope.ngMasterData.ty_gia, scope.f_tien);
    }
  });

  scope.$watch('dt_current.tien_nt', function(newData) {
    if (newData != undefined && scope.status.isOpened) {
      scope.dt_current.tien = STP.round(scope.dt_current.tien_nt * scope.ngMasterData.ty_gia, scope.f_tien);

      scope.dt_current.tien_ck_nt = STP.round(scope.dt_current.tien_nt * scope.dt_current.ty_le_ck / 100, scope.round);
      scope.dt_current.tien_ck = STP.round(scope.dt_current.tien_ck_nt * scope.ngMasterData.ty_gia, scope.f_tien);

    }
  });
  scope.$watch('dt_current.tien', function(newData) {
    if (newData != undefined && scope.status.isOpened) {
      scope.dt_current.tien_ck = STP.round(scope.dt_current.tien * scope.dt_current.ty_le_ck / 100, scope.f_tien);
    }
  });

  scope.$watch('dt_current.ty_le_ck', function(newData) {
    if (newData != undefined && scope.status.isOpened) {
      scope.dt_current.tien_ck_nt = STP.round(scope.dt_current.tien_nt * scope.dt_current.ty_le_ck / 100, scope.round);
      scope.dt_current.tien_ck = STP.round(scope.dt_current.tien_ck_nt * scope.ngMasterData.ty_gia, scope.f_tien);
    }
  });

  scope.$watch('dt_current.tien_ck_nt', function(newData) {
    if (newData != undefined && scope.status.isOpened) {
      scope.dt_current.tien_ck = STP.round(scope.dt_current.tien_ck_nt * scope.ngMasterData.ty_gia, scope.f_tien);
    }
  });
  scope.getInvoice = function() {
    var modalInstance = scope.$uibModal.open({
      templateUrl: "templates/vouchers/hd3/templates/form-select-invoice.html",
      controller: [
        '$scope',
        '$uibModalInstance',
        'parentScope',
        '$filter',
        '$rootScope',
        function($scope, $uibModalInstance, parentScope, $filter, $rootScope) {
          $scope.STP = STP;
          $scope.condition = {
            tu_ngay: new Date(moment().format('YYYY-MM-01')),
            den_ngay: new Date()
          };
          $scope.ngData = parentScope.ngData;
          $scope.dt_current = parentScope.dt_current;
          $scope.ngMasterData = parentScope.ngMasterData;
          $scope.condition.ma_kh = $scope.ngMasterData.ma_kh;
          $scope.condition.ten_kh = $scope.ngMasterData.ten_kh;

          $scope.masters = [];
          $scope.details = [];
          $scope.selectAllDetail = function(m, v) {
            m.details.forEach(function(d) {
              d.sel = m.sel;
            });
          }

          //$scope.innerWindow = window.innerWindow;
          $scope.invoiceClick = function(_id) {
            $scope.details = [];
            var master = _.find($scope.masters, function(m) {
              return m._id == _id;
            });
            $scope.details = master.details;
          }
          $scope.loadInvoice = function() {
            $scope.masters = [];
            $scope.details = [];
            var url = server_url_report + "/api/" + id_app + "/getinvoice2return?t=1";
            if ($scope.condition.ma_kh) {
              url = url + "&ma_kh=" + $scope.condition.ma_kh
            }
            if ($scope.ngMasterData._id) {
              url = url + "&id_ct=" + $scope.ngMasterData._id
            }
            url = url + "&tu_ngay=" + $filter('date')($scope.condition.tu_ngay, 'yyyy-MM-dd');
            url = url + "&den_ngay=" + $filter('date')($scope.condition.den_ngay, 'yyyy-MM-dd');
            if ($scope.condition.so_ct) {
              url = url + "&so_ct=" + $scope.condition.so_ct;
            }
            if ($scope.condition.so_hd) {
              url = url + "&so_hd=" + $scope.condition.so_hd;
            }
            scope.$http.get(url).then(function(res) {
              $scope.masters = res.data;
            }, function(res) {
              $scope.masters = [];
              if (res.data)
                $rootScope.alert(res.data);
              }
            );
          }
          $scope.ok = function() {
            if($scope.condition.ma_kh){
              parentScope.ngMasterData.ma_kh = $scope.condition.ma_kh;
              parentScope.ngMasterData.ten_kh = $scope.condition.ten_kh;
            }
            parentScope.ngMasterData.details = [];
            var line = 0;
            $scope.masters.forEach(function(m) {
              if (m.sel) {
                m.details.forEach(function(d) {
                  if (d.sel) {
                    d.line = line;
                    parentScope.ngMasterData.details.push(d);
                    line++;
                  }
                });
              }
            });
            $uibModalInstance.close();

          };
          $scope.cancel = function() {
            $uibModalInstance.close();
          };
        }
      ],
      size: "lg",
      resolve: {
        parentScope: function() {
          return scope;
        }
      }
    });
  }

}
hd3Module.watchMaster = function(scope) {
  scope.$watch('data.ty_gia', function(newData) {
    if (scope.data) {
      if (newData != undefined && scope.isDataLoaded) {
        angular.forEach(scope.data.details, function(r) {
          r.tien = STP.round(r.tien_nt * newData, scope.f_tien);
          r.tien_ck = STP.round(r.tien_ck_nt * newData, scope.f_tien);

          r.tien_nhap = STP.round(r.tien_nhap_nt * newData, scope.f_tien);
        });
        angular.forEach(scope.data.vatvaos, function(r) {
          r.t_tien = STP.round(r.t_tien_nt * newData, scope.f_tien);
          r.t_thue = STP.round(r.t_thue_nt * newData, scope.f_tien);

        });

      }
    }
  });

}
