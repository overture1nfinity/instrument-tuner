'use strict';

describe('AudioMath.service', function() {
    var srvc, cfg;

    beforeEach(function() {
        module('common');
        inject(function(AudioMath, AUDIO_CFG) {
            srvc = AudioMath;
            cfg = AUDIO_CFG;
        });
    });



    describe('calculatePitchDelta()', function() {
        it('should return null with the given parameters: [440, null]', function() {
            var delta = srvc.calculatePitchDelta(440, null);
            expect(delta).toBe(null);
        });

        it('should return ~(-7) with the given parameters: [441.783, 440]', function() {
            var a4 = 440;
            var a4plus7cents = 441.783;
            var delta = srvc.calculatePitchDelta(a4plus7cents, a4);

            expect(delta).toBeCloseTo(-7);
        });

        it('should return exactly 0 with the given parameters: [440, 440]', function() {
            var a4 = 440;
            var delta = srvc.calculatePitchDelta(a4, a4);

            expect(delta).toEqual(0);
        });

        it('should return ~(11) with the given parameters: [437.213, 440]', function() {
            var a4 = 440;
            var a4minus11cents = 437.213;
            var delta = srvc.calculatePitchDelta(a4minus11cents, a4);

            expect(delta).toBeCloseTo(11);
        });
    });



    describe('calculateAverageSignal()', function() {
        var samplesBuf;

        var randBetween = function(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        var mockFloatFrequencyData = function(buffer, targetFreq) {
            /** maxMagnitude's formula is derived from
             * signal = (maxMagnitude * (cfg.SAMPLE_RATE / cfg.NFFT_SIZE)) / 10 
             */
            var mmFactor = cfg.SAMPLE_RATE / cfg.NFFT_SIZE; // max magnitude factor
            var maxMagnitude = (targetFreq / mmFactor) * 10;
            var minMagnitude = maxMagnitude - 10;

            if(buffer instanceof Float32Array) {
                for(var i = 0; i < buffer.length; i++) {
                    buffer[i] = randBetween(minMagnitude, maxMagnitude);
                }

                buffer[0] = maxMagnitude; // to make sure that maxMagnitude is in the sample data
            }

            else
                throw('NotSupportedError');
        };

        beforeEach(function() {
            samplesBuf = new Float32Array(cfg.NFFT_SIZE);
        });



        it('should return -Infinity with the given parameter: [null]', function() {
            var avgSignal = srvc.calculateAverageSignal(null);
            expect(avgSignal).toBe(-Infinity);
        });

        it('should return ~(440.00) when mocking samples from an A4 note', function() {
            var a4 = 440.00;
            var avgSignal = null;

            mockFloatFrequencyData(samplesBuf, a4);
            avgSignal = srvc.calculateAverageSignal(samplesBuf);

            expect(avgSignal).toBeCloseTo(a4, 2);
        });

        it('should return ~(195.99) when mocking samples from a G3 note', function() {
            var g3 = 195.99;
            var avgSignal = null;

            mockFloatFrequencyData(samplesBuf, g3);
            avgSignal = srvc.calculateAverageSignal(samplesBuf);

            expect(avgSignal).toBeCloseTo(g3, 2);
        });

        it('should return ~(2349.32) when mocking samples from a D7 note', function() {
            var d7 = 2349.32;
            var avgSignal = null;

            mockFloatFrequencyData(samplesBuf, d7);
            avgSignal = srvc.calculateAverageSignal(samplesBuf);

            expect(avgSignal).toBeCloseTo(d7, 2);
        });
    });
});
