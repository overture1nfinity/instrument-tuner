(function() {
    'use strict';
  
    angular.module(/*@name*/).run(runBlock);
  
    
    function runBlock($log) {
      $log.log(/*@name*/ + '.run');
    }
  
})();
