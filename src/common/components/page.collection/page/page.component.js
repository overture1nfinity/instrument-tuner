(function() {
    'use strict';
  
    angular.module('common').component('page', {
      controller: PageController,
      controllerAs: 'vm',
      templateUrl: 'common\\components\\page.collection\\page\\page.template.html',
      transclude: true,
    });
  
    /** @ngInject */
    /* istanbul ignore next */
    function PageController() {}
  
})();
