var kehoachmhModule = new baseVoucher('kehoachmh','kehoachmh',[],'Kế hoạch mua hàng',{
  onLoading:function($scope,$options){
      $scope.createContract = function(kehoachmh){
          var _contract = JSON.parse(JSON.stringify(kehoachmh));

          _contract.id_kehoachmh = _contract._id;
          _contract.details.forEach(function(d){
            d.so_luong = d.sl_ke_hoach-d.sl_contract;
          })
          delete _contract._id;
          delete _contract.so_ct;
          delete _contract.trang_thai;
          delete _contract.ngay_ct;

          purchase_contractModule.quickadd($options.$uibModal,function(ct){
              $options.service.get(id_app,kehoachmh._id).then(function(res){
                _.extend(kehoachmh,res.data);
              })
          },_contract);
      }
      $scope.createDnm = function(kehoachmh){
          var _contract = JSON.parse(JSON.stringify(kehoachmh));

          _contract.id_kehoachmh = _contract._id;
          _contract.details.forEach(function(d){
            d.so_luong = d.sl_ke_hoach-d.sl_dnm;
          })
          delete _contract._id;
          delete _contract.so_ct;
          delete _contract.trang_thai;
          delete _contract.ngay_ct;

          dnmModule.quickadd($options.$uibModal,function(ct){
              $options.service.get(id_app,kehoachmh._id).then(function(res){
                _.extend(kehoachmh,res.data);
              })
          },_contract);
      }
  },

  onInput:function($scope,$options){

    $scope.tinhKeHoach = function(){
      var url =server_url_report + "/api/" + id_app + "/uoctinhnvl?tu_ngay=" + moment($scope.data.kh_tu_ngay).format("YYYY-MM-DD") + "&den_ngay=" + moment($scope.data.kh_den_ngay).format("YYYY-MM-DD");
      $options.$http.get(url).then(function(res){
        $scope.data.details = res.data;
        $options.$rootScope.toast("Chương trình đã thự hiện xong");
      },function(err){
        $options.$rootScope.alert(err.data||"Không thể kết nối được với máy chủ");
      })

    }
  },
  onSave:function($scope,data,$options,next){
    console.log(data);
    next(null,data);
  }
});
kehoachmhModule.defaultValues ={
  loai_ke_hoach:1
}
kehoachmhModule.defaultValues4Detail = {
	sl_nhu_cau:0,
  sl_da_cap_phat:0,
  sl_ke_hoach:0,
  sl_da_nhap:0,
  sl_contract:0
}
kehoachmhModule.defaultCondition4Search = {tu_ngay:new Date(),den_ngay:new Date(),so_ct:'',dien_giai:''};

kehoachmhModule.prepareCondition4Search = function($scope,vcondition){
	return {
		so_ct:{$regex:$scope.vcondition.so_ct,$options:'i'},
		dien_giai:{$regex:$scope.vcondition.dien_giai,$options:'i'},
		ngay_ct:{
			$gte:dateTime2Date($scope.vcondition.tu_ngay),
			$lte:dateTime2Date($scope.vcondition.den_ngay)
		}
	};
}
