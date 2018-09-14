var opportunityModule = new baseInput('opportunity','opportunity',["ten_co_hoi","mieu_ta","phu_trach"],'Cơ hội',{
	has_view:true,modal_size:'md',
	onAdd:function($scope,options){
		$scope.data.phu_trach = options.$rootScope.user.email;
        $scope.data.visible_to =1;

		$scope.data.status_opp =0;
        $scope.data.tinh_tren =0;
        $scope.tinh_trens =[
          {id:0,name:'tổng cộng'},
          {id:1,name:'hàng ngày'},
          {id:2,name:'hàng tháng'},
          {id:3,name:'hàng quý'},
          {id:4,name:'hàng năm'}
        ];

	},
	onEdit:function($scope,options){
		$scope.tinh_trens =[
          {id:0,name:'tổng cộng'},
          {id:1,name:'hàng ngày'},
          {id:2,name:'hàng tháng'},
          {id:3,name:'hàng quý'},
          {id:4,name:'hàng năm'}
        ];
	},
	onView:function($scope,options){
        $scope.tinh_trens =[
          {id:0,name:'tổng cộng'},
          {id:1,name:'hàng ngày'},
          {id:2,name:'hàng tháng'},
          {id:3,name:'hàng quý'},
          {id:4,name:'hàng năm'}
        ];

        if($scope.data.ngay_het_han){
            $scope.data.ngay_het_han= new Date($scope.data.ngay_het_han);
        }



		$scope.addContact = function(){
			lienheModule.quickadd(options.$uibModal,function(rs){
				rs.collection_name ="lienhe";
				$scope.addLink(rs,'ten_lien_he')
			})

		}
		$scope.addCustomer = function(){
			dmkhModule.quickadd(options.$uibModal,function(rs){
				rs.collection_name ="dmkh";
				$scope.addLink(rs,'ten_kh');
				if(!$scope.data.id_kh){
					$scope.data.id_kh = rs._id;
					options.service.update(id_app,$scope.data._id,$scope.data).then(function(t){
						_.extend($scope.data,t.data);
					})
				}
			})

		}


	},
	onLoading:function($scope,options){
		$scope.advCondition ={}
		options.$rootScope.nextTick(function(){


              STPModules['group'].obj.getService(options.$http,options.$q,options.$rootScope).load(id_app,{filter:{group_type:'OPP'}})
			.then(function(groups){
				$scope.groups = groups.data;
                $scope.groups.push({group_name:'Khác'});
                $scope.groups.forEach(function(r){
                    r.sel = true;
                })
			})
            //labels
            STPModules['label'].obj.getService(options.$http,options.$q,options.$rootScope).load(id_app,{filter:{label_type:'OPP'}})
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
		$scope.status_opps =[{value:0,text:'Đang theo dõi',sel:true},{value:1,text:'Thành công',sel:true},{value:2,text:'Thất bại',sel:true},{value:3,text:'Tạm dừng',sel:true},{value:4,text:'Quên',sel:true}]


		$scope.searchAVR = function(){
			if(!$scope.renderCompleted){
				return;
			}
			if(!$scope.filter){
				$scope.filter ={}
			}
			var ps =[]

			$scope.status_opps.forEach(function(p){
				if(p.sel) ps.push(p.value)
			})

			$scope.filter.status_opp ={$in:ps}

			/*if($scope.phu_trach){
				$scope.filter.phu_trach = $scope.phu_trach;
			}else{
				delete $scope.filter.phu_trach;
			}
			if($scope.nh_co_hoi){
				$scope.filter.nh_co_hoi = $scope.nh_co_hoi;
			}else{
				delete $scope.filter.nh_co_hoi;
			}*/
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
            delete $scope.filter.nh_co_hoi
            if( $scope.groups && $scope.groups.length>0){
                var groups_sel =  $scope.groups.filter(function(r){return r.sel})
                if(groups_sel.length<$scope.groups.length){
                    $scope.filter.nh_co_hoi={$in:_.pluck(groups_sel,'_id')};
                }
            }
			//
			if($scope.advCondition.ten_co_hoi){
				$scope.filter.$or =[{ten_co_hoi:{$regex:$scope.advCondition.ten_co_hoi,$options:'i'}},{mieu_ta:{$regex:$scope.advCondition.ten_co_hoi,$options:'i'}},{location:{$regex:$scope.advCondition.ten_co_hoi,$options:'i'}},{phu_trach:{$regex:$scope.advCondition.ten_co_hoi,$options:'i'}}];
			}else{
				delete $scope.filter.$or
			}
			if($scope.advCondition.ten_kh){
				$scope.filter.ten_kh =$scope.advCondition.ten_kh
			}else{
				delete  $scope.filter.ten_kh
			}

			if($scope.advCondition.status_opp){
				$scope.filter.status_opp =$scope.advCondition.status_opp
			}
			if($scope.advCondition.start_date){
				$scope.filter.start_date = {$gte:$scope.advCondition.start_date};
			}
			if($scope.advCondition.due_date){
				$scope.filter.due_date = {$lte:$scope.advCondition.due_date};
			}else{
				delete $scope.filter.due_date
			}
			//
			$scope.search();
		}
		$scope.reportByTime = function(m){
			$scope.time =m;
			$scope.searchAVR();
		}
		$scope.$watch("status_opps",function(newValue){
			$scope.filter_title ="Lọc dữ liệu"
			$scope.searchAVR()
		},true)
		$scope.searchPhuTrach = function(m){
			$scope.phu_trach = m.email
			$scope.searchAVR()
		}
		$scope.searchGroup = function(m){
				$scope.nh_co_hoi = m._id;
				$scope.searchAVR()
			}

		$scope.changeStatus_opp = function(obj,status_opp){
			var t ={}
			_.extend(t,obj);
			t.status_opp = status_opp;
			options.service.update(id_app,t._id,t).then(function(nt){
				_.extend(obj,nt.data);
			},function(e){
				if(e.data) options.$rootScope.alert(e.data);
			})
		}
		$scope.enter = function(event){
			if(event.keyCode==13){
				$scope.searchAVR();
			}
		}
	}
});

opportunityModule.module.directive("opportunity",function(){
	return {
		restrict:'E',
		scope:{
			link:'=',
			collection:'@',
			defaultValues:'@'
		},
		templateUrl:"templates/lists/opportunity/templates/directive.html",
		controller:['$scope','$http','$rootScope','$location','$uibModal','appInfo',function($scope,$http,$rootScope,$location,$uibModal,appInfo){
			appInfo.info("opportunity",function(e,u,a){
				if(e) return;
				$scope.server_url = server_url;
				$scope.textSearch="";
				$scope.location = $location.url();
				$scope.collectionsLink = "opportunity:'ten_co_hoi'";
				var collectionsLink = eval("({" + $scope.collectionsLink + "})")
				var collections = _.keys(collectionsLink)
				$scope.load = function(){
					var url = server_url + "/api/" + id_app + "/linkslist?_id=" + $scope.link._id + "&collections=" + collections.join();
					$http.get(url).then(function(rs){
						$scope.list =rs.data;
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
					$http.post(url,obj_link).then(function(rs){
						_.extend(obj_link,rs.data);
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
					$scope.addLink($item,$label);

				}
				$scope.add=function(){
					var defaultValues ={}
					if($scope.defaultValues){
						defaultValues =eval("({" + $scope.defaultValues + "})");
					}
					opportunityModule.quickadd($uibModal,function(rs){
						rs.collection_name ="opportunity";
						$scope.addLink(rs)
					},defaultValues)
				}
				$scope.view=function(item){
					var url ="opportunity/view/"+item._id + "?redirect=" + $location.url();
					$location.url(url);
				}
				$scope.delete = function(item){
					$rootScope.confirm("Bạn có chắc chắn xóa không?").then(function(ind){
						if(ind===1){
							$http.delete(server_url + "/api/"+id_app+"/opportunity/" + item._id)
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
					opportunityModule.quickedit($uibModal,item._id,function(rs){
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
		link:function($scope,elem,attrs,contr){
			if(!attrs.link || !attrs.collection){
				console.error("opportunity directive require attributes:link,collection")
			}

		}
	}
})
