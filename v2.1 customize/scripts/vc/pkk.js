var pkkModule = new baseVoucher('pkk','pkk',[],'Kiểm kê kho',{
    onInput:function($scope,$options){
        var ty_gia =1;
        $scope.toncuoikyvattu = function(){
          if($scope.data._id){
            $options.$rootScope.alert("Chỉ lấy được danh sách tồn kho khi tạo phiếu mới")
            return;
          }
          if(!$scope.data.ma_kho){
            $options.$rootScope.alert("Hãy chọn một kho trước")
          }
          $scope.data.details =[];
          var url_ck = server_url_report + "/api/" + id_app + "/ckvt?groupBy=ma_vt&groupBy=ma_tt1&groupBy=ma_tt2&groupBy=ma_tt3&groupBy=ma_lo&groupBy=han_sd&ma_kho=" + $scope.data.ma_kho + "&den_ngay=" + moment($scope.data.ngay_ct).format("YYYY-MM-DD");
          $options.$http.get(url_ck).then(function(res){
            var items = _.filter(res.data,function(item){
              return item.ton00;
            })
            items.forEach(function(item){

              nrow = {
                ma_vt:item.ma_vt
                //,ma_kho:$scope.data.ma_kho
                //,ten_kho:$scope.data.ten_kho
                ,ten_vt:item.ten_vt
                ,ma_dvt:item.ma_dvt
                ,tk_vt:item.tk_vt

                ,ma_lo:item.ma_lo
                ,han_sd:item.han_sd
                ,ma_tt1:item.ma_tt1
                ,ma_tt2:item.ma_tt2
                ,ma_tt3:item.ma_tt3
              }
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
              nrow.sl_ton_tt = 0;
              nrow.sl_ton_ss = item.ton00;

              var gia_von = STP.round(item.ton00!==0?item.du00/item.ton00:0,$scope.f_gia);
              nrow.gia_von = gia_von;
              nrow.gia_von_nt = gia_von;
              nrow.line = $scope.data.details.length;
              $scope.data.details.push(nrow);
            })
          },function(e){
            var msg_error = e.data;
            if(_.isObject(msg_error)) msg_error = msg_error.message;
            if(!msg_error) msg_error = "Không kết nối được với máy chủ"
            $options.$rootScope.alert("Không thể lấy được số dư cuối kỳ của các sản phẩm. Lỗi: " + msg_error);
          })
        }
        $scope.select = function(item){
            if($scope.data.ty_gia){
                ty_gia = $scope.data.ty_gia;
            }
            var nrow ={};
            item.ma_tt1 =item.ma_tt1|| "";
            item.ma_tt2 =item.ma_tt2|| "";
            item.ma_tt3 =item.ma_tt3|| "";
            item.ma_lo =item.ma_lo|| "";


            var f = _.filter($scope.data.details,function(i){
              //console.log(i,item)
                return i.ma_vt===item.ma_vt
                // && i.ma_kho===item.ma_kho
                  && i.ma_lo===item.ma_lo
                   //&& i.han_sd===item.han_sd
                    && i.ma_tt1 ==item.ma_tt1
                     && i.ma_tt2 ==item.ma_tt2
                      && i.ma_tt3 ==item.ma_tt3;
            })
            if(f.length>0){
                nrow = f[0];
                nrow.sl_ton_tt +=1;
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
                nrow.sl_ton_tt = 1;
                nrow.sl_ton_ss = 0;
                var url_ck = server_url_report + "/api/" + id_app + "/ckvt?ma_vt=" + nrow.ma_vt + "&ma_kho=" + $scope.data.ma_kho + "&den_ngay=" + moment($scope.data.ngay_ct).format("YYYY-MM-DD");
                //console.log(url_ck);

                $options.$http.get(url_ck).then(function(res){

                  if(res.data.length===1){
                    nrow.sl_ton_ss = res.data[0].ton00;
                  }
                },function(e){
                  var msg_error = e.data;
                  if(_.isObject(msg_error)) msg_error = msg_error.message;
                  if(!msg_error) msg_error = "Không kết nối được với máy chủ"
                  $options.$rootScope.alert("Không thể lấy được số dư cuối kỳ của sản phẩm <b>" + nrow.ten_vt +  "</b><div style='color:red'>Lỗi: " + msg_error + "</div>");
                })


                var gia_von = item.gia_mua?item.gia_mua:0;
                nrow.gia_von = STP.round(gia_von*ty_gia,$scope.f_gia);
                nrow.gia_von_nt = gia_von;
                nrow.line = $scope.data.details.length;
                $scope.data.details.push(nrow);
            }
            //tien nhap
            nrow.tien_xuat_nt =  STP.round(nrow.sl_xuat * nrow.gia_von_nt,$scope.f_tien_nt);
            nrow.tien_xuat =  STP.round(nrow.tien_xuat_nt* ty_gia,$scope.f_tien);
            //$options.$rootScope.toast("Đã thêm sản phẩm " + nrow.ten_vt);
        }
    }
});
pkkModule.defaultValues ={
}
pkkModule.defaultValues4Detail = {
	sl_xuat:0,
  sl_ton_ss:0,
  sl_ton_tt:0,
	px_gia_dd:false,
	gia_von_nt:0,gia_von:0,
	tien_xuat_nt:0,tien_xuat:0,
  ma_tt1:'',ma_tt2:'',ma_tt3:'',ma_lo:''
}
pkkModule.defaultCondition4Search = {tu_ngay:new Date(),den_ngay:new Date(),so_ct:'',dien_giai:''};
pkkModule.prepareCondition4Search = function($scope,vcondition){
	return {
		so_ct:{$regex:$scope.vcondition.so_ct,$options:'i'},
		dien_giai:{$regex:$scope.vcondition.dien_giai,$options:'i'},
		ngay_ct:{
			$gte:dateTime2Date($scope.vcondition.tu_ngay),
			$lte:dateTime2Date($scope.vcondition.den_ngay)
		}
	};
}

pkkModule.watchDetail = function(scope){
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
pkkModule.watchMaster = function(scope){

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
