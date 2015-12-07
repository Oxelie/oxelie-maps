angular.module('oxelie.map.informations', [ ])

  .controller('InformationsCtrl', function ($scope, $state) {
    $scope.$watch('category', function (value) {
      $scope.templateURL = '/modules/tools/informations/templates/template_' + value + '.html';
    });
  })

  .directive('informations', function() {
    return {
      restrict: 'E',
      scope: {
        data: '=',
        wiki: '=',
        category: '=',
        onClick: '='
      },
      controller: 'InformationsCtrl',
      templateUrl: function(elem, attr) {
        return '/modules/tools/informations/template.html'
      }
    };
  })

;