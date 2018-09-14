var ctdsModule = new baseInput('ctds','ctds',["ma_nv","ma_kho","ma_dvcs"],'Kế hoạch');
ctdsModule.init = function($scope){

}
ctdsModule.defaultValues = {
	chi_tieu:0,
	nam:new Date().getFullYear(),
	thang:new Date().getMonth()+1
}
