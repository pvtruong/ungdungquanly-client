var pc0Module = new baseVoucher('pc0','pc0',[],'Đề nghị chi',{
	giaodichs:[{ma_gd:1,ten_gd:'Tiền mặt'},{ma_gd:2,ten_gd:'Chuyển khoản'}],
	onLoading:function($scope,$options){
		$scope.createPN = function(pc0){
				var hd = JSON.parse(JSON.stringify(pc0));
				hd.id_pc0 = hd._id;
				hd.trang_thai = '5';
				hd.ngay_ct = new Date();
				delete hd._id;
				delete hd.so_ct;
				var pn = pc1Module;
				pn.quickadd($options.$uibModal,function(ct){
					$options.service.get(id_app,pc0._id).then(function(res){
						_.extend(pc0,res.data);
					})
				},hd);
		}
	},
	onEdit:function($scope,options){
		if($scope.data.tdttcos && $scope.data.tdttcos.length>0){
			$scope.select('chi_hd')
		}else{
			$scope.select('chi_kh')
		}

	},
	onInit:function($scope){
		$scope.select_chi_kh = true;
		$scope.select_chi_hd =false;
		$scope.select_vat_vao =false;
		$scope.select = function(t){
			$scope.select_chi_kh = (t=='chi_kh');
			$scope.select_chi_hd =(t=='chi_hd');
			$scope.select_vat_vao =(t=='vat_vao');
		}
	}
});
pc0Module.defaultValues ={
	vatvaos:[],
	ma_gd:'1'
}
pc0Module.defaultValues4Detail = {
	tien_nt:0,tien:0
}
pc0Module.defaultCondition4Search = {tu_ngay:new Date(),den_ngay:new Date(),so_ct:'',dien_giai:'',ma_kh:''};
pc0Module.prepareCondition4Search = function($scope,vcondition){
	
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
pc0Module.watchDetail = function(scope){
	scope.$watch('dt_current.tien_nt',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien =STP.round(newData * scope.ngMasterData.ty_gia,scope.f_tien);
		}
	});
}
pc0Module.watchMaster = function(scope){
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