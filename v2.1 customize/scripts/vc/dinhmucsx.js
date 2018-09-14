var dinhmucsxModule = new baseVoucher('dinhmucsx','dinhmucsx',[],'Định mức sản xuất',{

});
dinhmucsxModule.defaultValues ={
  loai_dinh_muc:3,
  trang_thai:'0'
}
dinhmucsxModule.defaultValues4Detail = {
	sl_xuat:0,
  loai_dinh_muc:1,
  ty_le_hao_hut:0
}
dinhmucsxModule.defaultCondition4Search = {tu_ngay:new Date(),den_ngay:new Date(),so_ct:'',ma_sp:'',dien_giai:''};

dinhmucsxModule.prepareCondition4Search = function($scope,vcondition){
	return {
		so_ct:{$regex:$scope.vcondition.so_ct,$options:'i'},
    ma_sp:{$regex:$scope.vcondition.ma_sp,$options:'i'},
		dien_giai:{$regex:$scope.vcondition.dien_giai,$options:'i'},
		ngay_ct:{
			$gte:dateTime2Date($scope.vcondition.tu_ngay),
			$lte:dateTime2Date($scope.vcondition.den_ngay)
		}
	};
}
