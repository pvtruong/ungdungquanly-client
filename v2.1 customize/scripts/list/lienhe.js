var lienheModule = new baseInput('lienhe','lienhe',["ten_lien_he","dia_chi","dien_thoai","email"],'Liên hệ',{
		has_view:true,modal_size:'md',
		onLoading:function($scope,options){
			options.$rootScope.nextTick(function(){
				STPModules['group'].obj.getService(options.$http,options.$q,options.$rootScope).load(id_app,{filter:{group_type:'LIENHE'}})
                .then(function(groups){
                    $scope.groups = groups.data;
                })
                STPModules['label'].obj.getService(options.$http,options.$q,options.$rootScope).load(id_app,{filter:{label_type:'LIENHE'}})
                .then(function(groups){
                    $scope.contactLabels = groups.data;
                    $scope.contactLabels.push({label_name:null})
                    $scope.contactLabels.forEach(function(r){
                        r.sel = true;
                    })
                })
			})
			$scope.advCondition ={}
			$scope.searchAVR =function(){
				if(!$scope.renderCompleted){
					return;
				}
				$scope.filter ={}
				if($scope.nh_lh){
					$scope.filter.nh_lh=$scope.nh_lh
				}else{
					delete $scope.filter.nh_lh
				}
                //filter by labels
                delete $scope.filter.labels
                if( $scope.contactLabels && $scope.contactLabels.length>0){
                    var labels_sel =  $scope.contactLabels.filter(function(r){return r.sel})
                    if(labels_sel.length<$scope.contactLabels.length){
                        $scope.filter.labels={$in:_.pluck(labels_sel,'label_name')};
                    }
                }

                /*if($scope.label_name){
					$scope.filter.labels=$scope.label_name
				}else{
					delete $scope.filter.labels
				}*/


				if($scope.advCondition.ten_lien_he){
					$scope.filter.$or=[{ten_lien_he:{$regex:$scope.advCondition.ten_lien_he,$options:'i'}},{dien_thoai:{$regex:$scope.advCondition.ten_lien_he,$options:'i'}},{email:{$regex:$scope.advCondition.ten_lien_he,$options:'i'}}]
				}else{
					delete $scope.filter.$or
				}
				if($scope.advCondition.ten_kh){
					$scope.filter.ten_kh=$scope.advCondition.ten_kh
				}else{
					delete $scope.filter.ten_kh
				}
				if($scope.advCondition.dien_thoai){
					$scope.filter.dien_thoai={$regex:$scope.advCondition.dien_thoai,$options:'i'}
				}else{
					delete $scope.filter.dien_thoai
				}
				if($scope.advCondition.email){
					$scope.filter.email={$regex:$scope.advCondition.email,$options:'i'}
				}else{
					delete $scope.filter.email
				}
				if($scope.advCondition.dia_chi){
					$scope.filter.dia_chi={$regex:$scope.advCondition.dia_chi,$options:'i'}
				}else{
					delete $scope.filter.dia_chi
				}
                //console.log("filter",$scope.filter)
				//search
				$scope.search();
			}
			$scope.searchGroup = function(m){
				$scope.nh_lh = m._id;
				$scope.searchAVR()
			}
            $scope.searchLabel = function(m){
				$scope.label_name = m.label_name;
				$scope.searchAVR()
			}
			$scope.enter = function(event){
				if(event.keyCode==13){
					$scope.searchAVR();
				}
			}
			$scope.btn3_click = function(){
				var to=[]
				$scope.list.forEach(function(c){
					if(c.email && c.sel){
                        if(!_.find(to,function(t){return t.address==c.email}))
						to.push({name:c.ten_lien_he,address:c.email})
					}
				})

				if(to.length>0){
                    STPModules['mailschedule'].obj.quickadd(options.$uibModal,function(){
                    },{to:to});
				}else{
					options.$rootScope.alert("Bạn phải chọn ít nhất một liên lạc")
				}

			}
            $scope.setLabel = function(){
                 STPModules['label'].obj.quickview(options.$uibModal,{label_type:'LIENHE'},function(){


                 },{
                     templateUrl:'list-view',
                     onListItemClick:function(selectedItem,$uibModalInstance){
                         var label_name = selectedItem.label_name;
                         async.map(_.filter($scope.list,function(l){return l.sel}),function(c,callback){
                            if(!c.labels) c.labels =[];
                            if(!_.find(c.labels,function(t){return t==label_name})){
                                c.labels.push(label_name);
                                $scope.update(c,function(e){
                                    callback(e);
                                })
                            }else{
                                callback();
                            }
                        },function(e,rs){
                            if(e) return options.$rootScope.alert(e)
                            STPModules['label'].obj.getService(options.$http,options.$q,options.$rootScope).load(id_app,{filter:{label_type:'LIENHE'}})
                            .then(function(groups){
                                $scope.contactLabels = groups.data;

                            })
                            options.$rootScope.alert("Chương trình đã thực hiện xong");
                        })

                        $uibModalInstance.close();
                     }
                 })
			}
		},
		onView:function($scope,options){
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
		}
});
