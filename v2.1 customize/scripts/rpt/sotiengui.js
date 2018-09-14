var rptsoquy = new baseRpt('sotiengui','sotiengui','Sổ tiền gửi ngân hàng');
rptsoquy.defaultCondition = function(condition){
	var c = new Date();
	condition.tu_ngay = new Date(c.getFullYear(),c.getMonth(),1);
	condition.den_ngay = c;
    condition.tk= '112'
}
rptsoquy.afterLoadData = function($scope,data){
    //tinh so du sau moi nghiep vu
    
	
}