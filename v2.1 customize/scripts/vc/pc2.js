var pc2Module = new baseVoucher('pc2','pc2',[],'Phiếu chi tạm ứng',{
	giaodichs:[{ma_gd:1,ten_gd:'Tiền mặt'},{ma_gd:2,ten_gd:'Chuyển khoản'}],
	onLoading:function($scope,$options){
		$scope.createPN = function(pc2){
				var hd = {};
				_.extend(hd,pc2);
				hd.id_pc2 = hd._id;
				hd.ngay_ct = new Date();
				delete hd.so_ct;
				delete hd.trang_thai;
				delete hd._id;
				hd.details.forEach(function(d){
						d.tk_co = d.tk_no;
						d.tk_no="";
						d.tien_tu_nt = d.tien_nt;
						d.tien_tu = d.tien;
						//d.tien_cl_nt = d.tien_tu_nt - d.tien_nt;
						//d.tien_cl = d.tien_tu - d.tien;
				})
				var pn = pn6Module;
				pn.quickadd($options.$uibModal,function(ct){
						pc2.id_pn6 = ct._id;
						$options.service.get(id_app,pc2._id).then(function(res){
							_.extend(pc2,res.data);
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
pc2Module.defaultValues ={
	vatvaos:[],
	ma_gd:'1'
}
pc2Module.defaultValues4Detail = {
	tien_nt:0,tien:0
}
pc2Module.defaultCondition4Search = {tu_ngay:new Date(),den_ngay:new Date(),so_ct:'',dien_giai:'',ma_kh:''};
pc2Module.prepareCondition4Search = function($scope,vcondition){
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
pc2Module.watchDetail = function(scope){
	scope.$watch('dt_current.tien_nt',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien =STP.round(newData * scope.ngMasterData.ty_gia,scope.f_tien);
		}
	});
}
pc2Module.watchMaster = function(scope){
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
