var rptdtbanletheokho = new baseRpt('dtbanletheokho','dtbanletheokho','Doanh thu bán lẻ theo kho/cửa hàng',{
	onLoading:function($scope,options){
		var $filter = options.$filter;
		var $location = options.$location;
		$scope.drilldown = function(row){
			if(row.ma_kho){
				var url ="/ctbanle?ma_ct=PBL,SO1&";
				url = url + "ma_kho=" + row.ma_kho;
				url = url + "&ten_kho=" + row.ten_kho;
				url = url + "&tu_ngay=" + $filter("date")($scope.condition.tu_ngay,"yyyy-MM-dd");
				url = url + "&den_ngay=" + $filter("date")($scope.condition.den_ngay,"yyyy-MM-dd");
				url = url + "&ma_dvcs=" + $scope.condition.ma_dvcs;
				url = url + "&isDrillDown=true"
				options.$rootScope.openUrl(url);
			}
		}
	}
});
rptdtbanletheokho.defaultCondition = function(condition){
	var c = new Date();
	condition.tu_ngay = new Date(c.getFullYear(),c.getMonth(),1);
	condition.den_ngay = c;
}
