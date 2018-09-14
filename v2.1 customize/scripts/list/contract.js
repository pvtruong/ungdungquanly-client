var contractModule = new baseInput('contract','contract',["so_hd","ten_hd"],'Hợp đồng',{
	has_view:true,modal_size:'md',
	onAdd:function($scope,options){
		$scope.data.phu_trach = options.$rootScope.user.email;
		$scope.data.progress =0;
        $scope.data.loai_hd ='1';
	},
	onInput:function($scope,options){
		$scope.tinhTienDotThanhToan = function(){
			if($scope.data.dot_thanh_toan){
				$scope.data.dot_thanh_toan.forEach(function(dot){
					dot.tien_nt = STP.round($scope.data.tien_nt*dot.ty_le/100,$scope.f_tien_nt);
				})
			}
		}
	},
	onLoading:function($scope,options){
		$scope.advCondition ={}
		options.$rootScope.nextTick(function(){

    STPModules['group'].obj.getService(options.$http,options.$q,options.$rootScope).load(id_app,{filter:{group_type:'CONTRACT'}})
			.then(function(groups){
				$scope.groups = groups.data;
        $scope.groups.push({group_name:'Khác'});
        $scope.groups.forEach(function(r){
            r.sel = true;
        })
			})
      //labels
      STPModules['label'].obj.getService(options.$http,options.$q,options.$rootScope).load(id_app,{filter:{label_type:'CONTRACT'}})
      .then(function(groups){
          $scope.contactLabels = groups.data;
          $scope.contactLabels.push({label_name:null})
          $scope.contactLabels.forEach(function(r){
              r.sel = true;
          })
      })
      //members
      $scope.members =[];
      _.extend($scope.members,options.$rootScope.members);
      $scope.members.push({name:"Khác"})
      $scope.members.forEach(function(m){
          m.sel =true;
      })

		})
		$scope.progresses =[{value:0,text:'Chưa thực hiện',sel:true},{value:1,text:'Đang thực hiện',sel:true},{value:2,text:'Hoàn thành',sel:true},{value:3,text:'Tạm dừng',sel:true},{value:4,text:'Đang chờ',sel:true}]
		$scope.searchAVR = function(){
			if(!$scope.renderCompleted){
				return;
			}
			if(!$scope.filter){
				$scope.filter ={}
			}
			var ps =[]
			$scope.progresses.forEach(function(p){
				if(p.sel) ps.push(p.value)
			})
			$scope.filter.progress={$in:ps}


      //labels
      delete $scope.filter.labels
      if( $scope.contactLabels && $scope.contactLabels.length>0){
          var labels_sel =  $scope.contactLabels.filter(function(r){return r.sel})
          if(labels_sel.length<$scope.contactLabels.length){
              $scope.filter.labels={$in:_.pluck(labels_sel,'label_name')};
          }
      }
			//phu trach
      delete $scope.filter.phu_trach
      if( $scope.members && $scope.members.length>0){
          var members_sel =  $scope.members.filter(function(r){return r.sel})
          if(members_sel.length<$scope.members.length){
              $scope.filter.phu_trach={$in:_.pluck(members_sel,'email')};
          }
      }
      //groups
      delete $scope.filter.nh_hd
      if( $scope.groups && $scope.groups.length>0){
          var groups_sel =  $scope.groups.filter(function(r){return r.sel})
          if(groups_sel.length<$scope.groups.length){
              $scope.filter.nh_hd={$in:_.pluck(groups_sel,'_id')};
          }
      }

			//time
			var tu_ngay,den_ngay;
			var curr = new Date;
			var m = $scope.time;
			if(m=='d'){
				//xem ngay hien tai
				tu_ngay = new Date();
				den_ngay = new Date();

			}
			if(m=='w'){
				var first = curr.getDate() - curr.getDay() + 1; // First day is the day of the month - the day of the week
				var tu_ngay = new Date(curr.setDate(first));
				var den_ngay = new Date(curr.setDate(tu_ngay.getDate()+6));
			}
			if(m=='m'){
				//xem thang hien tai
				tu_ngay = curr;
				tu_ngay.setDate(1);
				den_ngay = new Date(tu_ngay.getFullYear(),tu_ngay.getMonth()+1,0);
			}
			if(m=='3m'){
				//xem quy hien tai
				var current_month = curr.getMonth();
				var quy=1;
				if(current_month<3) quy=0; else if (current_month<6) quy =3; else if (current_month<6) quy=6; else quy=9;
				tu_ngay = new Date(curr.getFullYear(),quy,1);
				den_ngay = new Date(curr.getFullYear(),quy + 3,0);
			}
			if(m=='y'){
				//xem nam hien tai
				tu_ngay = new Date(curr.getFullYear(),0,1);
				den_ngay = new Date(curr.getFullYear(),11,31);
			}

			if(tu_ngay && den_ngay){
				tu_ngay.setHours(0);
				tu_ngay.setMinutes(0);
				tu_ngay.setSeconds(0)

				den_ngay.setHours(23);
				den_ngay.setMinutes(59);
				den_ngay.setSeconds(0);
				$scope.filter.ngay_hd ={$gte:tu_ngay,$lte:den_ngay};
			}else{
				delete $scope.filter.ngay_hd
			}
			//
			if($scope.advCondition.ten_hd){
				$scope.filter.$or =[{ten_hd:{$regex:$scope.advCondition.ten_hd,$options:'i'}},{so_hd:{$regex:$scope.advCondition.ten_hd,$options:'i'}}]
			}else{
				delete $scope.filter.$or
			}
			if($scope.advCondition.ten_kh){
				$scope.filter.ten_kh =$scope.advCondition.ten_kh
			}else{
				delete  $scope.filter.ten_kh
			}
			if($scope.advCondition.progress){
				$scope.filter.progress =$scope.advCondition.progress
			}
			if($scope.advCondition.ngay_hd){
				$scope.filter.ngay_hd =$scope.advCondition.ngay_hd
			}
			if($scope.advCondition.ngay_nt){
				$scope.filter.ngay_nt =$scope.advCondition.ngay_nt
			}

			$scope.search();
		}
		$scope.enter = function(event){
			if(event.keyCode==13){
				$scope.searchAVR();
			}
		}
		$scope.reportByTime = function(m){
			$scope.time =m;
			$scope.searchAVR();
		}
		$scope.searchPhuTrach = function(m){
			$scope.phu_trach = m.email
			$scope.searchAVR()
		}
		$scope.searchGroup = function(m){
			$scope.nh_hd = m._id;
			$scope.searchAVR()
		}
		$scope.$watch("progresses",function(newValue){
			$scope.filter_title ="Lọc dữ liệu"
			$scope.searchAVR()
		},true)
		$scope.changeProgress = function(obj,progress){
			var t ={}
			_.extend(t,obj);
			t.progress = progress;
			options.service.update(id_app,t._id,t).then(function(res){
				var nt = res.data;
				_.extend(obj,nt);
			},function(e){
				if(e.data) $options.$rootScope.alert(e.data);
			})
		}
	},
	onView:function($scope,options){
		$scope.f_tien_nt = options.$rootScope.app_info.f_tien_nt;

		$scope.addContact = function(){
			lienheModule.quickadd(options.$uibModal,function(rs){
				rs.collection_name ="lienhe";
				$scope.addLink(rs,'ten_lien_he')
			})

		}
		$scope.tinhTienDotThanhToan = function(){
			if($scope.data.dot_thanh_toan){
				$scope.data.dot_thanh_toan.forEach(function(dot){
					dot.tien_nt = STP.round($scope.data.tien_nt*dot.ty_le/100,$scope.f_tien_nt);
				})
			}
		}
		$scope.addCustomer = function(){
			dmkhModule.quickadd(options.$uibModal,function(rs){
				rs.collection_name ="dmkh";
				$scope.addLink(rs,'ten_kh');
				if(!$scope.data.id_kh){
					$scope.data.id_kh = rs._id;
					options.service.update(id_app,$scope.data._id,$scope.data).then(function(res){
						var t = res.data
						_.extend($scope.data,t);
					})
				}
			})

		}
	}
});
contractModule.defaultValues ={
	ngay_hd:new Date(),ma_nt:'VND'
}
contractModule.module.directive("contract",function(){
	return {
		restrict:'E',
		scope:{
			link:'=',
			collection:'@',
			defaultValues:'@'
		},
		templateUrl:"templates/lists/contract/templates/directive.html",
		controller:['$scope','$shttp','$window','$location','$uibModal','appInfo','$rootScope','contract',function($scope,$http,$window,$location,$uibModal,appInfo,$rootScope,contract){
			appInfo.info("contract",function(e,u,appinfo){
				if(e) return;
				$scope.textSearch="";
				$scope.location = $location.url();
				$scope.collectionsLink = "contract:'ten_hd'";
				var collectionsLink = eval("({" + $scope.collectionsLink + "})")
				var collections = _.keys(collectionsLink)
				$scope.load = function(){
					var url = server_url + "/api/" + id_app + "/linkslist?_id=" + $scope.link._id + "&collections=" + collections.join();
					$http.get(url,{cache:true}).then(function(res){
						$scope.list =res.data;
					},function(e){
						if(e.data && _online) $rootScope.alert(e.data);
					});
				}
				$scope.getHeaderCollection = function(r){
					var module_name = r.collection_obj + "Module";
					var module = eval("(" + module_name  + ")")
					return module.title;
				}
				$scope.search = function(value){
					var url = server_url + "/api/" + id_app + "/search?collections=" + $scope.collectionsLink + "&value=" + value;
					return $http.get(url).then(function(res){
						var items = res.data;
						return items;
					});
				}
				$scope.addLink = function(obj){
					$scope.textSearch ="";
					if(!$scope.list) $scope.list =[];
					var check = _.find($scope.list,function(item){
						return item.obj._id==obj._id;
					})
					if(check){
						return;
					}
					var obj_link = {}
					obj_link.id_a = $scope.link._id;
					obj_link.collection_a = $scope.collection;

					obj_link.collection_b = obj.collection_name;
					obj_link.collection_obj =obj.collection_name;
					obj_link.id_b = obj._id;

					var url =server_url + "/api/" + id_app + "/link";
					$http.post(url,obj_link).then(function(res){
						_.extend(obj_link,res.data);
						obj_link.obj = obj;
						obj_link.title = obj.title;
						$scope.list.push(obj_link);
					},function(e){
						//$window.alert(e);
					})

				}
				$scope.unLink = function(obj){
					var url =server_url + "/api/" + id_app + "/link/" + obj._id;
					$http.delete(url).then(function(rs){
						$scope.list = _.reject($scope.list,function(item){
							return item._id==obj._id;
						})
					},function(e){
						//$window.alert(e);
					})

				}
				$scope.getItem = function($item, $model, $label){
					$scope.addLink($item);

				}
				$scope.add=function(){

					var defaultValues ={}
					if($scope.defaultValues){
						defaultValues =eval("({" + $scope.defaultValues + "})");
					}
					contractModule.quickadd($uibModal,function(rs){
						rs.collection_name ="contract";
						$scope.addLink(rs)
					},defaultValues)
				}
				$scope.view=function(item){
					var url ="contract/view/"+item._id + "?redirect=" + $location.url();
					$location.url(url);
				}
				$scope.delete = function(item){
					$rootScope.confirm("Bạn có chắc chắn xóa không?").then(function(btnIndex){
						if(btnIndex==1){
							contract.delete(id_app,item._id)
								.then(function(rs){
									$scope.list = _.reject($scope.list,function(r){
										return(r._id ==item._id);
									});
								},function(e){
									if(e.data) $rootScope.alert(e.data);
								})
						}
					})
				}
				$scope.edit=function(item){
					contractModule.quickedit($uibModal,item._id,function(rs){
						_.extend(item,rs);
					});
				}
				$scope.$watch('link',function(newValue){
					if(newValue){
						$scope.load()
					}
				},true)
			})

		}],
		link:function(scope,elem,attrs,contr){
			if(!attrs.link || !attrs.collection){
				console.error("contract directive require attributes:link,collection")
			}

		}
	}
})
