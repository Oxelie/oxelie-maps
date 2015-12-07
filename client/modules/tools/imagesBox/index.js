angular.module('oxelie.map.imagesBox', [ ])

  .controller('ImagesBoxCtrl', function ($scope, $state) {
    $scope.currentImage = 0;

    $scope.previous = function () {
      $scope.currentImage--;

      if ($scope.currentImage == -1) {
        $scope.currentImage = $scope.files.length -1;
      }
    };

    $scope.next = function () {
      $scope.currentImage++;

      if ($scope.currentImage == $scope.files.length) {
        $scope.currentImage = 0;
      }
    };
  })

  .directive('imagesBox', function() {
    return {
      restrict: 'E',
      scope: {
        files: '='
      },
      controller: 'ImagesBoxCtrl',
      templateUrl: function(elem, attr) {
        return '/modules/tools/imagesBox/template.html'
      }
    };
  })

;