describe(/*@name*/ + '.view', function() {
    beforeEach(module(/*@module*/));

    var $controller, scope;

    beforeEach(inject(function(_$controller_, _$rootScope_) {
        $controller = _$controller_;
        scope = _$rootScope_.$new();
    }));
});
