(function() {
    'use strict';
  
    angular.module('common').component('pageHeader', {
      controller: PageHeaderController,
      controllerAs: 'vm',
      templateUrl: 'common\\components\\page.collection\\page-header\\page-header.template.html',
      transclude: true,
    });
  
    /** @ngInject */
    function PageHeaderController() {}
  
})();
