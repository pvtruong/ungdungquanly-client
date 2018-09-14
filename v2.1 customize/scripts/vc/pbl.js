var pblModule = new baseVoucher('pbl', 'pbl', [], 'Phiếu bán lẻ', {
  onLoading: function($scope, $options) {
    $scope.tinhtienhang = function(r,data) {
      if (!data.ty_gia) data.ty_gia = 1;
      var f_gia = (data.ma_nt=='VND'?$options.$rootScope.app_info.options.f_gia:$options.$rootScope.app_info.options.f_gia_nt);
      var f_tien_nt =(data.ma_nt=='VND'?$options.$rootScope.app_info.options.f_tien:$options.$rootScope.app_info.options.f_tien_nt);
      var f_tien = $options.$rootScope.app_info.options.f_tien;

      var round = f_tien_nt;

      //tien hang
      r.tien_hang_nt = STP.round(r.sl_xuat * r.gia_ban_nt, round);
      r.tien_hang = STP.round(r.tien_hang_nt * data.ty_gia, f_tien);
      //chiet khau

      r.tien_ck_nt = STP.round(r.tien_hang_nt * r.ty_le_ck / 100, round);
      r.tien_ck = STP.round(r.tien_ck_nt * data.ty_gia, f_tien);
      //thanh tien
      r.tien_nt = r.tien_hang - r.tien_ck;
      r.tien = STP.round(r.tien_nt * data.ty_gia, f_tien);
      //tien von
      r.tien_xuat_nt = STP.round(r.sl_xuat * (
        r.gia_von
        ? r.gia_von
        : 0), f_tien);
      r.tien_xuat = r.tien_xuat_nt;
    }
    $scope.giaoca = function() {
      var data = {
        ma_kho: $options.config.ma_kho,
        ma_ca: $options.config.ma_ca,
        tu_ngay: moment().startOf("date").toDate(),
        den_ngay: moment().endOf("date").toDate(),
        nhan_vien: $scope.current_user.email
      };
      giaocaModule.quickadd($options.$uibModal, function(rs) {
        delete $options.config.ma_ca
      }, data)
    }
    $scope.thanhtoan = function(data){
      var modalInstance = $options.$uibModal.open({
        templateUrl: "templates/vouchers/pbl/templates/dialog-beforsave.html",
        controller: [
          '$scope',
          '$controller',
          '$http',
          'mailschedule',
          '$location',
          'mailscheduleConfig',
          '$uibModalInstance',
          '$window',
          '$routeParams',
          '$timeout',
          '$rootScope','pbl','parentScope',
          function($scope, $controller, $http, service, $location, config, $uibModalInstance, $window, $routeParams, $timeout, $rootScope,pbl,parentScope) {
            $scope.data = data;
            $scope.data.tien_thu = $scope.data.t_tt;
            $scope.data.con_no = 0;
            $scope.save = function() {
              //next(null, data);
              data.trang_thai = 2;
              pbl.update(id_app,data._id,data).then(function(res){
                _.extend(data,res.data);
                $uibModalInstance.close();
                if(parentScope.printRpt){
                  parentScope.printRpt('',data);
                }

              },function(error){
                $rootScope.alert(error.data||"Không kết nối được với máy chủ");
              })
            }
            $scope.cancel = function() {
              $uibModalInstance.close();
            }
            $scope.$watch("data.tien_thu", function(n, o) {
              if (n) {
                $scope.data.con_no = $scope.data.t_tt - $scope.data.tien_thu;
              }
            });

          }
        ],
        size: "sm",
        backdrop: 'static',
        resolve: {
          parentScope: function() {
            return $scope;
          }
        }
      });
    }
    $scope.traLai = function(pbl){
      var data = JSON.parse(JSON.stringify(pbl));
      data.details.forEach(function(d){
        d.id_hd =data._id;
        d.sl_nhap = d.sl_xuat;
        delete d.sl_xuat;
        d.tien_nhap_nt = d.tien_xuat_nt;
        d.tien_nhap = d.tien_xuat;
        delete d.tien_xuat_nt;
        delete d.tien_xuat;
      })
      data.id_pbl = data._id;
      delete data._id;
      delete data.ma_ct;
      delete data.ngay_ct;
      delete data.so_ct;
      delete data.trang_thai;
      hd7Module.quickadd($options.$uibModal, function(rs) {
        $options.service.get(id_app,pbl._id).then(function(res){
          _.extend(pbl,res.data);
        })
      }, data)
    }
  },
  onAdd: function($scope, $options) {
    var data = $scope.data;
    if (data.ma_kho && data.ma_ca)
      return;
    if (!$options.config.ma_ca || !$options.config.ma_kho) {
      var modalInstance = $options.$uibModal.open({
        templateUrl: "templates/vouchers/pbl/templates/ca-selector.html",
        controller: [
          '$scope',
          '$controller',
          '$http',
          '$uibModalInstance',
          '$routeParams',
          '$rootScope',
          function($scope, $controller, $http, $uibModalInstance, $routeParams, $rootScope) {
            $scope.data = data;
            $scope.cancel = function() {
              $options.config.ma_kho = data.ma_kho;
              $options.config.ma_ca = data.ma_ca;
              $uibModalInstance.close();
            }

          }
        ],
        size: "sm",
        backdrop: 'static',
        resolve: {
          parentScope: function() {
            return $scope;
          }
        }
      });
    } else {
      data.ma_kho = $options.config.ma_kho;
      data.ma_ca = $options.config.ma_ca;
    }
  },
  onInput: function($scope, $options) {
    $options.$controller("calcTime", {$scope: $scope});
    $scope.tinhtienhang = function(r) {
      if (!$scope.data.ty_gia)
        $scope.data.ty_gia = 1;

      var round = $scope.f_tien_nt;

      //tien hang
      r.tien_hang_nt = STP.round(r.sl_xuat * r.gia_ban_nt, round);
      r.tien_hang = STP.round(r.tien_hang_nt * $scope.data.ty_gia, $scope.f_tien);
      //chiet khau

      r.tien_ck_nt = STP.round(r.tien_hang_nt * r.ty_le_ck / 100, round);
      r.tien_ck = STP.round(r.tien_ck_nt * $scope.data.ty_gia, $scope.f_tien);
      //thanh tien
      r.tien_nt = r.tien_hang - r.tien_ck;
      r.tien = STP.round(r.tien_nt * $scope.data.ty_gia, $scope.f_tien);
      //tien von
      r.tien_xuat_nt = STP.round(r.sl_xuat * (
        r.gia_von
        ? r.gia_von
        : 0), $scope.f_tien);
      r.tien_xuat = r.tien_xuat_nt;

      pblModule.tinhCkvt($options.$http,$scope.data,r);
    }
    $scope.updateRows = function() {
      $scope.data.details.forEach(function(item) {
        $scope.select(item, item.sl_xuat)
      })
    }
    $scope.select = function(item, up) {
      var ty_le_ck,
        tien_ck,
        tu,
        sl_xuat = 0;
      if ($scope.data.ty_gia === 0)
        $scope.data.ty_gia = 1;

      //
      $scope.dt_current = {};
      var f = _.filter($scope.data.details, function(i) {
        return i.ma_vt == item.ma_vt && (i.ma_lo == item.ma_lo || (!i.ma_lo && !item.ma_lo)) && (i.han_sd == item.han_sd || (!i.han_sd && !item.han_sd)) && (i.ma_tt1 == item.ma_tt1 || (!i.ma_tt1 && !item.ma_tt1)) && (i.ma_tt2 == item.ma_tt2 || (!i.ma_tt2 && !item.ma_tt2)) && (i.ma_tt3 == item.ma_tt3 || (!i.ma_tt3 && !item.ma_tt3));
      })
      if (f.length > 0) {

        $scope.dt_current = f[0];
        $scope.dt_current.sl_xuat = (up !== undefined && up !== null)
          ? up
          : $scope.dt_current.sl_xuat + 1;
        if (!$scope.dt_current.cs_ck1)
          $scope.dt_current.cs_ck1 = {
            ty_le_ck: 0,
            tien_ck: 0
          };
      } else {

        $scope.dt_current = {
          ma_vt: item.ma_vt,
          ten_vt: item.ten_vt,
          ma_dvt: item.ma_dvt,
          tk_vt: item.tk_vt,
          tk_dt: item.tk_dt,
          tk_gv: item.tk_gv,
          tk_ck: item.tk_ck,
          ma_lo: item.ma_lo,
          han_sd: item.han_sd,
          ma_tt1: item.ma_tt1,
          ma_tt2: item.ma_tt2,
          ma_tt3: item.ma_tt3
        }
        if (pblModule.defaultValues4Detail) {
          _.extend($scope.dt_current, pblModule.defaultValues4Detail);
        }
        if ($scope.data.options) {
          for (var key in $scope.data.options) {
            if ($scope.data.options[key]) {
              $scope.dt_current[key] = $scope.data.options[key];
            }
          }
        }
        $scope.dt_current.sl_xuat = (up !== undefined && up !== null)
          ? up
          : 1;
        $scope.dt_current.gia_ban_nt = item.gia_ban_nt || item.gia_ban_le;
        $scope.dt_current.gia_ban = STP.round($scope.dt_current.gia_ban_nt * $scope.data.ty_gia, $scope.f_gia);

        $scope.dt_current.gia_von_nt = item.gia_von_nt || item.gia_mua;
        $scope.dt_current.gia_von = STP.round($scope.dt_current.gia_von_nt, $scope.f_gia);

        $scope.dt_current.line = $scope.data.details.length;

        if (up !== 0)
          $scope.data.details.push($scope.dt_current);

        $scope.dt_current.cs_ck1 = item.cs_ck1 || {
          ty_le_ck: item.ty_le_ck,
          tien_ck: item.tien_ck
        };
        $scope.dt_current.cs_ck2 = item.cs_ck2 || item.ck_sl_tu2;
        $scope.dt_current.cs_km = item.cs_km || item.promotion;
      }
      //caculate discount rate
      ty_le_ck = $scope.dt_current.cs_ck1.ty_le_ck
      tien_ck = $scope.dt_current.cs_ck1.tien_ck
      $scope.data.details.forEach(function(r) {
        if (r.ma_vt === $scope.dt_current.ma_vt) {
          sl_xuat = r.sl_xuat + sl_xuat;
        }
      })

      if ($scope.dt_current.cs_ck2 && $scope.dt_current.cs_ck2.length > 0) {
        //find discount by kh
        tu = _.filter($scope.dt_current.cs_ck2, function(s) {
          return s.sl_tu <= sl_xuat && (!s.sl_den || s.sl_den >= sl_xuat) && (s.ma_kh === $scope.data.ma_kh || s.nh_kh === $scope.data.nh_kh);
        });
        //find discount genaral
        if (tu.length == 0) {
          tu = _.filter($scope.dt_current.cs_ck2, function(s) {
            return s.sl_tu <= sl_xuat && (!s.sl_den || s.sl_den >= sl_xuat) && (!s.ma_kh && !s.nh_kh);
          });
        }
        //acepted
        if (tu.length > 0) {
          tu = _.sortBy(tu, function(r) {
            return -r.sl_tu;
          })
          ty_le_ck = tu[0].ty_le_ck;
          tien_ck = tu[0].tien_ck;
        }
      }
      if (!ty_le_ck && $scope.dt_current.gia_ban)
        ty_le_ck = STP.round(tien_ck / $scope.dt_current.gia_ban, 2) * 100;

      //calc discount money--------------
      $scope.data.details.forEach(function(r) {
        if (r.ma_vt === $scope.dt_current.ma_vt) {
          r.ty_le_ck = ty_le_ck;
          $scope.tinhtienhang(r)
        }
      })
      //promotions
      if ($scope.dt_current.cs_km) {
        //by customer
        tu = _.filter($scope.dt_current.cs_km, function(s) {
          return (s.ma_vt || s.ma_nvt) && s.sl_tu <= sl_xuat && (!s.sl_den || s.sl_den >= sl_xuat) && (s.ma_kh && s.ma_kh === $scope.data.ma_kh);
        });
        if (tu.length == 0) {
          tu = _.filter($scope.dt_current.cs_km, function(s) {
            return (s.ma_vt || s.ma_nvt) && s.sl_tu <= sl_xuat && (!s.sl_den || s.sl_den >= sl_xuat) && (s.nh_kh && s.nh_kh === $scope.data.nh_kh);
          });
        }
        //by genaral
        if (tu.length == 0) {
          tu = _.filter($scope.dt_current.cs_km, function(s) {
            return (s.ma_vt || s.ma_nvt) && s.sl_tu <= sl_xuat && (!s.sl_den || s.sl_den >= sl_xuat) && (!s.ma_kh && !s.nh_kh);
          });
        }
        if (tu.length > 0) {
          tu = _.sortBy(tu, function(t) {
            return -t.sl_tu;
          });

          $scope.data.details.forEach(function(r) {
            if (r.ma_vt === $scope.dt_current.ma_vt) {
              r.promotion = [];
            }
          })
          $scope.dt_current.promotion = JSON.parse(JSON.stringify(tu[0]));
          if ($scope.dt_current.promotion.sl_tu && !$scope.dt_current.promotion.sl_den && $scope.dt_current.promotion.details_km) {
            var n = (sl_xuat - sl_xuat % $scope.dt_current.promotion.sl_tu) / $scope.dt_current.promotion.sl_tu;
            if (n > 1) {
              $scope.dt_current.promotion.details_km.forEach(function(km) {
                km.sl_km = n * km.sl_km;
              })
            }
          }
        } else {
          $scope.dt_current.promotion = {};
        }
      }
      //if(up==undefined || up == null)
      //$options.$rootScope.toast("Đã thêm sản phẩm " + $scope.dt_current.ten_vt);

    }
  },
  onSave: function($scope, data, options, next) {
    if (data.trang_thai == 2) {
      var modalInstance = options.$uibModal.open({
        templateUrl: "templates/vouchers/pbl/templates/dialog-beforsave.html",
        controller: [
          '$scope',
          '$controller',
          '$http',
          'mailschedule',
          '$location',
          'mailscheduleConfig',
          '$uibModalInstance',
          '$window',
          '$routeParams',
          '$timeout',
          '$rootScope',
          function($scope, $controller, $http, service, $location, config, $uibModalInstance, $window, $routeParams, $timeout, $rootScope) {
            $scope.data = data;
            $scope.data.tien_thu = $scope.data.t_tt;
            $scope.data.con_no = 0;

            $scope.save = function() {
              next(null, data);
              $uibModalInstance.close();
            }
            $scope.cancel = function() {
              $uibModalInstance.close();
            }
            $scope.$watch("data.tien_thu", function(n, o) {
              if (n) {
                $scope.data.con_no = $scope.data.t_tt - $scope.data.tien_thu;
              }
            });

          }
        ],
        size: "sm",
        backdrop: 'static',
        resolve: {
          parentScope: function() {
            return $scope;
          }
        }
      });
    } else {
      next(null, data);
    }
  }
});
pblModule.module.controller("calcTime", [
  "$scope",
  "$interval",
  function($scope, $interval) {
    var den_ngay = $interval(function() {
      if ($scope.data && $scope.data.trang_thai === 1) {
        $scope.data.den_ngay = new Date();
      }
    }, 1000);
    $scope.$on("$destroy", function() {
      $interval.cancel(den_ngay);
      den_ngay = undefined;
    });
  }
])
pblModule.defaultValues = {
  ty_le_ck_hd: 0,
  tien_ck_hd: 0,
  trang_thai: '2',
  tu_ngay: new Date(),
  den_ngay: new Date()
}
pblModule.defaultValues4Detail = {
  sl_xuat: 0,
  ty_le_ck: 0,
  gia_von_nt: 0,
  gia_von: 0,
  gia_ban_nt: 0,
  gia_ban: 0,
  tien_nt: 0,
  tien: 0,
  tien_ck_nt: 0,
  tien_ck: 0,
  px_gia_dd: false,
  tien_xuat_nt: 0,
  tien_xuat: 0
}
pblModule.defaultCondition4Search = {
  tu_ngay: new Date(),
  den_ngay: new Date(),
  so_ct: '',
  dien_giai: '',
  ma_kh: '',
  ma_kho:''
};
pblModule.prepareCondition4Search = function($scope, vcondition) {
  var _c =  {
    so_ct: {
      $regex: $scope.vcondition.so_ct,
      $options: 'i'
    },
    dien_giai: {
      $regex: $scope.vcondition.dien_giai,
      $options: 'i'
    },
    ngay_ct: {
      $gte: dateTime2Date($scope.vcondition.tu_ngay),
      $lte: dateTime2Date($scope.vcondition.den_ngay)
    }
  };
  if($scope.vcondition.ma_kho){
    _c.ma_kho = $scope.vcondition.ma_kho;
  }
  if($scope.vcondition.ma_kh){
    _c.ma_kh = $scope.vcondition.ma_kh;
  }
  if($scope.vcondition.ma_vt){
    _c.details = {$elemMatch:{ma_vt:$scope.vcondition.ma_vt}};
  }
  return _c;

}

