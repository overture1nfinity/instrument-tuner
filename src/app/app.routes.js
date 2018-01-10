(function() {
  'use strict';

  angular.module('app').config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app', {
      url: '/',
      component: 'app',
    });

    $urlRouterProvider.otherwise('/');
  }

})();
