(function() {
    'use strict';
    angular.module('app').controller('DbGaugeController', DbGaugeController); // for testing
    angular.module('app').directive('dbGauge', function() {
      return {
        controller: DbGaugeController,
        link: DbGaugeLink,
        controllerAs: 'vm',
        restrict: 'A',
        scope: {},
      }
    });
  
    /** @ngInject */
    function DbGaugeController($scope, AUDIO_CFG, audioState, Canvas2DHandler) {
      var ctrl = this;

      this.AUDIO_CFG = AUDIO_CFG;
      this.audioState = audioState;
      this.c2dh = Canvas2DHandler;
      this.canvasWidth = null;
      this.canvasHeight = null;
      this.volumePosRange = null;
      this.clipLinePosPct = 0.90;
      this.clipColor = 'red';
      this.volumeColor = '#3ae024';

      $scope.$on('updateDbGauge', function(e, data) {
        audioState.volumePct = Math.min(1.5, audioState.signal / AUDIO_CFG.SIGNAL_RANGE.clip); // 150% is max clip range

        if(audioState.signal >= AUDIO_CFG.SIGNAL_RANGE.clip) {
          audioState.clipping = true;
          audioState.clipPct = (audioState.volumePct - 1) * 2; // 50% actual = 100% displayed
        }

        else {
          audioState.clipping = false;
        }
      });

      this.onCanvasSizeChange = function() {
        ctrl.canvasWidth = ctrl.c2dh.canvas.width;
        ctrl.canvasHeight = ctrl.c2dh.canvas.height;
        ctrl.volumePosRange = {
          min: 0,
          max: ctrl.clipLinePosPct*ctrl.canvasWidth,
        };
      }

      this.init = function(el) {
        if(!(el instanceof HTMLCanvasElement)) {
          throw 'InvalidCanvasError';
        }

        var canvas = el;
        
        canvas.height = 40;
        ctrl.c2dh.setContext(canvas.getContext('2d'));
        ctrl.onCanvasSizeChange(); // init these values
        ctrl.draw(); // start draw cycle
      }

      this.draw = function(timeStamp) {
        ctrl.c2dh.beginDraw();

        // clip line
        ctrl.c2dh.drawLine(
          ctrl.volumePosRange.max, 0, 
          ctrl.volumePosRange.max, ctrl.canvasHeight,
          ctrl.clipColor
        );

        // volume bar
        if(ctrl.audioState.volumePct > 0) {
          var clampedVolumePct = Math.min(1, ctrl.audioState.volumePct);

          ctrl.c2dh.drawRect(
            ctrl.volumePosRange.min, 0, 
            clampedVolumePct*ctrl.volumePosRange.max, ctrl.canvasHeight, 
            ctrl.volumeColor);
        }

        // clip bar
        if(ctrl.audioState.clipping) {
          ctrl.c2dh.drawRect(
            ctrl.volumePosRange.max, 0, 
            ctrl.audioState.clipPct*ctrl.canvasWidth, ctrl.canvasHeight,
            ctrl.clipColor
          );
        }

        ctrl.c2dh.endDraw(ctrl.draw);
      }
    }

    function DbGaugeLink($scope, $el, $attrs, $ctrl) {
      try {
        $ctrl.init($el[0]);
      }
      catch(e) {
        console.error(e);
      }
    }
  
})();
