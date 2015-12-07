angular.module('oxelie.map.storage', [ 'angular-storage' ])

  .factory('oxelieMapStore', function(store) {
    return store.getNamespacedStore('oxelieMap');
  })

;