var hd1Module = new baseVoucher('hd1','hd1',[],'Hóa đơn bán dịch vụ');
hd1Module.defaultValues ={
	t_thue_nt:0,t_thue:0,thue_suat:0
}
hd1Module.defaultValues4Detail = {
	ty_le_ck:0,
	tien_nt:0,tien:0,
	tien_ck_nt:0,tien_ck:0
}
hd1Module.defaultCondition4Search = {tu_ngay:new Date(),den_ngay:new Date(),so_ct:'',dien_giai:'',ma_kh:''};
hd1Module.prepareCondition4Search = function($scope,vcondition){
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

hd1Module.watchDetail = function(scope){

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
hd1Module.watchMaster = function(scope){
	scope.$watch('data.ty_gia',function(newData){
		if(scope.data){
			if(newData!=undefined && scope.isDataLoaded){
				angular.forEach(scope.data.details,function(r){
					r.tien = STP.round(r.tien_hang_nt * newData,0);
					r.tien_ck = STP.round(r.tien_ck_nt * newData,0);
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
			}
		}
	});
	scope.$watch('data.t_tien',function(newData){
		if(scope.data){
			if(newData!=undefined && scope.isDataLoaded){
				scope.data.t_thue = STP.round((scope.data.t_tien-scope.data.t_ck) * scope.data.thue_suat/100,scope.f_tien);
			}
		}
	});
}
