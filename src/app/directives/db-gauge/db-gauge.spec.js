describe('db-gauge.directive', function() {
    var _$compile, _audioState, _AUDIO_CFG;
    var scope, ctrl, el, cmpEl;

    beforeEach(function() {
        module('app');
        inject(function($compile, $rootScope, $controller, audioState, AUDIO_CFG) {
            _$compile = $compile;
            _audioState = audioState;
            _AUDIO_CFG = AUDIO_CFG;
            scope = $rootScope.$new();
            ctrl = $controller('DbGaugeController', {
                $scope: scope,
            });
        });
    });

    

    function compileCanvas() {
        var el = angular.element('<canvas db-gauge></canvas');
        _$compile(el)(scope);
        scope.$digest();

        return el;
    }



    it('should append to DOM successfully', function() {
        var el = compileCanvas();

        document.body.appendChild(el[0]);
        expect(document.getElementsByTagName('canvas')[0]).toBeDefined();
    });

    

    describe('init()', function() {
        it('should throw InvalidCanvasError with parameters: [null]', function() {
            expect(function(){ ctrl.init(null); }).toThrow('InvalidCanvasError');
        });

        it('should throw InvalidCanvasError with parameters: [new Array()]', function() {
            expect(function(){ ctrl.init(new Array()); }).toThrow('InvalidCanvasError');
        });

        it('should set correct context via c2dh.setContext with valid canvas object', function() {
            var canvas = compileCanvas()[0]; // this runs ctrl.init already because it's called in DbGaugeLink, which will be called by $compile
            var context = canvas.getContext('2d');

            expect(ctrl.c2dh.getContext()).toEqual(context);
        });

        it('should call onCanvasSizeChange() and draw() with valid canvas object', function() {
            spyOn(ctrl, 'onCanvasSizeChange');
            spyOn(ctrl, 'draw');

            var canvas = compileCanvas()[0];
            ctrl.init(canvas); // need to call ctrl.init explicitly here. I don't know why.

            expect(ctrl.onCanvasSizeChange).toHaveBeenCalled();
            expect(ctrl.draw).toHaveBeenCalled();
        });
    });


    
    describe('onCanvasSizeChange()', function() {
        var canvas;

        beforeEach(function() {
            canvas = compileCanvas()[0];
        });

        it('should init canvasWidth, canvasHeight, and volumePosRange.max to correct values', function() {
            canvas.width = 5;
            canvas.height = 10;
            ctrl.clipLinePosPct = 0.15;
            ctrl.onCanvasSizeChange();
            
            expect(ctrl.canvasWidth).toEqual(5);
            expect(ctrl.canvasHeight).toEqual(10);
            expect(ctrl.volumePosRange.max).toEqual(0.15*5);
        });
    });



    describe('draw()', function() {
        var canvas;

        beforeEach(function() {
            canvas = compileCanvas()[0];

            // controls different than the default values of the controller for testing
            ctrl.clipColor = 'black';
            ctrl.volumeColor = 'red';
            ctrl.clipLinePosPct = 0.69;
        });

        it('should call c2dh.beginDraw() and c2dh.endDraw() with signal', function() {
            _audioState.volumePct = 1;
            
            spyOn(ctrl.c2dh, 'beginDraw').and.callFake(function(){});
            spyOn(ctrl.c2dh, 'endDraw').and.callFake(function(){});

            ctrl.init(canvas);
            ctrl.draw(0);

            expect(ctrl.c2dh.beginDraw).toHaveBeenCalled();
            expect(ctrl.c2dh.endDraw).toHaveBeenCalledWith(ctrl.draw);
        });

        it('should call c2dh.beginDraw() and c2dh.endDraw() without signal', function() {
            _audioState.volumePct = null;

            spyOn(ctrl.c2dh, 'beginDraw').and.callFake(function(){});
            spyOn(ctrl.c2dh, 'endDraw').and.callFake(function(){});

            ctrl.init(canvas);
            ctrl.draw(0);

            expect(ctrl.c2dh.beginDraw).toHaveBeenCalled();
            expect(ctrl.c2dh.endDraw).toHaveBeenCalledWith(ctrl.draw);
        });

        it('should draw clip line, volume bar, and clip bar when volumePct is 1.1 (110%)', function() {
            _audioState.volumePct = 1.1;
            _audioState.clipPct = 0.1;
            _audioState.clipping = true;
            canvas.width = 5;
            canvas.height = 10; // this should get overwritten to 40 by ctrl.init()

            ctrl.init(canvas);
            
            spyOn(ctrl.c2dh, 'drawLine').and.callFake(function(){});
            spyOn(ctrl.c2dh, 'drawRect').and.callFake(function(){});

            ctrl.draw(0);

            /*expect(ctrl.c2dh.drawLine).toHaveBeenCalledWith(
                ctrl.volumePosRange.min, 0, 
                clampedVolumePct*ctrl.volumePosRange.max, ctrl.canvasHeight, 
                ctrl.volumeColor);*/

            var volumePosRangeMaxExpected = 0.69*5;

            expect(ctrl.c2dh.drawLine).toHaveBeenCalledWith( // clip line
                volumePosRangeMaxExpected, 0, volumePosRangeMaxExpected, 40, 'black'
            );
            expect(ctrl.c2dh.drawRect.calls.allArgs()).toEqual([ // volume bar, clip bar
                [0, 0, 1*volumePosRangeMaxExpected, 40, 'red'],
                [volumePosRangeMaxExpected, 0, (0.1*5), 40, 'black'],
            ]);
        });

        it('should draw clip line with no signal', function() {
            _audioState.volumePct = null;

            ctrl.init(canvas);

            spyOn(ctrl.c2dh, 'drawLine').and.callFake(function(){});
            spyOn(ctrl.c2dh, 'drawRect').and.callFake(function(){});

            ctrl.draw(0);

            expect(ctrl.c2dh.drawLine).toHaveBeenCalled();
            expect(ctrl.c2dh.drawRect).not.toHaveBeenCalled();
        });

        it('should draw clip line, and volume bar with volumePct set to 0.95 (95%)', function() {
            _audioState.volumePct = 0.95;

            ctrl.init(canvas);

            spyOn(ctrl.c2dh, 'drawLine').and.callFake(function(){});
            spyOn(ctrl.c2dh, 'drawRect').and.callFake(function(){});

            ctrl.draw(0);

            expect(ctrl.c2dh.drawLine).toHaveBeenCalled();
            expect(ctrl.c2dh.drawRect).toHaveBeenCalledWith(
                0, 0, (0.95*ctrl.volumePosRange.max), 40, 'red'
            );
            expect(ctrl.c2dh.drawRect.calls.count()).toEqual(1);
        });
    });



    describe('updateDbGauge()', function() {
        it('should calculate volumePct to be 0.5 and not set clipPct', function() {
            _audioState.signal = 0.5 * _AUDIO_CFG.SIGNAL_RANGE.clip;
            _audioState.clipPct = null;
            _audioState.volumePct = null;
            _audioState.clipping = true;

            scope.$broadcast('updateDbGauge');

            expect(_audioState.volumePct).toEqual(0.5);
            expect(_audioState.clipPct).toBe(null);
            expect(_audioState.clipping).toBe(false);
        });

        it('should calculate volumePct to be 1.5 (150%) and set clipPct to 1 (100%)', function() {
            _audioState.signal = 69.0 * _AUDIO_CFG.SIGNAL_RANGE.clip;
            _audioState.clipPct = null;
            _audioState.volumePct = null;
            _audioState.clipping = false;

            scope.$broadcast('updateDbGauge');

            expect(_audioState.volumePct).toEqual(1.5);
            expect(_audioState.clipPct).toBe(1);
            expect(_audioState.clipping).toBe(true);
        });
    });
});
