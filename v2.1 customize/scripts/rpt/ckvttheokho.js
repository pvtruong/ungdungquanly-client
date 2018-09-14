var rptckvttheokho = new baseRpt('ckvttheokho','ckvttheokho','Tồn theo kho',{
	onLoading:function($scope,options){
		var $filter = options.$filter;
		var $location = options.$location;

	}
});
rptckvttheokho.defaultCondition = function(condition){
	var c = new Date();
	condition.den_ngay = new Date(c.getFullYear(),c.getMonth(),1);
	condition.ma_kho ='';
	condition.ma_vt ='';

}
