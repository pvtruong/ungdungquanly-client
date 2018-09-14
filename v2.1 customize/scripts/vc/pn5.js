var pn5Module = new baseVoucher('pn5','pn5',[],'Phiếu xuất trả lại nhà cung cấp');
pn5Module.defaultValues ={
	t_thue_nt:0,t_thue:0,thue_suat:0
}
pn5Module.defaultValues4Detail = {
	sl_xuat:0,
	ty_le_ck:0,
	gia_von_nt:0,gia_von:0,
	tien_hang_nt:0,tien_hang:0,
	tien_ck_nt:0,tien_ck:0,
	px_gia_dd:false,
	tien_xuat_nt:0,tien_xuat:0
}
pn5Module.defaultCondition4Search = {tu_ngay:new Date(),den_ngay:new Date(),so_ct:'',dien_giai:'',ma_kh:''};
pn5Module.prepareCondition4Search = function($scope,vcondition){
	return {
		so_ct:{$regex:$scope.vcondition.so_ct,$options:'i'},
		dien_giai:{$regex:$scope.vcondition.dien_giai,$options:'i'},
		ma_kh:{$regex:$scope.vcondition.ma_kh,$options:'i'},
		ngay_ct:{
			$gte:dateTime2Date($scope.vcondition.tu_ngay),
			$lte:dateTime2Date($scope.vcondition.den_ngay)
		}
	};
}

pn5Module.watchDetail = function(scope){
	scope.$watch('dt_current.sl_xuat',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_hang_nt = STP.round( scope.dt_current.sl_xuat * scope.dt_current.gia_von_nt,scope.round);
		}
	});
	scope.$watch('dt_current.tien_hang_nt',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_ck_nt = STP.round(scope.dt_current.tien_hang_nt * scope.dt_current.ty_le_ck/100,scope.round);
			scope.dt_current.tien_xuat_nt = scope.dt_current.tien_hang_nt - scope.dt_current.tien_ck_nt;
			scope.dt_current.tien_hang = STP.round(scope.dt_current.tien_hang_nt * scope.ngMasterData.ty_gia,scope.f_tien);
		}
	});
	scope.$watch('dt_current.tien_hang',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_ck = STP.round(scope.dt_current.tien * scope.dt_current.ty_le_ck/100,scope.f_tien);
		}
	});

	scope.$watch('dt_current.gia_von_nt',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.gia_von =STP.round(scope.dt_current.gia_von_nt * scope.ngMasterData.ty_gia,scope.f_gia);
			scope.dt_current.tien_hang_nt = STP.round( scope.dt_current.sl_xuat * scope.dt_current.gia_von_nt,scope.round);
		}
	});


	scope.$watch('dt_current.ty_le_ck',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_ck_nt = STP.round(scope.dt_current.tien_hang_nt * scope.dt_current.ty_le_ck/100,scope.round);
		}
	});

	scope.$watch('dt_current.tien_ck_nt',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_ck = STP.round(scope.dt_current.tien_ck_nt * scope.ngMasterData.ty_gia,scope.f_tien);
			scope.dt_current.tien_xuat_nt = scope.dt_current.tien_hang_nt - scope.dt_current.tien_ck_nt;
		}
	});
	scope.$watch('dt_current.tien_ck',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_xuat = scope.dt_current.tien_hang - scope.dt_current.tien_ck;
		}
	});
	scope.$watch('dt_current.tien_xuat_nt',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_xuat =STP.round(scope.dt_current.tien_xuat_nt * scope.ngMasterData.ty_gia,scope.f_tien);
		}
	});

	scope.getInvoice = function(){
		var modalInstance = scope.$uibModal.open({
		templateUrl:"templates/vouchers/pn5/templates/form-select-invoice.html",
		controller:  ['$scope', '$uibModalInstance','parentScope','$filter','$rootScope',function($scope, $uibModalInstance,parentScope,$filter,$rootScope){
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
                $scope.selectAllDetail = function(m,v){
                    m.details.forEach(function(d){
                        d.sel = m.sel;
                    });
                }
                //$scope.innerWindow = window.innerWindow;
				$scope.loadInvoice = function(){
					$scope.masters =[];
					$scope.details=[];
					var url = server_url + "/api/" + id_app + "/getpn2return?ma_kh=" + $scope.ngMasterData.ma_kh;
					url =url + "&tu_ngay=" + $filter('date')($scope.condition.tu_ngay,'yyyy-MM-dd');
					url =url + "&den_ngay=" + $filter('date')($scope.condition.den_ngay,'yyyy-MM-dd');
					if($scope.condition.so_ct){
						url =url + "&so_ct=" + $scope.condition.so_ct;
					}
					if($scope.ngMasterData._id){
						url = url + "&id_ct=" + $scope.ngMasterData._id
					}
					scope.$http.get(url)
						.then(function(data){
							$scope.masters = data.data;
						},function(error){
							$scope.masters =[];
							$rootScope.alert(error.data);
						});
				}
				$scope.ok = function (){
					parentScope.ngMasterData.details =[];
					var line =0;
					$scope.masters.forEach(function(m){
						if(m.sel){
							m.details.forEach(function(d){
								if(d.sel){
									d.line = line;
									parentScope.ngMasterData.details.push(d);
									line++;
								}
							});
						}
					});
					$uibModalInstance.close();

				};
				$scope.cancel = function () {
					$uibModalInstance.close();
				};
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
pn5Module.watchMaster = function(scope){
	scope.$watch('data.ty_gia',function(newData){
		if(scope.data){
			if(newData!=undefined && scope.isDataLoaded){
				angular.forEach(scope.data.details,function(r){
					r.tien_hang = STP.round(r.tien_hang_nt * newData,scope.f_tien);
					r.tien_ck = STP.round(r.tien_ck_nt * newData,scope.f_tien);
					r.tien_xuat = STP.round(r.tien_xuat_nt * newData,scope.f_tien);
				});
				scope.data.t_thue = STP.round(scope.data.t_thue_nt * newData,scope.f_tien)
			}
		}
	});
	scope.$watch('data.thue_suat',function(newData){
		if(scope.data){
			if(newData!=undefined && scope.isDataLoaded){
				scope.data.t_thue_nt = STP.round((scope.data.t_tien_hang_nt-scope.data.t_ck_nt) * scope.data.thue_suat/100,scope.round);
				scope.data.t_thue = STP.round(scope.data.t_thue_nt * scope.data.ty_gia,scope.f_tien)
			}
		}
	});
	scope.$watch('data.t_tien_hang_nt',function(newData){
		if(scope.data){
			if(newData!=undefined && scope.isDataLoaded){
				scope.data.t_thue_nt = STP.round((scope.data.t_tien_hang_nt-scope.data.t_ck_nt) * scope.data.thue_suat/100,scope.round);
				scope.data.t_thue = STP.round(scope.data.t_thue_nt * scope.data.ty_gia,scope.f_tien)
			}
		}
	});
	scope.$watch('data.t_tien_hang',function(newData){
		if(scope.data){
			if(newData!=undefined && scope.isDataLoaded){
				scope.data.t_thue = STP.round((scope.data.t_tien_hang-scope.data.t_ck) * scope.data.thue_suat/100,scope.f_tien);
			}
		}
	});
}
