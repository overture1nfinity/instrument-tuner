describe('reference-pitch-monitor.component', function() {
    beforeEach(module('app'));

    var _AUDIO_CFG, _audioState, _audioMath, _audioContext;
    var scope, ctrl;

    beforeEach(inject(function($componentController, $rootScope, AUDIO_CFG, audioState, AudioMath, audioContext) {
        scope = $rootScope.$new();
        _AUDIO_CFG = AUDIO_CFG;
        _audioState = audioState;
        _audioMath = AudioMath;
        _audioContext = audioContext;
        ctrl = $componentController('appRoot', {
            $scope: scope,
        });
    }));

    

    describe('$onInit()', function() {
        it('should call initAlerts()', function() {
            spyOn(ctrl, '$onInit');
            ctrl.$onInit();
            expect(ctrl.$onInit).toHaveBeenCalled();
        });
    });



    describe('initAlerts()', function() {
        it('initialize all alerts with the correct object returned from Alerts.addAlert()', inject(function(_) {
            ctrl.initAlerts();

            expect(
                _.has(ctrl.viewAlerts.enableMicAlert, 'open') &&
                _.has(ctrl.viewAlerts.enableMicAlert, 'close') &&
                _.has(ctrl.viewAlerts.enableMicAlert, 'remove')
            ).toBeTruthy();

            
            expect(
                _.has(ctrl.viewAlerts.notFoundAlert, 'open') &&
                _.has(ctrl.viewAlerts.notFoundAlert, 'close') &&
                _.has(ctrl.viewAlerts.notFoundAlert, 'remove')
            ).toBeTruthy();

            
            expect(
                _.has(ctrl.viewAlerts.notSupportedAlert, 'open') &&
                _.has(ctrl.viewAlerts.notSupportedAlert, 'close') &&
                _.has(ctrl.viewAlerts.notSupportedAlert, 'remove')
            ).toBeTruthy();

            
            expect(
                _.has(ctrl.viewAlerts.unknownAlert, 'open') &&
                _.has(ctrl.viewAlerts.unknownAlert, 'close') &&
                _.has(ctrl.viewAlerts.unknownAlert, 'remove')
            ).toBeTruthy();
        }));
    });



    describe('onAudioProcess()', function() {
        var prevAudioSignalCache = null;
        var updateDbGaugeCalled, updateRpmCalled = false;

        var onAudioProcessMock = function(avgSignal, prevSignal) {
            avgSignal = Math.min(avgSignal, _AUDIO_CFG.SIGNAL_RANGE.max);
            prevAudioSignalCache = prevSignal;

            // smooth
            if(prevAudioSignalCache) {
                _audioState.signal = Math.max(avgSignal, prevAudioSignalCache*_AUDIO_CFG.SMOOTHING_CONSTANT);
            }
            else if(avgSignal >= _AUDIO_CFG.SIGNAL_RANGE.min){
                _audioState.signal = avgSignal;
            }
  
            scope.$broadcast('updateDbGauge'); // need to update db gauge before anything else
            scope.$broadcast('updateRpm');
  
            prevAudioSignalCache = _audioState.signal || prevAudioSignalCache;
        };

        var broadcastMock = function(fnStr) {
            switch(fnStr) {
                case 'updateDbGauge':
                    updateDbGaugeCalled = true;
                    break;
                case 'updateRpm':
                    updateRpmCalled = true;
                    break;
                default:
                    updateDbGaugeCalled = false;
                    updateRpmCalled = false;
                    break;
            }
        };

        beforeEach(function() {
            broadcastMock(); // reset flags
            spyOn(scope, '$broadcast').and.callFake(broadcastMock);
        });

        it('should $broadcast \'updateDbGauge\' and \'updateRpm\' with avgSignal set to null', function() {
            onAudioProcessMock(null, null);

            expect(updateDbGaugeCalled).toBe(true);
            expect(updateRpmCalled).toBe(true);
        });

        it('should $broadcast \'updateDbGauge\' and \'updateRpm\' with avgSignal set to 440', function() {
            onAudioProcessMock(440, null);

            expect(updateDbGaugeCalled).toBe(true);
            expect(updateRpmCalled).toBe(true);
        });

        it('should $broadcast \'updateDbGauge\' and \'updateRpm\' with prevSignal set to 440', function() {
            onAudioProcessMock(null, 440);

            expect(updateDbGaugeCalled).toBe(true);
            expect(updateRpmCalled).toBe(true);
        });

        it('should $broadcast \'updateDbGauge\' and \'updateRpm\' with both avgSignal and prevSignal set to 440', function() {
            onAudioProcessMock(440, 440);

            expect(updateDbGaugeCalled).toBe(true);
            expect(updateRpmCalled).toBe(true);
        });

        it('should $broadcast \'updateDbGauge\' and \'updateRpm\' with avgSignal set to null', function() {
            onAudioProcessMock(null, null);

            expect(updateDbGaugeCalled).toBe(true);
            expect(updateRpmCalled).toBe(true);
        });

        it('should $broadcast \'updateDbGauge\' and \'updateRpm\' with avgSignal set to 440 and prevSignal set to 2000', function() {
            onAudioProcessMock(440, 2000);

            expect(updateDbGaugeCalled).toBe(true);
            expect(updateRpmCalled).toBe(true);
        });

        it('should apply smoothing correctly when prevAudioSignal = avgSignal + 200', function() {
            var signal = 440;
            var prevSignal = signal + 200;

            onAudioProcessMock(signal, prevSignal);

            expect(_audioState.signal).toEqual(prevSignal*_AUDIO_CFG.SMOOTHING_CONSTANT);
            expect(_audioState.signal).toEqual(prevAudioSignalCache);
        });
    });



    describe('selectInput()', function() {
        var gum;

        var selectInputMock = function(getUserMedia) {
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
            .then(ctrl.gUMSuccess)
            .catch(ctrl.gUMError);
        };

        beforeEach(inject(function(getUserMedia) {
            gum = getUserMedia;
        }));

        it('should open notSupportedAlert when getUserMedia is null', function() {
            ctrl.initAlerts();
            spyOn(ctrl.viewAlerts.notSupportedAlert, 'open').and.callFake(function(){});

            gum = null;
            selectInputMock(gum);

            expect(ctrl.viewAlerts.notSupportedAlert.open).toHaveBeenCalled();
        });

        it('should call getUserMedia.call() when getUserMedia is defined', function() {
            spyOn(gum, 'call').and.callFake(function(){});
            selectInputMock(gum);
            expect(gum.call).toHaveBeenCalled();
        });
    });



    describe('gUMSuccess', function() {
        var connectMock = function(node) {
            this.connectCalledWith = node;
        };

        var gUMSuccessMock = function(stream) {
            ctrl.gUMSuccess(stream);
            return _audioState.mediaSource.appProcessor.success;
        };
       
        beforeEach(function() {
            ctrl.$onInit();

            _audioState.mediaSource.stream = null;
            _audioState.mediaSource.appProcessor = null;

            spyOn(_audioContext, 'createMediaStreamSource').and.callFake(function(stream) {
                if(!stream) throw 'InvalidStreamError';
    
                return {
                    connect: connectMock,
                    success: (stream !== null),
                };
            });
    
            spyOn(_audioContext, 'createScriptProcessor').and.callFake(function(fftSize) {
                return {
                    connect: connectMock,
                    success: (fftSize === _AUDIO_CFG.FFT_SIZE),
                };
            });
        });

        it('should throw and catch error with parameters: [invalid stream (aka: null)]', function() {
            expect(gUMSuccessMock(null)).toBeFalsy();
        });

        it('should close enableMicAlert with parameters: [valid stream (aka: true)]', function() {
            spyOn(ctrl.viewAlerts.enableMicAlert, 'close');
            gUMSuccessMock(true);

            expect(ctrl.viewAlerts.enableMicAlert.close).toHaveBeenCalled();
        });

        it('should not close enableMicAlert with parameters: [invalid stream (aka: null)]', function() {
            spyOn(ctrl.viewAlerts.enableMicAlert, 'close');
            gUMSuccessMock(null);

            expect(ctrl.viewAlerts.enableMicAlert.close).not.toHaveBeenCalled();
        });

        it('should connect stream to appProcessor and appProcessor to destination with parameters: [valid stream (aka: true)]', function() {
            gUMSuccessMock(true);

            expect(_audioState.mediaSource.stream.connectCalledWith).toEqual(_audioState.mediaSource.appProcessor);
            expect(_audioState.mediaSource.appProcessor.connectCalledWith).toEqual(_audioContext.destination);
        });
    });



    describe('gUMError()', function() {
        var gum;

        beforeEach(inject(function(getUserMedia) {
            gum = getUserMedia;
        }));

        it('should open notFoundAlert with parameters: [{name:\'NotFoundError\'}]', function() {
            ctrl.initAlerts();
            spyOn(ctrl.viewAlerts.notFoundAlert, 'open').and.callFake(function(){});
            ctrl.gUMError({name: 'NotFoundError'});

            expect(ctrl.viewAlerts.notFoundAlert.open).toHaveBeenCalled();
        });

        it('should open unknownAlert with parameters: [{name:\'RandomError\'}]', function() {
            ctrl.initAlerts();
            spyOn(ctrl.viewAlerts.unknownAlert, 'open').and.callFake(function(){});
            ctrl.gUMError({name: 'RandomError'});
            
            expect(ctrl.viewAlerts.unknownAlert.open).toHaveBeenCalled();
        });
    });
});
