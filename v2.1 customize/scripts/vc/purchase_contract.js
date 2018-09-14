var purchase_contractModule = new baseVoucher('purchase_contract','purchase_contract',["so_ct","ma_hd","dien_giai","ma_kh","ten_kh"],'Hợp đồng mua hàng',{
     onLoading:function($scope,$options){
       $scope.tinhtienhang = function(nrow,data){
          var ty_gia=1;
           if(data.ty_gia){
               ty_gia = data.ty_gia;
           }
           var f_gia = (data.ma_nt=='VND'?$options.$rootScope.app_info.options.f_gia:$options.$rootScope.app_info.options.f_gia_nt);
           var f_tien_nt =(data.ma_nt=='VND'?$options.$rootScope.app_info.options.f_tien:$options.$rootScope.app_info.options.f_tien_nt);
           var f_tien = $options.$rootScope.app_info.options.f_tien;

           nrow.gia =  STP.round(nrow.gia_nt* ty_gia,f_gia);

           nrow.tien_nt =  STP.round(nrow.so_luong * nrow.gia_nt,f_tien_nt);
           nrow.tien =  STP.round(nrow.tien_nt* ty_gia,f_tien);
           //chiet khau
           nrow.tien_ck_nt = STP.round(nrow.tien_nt  * nrow.ty_le_ck/100,f_tien_nt) ;
           nrow.tien_ck = STP.round(nrow.tien_ck_nt* ty_gia,f_tien);
           //nhap khau
           nrow.thue_suat_nk = nrow.thue_suat_nk||0;
           nrow.gia_von_nk_nt = nrow.gia_von_nk_nt||(nrow.thue_suat_nk?nrow.gia_nt:0);
           nrow.gia_von_nk = STP.round(nrow.gia_von_nk_nt* ty_gia,f_tien_nt);

           nrow.tien_hang_nk_nt = STP.round(nrow.gia_von_nk_nt* nrow.so_luong,f_tien_nt);
           nrow.tien_hang_nk = STP.round(nrow.tien_hang_nk_nt* ty_gia,f_tien);

           nrow.tien_thue_nk_nt = STP.round(nrow.thue_suat_nk * nrow.tien_hang_nk_nt/100,f_tien_nt);
           nrow.tien_thue_nk = STP.round(nrow.tien_thue_nk_nt* ty_gia,f_tien);
           //tong tien
           nrow.tt_nt = nrow.tien_nt - nrow.tien_ck_nt+ nrow.tien_thue_nk_nt;
           nrow.tt = nrow.tien - nrow.tien_ck + nrow.tien_thue_nk;
       }

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
               $options.$rootScope.alert("Bạn hãy chọn ít nhất một phiếu để in");
               return;
           }

           for(var line=0;line<vts.length;line++){
               vts[line].line = line;
           }

           async.map(vts,function(vt,callback){
               dmvtModule.getService($options.$http,$options.$q,$options.$rootScope).load(id_app,{condition:{ma_vt:vt.ma_vt}}).then(function(res){
                   if(res.data.length==1){
                       vt.gia_ban_le = res.data[0].gia_ban_le;
                   }
                   callback();
               },function(error){
                   callback();
               });
           },function(e,rs){
               var modalInstance = $options.$uibModal.open({
                 template:"<div style='height:" + (innerHeight-10).toString() + "px'><div class='scrollable'><div class='scrollable-content'><barcode data='list' field-code='ma_vt'  field-price='gia_nt' field-qty='so_luong' field-label='ten_vt' on-close='cancel()'></barcode></div></div></div>",
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
        $scope.createPN = function(contract){
            var hd = JSON.parse(JSON.stringify(contract));

            hd.id_contract = hd._id;
            hd.ngay_ct = new Date();
            delete hd._id;
            delete hd.so_ct;
            var kieu_pn =0;
            var f_tien = $options.$rootScope.app_info.options.f_tien;
            var f_tien_nt = (contract.ma_nt=='VND'?$options.$rootScope.app_info.options.f_tien:$options.$rootScope.app_info.options.f_tien_nt);
            hd.details = _.filter(hd.details,function(d){
              return d.so_luong>d.sl_da_nhap;
            })
            hd.details.forEach(function(d){
                d.sl_nhap = $options.$rootScope.app_info.options.sl_nhap_sl_hop_dong?d.so_luong-(d.sl_da_nhap||0):0
                d.gia_von = d.gia;
                d.gia_von_nt = d.gia_nt;

                d.tien_hang = STP.round(d.gia_von*d.sl_nhap,f_tien);//d.tien;
                d.tien_hang_nt = STP.round(d.gia_von_nt*d.sl_nhap,f_tien_nt);//d.tien_nt;

                d.tien_ck = d.tien_ck||0;
                d.tien_ck_nt = d.tien_ck_nt||0;
                d.tien_phi = d.tien_phi||0;
                d.tien_phi_nt = d.tien_phi_nt||0;
                //nhap khau
                d.gia_von_nk =  d.gia_von_nk||0;
                d.gia_von_nk_nt = d.gia_von_nk_nt||0;

                d.tien_hang_nk =  d.gia_von_nk*d.sl_nhap;//d.tien_hang_nk||0;
                d.tien_hang_nk_nt =  d.gia_von_nk_nt*d.sl_nhap;//d.tien_hang_nk_nt||0;

                d.thue_suat_nk =  d.thue_suat_nk||0;

                d.tien_thue_nk= STP.round(d.tien_hang_nk*d.thue_suat_nk/100,f_tien)//d.tien_hang_nk||0;
                d.tien_thue_nk_nt =  STP.round(d.tien_hang_nk_nt*d.thue_suat_nk/100,f_tien_nt)//d.tien_hang_nk_nt||0;

                if(d.tien_hang_nk_nt || d.tien_thue_nk_nt){
                    kieu_pn =1;
                }
                //tong cong
                d.tien_nhap = d.tien_hang - d.tien_ck + d.tien_phi + d.tien_thue_nk;
                d.tien_nhap_nt = d.tien_hang_nt-d.tien_ck_nt + d.tien_phi_nt + d.tien_thue_nk_nt;
            })

            var pn = kieu_pn?pn9Module:pn1Module;
            pn.quickadd($options.$uibModal,function(ct){

                $options.service.get(id_app,contract._id).then(function(res){
                  _.extend(contract,res.data);
                })
            },hd);
        }

        $scope.createShipBook = function(contract){
            var hd = {};
            _.extend(hd,contract);
            hd.id_contract = hd._id;
            hd.ngay_ct = new Date();
            hd.ngay_tau_di = new Date();
            hd.ngay_sx = new Date();
            hd.ma_kh ='';
            hd.ten_kh='';
            hd.trang_thai='1';
            hd.t_thue_nt=0;
            hd.t_thue=0;
            hd.ma_thue='';
            hd.thue_suat=0;
            hd.tk_thue_co='';
            hd.details.forEach(function(d){
            d.tien_nt=0;
            d.tien=0;
            d.gia_nt=0;
            d.gia=0;
            d.tien_ck=0;
            d.tien_ck_nt=0;
            if(!d.exfields_detail)d.exfields_detail={};
            d.exfields_detail.tien_phi_nt=0;
            d.exfields_detail.tien_phi=0;
            d.exfields_detail.tien_phi_khac_nt=0;
            d.exfields_detail.tien_phi_khac=0;
            })
            delete hd._id;
            shipbookModule.quickadd($options.$uibModal,function(ct){
               contract.id_shipbook = ct._id;
            },hd);
        }
        $scope.createVanChuyen = function(contract){
            var hd = {};
            _.extend(hd,contract);
            hd.id_contract = hd._id;
            hd.ngay_ct = new Date();
            hd.ngay_van_chuyen = new Date();
            hd.ngay_sx = new Date();
            hd.ma_kh ='';
            hd.ten_kh='';
            hd.trang_thai='1';
            hd.t_thue_nt=0;
            hd.t_thue=0;
            hd.ma_thue='';
            hd.thue_suat=0;
            hd.tk_thue_co='';
            delete hd._id;
            hd.details.forEach(function(d){
              d.tien_nt=0;
              d.tien=0;
              d.gia_nt=0;
              d.gia=0;
              d.tien_ck=0;
              d.tien_ck_nt=0;
              if(!d.exfields_detail)d.exfields_detail={};
            })
            vanchuyenModule.quickadd($options.$uibModal,function(ct){
               contract.id_vanchuyen = ct._id;
            },hd);
        }
    },
    onInput:function($scope,$options){
        var ty_gia =1;

        var addSPMOI = function(item,callback){
            if($scope.data.ty_gia){
                ty_gia = $scope.data.ty_gia;
            }
            var nrow ={};
            var f = _.filter($scope.data.details,function(i){
                return i.ma_vt===item.ma_vt
                     && (i.ma_lo==item.ma_lo || (!i.ma_lo && !item.ma_lo))
                     && (i.han_sd==item.han_sd || (!i.han_sd && !item.han_sd))
                     && (i.ma_tt1 ==item.ma_tt1 || (!i.ma_tt1 && !item.ma_tt1))
                     && (i.ma_tt2 ==item.ma_tt2 || (!i.ma_tt2 && !item.ma_tt2))
                     && (i.ma_tt3 ==item.ma_tt3 || (!i.ma_tt3 && !item.ma_tt3));
            })
            if(f.length>0){
                nrow = f[0];
                nrow.so_luong = Number(nrow.so_luong) + 1;
                return callback(nrow);

            }
            //san pham moi
            nrow = {
                    ma_vt:item.ma_vt,ten_vt:item.ten_vt,ma_dvt:item.ma_dvt,tk_vt:item.tk_vt,
                    ma_lo:item.ma_lo,han_sd:item.han_sd,ma_tt1:item.ma_tt1,ma_tt2:item.ma_tt2,ma_tt3:item.ma_tt3

                   }
            if(purchase_contractModule.defaultValues4Detail){
                for(var key in purchase_contractModule.defaultValues4Detail){
                    nrow[key] =purchase_contractModule.defaultValues4Detail[key];
                }

            }
            if($scope.data.options){
                for(var key in $scope.data.options){
                    if($scope.data.options[key])
                        nrow[key] =$scope.data.options[key];
                }

            }
            nrow.so_luong = 1;
            nrow.thue_suat_nk=(item.thue_suat_nk||0)
            var gia = null;
            $options.$rootScope.prompt("Giá mua:",item.gia_mua?item.gia_mua:0).then(function(result){
                var btn = result.buttonIndex;
                if(btn==1){
                    gia = result.input1;
                    if(gia==null) return callback();
                    gia = Number(gia);

                    if(gia){
                        if(item.gia_mua!==gia){
                            item.gia_mua = gia
                            var url = server_url + "/api/" + id_app + "/dmvt/" + item._id;
                            $options.$http.put(url,item).then(function(res){
                               // console.log('Gia mua san pham' + item.ma_vt + ' da duoc cap nhat');
                            },function(res){
                                console.log("can't update price for product",res.data);
                            });
                        }
                        nrow.gia = STP.round(gia*ty_gia,$scope.f_gia);
                        nrow.gia_nt = gia;


                    }
                    nrow.ty_le_ck = 0;


                    nrow.line = $scope.data.details.length;
                    $scope.data.details.push(nrow);
                    callback(nrow);
                }else{
                    callback();
                }
            });

        }
        $scope.tinhtienhang = function(nrow){
            if($scope.data.ty_gia){
                ty_gia = $scope.data.ty_gia;
            }
            nrow.gia =  STP.round(nrow.gia_nt* ty_gia,$scope.f_gia);

            nrow.tien_nt =  STP.round(nrow.so_luong * nrow.gia_nt,$scope.f_tien_nt);
            nrow.tien =  STP.round(nrow.tien_nt* ty_gia,$scope.f_tien);
            //chiet khau
            nrow.tien_ck_nt = STP.round(nrow.tien_nt  * nrow.ty_le_ck/100,$scope.f_tien_nt) ;
            nrow.tien_ck = STP.round(nrow.tien_ck_nt* ty_gia,$scope.f_tien);
            //nhap khau
            nrow.thue_suat_nk = nrow.thue_suat_nk||0;
            nrow.gia_von_nk_nt = nrow.gia_von_nk_nt||(nrow.thue_suat_nk?nrow.gia_nt:0);
            nrow.gia_von_nk = STP.round(nrow.gia_von_nk_nt* ty_gia,$scope.f_tien_nt);

            nrow.tien_hang_nk_nt = STP.round(nrow.gia_von_nk_nt* nrow.so_luong,$scope.f_tien_nt);
            nrow.tien_hang_nk = STP.round(nrow.tien_hang_nk_nt* ty_gia,$scope.f_tien);

            nrow.tien_thue_nk_nt = STP.round(nrow.thue_suat_nk * nrow.tien_hang_nk_nt/100,$scope.f_tien_nt);
            nrow.tien_thue_nk = STP.round(nrow.tien_thue_nk_nt* ty_gia,$scope.f_tien);
            //tong tien
            nrow.tt_nt = nrow.tien_nt - nrow.tien_ck_nt+ nrow.tien_thue_nk_nt;
            nrow.tt = nrow.tien - nrow.tien_ck + nrow.tien_thue_nk;
        }
        $scope.select = function(item){
            addSPMOI(item,function(nrow){
                if(nrow){
                    //tien nhap
                    $scope.tinhtienhang(nrow);
                    //$options.$rootScope.toast("Đã thêm sản phẩm " + nrow.ten_vt);
                }
            });

        }
    }
});
purchase_contractModule.defaultValues ={

}
purchase_contractModule.defaultValues4Detail = {
	so_luong:0,
	ty_le_ck:0,
	gia_nt:0,gia:0,
	tien_nt:0,tien:0,
	tien_ck_nt:0,tien_ck:0,
    tien_hang_nk:0,tien_hang_nk_nt:0,tien_thue_nk:0,tien_thue_nk_nt:0,thue_suat_nk:0,
	tt_nt:0,tt:0
}
purchase_contractModule.defaultCondition4Search = {tu_ngay:new Date(),den_ngay:new Date(),so_ct:'',dien_giai:'',ma_kh:''};
purchase_contractModule.prepareCondition4Search = function($scope,vcondition){
	return {
		so_ct:{$regex:$scope.vcondition.so_ct,$options:'i'},
		dien_giai:{$regex:$scope.vcondition.dien_giai,$options:'i'},
		ma_kh:{$regex:$scope.vcondition.ma_kh,$options:'i'},
    ma_hd:{$regex:$scope.vcondition.ma_hd,$options:'i'},
		ngay_ct:{
			$gte:dateTime2Date($scope.vcondition.tu_ngay),
			$lte:dateTime2Date($scope.vcondition.den_ngay)
		}
	};
}
/*purchase_contractModule.watchDetail = function(scope){
	scope.$watch('dt_current.so_luong',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_nt = STP.round( scope.dt_current.so_luong * scope.dt_current.gia_nt,scope.round);
		}
	});

	scope.$watch('dt_current.gia_nt',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.gia = STP.round(scope.dt_current.gia_nt * scope.ngMasterData.ty_gia,0);
			scope.dt_current.tien_nt = STP.round(scope.dt_current.gia_nt * scope.dt_current.so_luong,scope.round);
		}
	});
	scope.$watch('dt_current.gia',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien = STP.round(scope.dt_current.gia * scope.dt_current.so_luong,scope.round);
		}
	});

	scope.$watch('dt_current.tien_nt',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien = STP.round(scope.dt_current.tien_nt * scope.ngMasterData.ty_gia,0);
			scope.dt_current.tien_ck_nt = STP.round(scope.dt_current.tien_nt * scope.dt_current.ty_le_ck/100,scope.round);
			scope.dt_current.tt_nt = scope.dt_current.tien_nt - scope.dt_current.tien_ck_nt + (scope.dt_current.tien_thue_nk_nt||0);
		}
	});
	scope.$watch('dt_current.tien',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_ck = STP.round(scope.dt_current.tien * scope.dt_current.ty_le_ck/100,0);
			scope.dt_current.tt = scope.dt_current.tien - scope.dt_current.tien_ck  + (scope.dt_current.tien_thue_nk||0);
		}
	});

	scope.$watch('dt_current.ty_le_ck',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_ck_nt = STP.round(scope.dt_current.tien_nt * scope.dt_current.ty_le_ck/100,scope.round);
		}
	});

	scope.$watch('dt_current.tien_ck_nt',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_ck = STP.round(scope.dt_current.tien_ck_nt * scope.ngMasterData.ty_gia,0);
			scope.dt_current.tt_nt = scope.dt_current.tien_nt - scope.dt_current.tien_ck_nt + (scope.dt_current.tien_thue_nk_nt||0);
		}
	});

	scope.$watch('dt_current.tien_ck',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tt = scope.dt_current.tien - scope.dt_current.tien_ck + (scope.dt_current.tien_thue_nk||0);
		}
	});

}*/
purchase_contractModule.watchMaster = function(scope,options){
	scope.$watch('data.ty_gia',function(newData){
		if(scope.data){
			if(newData!=undefined && scope.isDataLoaded){
				angular.forEach(scope.data.details,function(r){
					r.gia = STP.round(r.gia_nt * newData,scope.f_gia);
					r.tien = STP.round(r.tien_nt * newData,scope.f_tien);
					r.tien_ck = STP.round(r.tien_ck_nt * newData,scope.f_tien);

          r.gia_von_nk = STP.round(r.gia_von_nk_nt * newData,scope.f_tien);
          r.tien_hang_nk = STP.round(r.tien_hang_nk_nt * newData,scope.f_tien);
          r.tien_thue_nk = STP.round(r.tien_thue_nk_nt * newData,scope.f_tien);

					r.tt = STP.round(r.tt_nt * newData,scope.f_tien);
				});
			}
		}
	});
}
