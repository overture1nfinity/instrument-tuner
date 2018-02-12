(function() {
    'use strict';

    angular.module('lib').factory('AudioMath', AudioMathFactory);

    
    function AudioMathFactory(_, pitchDetect) {

        return {
            /**
             * @summary Calculates the amount of cents a frequency is off of a reference pitch.
             * @description
             * Uses this formula: n = 1200*log2(b/a) -- 'a' and 'b' are the 2 subject frequencies.
             * @param {number} refFreq The frequency of the reference pitch.
             * @param {number} freq The subject frequency in Hz.
             * @returns {number || null} Null if something went wrong, else cent value.
             */
            calculatePitchDelta: function(refFreq, freq) {
                var cents = null;

                if(refFreq && freq) {
                    if(refFreq !== freq) {
                        cents = 1200*Math.log2(refFreq / freq) * -1; // 100 cents should be the maximum output
                    }

                    else {
                        cents = 0; // no difference
                    }
                }

                return cents;
            },

            /**
             * @summary Calculates the average signal from a Float32Array of signal values.
             * @param {Float32Array} samples The samples of signal data to calculate the average of.
             * @param {number} sampleRate Sample rate.
             * @param {number} nfftSize 1/2 FFT size. Found in the AnalyserNode of the Web Audio API.
             * @returns {float} The average signal from samples.
             */
            calculateAverageSignal: function(samples, sampleRate, nfftSize) {
                var signal = -Infinity;

                if(samples instanceof Float32Array) {
                    var maxMagnitude = -Infinity;

                    for(var i = 0; i < samples.length; i++) {
                        var s = samples[i];
                        if(maxMagnitude < s) maxMagnitude = s;
                    }

                    signal = (maxMagnitude * (sampleRate / nfftSize)) / 10
                }

                return signal;
            },

        };
    }

})();
