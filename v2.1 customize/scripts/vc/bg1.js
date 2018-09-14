var bg1Module = new baseVoucher('bg1','bg1',[],'Báo giá',{
    onLoading:function($scope,$options){
      $scope.tinhtienhang = function(r,data){
          if(!data.ty_gia) data.ty_gia =1;

          var f_gia = (data.ma_nt=='VND'?$options.$rootScope.app_info.options.f_gia:$options.$rootScope.app_info.options.f_gia_nt);
          var f_tien_nt =(data.ma_nt=='VND'?$options.$rootScope.app_info.options.f_tien:$options.$rootScope.app_info.options.f_tien_nt);
          var f_tien = $options.$rootScope.app_info.options.f_tien;

          //tien hang
          r.tien_nt = STP.round(r.so_luong * r.gia_nt,f_tien_nt);
          r.tien = STP.round(r.tien_nt * data.ty_gia,f_tien);
          //chiet khau
          r.tien_ck_nt = STP.round(r.tien_nt * r.ty_le_ck/100,f_tien_nt);
          r.tien_ck = STP.round(r.tien_ck_nt* data.ty_gia,f_tien);

      }

        $scope.createContract = function(baogia){
            var _contract = JSON.parse(JSON.stringify(baogia));

            _contract.id_bao_gia = _contract._id;
            delete _contract._id;
            delete _contract.so_ct;

            sale_contractModule.quickadd($options.$uibModal,function(ct){
                baogia.id_contract = ct._id;

                $options.service.get(id_app,baogia._id).then(function(res){
                  _.extend(baogia,res.data);
                })

            },_contract);
        }
    },
    onInput:function($scope,$options){
        $scope.$watch("data.t_tien_nt",function(n,o){
          if(n!=undefined && $scope.isDataLoaded){
            $scope.data.t_thue_nt=STP.round(($scope.data.t_tien_nt-$scope.data.t_ck_nt)*$scope.data.thue_suat/100,$scope.f_tien_nt);
          }
        })
        $scope.$watch("data.thue_suat",function(n,o){
            if(n!=undefined && $scope.isDataLoaded){
              $scope.data.t_thue_nt=STP.round(($scope.data.t_tien_nt-$scope.data.t_ck_nt)*$scope.data.thue_suat/100,$scope.f_tien_nt);
            }
        })
        $scope.$watch("data.t_ck_nt",function(n,o){
            if(n!=undefined && $scope.isDataLoaded){
              $scope.data.t_thue_nt=STP.round(($scope.data.t_tien_nt-$scope.data.t_ck_nt)*$scope.data.thue_suat/100,$scope.f_tien_nt);
            }
        })

        $scope.tinhtienhang = function(r){
            if(!$scope.data.ty_gia) $scope.data.ty_gia =1;
            //tien hang
            r.tien_nt = STP.round(r.so_luong * r.gia_nt,$scope.f_tien_nt);
            r.tien = STP.round(r.tien_nt * $scope.data.ty_gia,$scope.f_tien);
            //chiet khau
            r.tien_ck_nt = STP.round(r.tien_nt * r.ty_le_ck/100,$scope.f_tien_nt);
            r.tien_ck = STP.round(r.tien_ck_nt* $scope.data.ty_gia,$scope.f_tien);

        }
        $scope.updateRows = function(){
            $scope.data.details.forEach(function(item){
                $scope.select(item,item.so_luong)
            })
        }
        $scope.select = function(item,up){
            var ty_le_ck,tien_ck,tu,so_luong=0;

            if(!$scope.data.ty_gia) $scope.data.ty_gia =1;

            $scope.dt_current ={};
            var f = _.filter($scope.data.details,function(i){
                return i.ma_vt==item.ma_vt

                    && (i.ma_tt1 ==item.ma_tt1 || (!i.ma_tt1 && !item.ma_tt1))
                    && (i.ma_tt2 ==item.ma_tt2 || (!i.ma_tt2 && !item.ma_tt2))
                    && (i.ma_tt3 ==item.ma_tt3 || (!i.ma_tt3 && !item.ma_tt3));
            })
            if(f.length>0){
                $scope.dt_current = f[0];
                $scope.dt_current.so_luong =(up!==undefined && up!==null)?up:$scope.dt_current.so_luong + 1;
                $scope.dt_current.gia = STP.round($scope.dt_current.gia_nt * $scope.data.ty_gia,$scope.f_gia)

                if(!$scope.dt_current.cs_ck1) $scope.dt_current.cs_ck1 = {ty_le_ck:$scope.dt_current.ty_le_ck,tien_ck:0};
            }else{
                $scope.dt_current = {ma_vt:item.ma_vt,ten_vt:item.ten_vt,ma_dvt:item.ma_dvt,tk_vt:item.tk_vt,tk_dt:item.tk_dt,tk_gv:item.tk_gv,tk_ck:item.tk_ck ,ma_tt1:item.ma_tt1,ma_tt2:item.ma_tt2,ma_tt3:item.ma_tt3}
                if(bg1Module.defaultValues4Detail){
                    _.extend($scope.dt_current,bg1Module.defaultValues4Detail);
                }
                if($scope.data.options){
                    for(var key in $scope.data.options){
                        if($scope.data.options[key]){
                            $scope.dt_current[key] = $scope.data.options[key];
                        }
                    }
                }
                $scope.dt_current.so_luong=(up!==undefined && up!==null)?up:1;
                $scope.dt_current.gia_nt= item.gia_ban_nt || item.gia_ban_le;
                $scope.dt_current.gia = STP.round($scope.dt_current.gia_nt * $scope.data.ty_gia,$scope.f_gia);

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
                    so_luong = r.so_luong + so_luong;
                }
            })


            if($scope.dt_current.cs_ck2 && $scope.dt_current.cs_ck2.length>0){
               //find discount by kh
               tu = _.filter($scope.dt_current.cs_ck2,function(s){
                   return s.sl_tu<=so_luong && (!s.sl_den || s.sl_den>=so_luong) && (s.ma_kh===$scope.data.ma_kh || s.nh_kh===$scope.data.nh_kh);
               });
               //find discount genaral
               if(tu.length==0){
                   tu = _.filter($scope.dt_current.cs_ck2,function(s){
                       return s.sl_tu<=so_luong && (!s.sl_den || s.sl_den>=so_luong) && (!s.ma_kh && !s.nh_kh);
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

            if(!ty_le_ck && $scope.dt_current.gia) ty_le_ck =STP.round(tien_ck/$scope.dt_current.gia,2)*100;
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
                   return (s.ma_vt || s.ma_nvt) && s.sl_tu<=so_luong && (!s.sl_den || s.sl_den>=so_luong);
               });*/
               //by customer
               tu = _.filter($scope.dt_current.cs_km,function(s){
                   return (s.ma_vt || s.ma_nvt) && s.sl_tu<=so_luong && (!s.sl_den || s.sl_den>=so_luong) && (s.ma_kh && s.ma_kh===$scope.data.ma_kh);
               });

               if(tu.length==0){
                   tu = _.filter($scope.dt_current.cs_km,function(s){
                       return (s.ma_vt || s.ma_nvt) && s.sl_tu<=so_luong && (!s.sl_den || s.sl_den>=so_luong) && (s.nh_kh && s.nh_kh===$scope.data.nh_kh);
                   });
               }
               //by genaral
               if(tu.length==0){
                   tu = _.filter($scope.dt_current.cs_km,function(s){
                       return (s.ma_vt || s.ma_nvt) && s.sl_tu<=so_luong && (!s.sl_den || s.sl_den>=so_luong) && (!s.ma_kh && !s.nh_kh);
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
                       var n = (so_luong - so_luong%$scope.dt_current.promotion.sl_tu)/$scope.dt_current.promotion.sl_tu;
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
bg1Module.defaultValues ={
	t_thue_nt:0,t_thue:0,thue_suat:0,t_ck_nt:0,tk_ck:0
}
bg1Module.defaultValues4Detail = {
	so_luong:0,
	ty_le_ck:0,
	gia_nt:0,gia:0,
	tien_nt:0,tien:0,
	tien_ck_nt:0,tien_ck:0

}

bg1Module.defaultCondition4Search = {tu_ngay:new Date(),den_ngay:new Date(),so_ct:'',dien_giai:'',ma_kh:''};
bg1Module.prepareCondition4Search = function($scope,vcondition){
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

bg1Module.watchDetail = function(scope){
	scope.$watch('dt_current.so_luong',function(newData){

		if(newData!=undefined && scope.status.isOpened){

			scope.dt_current.tien_nt = STP.round( scope.dt_current.so_luong * scope.dt_current.gia_nt,scope.f_tien_nt);
			scope.dt_current.tien_ck_nt = STP.round(scope.dt_current.tien_nt * scope.dt_current.ty_le_ck/100,scope.f_tien_nt);

			scope.dt_current.tien = STP.round(scope.dt_current.tien_nt * scope.ngMasterData.ty_gia,scope.f_tien);
			scope.dt_current.tien_ck = STP.round(scope.dt_current.tien_ck_nt * scope.ngMasterData.ty_gia,scope.f_tien);

		}
	});
	scope.$watch('dt_current.gia_nt',function(newData){
		if(newData!=undefined && scope.status.isOpened){
      scope.dt_current.gia = STP.round(scope.dt_current.gia_nt * scope.ngMasterData.ty_gia,scope.f_gia);

			scope.dt_current.tien_nt = STP.round( scope.dt_current.so_luong * scope.dt_current.gia_nt,scope.f_tien_nt);
			scope.dt_current.tien_ck_nt = STP.round(scope.dt_current.tien_nt * scope.dt_current.ty_le_ck/100,scope.f_tien_nt);

			scope.dt_current.tien = STP.round(scope.dt_current.tien_nt * scope.ngMasterData.ty_gia,scope.f_tien);
			scope.dt_current.tien_ck = STP.round(scope.dt_current.tien_ck_nt * scope.ngMasterData.ty_gia,scope.f_tien);

		}
	});
	scope.$watch('dt_current.gia',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien = STP.round(scope.dt_current.gia * scope.dt_current.so_luong,scope.f_tien);
			scope.dt_current.tien_ck = STP.round(scope.dt_current.tien * scope.dt_current.ty_le_ck/100,scope.f_tien);
		}
	});
	scope.$watch('dt_current.tien_nt',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_ck_nt = STP.round(scope.dt_current.tien_nt * scope.dt_current.ty_le_ck/100,scope.f_tien_nt);

			scope.dt_current.tien = STP.round(scope.dt_current.tien_nt * scope.ngMasterData.ty_gia,scope.f_tien);
			scope.dt_current.tien_ck = STP.round(scope.dt_current.tien_ck_nt * scope.ngMasterData.ty_gia,scope.f_tien);
		}
	});
	scope.$watch('dt_current.tien',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_ck = STP.round(scope.dt_current.tien * scope.dt_current.ty_le_ck/100,scope.f_tien);
		}
	});



	scope.$watch('dt_current.ty_le_ck',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_ck_nt = STP.round(scope.dt_current.tien_nt * scope.dt_current.ty_le_ck/100,scope.f_tien_nt);
			scope.dt_current.tien_ck = STP.round(scope.dt_current.tien_ck_nt * scope.ngMasterData.ty_gia,scope.f_tien);
		}
	});
	scope.$watch('dt_current.tien_ck_nt',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_ck = STP.round(scope.dt_current.tien_ck_nt * scope.ngMasterData.ty_gia,scope.f_tien);
		}
	});
}
bg1Module.watchMaster = function($scope){
	$scope.$watch('data.ty_gia',function(newData){
		if($scope.data){
			if(newData!=undefined && $scope.isDataLoaded){
				angular.forEach($scope.data.details,function(r){
					r.tien = STP.round(r.tien_nt * newData,$scope.f_tien);
					r.tien_ck = STP.round(r.tien_ck_nt * newData,$scope.f_tien);
				});
				$scope.data.t_thue = STP.round($scope.data.t_thue_nt * newData,$scope.f_tien)
			}
		}
	});
}
