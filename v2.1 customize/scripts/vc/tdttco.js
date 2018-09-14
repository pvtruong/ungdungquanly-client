angular.module('tdttcoModule',[])
	.directive('ngTdttco',[function(){
	return {
		restrict:'E',
		scope:{
			ngData:'=',
			ngMasterData:'='
		},
		templateUrl:"templates/vouchers/tdttco/templates/table.html",
		controller:['$scope','$uibModal','dmkh','dmvat','$timeout','$http','$rootScope','appInfo',function($scope,$uibModal,dmkh,dmvat,$timeout,$http,$rootScope,appInfo){
			initLabel($rootScope,$scope,appInfo,'TDTTCO',$http);
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
			$scope.getInvoice = function(){
				if(!$scope.ngMasterData.ma_kh){
					return $rootScope.alert("Phải nhập một khách hàng trước khi lấy hóa đơn");
				}
				var url =server_url + "/api/" + id_app + "/getinvoice2pay?ma_kh=" + $scope.ngMasterData.ma_kh;
				if($scope.ngMasterData._id){
					url = url + "&id_ct=" + $scope.ngMasterData._id
				}
				$http.get(url).then(function(invoices){
					$scope.ngData = invoices.data;
					if($scope.ngData.length==0){
						$rootScope.alert("Không có hóa đơn nào cần chi cho khách hàng này");
					}
				},function(error){
					$rootScope.alert("Không thể lấy được thông tin hóa đơn");
					console.log(error.data);
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

				$scope.openDetail('lg');
			}
			$scope.editDetail = function(r){
				$scope.dt_master = r//_.find($scope.ngData,function(r){return r.line==line});
				$scope.dt_current ={};
				_.extend($scope.dt_current,$scope.dt_master);
				$scope.openDetail('lg');
			}
			$scope.openDetail = function (size,template) {
				var modalInstance = $uibModal.open({
				  templateUrl:"templates/vouchers/tdttco/templates/edit.html",
				  controller: ['$scope', '$uibModalInstance','parentScope', function($scope, $uibModalInstance,parentScope){
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
							$uibModalInstance.close()
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
				scope.$watch('dt_current.tien_nt',function(newData){
					if(scope.status.isOpened){
						scope.dt_current.tien = STP.round(scope.dt_current.tien_nt * scope.ngMasterData.ty_gia,scope.f_tien);
						if(scope.dt_current.ty_gia_hd!=0){
							if(scope.dt_current.ty_gia_hd!='VND'){
								scope.dt_current.thanh_toan_qd = STP.round(scope.dt_current.tien / scope.dt_current.ty_gia_hd,scope.f_tien_nt);
							}

						}
					}
				});
				scope.$watch('dt_current.tien',function(newData){
					if(scope.status.isOpened){
						if(scope.dt_current.ty_gia_hd!=0){
							if(scope.dt_current.ty_gia_hd!='VND'){
								scope.dt_current.thanh_toan_qd = STP.round(scope.dt_current.tien / scope.dt_current.ty_gia_hd,scope.f_tien_nt);
							}
						}
					}
				});
			}
	}
}]);
