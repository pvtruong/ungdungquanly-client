var rptthgt = new baseRpt('thgt','thgt','Tổng hợp giá thành');
rptthgt.init = function($scope){
	$scope.thangs =['1','2','3','4','5','6','7','8','9','10','11','12'];
	$scope.nams =[];
	for(var nam =(new Date).getFullYear() - 10;nam < (new Date).getFullYear() + 10;nam++){
		$scope.nams.push(nam.toString());
	}
}
rptthgt.defaultCondition = function(condition){
	var c = new Date();
	condition.nam = c.getFullYear().toString();
	condition.thang = (c.getMonth()+1).toString();
}