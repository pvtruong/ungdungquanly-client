var rptsctdtcp = new baseRpt('sctdtcp','sctdtcp','Phân tích dòng tiền theo doanh thu chi phí',{
	onLoading:function($scope,options){

	}
});
rptsctdtcp.defaultCondition = function(condition){
	var c = new Date();
	condition.tu_ngay = new Date(c.getFullYear(),c.getMonth()-1,1);
	condition.den_ngay = new Date(c.getFullYear(),c.getMonth(),0);
	condition.ma_phi ='';
	condition.ten_phi ='';
	condition.tk ='111';
	condition.reportBy ="tuan";

}
