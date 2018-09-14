var pc3Module = new baseVoucher('pc3','pc3',[],'Đề nghị tạm ứng',{
	giaodichs:[{ma_gd:1,ten_gd:'Tiền mặt'},{ma_gd:2,ten_gd:'Chuyển khoản'}],
	onLoading:function($scope,$options){
		$scope.createPN = function(pc3){
				var hd = JSON.parse(JSON.stringify(pc3));
				hd.id_pc3 = hd._id;
				hd.ngay_ct = new Date();
				delete so_ct;
				delete hd._id;
				delete hd.trang_thai;
				var pn = pc2Module;
				pn.quickadd($options.$uibModal,function(ct){
						$options.service.get(id_app,pc3._id).then(function(res){
							_.extend(pc3,res.data);
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
pc3Module.defaultValues ={
	vatvaos:[],
	ma_gd:'1'
}
pc3Module.defaultValues4Detail = {
	tien_nt:0,tien:0
}
pc3Module.defaultCondition4Search = {tu_ngay:new Date(),den_ngay:new Date(),so_ct:'',dien_giai:'',ma_kh:''};
pc3Module.prepareCondition4Search = function($scope,vcondition){
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
pc3Module.watchDetail = function(scope){
	scope.$watch('dt_current.tien_nt',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien =STP.round(newData * scope.ngMasterData.ty_gia,scope.f_tien);
		}
	});
}
pc3Module.watchMaster = function(scope){
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
