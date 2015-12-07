angular.module('oxelie.map.map', [ 'oxelie.map.assets' ])

  .controller('MapCtrl', function ($scope, $stateParams, configuration, mapFunctions, $http, leafletData, helpers, $interval) {
    configuration.defaults.attributionControl = !$stateParams.noInterface
    configuration.defaults.scrollWheelZoom = !$stateParams.siteMode

    configuration.center.lat = parseFloat($stateParams.latitude) || configuration.center.lat;
    configuration.center.lng = parseFloat($stateParams.longitude) || configuration.center.lng;
    configuration.center.zoom = parseInt($stateParams.zoom) || configuration.center.zoom;

    if ($stateParams.pictureMode) {
      configuration.controls = {};
    }

    $scope.defaults = configuration.defaults;
    $scope.center = configuration.center;

    $scope.controls = configuration.controls;
    $scope.layers = configuration.layers;
    $scope.markers = {};
    $scope.climateData = null;
    $scope.rawMeasureData = null;

    var measureControl;
    leafletData.getMap().then(function(map) {
      measureControl = new L.Control.Measure(configuration.measure);
      measureControl.addTo(map);
      
      if ($stateParams.pictureMode) map._controlContainer.innerHTML = "";
    });

    $scope.$watch('showClimate', function (value) {
      if (value == false) {
        hideClimate();
      } else {
        displayClimate(); 
      }
    });

    $scope.$watch('item', function (item) {
      if(item) {
        mapFunctions.highlightOnMap(item);
      } else {
        mapFunctions.clearSelection();
      }
    });

    var updateMeasureData;
    $scope.$on('startMeasure', function(e) {
      measureControl._startMeasure();

      updateMeasureData = $interval(function() {
        $scope.rawMeasureData = measureControl.$results.innerHTML;
      }, 500);
    });

    $scope.$on('stopMeasure', function(e) { 
      measureControl._clearMeasure();
      measureControl._finishMeasure();
      
      $interval.cancel(stop);
      stop = undefined;
      $scope.measure.data = null;
    });


    function fetchClimate(callback) {
      $http.get('http://maps.oxelie.com/data/weather.json').success(function(data, status) {
        $scope.climateData = L.geoJson(data, {
          style: helpers.processClimate
        });

        callback();

        $scope.climateLoadingState = 2;
      });
    };

    function displayClimate() {
      if (!$scope.climateData) {
        fetchClimate(function () { displayClimate() });
        return;
      }

      leafletData.getMap().then(function(map) {
        map.addLayer($scope.climateData);
      });
    };

    function hideClimate() {
      if (!$scope.climateData) return;

      leafletData.getMap().then(function(map) {
        map.removeLayer($scope.climateData);
      });
    };
  })

  .factory('mapFunctions', function (leafletData, assets) {
  	return {
      shape: null,

      clearSelection: function () {
        if (!this.shape) return;

        var self = this;

        leafletData.getMap().then(function(map) {
          map.removeLayer(self.shape);
          self.shape = null;
        });
      },
 
      highlightOnMap: function (item) {
        var self = this;
        var points = item.points;

        leafletData.getMap().then(function(map) {

          if (self.shape) {
            map.removeLayer(self.shape);
            self.shape = null;
          }

          switch (self.getItemType(points)) {
            case 'point':
              var icon = new L.Icon.Default();
              icon.options = _.extend(icon.options, {
                iconUrl: assets.assetPath('marker-icon.png'),
                iconRetinaUrl: assets.assetPath('marker-icon-2x.png'),
                shadowUrl: assets.assetPath('marker-shadow.png'),
                shadowRetinaUrl: assets.assetPath('marker-shadow.png')
              });

              self.shape = L.marker(points[0][0], {clickable: false, icon: icon})
              break;
            case 'polyline':
              self.shape = L.polyline(points[0], {color: 'red', weight: 1});
              break;
            case 'multiPolyline':
              self.shape = L.multiPolyline(points, {color: 'red', weight: 1});
              break;
            case 'polygon':
              self.shape = new L.polygon(points[0], {color: 'red', weight: 1 });
              break;
          }

          if (self.shape) {
            map.addLayer(self.shape);

            if (self.getItemType(points) == 'point') {
              map.setView(points[0][0], (item.zoom) ? item.zoom : 11);
            } else {
              map.fitBounds(self.shape.getBounds());
            }
          }
        });
      },

      getItemType: function (points) {
        if (points.length == 1) {
          if (points[0].length > 1) type = 'polyline';
          if (this.compareLatLng(points[0][0], points[0][points[0].length - 1])) type = 'polygon';
          if (points[0].length == 1) type = 'point';
        } else if (points.length > 1) {
          type = 'multiPolyline';
        }

        return type;
      },

      compareLatLng: function (coord1, coord2) {
      	return (coord1.lat == coord2.lat && coord1.lng == coord2.lng);
      }

  	}
  })

  .directive('map', function() {
    return {
      restrict: 'E',
      scope: {
        item: '=',
        showClimate: '=',
        climateLoadingState: '=',
        measure: '='
        
      },
      controller: 'MapCtrl',
      templateUrl: '/modules/tools/map/template.html',
      link: function(scope, element, attrs, ctrl) {
        scope.$watch('rawMeasureData', function (value) {
          var data = $(value);
          data.find('span').remove();
          
          scope.measure.data = $(data[2]).text();
        });
      }
    };
  })

;