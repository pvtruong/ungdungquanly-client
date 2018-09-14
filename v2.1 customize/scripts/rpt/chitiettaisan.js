﻿var rptchitiettaisan = new baseRpt('chitiettaisan','chitiettaisan','Sổ Chi tiết tài sản');
rptchitiettaisan.init = function($scope){
	$scope.thangs =['1','2','3','4','5','6','7','8','9','10','11','12'];
	$scope.nams =[];
	for(var nam =(new Date).getFullYear() - 10;nam < (new Date).getFullYear() + 10;nam++){
		$scope.nams.push(nam.toString());
	}
	$scope.gds =[
		{ma_gd:'',ten:"Cả hai"},
		{ma_gd:'1',ten:'Tài sản'},
		{ma_gd:'2',ten:'Công cụ, dụng cụ'}
	]
}
rptchitiettaisan.defaultCondition = function(condition){
	var c = new Date();
	condition.nam = c.getFullYear().toString();
	condition.ma_gd = '1';
	condition.thang = c.getMonth() + 1
}