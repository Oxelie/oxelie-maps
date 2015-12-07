angular.module('oxelie.map.i18n', [ 'pascalprecht.translate', 'oxelie.map.storage' ])

  .factory('i18n', function(oxelieMapStore, $translate) {

    var service = {
      locale: oxelieMapStore.get('locale') || 'fr',

      setLocale: function(locale) {
        if (locale) {
          service.locale = locale;
          oxelieMapStore.set('locale', locale);
        }

        $translate.use(service.locale);
      }
    };

    return service;
  })

;
