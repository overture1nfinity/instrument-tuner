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
        it('should SET and GET valid context', function() {
            var ctx = document.createElement('canvas').getContext('2d');
            var gottenCtx = null;

            srvc.setContext(ctx);
            gottenCtx = srvc.getContext();

            expect(gottenCtx instanceof CanvasRenderingContext2D).toBeTruthy();
            expect(srvc.canvas instanceof HTMLCanvasElement).toBeTruthy();
        });

        it('should SET and GET invalid context', function() {
            var ctx = {};
            var gottenCtx = null;

            srvc.setContext(ctx);
            gottenCtx = srvc.getContext();

            expect(gottenCtx).toBe(null);
            expect(srvc.canvas).toBe(null);
        });
    });



    describe('draw functions', function() {
        it('should clear canvas in beginDraw()', function() {
            var ctx = document.createElement('canvas').getContext('2d');
            spyOn(ctx, 'clearRect');

            srvc.setContext(ctx);
            srvc.beginDraw();

            expect(ctx.clearRect).toHaveBeenCalledWith(0, 0, srvc.canvas.width, srvc.canvas.height);
        });
    
        it('should request animation frame in endDraw()', function() {
            var ctx = document.createElement('canvas').getContext('2d');
    
            srvc.setContext(ctx);
            srvc.endDraw();
            
            expect(srvc._rafId).toBeGreaterThan(0);
        });

        it('should draw rect with valid context', function() {
            var ctx = document.createElement('canvas').getContext('2d');
            var x = 0;
            var y = 0;
            var w = 100;
            var h = 100;
            var s = 'green';

            spyOn(ctx, 'fillRect');

            srvc.setContext(ctx);
            srvc.drawRect(x, y, w, h, s);

            expect(ctx.fillStyle).toBe('#008000'); // converts 'green' to '#008000' when assigning fillStyle
            expect(ctx.fillRect).toHaveBeenCalledWith(x, y, w, h);
        });

        it('should not draw rect with invalid context', function() {
            var ctx = {
                fillRect: function(x, y, w, h, s) {}
            };
            var x = 0;
            var y = 0;
            var w = 100;
            var h = 100;
            var s = 'green';

            spyOn(ctx, 'fillRect');

            srvc.setContext(ctx);
            srvc.drawRect(x, y, w, h, s);

            expect(ctx.fillRect).not.toHaveBeenCalled();
        });

        it('should draw line with valid context', function() {
            var ctx = document.createElement('canvas').getContext('2d');
            var x1 = 0;
            var y1 = 0;
            var x2 = 100;
            var y2 = 100;
            var s = 'green';

            spyOn(ctx, 'beginPath');
            spyOn(ctx, 'moveTo');
            spyOn(ctx, 'lineTo');
            spyOn(ctx, 'stroke');
            spyOn(ctx, 'closePath');

            srvc.setContext(ctx);
            srvc.drawLine(x1, y1, x2, y2, s);

            expect(ctx.beginPath).toHaveBeenCalled();
            expect(ctx.moveTo).toHaveBeenCalledWith(x1, y1);
            expect(ctx.lineTo).toHaveBeenCalledWith(x2, y2);
            expect(ctx.strokeStyle).toBe('#008000'); // converts 'green' to '#008000' when assigning fillStyle
            expect(ctx.stroke).toHaveBeenCalled();
            expect(ctx.closePath).toHaveBeenCalled();

            srvc.drawLine(x1, y1, x2, y2); // without s
            expect(ctx.strokeStyle).toBe('#000000'); // 'black'
        });

        it('should not draw line with invalid context', function() {
            var ctx = {
                beginPath: function() {},
                moveTo: function(x, y) {},
                lineTo: function(x, y) {},
                stroke: function() {},
                closePath: function() {},
            };
            var x1 = 0;
            var y1 = 0;
            var x2 = 100;
            var y2 = 100;
            var s = 'green';

            spyOn(ctx, 'beginPath');
            spyOn(ctx, 'moveTo');
            spyOn(ctx, 'lineTo');
            spyOn(ctx, 'stroke');
            spyOn(ctx, 'closePath');

            srvc.setContext(ctx);
            srvc.drawLine(x1, y1, x2, y2, s);

            expect(ctx.beginPath).not.toHaveBeenCalled();
            expect(ctx.stroke).not.toHaveBeenCalled();
            expect(ctx.closePath).not.toHaveBeenCalled();
        });
    });
});
