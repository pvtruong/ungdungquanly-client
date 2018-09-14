var rptctbanle = new baseRpt('ctbanle','ctbanle','Chi tiết bán hàng',{
    onAfterLoadData:function($scope,data){
        var _data_pivot =[];
        data.forEach(function(row){
            if(!row.bold){
                var _row ={};
                _row["Số chứng từ"] = row.so_ct;
                _row["Ngày chứng từ"] = moment(row.ngay_ct).format("DD/MM/YYYY");
                _row["Mã chứng từ"] = row.ma_ct;
                _row["Diễn giải"] = row.dien_giai;

                _row["Khách hàng"] = row.ten_kh;
                _row["Nhóm khách"] = row.ten_nh_kh;

                _row["Mã kho"] = row.ma_kho;
                _row["Tên kho"] = row.ten_kho;

                _row["Mã sản phẩm"] = row.ma_vt;
                _row["Tên sản phẩm"] = row.ten_vt;
                 _row["Nhóm sản phẩm"] = row.ten_nvt;

                 _row["Lô"] = row.ma_lo;
                _row["Hạn sử dụng"] = row.han_sd;
                _row["Thuộc tính 1"] = row.ma_tt1;
                _row["Thuộc tính 2"] = row.ma_tt2;
                _row["Thuộc tính 3"] = row.ma_tt3;

                _row["Bộ phận"] = row.ten_bp;
                _row["Vụ việc"] = row.ten_dt;
                _row["Hợp đồng"] = row.ten_hd;
                _row["Phí"] = row.ten_phi;
                _row["Nhân viên"] = row.ten_nv;

                _row["SL bán"] = row.sl_xuat;
                _row["Tiền hàng"] = row.tien;
                _row["Tiền chiết khấu"] = row.tien_ck;
                _row["Doanh thu"] = row.doanh_thu;

                _row["SL trả lại"] = row.sl_nhap;
                _row["Tiền trả lại"] = row.tien_tl;

                //_row["Tiền vốn"] = row.tien_xuat-row.tien_nhap;

                //_row["Lãi"] = row.lai;



                _data_pivot.push(_row);

            }
        });

        $scope.data_pivot = _data_pivot;
    }
});
rptctbanle.defaultCondition = function(condition){
	var c = new Date();
	condition.tu_ngay = new Date(Date.UTC(c.getFullYear(),c.getMonth(),1));
	condition.den_ngay = c;
}
