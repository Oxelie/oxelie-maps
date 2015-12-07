/*
  
  available url parameters
  - objectID: reference to a specific item

  available query parameters
  - siteMode: disable scrollwheel zoom
  - noInterface: hide search field & attribution
  - latitude: ...
  - longitude: ...
  - zoom: ...
  
*/

angular.module('oxelie.map.routes', [ 'ui.router' ])

  .config(function($stateProvider, $urlRouterProvider) {
    state('home', {
      url: '/:objectID?noInterface&siteMode&zoom&latitude&longitude&pictureMode',
      controller: 'HomeCtrl',
      templateUrl: '/modules/pages/home/template.html'
    });

    $urlRouterProvider.otherwise(function($injector) {
      $injector.get('$state').go('home');
    });

    function state(name, options) {
      $stateProvider.state(name, options);
    }
  })
;
