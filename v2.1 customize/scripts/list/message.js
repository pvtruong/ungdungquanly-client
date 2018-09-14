var messageModule = new baseInput('message','message',["email_owner","email_receiver","email_sender","content"],'Tin nhắn',{
	services:function($http){
		var sv ={
			list:function(id_app,condition,fields,count,page,limit){
					var fields_find = ["email_owner","email_receiver","email_sender","content"];
					var url =server_url + "/api/message/colleague/list?t=1" ;
					if(count==1){
						url = url + "&count=1";
					}
					if(page){
						url = url + "&page=" + page.toString();
					}
					if(limit){
						url = url + "&limit=" + limit.toString();
					}
					if(angular.isObject(condition)){
						var q =JSON.stringify(condition);

						url = url + "&q=" + q;
					}else{
						if(!(!condition || condition.trim()=="" || !fields_find || fields_find.length==0)){

							var query = "";
							fields_find.forEach(function(field){
								if(query==""){
									query = field + "=" + condition;
								}else{
									query =query + "&" +  field + "=" + condition;
								}
							});
							if(query!=""){
								url = url + "&" + query;
							}

						}
					}
					if(fields){
						url = url + "&fields=" + fields;
					}
					return $http.get(url);

				},
				chat:function(id_app,email_dt){
					return $http.get(server_url + "/api/message/chat/" + email_dt );
				},
	      support:function(guest,data){
					return $http.post(server_url + "/public/support/" + guest,data);
				},
				get:function(id_app,id){
					return $http.get(server_url + "/api/message/" + id );
				},
				create:function(id_app,data){
					return $http.post(server_url + "/api/message",data);
				},
				update:function(id_app,id,data){
					return $http.put(server_url + "/api/message/" + id,data);
				},
				delete:function(id_app,id){
					return $http.delete(server_url + "/api/message/" + id );
				}
		}
		sv.load = function(id_app,options){
			if(options){
				return sv.list(id_app,options.condition,options.fields,options.count,options.page,options.limit)
			}else{
				return sv.list(id_app);
			}

		}
		return sv;
	},
	onAdd:function($scope,options){
		if(!$scope.data.email_sender){
			$scope.data.email_sender = options.$rootScope.user.email;
		}
		if(!$scope.data.email_owner){
			$scope.data.email_owner = options.$rootScope.user.email;
		}
	},
	onSaved:function($scope,data,options){
		data.email_coll = data.email_receiver;
		data.picture_coll = "/images/avatar.jpg";
		data.name_coll = data.email_receiver;

		data.latest_message =data.content;

		data.latest_message_date =data.date_created;
		data.latest_message_read =true;
	}
});
messageModule.module.controller('baseMessageChatController',['$scope','$location','$routeParams','$rootScope','message','$window','$uibModal','socket','user','appInfo','$http',function($scope,$location,$routeParams,$rootScope,message,$window,$uibModal,socket,user,appInfo,$http){
	initLabel($rootScope,$scope,appInfo,'message',$http);
    appInfo.info("message",function(error,userinfo,appinfo){
			if(!error){
				var email_owner = $rootScope.user.email;
				var email_dt = $routeParams.email;
				user.getProfile(email_dt,function(error,profile){
					if(error){
						$scope.profile = {
							email:email_dt,
							picture:"/images/avatar.jpg",
							name:email_dt
						};
					}else{
						$scope.profile = profile;
					}

				});
        var message_received ={};
				socket.on('message:new',function(data) {
          if(!message_received[data._id]){
            message_received[data._id] = data._id;
            if($scope.profile){
                data.picture_sender = $scope.profile.picture;
                data.name_sender =$scope.profile.name;
            }
            $scope.msgs.push(data);
						message.update(undefined,data._id,{read:true}).lean().exec(function(res){
							data.read = true;
						})
          }
				});
				$scope.data ={};
				$scope.data.email_receiver = email_dt;
				message.chat(undefined,email_dt).then(function(msgs){
					$scope.msgs = msgs.data;
					$scope.msgs.forEach(function(msg){
						if(!msg.read){
							message.update(undefined,msg._id,{read:true}).lean().exec(function(res){
								msg.read = true;
							})
						}

					})
				});
				$scope.send = function(){
					message.create(undefined,$scope.data).then(function(r){
						$scope.data.content = "";
						$scope.msgs.push(r.data);
					},function(error){
						$rootScope.alert(error.data);
					});
				}
				$scope.enter2send = function(event){
					if(event.keyCode==13){
						$scope.send();
					}
				}
				$scope.deleteMsg = function(_id){
					$rootScope.confirm("Có chắc chắn xóa tin nhắn này không?").then(function(ind){
						if(ind===1){
							message.delete(null,_id).then(function(){
								$scope.msgs = _.reject($scope.msgs,function(msg){
									return msg._id ==_id;
								});
							},function(error){
								alert("Không thể xóa tin  nhắn này");
							});
						}
					})
				}
				$scope.openProfile = function(email){
					messageModule.viewProfile($uibModal,email);
				}
			}
		}
	);


}]);
messageModule.module.controller('baseMessageHomeController',['$scope','$location','$routeParams','$rootScope','message','$window',function($scope,$location,$routeParams,$rootScope,message,$window){
	$scope.chat = function(r){
		var email_coll = r.email_coll;
		$location.url("message/chat/" + email_coll);
	}
}]);
messageModule.initHomeController = function($controller,$scope){
	$controller("baseMessageHomeController",{$scope:$scope});
}
messageModule.module.controller('supportController',['$scope','user','$localStorage','$rootScope','$location','app','$window','$routeParams','socket','message',function($scope,user,$localStorage,$rootScope,$location,app,$window,$routeParams,socket,message){
    var title = $routeParams.title;

    var token = "guest@" + $window.btoa(title)
    var email_owner=token;
    socket.on('connect',function() {
      socket.emit("login",{token:token,email:email_owner});
    });
    $scope.profile = {email:token,name:title};
    $scope.msgs =[];
    var message_received ={};
    socket.on('message:new',function(data) {
        if(!message_received[data._id]){
            message_received[data._id] = data._id;
            $scope.msgs.push(data);
        }
    });
    $scope.data={title:title};
    $scope.data.content ="";
    $scope.send = function(){
        message.support(token,$scope.data).then(function(res){
            var m ={};
            _.extend(m,$scope.data);
            m.date_created = new Date();
            m.email_sender = email_owner;
            m.name_sender = title;
            m._id = $scope.msgs.length;
            $scope.msgs.push(m);
            $scope.data.content = "";
        },function(res){
            $rootScope.alert(res.data);
        });
    }
    $scope.enter2send = function(event){
        if(event.keyCode==13){
            $scope.send();
        }
    }
    $scope.deleteMsg = function(_id){
        $scope.msgs = _.reject($scope.msgs,function(msg){
            return msg._id ==_id;
        });
    }
    $scope.openProfile = function(email){
        messageModule.viewProfile($uibModal,email);
    }


}]);
messageModule.module.config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider){
		$routeProvider.when("/message/chat/:email",{
				templateUrl:"templates/lists/message/templates/edit.html",
				controller:"baseMessageChatController"
			})
        .when("/support/:title",{
				templateUrl:"templates/lists/message/templates/support.html",
				controller:"supportController"
			});
}]);
