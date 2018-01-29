(function() {
    'use strict';
  
    angular.module(/*@name*/).run(runBlock);
  
    /** @ngInject */
    function runBlock($log) {
      $log.log(/*@name*/ + '.run');
    }
  
})();
