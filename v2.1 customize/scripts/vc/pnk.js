var pnkModule = new baseVoucher('pnk','pnk',[],'Phiếu nhập kho nội bộ',{
    onLoading:function($scope,$option){
        $scope.printBarcode = function(){
            var list = JSON.parse(JSON.stringify($scope.list));
            list = _.filter(list,function(d){
                return d.sel;
            });
            var vts =[];

            list.forEach(function(l){
                vts = vts.concat(l.details);

            });
            if(vts.length==0){
                $option.$rootScope.alert("Bạn hãy chọn ít nhất một phiếu để in");
                return;
            }
            for(var line=0;line<vts.length;line++){
                vts[line].line = line;
            }
            async.map(vts,function(vt,callback){
                dmvtModule.getService($option.$http,$option.$q,$option.$rootScope).load(id_app,{condition:{ma_vt:vt.ma_vt}}).then(function(res){
                    if(res.data.length==1){
                        vt.gia_ban_le = res.data[0].gia_ban_le;
                    }
                    callback();
                },function(error){
                    callback();
                });
            },function(e,rs){
                var modalInstance = $option.$uibModal.open({
                  template:"<div style='height:" + (innerHeight-10).toString() + "px'><div class='scrollable'><div class='scrollable-content'><barcode data='list' field-code='ma_vt'  field-price='gia_ban_le' field-qty='sl_nhap' field-label='ten_vt' on-close='cancel()'></barcode></div></div></div>",
                  controller:  ['$scope','$rootScope','$controller','$http', '$uibModalInstance','$window','appInfo',function($scope,$rootScope,$controller,$http, $uibModalInstance,$window,appInfo){
                        $scope.list = vts;

                        $scope.cancel = function () {
                            $uibModalInstance.close();
                        }
                    }],
                  size: "md",//size:'lg',
                  resolve: {
                    parentScope: function () {
                      return $scope;
                    }

                  }
                });
            });

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
                return i.ma_vt===item.ma_vt && i.ma_lo===item.ma_lo && i.han_sd===item.han_sd && i.ma_tt1 ==item.ma_tt1 && i.ma_tt2 ==item.ma_tt2 && i.ma_tt3 ==item.ma_tt3;
            })
            if(f.length>0){
                nrow = f[0];
                nrow.sl_nhap +=1;

            }else{
                nrow = {ma_vt:item.ma_vt,ten_vt:item.ten_vt,ma_dvt:item.ma_dvt,tk_vt:item.tk_vt,ma_lo:item.ma_lo,han_sd:item.han_sd,ma_tt1:item.ma_tt1,ma_tt2:item.ma_tt2,ma_tt3:item.ma_tt3}
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
                nrow.sl_nhap = 1;
                var gia_von = item.gia_mua?item.gia_mua:0;
                nrow.gia_von = STP.round(gia_von*ty_gia,$scope.f_gia);
                nrow.gia_von_nt = gia_von;
                nrow.line = $scope.data.details.length;
                $scope.data.details.push(nrow);
            }
            //tien nhap
            nrow.tien_nhap_nt =  STP.round(nrow.sl_nhap * nrow.gia_von_nt,$scope.f_tien_nt);
            nrow.tien_nhap =  STP.round(nrow.tien_nhap_nt* ty_gia,$scope.f_tien);
            //$options.$rootScope.toast("Đã thêm sản phẩm " + nrow.ten_vt);
        }
    }
});
pnkModule.defaultValues ={
    ma_gd:'0'
}
pnkModule.defaultValues4Detail = {
	sl_nhap:0,
	pn_gia_tb:true,
	gia_von_nt:0,gia_von:0,
	tien_nhap_nt:0,tien_nhap:0
}
pnkModule.defaultCondition4Search = {tu_ngay:new Date(),den_ngay:new Date(),so_ct:'',dien_giai:''};
pnkModule.prepareCondition4Search = function($scope,vcondition){
	var _c =  {
		so_ct:{$regex:$scope.vcondition.so_ct,$options:'i'},
		dien_giai:{$regex:$scope.vcondition.dien_giai,$options:'i'},
		ngay_ct:{
			$gte:dateTime2Date($scope.vcondition.tu_ngay),
			$lte:dateTime2Date($scope.vcondition.den_ngay)
		}
	};
  if($scope.vcondition.ma_vt){
    _c.details = {$elemMatch:{ma_vt:$scope.vcondition.ma_vt}};
  }
  return _c;
}

pnkModule.watchDetail = function(scope){
	scope.$watch('dt_current.sl_nhap',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_nhap_nt = STP.round( scope.dt_current.sl_nhap * scope.dt_current.gia_von_nt,scope.f_tien_nt);
		}
	});

	scope.$watch('dt_current.gia_von_nt',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.gia_von = STP.round(scope.dt_current.gia_von_nt * scope.ngMasterData.ty_gia,scope.f_gia);
			scope.dt_current.tien_nhap_nt = STP.round( scope.dt_current.sl_nhap * scope.dt_current.gia_von_nt,scope.f_tien_nt);
		}
	});
	scope.$watch('dt_current.gia_von',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_nhap = STP.round( scope.dt_current.sl_nhap * scope.dt_current.gia_von,scope.f_tien);
		}
	});



	scope.$watch('dt_current.tien_nhap_nt',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_nhap = STP.round(scope.dt_current.tien_nhap_nt * scope.ngMasterData.ty_gia,scope.f_tien);
		}
	});
}
pnkModule.watchMaster = function(scope){

	scope.$watch('data.ty_gia',function(newData){
		if(scope.data){
			if(newData!=undefined && scope.isDataLoaded){
				angular.forEach(scope.data.details,function(r){
					r.gia_von = STP.round(r.gia_von_nt * newData,scope.f_gia);
					r.tien_nhap = STP.round(r.tien_nhap_nt * newData,scope.f_tien);
				});
			}
		}
	});
}
