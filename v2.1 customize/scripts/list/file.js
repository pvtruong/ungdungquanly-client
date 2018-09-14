var fileModule = new baseInput('file', 'file', [
  "mieu_ta", "ten_file_goc"
], 'Quản lý tệp dữ liệu', {
  onLoading: function($scope, options) {
    addFile = function() {
      var w = options.$window.open("#file/addfile", "Add File", "directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=500,height=300");
      var time = 0;
      stop = options.$interval(function() {
        if (w.document.title == "OK") {
          options.$interval.cancel(stop);
          stop = undefined;
          var content = JSON.parse(w.document.body.innerText);
          $scope.list.push(content);
          w.close();
          return;
        }
        if (w.document.title == "ERROR") {
          options.$interval.cancel(stop);
          stop = undefined;
          options.$rootScope.alert(w.document.body.innerText);
          w.close();
          return;
        }
        time = time + 500;
        if (time > 5 * 60 * 1000 && stop) {
          options.$interval.cancel(stop);
          stop = undefined;
        }

      }, 500);
    }
  }
});
fileModule.module.controller("addFileController", [
  "$scope",
  "$localStorage",
  "user",
  "$rootScope",
  "$location",
  "app",
  function($scope, $localStorage, user, $rootScope, $location, app) {
    $rootScope.hide_nav = true;
    $scope.data = {};
    _.extend($scope.data, $location.search())
    $scope.action = server_url + "/api/" + $localStorage.get('id_app') + "/file?access_token=" + $localStorage.get('token');

  }
]);
fileModule.module.config([
  '$routeProvider',
  '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider.when("/file/addfile", {
      templateUrl: "templates/lists/file/templates/form-add-file.html",
      controller: "addFileController"
    })
  }
]);
fileModule.module.directive('fileUpload', function() {
  return {
    restrict: 'A',
    scope: {
      list: '=?',
      json: '=?',
      fileUpload: '='
    },
    controller: [
      '$scope',
      '$http',
      '$localStorage',
      '$rootScope',
      function($scope, $http, $localStorage, $rootScope) {

        $scope.upload = function(fileRaw, callback, data) {
          $scope.$emit("$fileUploadStart");
          if (!data)
            data = {};
          data.return = "JSON";
          if (!$scope.fileUpload) {
            $scope.fileUpload = server_url + "/api/" + $localStorage.get('id_app') + "/file";
          }
          $http({
            method: 'POST',
            url: $scope.fileUpload,
            headers: {
              'Content-Type': undefined
            },
            transformRequest: function(data) {
              var formData = new FormData();
              if (data.data) {
                for (var key in data.data) {
                  formData.append(key, data.data[key]);
                }
              }
              //now add all of the assigned files
              formData.append($scope.name, data.fileRaw);
              return formData;
            },
            data: {
              data: data,
              fileRaw: fileRaw
            }
          }).then(function(res) {
            $scope.$emit("$fileUploadSuccess", res.data)
            callback(null, res.data)
          }, function(e) {
						console.log("error upload file",e);
            $scope.$emit("$fileUploadError", e.data);
            callback(e.data);
          });
        }
      }
    ],
    link: function(scope, element, attrs, ctr) {
      scope.name = attrs.name;
      if (!scope.name)
        scope.name = "file";

      element.bind('change', function(event) {
        var files = event.target.files;
        //iterate files since 'multiple' may be specified on the element
        async.map(files, function(file, callback) {
          scope.upload(file, function(e, rs) {
            if (e)
              return callback(e);
            if (!scope.list)
              scope.list = [];
            scope.list.push(rs);
            callback();
          }, scope.json)
        }, function(e, rs) {
          element.val("");
          //if(e) return alert(e);

        })
      });
    }
  }
})

