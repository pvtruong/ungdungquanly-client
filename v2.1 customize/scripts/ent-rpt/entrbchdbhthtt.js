var entrbchdbhthtt = new baseRptLink('entrbchdbhthtt','rbchdbhthtt/1','ENT-Hóa đơn bán hàng theo hạn thanh toán',{
	onLoading:function($scope,options){
		/*var $filter = options.$filter;
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
		*/
		
	}
});
entrbchdbhthtt.defaultCondition = function(condition){
	var c = new Date();
	condition.ngay_tt = new Date(c.getFullYear(),c.getMonth(),1);
	condition.den_ngay = c;
    condition.tk ="131";
    condition.ma_kh="";
	condition.khoang_tg =30;
	condition.only_summary = false;
	condition.ma_dvcs ="";
}
