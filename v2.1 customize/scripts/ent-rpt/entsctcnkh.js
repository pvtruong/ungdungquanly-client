var entrptsctcnkh = new baseRptLink('entsctcnkh','rSoCtCnKh/1','ENT-Sổ chi tiết công nợ khách hàng');
entrptsctcnkh.defaultCondition = function(condition){
	var c = new Date();
	condition.tu_ngay = new Date(c.getFullYear(),c.getMonth(),1);
	condition.den_ngay = c;
    condition.tk="131";
	condition.ma_kh=""; 
	condition.ngon_ngu="vi"; 
	condition.isDetail =0;
}
entrptsctcnkh.afterLoadData = function($scope,data){
	$scope.title = 'ENT-Sổ chi tiết công nợ khách hàng: ' + $scope.condition.ma_kh;
}
