var rptscttk = new baseRpt('scttk','scttk','Sổ chi tiết tài khoản');
rptscttk.defaultCondition = function(condition){
	var c = new Date();
	condition.tu_ngay = new Date(c.getFullYear(),c.getMonth(),1);
	condition.den_ngay = c;
}
rptscttk.afterLoadData = function($scope,data){
	$scope.title = 'Sổ chi tiết tài khoản: ' + $scope.condition.tk + " - " + $scope.condition.ten_tk;
}