var kbmpttctModule = new baseInput('kbmpttct','kbmpttct',["ma_so","chi_tieu"],'Khai báo mẫu phân tích theo chỉ tiêu',{
    modal_size:'md',
    onInput:function($scope,options){
        var url = server_url + "/api/" + id_app + "/rptform/" + $scope.data.id_rptform + "?fields=rptform_type";
        options.$http.get(url).then(function(res){
            if(res.data) $scope.rptform_type = res.data.rptform_type;
           
        },function(error){
            console.log(error.data,url);
        })
    }
});
kbmpttctModule.defaultValues = {
	cach_tinh:'2'
}