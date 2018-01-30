(function() {
    'use strict';

    angular.module('common')
    
    .constant('AUDIO_CFG', {
        PITCH_DELTA_ABSOLUTE_THRESHOLD: 50, // cents
        SAMPLE_RATE: 44100, // bit/s
        FFT_SIZE: 2048, // sample block size
        NFFT_SIZE: 1024, // FFT_SIZE / 2
        SMOOTHING_CONSTANT: 0.7, // % 0.0 to 1.0
        SIGNAL_RANGE: {
            min: 0.1,
            max: 5.3,
            clip: 4.8,
        },
        TONE_NAMES: [
            '--',
            'C','C#','D','D#','E','F',
            'F#','G','G#','A','A#','B',
        ],
    })

})();
