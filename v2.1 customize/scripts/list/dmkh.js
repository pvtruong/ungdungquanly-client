//["ma_kh","ten_kh","dia_chi","dien_thoai","fax","email"]
var dmkhModule = new baseInput('dmkh','customer',["ma_kh","ten_kh","dia_chi","dien_thoai","fax","email"],'Khách hàng',{
    modal_size:'md',
	has_view:true,
	onView:function($scope,options){
		$scope.addContact = function(){
			lienheModule.quickadd(options.$uibModal,function(rs){
				rs.collection_name ="lienhe";
				$scope.addLink(rs,'ten_lien_he');
			},{id_kh:$scope.data._id,ten_kh:$scope.data.ten_kh})
		}
	},
    onAdd:function($scope,options){
        $scope.data.phu_trach = options.$rootScope.user.email;
        $scope.data.visible_to =0;
        $scope.data.kh_yn =true;
        $scope.data.ncc_yn =false;
    },
	onLoading:function($scope,options){
		$scope.advCondition ={}
		options.$rootScope.nextTick(function(){
			//options.$http.get(server_url + "/api/" + id_app + "/group?q={group_type:'CUSTOMER'}",{cache:true})
            STPModules['group'].obj.getService(options.$http,options.$q,options.$rootScope).load(id_app,{filter:{group_type:'CUSTOMER'}})
			.then(function(groups){
				$scope.groups = groups.data;
                $scope.groups.push({group_name:'Khác'});
                $scope.groups.forEach(function(r){
                    r.sel = true;
                })
			})
            //labels
            STPModules['label'].obj.getService(options.$http,options.$q,options.$rootScope).load(id_app,{filter:{label_type:'CUSTOMER'}})
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
		$scope.btn3_click = function(){
				var to=[]
				$scope.list.forEach(function(c){
					if(c.email && c.sel){
						if(!_.find(to,function(t){return t.address==c.email}))
						to.push({name:c.ten_kh,address:c.email})
					}
				})
				if(to.length>0){
				    STPModules['mailschedule'].obj.quickadd(options.$uibModal,function(){

                    },{to:to});
                }else{
					alert("Bạn phải chọn ít nhất một liên lạc")
				}

			}
		$scope.searchAVR =function(){
			if(!$scope.renderCompleted){
				return;
			}
			$scope.filter ={}
			//by time
			var tu_ngay,den_ngay;
			var curr = new Date;
			if($scope.time=='d'){
				//xem ngay hien tai
				tu_ngay = new Date();
				den_ngay = new Date();

			}
			if($scope.time=='w'){
				var first = curr.getDate() - curr.getDay() + 1; // First day is the day of the month - the day of the week
				var tu_ngay = new Date(curr.setDate(first));
				var den_ngay = new Date(curr.setDate(tu_ngay.getDate()+6));
			}
			if($scope.time=='m'){
				//xem thang hien tai
				tu_ngay = curr;
				tu_ngay.setDate(1);
				den_ngay = new Date(tu_ngay.getFullYear(),tu_ngay.getMonth()+1,0);
			}
			if($scope.time=='3m'){
				//xem quy hien tai
				var current_month = curr.getMonth();
				var quy=1;
				if(current_month<3) quy=0; else if (current_month<6) quy =3; else if (current_month<6) quy=6; else quy=9;
				tu_ngay = new Date(curr.getFullYear(),quy,1);
				den_ngay = new Date(curr.getFullYear(),quy + 3,0);
			}
			if($scope.time=='y'){
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
				$scope.filter.date_created ={$gte:tu_ngay,$lte:den_ngay};
			}
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
            delete $scope.filter.nh_kh
            if( $scope.groups && $scope.groups.length>0){
                var groups_sel =  $scope.groups.filter(function(r){return r.sel})
                if(groups_sel.length<$scope.groups.length){
                    $scope.filter.nh_kh={$in:_.pluck(groups_sel,'_id')};
                }
            }
            //
			if($scope.advCondition.ten_kh){
				$scope.filter.$or =[{ten_kh:{$regex:$scope.advCondition.ten_kh,$options:'i'}},{ma_kh:{$regex:$scope.advCondition.ten_kh,$options:'i'}},{dien_thoai:{$regex:$scope.advCondition.ten_kh,$options:'i'}},{phu_trach:{$regex:$scope.advCondition.ten_kh,$options:'i'}},{email:{$regex:$scope.advCondition.ten_kh,$options:'i'}}]
			}else{
				delete $scope.filter.$or
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
			if($scope.advCondition.ma_so_thue){
				$scope.filter.ma_so_thue={$regex:$scope.advCondition.ma_so_thue,$options:'i'}
			}else{
				delete $scope.filter.ma_so_thue
			}
			//search
			$scope.search();
		}
		$scope.enter = function(event){
			if(event.keyCode==13){
				$scope.searchAVR();
			}
		}
		$scope.searchPhuTrach = function(m){
			$scope.phu_trach = m.email;
			$scope.searchAVR()
		}
		$scope.searchGroup = function(m){
			$scope.nh_kh = m._id;
			$scope.searchAVR()
		}
		$scope.reportByTime = function(m){
			$scope.time=m;
			$scope.searchAVR();
		}
	}
});
dmkhModule.module.config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider){
		$routeProvider
			.when("/dmkh/calling",{
				templateUrl:"templates/sys/callin.html",
				controller:["$scope","$rootScope","appInfo","$http","$uibModal","$location"
                            ,function($scope,$rootScope,appInfo,$http,$uibModal,$location){
                    initLabel($rootScope,$scope,appInfo,"dmkh",$http);
                    appInfo.info("dmkh",function(error,userinfo,appinfo){
                        if(!error){
                            $scope.data = $location.search();
                            $scope.data.dien_thoai = $scope.data.phone;
                            $scope.data.ten_nguoi_nhan = $scope.data.ten_kh;
                            $scope.editKh = function(call){
                                dmkhModule.quickdetailview($uibModal,call.id_kh,function(rs){
                                    $scope.data.id_kh = rs._id;
                                    _.extend($scope.data,rs);
                                });
                            }
                            $scope.addKh = function(call){
                                dmkhModule.quickadd($uibModal,function(rs){
                                    $scope.data.id_kh = rs._id;
                                    _.extend($scope.data,rs);
                                },{dien_thoai:call.phone,ma_kh:call.phone});
                            }
                            $scope.addTask = function(call){
                                taskModule.quickadd($uibModal,function(e,rs){

                                },{id_kh:call.id_kh,ten_kh:call.ten_kh,ma_kh:call.ma_kh});
                            }
                            $scope.addSo1 = function(call){
                                so1Module.quickadd($uibModal,function(e,rs){

                                },call);
                            }
                            $scope.addHd2 = function(call){
                                hd2Module.quickadd($uibModal,function(e,rs){
                                    $uibModalInstance.close();
                                },call);
                            }
                            $scope.addHd1 = function(call){
                                hd1Module.quickadd($uibModal,function(e,rs){
                                    $uibModalInstance.close();
                                },call);
                            }
                        }
                    })
                }]
			})
}])

