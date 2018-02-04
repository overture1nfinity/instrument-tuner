(function() {
    'use strict';

    angular.module('lib').service('Canvas2DHandler', Canvas2DHandler);

    /** @ngInject */
    function Canvas2DHandler(_, requestAnimationFrame) {
        var _ctx = null;
        this._rafId = null;
        this.canvas = null;

        this.setContext = function(ctx) {
            if(ctx instanceof CanvasRenderingContext2D) {
                _ctx = ctx;
                this.canvas = _ctx.canvas;
            }
        }

        this.getContext = function() {
            if(_ctx instanceof CanvasRenderingContext2D)
                return Object.create(_ctx);
            else
                return null;
        }

        this.clear = function() {
            _ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }

        this.drawRect = function(x, y, w, h, s) {
            if(_ctx) {
                _ctx.fillStyle = s;
                _ctx.fillRect(x, y, w, h);
            }
        }

        this.drawLine = function(x1, y1, x2, y2, s) {
            if(_ctx) {
                _ctx.beginPath();
                _ctx.moveTo(x1, y1);
                _ctx.lineTo(x2, y2);
                _ctx.strokeStyle = s || 'black';
                _ctx.stroke();
                _ctx.closePath();
            }
        }

        this.beginDraw = function() {
            this.clear();
        }

        this.endDraw = function(rafCb) {
            this._rafId = requestAnimationFrame(rafCb || function() {});
        }
    }
    
})();
