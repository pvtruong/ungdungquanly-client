var rpttonghoptralaihang = new baseRpt('tonghoptralaihang','tonghoptralaihang','Tổng hợp trả lại nhà cung cấp',{
	onLoading:function($scope,options){
		var $filter = options.$filter;
		var $location = options.$location;
		$scope.drilldown = function(row){
			if(row.ma_vt){
				var url ="/cttralaihang?";
				url = url + "ma_vt=" + row.ma_vt;
				url = url + "&ten_vt=" + row.ten_vt;
				url = url + "&tu_ngay=" + $filter("date")($scope.condition.tu_ngay,"yyyy-MM-dd");
				url = url + "&den_ngay=" + $filter("date")($scope.condition.den_ngay,"yyyy-MM-dd");
				url = url + "&ma_dvcs=" + $scope.condition.ma_dvcs;
				url = url + "&isDrillDown=true"
				options.$rootScope.openUrl(url);
			}
		}
	}
});
rpttonghoptralaihang.defaultCondition = function(condition){
	var c = new Date();
	condition.tu_ngay = new Date(c.getFullYear(),c.getMonth(),1);
	condition.den_ngay = c;
}