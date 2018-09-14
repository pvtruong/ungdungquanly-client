var pn9Module = new baseVoucher('pn9','pn9',[],'Phiếu nhập khẩu',{
    onLoading:function($scope,$option){
      $scope.tinhtienhang = function(nrow,data){
          var ty_gia =1;
          if(data.ty_gia) ty_gia =data.ty_gia;

          var f_gia = (data.ma_nt=='VND'?$option.$rootScope.app_info.options.f_gia:$option.$rootScope.app_info.options.f_gia_nt);
          var f_tien_nt =(data.ma_nt=='VND'?$option.$rootScope.app_info.options.f_tien:$option.$rootScope.app_info.options.f_tien_nt);
          var f_tien = $option.$rootScope.app_info.options.f_tien;

          nrow.tien_hang_nt =  STP.round(nrow.sl_nhap * nrow.gia_von_nt,f_tien_nt);
          nrow.tien_hang =  STP.round(nrow.tien_hang_nt* ty_gia,f_tien);

          nrow.tien_hang_nk_nt =  STP.round(nrow.sl_nhap * nrow.gia_von_nk_nt,f_tien_nt);
          nrow.tien_hang_nk =  STP.round(nrow.tien_hang_nk_nt* ty_gia,f_tien);
          //thue nhap khau
          nrow.tien_thue_nk_nt = STP.round(nrow.tien_hang_nk_nt*nrow.thue_suat_nk/100,f_tien_nt);
          nrow.tien_thue_nk =  STP.round(nrow.tien_thue_nk_nt* ty_gia,f_tien);
          //chiet khau
          nrow.tien_ck_nt = STP.round(nrow.tien_hang_nt  * nrow.ty_le_ck/100,f_tien_nt) ;
          nrow.tien_ck = STP.round(nrow.tien_ck_nt* ty_gia,f_tien);

          //tong tien
          nrow.tien_nhap_nt = nrow.tien_hang_nt - nrow.tien_ck_nt+nrow.tien_thue_nk_nt + nrow.tien_phi_nt;
          nrow.tien_nhap = nrow.tien_hang - nrow.tien_ck+nrow.tien_thue_nk + nrow.tien_phi;
      }
    },
     onInput:function($scope,$options){
        var ty_gia =1;
        $scope.ma_ntChange = function(newData){
            if(!newData) return;
            if(!$options.app_info.options) $options.app_info.options ={};
            if(newData===1){
               $scope.f_tien_nt = $options.app_info.options.f_tien||0;
               $scope.f_gia_nt = $options.app_info.options.f_gia||0;
            }else{
               $scope.f_tien_nt = $options.app_info.options.f_tien_nt||2;
               $scope.f_gia_nt = $options.app_info.options.f_gia_nt||2;
            }

            $scope.round =   $scope.f_tien_nt;

            angular.forEach($scope.data.details,function(r){
    					r.gia_von_nt = STP.round(r.gia_von / newData,$scope.f_gia_nt);

              r.gia_von_nk_nt = STP.round(r.gia_von_nk / newData,$scope.f_gia_nt);

    					r.tien_hang_nt = STP.round(r.tien_hang / newData,$scope.f_tien_nt);

              r.tien_hang_nk_nt = STP.round(r.tien_hang_nk / newData,$scope.f_tien_nt);

    					r.tien_phi_nt = STP.round(r.tien_phi / newData,$scope.f_tien_nt);
    					r.tien_ck_nt = STP.round(r.tien_ck / newData,$scope.f_tien_nt);

              r.tien_thue_nk_nt = STP.round(r.tien_thue_nk / newData,$scope.f_tien_nt);

    					r.tien_nhap_nt = STP.round(r.tien_nhap / newData,$scope.f_tien_nt);
    				});
    				angular.forEach($scope.data.vatvaos,function(r){
    					r.t_tien_nt = STP.round(r.t_tien / newData,$scope.f_tien_nt);
    					r.t_thue_nt = STP.round(r.t_thue / newData,$scope.f_tien_nt);

    				});
    				angular.forEach($scope.data.ctcpmhs,function(r){
    					r.tien_cp_nt = STP.round(r.tien_cp / newData,$scope.f_tien_nt);

    				});

            $scope.data.ty_gia = newData;
        }
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
                nrow.sl_nhap =Number(nrow.sl_nhap) + 1;
                return callback(nrow);
            }else{
                nrow = {ma_vt:item.ma_vt,ten_vt:item.ten_vt,ma_dvt:item.ma_dvt,tk_vt:item.tk_vt,

                        ma_lo:item.ma_lo,han_sd:item.han_sd,ma_tt1:item.ma_tt1,ma_tt2:item.ma_tt2,ma_tt3:item.ma_tt3}
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
                nrow.thue_suat_nk=(item.thue_suat_nk||0);
                $options.$rootScope.prompt("Giá mua:",item.gia_mua?item.gia_mua:0).then(function(result){
                    if(result.buttonIndex==1){
                        var gia_von = result.input1;
                        if(gia_von==null) return callback();
                        gia_von = Number(gia_von);

                        if(gia_von){
                            if(item.gia_mua!==gia_von){
                                item.gia_mua = gia_von
                                var url = server_url + "/api/" + id_app + "/dmvt/" + item._id;
                                $options.$http.put(url,item).then(function(res){
                                   // console.log('Gia mua san pham' + item.ma_vt + ' da duoc cap nhat');
                                },function(res){
                                    console.log("can't update price for product",res.data);
                                });
                            }
                            nrow.gia_von = STP.round(gia_von*ty_gia,$scope.f_gia);
                            nrow.gia_von_nt = gia_von;

                            nrow.gia_von_nk = STP.round(gia_von*ty_gia,$scope.f_gia);
                            nrow.gia_von_nk_nt = gia_von;


                        }
                        nrow.ty_le_ck = 0;
                        //tien phi
                        nrow.tien_phi_nt = 0;
                        nrow.tien_phi = 0;
                        nrow.line = $scope.data.details.length;
                        nrow.thue_suat_nk = item.thue_suat_nk?item.thue_suat_nk:0;
                        $scope.data.details.push(nrow);
                        callback(nrow);
                    }else{
                        callback();
                    }
                });

            }

        }
        $scope.tinhtienhang = function(nrow){
            if($scope.data.ty_gia){
                ty_gia = $scope.data.ty_gia;
            }

            nrow.tien_hang_nt =  STP.round(nrow.sl_nhap * nrow.gia_von_nt,$scope.f_tien_nt);
            nrow.tien_hang =  STP.round(nrow.tien_hang_nt* ty_gia,$scope.f_tien);

            nrow.tien_hang_nk_nt =  STP.round(nrow.sl_nhap * nrow.gia_von_nk_nt,$scope.f_tien_nt);
            nrow.tien_hang_nk =  STP.round(nrow.tien_hang_nk_nt* ty_gia,$scope.f_tien);
            //thue nhap khau
            nrow.tien_thue_nk_nt = STP.round(nrow.tien_hang_nk_nt*nrow.thue_suat_nk/100,$scope.f_tien_nt);
            nrow.tien_thue_nk =  STP.round(nrow.tien_thue_nk_nt* ty_gia,$scope.f_tien);
            //chiet khau
            nrow.tien_ck_nt = STP.round(nrow.tien_hang_nt  * nrow.ty_le_ck/100,$scope.f_tien_nt) ;
            nrow.tien_ck = STP.round(nrow.tien_ck_nt* ty_gia,$scope.f_tien);

            //tong tien
            nrow.tien_nhap_nt = nrow.tien_hang_nt - nrow.tien_ck_nt+nrow.tien_thue_nk_nt + nrow.tien_phi_nt;
            nrow.tien_nhap = nrow.tien_hang - nrow.tien_ck+nrow.tien_thue_nk + nrow.tien_phi;
            pn9Module.tinhCkvt($options.$http,$scope.data,nrow);
        }
        $scope.select = function(item){
            addSPMOI(item,function(nrow){
                if(!nrow) return;
                $scope.tinhtienhang(nrow);
                //$options.$rootScope.toast("Đã thêm sản phẩm " + nrow.ten_vt);
            });
        }
    }
});
pn9Module.defaultValues ={
	vatvaos:[]
}
pn9Module.defaultValues4Detail = {
	sl_nhap:0,
	ty_le_ck:0,
	gia_von_nt:0,gia_von:0,
	tien_hang_nt:0,tien_hang:0,
	tien_ck_nt:0,tien_ck:0,

	tien_von_nk_nt:0,tien_von_nk:0,
	tien_hang_nk_nt:0,tien_hang_nk:0,
	thue_suat_nk:0,
	tien_thue_nk_nt:0,tien_thue_nk:0,

	tien_phi_nt:0,tien_phi:0,
	tien_nhap_nt:0,tien_nhap:0
}
pn9Module.defaultCondition4Search = {tu_ngay:new Date(),den_ngay:new Date(),so_ct:'',dien_giai:'',ma_kh:''};
pn9Module.prepareCondition4Search = function($scope,vcondition){
	var _c =  {
		so_ct:{$regex:$scope.vcondition.so_ct,$options:'i'},
		dien_giai:{$regex:$scope.vcondition.dien_giai,$options:'i'},
		ma_kh:{$regex:$scope.vcondition.ma_kh,$options:'i'},
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
pn9Module.watchDetail = function(scope){
	scope.$watch('dt_current.sl_nhap',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_hang_nt = STP.round( scope.dt_current.sl_nhap * scope.dt_current.gia_von_nt,scope.f_tien_nt);
			scope.dt_current.tien_hang_nk_nt = STP.round( scope.dt_current.sl_nhap * scope.dt_current.gia_von_nk_nt,scope.f_tien_nt);
		}
	});

	scope.$watch('dt_current.gia_von_nt',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.gia_von = STP.round(scope.dt_current.gia_von_nt * scope.ngMasterData.ty_gia,scope.f_gia);
			scope.dt_current.tien_hang_nt = STP.round(scope.dt_current.gia_von_nt * scope.dt_current.sl_nhap,scope.f_tien_nt);
			scope.dt_current.gia_von_nk_nt = scope.dt_current.gia_von_nt;
		}
	});
	scope.$watch('dt_current.gia_von',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_hang = STP.round(scope.dt_current.gia_von * scope.dt_current.sl_nhap,scope.f_tien);
		}
	});

	scope.$watch('dt_current.gia_von_nk_nt',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.gia_von_nk = STP.round(scope.dt_current.gia_von_nk_nt * scope.ngMasterData.ty_gia,scope.f_gia);
			scope.dt_current.tien_hang_nk_nt = STP.round(scope.dt_current.gia_von_nk_nt * scope.dt_current.sl_nhap,scope.f_tien_nt);
		}
	});
	scope.$watch('dt_current.gia_von_nk',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_hang_nk = STP.round(scope.dt_current.gia_von_nk * scope.dt_current.sl_nhap,scope.f_tien);
		}
	});

	scope.$watch('dt_current.tien_hang_nt',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_hang = STP.round(scope.dt_current.tien_hang_nt * scope.ngMasterData.ty_gia,scope.f_tien);
			scope.dt_current.tien_ck_nt = STP.round(scope.dt_current.tien_hang_nt * scope.dt_current.ty_le_ck/100,scope.f_tien_nt);
			scope.dt_current.tien_nhap_nt = scope.dt_current.tien_hang_nt - scope.dt_current.tien_ck_nt + scope.dt_current.tien_phi_nt + scope.dt_current.tien_thue_nk_nt;
		}
	});
	scope.$watch('dt_current.tien_hang',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_ck = STP.round(scope.dt_current.tien_hang * scope.dt_current.ty_le_ck/100,scope.f_tien);
			scope.dt_current.tien_nhap = scope.dt_current.tien_hang - scope.dt_current.tien_ck + scope.dt_current.tien_phi + scope.dt_current.tien_thue_nk;
		}
	});

	scope.$watch('dt_current.tien_hang_nk_nt',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_hang_nk = STP.round(scope.dt_current.tien_hang_nk_nt * scope.ngMasterData.ty_gia,scope.f_tien_nt);
			scope.dt_current.tien_thue_nk_nt = STP.round(scope.dt_current.tien_hang_nk_nt*scope.dt_current.thue_suat_nk/100,scope.f_tien_nt);
		}
	});
	scope.$watch('dt_current.tien_hang_nk',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_thue_nk = STP.round(scope.dt_current.tien_hang_nk*scope.dt_current.thue_suat_nk/100,scope.f_tien);
		}
	});

	scope.$watch('dt_current.thue_suat_nk',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_thue_nk_nt = STP.round(scope.dt_current.tien_hang_nk_nt*scope.dt_current.thue_suat_nk/100,scope.f_tien_nt);
		}
	});

	scope.$watch('dt_current.tien_thue_nk_nt',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_thue_nk = STP.round(scope.dt_current.tien_thue_nk_nt * scope.ngMasterData.ty_gia,scope.f_tien);
			scope.dt_current.tien_nhap_nt = scope.dt_current.tien_hang_nt - scope.dt_current.tien_ck_nt + scope.dt_current.tien_phi_nt + scope.dt_current.tien_thue_nk_nt;
		}
	});
	scope.$watch('dt_current.tien_thue_nk',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_nhap = scope.dt_current.tien_hang - scope.dt_current.tien_ck + scope.dt_current.tien_phi + scope.dt_current.tien_thue_nk;
		}
	});

	scope.$watch('dt_current.ty_le_ck',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_ck_nt = STP.round(scope.dt_current.tien_hang_nt * scope.dt_current.ty_le_ck/100,scope.f_tien_nt);
		}
	});

	scope.$watch('dt_current.tien_ck_nt',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_ck = STP.round(scope.dt_current.tien_ck_nt * scope.ngMasterData.ty_gia,scope.f_tien);
			scope.dt_current.tien_nhap_nt = scope.dt_current.tien_hang_nt - scope.dt_current.tien_ck_nt + scope.dt_current.tien_phi_nt;
		}
	});

	scope.$watch('dt_current.tien_ck',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_nhap = scope.dt_current.tien_hang - scope.dt_current.tien_ck + scope.dt_current.tien_phi;
		}
	});
	scope.$watch('dt_current.tien_phi_nt',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_phi = STP.round(scope.dt_current.tien_phi_nt * scope.ngMasterData.ty_gia,scope.f_tien);
			scope.dt_current.tien_nhap_nt = scope.dt_current.tien_hang_nt - scope.dt_current.tien_ck_nt + scope.dt_current.tien_phi_nt;
		}
	});

	scope.$watch('dt_current.tien_phi',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_nhap = scope.dt_current.tien_hang - scope.dt_current.tien_ck + scope.dt_current.tien_phi;
		}
	});
}
pn9Module.watchMaster = function(scope,options){
	//phan bo chi phi
	scope.allocate = function(allocate_by_field){
		var t_cp_nt = scope.data.t_cp_cpb_nt;
		var t_cp = scope.data.t_cp_cpb;

		//
		var mau =0;
		for(var i=0;i<scope.data.details.length;i++){
			mau = mau + scope.data.details[i][allocate_by_field];
		}
		if(mau!=0){
      var da_pb_nt=0,da_pb=0,i=0;
			for(i=0;i<scope.data.details.length;i++){
				scope.data.details[i]["tien_phi_nt"] =  STP.round( (scope.data.details[i][allocate_by_field]/mau) * t_cp_nt,scope.f_tien_nt);

				scope.data.details[i]["tien_phi"] = STP.round( (scope.data.details[i][allocate_by_field]/mau) * t_cp,scope.f_tien);
        //dieu chinh chenh lech cho dong cuoi cung
				da_pb_nt = da_pb_nt + scope.data.details[i]["tien_phi_nt"];
				da_pb = da_pb + scope.data.details[i]["tien_phi"];
				if(i===scope.data.details.length-1){
					scope.data.details[i]["tien_phi_nt"] = scope.data.details[i]["tien_phi_nt"] + (t_cp_nt-da_pb_nt);
					scope.data.details[i]["tien_phi"] = scope.data.details[i]["tien_phi"] + (t_cp-da_pb);
				}
        //tinh tien nhap
				scope.data.details[i].tien_nhap_nt = scope.data.details[i].tien_hang_nt - scope.data.details[i].tien_ck_nt + scope.data.details[i].tien_phi_nt;
				scope.data.details[i].tien_nhap =  scope.data.details[i].tien_hang - scope.data.details[i].tien_ck + scope.data.details[i].tien_phi;
			}
		}
		if(options.$rootScope.platform()==="browser"){
            options.$rootScope.alert("Chương trình đã thực hiện xong");
        }else{
            options.$rootScope.toast("Chương trình đã thực hiện xong");
        }

	}
	/*scope.$watch('data.ty_gia',function(newData){
		if(scope.data){
			if(newData!=undefined && scope.isDataLoaded){
				angular.forEach(scope.data.details,function(r){
					r.gia_von = STP.round(r.gia_von_nt * newData,0);
					r.tien_hang = STP.round(r.tien_hang_nt * newData,0);
					r.tien_phi = STP.round(r.tien_phi_nt * newData,0);
					r.tien_ck = STP.round(r.tien_ck_nt * newData,0);

					r.tien_nhap = STP.round(r.tien_nhap_nt * newData,0);
				});
				angular.forEach(scope.data.vatvaos,function(r){
					r.t_tien = STP.round(r.t_tien_nt * newData,0);
					r.t_thue = STP.round(r.t_thue_nt * newData,0);

				});
				angular.forEach(scope.data.ctcpmhs,function(r){
					r.tien_cp = STP.round(r.tien_cp_nt * newData,0);

				});
			}
		}
	});*/
}
