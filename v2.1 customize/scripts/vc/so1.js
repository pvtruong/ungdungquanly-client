var so1Module = new baseVoucher('so1', 'so1', [], 'Đơn đặt hàng', {
  onInput: function($scope, $options) {
    STPModules['trangthai'].obj.getService($options.$http, $options.$q, $options.$rootScope).load(id_app, {
      filter: {
        ma_ct: 'SO1'
      }
    }).then(function(res) {
      $scope.ds_trang_thai = res.data;
    })
    $scope.select = function(item) {
      var nrow = {};
      var f = _.filter($scope.data.details, function(i) {
        return i.ma_vt === item.ma_vt && i.ma_lo === item.ma_lo && i.han_sd === item.han_sd && i.ma_tt1 == item.ma_tt1 && i.ma_tt2 == item.ma_tt2 && i.ma_tt3 == item.ma_tt3;
      })
      if (f.length > 0) {
        nrow = f[0];
        nrow.sl_xuat += 1;
      } else {
        nrow = {
          ma_vt: item.ma_vt,
          ten_vt: item.ten_vt,
          ma_dvt: item.ma_dvt,
          tk_vt: item.tk_vt,
          ma_lo: item.ma_lo,
          han_sd: item.han_sd,
          ma_tt1: item.ma_tt1,
          ma_tt2: item.ma_tt2,
          ma_tt3: item.ma_tt3
        }

        if (pblModule.defaultValues4Detail) {
          _.extend(nrow, pblModule.defaultValues4Detail);
        }
        if ($scope.data.options) {
          for (var key in $scope.data.options) {
            if ($scope.data.options[key])
              nrow[key] = $scope.data.options[key];
            }

        }
        nrow.sl_xuat = 1;
        nrow.gia_ban_nt = item.gia_ban_le;
        nrow.gia_ban = item.gia_ban_le;
        nrow.line = $scope.data.details.length;
        $scope.data.details.push(nrow);
      }
      //tien hang
      nrow.tien_hang_nt = STP.round(nrow.sl_xuat * nrow.gia_ban_nt, $scope.f_tien_nt);
      nrow.tien_hang = nrow.tien_hang_nt;
      //chiet khau
      if (item.tien_ck) {
        nrow.tien_ck_nt = STP.round(nrow.sl_xuat * item.tien_ck, $scope.f_tien_nt);
        nrow.tien_ck = STP.round(nrow.sl_xuat * item.tien_ck, $scope.f_tien);
      } else {
        if (item.ty_le_ck) {
          nrow.tien_ck_nt = STP.round(nrow.tien_hang_nt * item.ty_le_ck / 100, $scope.f_tien_nt);
          nrow.tien_ck = nrow.tien_ck_nt;
        } else {
          nrow.tien_ck_nt = 0;
          nrow.tien_ck = 0;
        }
      }
      //tong tien
      nrow.tien_nt = nrow.tien_hang_nt - nrow.tien_ck_nt;
      nrow.tien = nrow.tien_hang - nrow.tien_ck;
      nrow.tien_xuat = 0;
      //$options.$rootScope.toast("Đã thêm sản phẩm " + nrow.ten_vt);
    }
  }
});
so1Module.defaultValues = {
  ty_le_ck_hd: 0,
  tien_ck_hd: 0
}
so1Module.defaultValues4Detail = {
  sl_xuat: 0,
  ty_le_ck: 0,
  gia_ban_nt: 0,
  gia_ban: 0,
  tien_nt: 0,
  tien: 0,
  tien_ck_nt: 0,
  tien_ck: 0,
  tien_xuat_nt: 0,
  tien_xuat: 0,
  gia_von_nt: 0,
  gia_von: 0,
  px_gia_dd: false
}
so1Module.defaultCondition4Search = {
  tu_ngay: new Date(),
  den_ngay: new Date(),
  so_ct: '',
  dien_giai: '',
  ma_kh: '',
  trang_thai: ''
};
so1Module.prepareCondition4Search = function($scope, vcondition) {
  var c = {
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
  
  if($scope.vcondition.ma_vt){
    c.details = {$elemMatch:{ma_vt:$scope.vcondition.ma_vt}};
  }
  return c;
}

so1Module.watchDetail = function(scope) {
  scope.$watch('dt_current.sl_xuat', function(newData) {
    if (newData != undefined && scope.status.isOpened) {
      scope.dt_current.tien_xuat_nt = STP.round(scope.dt_current.sl_xuat * scope.dt_current.gia_von_nt, scope.round);
      scope.dt_current.tien_hang_nt = STP.round(scope.dt_current.sl_xuat * scope.dt_current.gia_ban_nt, scope.round);
      scope.dt_current.tien_xuat = scope.dt_current.tien_xuat_nt;
    }
  });
  scope.$watch('dt_current.gia_ban_nt', function(newData) {
    if (newData != undefined && scope.status.isOpened) {
      scope.dt_current.tien_hang_nt = STP.round(scope.dt_current.sl_xuat * scope.dt_current.gia_ban_nt, scope.round);
    }
  });
  scope.$watch('dt_current.gia_ban', function(newData) {
    if (newData != undefined && scope.status.isOpened) {
      scope.dt_current.tien_hang = STP.round(scope.dt_current.gia_ban * scope.dt_current.sl_xuat, scope.f_tien);
    }
  });
  scope.$watch('dt_current.tien_hang_nt', function(newData) {
    if (newData != undefined && scope.status.isOpened) {
      scope.dt_current.tien_ck_nt = STP.round(scope.dt_current.tien_hang_nt * scope.dt_current.ty_le_ck / 100, scope.round);
      scope.dt_current.tien_nt = scope.dt_current.tien_hang_nt - scope.dt_current.tien_ck_nt
      scope.dt_current.tien_hang = STP.round(scope.dt_current.tien_hang_nt * scope.ngMasterData.ty_gia, scope.f_tien);
    }
  });
  scope.$watch('dt_current.tien_hang', function(newData) {
    if (newData != undefined && scope.status.isOpened) {
      scope.dt_current.tien_ck = STP.round(scope.dt_current.tien_hang * scope.dt_current.ty_le_ck / 100, scope.f_tien);
      scope.dt_current.tien = scope.dt_current.tien_hang - scope.dt_current.tien_ck
    }
  });

  scope.$watch('dt_current.gia_von_nt', function(newData) {
    if (newData != undefined && scope.status.isOpened) {
      scope.dt_current.gia_von = scope.dt_current.gia_von_nt;
      scope.dt_current.tien_xuat_nt = STP.round(scope.dt_current.sl_xuat * scope.dt_current.gia_von_nt, scope.round);
      scope.dt_current.tien_xuat = scope.dt_current.tien_xuat_nt;
    }
  });

  scope.$watch('dt_current.ty_le_ck', function(newData) {
    if (newData != undefined && scope.status.isOpened) {
      scope.dt_current.tien_ck_nt = STP.round(scope.dt_current.tien_hang_nt * scope.dt_current.ty_le_ck / 100, scope.round);

    }
  });

  scope.$watch('dt_current.tien_ck_nt', function(newData) {
    if (newData != undefined && scope.status.isOpened) {
      scope.dt_current.tien_ck = STP.round(scope.dt_current.tien_ck_nt * scope.ngMasterData.ty_gia, scope.f_tien);
      scope.dt_current.tien_nt = scope.dt_current.tien_hang_nt - scope.dt_current.tien_ck_nt
    }
  });
  scope.$watch('dt_current.tien_ck', function(newData) {
    if (newData != undefined && scope.status.isOpened) {
      scope.dt_current.tien = scope.dt_current.tien_hang - scope.dt_current.tien_ck
    }
  });
}
so1Module.watchMaster = function(scope) {
  scope.$watch('data.ty_gia', function(newData) {
    if (scope.data) {
      if (newData != undefined && scope.isDataLoaded) {
        angular.forEach(scope.data.details, function(r) {
          r.tien_hang = STP.round(r.tien_hang_nt * newData, scope.f_tien);
          r.tien_ck = STP.round(r.tien_ck_nt * newData, scope.f_tien);
          r.tien_xuat = r.tien_xuat_nt;

        });
        scope.data.t_thue = STP.round(scope.data.t_thue_nt * newData, scope.f_tien)
      }
    }
  });
  scope.$watch('data.ty_le_ck_hd', function(newData) {
    if (scope.data) {
      if (newData != undefined && scope.isDataLoaded) {
        scope.data.tien_ck_hd = STP.round((scope.data.t_tien_hang_nt - scope.data.t_ck_nt) * scope.data.ty_le_ck_hd / 100, scope.f_tien);
      }
    }
  });
  scope.$watch('data.t_tien_hang_nt', function(newData) {
    if (scope.data) {
      if (newData != undefined && scope.isDataLoaded) {
        scope.data.tien_ck_hd = STP.round((scope.data.t_tien_hang_nt - scope.data.t_ck_nt) * scope.data.ty_le_ck_hd / 100, scope.f_tien);
      }
    }
  });

}
so1Module.module.directive("saleOrder", function() {
  return {
    restrict: 'E',
    scope: {
      condition: '=?',
      run: '=?',
      trangThai: '=?'
    },
    templateUrl: "templates/vouchers/so1/templates/db.html",
    controller: [
      '$scope',
      'so1',
      '$rootScope',
      '$interval',
      '$location',
      'appInfo',
      '$http',
      '$uibModal',
      function($scope, so1, $rootScope, $interval, $location, appInfo, $http, $uibModal) {
        initLabel($rootScope, $scope, appInfo, 'SO1', $http);
        appInfo.info("so1", function(error, uerinfo, appinfo) {
          if (error) {
            return;
          }
          $scope.now = new Date();
          $scope.app_info = $rootScope.app_info;
          $scope.editOrder = function(item) {
            so1Module.quickedit($uibModal, item, function(new_item) {
              _.extend(item, new_item);
            })
          }
          $scope.add = function() {
            var defaultValues = {};
            _.extend(defaultValues, $scope.condition);

            so1Module.quickadd($uibModal, function(newItem) {
              $scope.orders.push(newItem);
            }, defaultValues)
          }
          var c_c;
          $scope.filter = function(c) {
            if (c)
              c_c = c;
            var condition = {};
            _.extend(condition, $scope.condition);

            if ($scope.trangThai) {
              condition.trang_thai = $scope.trangThai;
            }

            console.log("filter", condition);
            $rootScope.nextTick(function() {
              if (c_c) {
                _.extend(condition, c_c);
              }
              delete condition.ten_kh;
              so1.load(id_app, {
                condition: condition,
                limit: 10
              }).then(function(res) {
                $scope.orders = res.data;
              })
            })

          }
          $scope.$watch('run', function(n, o) {
            if (n && !_.isEqual(n, 0)) {
              $scope.filter();
            }
          })

          if ($scope.intv) {
            $interval.cancel($scope.intv);
            $scope.intv = undefined;
          }
          $scope.intv = $interval($scope.filter, 1000 * 5 * 60);
        });

      }
    ],
    link: function($scope, elem, attrs, controller) {}
  }
});
