var mailreceivedModule = new baseInput('mailreceived','mailreceived',["subject","small_text"],'Email đã nhận',{
	modal_size:'lg',
	has_view:true,
	onView:function($scope,options){
        $scope.downloadFile = function(att){
           var url = server_url_report + '/api/attachments/' + $scope.data._id + '/' + att.contentId + '?access_token=' + options.$rootScope.token;
           var name = att.fileName;
           options.$rootScope.downloadFile(url,name);
        }
		var data ={_id:$scope.data._id,read:true};
		options.service.update(id_app,$scope.data._id,data)
			.then(function(data){
				_.extend($scope.data,data.data);
			},function(e){
				options.$rootScope.alert(e.data);
			})
		$scope.createTask = function(){
			taskModule.quickadd(options.$uibModal,function(rs){
				rs.collection_name ="task";
				$scope.addLink(rs,'ten_cv');
			},{ten_cv:$scope.data.subject,mieu_ta:$scope.data.mail.html})
		}
		$scope.createContact = function(){
			lienheModule.quickadd(options.$uibModal,function(rs){
				rs.collection_name ="lienhe";
				$scope.addLink(rs,'ten_lien_he');
			},{ten_lien_he:$scope.data.from[0].name,email:$scope.data.from[0].address})
		}
		$scope.createCustomer = function(){
			dmkhModule.quickadd(options.$uibModal,function(rs){
				rs.collection_name ="dmkh";
				$scope.addLink(rs,'ten_kh');
			},{ten_kh:$scope.data.from[0].name,email:$scope.data.from[0].address})
		}
		$scope.reply = function(){
				var to =$scope.data.from;
				var from = $scope.data.to;
				var subject = "Trả lời: " + $scope.data.subject;
				var html = $scope.data.mail.html.toString();
				var quote = "<div><br/>--lúc " + $scope.data.date_created.toLocaleString() + " <b>" + $scope.data.from[0].name + '&lt;' + $scope.data.from[0].address +  '&gt; </b> đã viết--<br/></div><blockquote>' + html + '</blockquote>';

				mailscheduleModule.quickadd(options.$uibModal,function(rs){

				},{to:to,subject:subject,use_template:false,mail:{html:quote},send_type:0,repeat:0});
			}
	}
});
var mailreceived_current_page=1;
mailreceivedModule.module.directive("mailReceived",function(){
	return {
		restrict:'E',
		scope:{
			link:'='
		},
		templateUrl:"templates/lists/mailreceived/templates/directive.html",
		controller:['$scope','$rootScope','$http','$location','$window','$uibModal','mailreceived','socket','appInfo',function($scope,$rootScope,$http,$location,$window,$uibModal,mailreceived,socket,appInfo){
			appInfo.info("mailreceived",function(error,uerinfo,appinfo){
				if(error){
					return;
				}
                $scope.downloadFile = $rootScope.downloadFile;
				$scope.server_url = server_url;
				$scope.location = $location.url();
				$scope.current_page = mailreceived_current_page;
                $scope.mailreceiveds =[]
				$scope.pageChanged =function(page){
					$scope.current_page =page;
					mailreceived_current_page = page;
				}
				$scope.condition={txtsearch:'',account_id:""};
				$scope.viewmailreceived=function(mailreceived){
					$location.url("/mailreceived/view/"+mailreceived._id + "?redirect=" + $location.url());
				}
				$scope.deletemailreceived = function(mail){
					if($window.confirm("Bạn có chắc chắn xóa email này không?")){
						mailreceived.delete(id_app,mail._id)
							.then(function(rs){
								$scope.mailreceiveds = _.reject($scope.mailreceiveds,function(r){
									return(r._id ==mail._id);
								});
							},function(e){
								$rootScope.alert(e.data);
							})
					}
				}

				//load list mails
				$scope.service = mailreceived;
				$scope.limit =20;
				$scope.fields ='subject,from,to,user_created,date_created,small_text,read,account_id,attachments';
				$scope.search = function(){
					var query ={}

					/*if($scope.condition.username){
						query.to = {$elemMatch:{address:$scope.condition.username}};
					}*/
					if($scope.condition.account_id){
						query.account_id = $scope.condition.account_id;
					}
					if($scope.condition.txtsearch){
						query.$or =[{subject:{$regex:$scope.condition.txtsearch,$options:'i'}}];
						query.$or.push({from:{$elemMatch:{address:{$regex:$scope.condition.txtsearch,$options:'i'}}}});
						query.$or.push({'mail.text':{$regex:$scope.condition.txtsearch,$options:'i'}})
					}
					$scope.query = 	query;

					$scope.start = true;//get data from server by ng-page-fx
				}
				$scope.searchKeyup = function($event){
					if($event.keyCode==13){
						$scope.search();
					}

				}
				//select all
				$scope.isSelectAll = false;
				$scope.selectAll = function(){

					if(!$scope.mailreceiveds){
						return;
					}
					//$scope.isSelectAll = !$scope.isSelectAll;
					for(var i=0;i<$scope.mailreceiveds.length;i++){
						var r = $scope.mailreceiveds[i];
						r.sel = $scope.isSelectAll;
					}
				}
				//select 1 email
				$scope.isSelected =function(){
					if(!$scope.mailreceiveds){
						return false;
					}
					for(var i=0;i<$scope.mailreceiveds.length;i++){
						var r = $scope.mailreceiveds[i];
						if(r.sel && r.sel==true){
							return true;
						}
					}
					return false;
				}
				$scope.deleteSelected = function(){
					if(!$scope.mailreceiveds){
						return;
					}
					if($window.confirm("Bạn có chắc chắn xóa những email đã chọn không?")){
						var selected = _.filter($scope.mailreceiveds,function(mail){
							return mail.sel;
						})
						selected.forEach(function(mail){
							mailreceived.delete(id_app,mail._id)
								.then(function(rs){
									$scope.mailreceiveds = _.reject($scope.mailreceiveds,function(r){
										return(r._id ==mail._id);
									});
								},function(e){
									$rootScope.alert(e.data);
								})
						});

					}
				}
				$scope.linkSelected = function(){
					$window.alert("Chức năng này đang được xây dựng");
				}
				$scope.$watch("link",function(newValue){
					if(newValue){
						$scope.idLink = $scope.link.email;
						$scope.search();
					}
				},true)
			})

		}],
		link:function($scope,element,attrs,controller){
			if(!attrs.link){
				console.error("mail-received directive require 'link' attribute")
			}
		}
	}
})
mailreceivedModule.module.directive("dbInbox",function(){
	return {
		restrict:'E',
		scope:{

		},
		templateUrl:"templates/lists/mailreceived/templates/db.html",
		controller:['$scope','mailreceived','$rootScope','$location','$uibModal','socket','appInfo','nodeWebkit','$http',function($scope,mailreceived,$rootScope,$location,$uibModal,socket,appInfo,nodeWebkit,$http){
			initLabel($rootScope,$scope,appInfo,'mailreceived',$http);
            appInfo.info("mailreceived",function(error,uerinfo,appinfo){
				if(error){
					return;
				}
                $scope.downloadFile = $rootScope.downloadFile;
				$scope.now = new Date();
				$scope.isSelectAll = false;
				$scope.selectAll = function(){
					if(!$scope.mailreceiveds){
						return;
					}
					for(var i=0;i<$scope.mailreceiveds.length;i++){
						var r = $scope.mailreceiveds[i];
						r.sel = $scope.isSelectAll;
					}
				}

				$scope.app_info = $rootScope.app_info;
				$scope.condition ={read:null}
				$scope.filter = function(c){
					$rootScope.nextTick(function(){
						$scope.$emit("$dataChangeStart")
						mailreceived.load(id_app,{condition:$scope.condition,limit:10}).then(function(mailreceiveds){
							$scope.mailreceiveds = mailreceiveds.data;
							$scope.$emit("$dataChangeSuccess")
						},function(e){
							$scope.$emit("$dataChangeError")
						})
					})
				}
				$scope.viewMail=function(t){
					$location.url("mailreceived/view/" + t._id + "?redirect=dashboard")
				}
				$scope.delete = function(mail){
					if(confirm("Bạn có chắc chắn xóa email này không?")){
						mailreceived.delete(id_app,mail._id).then(function(e){
							$scope.mailreceiveds = _.reject($scope.mailreceiveds,function(m){
									return m._id==mail._id;
								})
						},function(e){
							$rootScope.alert(e.data);
						})
					}

				}
				$scope.markRead = function(mail){
					mailreceived.update(id_app,mail._id,{_id:mail._id,read:true}).then(function(e){
						$scope.mailreceiveds = _.reject($scope.mailreceiveds,function(m){
							return m._id==mail._id;
						})
					},function(e){
						$rootScope.alert(e.data);
					})

				}
				$scope.createTask = function(data){
					taskModule.quickadd($uibModal,function(rs){
						rs.collection_name ="task";
						$scope.addLink(rs,'ten_cv');
					},{ten_cv:data.subject,mieu_ta:data.mail.html})
				}
				$scope.createContact = function(data){
					lienheModule.quickadd($uibModal,function(rs){
						rs.collection_name ="lienhe";
						$scope.addLink(rs,'ten_lien_he');
					},{ten_lien_he:data.from[0].name,email:data.from[0].address})
				}

				$scope.getEmail = function(_id){
					if(!$scope.mailreceiveds){
						$scope.mailreceiveds =[];
					}
					mailreceived.load(id_app,{condition:{_id:_id}})
					.then(function(res){
						var data = res.data
						if(data.length==1){
							data[0].is_new = true;
							var c =_.find($scope.mailreceiveds,function(r){
								return r._id == _id;
							})
							if(!c){
								$scope.mailreceiveds.push(data[0])
                                nodeWebkit.notification("Bạn có email mới","","/mailreceived/view" + _id );
							}
						}
					},function(e){
						$rootScope.alert(e.data);
					})

				}
				socket.on('email',function(email) {

					$scope.getEmail(email._id)
				});
				$scope.filter({});
			})

		}],
		link:function($scope,elem,attrs,controller){

		}
	}
});