fileModule.module.directive('imageUpload', [
  '$rootScope',
  function($rootScope) {
    return {
      restrict: 'A',
      scope: {
        model: '=',
        modelThumb: '=',
        json: '=',
        ngUploaded: '&',
        folder: '@'
      },
      controller: [
        '$scope',
        '$http',
        '$localStorage',
        function($scope, $http, $localStorage) {
          $scope.upload = function(fileRaw, callback, data) {
            $scope.$emit("$fileUploadStart")
            if (!data)
              data = {}
            data.return = "JSON"
            if (!$scope.folder) {
              $scope.folder = 'products';
            }
            $http({
              method: 'POST',
              url: server_url + "/api/uploadfile?json=1&folder=" + $scope.folder,
              headers: {
                'Content-Type': undefined
              },
              transformRequest: function(data) {
                var formData = new FormData();
                if (data.data) {
                  for (var key in data.data) {
                    formData.append(key, data.data[key]);
                  }
                }
                //now add all of the assigned files
                formData.append("file", data.fileRaw);
                return formData;
              },
              data: {
                data: data,
                fileRaw: fileRaw
              }
            }).then(function(res) {
              $scope.$emit("$fileUploadSuccess")
              callback(null, res.data)
            }, function(e) {
              $scope.$emit("$fileUploadError")
              callback(e.data)
            });
          }
        }
      ],
      link: function(scope, element, attrs, ctr) {
        element.bind('change', function(event) {
          var files = event.target.files;
          //iterate files since 'multiple' may be specified on the element
          async.map(files, function(file, callback) {
            scope.upload(file, function(e, rs) {
              if (e)
                return callback(e);
              scope.model = rs.image;
              scope.modelThumb = rs.thumb;
              if (scope.onUploaded) {
                scope.onUploaded({$image: rs.image, $thumb: rs.thumb})
              }
              callback()
            }, scope.json)
          }, function(e, rs) {
            if (e)
              $rootScope.alert(e);
            element.val("");
          })
        });
      }
    }
  }
])
fileModule.module.directive("file", function() {
  return {
    restrict: 'E',
    scope: {
      link: '='
    },
    templateUrl: "templates/lists/file/templates/directive.html",
    controller: [
      '$scope',
      '$http',
      '$location',
      '$window',
      '$uibModal',
      '$interval',
      'appInfo',
      '$rootScope',
      'file',
      function($scope, $http, $location, $window, $uibModal, $interval, appInfo, $rootScope, sv_file) {
        appInfo.info("file", function(e, u, a) {
          if (e)
            return;
          $scope.token = $rootScope.token;
          $scope.id_app = id_app
          $scope.server_url = server_url;
          $scope.downloadFile = $rootScope.downloadFile;
          $scope.addfile = function() {
            var w = $window.open("#file/addfile?id_link=" + $scope.link._id, "Add File", "directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=500,height=300");
            var time = 0;
            stop = $interval(function() {
              if (w.document.title == "OK") {
                $interval.cancel(stop);
                stop = undefined;
                var content = JSON.parse(w.document.body.innerText);
                $scope.files.push(content);
                w.close();
                return;
              }
              if (w.document.title == "ERROR") {
                $interval.cancel(stop);
                stop = undefined;
                $rootScope.alert(w.document.body.innerText);
                w.close();
                return;
              }
              time = time + 500;
              if (time > 5 * 60 * 1000 && stop) {
                $interval.cancel(stop);
                stop = undefined;
              }
            }, 500);
          }
          $scope.deletefile = function(file) {
            $rootScope.confirm("Bạn có chắc chắn xóa file này không?").then(function(ind) {
              if (ind == 1) {
                //$http.delete(server_url + "/api/"+id_app+"/file/" + file._id)
                sv_file.delete(id_app, file._id).then(function(rs) {
                  $scope.files = _.reject($scope.files, function(r) {
                    return (r._id == file._id);
                  });
                }, function(e) {
                  if (e.data)
                    $rootScope.alert(e.data);
                  }
                )
              }
            })
          }
          $scope.load = function() {
            //$http.get(server_url + "/api/"+id_app+"/file?q={id_link:'" + $scope.idLink  + "'}")
            sv_file.load(id_app, {
              filter: {
                id_link: $scope.idLink
              }
            }).then(function(files) {
              $scope.files = files.data;
            }, function(e) {
              if (e.data && _online)
                $rootScope.alert(e.data);
              }
            );
          }
          $scope.$watch("link", function(newValue) {
            if (newValue) {
              $scope.idLink = $scope.link._id;
              $scope.load();
              $scope.dataLink = {
                id_link: $scope.idLink,
                collection_link: $scope.link.collection_name
              };
              $scope.dataLink.url_topic = server_url + "/#" + $location.url(); //$location.absUrl();
              $scope.dataLink.title_topic = $rootScope.title_view;
            }
          }, true);

          $scope.$on("$fileUploadError", function(e, error) {
            $rootScope.alert(error);
          });
          $scope.openProfile = function(email) {
            viewProfile($uibModal, email);
          }
        })

      }
    ],
    link: function($scope, element, attrs, controller) {
      if (!attrs.link) {
        console.error("comment directive require 'link' attribute");
      }

    }
  }
})
