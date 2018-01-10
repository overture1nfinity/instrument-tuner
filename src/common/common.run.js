(function() {
    'use strict';
  
    angular.module('common').run(runBlock);
  
    /** @ngInject */
    function runBlock($log) {
      $log.log('common' + '.run');
    }
  
})();
