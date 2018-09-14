var shipbookModule = new baseVoucher('shipbook','shipbook',[],'Book tàu',{
     onLoading:function($scope,$options){
        STPModules['trangthai'].obj.getService($options.$http, $options.$q, $options.$rootScope).load(id_app, {
          filter: {
            ma_ct: 'SHIPBOOK'
          }
        }).then(function(res) {
          $scope.trang_thai = res.data;
        })

        $scope.createPN = function(contract){
            var hd = {};
            _.extend(hd,contract);
            hd.id_contract = hd._id;
            hd.ngay_ct = new Date();
            delete hd.so_ct;
            delete hd._id;
            var kieu_pn =0;
            hd.details.forEach(function(d){
                d.sl_nhap = d.so_luong;
                d.gia_von = d.gia;
                d.gia_von_nt = d.gia_nt;
                d.tien_hang = d.tien;
                d.tien_hang_nt = d.tien_nt;
                d.tien_ck = d.tien_ck||0;
                d.tien_ck_nt = d.tien_ck_nt||0;
                d.tien_phi = d.tien_phi||0;
                d.tien_phi_nt = d.tien_phi_nt||0;
                //nhap khau
                d.gia_von_nk =  d.gia_von_nk||0;
                d.gia_von_nk_nt = d.gia_von_nk_nt||0;

                d.tien_hang_nk =  d.tien_hang_nk||0;
                d.tien_hang_nk_nt =  d.tien_hang_nk_nt||0;
                d.thue_suat_nk =  d.thue_suat_nk||0;
                d.tien_thue_nk= d.tien_hang_nk||0;
                d.tien_thue_nk_nt =  d.tien_hang_nk_nt||0;

                if(d.tien_hang_nk_nt || d.tien_thue_nk_nt){
                    kieu_pn =1;
                }
                //tong cong
                d.tien_nhap = d.tien_hang - d.tien_ck + d.tien_phi + d.tien_thue_nk;
                d.tien_nhap_nt = d.tien_hang_nt-d.tien_ck_nt + d.tien_phi_nt + d.tien_thue_nk_nt;
            })
            var pn = kieu_pn?pn9Module:pn1Module;
            pn.quickadd($options.$uibModal,function(ct){
                if(kieu_pn){
                     contract.id_pn9 = ct._id;
                }else{
                     contract.id_pn1 = ct._id;
                }
            },hd);
        }
    },
    onInput:function($scope,$options){
        STPModules['trangthai'].obj.getService($options.$http, $options.$q, $options.$rootScope).load(id_app, {
          filter: {
            ma_ct: 'SHIPBOOK'
          }
        }).then(function(res) {
          $scope.ds_trang_thai = res.data;
        })
        $scope.phanbo = function(){
          var tong_so_luong = 0;
          //var round = ($scope.data.ma_nt==='VND'?0:2);
          $scope.data.details.forEach(function(detail){
            tong_so_luong = tong_so_luong + (detail.so_luong||0);
          })
          var stt =0,da_pb_nt=0;
          $scope.data.details.forEach(function(detail){
            detail.tien_nt = (tong_so_luong===0?0: STP.round((detail.so_luong/tong_so_luong) * $scope.data.tien_cuoc_nt,$scope.f_tien_nt))
            detail.tien = STP.round(detail.tien_nt * $scope.data.ty_gia,$scope.f_tien);
            //tinh lai gia
            detail.gia_nt = detail.so_luong?STP.round(detail.tien_nt/detail.so_luong,$scope.f_gia_nt):0;
            detail.gia = STP.round(detail.gia_nt * $scope.data.ty_gia,$scope.f_gia);
            //xy ly chenh lech
            da_pb_nt = da_pb_nt+detail.tien_nt;
            stt+=1;
            if(stt==$scope.data.details.length){
              detail.tien_nt = detail.tien_nt + ($scope.data.tien_cuoc_nt-da_pb_nt);
              detail.tien = STP.round(detail.tien_nt * $scope.data.ty_gia,$scope.f_tien);
            }

          })

        }
        $scope.phanboProfitshare = function(){
          var round = ($scope.data.ma_nt==='VND'?0:2);
          var tong_so_luong = 0;
          $scope.data.details.forEach(function(detail){
            tong_so_luong = tong_so_luong + (detail.so_luong||0);
          })

          var stt =0,da_pb_nt=0;
          $scope.data.details.forEach(function(detail){
            if(!detail.exfields_detail) detail.exfields_detail ={};
            detail.exfields_detail.tien_phi_nt = (tong_so_luong===0?0: STP.round((detail.so_luong/tong_so_luong) * ($scope.data.exfields.tien_phi_nt||0),$scope.f_tien_nt))
            detail.exfields_detail.tien_phi = STP.round(detail.exfields_detail.tien_phi_nt * $scope.data.ty_gia,$scope.f_tien);

            //xy ly chenh lech
            da_pb_nt = da_pb_nt+detail.exfields_detail.tien_phi_nt;
            stt+=1;
            if(stt==$scope.data.details.length){
              detail.exfields_detail.tien_phi_nt = detail.exfields_detail.tien_phi_nt + ($scope.data.exfields.tien_phi_nt-da_pb_nt);
              detail.exfields_detail.tien_phi = STP.round(detail.exfields_detail.tien_phi_nt * $scope.data.ty_gia,$scope.f_tien);
            }
          })

        }
        $scope.phanboPhiKhac = function(){
          var round = ($scope.data.ma_nt==='VND'?0:2);
          var tong_so_luong = 0;
          $scope.data.details.forEach(function(detail){
            tong_so_luong = tong_so_luong + (detail.so_luong||0);
          })

          var stt =0,da_pb_nt=0;
          $scope.data.details.forEach(function(detail){
            if(!detail.exfields_detail) detail.exfields_detail ={};
            detail.exfields_detail.tien_phi_khac_nt = (tong_so_luong===0?0: STP.round((detail.so_luong/tong_so_luong) * ($scope.data.exfields.tien_phi_khac_nt||0),$scope.f_tien_nt))
            detail.exfields_detail.tien_phi_khac = STP.round(detail.exfields_detail.tien_phi_khac_nt * $scope.data.ty_gia,$scope.f_tien);

            //xy ly chenh lech
            da_pb_nt = da_pb_nt+detail.exfields_detail.tien_phi_khac_nt;
            stt+=1;
            if(stt==$scope.data.details.length){
              detail.exfields_detail.tien_phi_khac_nt = detail.exfields_detail.tien_phi_khac_nt + ($scope.data.exfields.tien_phi_khac_nt-da_pb_nt);
              detail.exfields_detail.tien_phi_khac = STP.round(detail.exfields_detail.tien_phi_khac_nt * $scope.data.ty_gia,$scope.f_tien);
            }
          })

        }

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
            if(shipbookModule.defaultValues4Detail){
                for(var key in shipbookModule.defaultValues4Detail){
                    nrow[key] =shipbookModule.defaultValues4Detail[key];
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
                        nrow.gia = gia*ty_gia;
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
            var round = 2;
            if(ty_gia==1) round =0;
            nrow.gia =  STP.round(nrow.gia_nt* ty_gia,$scope.f_gia);

            nrow.tien_nt =  STP.round(nrow.so_luong * nrow.gia_nt,$scope.f_tien_nt);
            nrow.tien =  STP.round(nrow.tien_nt* ty_gia,$scope.f_tien);
            //chiet khau
            nrow.tien_ck_nt = STP.round(nrow.tien_nt  * nrow.ty_le_ck/100,$scope.f_tien_nt);
            nrow.tien_ck = STP.round(nrow.tien_ck_nt* ty_gia,$scope.f_tien);
            //nhap khau
            nrow.thue_suat_nk = nrow.thue_suat_nk||0;
            nrow.gia_von_nk_nt = nrow.gia_von_nk_nt||(nrow.thue_suat_nk?nrow.gia_nt:0);
            nrow.gia_von_nk = STP.round(nrow.gia_von_nk_nt* ty_gia,$scope.f_gia);

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
                    $options.$rootScope.toast("Đã thêm sản phẩm " + nrow.ten_vt);
                }
            });

        }
    }
});
shipbookModule.defaultValues ={
    trang_thai:'1',
    ngay_sx:new Date(),
    ngay_tau_di:new Date(),
    tien_cuoc_nt:0,
    tien_cuoc:0,
    t_thue:0,
    t_thue_nt:0,
    tien_cuoc_ck:0,
    tien_cuoc_ck_nt:0,
    ty_le_cuoc_ck:0
}
shipbookModule.defaultValues4Detail = {
	so_luong:0,
	ty_le_ck:0,
	gia_nt:0,gia:0,
	tien_nt:0,tien:0,
	tien_ck_nt:0,tien_ck:0,
    tien_hang_nk:0,tien_hang_nk_nt:0,tien_thue_nk:0,tien_thue_nk_nt:0,thue_suat_nk:0,
	tt_nt:0,tt:0
}
shipbookModule.defaultCondition4Search = {tu_ngay:new Date(),den_ngay:new Date(),so_ct:'',dien_giai:'',ma_kh:''};
shipbookModule.prepareCondition4Search = function($scope,vcondition){
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
