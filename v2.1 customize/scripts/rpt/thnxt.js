var rptthnxt = new baseRpt('thnxt','thnxt','Tổng hợp nhập xuất tồn',{
	onLoading:function($scope,options){
		var $filter = options.$filter;
		var $location = options.$location;
		$scope.drilldown = function(row){
			if(row.ma_vt){
				var url ="/sctvt?ma_vt=" + row.ma_vt;
				url = url + "&ten_vt=" + row.ten_vt;
                if(row.ma_lo){
                    url = url + "&ma_lo=" + row.ma_lo;
                }
                if(row.ma_tt1){
                    url = url + "&ma_tt1=" + row.ma_tt1;
                }
                if(row.ma_tt2){
                    url = url + "&ma_tt2=" + row.ma_tt2;
                }
                if(row.ma_tt3){
                    url = url + "&ma_tt3=" + row.ma_tt3;
                }
                if(row.ma_kho){
                    url = url + "&ma_kho=" + row.ma_kho;
                }else{
                    if($scope.condition.ma_kho) url = url + "&ma_kho=" + $scope.condition.ma_kho;
                }
				url = url + "&tu_ngay=" + $filter("date")($scope.condition.tu_ngay,"yyyy-MM-dd");
				url = url + "&den_ngay=" + $filter("date")($scope.condition.den_ngay,"yyyy-MM-dd");
                if($scope.condition.ma_dvcs) url = url + "&ma_dvcs=" + $scope.condition.ma_dvcs;
				url = url + "&isDrillDown=true"
				options.$rootScope.openUrl(url);
			}
		}
	}
});
rptthnxt.defaultCondition = function(condition){
	var c = new Date();
	condition.tu_ngay = new Date(c.getFullYear(),c.getMonth(),1);
	condition.den_ngay = c;
	condition.ma_kho ='';
	condition.ma_vt ='';
    condition.groupBy =['ma_vt'];
}
