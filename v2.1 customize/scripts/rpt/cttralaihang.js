﻿var rptcttralaihang = new baseRpt('cttralaihang','cttralaihang','Chi tiết trả lại nhà cung cấp');
rptcttralaihang.defaultCondition = function(condition){
	var c = new Date();
	condition.tu_ngay = new Date(Date.UTC(c.getFullYear(),c.getMonth(),1));
	condition.den_ngay = c;
}