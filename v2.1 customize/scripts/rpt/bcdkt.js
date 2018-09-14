var rptbcdkt = new baseRpt('bcdkt','bcdkt','Bảng cân đối kế toán');
rptbcdkt.defaultCondition = function(condition){
	var c = new Date();
	condition.den_ngay = c;
}