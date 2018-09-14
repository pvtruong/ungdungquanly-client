var pxcModule = new baseVoucher('pxc','pxc',[],'Phiếu xuất điều chuyển',{
    onLoading:function($scope,$options){
        $scope.taoPNC = function(pxc){
            var pnc =JSON.parse(JSON.stringify(pxc));
            pnc.details = _.filter(pnc.details,function(d){
              return d.sl_xuat>d.sl_da_nhap;
            })
            pnc.details.forEach(function(d){
              d.sl_xuat_pxc = d.sl_xuat;
              d.sl_xuat = d.sl_xuat_pxc - d.sl_da_nhap;
              pncModule.tinhCkvt($options.$http,pnc,d,pnc.ma_kh_n);
            })
            pnc.ma_ct ="PNC";
            pnc.id_px = pxc._id;
            delete pnc._id;
            //delete pnc.so_ct;

            pncModule.quickadd($options.$uibModal,function(rs){
              $options.service.get(id_app,pxc._id).then(function(res){
                _.extend(pxc,res.data);
              })
            },pnc);

        }
    },
    onInput:function($scope,$options){
        var ty_gia =1;

        $scope.select = function(item){
            if($scope.data.ty_gia){
                ty_gia = $scope.data.ty_gia;
            }
            var nrow ={};
            var f = _.filter($scope.data.details,function(i){
                return i.ma_vt===item.ma_vt && i.ma_lo===item.ma_lo && i.han_sd===item.han_sd && i.ma_tt1 ===item.ma_tt1 && i.ma_tt2===item.ma_tt2 && i.ma_tt3 ===item.ma_tt3;
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
                nrow.gia_von = STP.round(gia_von*ty_gia,$scope.f_gia);
                nrow.gia_von_nt = gia_von;
                nrow.line = $scope.data.details.length;
                $scope.data.details.push(nrow);
            }
            //tien nhap
            nrow.tien_xuat_nt =  STP.round(nrow.sl_xuat * nrow.gia_von_nt,$scope.f_tien_nt);
            nrow.tien_xuat =  STP.round(nrow.tien_xuat_nt* ty_gia,$scope.f_tien);
            pxcModule.tinhCkvt($options.$http,$scope.data,nrow,$scope.data.ma_kho_x);
          //  $options.$rootScope.toast("Đã thêm sản phẩm " + nrow.ten_vt);
        }
    }

});
pxcModule.defaultValues ={
}
pxcModule.defaultValues4Detail = {
	sl_xuat:0,
	//px_gia_dd:false,
	gia_von_nt:0,gia_von:0,
	tien_xuat_nt:0,tien_xuat:0
}
pxcModule.defaultCondition4Search = {tu_ngay:new Date(),den_ngay:new Date(),so_ct:'',dien_giai:''};
pxcModule.prepareCondition4Search = function($scope,vcondition){
	return {
		so_ct:{$regex:$scope.vcondition.so_ct,$options:'i'},
		dien_giai:{$regex:$scope.vcondition.dien_giai,$options:'i'},
		ngay_ct:{
			$gte:dateTime2Date($scope.vcondition.tu_ngay),
			$lte:dateTime2Date($scope.vcondition.den_ngay)
		}
	};
}

pxcModule.watchDetail = function(scope){
	scope.$watch('dt_current.sl_xuat',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_xuat_nt = STP.round( scope.dt_current.sl_xuat * scope.dt_current.gia_von_nt,scope.f_tien_nt);
		}
	});

	scope.$watch('dt_current.gia_von_nt',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.gia_von = STP.round(scope.dt_current.gia_von_nt * scope.ngMasterData.ty_gia,scope.f_gia);
			scope.dt_current.tien_xuat_nt = STP.round( scope.dt_current.sl_xuat * scope.dt_current.gia_von_nt,scope.f_tien_nt);
		}
	});
	scope.$watch('dt_current.gia_von',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_xuat = STP.round( scope.dt_current.sl_xuat * scope.dt_current.gia_von,scope.f_tien);
		}
	});



	scope.$watch('dt_current.tien_xuat_nt',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_xuat = STP.round(scope.dt_current.tien_xuat_nt * scope.ngMasterData.ty_gia,scope.f_tien);
		}
	});
}
pxcModule.watchMaster = function(scope){

	scope.$watch('data.ty_gia',function(newData){
		if(scope.data){
			if(newData!=undefined && scope.isDataLoaded){
				angular.forEach(scope.data.details,function(r){
					r.gia_von = STP.round(r.gia_von_nt * newData,scope.f_gia);
					r.tien_xuat = STP.round(r.tien_xuat_nt * newData,scope.f_tien);
				});
			}
		}
	});
}
