var bg2Module = new baseVoucher('bg2','bg2',[],'Báo giá của nhà cung cấp',{
    onLoading:function($scope,$options){
      $scope.tinhtienhang = function(nrow,data){
          var ty_gia = 1;
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
          nrow.gia_von_nk = STP.round(nrow.gia_von_nk_nt* ty_gia,f_tien);

          nrow.tien_hang_nk_nt = STP.round(nrow.gia_von_nk_nt* nrow.so_luong,f_tien_nt);
          nrow.tien_hang_nk = STP.round(nrow.tien_hang_nk_nt* ty_gia,f_tien);

          nrow.tien_thue_nk_nt = STP.round(nrow.thue_suat_nk * nrow.tien_hang_nk_nt/100,f_tien_nt);
          nrow.tien_thue_nk = STP.round(nrow.tien_thue_nk_nt* ty_gia,f_tien);
          //tong tien
          nrow.tt_nt = nrow.tien_nt - nrow.tien_ck_nt+ nrow.tien_thue_nk_nt;
          nrow.tt = nrow.tien - nrow.tien_ck + nrow.tien_thue_nk;
      }

        $scope.createContract = function(baogia){
            var _contract = JSON.parse(JSON.stringify(baogia));

            _contract.id_bao_gia = _contract._id;
            delete _contract._id;
            delete _contract.so_ct;

            purchase_contractModule.quickadd($options.$uibModal,function(ct){
                baogia.id_contract = ct._id;

                $options.service.get(id_app,baogia._id).then(function(res){
                  _.extend(baogia,res.data);
                })

            },_contract);
        }
        $scope.createBG1 = function(baogia){
            var bg1 = JSON.parse(JSON.stringify(baogia));

            bg1.details.forEach(function(d){
                d.gia = d.gia_ban_de_nghi;
                d.gia_nt = d.gia_ban_de_nghi_nt;
                d.tien = d.gia *d.so_luong;
                d.tien_nt = d.gia_nt*d.so_luong;
                d.tien_ck=0;
                d.tien_ck_nt=0;
                d.ty_le_ck =0;
                d.tt =0;
                d.tt_nt=0;

            })
            bg1.id_bao_gia_mua = bg1._id;
            bg1.ma_kh ='';
            bg1.ten_kh='';

            delete bg1._id;
            bg1Module.quickadd($options.$uibModal,function(ct){
                baogia.id_bao_gia_mua = ct._id;

                $options.service.get(id_app,baogia._id).then(function(res){
                  _.extend(baogia,res.data);
                })

            },bg1);
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

            if(bg2Module.defaultValues4Detail){
                for(var key in bg2Module.defaultValues4Detail){
                    nrow[key] =bg2Module.defaultValues4Detail[key];
                }

            }
            if($scope.data.options){
                for(var key in $scope.data.options){
                    if($scope.data.options[key])
                        nrow[key] =$scope.data.options[key];
                }

            }
            nrow.thue_suat_nk = item.thue_suat_nk||0;
            nrow.so_luong = 1;
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
                        nrow.gia = STP.round(gia*ty_gia,$scope.f_tien);
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
            nrow.gia_von_nk = STP.round(nrow.gia_von_nk_nt* ty_gia,$scope.f_tien);

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
bg2Module.defaultValues ={

}
bg2Module.defaultValues4Detail = {
	so_luong:0,
	ty_le_ck:0,
	gia_nt:0,gia:0,
	tien_nt:0,tien:0,
	tien_ck_nt:0,tien_ck:0,
    tien_hang_nk:0,tien_hang_nk_nt:0,tien_thue_nk:0,tien_thue_nk_nt:0,thue_suat_nk:0,
	tt_nt:0,tt:0
}
bg2Module.defaultCondition4Search = {tu_ngay:new Date(),den_ngay:new Date(),so_ct:'',dien_giai:'',ma_kh:''};
bg2Module.prepareCondition4Search = function($scope,vcondition){
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
/*bg2Module.watchDetail = function(scope){
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
			scope.dt_current.tt_nt = scope.dt_current.tien_nt - scope.dt_current.tien_ck_nt;
		}
	});
	scope.$watch('dt_current.tien',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_ck = STP.round(scope.dt_current.tien * scope.dt_current.ty_le_ck/100,0);
			scope.dt_current.tt = scope.dt_current.tien - scope.dt_current.tien_ck ;
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
			scope.dt_current.tt_nt = scope.dt_current.tien_nt - scope.dt_current.tien_ck_nt;
		}
	});

	scope.$watch('dt_current.tien_ck',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tt = scope.dt_current.tien - scope.dt_current.tien_ck;
		}
	});

}*/
bg2Module.watchMaster = function($scope,options){
	$scope.$watch('data.ty_gia',function(newData){
		if($scope.data){
			if(newData!=undefined && $scope.isDataLoaded){
				angular.forEach($scope.data.details,function(r){
					r.gia = STP.round(r.gia_nt * newData,$scope.f_gia);
					r.tien = STP.round(r.tien_nt * newData,$scope.f_tien);

					r.tien_ck = STP.round(r.tien_ck_nt * newData,$scope.f_tien);

          r.gia_von_nk = STP.round(r.gia_von_nk_nt * newData,$scope.f_tien);
          r.tien_hang_nk = STP.round(r.tien_hang_nk_nt * newData,$scope.f_tien);
          r.tien_thue_nk = STP.round(r.tien_thue_nk_nt * newData,$scope.f_tien);

					r.tt = STP.round(r.tt_nt * newData,$scope.f_tien);
				});
			}
		}
	});
}
