(function() {
    'use strict';
  
    angular.module('app').component('referencePitchMonitor', {
      controller: ReferencePitchMonitorController,
      controllerAs: 'vm',
      templateUrl: 'app\\components\\reference-pitch-monitor\\reference-pitch-monitor.template.html',
    });
  
    /** @ngInject */
    function ReferencePitchMonitorController($scope, AUDIO_CFG, AudioMath, audioState, pitchDetect) {
      var ctrl = this;

      $scope.audioState = audioState; // isolated scope
      this.prevInputFreq = 0;

      $scope.$on('updateRpm', function(e, data) {
        var inputFreq = audioState.signal;
        var _default = false;
        
        if(inputFreq >= AUDIO_CFG.SIGNAL_RANGE.min) {

            let pitch = pitchDetect.autoCorrelate(data.samples, AUDIO_CFG.SAMPLE_RATE);

            if(!isNaN(pitch) && pitch > -1) {
              if(!isNaN(audioState.refPitch.noteNum) && !audioState.refPitch.shouldInit) {
                audioState.pitchDelta = AudioMath.calculatePitchDelta(
                  pitchDetect.frequencyFromNoteNumber(audioState.refPitch.noteNum),
                  pitch);
              }
              
              if(
                audioState.refPitch.shouldInit || 
                isNaN(audioState.refPitch.noteNum) || 
                !audioState.refPitch.note || 
                Math.abs(audioState.pitchDelta) >= AUDIO_CFG.PITCH_DELTA_ABSOLUTE_THRESHOLD) {
  
                  audioState.refPitch.noteNum = pitchDetect.noteFromPitch(pitch);
                  audioState.refPitch.note = (!isNaN(audioState.refPitch.noteNum) && audioState.refPitch.noteNum > -1) ? AUDIO_CFG.TONE_NAMES[(audioState.refPitch.noteNum % 12)+1] : AUDIO_CFG.TONE_NAMES[0];
                  audioState.refPitch.shouldInit = false;
              }
  
              audioState.pitch = pitch;
              ctrl.prevInputFreq = inputFreq;
            }

            else _default = true;

        }

        else _default = true;


        if(_default) {
          audioState.refPitch.note = AUDIO_CFG.TONE_NAMES[0];
          audioState.refPitch.noteNum = NaN;
          audioState.pitchDelta = 0;
        }


        $scope.$digest();

      });
    }
  
})();
