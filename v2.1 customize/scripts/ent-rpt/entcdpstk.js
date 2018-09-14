var entrptCdpstk = new baseRptLink('entcdpstk','rcandoipstk_200/1','ENT-Cân đối phát sinh tài khoản',{
	onLoading:function($scope,options){
		var $filter = options.$filter;
		var $location = options.$location;
		$scope.drilldown = function(row){
			if(row.Tk && row.Tk!=''){
				var url = "/entscttk?cAcct=" + row.Tk.trim();
				url = url + "&ten_tk=" + row.Ten_tk.trim();
				url = url + "&dFrom=" + $filter("date")($scope.condition.dFrom,"yyyy-MM-dd");
				url = url + "&dTo=" + $filter("date")($scope.condition.dTo,"yyyy-MM-dd");
				url = url + "&isDrillDown=true"
				$location.url(url);
				
			}
			
			
		}
	}
});
entrptCdpstk.defaultCondition = function(condition){
	var c = new Date();
	condition.dFrom = new Date(c.getFullYear(),c.getMonth(),1);
	condition.dTo = c;
	condition.cAcct =''; 
	condition.nMax =99;
	condition.bu_tru  = false;
	condition.chi_xem_tk_ct =0;
	condition.nGlAcct  = 0;
}
