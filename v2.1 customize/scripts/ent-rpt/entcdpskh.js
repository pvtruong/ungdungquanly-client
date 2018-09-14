var entrptcdpskh = new baseRptLink('entcdpskh','rbacdpscnkh/1','ENT-Cân đối phát sinh theo khách hàng',{
	onLoading:function($scope,options){
		var $filter = options.$filter;
		var $location = options.$location;
		$scope.drilldown = function(row){
			if(row.ma_kh){
				var url ="/entsctcnkh?tk=" + $scope.condition.tk.trim();
				url = url + "&ma_kh=" + row.ma_kh.trim();
				url = url + "&ten_kh=" + row.ten_kh.trim();
				url = url + "&tu_ngay=" + $filter("date")($scope.condition.tu_ngay,"yyyy-MM-dd");
				url = url + "&den_ngay=" + $filter("date")($scope.condition.den_ngay,"yyyy-MM-dd");
				url = url + "&isDrillDown=true"
				$location.url(url);
			}
		}
		
	}
});
entrptcdpskh.defaultCondition = function(condition){
	var c = new Date();
	condition.tu_ngay = new Date(c.getFullYear(),c.getMonth(),1);
	condition.den_ngay = c;
    condition.tk ="131";
    condition.ma_kh="";
    condition.ngon_ngu="Vi";
}
