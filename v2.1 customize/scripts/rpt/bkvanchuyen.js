var rptbkvanchuyen = new baseRpt('bkvanchuyen','bkvanchuyen','Bảng kê chi phí cước tàu');
rptbkvanchuyen.defaultCondition = function(condition){
	var c = new Date();
	condition.tu_ngay = new Date(c.getFullYear(),c.getMonth(),1);
	condition.den_ngay = c;
}
