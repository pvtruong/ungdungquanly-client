var dmbanModule = new baseInput('dmban','dmban',["ma_ban","ten_ban"],'Quản lý bán lẻ theo bàn',
    {
        limit:1000,
        onInput:function($scope,options){
            $scope.ma_kho =dmbanModule.ma_kho;
        }
    }
);
dmbanModule.loaded=function($scope,options){
    $scope.detectGroup();

    $scope.list.forEach(function(ban){
         var width_ban  = 100
         if(window.innerWidth<500){
             width_ban  = (window.innerWidth/3)-6
         }
          //ban.css={'float':'left','width':width_ban.toString() + 'px','height':(width_ban*80/100).toString() + 'px','margin':'2px','border':'1px solid silver','border-radius':'5px'};
        ban.css={}

    })

    $scope.getPBL();
}
dmbanModule.loading=function($scope,options){
   $scope.today = new Date();
   $scope.groupBy ='ARIA';
   $scope.groups =[];
   $scope.emptyOrNull = function(item){
      return !item.ma_nhom;
    }
   $scope.detectGroup = function(){
       if($scope.groupBy=='ARIA'){
             $scope.groups =$scope.areas;
             $scope.list.forEach(function(ban){
                 ban.ma_nhom =ban.nh_ban;

             })
         }else{
             $scope.groups =$scope.types;
             $scope.list.forEach(function(ban){
                 ban.ma_nhom =ban.loai_ban;

             })
         }
   }
   $scope.$watch('groupBy',function(n,o){
     if(n!==o){
         $scope.detectGroup()
     }
   })
   $scope.$watch('list',function(n,o){
     if(n!==o){
        $scope.detectGroup();
     }
   },true)
   $scope.$watch('ten_kho',function(n,o){
       dmbanModule.ten_kho = $scope.ten_kho;
   })
   $scope.$watch('ma_kho',function(n,o){
     dmbanModule.ma_kho = $scope.ma_kho;

         options.$rootScope.nextTick(function(){
            options.$http.get(server_url + "/api/" + id_app + "/group?q={group_type:'TABLE',ma_kho:'" +$scope.ma_kho + "'}")
            .then(function(res){

                $scope.areas = res.data;
                $scope.detectGroup();
            });
        })
       options.$rootScope.nextTick(function(){
            options.$http.get(server_url + "/api/" + id_app + "/group?q={group_type:'TABLE_TYPE',ma_kho:'" + $scope.ma_kho + "'}")
            .then(function(res){
                $scope.types = res.data;
                 $scope.detectGroup();
            });
        })

   })

   $scope.showCalendar = function(ban){
       var modalInstance = options.$uibModal.open({
          templateUrl:"templates/sys/calendar.html",
          controller:  ['$scope','$rootScope','appInfo','$controller','$http', '$uibModalInstance','$window','pbl','$uibModal','calendarConfig','parentScope',function($scope,$rootScope,appInfo,$controller,$http, $uibModalInstance,$window,pbl,$uibModal,calendarConfig,parentScope){
              initLabel($rootScope,$scope,appInfo,'CALENDAR',$http);
              calendarConfig.i18nStrings.weekNumber = 'Tuần {week}';
                $scope.cancel = function () {
                    $uibModalInstance.close();
                }
                $scope.ban = ban;

                $scope.close = function(){
                    $uibModalInstance.close();
                }
                $scope.vm ={};
                var vm = $scope.vm;

                //These variables MUST be set as a minimum for the calendar to work
                vm.calendarView = 'day';
                vm.viewDate = parentScope.today;
                $scope.thang = vm.viewDate.getMonth();
                $scope.nam = vm.viewDate.getFullYear();
                vm.events = [];

                vm.isCellOpen = true;

                vm.eventClicked = function(event) {
                 // alert('Clicked', event);
                    pblModule.quickedit($uibModal,event.item._id,function(item){
                          var n = convertItem2Event(item);
                          _.extend(event,n);
                      })
                };

                vm.eventEdited = function(event) {
                  //alert('Edited'+ event.item._id);
                  pblModule.quickedit($uibModal,event.item._id,function(item){
                      var n = convertItem2Event(item);
                      _.extend(event,n);
                  })
                };

                vm.eventDeleted = function(event) {
          					$rootScope.confirm("Bạn có chắc chắn xóa không?").then(function(ind){
          						if(ind===1){
          							pbl.delete(id_app,event.item._id).then(function(res){
          								var item = res.data;
          								vm.events = _.filter(vm.events,function(e){
          									return e.item._id!==event.item._id;
          								});
          							},function(e){
          							   $rootScope.alert(e.data); 
          							});
          						}
                    })
                };

                vm.eventTimesChanged = function(event) {
                  //alert('Dropped or resized', event);
                };
                var isEqualD = function(date1,date2){
                    if(date1.getFullYear()==date2.getFullYear() && date1.getMonth()==date2.getMonth() && date1.getDay()==date2.getDay() ){
                        return true;
                    }else{
                        return false;
                    }
                }
                vm.timespanClicked = function(calendarDate){
                    if(vm.calendarView === 'day')
                        $scope.add(calendarDate);
                    else{
                        if(vm.calendarView === 'month'){
                            var f = _.filter(vm.events,function(e){
                                return isEqualD(calendarDate,e.startsAt);
                            })
                            if(f.length===0)
                                 $scope.add(calendarDate);
                        }

                    }
                }
                vm.toggle = function($event, field, event) {
                  $event.preventDefault();
                  $event.stopPropagation();
                  event[field] = !event[field];
                };
               vm.viewChangeClicked = function(date, nextView) {
                  console.log(date, nextView);
                  return true;
                };

                var convertItem2Event = function(item){

                    var event = {
                            title: 'Số chứng từ: ' + item.so_ct + ', khách hàng: ' + (item.ten_kh?item.ten_kh:'Vãng lai'),

                            draggable: true,
                            resizable: true,
                            item:item
                          }
                    var tu_ngay = item.tu_ngay;
                    if(!tu_ngay) tu_ngay = item.ngay_ct;

                    var den_ngay = item.den_ngay;
                    if(!den_ngay) den_ngay = item.ngay_ct;

                    event.startsAt = new Date(tu_ngay);
                    event.endsAt = new Date(den_ngay);


                    if(event.startsAt.getTime()===event.endsAt.getTime()){
                        event.endsAt.setHours(event.endsAt.getHours()+1);
                    }

                    switch(item.trang_thai){
                        case 0:event.type='warning';
                            break;
                        case 1:event.type='important';
                            break;
                        default:event.type='info'
                    }
                    return event;
                }
                $scope.add = function(calendarDate){
                    if(!calendarDate) calendarDate = new Date();
                    pblModule.quickadd($uibModal,function(item){

                        vm.events.push(convertItem2Event(item));
                    },{ma_ban:ban.ma_ban,ngay_ct:calendarDate,tu_ngay:calendarDate,den_ngay:calendarDate,ma_kho:dmbanModule.ma_kho,ten_kho:dmbanModule.ten_kho})
                }
                $scope.load = function(){
                    $scope.loadding = true;
                    vm.events =[];
                    var tu_thang,den_thang;
                    if(vm.calendarView==='year'){
                        tu_thang =0;
                        den_thang = 11;
                    }else{
                        tu_thang =$scope.thang;
                        den_thang = $scope.thang;
                    }
                    var tu_ngay = new Date($scope.nam,tu_thang,1);
                    var den_ngay = new Date($scope.nam,den_thang+1,0);
                    var condition = {ma_ban:ban.ma_ban,ngay_ct:{$gte:tu_ngay,$lte:den_ngay}};


                    var request = pbl.load2(id_app,{condition:condition})
                    request.promise.then(function(res){
                        vm.events =[];
                        $scope.loadding = false;
                        var list = res.data;
                        list.forEach(function(item){
                            vm.events.push(convertItem2Event(item));
                        });
                    },function(res){
                         $scope.loadding = false;

                        var e = res.data;
                        if(e){
                            alert(e.message);
                        }
                        else
                            alert("Không kết nối được với máy chủ");
                    });
                }
                $scope.load();
                $scope.$watch('vm.viewDate',function(newValue){
                    if(newValue){
                        $scope.thang = newValue.getMonth();
                        $scope.nam = newValue.getFullYear();
                    }
                },true)
                $scope.$watch('thang',function(newValue,oldValue){
                    if(newValue && newValue!==oldValue){
                        $scope.load();
                    }
                },true)
                $scope.$watch('nam',function(newValue,oldValue){
                    if(newValue && newValue!==oldValue){
                        $scope.load();
                    }
                },true)

                $scope.$watch('vm.calendarView',function(newValue,oldValue){
                    if(newValue && newValue!==oldValue){
                        $scope.load();
                    }
                },true)


            }],
          size: "lg",
          resolve: {
            parentScope: function () {
              return $scope;
            }

          }
        });

   }
   options.$controller('dsbanController',{$scope:$scope});

}
dmbanModule.module.controller('dsbanController',['$scope','$rootScope','appInfo','$http','pbl','socket','nodeWebkit', function($scope,$rootScope,appInfo,$http,pbl,socket,nodeWebkit){
    $scope.pbls = []
    $scope.pblSync = function(){
        $scope.pbls = _.filter($scope.pbls,function(p){
            if(!p.tu_ngay || !p.den_ngay || !p.ma_ban ) return false;
            var tu_ngay = new Date(p.tu_ngay);
            tu_ngay.setHours(0);
            tu_ngay.setMinutes(0);
            var den_ngay = new Date(p.den_ngay);
            den_ngay.setHours(23);
            den_ngay.setMinutes(59);
            return $scope.today.getTime()>=tu_ngay.getTime() && $scope.today.getTime()<=den_ngay.getTime();
        })

        var width_ban  = 100
        if(window.innerWidth<500){
             width_ban  = (window.innerWidth/3)-6
        }


         $scope.list.forEach(function(ban){
           var f = _.find($scope.pbls,function(pbl){
               return pbl.ma_ban===ban.ma_ban && pbl.trang_thai==1;
           })

            //ban.css={'float':'left','width':width_ban.toString() + 'px','height':(width_ban*80/100).toString() + 'px','margin':'2px','border':'1px solid silver','border-radius':'5px'};
           ban.css={}
           if(f){
               ban.trang_thai=1;//dang co khach
               ban.css['background-color']='#FACDCF';
           }else{
               f = _.find($scope.pbls,function(pbl){
                   return pbl.ma_ban===ban.ma_ban && pbl.trang_thai==0;
               })
               if(f){
                   ban.trang_thai=0;//dat truoc
                   ban.css['background-color']='#F8FACD';

               }else{
                   f = _.find($scope.pbls,function(pbl){
                       return pbl.ma_ban===ban.ma_ban && pbl.trang_thai==2;
                   })
                   if(f){
                       ban.trang_thai=2;//da thanh toan
                       ban.css['background-color']='white';
                   }else{
                       ban.trang_thai=-1;
                       ban.css['background-color']='white';
                   }

               }
           }


        });
    }
    $scope.getPBL =function(){

        prepareTodayCondition();

        var condition ={tu_ngay:{$lte:$scope.cuoi_ngay},den_ngay:{$gte:$scope.dau_ngay}};

        pbl.load(id_app,{condition:condition}).then(
            function(res){
                $scope.pbls = res.data;
                $scope.pblSync();

            },function(res){
                if(res.data){
                    alert(res.data)
                }
            });

    }
    var prepareTodayCondition = function(){
        var today_time = $scope.today.getTime();
        $scope.cuoi_ngay = new Date(today_time);
        $scope.cuoi_ngay.setHours(23);
        $scope.cuoi_ngay.setMinutes(59);
        $scope.cuoi_ngay.setSeconds(59);

        $scope.dau_ngay = new Date(today_time);
        $scope.dau_ngay.setHours(0);
        $scope.dau_ngay.setMinutes(0);
        $scope.dau_ngay.setSeconds(0);
    }
   $scope.$watch('today',function(newValue,oldValue){
       if(newValue && newValue!==oldValue){
           prepareTodayCondition();

           $scope.getPBL();
       }
   })
   socket.on("pbl:new",function(p){
       pbl.get(id_app,p._id).then(function(res){
           $scope.pbls.push(res.data);
           $scope.pblSync();
       },function(res){
           console("error get pbl",res.data);
       })

   })
   socket.on("pbl:update",function(p){
       pbl.get(id_app,p._id).then(function(res){
           var _p= _.find($scope.pbls,function(_p){return _p._id===p._id});
           if(!_p)
                $scope.pbls.push(res.data);
           else
                _.extend(_p,res.data);

           $scope.pblSync();
       },function(res){
           console("error get pbl",res.data);
       })

   })
   socket.on("pbl:delete",function(p){
       $scope.pbls =_.reject($scope.pbls,function(_p){
           return _p._id===p._id;
       })
       $scope.pblSync();
   })
   $scope.selectBan = function(ban){
       prepareTodayCondition();
       $scope.selectedRow = ban;
   }


}])
dmbanModule.module.directive('dsban',[function(){
  return{
      templateUrl:'templates/lists/dmban/templates/dsban.html',
      controller:'dsbanController'
  }
}])
