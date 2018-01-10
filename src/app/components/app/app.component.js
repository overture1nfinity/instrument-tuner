(function() {
    'use strict';
  
    angular.module('app').component('appRoot', {
      controller: AppController,
      controllerAs: 'vm',
      templateUrl: 'app\\components\\app\\app.template.html',
    });
  
    /** @ngInject */
    function AppController($scope, getUserMedia, AUDIO_CFG, audioContext, audioMath, audioState, Alerts) {

      var ctrl = this;
      ctrl.alerts = Alerts;
      ctrl.viewAlerts = {
        enableMicAlert: null,
        notFoundAlert: null,
        notSupportedAlert: null,
        unknownAlert: null,
      };

      var prevAudioSignal = null;

      var gUMSuccess = function(stream) {
        let mediaSourceState = audioState.mediaSource;
        mediaSourceState.stream = audioContext.createMediaStreamSource(stream);

        // using only 1 processor to make sure all gauges are reading from the exact same data
        mediaSourceState.appProcessor = audioContext.createScriptProcessor(AUDIO_CFG.FFT_SIZE, 2, 1);
        mediaSourceState.appProcessor.onaudioprocess = ctrl.onAudioProcess;

        mediaSourceState.stream.connect(mediaSourceState.appProcessor);
        mediaSourceState.appProcessor.connect(audioContext.destination);

        ctrl.viewAlerts.enableMicAlert.close();
        $scope.$digest();
      };

      var gUMError = function(err) {
        switch(err.name) {
          case 'NotFoundError':
            ctrl.viewAlerts.notFoundAlert.open();
            break;

          default:
            ctrl.viewAlerts.unknownAlert.open();
            break;
        }
      };

      var initAlerts = function() {
        ctrl.viewAlerts.enableMicAlert = Alerts.addAlert('info', 'inline-partials/enable-mic-alert.html', true, false);
        ctrl.viewAlerts.notFoundAlert = Alerts.addAlert('danger', 'inline-partials/not-found-alert.html');
        ctrl.viewAlerts.notSupportedAlert = Alerts.addAlert('danger', 'inline-partials/not-supported-alert.html');
        ctrl.viewAlerts.unknownAlert = Alerts.addAlert('danger', 'inline-partials/unknown-alert.html');
      }

      ctrl.$onInit = function() {
        initAlerts();
      };

      ctrl.$onDestroy = function() {
        ctrl.tickInterval.cancel();
      };

      ctrl.selectInput = function(e) {
        if(!getUserMedia) {
          ctrl.viewAlerts.notSupportedAlert.open();
          return;
        }

        getUserMedia.call(
          navigator, 
          {
            audio: {
              mandatory: {
                googEchoCancellation: false,
                googAutoGainControl: false,
                googNoiseSuppression: false,
                googHighpassFilter: false,
              }
            }
          })
          .then(gUMSuccess)
          .catch(gUMError);
      };

      ctrl.onAudioProcess = function(e) {
        let samples = e.inputBuffer.getChannelData(0); // need to add ability to choose between channels
        let avgSignal = audioMath.calculateAverageSignal(samples);
        avgSignal = Math.min(avgSignal, AUDIO_CFG.SIGNAL_RANGE.max);


        // smooth
        if(prevAudioSignal) {
          audioState.signal = Math.max(avgSignal, prevAudioSignal*AUDIO_CFG.SMOOTHING_CONSTANT);
        }
        else {
          audioState.signal = avgSignal;
        }

        $scope.$broadcast('updateDbGauge'); // need to update db gauge before anything else
        $scope.$broadcast('updateRpm', { samples: samples });

        prevAudioSignal = audioState.signal;
      };
      
    }
  
})();