var rptpttctkho2 = new baseRpt('pttctkho2','pttctkho2','Phân tích đối tượng theo chỉ tiêu');
rptpttctkho2.defaultCondition = function(condition){
	var c = new Date();
	var y = c.getFullYear();
	var m = c.getMonth();
	var d = c.getDate();
	
	condition.tu_ngay = new Date(y,m,1);
	condition.den_ngay = c;
}