dmkhModule.callIn = function($uibModal,data){
    var modalInstance = $uibModal.open({
      templateUrl:"templates/sys/callin.html",
      controller:  ['$scope','$rootScope','$controller','$http', '$uibModalInstance','$window','appInfo',function($scope,$rootScope,$controller,$http, $uibModalInstance,$window,appInfo){
            initLabel($rootScope,$scope,appInfo,"SYS",$http);

              try{
                  var audio = new Audio('audio/alert.mp3');
                  audio.play();
              }catch(e){

              }
            $scope.data = data;
            $scope.data.dien_thoai = data.phone;
            $scope.data.ten_nguoi_nhan = $scope.data.ten_kh;
            $scope.close= function () {
                $uibModalInstance.close();
            }
            $scope.editKh = function(call){
                dmkhModule.quickdetailview($uibModal,call.id_kh,function(rs){
                    $scope.data.id_kh = rs._id;
                    _.extend($scope.data,rs);
                });
            }
            $scope.addKh = function(call){
                dmkhModule.quickadd($uibModal,function(rs){
                    $scope.data.id_kh = rs._id;
                    _.extend($scope.data,rs);
                },{dien_thoai:call.phone,ma_kh:call.phone});
            }
            $scope.addTask = function(call){
                taskModule.quickadd($uibModal,function(e,rs){
                    $uibModalInstance.close();
                },{id_kh:call.id_kh,ten_kh:call.ten_kh,ma_kh:call.ma_kh});
            }
            $scope.addSo1 = function(call){
                so1Module.quickadd($uibModal,function(e,rs){
                    $uibModalInstance.close();
                },call);
            }
            $scope.addHd2 = function(call){
                hd2Module.quickadd($uibModal,function(e,rs){
                    $uibModalInstance.close();
                },call);
            }
            $scope.addHd1 = function(call){
                hd1Module.quickadd($uibModal,function(e,rs){
                    $uibModalInstance.close();
                },call);
            }

        }],
      size: "sm",//size:'lg',
      resolve: {
        parentScope: function () {

        }
      }
    });
}
