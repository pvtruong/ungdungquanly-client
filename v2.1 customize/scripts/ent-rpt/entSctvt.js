var ent_rptsctvt = new baseRptLink('entsctvt','sochitietvattu/1','ENT - Sổ chi tiết vật tư');
ent_rptsctvt.defaultCondition = function(condition){
	var c = new Date();
	condition.dFrom = new Date(c.getFullYear(),c.getMonth(),1);
	condition.dTo = c;
	condition.cLan='V',
	condition.cOrder='Ngay_ct,nxt'
}
ent_rptsctvt.afterLoadData = function($scope,data){
	$scope.title = 'ENT - Sổ chi tiết vật tư: ' + $scope.condition.cItem ;
    if($scope.condition.cSite){
        $scope.title = $scope.title + " - " + $scope.condition.cSite
    }
}