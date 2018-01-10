(function() {
    'use strict';
  
    angular.module('app').component('settings', {
      controller: SettingsController,
      controllerAs: 'vm',
      templateUrl: 'app\\components\\settings\\settings.template.html',
    });
  
    /** @ngInject */
    function SettingsController() {}
  
})();
