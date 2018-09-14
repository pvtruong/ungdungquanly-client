﻿var rptphanbochitienchohoadon = new baseRpt('phanbochitienchohoadon','phanbochitienchohoadon','Phân bổ tiền chi cho các hóa đơn',{
	onLoading:function($scope,options){
		var $filter = options.$filter;
		var $location = options.$location;
		$scope.select = function(pt){
			$scope.current_pt = pt;
			$scope.data.forEach(function(d){
				d.selected = false;
			})
			pt.selected = true;
			$scope.invoices =[]
			var url = server_url + "/api/" + id_app + "/phanbochitienchohoadon/invoices?id_ct=" + pt._id + "&ma_kh=" + pt.ma_kh
			options.$http.get(url).then(function(rs){
				$scope.invoices =rs.data
			},function(e){
				options.$rootScope.alert("Không thể lấy hóa đơn của khách hàng này")
			})
		}
		$scope.tinhthanhtoanqd =function(invoice){
			invoice.thanh_toan_qd = STP.round((invoice.tien_nt_alloc * $scope.current_pt.ty_gia)/invoice.ty_gia_hd,2);
		}
		$scope.phanbotudong = function(){
			var da_phan_bo_nt =0;
			var con_lai_nt = $scope.current_pt.t_tien_nt;
			$scope.invoices.forEach(function(invoice){
				invoice.tien_nt_bk =invoice.tien_nt
				
				if(invoice.con_lai_nt< con_lai_nt){
					invoice.tien_nt_alloc = invoice.con_lai_nt
					invoice.tien_nt = invoice.con_lai_nt
				}else{
					invoice.tien_nt_alloc = con_lai_nt;
					invoice.tien_nt = con_lai_nt
				}
				invoice.tien = invoice.tien_nt_alloc * $scope.current_pt.ty_gia;
				invoice.thanh_toan_qd =STP.round(invoice.tien/invoice.ty_gia_hd,2);
				
				da_phan_bo_nt = da_phan_bo_nt + invoice.tien_nt_alloc;
				con_lai_nt = con_lai_nt -invoice.tien_nt_alloc;
				//
				invoice.id_ct = $scope.current_pt._id;
				invoice.ngay_ct = $scope.current_pt.ngay_ct;
				invoice.so_ct = $scope.current_pt.so_ct;
				invoice.ma_ct ="PC1";
				invoice.ma_nt = $scope.current_pt.ma_nt;
				invoice.ty_gia = $scope.current_pt.ty_gia;
				invoice.status = $scope.current_pt.status;
				invoice.tk_co = $scope.current_pt.tk_co;
			})
			//save
			var url =server_url + "/api/" + id_app + "/phanbochitienchohoadon/save"
			options.$http.post(url,$scope.invoices).then(function(rs){
				$scope.current_pt.da_phan_bo_nt = da_phan_bo_nt;
				$scope.current_pt.con_lai_nt =con_lai_nt;
			},function(e){
				$scope.invoices.forEach(function(inv){
					inv.tien_nt =inv.tien_nt_bk;
				})
				options.$rootScope.alert("Không thể lưu phân bổ này\n" + e.data)
			})
		}
		$scope.allocate4invoice = function(invoice){
			if(invoice.tien_nt_alloc>invoice.con_lai_nt){
				alert("Số tiền phân bổ cho hóa đơn này lớn hơn số tiền còn phải chi")
				return;
			}
			if(invoice.tien_nt_alloc>$scope.current_pt.con_lai_nt +invoice.tien_nt){
				alert("Số tiền phân bổ cho hóa đơn này lớn hơn số tiền chưa phân bổ của phiếu chi hiện tại")
				return;
			}
			invoice.id_ct = $scope.current_pt._id;
			invoice.ngay_ct = $scope.current_pt.ngay_ct;
			invoice.so_ct = $scope.current_pt.so_ct;
			invoice.ma_ct ="PC1";
			invoice.ma_nt = $scope.current_pt.ma_nt;
			invoice.ty_gia = $scope.current_pt.ty_gia;
			invoice.status = $scope.current_pt.status;
			invoice.tk_co = $scope.current_pt.tk_co;
			
			invoice.tien_nt_bk =invoice.tien_nt
			invoice.tien_nt = invoice.tien_nt_alloc;
			invoice.tien = invoice.tien_nt_alloc * invoice.ty_gia;
			var url =server_url + "/api/" + id_app + "/phanbochitienchohoadon/save"
			options.$http.post(url,[invoice]).then(function(rs){
				$scope.current_pt.da_phan_bo_nt =$scope.current_pt.da_phan_bo_nt + (invoice.tien_nt-invoice.tien_nt_bk); 
				$scope.current_pt.con_lai_nt =$scope.current_pt.t_tien_nt - $scope.current_pt.da_phan_bo_nt;
			},function(e){
				invoice.tien_nt =invoice.tien_nt_bk;
				options.$rootScope.alert("Không thể lưu phân bổ này\n" + e.data)
			})
		}
	},
	onStartGetData:function($scope,next){
		$scope.invoices =[];
		next()
	}
});
rptphanbochitienchohoadon.defaultCondition = function(condition){
	var c = new Date();
	condition.tu_ngay = new Date(c.getFullYear(),c.getMonth(),1);
	condition.den_ngay = c;
}
