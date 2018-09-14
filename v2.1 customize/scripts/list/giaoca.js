var giaocaModule = new baseInput('giaoca','giaoca',["ma_ca","ma_kho","nhan_vien"],'Giao ca',{
    has_view:false ,
    onInput:function($scope,$options){
        $scope.getTienHang = function(){
            if(!$scope.data.ma_kho || !$scope.data.ma_ca || !$scope.data.nhan_vien) return;
            var url = server_url_report + "/api/" + id_app + "/getdttheoca?t=1";
            url = url + "&ma_ca=" + $scope.data.ma_ca
            url = url + "&ma_kho=" + $scope.data.ma_kho
            url = url + "&nhan_vien=" + $scope.data.nhan_vien
            url = url + "&tu_ngay=" + moment($scope.data.tu_ngay).format("YYYY-MM-DD")
            url = url + "&den_ngay=" + moment($scope.data.den_ngay).format("YYYY-MM-DD")
            
            $options.$http.get(url).then(function(res){
                $scope.data.tien_hang = res.data.tien_hang;
                $scope.data.da_giao = res.data.da_giao;
                if(!$scope.data.tien_giao) $scope.data.tien_giao = $scope.data.tien_hang - $scope.data.da_giao;
            },function(error){
                if(error.data){
                    $options.$rootScope.alert(error.data);
                }else{
                    $options.$rootScope.alert("Không kết nối được với máy chủ");
                }
            })
        }
        $scope.$watch("data.ma_ca",function(n,o){
            if(n && n!==o){
                $scope.getTienHang();
            }
        })
        $scope.$watch("data.ma_kho",function(n,o){
            if(n && n!==o){
                $scope.getTienHang();
            }
        })
        $scope.$watch("data.tu_ngay",function(n,o){
            if(n && n!==o){
                $scope.getTienHang();
            }
        })
        $scope.$watch("data.den_ngay",function(n,o){
            if(n && n!==o){
                $scope.getTienHang();
            }
        })
        $scope.getTienHang();
    }
});