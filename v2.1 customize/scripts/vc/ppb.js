var ppbModule = new baseVoucher('ppb','ppb',[],'Phiếu phân bổ chi phí');
ppbModule.defaultValues ={
}
ppbModule.defaultValues4Detail = {
	tien_nt:0,tien:0,
}
ppbModule.defaultCondition4Search = {tu_ngay:new Date(),den_ngay:new Date(),so_ct:'',dien_giai:''};
ppbModule.prepareCondition4Search = function($scope,vcondition){
	return {
		so_ct:{$regex:$scope.vcondition.so_ct,$options:'i'},
		dien_giai:{$regex:$scope.vcondition.dien_giai,$options:'i'},
		ngay_ct:{
			$gte:dateTime2Date($scope.vcondition.tu_ngay),
			$lte:dateTime2Date($scope.vcondition.den_ngay)
		}
	};
}
ppbModule.watchDetail = function(scope){
	scope.$watch('dt_current.tien_nt',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien =STP.round(newData * scope.ngMasterData.ty_gia,0);
		}
	});
	scope.dmkc = function(){
		scope.$window.open("#kbbtpb","Khai báo bút toán phân bổ chi phí","width=800,height=400");
	}
	scope.createKC = function(){
		var modalInstance = scope.$uibModal.open({
		templateUrl:"templates/vouchers/ppb/templates/form-select-invoice.html",
		controller:  ['$scope', '$uibModalInstance','parentScope','$filter',function($scope, $uibModalInstance,parentScope,$filter){
				$scope.condition ={tu_ngay:new Date(),den_ngay:new Date()};
				$scope.ngData = parentScope.ngData;
				$scope.dt_current = parentScope.dt_current;
				$scope.ngMasterData=parentScope.ngMasterData;
				$scope.masters =[];
				$scope.details=[];
				$scope.invoiceClick = function(_id){
					$scope.details=[];
					var master = _.find($scope.masters,function(m){
						return m._id == _id;
					});
					$scope.details= master.details;
				}
				$scope.loadInvoice = function(){
					$scope.masters =[];
					$scope.details=[];
					var url = server_url + "/api/" + id_app + "/getbtpb?ma_dvcs=" + $scope.ngMasterData.ma_dvcs + "&ngay_ct=" +  $filter('date')($scope.ngMasterData.ngay_ct,'yyyy-MM-dd');
					if($scope.ngMasterData._id){
                        url = url + "&id_ct=" + $scope.ngMasterData._id;
                    }
                    scope.$http.get(url)
						.then(function(res){
							$scope.masters = res.data;
						},function(res){
							$scope.masters =[];
							alert(res.data);
						});
				}
				$scope.ok = function (){
					parentScope.ngMasterData.details =[];
					var line =0;
					$scope.masters.forEach(function(m){
						if(m.sel){
                            var tien_can_phan_bo = m.tien;
							var tien_da_phan_bo=0;
                            var tong_he_so = 0;
                            //tinh mau so
                            m.details.forEach(function(d){
								tong_he_so = tong_he_so + d.he_so;
							});
                            //phan bo
							for(var i =0;i<m.details.length;i++){
								var d = m.details[i];
								d.line = line;
                                d.tk_co = m.tk_co;
								parentScope.ngMasterData.details.push(d);
								//if he_so smaller 1 then  don't calculate he_so again
								if(tong_he_so){
									d.tien_nt = STP.round((d.he_so/tong_he_so) * tien_can_phan_bo,$scope.f_tien);
									d.tien = d.tien_nt;
								}else{
									d.tien_nt = 0;
									d.tien = 0;
								}
								//if tien_da_phan_bo bigger tien_can_phan_bo then round so_tien_con_lai
                                tien_da_phan_bo =d.tien_nt + tien_da_phan_bo;
								if(tien_da_phan_bo>tien_can_phan_bo){
									d.tien_nt = d.tien_nt - (tien_da_phan_bo-tien_can_phan_bo);
									break;
								}
                                line++;
							}
						}
					});
					$uibModalInstance.close();

				};
				$scope.cancel = function () {
					$uibModalInstance.close();
				};
                $scope.loadInvoice();
			}],
		size: "lg",
		resolve: {
			parentScope: function () {
				return scope;
			}
		  }
		});
	}
}
ppbModule.watchMaster = function(scope){
	scope.$watch('data.ty_gia',function(newData){
		if(scope.data){
			if(newData!=undefined && scope.isDataLoaded){
				angular.forEach(scope.data.details,function(r){
					r.tien = STP.round(r.tien_nt * newData,scope.f_tien);
				});
			}
		}
	});
}
