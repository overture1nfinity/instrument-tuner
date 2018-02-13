!function(){"use strict";angular.module("common",["lib","ui.bootstrap"])}(),function(){"use strict";angular.module("common").component("pageFooter",{controller:function(){},controllerAs:"vm",templateUrl:"common/components/page.collection/page-footer/page-footer.template.html"})}(),function(){"use strict";angular.module("common").component("pageHeader",{controller:function(){this.version="v0.0.1"},controllerAs:"vm",templateUrl:"common/components/page.collection/page-header/page-header.template.html",transclude:!0})}(),function(){"use strict";angular.module("common").component("pageContent",{controller:function(){},controllerAs:"vm",templateUrl:"common/components/page.collection/page-content/page-content.template.html",transclude:!0})}(),function(){"use strict";angular.module("common").component("page",{controller:function(){},controllerAs:"vm",templateUrl:"common/components/page.collection/page/page.template.html",transclude:!0})}(),function(){"use strict";angular.module("lib",[])}(),function(){"use strict";function t(t,e){return{calculatePitchDelta:function(t,e){var n=null;return t&&e&&(n=t!==e?1200*Math.log2(t/e)*-1:0),n},calculateAverageSignal:function(t,e,n){var o=-1/0;if(t instanceof Float32Array){for(var a=-1/0,i=0;i<t.length;i++){var r=t[i];a<r&&(a=r)}o=a*(e/n)/10}return o}}}t.$inject=["_","pitchDetect"],angular.module("lib").factory("AudioMath",t)}(),function(){"use strict";function t(t){return{mediaSource:{stream:null,appProcessor:null},signal:null,pitch:null,volumePct:null,clipPct:null,clipping:null,pitchDelta:0,refPitch:{note:t.TONE_NAMES[0],noteNum:null,shouldInit:!0}}}t.$inject=["AUDIO_CFG"],angular.module("common").factory("audioState",t)}(),function(){"use strict";angular.module("common").component("alerts",{controller:function(){},controllerAs:"vm",templateUrl:"common/components/alerts/alerts.template.html",bindings:{instance:"<",tplScope:"<"}})}(),function(){"use strict";angular.module("app",["ui.router","ui.bootstrap","common"])}(),function(){"use strict";function t(t,e,n,o,a){var i=this;t.audioState=o,this.prevInputFreq=0,t.$on("updateRpm",function(r,l){var c=o.signal,s=!1;if(c>=e.SIGNAL_RANGE.min){var u=a.autoCorrelate(l.samples,e.SAMPLE_RATE);!isNaN(u)&&u>-1?(isNaN(o.refPitch.noteNum)||o.refPitch.shouldInit||(o.pitchDelta=n.calculatePitchDelta(a.frequencyFromNoteNumber(o.refPitch.noteNum),u).toFixed(1)),(o.refPitch.shouldInit||isNaN(o.refPitch.noteNum)||!o.refPitch.note||Math.abs(o.pitchDelta)>=e.PITCH_DELTA_ABSOLUTE_THRESHOLD)&&(o.refPitch.noteNum=a.noteFromPitch(u),o.refPitch.note=!isNaN(o.refPitch.noteNum)&&o.refPitch.noteNum>-1?e.TONE_NAMES[o.refPitch.noteNum%12+1]:e.TONE_NAMES[0],o.refPitch.shouldInit=!1),o.pitch=u,i.prevInputFreq=c):s=!0}else s=!0;s&&(o.refPitch.note=e.TONE_NAMES[0],o.refPitch.noteNum=NaN,o.pitchDelta=0),t.$digest()})}t.$inject=["$scope","AUDIO_CFG","AudioMath","audioState","pitchDetect"],angular.module("app").component("referencePitchMonitor",{controller:t,controllerAs:"vm",templateUrl:"app/components/reference-pitch-monitor/reference-pitch-monitor.template.html"})}(),function(){"use strict";function t(t,e,n,o){var a=this;this.AUDIO_CFG=e,this.audioState=n,this.c2dh=o,this.canvasWidth=null,this.canvasHeight=null,this.volumePosRange=null,this.clipLinePosPct=.9,this.clipColor="red",this.volumeColor="#3ae024",t.$on("updateDbGauge",function(t,o){n.volumePct=Math.min(1.5,n.signal/e.SIGNAL_RANGE.clip),n.signal>=e.SIGNAL_RANGE.clip?(n.clipping=!0,n.clipPct=2*(n.volumePct-1)):n.clipping=!1}),this.onCanvasSizeChange=function(){a.canvasWidth=a.c2dh.canvas.width,a.canvasHeight=a.c2dh.canvas.height,a.volumePosRange={min:0,max:a.clipLinePosPct*a.canvasWidth}},this.init=function(t){if(!(t instanceof HTMLCanvasElement))throw"InvalidCanvasError";var e=t;e.height=40,a.c2dh.setContext(e.getContext("2d")),a.onCanvasSizeChange(),a.draw()},this.draw=function(t){if(a.c2dh.beginDraw(),a.c2dh.drawLine(a.volumePosRange.max,0,a.volumePosRange.max,a.canvasHeight,a.clipColor),a.audioState.volumePct>0){var e=Math.min(1,a.audioState.volumePct);a.c2dh.drawRect(a.volumePosRange.min,0,e*a.volumePosRange.max,a.canvasHeight,a.volumeColor)}a.audioState.clipping&&a.c2dh.drawRect(a.volumePosRange.max,0,a.audioState.clipPct*a.canvasWidth,a.canvasHeight,a.clipColor),a.c2dh.endDraw(a.draw)}}function e(t,e,n,o){try{o.init(e[0])}catch(t){console.error(t)}}t.$inject=["$scope","AUDIO_CFG","audioState","Canvas2DHandler"],angular.module("app").controller("DbGaugeController",t),angular.module("app").directive("dbGauge",function(){return{link:e,controllerAs:"vm",restrict:"A",scope:{},controller:t}})}(),function(){"use strict";function t(t,e,n,o,a,i,r){var l=this;l.alerts=r,l.viewAlerts={enableMicAlert:null,notFoundAlert:null,notSupportedAlert:null,notAllowedAlert:null,unknownAlert:null};var c=null;l.initAlerts=function(){l.viewAlerts.enableMicAlert=r.addAlert("primary","inline-partials/enable-mic-alert.html",!0,!1),l.viewAlerts.notFoundAlert=r.addAlert("danger","inline-partials/not-found-alert.html"),l.viewAlerts.notSupportedAlert=r.addAlert("danger","inline-partials/not-supported-alert.html"),l.viewAlerts.notAllowedAlert=r.addAlert("danger","inline-partials/not-allowed-alert.html"),l.viewAlerts.unknownAlert=r.addAlert("danger","inline-partials/unknown-alert.html")},l.gUMSuccess=function(e){try{var a=i.mediaSource;a.stream=o.createMediaStreamSource(e),a.appProcessor=o.createScriptProcessor(n.FFT_SIZE,2,1),a.appProcessor.onaudioprocess=l.onAudioProcess,a.stream.connect(a.appProcessor),a.appProcessor.connect(o.destination),l.viewAlerts.enableMicAlert.close(),t.$digest()}catch(t){console.error(t),l.viewAlerts.unknownAlert.open()}},l.gUMError=function(e){switch(e.name){case"NotFoundError":l.viewAlerts.notFoundAlert.open();break;case"NotAllowedError":l.viewAlerts.notAllowedAlert.open();break;default:console.error(e),l.viewAlerts.unknownAlert.open()}t.$digest()},l.$onInit=function(){l.initAlerts()},l.selectInput=function(t){e?e.call(navigator,{audio:{mandatory:{googEchoCancellation:!1,googAutoGainControl:!1,googNoiseSuppression:!1,googHighpassFilter:!1}}},l.gUMSuccess,l.gUMError):l.viewAlerts.notSupportedAlert.open()},l.onAudioProcess=function(e){var o=e.inputBuffer.getChannelData(0),r=a.calculateAverageSignal(o,n.SAMPLE_RATE,n.NFFT_SIZE);r=Math.min(r,n.SIGNAL_RANGE.max),i.signal=c?Math.max(r,c*n.SMOOTHING_CONSTANT):r,t.$broadcast("updateDbGauge"),t.$broadcast("updateRpm",{samples:o}),c=i.signal}}t.$inject=["$scope","getUserMedia","AUDIO_CFG","audioContext","AudioMath","audioState","Alerts"],angular.module("app").component("appRoot",{controller:t,controllerAs:"vm",templateUrl:"app/components/app/app.template.html"})}(),function(){"use strict";function t(t,e){var n=null;this._rafId=null,this.canvas=null,this.setContext=function(t){t instanceof CanvasRenderingContext2D&&(n=t,this.canvas=n.canvas)},this.getContext=function(){return n instanceof CanvasRenderingContext2D?Object.create(n):null},this.clear=function(){n.clearRect(0,0,this.canvas.width,this.canvas.height)},this.drawRect=function(t,e,o,a,i){n&&(n.fillStyle=i,n.fillRect(t,e,o,a))},this.drawLine=function(t,e,o,a,i){n&&(n.beginPath(),n.moveTo(t,e),n.lineTo(o,a),n.strokeStyle=i||"black",n.stroke(),n.closePath())},this.beginDraw=function(){this.clear()},this.endDraw=function(t){this._rafId=e(t||function(){})}}t.$inject=["_","requestAnimationFrame"],angular.module("lib").service("Canvas2DHandler",t)}(),function(){"use strict";function t(t){var e=this;e.data=[],e.addAlert=function(t,n,o,a,i){o=void 0!==o&&o,a=void 0===a||a,i=void 0!==i?i:"";var r={id:this.data.length,type:t,show:o,templateUrl:n,additionalClasses:i,closeable:a};this.data.push(r);return{open:function(){r.show=!0},close:function(){r.show=!1},remove:function(){e.removeAlert(r.id)}}},e.removeAlert=function(n){t.forEach(this.data,function(t,o){if(t.id===n)return e.data.splice(o,1),!1})},e.openAlert=function(e){t.forEach(this.data,function(t){if(t.id===e)return t.show=!0,!1})},e.closeAlert=function(e){t.forEach(this.data,function(t){if(t.id===e)return t.show=!1,!1})},e.openAll=function(){t.map(this.data,function(t){t.show=!0})},e.closeAll=function(){t.map(this.data,function(t){t.show=!1})},e.removeAll=function(){this.data=[]}}t.$inject=["_"],angular.module("lib").service("Alerts",t)}();var pitchDetect={};pitchDetect.noteFromPitch=function(t){var e=Math.log(t/440)/Math.log(2)*12;return Math.round(e)+69},pitchDetect.frequencyFromNoteNumber=function(t){return 440*Math.pow(2,(t-69)/12)},pitchDetect.centsOffFromPitch=function(t,e){return Math.floor(1200*Math.log2(t/pitchDetect.frequencyFromNoteNumber(e)))};var MIN_SAMPLES=0,GOOD_ENOUGH_CORRELATION=.9;pitchDetect.autoCorrelate=function(t,e){var n=t.length,o=Math.floor(n/2),a=-1,i=0,r=0,l=!1,c=new Array(o),s=0;for(s=0;s<n;s++){var u=t[s];r+=u*u}if((r=Math.sqrt(r/n))<.1)return-1;for(var p=1,d=MIN_SAMPLES;d<o;d++){var m=0;for(s=0;s<o;s++)m+=Math.abs(t[s]-t[s+d]);if(m=1-m/o,c[d]=m,m>GOOD_ENOUGH_CORRELATION&&m>p)l=!0,m>i&&(i=m,a=d);else if(l){return e/(a+8*((c[a+1]-c[a-1])/c[a]))}p=m}return i>.01?e/a:-1},window.pitchDetect=pitchDetect,function(){"use strict";angular.module("lib").constant("_",window._).constant("requestAnimationFrame",window.requestAnimationFrame||window.webkitRequestAnimationFrame).constant("audioContext",new(window.AudioContext||window.webkitAudioContext||window.mozAudioContext)).constant("getUserMedia",window.navigator.getUserMedia).constant("pitchDetect",window.pitchDetect)}(),function(){"use strict";angular.module("common").constant("AUDIO_CFG",{PITCH_DELTA_ABSOLUTE_THRESHOLD:50,SAMPLE_RATE:44100,FFT_SIZE:2048,NFFT_SIZE:1024,SMOOTHING_CONSTANT:.7,SIGNAL_RANGE:{min:.1,max:4.9,clip:4.4},TONE_NAMES:["--","C","C#","D","D#","E","F","F#","G","G#","A","A#","B"]})}(),function(){"use strict";function t(t){t.log("common.run")}t.$inject=["$log"],angular.module("common").run(t)}(),function(){"use strict";function t(t){t.log("app.run")}t.$inject=["$log"],angular.module("app").run(t)}(),function(){"use strict";function t(t,e){t.state("app",{url:"/",component:"app"}),e.otherwise("/")}t.$inject=["$stateProvider","$urlRouterProvider"],angular.module("app").config(t)}(),function(){"use strict";function t(t,e){t.html5Mode(!0),e.debugEnabled(!0)}t.$inject=["$locationProvider","$logProvider"],angular.module("app").config(t)}(),angular.module("app").run(["$templateCache",function(t){t.put("index.html",'<!DOCTYPE html><html ng-app=app><head><base href=/ ><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><title>Pitch Tuner</title>\x3c!-- build:css({.tmp/serve,src}) styles/vendor.css --\x3e\x3c!-- bower:css --\x3e\x3c!-- run `gulp inject` to automatically populate bower styles dependencies --\x3e\x3c!-- endbower --\x3e\x3c!-- endbuild --\x3e\x3c!-- build:css({.tmp/serve,src}) styles/app-27c4262a17.css --\x3e\x3c!-- inject:css --\x3e\x3c!-- css files will be automatically insert here --\x3e\x3c!-- endinject --\x3e\x3c!-- endbuild --\x3e</head><body><app-root><div ui-view=""></div></app-root>\x3c!-- build:js(src) scripts/vendor-5af879e03c.js --\x3e\x3c!-- bower:js --\x3e\x3c!-- run `gulp inject` to automatically populate bower script dependencies --\x3e\x3c!-- endbower --\x3e\x3c!-- endbuild --\x3e\x3c!-- build:js({.tmp/serve,.tmp/partials,src}) scripts/app-a623f5576d.js --\x3e\x3c!-- inject:js --\x3e\x3c!-- js files will be automatically insert here --\x3e\x3c!-- endinject --\x3e\x3c!-- inject:partials --\x3e\x3c!-- angular templates will be automatically converted in js and inserted here --\x3e\x3c!-- endinject --\x3e\x3c!-- endbuild --\x3e</body></html>'),t.put("common/components/alerts/alerts.template.html",'<div class=alerts><div ng-repeat="alert in vm.instance.data"><div ng-if="alert.closeable && alert.show"><div uib-alert ng-class="[\'alert-\' + (alert.type || alert.warning), alert.additionalClasses]" close=vm.instance.closeAlert(alert.id)><div ng-include=alert.templateUrl></div></div></div><div ng-if="!alert.closeable && alert.show"><div uib-alert ng-class="[\'alert-\' + (alert.type || alert.warning), alert.additionalClasses]"><div ng-include=alert.templateUrl></div></div></div></div></div>'),t.put("app/components/reference-pitch-monitor/reference-pitch-monitor.template.html","<div id=ref-pitch-monitor><div class=rpm-main><div class=ref-pitch><span class=ref-pitch-text>{{ audioState.refPitch.note }}</span></div><div class=pitch-delta><span class=pitch-delta-text>[{{ audioState.pitchDelta }} cents]</span></div></div></div>"),t.put("app/components/app/app.template.html",'<div class=container-fluid><div class="row text-center"><div class="col-md-10 col-md-offset-1"><alerts instance=vm.alerts tpl-scope=vm></alerts></div></div><div class=widget-row><canvas class="col-md-3 col-sm-6 col-xs-5 widget" db-gauge></canvas><div class="col-md-4 col-xs-7 widget"><reference-pitch-monitor></reference-pitch-monitor></div></div></div><script type=text/ng-template id=inline-partials/enable-mic-alert.html><button class="btn btn-primary" ng-click="vm.tplScope.selectInput()">ENABLE YOUR MIC</button><\/script><script type=text/ng-template id=inline-partials/not-found-alert.html><strong>Oops!</strong> Please make sure your microphone is plugged in.<\/script><script type=text/ng-template id=inline-partials/not-supported-alert.html><strong>Oops!</strong> Microphone usage isn\'t supported on this browser. \r\n    Please upgrade to the latest version of \r\n    <a href="https://www.google.com/intl/en/chrome/browser/desktop/index.html">Google Chrome</a>\r\n    or\r\n    <a href="https://www.google.com/intl/en/chrome/browser/desktop/index.html">Mozilla Firefox</a>\r\n    or\r\n    any browser that supports microphone input.<\/script><script type=text/ng-template id=inline-partials/not-allowed-alert.html><strong>Oops!</strong> You denied microphone usage. Refresh the page if the <i>ENABLE YOUR MIC</i> button doesn\'t work.<\/script><script type=text/ng-template id=inline-partials/unknown-alert.html><strong>Oops!</strong> An unknown error occurred.<\/script>'),t.put("common/components/page.collection/page/page.template.html",'<div class="container-fluid page"><ng-transclude></ng-transclude></div>'),t.put("common/components/page.collection/page-header/page-header.template.html",'<header class="jumbotron row page-header-x"><div class="container-fluid header-content-container"><div class="col-lg-12 header-content"><span id=header-version>{{ vm.version }}</span> <span id=header-logo>[ LOGO ]</span></div></div></header>'),t.put("common/components/page.collection/page-content/page-content.template.html",'<div class="row page-content"><div class=col-md-12><ng-transclude></ng-transclude></div></div>'),t.put("common/components/page.collection/page-footer/page-footer.template.html",'<footer class="row page-footer"><div class="col-md-12 page-footer-section"><a href=# class="fa fa-2x fa-twitter-square social-link" aria-hidden=true></a> <a href=# class="fa fa-2x fa-facebook-square social-link" aria-hidden=true></a> <a href=# class="fa fa-2x fa-instagram social-link" aria-hidden=true></a></div><div class=col-md-12>© 2017 Copyright: <a href=#>localhost</a></div></footer>')}]);
//# sourceMappingURL=../maps/scripts/app-a623f5576d.js.map