var ent_rptbanggiaban = new baseRptLink('entbanggiaban','banggiaban/1','ENT - Bảng giá bán',{
	onLoading:function($scope,options){
		/*var $filter = options.$filter;
		var $location = options.$location;
		$scope.drilldown = function(row){
			if(row.ma_vt && row.ma_vt.trim()!==""){
				var url ="/entsctvt?cSite=" + $scope.condition.ma_kho.trim();
				url = url + "&cItem=" + row.ma_vt.trim();
				url = url + "&dFrom=" + $filter("date")($scope.condition.tu_ngay,"yyyy-MM-dd");
				url = url + "&dTo=" + $filter("date")($scope.condition.den_ngay,"yyyy-MM-dd");
				url = url + "&isDrillDown=true"
				$location.url(url);
			}
		}*/
	}
});
ent_rptbanggiaban.defaultCondition = function(condition){
	var c = new Date();
	condition.tu_ngay = new Date(c.getFullYear(),c.getMonth(),1);
	condition.den_ngay = c;
	condition.ma_kho ='';
	condition.ma_vt ='';
   condition.ma_kh=''; 
   condition.nh_kh1='';
    condition.nh_vt1='';
    condition.nh_vt2='';
    condition.nh_vt3='';
	
    
}
