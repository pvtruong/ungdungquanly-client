var rptbkct = new baseRpt('bkct','bkct','Bảng kê chứng từ',{
    onAfterLoadData:function($scope,data){
        var _data_pivot =[];
        data.forEach(function(row){
            if(!row.bold){
                var _row ={};
                _row["Số chứng từ"] = row.so_ct;
                _row["Ngày chứng từ"] = row.ngay_ct;
                _row["Mã chứng từ"] = row.ma_ct;
                _row["Diễn giải"] = row.dien_giai;
                _row["Khách hàng(nợ)"] = row.ten_kh_no;
                _row["Khách hàng(có)"] = row.ten_kh_co;
                _row["Nhóm khách hàng(nợ)"] = row.ten_nh_kh_no;
                _row["Nhóm khách hàng(có)"] = row.ten_nh_kh_co;
                _row["Bộ phận"] = row.ten_bp;
                _row["Vụ việc"] = row.ten_dt;
                _row["Hợp đồng"] = row.ten_hd;
                _row["Phí"] = row.ten_phi;
                _row["Nhân viên"] = row.ten_nv;
                 _row["TK nợ"] = row.tk_no;
                 _row["TK có"] = row.tk_co;
                 _row["Tiền"] = row.tien;
                _row["Tiền ngoại tệ"] = row.tien_nt;
                 _row["Mã ngoại tệ"] = row.ma_nt;
                _row["Tỷ giá"] = row.ty_gia;

                _data_pivot.push(_row);
            }
        });

        $scope.data_pivot = _data_pivot;
    }
});
rptbkct.defaultCondition = function(condition){
	var c = new Date();
	condition.tu_ngay = new Date(c.getFullYear(),c.getMonth(),1);
	condition.den_ngay = c;
}
rptbkct.module.directive("bkctView",function(){
	return {
		restrict:'E',
		templateUrl:"templates/reports/bkct/templates/view.html"
	}
});
rptbkct.module.directive("bkct",function(){
	return {
		restrict:'E',
		scope:{
			condition:'@',
			run:'='
		},
		templateUrl:"templates/reports/bkct/templates/view.html",
		controller:['$scope','$http','$filter','$location','$rootScope','appInfo',function($scope,$http,$filter,$location,$rootScope,appInfo){
      initLabel($rootScope,$scope,appInfo,'bkct',$http);
			$scope.getData = function(){
				$scope.data = [];
				var condition = eval("({" + $scope.condition +  "})");
				rptbkct.getData($http,$filter,condition,function(e,data){
					if(!e){
						$scope.data = data;
					}else{
						console.log(e);
					}
				})
			}
			$scope.viewVoucher = function(ma_ct,id_ct){
				if(ma_ct && id_ct){
					var url = ma_ct.toLowerCase() +  "/edit/" + id_ct + "?redirect=back";
					//$location.url(url)
                    $rootScope.openUrl(url);
				}

			}
			$scope.order = function(predicate, reverse) {
				$scope.data = $filter("orderBy")($scope.data, predicate, reverse);
			};
		}],
		link:function($scope){
			$scope.$watch("run",function(newValue){
				if($scope.run){
					$scope.getData();
				}
			})
		}
	}

})
