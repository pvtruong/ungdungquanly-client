var lenhcapphatModule = new baseVoucher('lenhcapphat','lenhcapphat',[],'Lệnh cấp phát vật tư',{
  onLoading:function($scope,$options){

      $scope.createPXK = function(lenhcapphat){
          var _pxk = JSON.parse(JSON.stringify(lenhcapphat));
          _pxk.id_lenhcapphat = _pxk._id;
          _pxk.details.forEach(function(d){
            d.sl_xuat = d.so_luong-d.sl_da_xuat;
            d.gia_von_nt = d.gia_nt||0;
            d.gia_von = d.gia||0;
            d.tien_xuat_nt = STP.round((d.tien_nt||0) * d.sl_xuat,0);
            d.tien_xuat = d.tien_xuat_nt;
          })
          delete _pxk._id;
          delete _pxk.so_ct;
          delete _pxk.trang_thai;
          delete _pxk.ngay_ct;

          pxkModule.quickadd($options.$uibModal,function(ct){
              $options.service.get(id_app,lenhcapphat._id).then(function(res){
                _.extend(lenhcapphat,res.data);
              })
          },_pxk);
      }
  },
  onInput:function($scope,$options){
    $scope.tinh = function(){
      $options.$rootScope.alert("Chương trình đã thực hiện xong");
    }
  },
  onSave:function($scope,data,$options,next){
    var d=0;
    for(d=0;d<$scope.data.details.length;d++){
      if($scope.data.details[d].ton_kho < $scope.data.details[d].so_luong){
        return next("Vật tư " + $scope.data.details[d].ten_vt + " không đủ để thực hiện lệnh cấp phát");
      }
    }
    next(null,$scope.data);
  }
});
lenhcapphatModule.defaultValues ={

}
lenhcapphatModule.defaultValues4Detail = {
	so_luong:0
}
lenhcapphatModule.defaultCondition4Search = {tu_ngay:new Date(),den_ngay:new Date(),so_ct:'',dien_giai:''};

lenhcapphatModule.watchDetail =function($scope,$options){
  $scope.getInvoice = function() {
    var modalInstance = $scope.$uibModal.open({
      templateUrl: "templates/vouchers/lenhcapphat/templates/form-select-invoice.html",
      controller: [
        '$scope',
        '$uibModalInstance',
        'parentScope',
        '$filter',
        '$rootScope','$http',
        function($scope, $uibModalInstance, parentScope, $filter, $rootScope,$http) {
          $scope.STP = STP;
          $scope.condition = {
            tu_ngay: new Date(moment().format('YYYY-MM-01')),
            den_ngay: new Date()
          };
          $scope.ngData = parentScope.ngData;
          $scope.dt_current = parentScope.dt_current;
          $scope.ngMasterData = parentScope.ngMasterData;

          $scope.condition.id_contract = $scope.ngMasterData.id_contract;
          $scope.condition.so_ct_contract = $scope.ngMasterData.so_ct_contract;

          $scope.condition.id_lenhsx = $scope.ngMasterData.id_lenhsx;
          $scope.condition.so_ct_lenhsx = $scope.ngMasterData.so_ct_lenhsx;

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
            var url = server_url_report + "/api/" + id_app + "/getkehoachmh4lenhcp?t=1";
            if ($scope.condition.id_lenhsx) {
              url = url + "&id_lenhsx=" + $scope.condition.id_lenhsx
            }
            if ($scope.ngMasterData._id) {
              url = url + "&id_ct=" + $scope.ngMasterData._id
            }
            url = url + "&tu_ngay=" + $filter('date')($scope.condition.tu_ngay, 'yyyy-MM-dd');
            url = url + "&den_ngay=" + $filter('date')($scope.condition.den_ngay, 'yyyy-MM-dd');

            if ($scope.condition.so_ct) {
              url = url + "&so_ct=" + $scope.condition.so_ct;
            }
            if (parentScope.ngMasterData.ma_kho) {
              url = url + "&ma_kho=" + parentScope.ngMasterData.ma_kho;
            }

            if ($scope.condition.id_contract) {
              url = url + "&id_contract=" + $scope.condition.id_contract;
            }

            $http.get(url).then(function(res) {
              $scope.masters = res.data;
            }, function(res) {
              $scope.masters = [];
              if (res.data)
                $rootScope.alert(res.data);
              }
            );
          }
          $scope.ok = function() {
            if($scope.condition.id_lenhsx){
              parentScope.ngMasterData.id_lenhsx = $scope.condition.id_lenhsx;
              parentScope.ngMasterData.so_ct_lenhsx = $scope.condition.so_ct_lenhsx;
            }
            if($scope.condition.id_contract){
              parentScope.ngMasterData.id_contract = $scope.condition.id_contract;
              parentScope.ngMasterData.so_ct_contract = $scope.condition.so_ct_contract;
            }

            parentScope.ngMasterData.details = [];
            var line = 0;
            $scope.masters.forEach(function(m) {
              if (m.sel) {
                m.details.forEach(function(d) {
                  if (d.sel) {
                    d.line = line;
                    parentScope.tinhCkvt(d);
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
          return $scope;
        }
      }
    });
  }
}

lenhcapphatModule.prepareCondition4Search = function($scope,vcondition){
	return {
		so_ct:{$regex:$scope.vcondition.so_ct,$options:'i'},
		dien_giai:{$regex:$scope.vcondition.dien_giai,$options:'i'},
		ngay_ct:{
			$gte:dateTime2Date($scope.vcondition.tu_ngay),
			$lte:dateTime2Date($scope.vcondition.den_ngay)
		}
	};
}
