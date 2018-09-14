var ent_rptthnxt = new baseRptLink('entthnxt','rstocksummary/1','ENT - Tổng hợp nhập xuất tồn',{
	onLoading:function($scope,options){
		var $filter = options.$filter;
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
		}
	}
});
ent_rptthnxt.defaultCondition = function(condition){
	var c = new Date();
	condition.tu_ngay = new Date(c.getFullYear(),c.getMonth(),1);
	condition.den_ngay = c;
	condition.ma_kho ='';
	condition.ma_vt ='';
    
   // condition.ma_nhom_vt='';
	//condition.ma_loai_vt='';
	//condition.ma_ncc='';
	condition.inctdc=1;
	condition.toncuoibangkhong=0;
	//condition.ma_dvcs='';
	//condition.nhom_theo='';
	//condition.tk_vt='';
    
	condition.cOrder='ma_vt';
	//condition.nh_kho1='';
	
    
}
