var hd2Module = new baseVoucher('hd2','hd2',[],'Hóa đơn bán hàng',{
    onLoading:function($scope,$option){
      $scope.tinhtienhang = function(r,data){
          if(!data.ty_gia) data.ty_gia =1;

          var f_gia = (data.ma_nt=='VND'?$option.$rootScope.app_info.options.f_gia:$option.$rootScope.app_info.options.f_gia_nt);
          var f_tien_nt =(data.ma_nt=='VND'?$option.$rootScope.app_info.options.f_tien:$option.$rootScope.app_info.options.f_tien_nt);
          var f_tien = $option.$rootScope.app_info.options.f_tien;

          //tien hang
          r.tien_nt = STP.round(r.sl_xuat * r.gia_ban_nt,f_tien_nt);
          r.tien = STP.round(r.tien_nt * data.ty_gia,f_tien);
          //chiet khau
          r.tien_ck_nt = STP.round(r.tien_nt * r.ty_le_ck/100,f_tien_nt);
          r.tien_ck = STP.round(r.tien_ck_nt* data.ty_gia,f_tien);
          //tien von
          r.tien_xuat_nt =STP.round(r.sl_xuat * (r.gia_von?r.gia_von:0),f_tien);
          r.tien_xuat =r.tien_xuat_nt;
      }
    },
    onInput:function($scope,$options){
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
            r.gia_ban_nt = STP.round(r.gia_ban / newData,$scope.round);

  					r.tien_nt = STP.round(r.tien / newData,$scope.round);
  					r.tien_ck_nt = STP.round(r.tien_ck / newData,$scope.round);
  				});
  				$scope.data.t_thue_nt = STP.round($scope.data.t_thue/ newData,$scope.round)

          $scope.data.ty_gia = newData;
        }
        $scope.tinhtienhang = function(r){
            if(!$scope.data.ty_gia) $scope.data.ty_gia =1;
            //tien hang
            r.tien_nt = STP.round(r.sl_xuat * r.gia_ban_nt,$scope.f_tien_nt);
            r.tien = STP.round(r.tien_nt * $scope.data.ty_gia,$scope.f_tien);
            //chiet khau
            r.tien_ck_nt = STP.round(r.tien_nt * r.ty_le_ck/100,$scope.f_tien_nt);
            r.tien_ck = STP.round(r.tien_ck_nt* $scope.data.ty_gia,$scope.f_tien);
            //tien von
            r.tien_xuat_nt =STP.round(r.sl_xuat * (r.gia_von?r.gia_von:0),$scope.f_tien);
            r.tien_xuat =r.tien_xuat_nt;
            hd2Module.tinhCkvt($options.$http,$scope.data,r);
        }
        $scope.updateRows = function(){
            $scope.data.details.forEach(function(item){
                $scope.select(item,item.sl_xuat)
            })
        }
        $scope.select = function(item,up){
            var ty_le_ck,tien_ck,tu,sl_xuat=0;
            if(!$scope.data.ty_gia) $scope.data.ty_gia =1;

            $scope.dt_current ={};
            var f = _.filter($scope.data.details,function(i){
                return i.ma_vt==item.ma_vt
                    && (i.ma_lo==item.ma_lo || (!i.ma_lo && !item.ma_lo))
                    && (i.han_sd==item.han_sd || (!i.han_sd && !item.han_sd))
                    && (i.ma_tt1 ==item.ma_tt1 || (!i.ma_tt1 && !item.ma_tt1))
                    && (i.ma_tt2 ==item.ma_tt2 || (!i.ma_tt2 && !item.ma_tt2))
                    && (i.ma_tt3 ==item.ma_tt3 || (!i.ma_tt3 && !item.ma_tt3));
            })
            if(f.length>0){
                $scope.dt_current = f[0];
                $scope.dt_current.sl_xuat =(up!==undefined && up!==null)?up:$scope.dt_current.sl_xuat + 1;
                $scope.dt_current.gia_ban = STP.round($scope.dt_current.gia_ban_nt * $scope.data.ty_gia,$scope.f_gia)

                if(!$scope.dt_current.cs_ck1) $scope.dt_current.cs_ck1 = {ty_le_ck:0,tien_ck:0};
            }else{
                $scope.dt_current = {ma_vt:item.ma_vt
                  ,ten_vt:item.ten_vt
                  ,ma_dvt:item.ma_dvt
                  ,tk_vt:item.tk_vt
                  ,tk_dt:item.tk_dt
                  ,tk_gv:item.tk_gv
                  ,tk_ck:item.tk_ck
                  ,ma_lo:item.ma_lo
                  ,han_sd:item.han_sd
                  ,ma_tt1:item.ma_tt1
                  ,ma_tt2:item.ma_tt2
                  ,ma_tt3:item.ma_tt3
                }
                if(hd2Module.defaultValues4Detail){
                    _.extend($scope.dt_current,hd2Module.defaultValues4Detail);
                }
                if($scope.data.options){
                    for(var key in $scope.data.options){
                        if($scope.data.options[key]){
                            $scope.dt_current[key] = $scope.data.options[key];
                        }
                    }
                }
                $scope.dt_current.sl_xuat=(up!==undefined && up!==null)?up:1;
                $scope.dt_current.gia_ban_nt= item.gia_ban_nt || item.gia_ban_le;
                $scope.dt_current.gia_ban = STP.round($scope.dt_current.gia_ban_nt * $scope.data.ty_gia,$scope.f_gia);

                $scope.dt_current.gia_von_nt= item.gia_von_nt || item.gia_mua;
                $scope.dt_current.gia_von = $scope.dt_current.gia_von_nt;


                $scope.dt_current.line = $scope.data.details.length;

                if(up!==0)
                $scope.data.details.push($scope.dt_current);



                $scope.dt_current.cs_ck1 = item.cs_ck1 || {ty_le_ck:item.ty_le_ck,tien_ck:item.tien_ck};
                $scope.dt_current.cs_ck2 = item.cs_ck2 || item.ck_sl_tu2;
                $scope.dt_current.cs_km = item.cs_km || item.promotion;
            }
            //caculate discount rate
            ty_le_ck = $scope.dt_current.cs_ck1.ty_le_ck
            tien_ck = $scope.dt_current.cs_ck1.tien_ck


            $scope.data.details.forEach(function(r){
                if(r.ma_vt === $scope.dt_current.ma_vt){
                    sl_xuat = r.sl_xuat + sl_xuat;
                }
            })

            /*if(sl_xuat>1 && $scope.dt_current.cs_ck2 && $scope.dt_current.cs_ck2.length>0){
               tu = _.filter($scope.dt_current.cs_ck2,function(s){
                   return s.sl_tu<=sl_xuat && (!s.sl_den || s.sl_den>=sl_xuat);
               });
               if(tu.length>0){
                   tu = _.sortBy(tu,function(r){
                       return -r.sl_tu;
                   })
                   ty_le_ck = tu[0].ty_le_ck;
                   tien_ck = tu[0].tien_ck;
               }
            }*/
            if($scope.dt_current.cs_ck2 && $scope.dt_current.cs_ck2.length>0){
               //find discount by kh
               tu = _.filter($scope.dt_current.cs_ck2,function(s){
                   return s.sl_tu<=sl_xuat && (!s.sl_den || s.sl_den>=sl_xuat) && (s.ma_kh===$scope.data.ma_kh || s.nh_kh===$scope.data.nh_kh);
               });
               //find discount genaral
               if(tu.length==0){
                   tu = _.filter($scope.dt_current.cs_ck2,function(s){
                       return s.sl_tu<=sl_xuat && (!s.sl_den || s.sl_den>=sl_xuat) && (!s.ma_kh && !s.nh_kh);
                   });
               }
               //acepted
               if(tu.length>0){
                   tu = _.sortBy(tu,function(r){
                       return -r.sl_tu;
                   })
                   ty_le_ck = tu[0].ty_le_ck;
                   tien_ck = tu[0].tien_ck;
               }
            }

            if(!ty_le_ck && $scope.dt_current.gia_ban) ty_le_ck =STP.round(tien_ck/$scope.dt_current.gia_ban,2)*100;
            //calc discount money
            $scope.data.details.forEach(function(r){
                if(r.ma_vt === $scope.dt_current.ma_vt){
                    r.ty_le_ck = ty_le_ck;
                    $scope.tinhtienhang(r);
                }
            })
            //promotions
            if($scope.dt_current.cs_km){
               /*tu = _.filter($scope.dt_current.cs_km,function(s){
                   return (s.ma_vt || s.ma_nvt) && s.sl_tu<=sl_xuat && (!s.sl_den || s.sl_den>=sl_xuat);
               });*/
               //by customer
               tu = _.filter($scope.dt_current.cs_km,function(s){
                   return (s.ma_vt || s.ma_nvt) && s.sl_tu<=sl_xuat && (!s.sl_den || s.sl_den>=sl_xuat) && (s.ma_kh && s.ma_kh===$scope.data.ma_kh);
               });

               if(tu.length==0){
                   tu = _.filter($scope.dt_current.cs_km,function(s){
                       return (s.ma_vt || s.ma_nvt) && s.sl_tu<=sl_xuat && (!s.sl_den || s.sl_den>=sl_xuat) && (s.nh_kh && s.nh_kh===$scope.data.nh_kh);
                   });
               }
               //by genaral
               if(tu.length==0){
                   tu = _.filter($scope.dt_current.cs_km,function(s){
                       return (s.ma_vt || s.ma_nvt) && s.sl_tu<=sl_xuat && (!s.sl_den || s.sl_den>=sl_xuat) && (!s.ma_kh && !s.nh_kh);
                   });
               }
               if(tu.length>0){
                   tu = _.sortBy(tu,function(t){
                       return -t.sl_tu;
                   });

                   $scope.data.details.forEach(function(r){
                        if(r.ma_vt === $scope.dt_current.ma_vt){
                            r.promotion = [];
                        }
                   })

                   $scope.dt_current.promotion = JSON.parse(JSON.stringify(tu[0]));
                   if($scope.dt_current.promotion.sl_tu && !$scope.dt_current.promotion.sl_den && $scope.dt_current.promotion.details_km){
                       var n = (sl_xuat - sl_xuat%$scope.dt_current.promotion.sl_tu)/$scope.dt_current.promotion.sl_tu;
                       if(n>1){
                           $scope.dt_current.promotion.details_km.forEach(function(km){
                               km.sl_km = n*km.sl_km;
                           })
                       }
                   }
               }else{
                   $scope.dt_current.promotion = {};
               }
            }

            //if(up==undefined || up == null)
            //$options.$rootScope.toast("Đã thêm sản phẩm " + $scope.dt_current.ten_vt);

        }
    }
});
hd2Module.defaultValues ={
	t_thue_nt:0,t_thue:0,thue_suat:0,t_ck_nt:0,t_ck:0
}
hd2Module.defaultValues4Detail = {
	sl_xuat:0,
	ty_le_ck:0,
	gia_von_nt:0,gia_von:0,
	gia_ban_nt:0,gia_ban:0,
	tien_nt:0,tien:0,
	tien_ck_nt:0,tien_ck:0,
	px_gia_dd:false,
	tien_xuat_nt:0,tien_xuat:0
}

