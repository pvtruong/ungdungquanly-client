var rptModule = new baseInput('rpt','rpt',["ma_cn","ten_mau_in"],'Quản lý mẫu in',{cache_data:false,
	onAdd:function($scope,options){
		var params = options.$location.search();
		var ma_cn = params.ma_cn;
		if(!params.redirect && ma_cn){
			//options.$location.search("redirect","/rpt?ma_cn=" + ma_cn)
		}
		
	},
	onEdit:function($scope,options){
		var ma_cn = $scope.data.ma_cn;
		if(!options.$location.search().redirect){
			//options.$location.search("redirect","/rpt?ma_cn=" + ma_cn)
		}
	},
    onLoad:function($scope,options){
       
    }
});

rptModule.module.controller("initrpt",["$scope","$window","$interval","$localStorage",function($scope,$window,$interval,$localStorage){
	$scope.action_upload = server_url + "/api/uploadexcel?json=1&access_token=" + $localStorage.get('token');
	
    $scope.$on('$fileUploadSuccess',function(e,data){
		if(data.fileUrl) $scope.data.file_mau_in = data.fileUrl;
		
	});
	$scope.$on('$fileUploadError', function(e,error){
	   $scope.error = error;
	});
    
	//deprecated
	$scope.changeFile = function(){
		var w = $window.open("#uploadexcel","Upload file","width=600,height=300");
		var interval = $interval(function(){
			if(w.document.body.innerHTML=="success"){
				$scope.data.file_mau_in = w.document.title;
				w.close();
				$interval.cancel(interval);
			}
		},100);
	}
}]);
rptModule.init = function($scope,$controller){
	$controller("initrpt",{$scope:$scope});
}
