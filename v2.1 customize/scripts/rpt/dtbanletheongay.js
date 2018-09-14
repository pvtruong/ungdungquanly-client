var rptdtbanletheongay = new baseRpt('dtbanletheongay','dtbanletheongay','Doanh thu bán lẻ theo ngày',{
	onLoading:function($scope,options){
		var $filter = options.$filter;
		var $location = options.$location;
		$scope.drilldown = function(row){
			var d = new Date(row.ngay_ct);
			if(_.isDate(d)){
				var url ="/ctbanle?ma_ct=PBL,SO1&";
				url = url + "tu_ngay=" + $filter("date")(d,"yyyy-MM-dd");
				url = url + "&den_ngay=" + $filter("date")(d,"yyyy-MM-dd");
				if($scope.condition.ma_dvcs) url = url + "&ma_dvcs=" + $scope.condition.ma_dvcs;
				if($scope.condition.ma_kho) url = url + "&ma_kho=" + $scope.condition.ma_kho;
				url = url + "&isDrillDown=true"
				options.$rootScope.openUrl(url);
			}
		}
	}
});
rptdtbanletheongay.defaultCondition = function(condition){
	var c = new Date();
	condition.tu_ngay = new Date(c.getFullYear(),c.getMonth(),1);
	condition.den_ngay = c;
}
