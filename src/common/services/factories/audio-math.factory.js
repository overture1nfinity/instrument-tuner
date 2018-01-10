(function() {
    'use strict';

    angular.module('common').factory('audioMath', AudioMathFactory);

    /** @ngInject */
    function AudioMathFactory(_, AUDIO_CFG, pitchDetect) {

        return {
            /**
             * @summary Calculates the amount of cents a frequency is off of a reference pitch.
             * @description
             * Uses this formula: n = 1200*log2(b/a) -- 'a' and 'b' are the 2 subject frequencies.
             * @param {number} freq The subject frequency in Hz.
             * @param {number} refFreq The frequency of the reference pitch.
             * @returns {number || null} Null if something went wrong, else cent value.
             */
            calculatePitchDelta: function(freq, refFreq) {
                var cents = null;

                if(freq && refFreq) {
                    cents = 1200*Math.log2(refFreq / freq) * -1; // 100 cents should be the maximum output
                }
                
                return cents;
            },

            /**
             * @summary Calculates the average signal from a Float32Array of signal values.
             * @param {Float32Array} samples The samples of signal data to calculate the average of.
             * @returns {float} The average signal from samples.
             */
            calculateAverageSignal: function(samples) {
                var signal = -Infinity;

                if(samples instanceof Float32Array) {
                    let maxMagnitude = -Infinity;

                    for(let i = 0; i < samples.length; i++) {
                        let s = samples[i];
                        if(maxMagnitude < s) maxMagnitude = s;
                    }

                    signal = (maxMagnitude * (AUDIO_CFG.SAMPLE_RATE / AUDIO_CFG.NFFT_SIZE)) / 10
                }

                return signal;
            },

        };
    }

})();
