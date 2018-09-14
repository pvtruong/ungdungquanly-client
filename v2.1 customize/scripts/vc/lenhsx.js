var lenhsxModule = new baseVoucher('lenhsx','lenhsx',[],'Lệnh sản xuất',{

});
lenhsxModule.defaultValues ={
  trang_thai:'0'
}
lenhsxModule.defaultValues4Detail = {
	sl_sx:0
}
lenhsxModule.defaultCondition4Search = {tu_ngay:new Date(),den_ngay:new Date(),so_ct:'',dien_giai:''};

lenhsxModule.prepareCondition4Search = function($scope,vcondition){
	return {
		so_ct:{$regex:$scope.vcondition.so_ct,$options:'i'},
		dien_giai:{$regex:$scope.vcondition.dien_giai,$options:'i'},
		ngay_ct:{
			$gte:dateTime2Date($scope.vcondition.tu_ngay),
			$lte:dateTime2Date($scope.vcondition.den_ngay)
		}
	};
}
