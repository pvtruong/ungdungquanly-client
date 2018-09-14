var rptsctvt_sl = new baseRpt('sctvt_sl','sctvt_sl','Sổ chi tiết vật tư');
rptsctvt_sl.defaultCondition = function(condition){
	var c = new Date();
	condition.tu_ngay = new Date(c.getFullYear(),c.getMonth(),1);
	condition.den_ngay = c;
}
rptsctvt_sl.afterLoadData = function($scope,data){
	$scope.title = 'Sổ chi tiết vật tư: ' + $scope.condition.ma_vt + " - " + $scope.condition.ten_vt;
}
