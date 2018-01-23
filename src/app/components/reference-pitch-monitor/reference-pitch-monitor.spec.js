describe('reference-pitch-monitor.component', function() {
    beforeEach(module('app'));

    var scope, ctrl, _AUDIO_CFG, _audioState, _audioMath;
    const defaultSignal = 1;

    beforeEach(inject(function($componentController, $rootScope, AUDIO_CFG, audioState, pitchDetect, AudioMath) {
        scope = $rootScope.$new();
        _AUDIO_CFG = AUDIO_CFG;
        _audioState = audioState;
        _audioMath = AudioMath;
        ctrl = $componentController('referencePitchMonitor', {
            $scope: scope,
        });

        _audioState.signal = defaultSignal;

        spyOn(scope, '$broadcast').and.callThrough();
        spyOn(pitchDetect, 'autoCorrelate').and.callFake(function(samples) {
            if(samples)
                return 440; // A4
            else 
                return -1;
        });
    }));



    it('should exec _default branch when not enough signal is given', function() {
        _audioState.signal = _AUDIO_CFG.SIGNAL_RANGE.min - 0.05;

        scope.$broadcast('updateRpm');

        expect(_audioState.refPitch.note).toEqual(_AUDIO_CFG.TONE_NAMES[0]);
        expect(_audioState.pitchDelta).toEqual(0);
    });

    it('should exec _default branch when the pitch cannot be found', function() {
        scope.$broadcast('updateRpm', { samples: false });

        expect(_audioState.refPitch.note).toEqual(_AUDIO_CFG.TONE_NAMES[0]);
        expect(_audioState.pitchDelta).toEqual(0);
    });

    it('should calculate pitch delta to equal 0 with A4 as refPitch', function() {
        _audioState.pitchDelta = null;
        _audioState.refPitch.noteNum = 69;
        _audioState.refPitch.shouldInit = false;

        scope.$broadcast('updateRpm', { samples: true });
        
        expect(_audioState.pitchDelta).toEqual(0);
        expect(_audioState.pitch).toEqual(440);
        expect(ctrl.prevInputFreq).toEqual(defaultSignal);
    });

    it('should calculate pitch delta to be close to -100 with G4 as refPitch', function() {
        _audioState.pitchDelta = null;
        _audioState.refPitch.noteNum = 70;
        _audioState.refPitch.shouldInit = false;

        scope.$broadcast('updateRpm', { samples: true });
        
        expect(_audioState.pitchDelta).toBeCloseTo(-100);
        expect(_audioState.pitch).toEqual(440);
        expect(ctrl.prevInputFreq).toEqual(defaultSignal);
    });

    it('should not calculate pitch delta with refPitch.noteNum set to null', function() {
        _audioState.refPitch.noteNum = null;
        _audioState.pitchDelta = null;

        scope.$broadcast('updateRpm', { samples: true });

        expect(_audioState.pitchDelta).toBe(null);
    });

    it('should not calculate pitch delta with refPitch.shouldInit set to true', function() {
        _audioState.refPitch.shouldInit = true;
        _audioState.pitchDelta = null;

        scope.$broadcast('updateRpm', { samples: true });

        expect(_audioState.pitchDelta).toBe(null);
    });

    it('should init refPitch if refPitch.shouldInit is true', function() {
        _audioState.refPitch.shouldInit = true;
        _audioState.refPitch.noteNum = null;
        _audioState.refPitch.note = null;

        scope.$broadcast('updateRpm', { samples: true });

        expect(_audioState.refPitch.noteNum).toEqual(69);
        expect(_audioState.refPitch.note).toEqual('A');
        expect(_audioState.refPitch.shouldInit).toBe(false);
    });

    it('should init refPitch if refPitch.noteNum is NaN', function() {
        _audioState.refPitch.shouldInit = false;
        _audioState.refPitch.noteNum = null;
        _audioState.refPitch.note = null;

        scope.$broadcast('updateRpm', { samples: true });

        expect(_audioState.refPitch.noteNum).toEqual(69);
        expect(_audioState.refPitch.note).toEqual('A');
    });

    it('should init refPitch if pitchDelta is (AUDIO_CFG.PITCH_DELTA_ABSOLUTE_THRESHOLD + 1)', function() {
        _audioState.refPitch.shouldInit = false;
        _audioState.refPitch.noteNum = null;
        _audioState.refPitch.note = null;

        scope.$broadcast('updateRpm', { samples: true });

        expect(_audioState.refPitch.noteNum).toEqual(69);
        expect(_audioState.refPitch.note).toEqual('A');
    });

    it('should not init refPitch if shouldInit is false, refPitch.noteNum is 6969, and pitchDelta is 0', function() {
        _audioState.refPitch.shouldInit = false;
        _audioState.refPitch.noteNum = 6969;
        _audioState.refPitch.note = 'Hb'; // ;)
        _audioState.pitchDelta = _AUDIO_CFG.PITCH_DELTA_ABSOLUTE_THRESHOLD - 1;

        // fake calculatePitchDelta so that noteNum 6969 does not trigger a delta above the threshold
        spyOn(_audioMath, 'calculatePitchDelta').and.callFake(function() {
            return 0;
        });

        scope.$broadcast('updateRpm', { samples: true });

        expect(_audioState.refPitch.noteNum).toEqual(6969);
        expect(_audioState.refPitch.note).toEqual('Hb');
    });
});
