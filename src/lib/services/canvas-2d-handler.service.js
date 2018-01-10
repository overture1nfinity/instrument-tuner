(function() {
    'use strict';

    angular.module('lib').service('Canvas2DHandler', Canvas2DHandler);

    /** @ngInject */
    function Canvas2DHandler(requestAnimationFrame) {
        this._ctx = null;
        this._rafId = null;
        this.canvas = null;
        var srvc = this;

        this.setContext = function(ctx) {
            srvc._ctx = (ctx instanceof CanvasRenderingContext2D) ? ctx : null;
            srvc.canvas = srvc._ctx.canvas;
        }

        this.getContext = function() {
            return Object.assign({}, srvc._ctx);
        }

        this.clear = function() {
            srvc._ctx.clearRect(0, 0, srvc.canvas.width, srvc.canvas.height);
        }

        this.drawRect = function(x, y, w, h, s) {
            if(srvc._ctx) {
                srvc._ctx.fillStyle = s;
                srvc._ctx.fillRect(x, y, w, h);
            }
        }

        this.drawLine = function(x1, y1, x2, y2, s) {
            if(srvc._ctx) {
                srvc._ctx.beginPath();
                srvc._ctx.moveTo(x1, y1);
                srvc._ctx.lineTo(x2, y2);
                srvc._ctx.strokeStyle = s || 'none';
                srvc._ctx.stroke();
                srvc._ctx.closePath();
            }
        }

        this.beginDraw = function() {
            srvc.clear();
        }

        this.endDraw = function(rafCb) {
            srvc._rafId = requestAnimationFrame(rafCb || function() {});
        }
    }
    
})();
