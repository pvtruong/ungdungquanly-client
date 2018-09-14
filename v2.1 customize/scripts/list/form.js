var formModule = new baseInput('form', 'form', [
  "title", "name", "subtitle", "description"
], 'Biểu mẫu', {
  modal_size: 'lg',
  onAdd: function($scope, options) {},
  onLoading: function($scope, options) {
    $scope.share = function(form) {
      var modalInstance = options.$uibModal.open({
        templateUrl: "templates/sys/share-form.html",
        controller: [
          '$scope',
          '$rootScope',
          '$controller',
          '$http',
          '$uibModalInstance',
          'appInfo',
          function($scope, $rootScope, $controller, $http, $uibModalInstance, appInfo) {
            initLabel($rootScope, $scope, appInfo, "SYS", $http);
            $scope.form = form;
            $scope.url = server_url + "/form.html#!?id=" + form._id;
            $scope.frame = '<iframe src="' + $scope.url + '" frameborder="0" scrolling="auto" allowfullscreen style="display: block;margin-left: auto;margin-right: auto;width:100%"></iframe>'
            $scope.close = function() {
              $uibModalInstance.close();
            }

          }
        ],
        size: "md", //size:'lg',
        resolve: {
          parentScope: function() {
            return $scope;
          }

        }
      });
    }
  }
});
formModule.defaultValues = {
  title: 'Tiêu đề form',
  success_message: 'Cảm ơn bạn đã đăng ký',
  email_address_already_exists: "Địa chỉ email này thật sự đã tồn tại",
  error_message: "Không thể gửi thông tin đăng ký",
  fields: [
    {
      label: 'Họ và tên',
      type: 'ten_lien_he',
      required: true
    }, {
      label: 'Địa chỉ email',
      type: 'email',
      required: true
    }
  ]
}
formModule.module.component("renderForm", {
  bindings: {
    data: "=",
    design: "<"
  },
  restrict: 'E',
  templateUrl: "templates/sys/render-form.html",
  controller: [
    "$rootScope",
    function($rootScope) {
      this.innerHeight = $rootScope.innerHeight;
      this.innerWidth = $rootScope.innerWidth * 7 / 12;
    }
  ]
});
