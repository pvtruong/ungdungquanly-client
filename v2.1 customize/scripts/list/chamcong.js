var chamcongModule = new baseInput('chamcong','chamcong',["ma_nv","ma_loai_cong"],'Chấm công',{
    onLoading:function($scope,options){
        options.$controller("initChamcong",{$scope:$scope})
    }
});

chamcongModule.module.controller("initChamcong",["$scope","$localStorage","$compile", "$timeout", "uiCalendarConfig","$uibModal","chamcong","$rootScope"
,function($scope,$localStorage, $compile, $timeout, uiCalendarConfig,$uibModal,chamcong,$rootScope){
   

    var convertChamCong2Event = function(item){
        var event = {
                title: item.ten_loai_cong?item.ten_loai_cong:item.exfields.ten_loai_cong,
                draggable: true,
                resizable: true,
                item:item
              }
        var tu_ngay = item.ngay;

        var den_ngay = item.ngay;
   

        event.start = new Date(tu_ngay);
        event.end = new Date(den_ngay);
        event.allDay = (event.start.getTime()==event.end.getTime())

        if(event.start.getTime()===event.end.getTime()){
            event.end.setHours(event.end.getHours()+1);
        }
        
        event.className= item.color?"bg-" + item.color:"";
        
        return event;
    }
    /* event source that contains custom events on the scope */
    $scope.events = [
    ];
     $scope.zevents = [
    ];
    /* event source that calls a function on every view switch */
    $scope.eventsF = function (start, end, timezone, callback) {
        
        $scope.loadding = true;
        var condition = {ngay:{$gte:start,$lte:end}};
        
        if( $scope.ma_nv){
            condition.ma_nv =  $scope.ma_nv;
        }else{
            return;
        }
        
 
        var request = chamcong.load2(id_app,{condition:condition})
        
        request.promise.then(function(res){
            var events =[];
            $scope.loadding = false;
            var list = res.data;
            
            list.forEach(function(item){
                events.push(convertChamCong2Event(item));
            });
          
            callback(events);
        },function(res){
            $scope.loadding = false;
            callback([]);
            var e = res.data;
            if(e){
                $rootScope.alert(e.message);
            }
            else
                $rootScope.alert("Không kết nối được với máy chủ");
        });
      
    };
    /* alert on eventClick */
    $scope.eventClick = function(event, jsEvent, view){
       chamcongModule.quickedit($uibModal,event.item._id,function(item,action){
            $scope.zevents.push({});
            if(item.exfields && item.exfields.is_default_cong){
                 $localStorage.set( 'default_cong' + id_app,item.ma_loai_cong);
            }
        },function(item){
            console.log("deleted",item);
            $scope.zevents.push({});
       })
    };
    
    /* Change View */
    $scope.renderCalendar = function(calendar) {
      $timeout(function() {
        if(uiCalendarConfig.calendars[calendar]){
          uiCalendarConfig.calendars[calendar].fullCalendar('render');
        }
      });
    };
     /* Render Tooltip */
    $scope.eventRender = function( event, element, view ) {
        //element.attr({'tooltip': "<b>" + event.item.ten_cv + "</b><br/>" + event.item.phu_trach,'tooltip-append-to-body': true});
        /*if(!(window.DocumentTouch && document instanceof window.DocumentTouch)){
            element.qtip({
                content: "<b>" + event.item.extfields.ten_loai_cong + "</b>",
                position: {
                    target: 'mouse', // Position it where the click was...
                   // adjust: { mouse: false } // ...but don't follow the mouse
                    adjust: {
                        x: 10
                    }
                },
            });
        }*/
        $compile(element)($scope);
    };
    var defaultDate=new Date();
    $scope.dayClick = function(date, jsEvent, view){
        if(!$scope.ma_nv){
            return $rootScope.alert("Chọn một nhân viên trước khi chấm công");
        }
        var _d = date.toISOString();
        if(_d.length===10){
            _d = _d +  'T08:00:00+07:00'
        }else{
             _d = _d + '+07:00'
        }
        
         var start_date = new Date(_d);
         $scope.default_cong = $localStorage.get( 'default_cong' + id_app);
         if($scope.default_cong){
             //quick create
             var data = {ngay:start_date,ma_nv:$scope.ma_nv,ma_loai_cong:$scope.default_cong}
             chamcong.create(id_app,data).then(function(res){
                 var e = convertChamCong2Event(res.data);
                    defaultDate = e.date;
                    $scope.uiConfig.calendar.defaultDate = defaultDate;
                    $scope.zevents.push(e)
             },function(error){
                 if(error.data)
                     $rootScope.alert(error.data)
                 else 
                     $rootScope.alert("Không thể kết nối được với máy chủ");
             });
         }else{
             chamcongModule.quickadd($uibModal,function(item){
                var e = convertChamCong2Event(item);
                defaultDate = e.date;
                $scope.uiConfig.calendar.defaultDate = defaultDate;
                $scope.zevents.push(e)
                if(item.exfields && item.exfields.is_default_cong){
                     $localStorage.set( 'default_cong' + id_app,item.ma_loai_cong);
                 }
             },{ngay:start_date,ma_nv:$scope.ma_nv})
         }
         
    }
    /* config object */
    $scope.uiConfig = {
      calendar:{
        height: "auto",
        editable: true,
        locale:'vi',
        header:{
          //left: 'month',
          //center: 'title',
          right: 'prev,next'
        },
        defaultDate:defaultDate,
        ignoreTimezone: true,
        eventClick: $scope.eventClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize,
        eventRender: $scope.eventRender,
        dayClick:$scope.dayClick
      }
    };
    /* event sources array*/
    //$scope.eventSources = [$scope.events, $scope.eventSource, $scope.eventsF];
    $scope.eventSources =  [$scope.eventsF];
    $scope.chonNhanVien = function(item){
        $scope.ma_nv = item.ma_nv;
        $scope.zevents.push({});
    }
    //customize header: add event click for choosing year and month
}]);