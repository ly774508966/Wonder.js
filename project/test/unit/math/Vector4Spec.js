describe("Vector4", function(){
    var vec = null;
    var sandbox = null;
    var Vector4 = Engine3D.Math.Vector4;

    beforeEach(function(){
        vec = new Vector4(1,2,3,1);
        sandbox = sinon.sandbox.create();
    });

    describe("normalize", function(){
        it("normalize values", function(){
            vec.normalize();

            expect(mathMatcher.getValues(vec.values)).toEqual(
                [ 0.2581989, 0.5163978, 0.7745967, 0.2581989 ]
            );
        });
    });

    describe("toVec3", function(){
        it("convert to vector3", function(){
            var result = vec.toVec3();

            expect(mathMatcher.getValues(result.values)).toEqual(
                [1, 2, 3]
            );
        });
    });
});