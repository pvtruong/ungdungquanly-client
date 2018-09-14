var entrptScttk = new baseRptLink('entscttk','rsochitiet/1','ENT-Sổ chi tiết tài khoản');
entrptScttk.defaultCondition = function(condition){
	var c = new Date();
	condition.dFrom = new Date(c.getFullYear(),c.getMonth(),1);
	condition.dTo = c; 
	condition.cAcct='';
	condition.cLan ="Vi";
}
entrptScttk.afterLoadData = function($scope,data){
	$scope.title = 'ENT-Sổ chi tiết tài khoản: ' + $scope.condition.cAcct;
}