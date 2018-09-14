var commentModule = new baseInput('comment','comment',["title","content"],'Nhận xét, góp ý',{
	has_view:true,
	onCondition:function(condition,value){
		condition.is_reply = false;
		condition.id_product = null;
	},
	onView:function($scope,options){
		var data = $scope.data;
		$scope.replies =[data]
		var query ={is_reply:true,id_topic:data._id};
		options.service.load(id_app,{condition:query})
			.then(function(res){
				var rs = res.data
				rs.forEach(function(r){
					$scope.replies.push(r);
				})

			},function(e){
				console.log(e.data);
			});
		$scope.reply = function(){
			var r={content:$scope.content,is_reply:true,id_topic:data._id,title:data.title}
			options.service.create(id_app,r)
				.then(function(res){
					var rs = res.data
					$scope.replies.push(rs);
					$scope.content ="";
				},function(e){
					console.log(e.data)
				})
		}
		$scope.quickedit = function(r){
			commentModule.quickedit(options.$uibModal,r._id,function(rs){
				_.extend(r,rs);
			})
		}
		$scope.deleteReply = function(r){
			options.$rootScope.confirm("Có chắc chắn xóa không?").then(function(ind){
				if(ind==1){
					options.service.delete(id_app,r._id)
						.then(function(res){
							$scope.replies = _.reject($scope.replies,function(re){
								return(r._id ==re._id);
							});
						},function(error){
							var e;
							if(_.isObject(error.data)){
								e = JSON.stringify(error.data);
							}else{
								e = error.data;
							}

							if(e.indexOf("Lỗi:")>=0){
								options.$rootScope.alert(e)
							}else{
								options.$rootScope.alert("Không thể xóa");
							}
						});
				}
			})
		}
	}
});
commentModule.module.directive('comment',function(){
	return{
		restrict:'E',
		scope:{
			link:'=',
			user:'=',
			title:'@'
		},
		templateUrl:"templates/lists/comment/templates/directive.html",
		link:function(scope,elem,attrs,controller){
			if(!attrs.user){
				console.error("comment directive require 'user' attribute")
			}
			if(!attrs.link){
				console.error("comment directive require 'link' attribute")
			}
		},
		controller:['$scope','$http','$window','$uibModal','$rootScope','$location','appInfo','comment',function($scope,$http,$window,$uibModal,$rootScope,$location,appInfo,sv_comment){

			appInfo.info("comment",function(e,u,a){
				if(e) return;
				$scope.token = $rootScope.token;
				$scope.server_url = server_url;
				if(!$scope.user) $scope.user = u;

				$scope.openProfile = function(email){
					viewProfile($uibModal,email);
				}
				$scope.getMembers = function(){
					//get members
					if($rootScope.app_info && $rootScope.app_info.participants){
						members =[];
						a = $rootScope.app_info;
						if(a.participants){
							members = _.pluck(a.participants,"email");
						}
						members.push(a.user_created)
						$scope.members = members;
					}
				}
				$scope.deleteComment = function(comment){
					$rootScope.confirm("Bạn có chắc chắn xóa nhận xét này không?").then(function(ind){
                        if(ind==1){
                            //$http.delete(server_url + "/api/comment/" + comment._id)
							sv_comment.delete(id_app,comment._id).then(function(rs){
								$scope.comments = _.reject($scope.comments,function(r){
									return(r._id ==comment._id);
								});

							},function(e){
								if(e) $rootScope.alert(e);
							})
                        }

					})
				}
				$scope.editComment = function(comment){
					commentModule.quickedit($uibModal,comment._id,function(rs){
						_.extend(comment,rs);

					})
				}
				$scope.sendComment = function(content){
					if(!$scope.title){
						$scope.title ="Comment"
					}
					var comment ={id_product:$scope.idLink,title:$scope.title,content:content,user_created_obj:$scope.link.user_created,is_reply:true}
					comment.url_topic = server_url + "/#" + $location.url();
					if($scope.link.attends){
						comment.attends = $scope.link.attends;
					}
					//$http.post(server_url + "/api/comment",comment)
                    sv_comment.create(id_app,comment).then(function(res){
						var rs = res.data;
						$scope.content ="";
						if(rs){
							if(!$scope.comments){
								$scope.comments =[]
							}
							$scope.comments.push(rs);


						}
					},function(e){
						if(e.data) $rootScope.alert(e.data);
					})
				}
				$scope.load =function(){
					//$http.get(server_url + "/api/comment?q={id_product:'" + $scope.idLink  + "'}")
				    sv_comment.load(id_app,{filter:{id_product:$scope.idLink}}).then(function(comments){
                        $scope.comments = comments.data;

                    },function(e){
                        //$window.alert(e);
                    })
				}

				$scope.$watch('link',function(newValue){
					if(newValue){
						$scope.idLink = $scope.link._id;
						$scope.load();
						$scope.getMembers()
					}
				},true)
			})

		}]
	}
})
commentModule.module.directive('commentCount',function(){
	return{
		restrict:'A',
		scope:{
			link:'='
		},
		link:function($scope,elem,attrs,controller){

			$scope.$watch('link',function(newValue){
				if(newValue){
					$scope.idLink = $scope.link._id;
					$scope.load(function(count){
						elem.text(count);
					});
				}
			},true)
		},
		controller:['$scope','comment',function($scope,sv_comment){
				$scope.load =function(fn){
						sv_comment.load(id_app,{filter:{id_product:$scope.idLink},count:1}).then(function(comments){
							fn(comments.data.rows_number);
						},function(e){
							fn(0);
						})
				}


		}]
	}
})
