(function() {
  'use strict';

  angular.module('app').config(routerConfig);

  
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app', {
      url: '/',
      component: 'app',
    });

    $urlRouterProvider.otherwise('/');
  }

})();
