var spdd_dkModule = new baseInput('spdd_dk','spdd_dk',["ma_sp","ma_dvcs","ma_bp","ma_lsx"],'Số lượng sản phẩm dở dang đầu kỳ');
spdd_dkModule.defaultValues = {
	sl_dd:0,ty_le_ht:100,sl_ht_qd:0,thang:(new Date()).getMonth()+1,nam:(new Date()).getFullYear()
};
spdd_dkModule.init = function($scope){
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