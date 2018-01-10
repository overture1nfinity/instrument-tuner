(function() {
  'use strict';

  angular.module('app').run(runBlock);

  /** @ngInject */
  function runBlock($log) {
    $log.log('app.run');
  }

})();
