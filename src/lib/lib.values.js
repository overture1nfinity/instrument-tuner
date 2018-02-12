(function() {
    'use strict';
  
    angular.module('lib')
    .constant('_', window._) // lodash
    .constant('requestAnimationFrame', (window.requestAnimationFrame || window.webkitRequestAnimationFrame))
    .constant('audioContext', new (window.AudioContext || window.webkitAudioContext || window.mozAudioContext)())
    .constant('getUserMedia', window.navigator.getUserMedia)
    .constant('pitchDetect', window.pitchDetect)
    //.constant('browserDetails', window.adapter.browserDetails) // not used currently
})();
