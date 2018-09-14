var rptsosanhkhvatt = new baseRpt('sosanhkhvatt','sosanhkhvatt','So sánh kế hoạch và thực tế',{
	onAfterLoadData:function($scope,data){
			var _data_pivot =[];
			data.forEach(function(row){
					if(!row.bold){
							var _row ={};
							_row["Nhóm kế hoạch"] = row.group_name;
							_row["Năm"] = row.nam;
							_row["Tháng"] = row.thang;
							_row["Kho/cửa hàng"] = row.ten_kho;
							_row["Nhân viên"] = row.ten_nv;
							_row["Bộ phận"] = row.ten_bp;
							_row["Vụ việc/dự án"] = row.ten_dt;
							_row["Phí"] = row.ten_phi;
							_row["Kế hoạch"] = row.chi_tieu;
							_row["Thực tế"] = row.ps;
							_row["Chênh lệch"] = row.cl;
							_data_pivot.push(_row);
					}
			});

			$scope.data_pivot = _data_pivot;
	}
});

rptsosanhkhvatt.defaultCondition = function(condition){
	var c = new Date();
	condition.nam = c.getFullYear();
	condition.tu_thang = c.getMonth()+1;
	condition.den_thang = c.getMonth()+1;
}

rptsosanhkhvatt.module.directive("sosanhkhvattView",function(){
	return {
		restrict:'E',
		templateUrl:"templates/reports/sosanhkhvatt/templates/view.html"
	}
});
