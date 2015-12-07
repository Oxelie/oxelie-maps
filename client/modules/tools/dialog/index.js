angular.module('oxelie.map.dialog', [])

  .directive('pennyDialog', function() {
    return {
      restrict: 'E',
      scope: {},
      controller: 'DialogCtrl',
      templateUrl: '/modules/tools/dialog/template.html'
    };
  })

  .controller('DialogCtrl', function($scope, $rootScope) {
    var originalScope;
    
    $scope.active = false;

    $scope.cancel = function () {
      $scope.active = false;    	
    };
   
    $scope.confirm = function () {
      originalScope.userConfirmation(originalScope.userConfirmationParameter);    	
      $scope.active = false;
    };

    $rootScope.$on('penny.dialog.open', function(event, scope) {
      originalScope = scope;

      $scope.title = scope.userConfirmationTitle;
      $scope.message = scope.userConfirmationMessage;
      $scope.active = true;
    });
  })

  .directive('userConfirmation', function($rootScope) {
    return {
      restrict: 'A',
      scope: {
        userConfirmation: '=',
        userConfirmationParameter: '=',
        userConfirmationTitle: '@',
        userConfirmationMessage: '@'
      },
      link: function($scope, element) {
        var e = $(element);

        e.bind('click', function() {
          $scope.$apply(function() {
            $rootScope.$emit('penny.dialog.open', $scope);
          });
        });
      }
    };
  })

;