pblModule.watchDetail = function(scope) {
  scope.$watch('dt_current.sl_xuat', function(newData) {
    if (newData != undefined && scope.status.isOpened) {
      scope.dt_current.tien_xuat_nt = STP.round(scope.dt_current.sl_xuat * scope.dt_current.gia_von_nt, scope.round);
      scope.dt_current.tien_hang_nt = STP.round(scope.dt_current.sl_xuat * scope.dt_current.gia_ban_nt, scope.round);
      scope.dt_current.tien_xuat = scope.dt_current.tien_xuat_nt;
      //--

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
pblModule.watchMaster = function(scope) {
  scope.$watch('data.ty_gia', function(newData) {
    if (scope.data) {
      if (newData != undefined && scope.isDataLoaded) {
        angular.forEach(scope.data.details, function(r) {
          r.tien_hang = STP.round(r.tien_hang_nt * newData, scope.f_tien);
          r.tien_ck = STP.round(r.tien_ck_nt * newData, scope.f_tien);
          r.tien_xuat = r.tien_xuat_nt;
        });

      }
    }
  });
  scope.$watch('data.den_ngay', function(newData) {
    if (scope.data) {
      if (newData != undefined && scope.isDataLoaded) {
        scope.data.ngay_ct = scope.data.den_ngay;
      }
    }
  });
}
pblModule.module.directive("dbPbl", function() {
  return {
    restrict: 'E',
    scope: {},
    templateUrl: "templates/vouchers/pbl/templates/db.html",
    controller: [
      '$scope',
      'pbl',
      '$rootScope',
      '$location',
      'appInfo',
      'socket',
      'nodeWebkit',
      '$http',
      '$uibModal',
      function($scope, pbl, $rootScope, $location, appInfo, socket, nodeWebkit, $http, $uibModal) {
        initLabel($rootScope, $scope, appInfo, 'pbl', $http);
        appInfo.info("pbl", function(e, u, app_info) {
          if (e)
            return;
          $scope.token = $rootScope.token;
          $scope.server_url = server_url;
          $scope.now = new Date();
          $scope.app_info = $rootScope.app_info;
          $scope.dssanpham = [];

          var getdsanpham = function(t) {
            $scope.dssanpham = _.reject($scope.dssanpham, function(sp) {
              return sp.m_id === t._id;
            });
            if (t.trang_thai == 0 || t.trang_thai == 1) {
              t.details.forEach(function(p) {
                for (var k in t) {
                  if (k !== "details" && k !== "_id") {
                    p[k] = t[k];
                  }
                }
                if (p.picture) {
                  var sp = p.picture.split('.');
                  p.m_id = t._id;
                  p.picture_thumb = p.picture + '.thumb.' + sp[sp.length - 1]

                } else {
                  p.picture_thumb = '/getfile/others/noimage.png'

                }

                $scope.dssanpham.push(p);

              });
            }

          }
          var condition = {
            trang_thai: {
              $in: [0, 1]
            }
          };
          $scope.refresh = function() {
            $scope.pbls = {};
            $scope.dssanpham = [];

            pbl.load(id_app, {condition: condition}).then(function(res) {
              res.data.forEach(function(t) {
                $scope.pbls[t._id] = t;
                getdsanpham(t);
              });
            }, function(res) {
              if (res.data) {
                console.log("error load don hang", res.data);
              }
            })
          }
          $scope.complete = function(sanpham) {
            sanpham.sl_ht = sanpham.sl_xuat;
            var t = $scope.pbls[sanpham.m_id];
            if (t) {
              t.not_update = true;
              t.details.forEach(function(p) {
                if (p.line == sanpham.line && p.ma_vt == sanpham.ma_vt) {
                  p.sl_ht = p.sl_xuat;
                }
              })
              pbl.update(id_app, t._id, t).then(function(rs) {
                _.extend(t, rs.data);
              }, function(e) {
                if (e.data)
                  alert(e.data);
                }
              )
            } else {
              alert("Không tìm thấy đơn hàng");
            }

          }
          $scope.cancel = function(sanpham) {
            sanpham.het_hang = true;
            var t = $scope.pbls[sanpham.m_id];

            if (t) {
              t.not_update = true;
              t.details.forEach(function(p) {
                if (p.line == sanpham.line && p.ma_vt == sanpham.ma_vt) {
                  p.het_hang = true;
                }
              })
              pbl.update(id_app, t._id, t).then(function(rs) {
                _.extend(t, rs.data);
              }, function(e) {
                if (e.data)
                  alert(e.data);
                }
              )
            } else {
              alert("Không tìm thấy đơn hàng");
            }
          }
          $scope.view = function(sanpham) {
            var t = $scope.pbls[sanpham.m_id];
            pblModule.quickedit($uibModal, sanpham.m_id, function(item) {
              _.extend(t, item);
            });
          }
          socket.on("pbl:new", function(t) {
            var _id = t._id;
            if (!$scope.pbls)
              $scope.pbls = {}
            pbl.get(id_app, _id).then(function(res) {
              t = res.data;
              var c = $scope.pbls[t._id];
              if (!c) {
                t.is_new = true;
                t.is_update = false;
                if (!notificationShowed[t._id + ':new']) {
                  notificationShowed[t._id + ':new'] = t;
                  nodeWebkit.notification("Bạn có đơn hàng mới", "", {
                    url: "/pbl/edit/" + _id
                  })
                }
                getdsanpham(t);

                $scope.pbls[t._id] = t;

              }
            })
          })
          socket.on("pbl:update", function(t) {
            var _id = t._id;
            if (!$scope.pbls)
              $scope.pbls = {}
            var c = $scope.pbls[_id];
            if (c && c.not_update) {
              c.not_update = false;
              return;
            }

            pbl.get(id_app, _id).then(function(res) {
              t = res.data;
              if (t.trang_thai == 2 || t.trang_thai == 9) {
                $scope.dssanpham = _.reject($scope.dssanpham, function(sp) {
                  return sp.m_id == t._id;
                })
                delete $scope.pbls[_id]
                return;
              }
              $scope.pbls[_id] = t;
              t.is_update = true;
              t.is_new = false;
              //update san pham
              getdsanpham(t);
              //show notification
              if (!notificationShowed[t._id + ':update']) {
                notificationShowed[t._id + ':update'] = t;
                nodeWebkit.notification("Đơn hàng đã được cập nhật", "", {
                  url: "/pbl/edit/" + _id
                })
              }

            })
          })
          $scope.refresh();
        })

      }
    ],
    link: function($scope, elem, attrs, controller) {}
  }
});
