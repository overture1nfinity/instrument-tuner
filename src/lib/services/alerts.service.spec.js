'use strict';

describe('alerts.service', function() {
    var srvc = undefined;

    beforeEach(function() {
        module('lib');
        inject(function(Alerts) {
            var mockAlerts = Object.assign({}, Alerts);

            mockAlerts.addAlertLite = function(id, open) {
                this.data.push({
                    id: id,
                    show: open || false,
                });
            };

            srvc = mockAlerts;
        });
    });



    describe('initial', function() {
        it('should inject service for testing', function() {
            expect(srvc).toBeDefined();
        });
    });



    describe('addAlert()', function() {
        it('should add alert successfully', function() {
            var type = 'danger';
            var templateUrl = 'url/to/template';
    
            expect(srvc.data.length).toEqual(0);
            var alertHandle = srvc.addAlert(type, templateUrl);
            expect(srvc.data.length).toEqual(1);
        });
    
        it('should return valid alert handle object', function() {
            var type = 'danger';
            var templateUrl = 'url/to/template';
            var alertHandle = srvc.addAlert(type, templateUrl);
    
            expect(alertHandle).toBeDefined();
            expect(srvc.data[0]).toBeDefined();
            alertHandle.open();
            expect(srvc.data[0].show).toBe(true);
            alertHandle.close();
            expect(srvc.data[0].show).toBe(false);
            alertHandle.remove();
            expect(srvc.data.length).toEqual(0);
        });
    });



    describe('alert by id functions', function() {
        it('should remove alert', function() {
            var id = 1;
            
            srvc.addAlertLite(id);
            expect(srvc.data.length).toEqual(1);
            srvc.removeAlert(id);
            expect(srvc.data.length).toEqual(0);
        });
    
        it('should open alert', function() {
            var id = 1;
            
            srvc.addAlertLite(id);
            expect(srvc.data.length).toEqual(1);
            expect(srvc.data[0].show).toBe(false);
            srvc.openAlert(id);
            expect(srvc.data[0].show).toBe(true);
        });
    
        it('should close alert', function() {
            var id = 1;
            
            srvc.addAlertLite(id, true);
            expect(srvc.data.length).toEqual(1);
            expect(srvc.data[0].show).toBe(true);
            srvc.closeAlert(id);
            expect(srvc.data[0].show).toBe(false);
        });
    });



    describe('functions pertaining to all alerts', function() {
        it('should open all alerts', function() {
            srvc.addAlertLite(1);
            srvc.addAlertLite(2);
            srvc.addAlertLite(3);

            expect(srvc.data.length).toEqual(3);
            srvc.openAll();
            
            srvc.data.forEach(alert => {
                expect(alert.show).toBe(true);
            });
        });
    
        it('should close all alerts', function() {
            srvc.addAlertLite(1, true);
            srvc.addAlertLite(2, true);
            srvc.addAlertLite(3, true);

            expect(srvc.data.length).toEqual(3);
            srvc.closeAll();
            
            srvc.data.forEach(alert => {
                expect(alert.show).toBe(false);
            });
        });
    
        it('should remove all alerts', function() {
            srvc.addAlertLite(1);
            srvc.addAlertLite(2);
            srvc.addAlertLite(3);

            expect(srvc.data.length).toEqual(3);
            srvc.removeAll();
            expect(srvc.data.length).toEqual(0);
        });
    });
});
