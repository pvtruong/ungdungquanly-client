var module = angular.module('searchModule',['ngRoute']);
module.controller('searchController',['$scope','$rootScope','$location','$http','$routeParams','dmkh','dmvt','dmtk','lienhe','task','contract','dmdt','$window','$localStorage','appInfo',function($scope,$rootScope,$location,$http,$routeParams,dmkh,dmvt,dmtk,lienhe,task,contract,dmdt,$window,$localStorage,appInfo){
	$scope.word = $routeParams.word
	$rootScope.searchword = $scope.word

	$rootScope.function_title ="Tìm";
	$rootScope.function_sub_title =$scope.word;
	$rootScope.function_code ="Search";

	appInfo.info("SEARCH",function(error,userinfo,appinfo){
		if(!error){
		$scope.viewProduct = function(id){
			$rootScope.openUrl("dmvt/view/" + id+ "?redirect=" + $location.url())
		}
		$scope.viewCustomer = function(id){
			$rootScope.openUrl("dmkh/view/" + id + "?redirect=" + $location.url())
		}
		$scope.viewAccount = function(id){
			$rootScope.openUrl("dmtk/view/" + id + "?redirect=" + $location.url())
		}
		$scope.viewContact = function(id){
			$rootScope.openUrl("lienhe/view/" + id + "?redirect=" + $location.url())
		}
		$scope.viewTask = function(id){
			$rootScope.openUrl("task/view/" + id + "?redirect=" + $location.url())
		}
		$scope.viewContract = function(id){
			$rootScope.openUrl("contract/view/" + id + "?redirect=" + $location.url())
		}
		$scope.viewProject = function(id){
			$rootScope.openUrl("dmdt/view/" + id + "?redirect=" + $location.url())
		}
		$scope.viewVoucher = function(ma_ct,id_ct){
				if(ma_ct && id_ct){
					var url = "/" +  ma_ct.toLowerCase() +  "/edit/" + id_ct
					$rootScope.openUrl(url);
				}

			}
		//find functions
		$scope.functions =[]
		var findword = $scope.word.toLowerCase();
		if($rootScope.commands){
			$rootScope.commands.forEach(function(module){
                module.input.forEach(function(group){
                    if(group.path){
                        if(group.visible && group.header.toLowerCase().indexOf(findword)>=0){
                            $scope.functions.push(group);
                        }
                    }else{
                        if(group.items){
                            group.items.forEach(function(fs){
                                if(fs.visible && fs.header.toLowerCase().indexOf(findword)>=0){
                                    $scope.functions.push(fs);
                                }
                            })
                        }

                    }

                })

			})

		}
		//find customer
		dmkh.list(id_app,$scope.word,null,null,1,50)
			.then(function(res){
				var data = res.data
				$scope.customers = data;
				var kh=[]
				data.forEach(function(k){
					kh.push(k.ma_kh)
				})
				dmtk.list(id_app,$scope.word,null,null,1,50).then(function(res){
					var t = res.data
					$scope.accounts = t;
					var tk =[]
					t.forEach(function(k){
						tk.push(k.tk)
					})
					//find voucher
					var token = $localStorage.get('token');
					var q = {$or:[]}
					q.$or.push({dien_giai:{$regex:$scope.word,$options:'i'}})
					q.$or.push({so_ct:{$regex:$scope.word,$options:'i'}})
					q.$or.push({ma_ct:{$regex:$scope.word,$options:'i'}})
					q.$or.push({ma_kh:{$regex:$scope.word,$options:'i'}})
					q.$or.push({tk_no:{$regex:$scope.word,$options:'i'}})
					q.$or.push({tk_co:{$regex:$scope.word,$options:'i'}})
					if(kh.length>0){
						q.$or.push({ma_kh_no:{$in:kh}})
						q.$or.push({ma_kh_co:{$in:kh}})
					}
					if(tk.length>0){
						q.$or.push({tk_no:{$in:tk}})
						q.$or.push({tk_co:{$in:tk}})
					}
					var url = server_url + "/api/" + id_app + "/bkct?access_token=" + token + "&q=" + JSON.stringify(q)
					$http.get(url).then(function(vouchers){
						$scope.vouchers = vouchers.data
					})
				})

			},function(e){
			})
		//find product
		dmvt.list(id_app,$scope.word,null,null,1,50)
			.then(function(data){
				$scope.products = data.data;
			},function(e){
			})

		//find contacts
		lienhe.list(id_app,$scope.word,null,null,1,50)
			.then(function(data){
				$scope.contacts = data.data;
			},function(e){
			})

		//find contracts
		contract.list(id_app,$scope.word,null,null,1,50)
			.then(function(data){
				$scope.contracts = data.data;
			},function(e){
			})
		//find project
		dmdt.list(id_app,$scope.word,null,null,1,50)
			.then(function(data){
				$scope.projects = data.data;
			},function(e){
			})

		//find task
		task.list(id_app,$scope.word,null,null,1,50)
			.then(function(data){
				$scope.dscv = data.data;
			},function(e){
			})
		}
	})


}])
module.config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider){
	$routeProvider
		.when("/search/:word",{
			templateUrl:"templates/reports/search/templates/browser.html",
			controller:"searchController"
		})

}]);
