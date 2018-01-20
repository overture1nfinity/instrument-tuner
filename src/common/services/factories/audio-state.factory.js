(function() {
    'use strict';

    angular.module('common').factory('audioState', AudioStateFactory);

    /** @ngInject */
    /* istanbul ignore next */
    function AudioStateFactory(AUDIO_CFG) {
        return {
            mediaSource: {
                stream: null,
                appProcessor: null,
            },
            signal: null,
            pitch: null, // Hz
            volumePct: null,
            clipPct: null,
            clipping: null,
            pitchDelta: 0, // cents
            refPitch: {
                note: AUDIO_CFG.TONE_NAMES[0],
                noteNum: null,
                shouldInit: true, // this property will only be defined for the first update cycle / tick
            },
        };
    }
    
})();
