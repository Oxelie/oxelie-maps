angular.module('oxelie.map.helpers', [])

  .factory('helpers', function($http) {
    return {
      processClimate: function(feature) {
        var color = '#FFEDA0';
        
        switch (feature.properties.climat) {
          case 'polar':
            color = "#eee";
            break;
          case 'mountain':
            color = "#7f7367";
            break;
          case 'continental':
            color = "#baa4d0";
            break;
          case 'ocean':
            color = "#8389c0";
            break;
          case 'ocean_warm':
            color = "#FED976";
            break;
          case 'tropical_wet':
            color = "#b5edce";
            break;
          case 'tropical_dry':
            color = "#dfedb5";
            break;
          case 'equatorial':
            color = "#55a578";
            break;
          case 'dry':
            color = "#FD8D3C";
            break;
        }
        
        return {
          color: color,
          fillOpacity: 1,
          weight: 0
        }
      }
    }
  })
;
