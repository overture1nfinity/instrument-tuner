(function() {
    'use strict';
  
    angular.module('lib')
    .constant('_', window._) // lodash
    .constant('requestAnimationFrame', (window.requestAnimationFrame || window.webkitRequestAnimationFrame))
    .constant('audioContext', new (window.AudioContext || window.webkitAudioContext || window.mozAudioContext)())
    .constant('getUserMedia', 
        navigator.mediaDevices.getUserMedia || 
        navigator.mediaDevices.webkitGetUserMedia || 
        navigator.mediaDevices.mozGetUserMedia)
    .constant('pitchDetect', window.pitchDetect)
  
})();
