(function() {
  'use strict';

  angular.module('app').config(configBlock);

  
  function configBlock($locationProvider, $logProvider) {
    $locationProvider.
        html5Mode(true);

    $logProvider.
        debugEnabled(true);
  }

})();
