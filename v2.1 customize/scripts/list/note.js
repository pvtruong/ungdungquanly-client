var noteModule = new baseInput('note','note',["title","content"],'Ghi chú',{
	has_view:true
});
noteModule.module.directive("note",function(){
	return {
		restrict:'E',
		scope:{
			link:'='
		},
		templateUrl:"templates/lists/note/templates/directive.html",
		controller:['$scope','$http','$location','$window','$uibModal','note','appInfo','$rootScope',function($scope,$http,$location,$window,$uibModal,note,appInfo,$rootScope){
			appInfo.info("note",function(e,u,a){
				if(e) return;
				$scope.server_url = server_url;
				$scope.token = $rootScope.token;
				$scope.addNote=function(){
					noteModule.quickadd($uibModal,function(rs){
						$scope.notes.push(rs);
					},{id_link:$scope.idLink})
				}
				$scope.saveNote=function(content){
					$scope.$emit("$dataSaveStart")
					var n ={content:content,id_link:$scope.idLink}
					note.create(id_app,n).then(function(rs){
						$scope.notes.push(rs.data);
						$scope.content =""
						$scope.$emit("$dataSaveSuccess")
					},function(e){
						console.log(e.data)
						$scope.$emit("$dataSaveError")
					})
				}
				$scope.viewNote=function(n){
					$location.url("/note/view/"+n._id + "?redirect=" + $location.url());
				}
				$scope.deleteNote = function(n){
					$rootScope.confirm("Bạn có chắc chắn xóa ghi chú này không?").then(function(buttonIndex){
                        if(buttonIndex==1){
                            note.delete(id_app,n._id)
                                .then(function(rs){
                                    $scope.notes = _.reject($scope.notes,function(r){
                                        return(r._id ==n._id);
                                    });
                                },function(e){
                                    if(e.data) $rootScope.alert(e.data);
                                })
                        }
					});
				}
				$scope.editNote=function(n){
					noteModule.quickedit($uibModal,n._id,function(rs){
						_.extend(n,rs);
					});
				}
				$scope.load = function(){
					note.load(id_app,{condition:{id_link:$scope.idLink}})
						.then(function(notes){
							$scope.notes = notes.data;
						},function(e){
							if(e.data) $rootScope.alert(e.data);
						})
				}
				$scope.openProfile=function(email){
					viewProfile($uibModal,email)
				}
				$scope.$watch("link",function(newValue){
					if(newValue){
						$scope.idLink = $scope.link._id;
						$scope.load();
					}
				},true)
			})
			
		}],
		link:function($scope,element,attrs,controller){
			if(!attrs.link){
				console.error("note directive require 'link' attribute")
			}
			
		}
	}
})