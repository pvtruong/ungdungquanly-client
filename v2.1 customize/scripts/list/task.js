var taskModule = new baseInput('task', 'task', [
  "ten_cv", "mieu_ta", "location", "phu_trach"
], 'Công việc', {
  has_view: true,modal_size:'md',
  defaultValues: {
    start_date: moment().startOf("date").toDate(),
    due_date: moment().endOf("date").toDate()
  },
  defaultConditions: {
    progress: {
      $lte: 1
    }
  },
  onInput: function($scope, options) {

    $scope.calProgress = function() {
      var sels = _.filter($scope.data.todos, function(item) {
        return item.sel == true;
      });
      $scope.max = $scope.data.todos
        ? $scope.data.todos.length
        : 0;
      $scope.dynamic = sels.length;
    }
    $scope.calProgress();
    $scope.$watch("data.todos", function(n, o) {
      if (n && !_.isEqual(n, o)) {
        $scope.calProgress();
      }
    }, true);

    $scope.repeats = [
      {
        id: 0,
        name: 'Không lặp lại'
      }, {
        id: 1,
        name: 'Hàng ngày'
      }, {
        id: 2,
        name: 'Hàng tháng'
      }, {
        id: 3,
        name: 'Hàng quý'
      }, {
        id: 4,
        name: 'Hàng năm'
      }
    ]
    $scope.addTodo = function(event, newTodo) {
      if (event.keyCode == 13) {
        if (newTodo.title) {
          $scope.data.todos = STP.add($scope.data.todos, {
            sel: false,
            title: newTodo.title
          });
          newTodo.title = "";
        }
      }

    }
  },
  onAdd: function($scope, options) {
    $scope.data.phu_trach = options.$rootScope.user.email;
    $scope.data.attends = [$scope.data.phu_trach];

    $scope.data.repeat = 0;
    $scope.data.priority = 1;
    $scope.data.progress = 2;
    $scope.data.visible_to = 0;

  },

  onView: function($scope, options) {
    $scope.calProgress = function() {
      var sels = _.filter($scope.data.todos, function(item) {
        return item.sel == true;
      });
      $scope.max = $scope.data.todos
        ? $scope.data.todos.length
        : 0;
      $scope.dynamic = sels.length;
    }
    $scope.calProgress();
    $scope.$watch("data", function(n, o) {
      if (n && !_.isEqual(n, o)) {
        options.service.update(id_app, $scope.data._id, $scope.data).then(function(rs) {
          $scope.calProgress();
          if ($scope.onUpdated) {
            $scope.onUpdated(rs.data);
          }
        }, function(e) {
          if (e.data)
            options.$rootScope.alert(e.data)
        });
      }
    }, true);

    $scope.addTodo = function(event, newTodo) {
      if (event.keyCode == 13) {
        if (newTodo.title) {
          $scope.data.todos = STP.add($scope.data.todos, {
            sel: false,
            title: newTodo.title
          });
          newTodo.title = "";
        }
      }

    }

    $scope.data.attendInfos = []
    if ($scope.data.start_date) {
      $scope.data.start_date = new Date($scope.data.start_date);
    }
    if ($scope.data.due_date) {
      $scope.data.due_date = new Date($scope.data.due_date);
    }
    if ($scope.data.attends) {
      $scope.data.attends.forEach(function(attend) {
        var m = _.find(options.$rootScope.members, function(m) {
          return m.email == attend;
        })
        if (m)
          $scope.data.attendInfos.push(m)
      })
    }
    $scope.complete = function() {
      $scope.data.progress = 2;
      options.service.update(id_app, $scope.data._id, $scope.data).then(function(rs) {}, function(e) {
        if (e.data)
          options.$rootScope.alert(e.data)
      })
    }

    $scope.addContact = function() {
      lienheModule.quickadd(options.$uibModal, function(rs) {
        rs.collection_name = "lienhe";
        $scope.addLink(rs, 'ten_lien_he')
      })

    }
    $scope.addCustomer = function() {
      dmkhModule.quickadd(options.$uibModal, function(rs) {
        rs.collection_name = "dmkh";
        $scope.addLink(rs, 'ten_kh');
        if (!$scope.data.id_kh) {
          $scope.data.id_kh = rs._id;
          options.service.update(id_app, $scope.data._id, $scope.data).then(function(t) {
            _.extend($scope.data, t.data);
          })
        }
      })

    }
    $scope.addProject = function() {
      dmdtModule.quickadd(options.$uibModal, function(rs) {
        rs.collection_name = "dmdt";
        $scope.addLink(rs, 'ten_dt');
        if (!$scope.data.id_dt) {
          $scope.data.id_dt = rs._id;
          options.service.update(id_app, $scope.data._id, $scope.data).then(function(t) {
            _.extend($scope.data, t.data);
          })
        }
      })

    }

  },
  onLoading: function($scope, options) {
    $scope.today = new Date();
    $scope.advCondition = {}

    options.$rootScope.nextTick(function() {

      STPModules['group'].obj.getService(options.$http, options.$q, options.$rootScope).load(id_app, {
        filter: {
          group_type: 'TASK'
        }
      }).then(function(groups) {
        $scope.groups = groups.data;
        $scope.groups.push({group_name: 'Khác'});
        $scope.groups.forEach(function(r) {
          r.sel = true;
        })
      })
      //labels
      STPModules['label'].obj.getService(options.$http, options.$q, options.$rootScope).load(id_app, {
        filter: {
          label_type: 'TASK'
        }
      }).then(function(groups) {
        $scope.contactLabels = groups.data;
        $scope.contactLabels.push({label_name: null})
        $scope.contactLabels.forEach(function(r) {
          r.sel = true;
        })
      })
      //members
      $scope.members = [];
      _.extend($scope.members, options.$rootScope.members);
      $scope.members.push({name: "Khác"})
      $scope.members.forEach(function(m) {
        m.sel = true;
      })

    })

    $scope.progresses = [
      {
        value: 0,
        text: 'Chưa thực hiện',
        sel: true
      }, {
        value: 1,
        text: 'Đang thực hiện',
        sel: true
      }, {
        value: 2,
        text: 'Hoàn thành',
        sel: false
      }, {
        value: 3,
        text: 'Tạm dừng',
        sel: false
      }, {
        value: 4,
        text: 'Đang chờ',
        sel: false
      }
    ]
    $scope.priorities = [
      {
        value: 1,
        text: 'Ưu tiên cao',
        sel: true
      }, {
        value: 2,
        text: 'Ưu tiên trung bình',
        sel: true
      }, {
        value: 3,
        text: 'Ưu tiên thấp',
        sel: true
      }
    ]

    $scope.searchAVR = function() {
      if (!$scope.renderCompleted) {
        return;
      }
      if (!$scope.filter) {
        $scope.filter = {}
      }
      var ps = []
        var pi = []
          $scope.progresses.forEach(function(p) {
            if (p.sel)
              ps.push(p.value)
          })
          $scope.priorities.forEach(function(p) {
            if (p.sel)
              pi.push(p.value)
          })
          $scope.filter.progress = {
            $in: ps
          }
          $scope.filter.priority = {
            $in: pi
          }

          //labels
          delete $scope.filter.labels
          if ($scope.contactLabels && $scope.contactLabels.length > 0) {
            var labels_sel = $scope.contactLabels.filter(function(r) {
              return r.sel
            })
            if (labels_sel.length < $scope.contactLabels.length) {
              $scope.filter.labels = {
                $in: _.pluck(labels_sel, 'label_name')
              };
            }
          }
          //phu trach
          delete $scope.filter.phu_trach
          if ($scope.members && $scope.members.length > 0) {
            var members_sel = $scope.members.filter(function(r) {
              return r.sel
            })
            if (members_sel.length < $scope.members.length) {
              $scope.filter.phu_trach = {
                $in: _.pluck(members_sel, 'email')
              };
            }
          }
          //groups
          delete $scope.filter.nh_cv
          if ($scope.groups && $scope.groups.length > 0) {
            var groups_sel = $scope.groups.filter(function(r) {
              return r.sel
            })
            if (groups_sel.length < $scope.groups.length) {
              $scope.filter.nh_cv = {
                $in: _.pluck(groups_sel, '_id')
              };
            }
          }

          //time
          var tu_ngay,
            den_ngay;
          var curr = new Date();
          var m = $scope.time;
          if (m == 'd') {
            //xem ngay hien tai
            tu_ngay = moment(curr).startOf("date").toDate();
            den_ngay = moment(curr).endOf("date").toDate();

          }
          if (m == 'w') {

            var tu_ngay = moment(curr).startOf("week").toDate();
            var den_ngay = moment(curr).endOf("week").toDate();
          }
          if (m == 'm') {
            //xem thang hien tai
            tu_ngay = moment(curr).startOf("month").toDate();
            den_ngay = moment(curr).endOf("month").toDate();
          }
          if (m == '3m') {
            //xem quy hien tai
            tu_ngay = moment(curr).startOf("quarter").toDate();
            den_ngay = moment(curr).endOf("quarter").toDate();
          }
          if (m == 'y') {
            //xem nam hien tai
            tu_ngay = moment(curr).startOf("year").toDate();
            den_ngay = moment(curr).endOf("quarter").toDate();
          }

          if (tu_ngay && den_ngay) {
            $scope.filter.start_date = {
              $gte: tu_ngay,
              $lte: den_ngay
            };
          } else {
            delete $scope.filter.start_date
          }
          //
          if ($scope.advCondition.ten_cv) {
            $scope.filter.$or = [
              {
                ten_cv: {
                  $regex: $scope.advCondition.ten_cv,
                  $options: 'i'
                }
              }, {
                mieu_ta: {
                  $regex: $scope.advCondition.ten_cv,
                  $options: 'i'
                }
              }, {
                location: {
                  $regex: $scope.advCondition.ten_cv,
                  $options: 'i'
                }
              }, {
                phu_trach: {
                  $regex: $scope.advCondition.ten_cv,
                  $options: 'i'
                }
              }
            ];
          } else {
            delete $scope.filter.$or
          }
          if ($scope.advCondition.ten_kh) {
            $scope.filter.ten_kh = $scope.advCondition.ten_kh
          } else {
            delete $scope.filter.ten_kh
          }
          if ($scope.advCondition.ten_dt) {
            $scope.filter.ten_dt = $scope.advCondition.ten_dt
          } else {
            delete $scope.filter.ten_dt
          }
          if ($scope.advCondition.priority) {
            $scope.filter.priority = $scope.advCondition.priority
          }
          if ($scope.advCondition.progress) {
            $scope.filter.progress = $scope.advCondition.progress
          }
          if ($scope.advCondition.start_date) {
            $scope.filter.start_date = {
              $gte: $scope.advCondition.start_date
            };
          }
          if ($scope.advCondition.due_date) {
            $scope.filter.due_date = {
              $lte: $scope.advCondition.due_date
            };
          } else {
            delete $scope.filter.due_date
          }
          //
          $scope.search();
        }
        $scope.reportByTime = function(m) {
          $scope.time = m;
          $scope.searchAVR();
        }
        $scope.$watch("progresses", function(newValue) {
          $scope.filter_title = "Lọc dữ liệu"
          $scope.searchAVR()
        }, true)

        $scope.$watch("priorities", function(newValue) {
          $scope.filter_title = "Lọc dữ liệu"
          $scope.searchAVR()
        }, true)
        $scope.changeProgress = function(obj, progress) {
          var t = {}
          _.extend(t, obj);
          t.progress = progress;
          options.service.update(id_app, t._id, t).then(function(nt) {
            _.extend(obj, nt.data);
          }, function(e) {
            if (e.data)
              $rootScope.alert(e.data);
            }
          )
        }
        $scope.enter = function(event) {
          if (event.keyCode == 13) {
            $scope.searchAVR();
          }
        }

        //calendar
        options.$controller("initCalendar", {$scope: $scope})

      }
    });
    taskModule.module.controller("initCalendar", [
      "$scope",
      "$compile",
      "$timeout",
      "uiCalendarConfig",
      "$uibModal",
      "task",
      function($scope, $compile, $timeout, uiCalendarConfig, $uibModal, task) {

        var convertItem2Event = function(item) {
          var event = {
            title: item.ten_cv,
            draggable: true,
            resizable: true,
            item: item
          }
          var tu_ngay = item.start_date;

          var den_ngay = item.due_date;
          if (!den_ngay)
            den_ngay = item.start_date;

          event.start = new Date(tu_ngay);
          event.end = new Date(den_ngay);
          event.allDay = (event.start.getTime() == event.end.getTime())

          if (event.start.getTime() === event.end.getTime()) {
            event.end.setHours(event.end.getHours() + 1);
          }
          switch (item.priority) {
            case 1:
              event.type = 'important';
              break;
            case 2:
              event.type = 'warning';
              break;
            default:
              event.type = 'info'
          }
          if (item.progress !== 2) {
            event.className = 'chuahoanthanh'
          }
          return event;
        }
        /* event source that contains custom events on the scope */
        $scope.events = [];
        $scope.zevents = [];
        /* event source that calls a function on every view switch */
        $scope.eventsF = function(start, end, timezone, callback) {

          $scope.loadding = true;
          var condition = {
            start_date: {
              $gte: start.toDate(),
              $lte: end.toDate()
            }
          };

          if ($scope.contactLabels && $scope.contactLabels.length > 0) {
            var labels_sel = $scope.contactLabels.filter(function(r) {
              return r.sel
            })
            if (labels_sel.length < $scope.contactLabels.length) {
              condition.labels = {
                $in: _.pluck(labels_sel, 'label_name')
              };
            }
          }
          //phu trach
          if ($scope.members && $scope.members.length > 0) {
            var members_sel = $scope.members.filter(function(r) {
              return r.sel
            })
            if (members_sel.length && members_sel.length < $scope.members.length) {
              condition.phu_trach = {
                $in: _.pluck(members_sel, 'email')
              };
            }
          }
          //groups
          if ($scope.groups && $scope.groups.length > 0) {
            var groups_sel = $scope.groups.filter(function(r) {
              return r.sel
            })
            if (groups_sel.length < $scope.groups.length) {
              condition.nh_cv = {
                $in: _.pluck(groups_sel, '_id')
              };
            }
          }
          //console.log("refresh task", condition);
          var request = task.load2(id_app, {condition: condition})
          request.promise.then(function(res) {
            var events = [];
            $scope.loadding = false;
            var list = res.data;
            list.forEach(function(item) {
              events.push(convertItem2Event(item));
            });
            callback(events);
          }, function(res) {
            $scope.loadding = false;
            callback([]);
            var e = res.data;
            if (e) {
              $rootScope.alert(e.message);
            } else
              $rootScope.alert("Không kết nối được với máy chủ");
            }
          );

        };
        /* alert on eventClick */
        $scope.eventClick = function(event, jsEvent, view) {
          $scope.view(event.item._id);
        };
        /* alert on Drop */
        $scope.alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view) {
          $scope.alertMessage = ('Event Dropped to make dayDelta ' + delta);
        };
        /* alert on Resize */
        $scope.alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view) {
          $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
        };
        /* add and removes an event source of choice */
        $scope.addRemoveEventSource = function(sources, source) {
          var canAdd = 0;
          angular.forEach(sources, function(value, key) {
            if (sources[key] === source) {
              sources.splice(key, 1);
              canAdd = 1;
            }
          });
          if (canAdd === 0) {
            sources.push(source);
          }
        };
        /* remove event */
        $scope.remove = function(index) {
          $scope.events.splice(index, 1);
        };
        /* Change View */
        $scope.changeView = function(view, calendar) {
          uiCalendarConfig.calendars[calendar].fullCalendar('changeView', view);
        };
        /* Change View */
        $scope.renderCalendar = function(calendar) {
          $timeout(function() {
            if (uiCalendarConfig.calendars[calendar]) {
              uiCalendarConfig.calendars[calendar].fullCalendar('render');
            }
          });
        };
        /* Render Tooltip */
        $scope.eventRender = function(event, element, view) {
          //element.attr({'tooltip': "<b>" + event.item.ten_cv + "</b><br/>" + event.item.phu_trach,'tooltip-append-to-body': true});
          if (!(window.DocumentTouch && document instanceof window.DocumentTouch)) {
            element.qtip({
              content: "<b>" + event.item.ten_cv + "</b><br/>" + event.item.ten_kh + "<br/>by " + event.item.phu_trach,
              position: {
                target: 'mouse', // Position it where the click was...
                // adjust: { mouse: false }  ...but don't follow the mouse
                adjust: {
                  x: 10
                }
              }
            });
          }

          $compile(element)($scope);
        };
        var defaultDate = new Date();
        $scope.dayClick = function(date, jsEvent, view) {
          var start_date = date.startOf("date").toDate();
          var due_date = date.endOf("date").toDate();
          taskModule.quickadd($uibModal, function(item) {
            var e = convertItem2Event(item);
            defaultDate = e.start;
            $scope.uiConfig.calendar.defaultDate = defaultDate;
            $scope.zevents.push(e)
          }, {
            start_date: start_date,
            due_date: due_date
          })
        }
        /* config object */
        $scope.uiConfig = {
          calendar: {
            height: "auto",
            editable: true,
            locale: 'vi',
            header: {
              left: 'month agendaWeek agendaDay listMonth',
              center: 'title',
              right: 'prev,next'
            },
            defaultDate: defaultDate,
            ignoreTimezone: true,

            navLinks: true,
            eventLimit: true,
            selectable: true,
            selectHelper: true,

            eventClick: $scope.eventClick,
            eventDrop: $scope.alertOnDrop,
            eventResize: $scope.alertOnResize,
            eventRender: $scope.eventRender,
            dayClick: $scope.dayClick
          }
        };
        /* event sources array */
        //$scope.eventSources = [$scope.events, $scope.eventSource, $scope.eventsF];
        $scope.eventSources = [$scope.eventsF];

        $scope.refresh = function() {
          defaultDate = uiCalendarConfig.calendars['myCalendar'].fullCalendar('getDate');
          $scope.uiConfig.calendar.defaultDate = defaultDate;
          $scope.zevents.push({})

        }
        //customize header: add event click for choosing year and month
        $scope.refresh();
      }
    ]);

    taskModule.module.directive("task", function() {
      return {
        restrict: 'E',
        scope: {
          link: '=',
          collection: '@',
          defaultValues: '@'
        },
        templateUrl: "templates/lists/task/templates/directive.html",
        controller: [
          '$scope',
          '$shttp',
          '$window',
          '$location',
          '$uibModal',
          'appInfo',
          '$rootScope',
          'task',
          function($scope, $http, $window, $location, $uibModal, appInfo, $rootScope, task) {
            initLabel($rootScope, $scope, appInfo, 'TASK', $http);
            appInfo.info("task", function(e, u, a) {
              if (e)
                return;
              $scope.server_url = server_url;
              $scope.textSearch = "";
              $scope.location = $location.url();
              $scope.collectionsLink = "task:'ten_cv'";
              var collectionsLink = eval("({" + $scope.collectionsLink + "})")
              var collections = _.keys(collectionsLink)
              $scope.load = function() {
                var url = server_url + "/api/" + id_app + "/linkslist?_id=" + $scope.link._id + "&collections=" + collections.join();
                $http.get(url, {cache: true}).then(function(rs) {
                  $scope.list = rs.data;
                }, function(e) {
                  if (e.data && _online)
                    $rootScope.alert(e.data);
                  }
                );
              }
              $scope.getHeaderCollection = function(r) {
                var module_name = r.collection_obj + "Module";
                var module = eval("(" + module_name + ")")
                return module.title;
              }
              $scope.search = function(value) {
                var url = server_url + "/api/" + id_app + "/search?collections=" + $scope.collectionsLink + "&value=" + value;
                return $http.get(url).then(function(res) {
                  var items = res.data;
                  return items;
                });
              }
              $scope.addLink = function(obj) {
                $scope.textSearch = "";
                if (!$scope.list)
                  $scope.list = [];
                var check = _.find($scope.list, function(item) {
                  return item.obj._id == obj._id;
                })
                if (check) {
                  return;
                }
                var obj_link = {}
                obj_link.id_a = $scope.link._id;
                obj_link.collection_a = $scope.collection;

                obj_link.collection_b = obj.collection_name;
                obj_link.collection_obj = obj.collection_name;
                obj_link.id_b = obj._id;

                var url = server_url + "/api/" + id_app + "/link";
                $http.post(url, obj_link).then(function(rs) {
                  _.extend(obj_link, rs.data);
                  obj_link.obj = obj;
                  obj_link.title = obj.title;
                  $scope.list.push(obj_link);
                }, function(e) {
                  //$rootScope.alert(e);
                })

              }
              $scope.unLink = function(obj) {
                var url = server_url + "/api/" + id_app + "/link/" + obj._id;
                $http.delete(url).then(function(rs) {
                  $scope.list = _.reject($scope.list, function(item) {
                    return item._id == obj._id;
                  })
                }, function(e) {
                  //$rootScope.alert(e);
                })

              }
              $scope.getItem = function($item, $model, $label) {
                $scope.addLink($item, $label);

              }
              $scope.add = function() {
                var defaultValues = {}
                if ($scope.defaultValues) {
                  defaultValues = eval("({" + $scope.defaultValues + "})");
                }
                taskModule.quickadd($uibModal, function(rs) {
                  rs.collection_name = "task";
                  $scope.addLink(rs)
                }, defaultValues)
              }
              $scope.view = function(item) {
                var url = "task/view/" + item._id + "?redirect=" + $location.url();
                $location.url(url);
              }
              $scope.delete = function(item) {
                $rootScope.confirm("Bạn có chắc chắn xóa không?").then(function(ind) {
                  if (ind === 1) {
                    task.delete(id_app, item._id).then(function(rs) {
                      $scope.list = _.reject($scope.list, function(r) {
                        return (r._id == item._id);
                      });
                    }, function(e) {
                      if (e.data)
                        $rootScope.alert(e.data);
                      }
                    )
                  }
                });
              }
              $scope.edit = function(item) {
                taskModule.quickedit($uibModal, item._id, function(rs) {
                  _.extend(item, rs);
                });
              }
              $scope.$watch('link', function(newValue) {
                if (newValue) {
                  $scope.load()
                }
              }, true)
            })

          }
        ],
        link: function($scope, elem, attrs, contr) {
          if (!attrs.link || !attrs.collection) {
            console.error("task directive require attributes:link,collection")
          }

        }
      }
    })
    taskModule.module.directive("dbTask", function() {
      return {
        restrict: 'E',
        scope: {
          config: '=?'
        },
        templateUrl: "templates/lists/task/templates/db.html",
        controller: [
          '$scope',
          'task',
          '$rootScope',
          '$location',
          'appInfo',
          'socket',
          'nodeWebkit',
          '$shttp',
          '$uibModal',
          function($scope, task, $rootScope, $location, appInfo, socket, nodeWebkit, $http, $uibModal) {
            initLabel($rootScope, $scope, appInfo, 'TASK', $http);
            appInfo.info("task", function(e, u, app_info) {
              if (e)
                return;
              $scope.token = $rootScope.token;
              $scope.server_url = server_url;
              $scope.now = new Date();

              $scope.getCondition = function() {
                $scope.condition = {
                  status: true
                };
                if ($scope.config && $scope.config.group) {
                  $scope.condition.nh_cv = $scope.group;
                }
                if ($scope.config && $scope.config.my_job) {
                  $scope.condition.phu_trach = $rootScope.user.email;
                }
                if ($scope.config && $scope.config.attends) {
                  delete $scope.condition.phu_trach;
                  $scope.condition.$or = [
                    {
                      phu_trach: $rootScope.user.email
                    }, {
                      attends: $rootScope.user.email
                    }
                  ];
                }

                if ($scope.config && $scope.config.progresses) {
                  var _p = _.filter($scope.config.progresses, function(p) {
                    return p.sel;
                  })
                  $scope.condition.progress = {
                    $in: _.pluck(_p, "code")
                  };

                }

              }
              $scope.app_info = $rootScope.app_info;
              $scope.filter = function(c) {
                async.nextTick(function() {
                  $scope.$emit("$dataChangeStart")
                  $scope.getCondition();
                  if (c) {
                    _.extend($scope.condition, c);
                  }

                  task.load(id_app, {
                    condition: $scope.condition,
                    limit: 10,
                    cacheName: "tempData"
                  }).then(function(tasks) {
                    $scope.dscv = tasks.data;
                    $scope.dscv.forEach(function(t) {
                      t.todo_done = $scope.getSels(t);
                    })
                    $scope.$emit("$dataChangeSuccess")
                  }, function(e) {
                    $scope.$emit("$dataChangeError")
                  })
                })

              }
              $scope.searchTask = function($event) {
                if ($event.keyCode === 13) {
                  var c = {
                    ten_cv: {
                      $regex: $scope.task_msg,
                      $options: 'i'
                    },
                    progress: {
                      $in: [0, 1, 2, 3, 4]
                    }
                  };
                  $scope.filter(c);
                }

              }
              $scope.complete = function(t) {
                task.update(id_app, t._id, {progress: 2}).then(function(rs) {
                  _.extend(t, rs.data);
                }, function(e) {
                  if (e.data)
                    $rootScope.alert(e.data);
                  }
                )
              }
              $scope.cancel = function(t) {
                task.update(id_app, t._id, {status: false}).then(function(rs) {
                  if ($scope.dscv) {
                    $scope.dscv = _.reject($scope.dscv, function(ts) {
                      return ts._id == t._id;
                    })
                  }
                }, function(e) {
                  if (e.data)
                    $rootScope.alert(e.data);
                  }
                )
              }
              $scope.viewTask = function(t) {
                //$location.url("task/view/" + t._id)
                taskModule.quickdetailview($uibModal, t, function(task_updated) {
                  //updated
                  console.log('updated task');
                  if (task_updated)
                    _.extend(t, task_updated);
                  t.todo_done = $scope.getSels(t);
                }, function(task_deleted) {
                  console.log('deleted task');
                  $scope.dscv = _.filter($scope.dscv, function(d) {
                    return d._id !== task_deleted._id;
                  })
                  //deleted
                })
              }
              $scope.addTask = function(ten_cv) {
                taskModule.quickadd($uibModal, function(newTask) {
                  $scope.dscv.push(newTask);
                }, {
                  ten_cv: ten_cv,
                  nh_cv: $scope.group
                })
              }
              $scope.getSels = function(data) {
                var sels = _.filter(data.todos, function(item) {
                  return item.sel == true;
                });
                return sels.length;
              }

              $scope.$watch('options', function(newValue) {
                if (newValue && $scope.app_info) {
                  $scope.filter();
                }
              }, true)
              socket.on("task:new", function(t) {
                var _id = t._id;
                if (!$scope.dscv)
                  $scope.dscv = []
                task.get(id_app, _id).then(function(res) {
                  t = res.data;
                  var c = _.find($scope.dscv, function(c) {
                    return c._id == _id;
                  })
                  if (!c) {
                    t.is_new = true;
                    if (!notificationShowed[t._id + ':new']) {
                      notificationShowed[t._id + ':new'] = t;
                      nodeWebkit.notification("Bạn có công việc mới", "", {
                        url: "/task/view/" + _id
                      })
                    }
                    $scope.dscv.push(t);
                  }
                })
              })
              socket.on("task:update", function(t) {
                var _id = t._id;
                if (!$scope.dscv)
                  $scope.dscv = []
                task.get(id_app, _id).then(function(res) {
                  t = res.data;
                  var c = _.find($scope.dscv, function(c) {
                    return c._id == _id;
                  })
                  if (c) {
                    _.extend(c, t);
                  } else {
                    $scope.dscv.push(t);
                  }
                  if (!notificationShowed[t._id + ':update']) {
                    notificationShowed[t._id + ':update'] = t;
                    nodeWebkit.notification("Công việc " + t.ten_cv + " đã được cập nhật", "", {
                      url: "/task/view/" + _id
                    })
                  }

                })
              })
              $scope.filter();
            })

          }
        ],
        link: function($scope, elem, attrs, controller) {}
      }
    });

    taskModule.module.directive("taskDashboard",function(){
    	return {
    		restrict:'E',
    		scope:{
    			group:"@?",
    			run:"=?"
    		},
    		templateUrl:"templates/lists/task/templates/task-dashboard.html",
    		controller:['$scope','task','$rootScope','$uibModal','appInfo','socket','nodeWebkit','$shttp','group','$q'
    				,function($scope,task,$rootScope,$uibModal,appInfo,socket,nodeWebkit,$http,group,$q){
    				initLabel($rootScope,$scope,appInfo,'TASK',$http);
    				$scope.deleted = [];
            $scope.saveTask = function(t){
              if(!t) return;
              task.update(id_app,t._id,{saved:true}).then(function(res){
                $scope.dscv = _.filter($scope.dscv,function(d){
                  return d._id!==t._id;
                });

                $scope.progresses.forEach(function(p){
                  p.list = _.filter($scope.dscv,function(d){
                    return d.progress == p.value;
                  })
                })

                $rootScope.toast("Công việc '" + t.ten_cv  + "' đã được lưu trữ","","warning")
              },function(error){
                 $rootScope.alert(error.data||"Không thể kết nối với máy chủ");
              })
            }
    				$scope.dropToDelete =  function(action, index, external, type) {
              $scope.saveTask($scope.deleted[index]);
    		    }
            $scope.viewTaskSaved = function(){
              var group = $scope.group;
              var modalInstance = $uibModal.open({
                templateUrl: "templates/lists/task/templates/task-saved.html",
                controller: [
                  '$scope',
                  '$rootScope',
                  '$controller',
                  '$http',
                  '$uibModalInstance',
                  'appInfo','parentScope',
                  function($scope, $rootScope, $controller, $http, $uibModalInstance, appInfo,parentScope) {
                    initLabel($rootScope, $scope, appInfo, "SYS", $http);
                    var condition ={saved:true};
                    if(group){
                      condition.nh_cv = group
                    }

                    task.load(id_app,{condition:condition}).then(function(res){
        							$scope.tasks = res.data;
        						},function(error){
        							 console.log("error",error.data);
        						})
                    $scope.cellClick = function(row,column){
                      if(column && column.field==="remove"){
                        task.update(id_app,row._id,{saved:false}).then(function(res){
                          row.saved = false;
                          parentScope.dscv.push(row);
                          parentScope.progresses.forEach(function(p){
                            p.list = _.filter(parentScope.dscv,function(d){
                              return d.progress == p.value;
                            })
                          })
                          $scope.tasks = _.filter($scope.tasks,function(t){
                            return t._id !== row._id;
                          })
                          $rootScope.toast("Công việc '" + row.ten_cv  + "' đã bỏ lưu trữ")
                        },function(error){
                           $rootScope.alert(error.data||"Không thể kết nối với máy chủ");
                        })
                      }else{
                        parentScope.viewTask(row);
                      }
                    }

                    $scope.close = function(){
                      $uibModalInstance.close();
                    }

                  }
                ],
                size: "md",
                resolve: {
                  parentScope: function() {
                    return $scope;
                  }

                }
              });
            }

    				//
    				if($scope.group){
    					group.get(id_app,$scope.group).then(function(res){
    						$scope.currentGroup = res.data;
    					})
    				}
    				//labels
    	      STPModules['label'].obj.getService($http,$q,$rootScope).load(id_app,{filter:{label_type:'TASK'}})
    	      .then(function(groups){
    	          $scope.contactLabels = groups.data;
    	          $scope.contactLabels.push({label_name:null})
    	          $scope.contactLabels.forEach(function(r){
    	              r.sel = true;
    	          })
    	      })
    				$scope.progresses = [
    					{value:0,text:'Chưa thực hiện',sel:true,list:[],defaultValues:{progress:0,ten_cv:''}}
    					,{value:1,text:'Đang thực hiện',sel:true,list:[],defaultValues:{progress:1,ten_cv:''}}
    					,{value:2,text:'Hoàn thành',sel:false,list:[],defaultValues:{progress:2,ten_cv:''}}
    					,{value:3,text:'Tạm dừng',sel:false,list:[],defaultValues:{progress:3,ten_cv:''}}
    					,{value:4,text:'Đang chờ',sel:false,list:[],defaultValues:{progress:4,ten_cv:''}}
    				]

    				$scope.done = function(ts){
    					 if(!ts) return 0;
    					 return _.filter(ts,function(t){
    						 return t.sel;
    					 }).length;
    				}

    				$scope.token = $rootScope.token;
    				$scope.server_url = server_url;

    				$scope.app_info = $rootScope.app_info;
    				$scope.searchKeyup = function($event,condition){
    					if($event.keyCode==13){
    						if(!condition){
    							$scope.filter({});
    						}else{
    							$scope.filter({ten_cv:{$regex:condition,$options:'i'}});
    						}
    					}
    				}
    				$scope.filter = function(c){
    					async.nextTick(function(){
    						$scope.$emit("$dataChangeStart")
    						if(!c) c ={};
    						//group
    						if($scope.group) c.nh_cv = $scope.group;
    						c.saved = null;
    						//label
    						if( $scope.contactLabels && $scope.contactLabels.length>0){
    		            var labels_sel =  $scope.contactLabels.filter(function(r){return r.sel})
    		            if(labels_sel.length<$scope.contactLabels.length){
    		                c.labels={$in:_.pluck(labels_sel,'label_name')};
    		            }
    		        }
    		        //phu trach
    		        if( $scope.members && $scope.members.length>0){
    		            var members_sel =  $scope.members.filter(function(r){return r.sel})
    		            if(members_sel.length<$scope.members.length){
    		                c.phu_trach={$in:_.pluck(members_sel,'email')};
    		            }
    		        }

    						//load
    						task.load(id_app,{condition:c,limit:50}).then(function(tasks){
    							$scope.dscv = tasks.data;
    							//update list
    							$scope.progresses.forEach(function(p){
    								p.list = _.filter($scope.dscv,function(d){
    									return d.progress == p.value;
    								})
    							})
    							$scope.$emit("$dataChangeSuccess")
    						},function(e){
    							$scope.$emit("$dataChangeError")
    						})
    					})
    				}

    				$scope.models = {selected:null};
    				$scope.itemMoved = function(list_source,index){
              if(list_source) list_source.splice(index, 1);
    					//update list
    					$scope.progresses.forEach(function(p){
    						var stt =0;
    						p.list.forEach(function(item){
    							item.progress = p.value;
    							if(!item.exfields) item.exfields ={};
    							item.stt = stt;
    							stt+=1;
    							//update item that was moved
    							if(item._id === $scope.models.selected._id){
    								//update selected item to database
    								if(!_.find(item.attends,function(a){ return a==$rootScope.user.email})){
    									item.attends.push($rootScope.user.email);
    								}
    								task.update(id_app,item._id,{progress:p.value,attends:item.attends,stt:item.stt}).then(function(rs){
    								},function(e){
    									if(e.data) $rootScope.alert(e.data);
    								})

    							}else{
    								task.update(id_app,item._id,{stt:item.stt}).then(function(rs){
    								},function(e){
    									if(e.data) $rootScope.alert(e.data);
    								})
    							}
    							//update mother list
    							var newD = _.find($scope.dscv,function(d){return d._id==item._id});
    							if(newD){
    								_.extend(newD,item);
    							}

    						})
    					})

    				}
    				$scope.viewTask=function(t){

    					STPModules["task"].obj.quickdetailview($uibModal,t,function(){
    						//update item
    						task.get(id_app,t._id).then(function(res){
    							//update mother list
    							var newD = _.find($scope.dscv,function(d){
    								return d._id == t._id;
    							})

    							if(newD){
    								_.extend(newD,res.data);
    							}
    							//update group list
    							$scope.progresses.forEach(function(p){
    								p.list = _.filter($scope.dscv,function(d){
    									return d.progress == p.value;
    								})
    							})
    						});
    					},function(){
    						//delete item
    						$scope.dscv = _.filter($scope.dscv,function(d){
    							return d._id !== t._id;
    						})
    						//update group list
    						$scope.progresses.forEach(function(p){
    							p.list = _.filter($scope.dscv,function(d){
    								return d.progress == p.value;
    							})
    						})
    					})
    				}
    				socket.on("task:new",function(t){
              var _id = t._id;
    					if(!$scope.dscv) $scope.dscv=[]
    					task.get(id_app,_id).then(function(res){
                t = res.data;
    						var c = _.find($scope.dscv,function(c){
    							return c._id==_id;
    						})
    						if(!c){
    							t.is_new = true;
                  if(!notificationShowed[t._id +':new']){
                      notificationShowed[t._id +':new'] = t;
                      nodeWebkit.notification("Bạn có công việc mới","",{url:"/task/view/" +_id})
                  }
    							if($scope.group && t.nh_cv ==$scope.group) $scope.dscv.push(t);
    						}
    						//update group list
    						$scope.progresses.forEach(function(p){
    							p.list = _.filter($scope.dscv,function(d){
    								return d.progress == p.value;
    							})
    						})
    					})
    				})
            socket.on("task:update",function(t){
              var _id = t._id;
    					if(!$scope.dscv) $scope.dscv=[]
    					task.get(id_app,_id).then(function(res){
                t = res.data;
    						var c = _.find($scope.dscv,function(c){
    							return c._id==_id;
    						})
    						if(c){
    							_.extend(c,t);
    						}else{
    							if($scope.group && t.nh_cv ==$scope.group) $scope.dscv.push(t);

                }
                if(!notificationShowed[t._id +':update']){
                    notificationShowed[t._id +':update'] = t;
                    nodeWebkit.notification("Công việc " + t.ten_cv + " đã được cập nhật","",{url:"/task/view/" +_id})
                }
    						//update group list
    						$scope.progresses.forEach(function(p){
    							p.list = _.filter($scope.dscv,function(d){
    								return d.progress == p.value;
    							})
    						})

    					})

    				})
    		    $scope.addToDoItem = function (event, defaultValues,clickPlus) {

    		      if (clickPlus || event.keyCode === 13) {

    						var todo ={};

    						if(defaultValues){
    							todo =_.extend(todo,defaultValues);
    						}
    						if(todo.ten_cv=="") return;

    						todo.start_date = moment().startOf("date").toDate();
    						todo.due_date = todo.start_date;
    						todo.repeat = 0;

    						if($scope.group){
                  todo.nh_cv = $scope.group;
                  if($scope.currentGroup){
                    todo.visible_to = $scope.currentGroup.visible_to||0;
                    todo.visible_to_users = $scope.currentGroup.visible_to_users;
                  }
                }
    						todo.phu_trach = $rootScope.user.email;

    						task.create(id_app,todo).then(function(res){
    							$rootScope.toast("","Công việc '" + todo.ten_cv + "' đã được tạo thành công","","success");
    							var t = res.data;
    							$scope.dscv.push(t);
    							defaultValues.ten_cv = '';
    							//update list
    							$scope.progresses.forEach(function(p){
    								if(p.value===t.progress){
    									p.list.push(t);
    								}
    							})

    						},function(error){
    							alert(error.data);
    						});


    		      }
    				}

    				if($scope.run!==false){
    					//member
    					$scope.members =[];
    					_.extend($scope.members,$rootScope.members);
    					$scope.members.push({name:"Khác"})
    					$scope.members.forEach(function(m){
    							m.sel =true;
    					})
    					//
    					$scope.filter({});
    				}
    				$scope.$watch("run",function(n){
    					if(n){
    						//member
    						$scope.members =[];
    			      _.extend($scope.members,$rootScope.members);
    			      $scope.members.push({name:"Khác"})
    			      $scope.members.forEach(function(m){
    			          m.sel =true;
    			      })
    						//
    						$scope.filter({});
    					}
    				})
    		}],
    		link:function($scope,elem,attrs,controller){

    		}
    	}
    });

    taskModule.module.component("taskGroup",{
      bindings:{
      },
      templateUrl:"templates/lists/task/templates/task-group.html",
      controller:['group','$rootScope','$uibModal','appInfo',function(group,$rootScope,$uibModal,appInfo){
        var ctrl = this;
        ctrl.openUrl = $rootScope.openUrl;
        ctrl.add = function(){
          dmnhtaskModule.quickadd($uibModal,function(n){
            if(!ctrl.list) ctrl.list =[];
            ctrl.list.push(n);
          },{group_type:"TASK"});
        }
        appInfo.info("task",function(error,userinfo,appinfo){
          if(error) return;
          group.load(id_app,{condition:{group_type:'TASK'}}).then(function(res){
            ctrl.list = res.data;
          })
        })
      }]
    })
    taskModule.module.directive('taskCount',function(){
    	return{
    		restrict:'A',
    		scope:{
    			group:'@'
    		},
    		link:function($scope,elem,attrs,controller){
    			$scope.$watch('group',function(newValue){
    				if(newValue){
    					$scope.load(function(count){
    						elem.text(count);
    					});
    				}
    			},true)

    			$scope.$on("$task:add",function(){
    				$scope.load(function(count){
    					elem.text(count);
    				});
    			});
    		},
    		controller:['$scope','task',function($scope,task){
    				$scope.load =function(fn){
    						task.load(id_app,{filter:{nh_cv:$scope.group,saved:null},count:1}).then(function(tasks){
    							fn(tasks.data.rows_number);
    						},function(e){
    							fn(0);
    						})
    				}
    		}]
    	}
    })

    taskModule.module.config([
      '$routeProvider',
      '$locationProvider',
      function($routeProvider, $locationProvider) {
        $routeProvider.when("/task/dashboard/:group_id", {
          template:"<task-dashboard group='{{group}}' run ='run'></task-dashboard>",
          controller: ['appInfo','$scope','$rootScope','$routeParams',function(appInfo,$scope,$rootScope,$routeParams){
            $scope.group =   $routeParams.group_id;
            $scope.run = false;

            $rootScope.function_title = "Công việc";
            $rootScope.function_code = "TASK";

            appInfo.info("task",function(error,userinfo,appinfo){
              if(error) return;
              //$rootScope.members = appinfo.participants;
              $scope.run = true;
            })
          }]
        });
      }
    ])

    taskModule.module.config([
      '$routeProvider',
      '$locationProvider',
      function($routeProvider, $locationProvider) {
        $routeProvider.when("/task/groups", {
          template:"<div class='page-frame'><task-group></task-group></div>",
          controller: ['appInfo','$scope','$rootScope','$routeParams',function(appInfo,$scope,$rootScope,$routeParams){
            $rootScope.function_title = "Nhóm công việc";
            $rootScope.function_code = "TASKGROUP";
          }]
        });
      }
    ])
