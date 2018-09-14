var pncModule = new baseVoucher('pnc','pnc',[],'Phiếu nhập điều chuyển',{
    onInput:function($scope,$options){
        var ty_gia =1;

        $scope.select = function(item){
            if($scope.data.ty_gia){
                ty_gia = $scope.data.ty_gia;
            }
            var nrow ={};
            var f = _.filter($scope.data.details,function(i){
                return i.ma_vt===item.ma_vt && i.ma_lo===item.ma_lo && i.han_sd===item.han_sd && i.ma_tt1 ==item.ma_tt1 && i.ma_tt2 ==item.ma_tt2 && i.ma_tt3 ==item.ma_tt3;
            })
            if(f.length>0){
                nrow = f[0];
                nrow.sl_xuat +=1;

            }else{
                nrow = {ma_vt:item.ma_vt,ten_vt:item.ten_vt,ma_dvt:item.ma_dvt,tk_vt:item.tk_vt,tk_du:item.tk_vt,ma_lo:item.ma_lo,han_sd:item.han_sd,ma_tt1:item.ma_tt1,ma_tt2:item.ma_tt2,ma_tt3:item.ma_tt3}
                if(pn1Module.defaultValues4Detail){
                    for(var key in pn1Module.defaultValues4Detail){
                        nrow[key] =pn1Module.defaultValues4Detail[key];
                    }

                }
                if($scope.data.options){
                    for(var key in $scope.data.options){
                        if($scope.data.options[key])
                            nrow[key] =$scope.data.options[key];
                    }

                }
                nrow.sl_xuat = 1;
                var gia_von = item.gia_mua?item.gia_mua:0;
                nrow.gia_von = gia_von*ty_gia;
                nrow.gia_von_nt = gia_von;
                nrow.line = $scope.data.details.length;
                $scope.data.details.push(nrow);
            }
            //tien nhap
            nrow.tien_xuat_nt =  nrow.sl_xuat * nrow.gia_von_nt;
            nrow.tien_xuat =  STP.round(nrow.tien_xuat_nt* ty_gia,0);
            pncModule.tinhCkvt($options.$http,$scope.data,nrow,$scope.data.ma_kh_n);
            $options.$rootScope.toast("Đã thêm sản phẩm " + nrow.ten_vt);
        }
        $scope.getpxc4pnc = function(){
            var modalInstance = $options.$uibModal.open({
            templateUrl:"templates/vouchers/pnc/templates/form-select-pxc.html",
            controller:  ['$scope', '$uibModalInstance','parentScope','$filter','$rootScope','$http',function($scope, $uibModalInstance,parentScope,$filter,$rootScope,$http){
                $scope.STP = STP;
                $scope.condition ={tu_ngay:new Date(moment().format('YYYY-MM-01')),den_ngay:new Date()};
                $scope.loadPXC = function(){
                    $scope.masters =[];
                    var url = server_url_report + "/api/" + id_app + "/getpxc4pnc?t=1";
                    if($scope.condition.so_ct){
                        url = url + "&so_ct=" + $scope.condition.so_ct
                    }

                    if($scope.condition.ma_kho_n){
                        url = url + "&ma_kho_n=" + $scope.condition.ma_kho_n
                    }
                    if($scope.condition.ma_kho_x){
                        url = url + "&ma_kho_x=" + $scope.condition.ma_kho_x
                    }

                    if(parentScope.data._id){
                        url = url + "&id_ct=" + parentScope.data._id
                    }

                    url =url + "&tu_ngay=" + $filter('date')($scope.condition.tu_ngay,'yyyy-MM-dd');
                    url =url + "&den_ngay=" + $filter('date')($scope.condition.den_ngay,'yyyy-MM-dd');

                    $http.get(url)
                        .then(function(res){
                            $scope.masters = res.data;
                            if($scope.masters.length==0) $rootScope.alert("Không tìm thấy phiếu xuất điều chuyển");
                        },function(res){
                            $scope.masters =[];
                            if(res.data) $rootScope.alert(res.data);
                        });
                }
                $scope.ok = function (p){
                    if(parentScope.data._id) p._id = parentScope.data._id;
                    parentScope.data = p;
                    $uibModalInstance.close();

                };
                $scope.cancel = function () {
                    $uibModalInstance.close();
                };
            }],
            size: "lg",
            resolve: {
                parentScope: function () {
                    return $scope;
                }
              }
            });
        }

    }

});
pncModule.defaultValues ={
}
pncModule.defaultValues4Detail = {
	sl_xuat:0,
	//px_gia_dd:false,
	gia_von_nt:0,gia_von:0,
	tien_xuat_nt:0,tien_xuat:0
}
pncModule.defaultCondition4Search = {tu_ngay:new Date(),den_ngay:new Date(),so_ct:'',dien_giai:''};
pncModule.prepareCondition4Search = function($scope,vcondition){
	return {
		so_ct:{$regex:$scope.vcondition.so_ct,$options:'i'},
		dien_giai:{$regex:$scope.vcondition.dien_giai,$options:'i'},
		ngay_ct:{
			$gte:dateTime2Date($scope.vcondition.tu_ngay),
			$lte:dateTime2Date($scope.vcondition.den_ngay)
		}
	};
}

pncModule.watchDetail = function(scope){
	scope.$watch('dt_current.sl_xuat',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_xuat_nt = STP.round( scope.dt_current.sl_xuat * scope.dt_current.gia_von_nt,scope.round);
		}
	});
	scope.$watch('dt_current.gia_von_nt',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.gia_von = STP.round(scope.dt_current.gia_von_nt * scope.ngMasterData.ty_gia,0);
			scope.dt_current.tien_xuat_nt = STP.round( scope.dt_current.sl_xuat * scope.dt_current.gia_von_nt,scope.round);
		}
	});
	scope.$watch('dt_current.gia_von',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_xuat = STP.round( scope.dt_current.sl_xuat * scope.dt_current.gia_von,0);
		}
	});
	scope.$watch('dt_current.tien_xuat_nt',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_xuat = STP.round(scope.dt_current.tien_xuat_nt * scope.ngMasterData.ty_gia,0);
		}
	});
}
pncModule.watchMaster = function(scope){
	scope.$watch('data.ty_gia',function(newData){
		if(scope.data){
			if(newData!=undefined && scope.isDataLoaded){
				angular.forEach(scope.data.details,function(r){
					r.gia_von = STP.round(r.gia_von_nt * newData,0);
					r.tien_xuat = STP.round(r.tien_xuat_nt * newData,0);
				});
			}
		}
	});
}
