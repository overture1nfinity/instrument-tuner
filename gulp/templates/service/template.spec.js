'use strict';

describe('/*@name_nq*/.factory', function() {
    beforeEach(module(/*@module*/));

    var srvc;

    beforeEach(inject(function(/*@name_nq*/) {
        srvc = /*@name_nq*/;
    }));



    it('should inject service successfully', inject(function(/*@name_nq*/) {
        expect(srvc).toBeDefined();
        expect(srvc).toEqual(/*@name_nq*/);
    }));
});
