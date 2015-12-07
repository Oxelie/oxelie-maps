angular.module('oxelie.map')

  .config(function($translateProvider) {

    $translateProvider.useSanitizeValueStrategy('escaped');

    $translateProvider.useStaticFilesLoader({
      prefix: '/locales/',
      suffix: '.json'
    });  	
  })

  .run(function(i18n) {
    i18n.setLocale();

  })

;