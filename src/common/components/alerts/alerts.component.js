(function() {
    'use strict';
  
    angular.module('common').component('alerts', {
      controller: AlertsController,
      controllerAs: 'vm',
      templateUrl: 'common\\components\\alerts\\alerts.template.html',
      bindings: {
        instance: '<',
        tplScope: '<',
      },
    });
  
    /** @ngInject */
    /* istanbul ignore next */
    function AlertsController() {}
  
})();
