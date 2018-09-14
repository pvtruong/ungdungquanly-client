var pkhModule = new baseVoucher('pkh','pkh',[],'Phiếu khấu hao tài sản');
pkhModule.defaultValues ={
}
pkhModule.defaultValues4Detail = {
	tien_nt:0,tien:0,
}
pkhModule.defaultCondition4Search = {tu_ngay:new Date(),den_ngay:new Date(),so_ct:'',dien_giai:''};
pkhModule.prepareCondition4Search = function($scope,vcondition){
	return {
		so_ct:{$regex:$scope.vcondition.so_ct,$options:'i'},
		dien_giai:{$regex:$scope.vcondition.dien_giai,$options:'i'},
		ngay_ct:{
			$gte:dateTime2Date($scope.vcondition.tu_ngay),
			$lte:dateTime2Date($scope.vcondition.den_ngay)
		}
	};
}
pkhModule.watchDetail = function(scope){
	scope.$watch('dt_current.tien_nt',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien =STP.round(newData * scope.ngMasterData.ty_gia,0);
		}
	});
	scope.createBT = function(){
		if(!_.isDate(scope.ngMasterData.ngay_ct)){
			scope.ngMasterData.ngay_ct = new Date(scope.ngMasterData.ngay_ct);
		}
		scope.ngMasterData.details = [];
		var url =server_url + "/api/" + id_app + "/getkhauhao?id_ct=" + scope.ngMasterData._id;
		url += "&thang=" + scope.ngMasterData.ngay_ct.getMonth().toString();
		url += "&nam=" + scope.ngMasterData.ngay_ct.getFullYear().toString();
		if(scope.ngMasterData.kc_dvcs){
			url =url + "&ma_dvcs=" + scope.ngMasterData.ma_dvcs;
		}
		scope.$http.get(url).then(function(data){
			scope.messageError = undefined;
			scope.ngMasterData.details = data.data;
		},function(error){
			scope.alertType ="alert alert-danger";
			scope.messageError = error.data;
		});
	}
}
pkhModule.watchMaster = function(scope){
	scope.$watch('data.ty_gia',function(newData){
		if(scope.data){
			if(newData!=undefined && scope.isDataLoaded){
				angular.forEach(scope.data.details,function(r){
					r.tien = STP.round(r.tien_nt * newData,scope.f_tien);
				});
			}
		}
	});
}
