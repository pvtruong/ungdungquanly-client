var rptkqchamcong = new baseRpt('kqchamcong','kqchamcong','Kết quả chấm công');
rptkqchamcong.defaultCondition = function(condition){
	var c = new Date();
	condition.tu_ngay = new Date(c.getFullYear(),c.getMonth(),1);
	condition.den_ngay = c;
}