hd2Module.defaultCondition4Search = {tu_ngay:new Date(),den_ngay:new Date(),so_ct:'',dien_giai:'',ma_kh:''};
hd2Module.prepareCondition4Search = function($scope,vcondition){
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

hd2Module.watchDetail = function(scope){
	scope.$watch('dt_current.sl_xuat',function(newData){

		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_xuat_nt = STP.round( scope.dt_current.sl_xuat * scope.dt_current.gia_von_nt,scope.round);
			scope.dt_current.tien_nt = STP.round( scope.dt_current.sl_xuat * scope.dt_current.gia_ban_nt,scope.round);
			scope.dt_current.tien_ck_nt = STP.round(scope.dt_current.tien_nt * scope.dt_current.ty_le_ck/100,scope.round);

			scope.dt_current.tien = STP.round(scope.dt_current.tien_nt * scope.ngMasterData.ty_gia,scope.f_tien);
			scope.dt_current.tien_ck = STP.round(scope.dt_current.tien_ck_nt * scope.ngMasterData.ty_gia,scope.f_tien);
			scope.dt_current.tien_xuat = scope.dt_current.tien_xuat_nt;
		}
	});
	scope.$watch('dt_current.gia_ban_nt',function(newData){
		if(newData!=undefined && scope.status.isOpened){
      scope.dt_current.gia_ban = STP.round(scope.dt_current.gia_ban_nt * scope.ngMasterData.ty_gia,scope.f_gia);

			scope.dt_current.tien_nt = STP.round( scope.dt_current.sl_xuat * scope.dt_current.gia_ban_nt,scope.round);
			scope.dt_current.tien_ck_nt = STP.round(scope.dt_current.tien_nt * scope.dt_current.ty_le_ck/100,scope.round);

			scope.dt_current.tien = STP.round(scope.dt_current.tien_nt * scope.ngMasterData.ty_gia,scope.f_tien);
			scope.dt_current.tien_ck = STP.round(scope.dt_current.tien_ck_nt * scope.ngMasterData.ty_gia,scope.f_tien);


		}
	});
	scope.$watch('dt_current.gia_ban',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien = STP.round(scope.dt_current.gia_ban * scope.dt_current.sl_xuat,scope.f_tien);
			scope.dt_current.tien_ck = STP.round(scope.dt_current.tien * scope.dt_current.ty_le_ck/100,scope.f_tien);
		}
	});
	scope.$watch('dt_current.tien_nt',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_ck_nt = STP.round(scope.dt_current.tien_nt * scope.dt_current.ty_le_ck/100,scope.round);

			scope.dt_current.tien = STP.round(scope.dt_current.tien_nt * scope.ngMasterData.ty_gia,scope.f_tien);
			scope.dt_current.tien_ck = STP.round(scope.dt_current.tien_ck_nt * scope.ngMasterData.ty_gia,scope.f_tien);
		}
	});
	scope.$watch('dt_current.tien',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_ck = STP.round(scope.dt_current.tien * scope.dt_current.ty_le_ck/100,scope.f_tien);
		}
	});

	scope.$watch('dt_current.gia_von_nt',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.gia_von =scope.dt_current.gia_von_nt;
			scope.dt_current.tien_xuat_nt = STP.round( scope.dt_current.sl_xuat * scope.dt_current.gia_von_nt,scope.round);
			scope.dt_current.tien_xuat = scope.dt_current.tien_xuat_nt;
		}
	});

	scope.$watch('dt_current.ty_le_ck',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_ck_nt = STP.round(scope.dt_current.tien_nt * scope.dt_current.ty_le_ck/100,scope.round);
			scope.dt_current.tien_ck = STP.round(scope.dt_current.tien_ck_nt * scope.ngMasterData.ty_gia,scope.f_tien);
		}
	});
	scope.$watch('dt_current.tien_ck_nt',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_ck = STP.round(scope.dt_current.tien_ck_nt * scope.ngMasterData.ty_gia,scope.f_tien);
		}
	});
}
hd2Module.watchMaster = function(scope){
	scope.$watch('data.ty_gia',function(newData){
		if(scope.data){
			if(newData!=undefined && scope.isDataLoaded){
				angular.forEach(scope.data.details,function(r){
					r.tien = STP.round(r.tien_nt * newData,scope.f_tien);
					r.tien_ck = STP.round(r.tien_ck_nt * newData,scope.f_tien);
					r.tien_xuat = r.tien_xuat_nt;
				});
				scope.data.t_thue = STP.round(scope.data.t_thue_nt * newData,scope.f_tien)
			}
		}
	});
	scope.$watch('data.thue_suat',function(newData){
		if(scope.data){
			if(newData!=undefined && scope.isDataLoaded){
				scope.data.t_thue_nt = STP.round((scope.data.t_tien_nt-scope.data.t_ck_nt) * scope.data.thue_suat/100,scope.round);
				scope.data.t_thue = STP.round(scope.data.t_thue_nt * scope.data.ty_gia,scope.f_tien)
			}
		}
	});
	scope.$watch('data.t_tien_nt',function(newData){
		if(scope.data){
			if(newData!=undefined && scope.isDataLoaded){
				scope.data.t_thue_nt = STP.round((scope.data.t_tien_nt-scope.data.t_ck_nt) * scope.data.thue_suat/100,scope.round);
				scope.data.t_thue = STP.round(scope.data.t_thue_nt * scope.data.ty_gia,scope.f_tien)
                scope.data.t_tt_nt =scope.data.t_tien_nt-scope.data.t_ck_nt + scope.data.t_thue_nt

			}
		}
	});
	scope.$watch('data.t_tien',function(newData){
		if(scope.data){
			if(newData!=undefined && scope.isDataLoaded){
				scope.data.t_thue = STP.round((scope.data.t_tien-scope.data.t_ck) * scope.data.thue_suat/100,scope.f_tien);
                scope.data.t_tt =scope.data.t_tien-scope.data.t_ck + scope.data.t_thue
			}
		}
	});
    scope.$watch('data.t_ck_nt',function(newData){
		if(scope.data){
			if(newData!=undefined && scope.isDataLoaded){
				scope.data.t_thue_nt = STP.round((scope.data.t_tien_nt-scope.data.t_ck_nt) * scope.data.thue_suat/100,scope.round);
				scope.data.t_thue = STP.round(scope.data.t_thue_nt * scope.data.ty_gia,scope.f_tien)
                scope.data.t_tt_nt =scope.data.t_tien_nt-scope.data.t_ck_nt + scope.data.t_thue_nt

			}
		}
	});
    scope.$watch('data.t_ck',function(newData){
		if(scope.data){
			if(newData!=undefined && scope.isDataLoaded){
				scope.data.t_thue = STP.round((scope.data.t_tien-scope.data.t_ck) * scope.data.thue_suat/100,scope.f_tien);
                scope.data.t_tt =scope.data.t_tien-scope.data.t_ck + scope.data.t_thue
			}
		}
	});
    scope.$watch('data.t_thue_nt',function(newData){
		if(scope.data){
			if(newData!=undefined && scope.isDataLoaded){
				scope.data.t_tt_nt =scope.data.t_tien_nt-scope.data.t_ck_nt + scope.data.t_thue_nt
			}
		}
	});
    scope.$watch('data.t_thue',function(newData){
		if(scope.data){
			if(newData!=undefined && scope.isDataLoaded){
				scope.data.t_tt =scope.data.t_tien-scope.data.t_ck + scope.data.t_thue
			}
		}
	});
}
