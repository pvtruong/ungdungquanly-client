var rptdutoanthuchitheodt = new baseRpt('dutoanthuchitheodt','dutoanthuchitheodt','Dự toán thu chi theo đối tượng',{
	onLoading:function($scope,options){
		
	}
});
rptdutoanthuchitheodt.defaultCondition = function(condition){
	var c = new Date();
	condition.tu_ngay = new Date(c.getFullYear(),c.getMonth(),1);
	condition.den_ngay = c;
}
