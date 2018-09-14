var templaterptModule = new baseInput('templaterpt','templaterpt',["ma_cn","ten_mau_in"],'Quản lý mẫu in',{cache_data:false,  modal_size:'lg',
	onAdd:function($scope,options){
		var params = options.$location.search();
		var ma_cn = params.ma_cn;
		if(!params.redirect && ma_cn){
			//options.$location.search("redirect","/templaterpt?ma_cn=" + ma_cn)
		}
		$scope.data.exfields ={
			width:203,
			so_lien:1
		}
	},
	onEdit:function($scope,options){
		var ma_cn = $scope.data.ma_cn;
		if(!options.$location.search().redirect){
			//options.$location.search("redirect","/templaterpt?ma_cn=" + ma_cn)
		}
	},
	onInput:function($scope,$options){
		$scope.changeWidthPage = function(width){
			if($scope.data.html_code){
				var tmp = $($scope.data.html_code);
				if(tmp.attr("id")==="printView"){
					tmp.removeAttr("style");
					if(width){
						tmp.css("width",width + "mm");
						tmp.css("margin","0px auto");
					}
				}else{
					if(width){
						tmp = $("<div id='printView' style='width: " + width + "mm; margin: 0px auto;'>" + $scope.data.html_code + "</div>");
					}else{
						tmp = $("<div id='printView'>" + $scope.data.html_code + "</div>");
					}
				}
				$scope.data.html_code = tmp[0].outerHTML;
			}
		}
	},
  onLoad:function($scope,options){

  }
});
