var pn6Module = new baseVoucher('pn6','pn6',[],'Phiếu thanh toán tạm ứng');
pn6Module.defaultValues ={
	vatvaos:[],
	vatras:[]
}
pn6Module.defaultValues4Detail = {
	tien_nt:0,tien:0,
}
pn6Module.defaultCondition4Search = {tu_ngay:new Date(),den_ngay:new Date(),so_ct:'',dien_giai:''};
pn6Module.prepareCondition4Search = function($scope,vcondition){
	return {
		so_ct:{$regex:$scope.vcondition.so_ct,$options:'i'},
		dien_giai:{$regex:$scope.vcondition.dien_giai,$options:'i'},
		ngay_ct:{
			$gte:dateTime2Date($scope.vcondition.tu_ngay),
			$lte:dateTime2Date($scope.vcondition.den_ngay)
		}
	};
}
pn6Module.watchDetail = function(scope){
	scope.$watch('dt_current.tien_nt',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien =STP.round(newData * scope.ngMasterData.ty_gia,scope.f_tien);
		}
	});
}
pn6Module.watchMaster = function(scope){
	scope.$watch('data.ty_gia',function(newData){
		if(scope.data){
			if(newData!=undefined && scope.isDataLoaded){
				angular.forEach(scope.data.details,function(r){
					r.tien = STP.round(r.tien_nt * newData,scope.f_tien);
				});
				angular.forEach(scope.data.vatvaos,function(r){
					r.t_tien = STP.round(r.t_tien_nt * newData,scope.f_tien);
					r.t_thue = STP.round(r.t_thue_nt * newData,scope.f_tien);
				});
				angular.forEach(scope.data.vatras,function(r){
					r.t_tien = STP.round(r.t_tien_nt * newData,scope.f_tien);
					r.t_thue = STP.round(r.t_thue_nt * newData,scope.f_tien);
				});
			}
		}
	});
}
