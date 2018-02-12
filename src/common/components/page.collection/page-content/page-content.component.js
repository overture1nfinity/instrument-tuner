(function() {
    'use strict';
  
    angular.module('common').component('pageContent', {
      controller: PageContentController,
      controllerAs: 'vm',
      templateUrl: 'common/components/page.collection/page-content/page-content.template.html',
      transclude: true,
    });
  
    
    /* istanbul ignore next */
    function PageContentController() {}
  
})();
