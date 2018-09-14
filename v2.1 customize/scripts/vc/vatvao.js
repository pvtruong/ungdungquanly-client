angular.module('vatvaoModule',[])
	.directive('ngVatvao',[function(){
	return {
		restrict:'E',
		scope:{
			ngData:'=',
			ngMasterData:'=',
			tkDuThue:'=',
			tTienNt:'=',
			tTien:'=',
			tenVt:'=',
			maKh:'='
		},
		templateUrl:"templates/vouchers/vatvao/templates/table.html",
		controller:['$scope','$uibModal','dmkh','dmvat','$timeout','$http','$rootScope','appInfo',function($scope,$uibModal,dmkh,dmvat,$timeout,$http,$rootScope,appInfo){
      initLabel($rootScope,$scope,appInfo,'VATVAO',$http);
			$scope.STP = STP;
			$scope.status = {isOpened:false};
			$scope.openUrl = $rootScope.openUrl;
			//so le cac field chinh
			$scope.f_sl = $rootScope.app_info.options.f_sl||2;
			$scope.f_ty_gia = $rootScope.app_info.options.f_ty_gia||0;
			$scope.f_gia = $rootScope.app_info.options.f_gia||0;
			$scope.f_tien = $rootScope.app_info.options.f_tien||0;

			if($scope.ngMasterData.ty_gia==1){
				$scope.f_gia_nt = $rootScope.app_info.options.f_gia||0;
				$scope.f_tien_nt = $rootScope.app_info.options.f_tien||0;
			}else{
				$scope.f_gia_nt = $rootScope.app_info.options.f_gia_nt||2;
				$scope.f_tien_nt = $rootScope.app_info.options.f_tien_nt||2
			}
			$scope.round =$scope.f_tien_nt;

			$scope.$watch("ngMasterData.ty_gia",function(n,o){
				if($scope.ngMasterData.ty_gia==1){
					$scope.f_gia_nt = $rootScope.app_info.options.f_gia||0;
					$scope.f_tien_nt = $rootScope.app_info.options.f_tien||0;
				}else{
					$scope.f_gia_nt = $rootScope.app_info.options.f_gia_nt||2;
					$scope.f_tien_nt = $rootScope.app_info.options.f_tien_nt||2
				}
				$scope.round =$scope.f_tien_nt;
			})
			//
			$scope.isNotRowwSelected = function(dt){
				return (_.filter(dt,function(r){return r.sel==true}).length==0);
			}
			//
			$scope.deleteRow = function(dt){
				var rc = _.reject(dt,function(r){return r.sel==true});
				dt.length =0;
				var i=0;
				rc.forEach(function(r){
					r.line = i;
					dt.push(r)
					i++;
				});
			}
      $scope.delete1Row = function(row){
          var rc = _.reject($scope.ngData,function(r){return r.line===row.line});
          $scope.ngData.length =0;
          var i=0;
          rc.forEach(function(r){
              r.line = i;
              $scope.ngData.push(r)
              i++;
          });
      }
			$scope.addDetail = function(){
				if(!$scope.ngData){
					$scope.ngData = [];
				}
				var line =$scope.ngData.length;
				$scope.dt_master = null;
				$scope.dt_current ={line:line};
				if(!$scope.ngData){
					$scope.ngData =[];
				}
				if($scope.ngMasterData){
					$scope.dt_current.ngay_hd = $scope.ngMasterData.ngay_ct;

					if($scope.tkDuThue){
						$scope.dt_current.tk_du_thue =$scope.tkDuThue;
					}
					if($scope.tTienNt){
						$scope.dt_current.t_tien_nt = $scope.tTienNt;
					}
					if($scope.tTien){
						$scope.dt_current.t_tien = $scope.tTien;
					}
					if($scope.tenVt){
						$scope.dt_current.ten_vt = $scope.tenVt;
					}
					if($scope.maKh || $scope.ngMasterData.ma_kh){
						$scope.dt_current.ma_kh = $scope.maKh || $scope.ngMasterData.ma_kh;
						$scope.dt_current.ten_kh = $scope.ngMasterData.ten_kh;
						dmkh.list(id_app,{ma_kh:$scope.maKh}).then(function(res){
							var data = res.data
							if(data.length==1){
								$scope.dt_current.ten_kh = data[0].ten_kh;
								$scope.dt_current.dia_chi = data[0].dia_chi;
								$scope.dt_current.ma_so_thue = data[0].ma_so_thue;
							}
						});
					}
				}
				$scope.openDetail('lg');
			}
			$scope.editDetail = function(line){
				$scope.dt_master = _.find($scope.ngData,function(r){return r.line==line});
				$scope.dt_current ={};
				_.extend($scope.dt_current,$scope.dt_master);
				$scope.openDetail('lg');
			}
			$scope.openDetail = function (size,template) {
				var modalInstance = $uibModal.open({
				  templateUrl:"templates/vouchers/vatvao/templates/edit.html",
				  controller:  ['$scope', '$uibModalInstance','parentScope',function($scope, $uibModalInstance,parentScope){
						$scope.STP = STP;
						$scope.ngData = parentScope.ngData;
						$scope.dt_master = parentScope.dt_master;
						$scope.dt_current = parentScope.dt_current;
						$scope.ngMasterData=parentScope.ngMasterData;
						$scope.status=parentScope.status;

						$scope.round = parentScope.round;
						$scope.f_sl = parentScope.f_sl;
						$scope.f_gia = parentScope.f_gia;
						$scope.f_tien = parentScope.f_tien;
						$scope.f_ty_gia = parentScope.f_ty_gia;

						$scope.f_gia_nt = parentScope.f_gia_nt;
						$scope.f_tien_nt = parentScope.f_tien_nt;

						$scope.updateDetail = function (){
							if(!$scope.dt_master){
								$scope.dt_master  = {};
								$scope.ngData.push($scope.dt_master);
							}
							for(var k in $scope.dt_current){
								$scope.dt_master[k] = $scope.dt_current[k];
							}
							$uibModalInstance.close();

						};
						$scope.cancelDetail = function () {
							$uibModalInstance.close();
						};
					}],
				  size: size,
				  resolve: {
					parentScope: function () {
						$scope.status.isOpened = false;
						return $scope;
					}
				  }
				});
				modalInstance.opened.then(function(){
					$timeout(function(){
						$scope.status.isOpened = true;
					},100);

				});
				modalInstance.result.then(function(result){
					$scope.status.isOpened = false;
				});
			}
		}],
		link:function(scope,elem,attrs,ctr){
				scope.$watch('dt_current.thue_suat',function(newData){
					if(scope.status.isOpened){
						scope.dt_current.t_thue_nt = STP.round(scope.dt_current.t_tien_nt * scope.dt_current.thue_suat/100,scope.f_tien_nt);
						scope.dt_current.t_thue = STP.round(scope.dt_current.t_thue_nt * scope.ngMasterData.ty_gia,scope.f_tien);
					}
				});
				scope.$watch('dt_current.t_thue_nt',function(newData){
					if(scope.status.isOpened){
						scope.dt_current.t_thue = STP.round(scope.dt_current.t_thue_nt * scope.ngMasterData.ty_gia,scope.f_tien);
					}
				});
				scope.$watch('dt_current.t_tien_nt',function(newData){
					if(scope.status.isOpened){
						scope.dt_current.t_tien = STP.round(scope.dt_current.t_tien_nt * scope.ngMasterData.ty_gia,scope.f_tien);

						scope.dt_current.t_thue_nt = STP.round(scope.dt_current.t_tien_nt * scope.dt_current.thue_suat/100,scope.f_tien_nt);
						scope.dt_current.t_thue = STP.round(scope.dt_current.t_thue_nt * scope.ngMasterData.ty_gia,scope.f_tien);
					}
				});

				scope.$watch('dt_current.t_tien',function(newData){
					if(scope.status.isOpened){
						scope.dt_current.t_thue = STP.round(scope.dt_current.t_tien * scope.dt_current.thue_suat/100,scope.f_tien);
					}
				});
			}
	}
}]);
