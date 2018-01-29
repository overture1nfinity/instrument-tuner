'use strict';

describe('/*@name_nq*/.directive', function() {
    var _$compile;
    var scope, ctrl;
    
    beforeEach(module(/*@module*/));
    beforeEach(inject(function($compile, $rootScope) {
        _$compile = $compile;
        scope = $rootScope.$new();
        ctrl = $controller(/*@controller_wq*/, {
            $scope: scope,
        });
    }));

    function compileEl() {
        var el = angular.element('<div /*@name_nq*/></div>');

        _$compile(el)(scope);
        scope.$digest();

        return el;
    }



    it('should append to DOM successfully', function() {
        var el = compileEl();

        document.body.appendChild(el[0]);
        expect(document.querySelector('[/*@name_nq*/]')).toBeDefined();
    });
});
