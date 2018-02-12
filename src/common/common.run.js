(function() {
    'use strict';
  
    angular.module('common').run(runBlock);
  
    
    function runBlock($log) {
      $log.log('common' + '.run');
    }
  
})();
