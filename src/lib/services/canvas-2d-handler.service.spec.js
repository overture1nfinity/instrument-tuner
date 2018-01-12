'use strict';

describe('Canvas2DHandler.service', function() {
    var srvc = undefined;

    beforeEach(function() {
        module('lib');
        inject(function(Canvas2DHandler) {
            srvc = Canvas2DHandler;
        });
    });



    describe('initial', function() {
        it('should inject service for testing', function() {
            expect(srvc).toBeDefined();
        });
    });



    describe('context functions', function() {
        it('should SET and GET context', function() {
            var ctx = document.createElement('canvas').getContext('2d');
            var gottenCtx = null;

            srvc.setContext(ctx);
            gottenCtx = srvc.getContext();

            expect(gottenCtx instanceof CanvasRenderingContext2D).toBeTruthy();
            expect(srvc.canvas instanceof HTMLCanvasElement).toBeTruthy();
        });
    });



    it('should request animation frame when endDraw() is called', function() {
        var ctx = document.createElement('canvas').getContext('2d');
        var gottenCtx = null;

        srvc.setContext(ctx);
        srvc.endDraw();
        
        expect(srvc._rafId).toBeTruthy();
        expect(srvc._rafId).toBeGreaterThan(0);
    });
});
