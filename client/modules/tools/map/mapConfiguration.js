angular.module('oxelie.map')
  .constant('configuration', {
    defaults: {
      zoomControlPosition: 'bottomright'
    },
    center: {
      lat: 0,
      lng: 0,
      zoom: 3      
    },
    controls: {
      measureControl:true,
      scale: {
        imperial: false,
        maxWidth: 200,
      }
    },
    layers: {
      baselayers: {
        oxelie: {
          name: 'Oxélie',
          url: 'http://tiles.oxelie.com/?zxy={z}/{x}/{y}',        
          type: 'xyz',
          layerOptions: {
            detectRetina: false,
            attribution: '© Lionel Tardy & Marc Bettex',
            minZoom: 1,
            maxZoom: 18
          },
          layerParams: {
            showOnSelector: false
          }
        },
      },
      overlays: {
        draw: {
          name: 'draw',
          type: 'group',
          visible: true,
          layerParams: {
            showOnSelector: false
          }
        }
      }
    },
    measure: {
      primaryLengthUnit: 'kilometers',
      secondaryLengthUnit: null,
      primaryAreaUnit: 'sqmeters'
    }
  })

;
