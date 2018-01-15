(function() {
    'use strict';

    angular.module('lib').service('Alerts', AlertsService);

    /** @ngInject */
    function AlertsService(_) {
        var srvc = this;
        srvc.data = [];

        srvc.addAlert = function(type, templateUrl, open, closeable, additionalClasses) {
            /* istanbul ignore next */
            open = (open !== undefined) ? open : false;
            /* istanbul ignore next */
            closeable = (closeable !== undefined) ? closeable : true;
            /* istanbul ignore next */
            additionalClasses = (additionalClasses !== undefined) ? additionalClasses : '';
            
            let alert = {
                id: this.data.length,
                type: type,
                show: open,
                templateUrl: templateUrl,
                additionalClasses: additionalClasses,
                closeable: closeable,
            };

            this.data.push(alert);

            let alertHandle = {
                open: function() {
                    alert.show = true;
                },

                close: function() {
                    alert.show = false;
                },

                remove: function() {
                    srvc.removeAlert(alert.id);
                },
            };

            return alertHandle;
        }

        srvc.removeAlert = function(id) {
            _.forEach(this.data, function(alert, i) {
                /* istanbul ignore else */
                if(alert.id === id) {
                    srvc.data.splice(i, 1);
                    return false;
                }
            });
        };

        srvc.openAlert = function(id) {
            _.forEach(this.data, function(alert) {
                /* istanbul ignore else */
                if(alert.id === id) {
                    alert.show = true;
                    return false;
                }
            });
        };

        srvc.closeAlert = function(id) {
            _.forEach(this.data, function(alert) {
                /* istanbul ignore else */
                if(alert.id === id) {
                    alert.show = false;
                    return false;
                }
            });
        };

        srvc.openAll = function() {
            _.map(this.data, function(alert) {
                alert.show = true;
            });
        };

        srvc.closeAll = function() {
            _.map(this.data, function(alert) {
                alert.show = false;
            });
        };

        srvc.removeAll = function() {
            this.data = [];
        };
    }
    
})();
