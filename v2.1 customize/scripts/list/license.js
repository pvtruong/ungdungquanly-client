var licenseModule = new baseInput('license','license',["partner_email","dia_chi","ten_kh_sd","license"],'Quản lý bản quyền sử dụng',{limit:1000});
licenseModule.loading = function($scope,$options){
    $scope.$watch('list',function(newValue){
         var so_key_con_hoat_dong = _.filter($scope.list,function(r){
             return r.active;
         })
         $scope.sub_title = "Tổng số key đã cấp: " + $scope.list.length.toString() + " - số key còn hoạt động: " + so_key_con_hoat_dong.length.toString();
    })
    $scope.unactive = function(row){
        row.active = false;
        if(confirm("Bạn có chắc chắn ngừng hoạt động của bản quyền này không?")){
            $scope.update(row);
        }
    }
   
}