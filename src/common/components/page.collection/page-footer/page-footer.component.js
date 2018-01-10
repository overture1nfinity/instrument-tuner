(function() {
    'use strict';
  
    angular.module('common').component('pageFooter', {
      controller: PageFooterController,
      controllerAs: 'vm',
      templateUrl: 'common\\components\\page.collection\\page-footer\\page-footer.template.html',
    });
  
    /** @ngInject */
    function PageFooterController() {}
  
})();
