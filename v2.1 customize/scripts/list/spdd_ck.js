var spdd_ckModule = new baseInput('spdd_ck','spdd_ck',["ma_sp","ma_dvcs","ma_bp","ma_lsx"],'Số lượng sản phẩm dở dang cuối kỳ');
spdd_ckModule.defaultValues = {
	sl_dd:0,ty_le_ht:100,sl_ht_qd:0,thang:(new Date()).getMonth()+1,nam:(new Date()).getFullYear()
};
spdd_ckModule.init = function($scope){
	$scope.$watch('data.sl_dd',function(newData){
		if($scope.isDataLoaded){
			$scope.data.sl_ht_qd = $scope.data.sl_dd*$scope.data.ty_le_ht/100;
		}
	});
	
	$scope.$watch('data.ty_le_ht',function(newdata){
		if($scope.isDataLoaded){
			$scope.data.sl_ht_qd = $scope.data.sl_dd*$scope.data.ty_le_ht/100;
		}
	});
   
}