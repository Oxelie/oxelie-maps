angular.module('oxelie.map')

  .directive('autoFocus', function($timeout, $parse) {
    return {
      link: function(scope, element, attrs) {
        scope.$watch(attrs.autoFocus, function(value) {
          if(value === true) {
            $timeout(function() {
              element[0].focus();            
            }, 1000);
            scope[attrs.autoFocus] = false;
          }
        });
      }
    };
  })

;