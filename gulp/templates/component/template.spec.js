'use strict';

describe('/*@name_nq*/.view', function() {
    beforeEach(module(/*@module*/));

    var scope, ctrl;

    beforeEach(inject(function($componentController, $rootScope) {
        scope = $rootScope.new();
        ctrl = $componentController(/*@controller_wq*/, {
            $scope: scope,
        });
    }));
});
