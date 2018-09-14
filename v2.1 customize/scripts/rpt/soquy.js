var rptsoquy = new baseRpt('soquy','soquy','Sổ quỹ');
rptsoquy.defaultCondition = function(condition){
	var c = new Date();
	condition.tu_ngay = new Date(c.getFullYear(),c.getMonth(),1);
	condition.den_ngay = c;
    condition.tk= '111'
}
rptsoquy.afterLoadData = function($scope,data){
    //tinh so du sau moi nghiep vu
    
	
}