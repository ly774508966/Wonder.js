describe("DiffuseMapShaderLib", function () {
    var sandbox = null;
    var Lib = null;
    var lib = null;
    var cmd,program,material;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        Lib = wd.DiffuseMapShaderLib;
        lib = new Lib();

        material = wd.LightMaterial.create();
        cmd = new wd.QuadCommand();
        program = new wd.Program();

        sandbox.stub(wd.DeviceManager.getInstance(), "gl", testTool.buildFakeGl(sandbox));
    });
    afterEach(function () {
        testTool.clearInstance(sandbox);
        sandbox.restore();
    });

    describe("sendShaderVariables", function() {
        beforeEach(function () {
            sandbox.stub(cmd, "buffers", {
                getChild: sandbox.stub().returns([])
            });

            sandbox.stub(program, "sendAttributeBuffer");
            sandbox.stub(program, "sendUniformData");
        });

        describe("if diffuseMap is BasicTexture", function(){
            beforeEach(function(){
                material.diffuseMap = wd.ImageTexture.create({});
            });

            it("send diffuseMapSourceRegion", function () {
                material.diffuseMap.sourceRegion = wd.RectRegion.create(0,64,100,200);
                material.diffuseMap.sourceRegionMethod = wd.ETextureSourceRegionMethod.CHANGE_TEXCOORDS_IN_GLSL;

                lib.sendShaderVariables(program, cmd, material);

                expect(program.sendUniformData).toCalledWith("u_diffuseMapSourceRegion", wd.EVariableType.VECTOR_4, material.diffuseMap.sourceRegionForGLSL);
            });
            it("send diffuseMapRepeatRegion", function () {
                material.diffuseMap.repeatRegion = wd.RectRegion.create(0,64,100,200);

                lib.sendShaderVariables(program, cmd, material);

                expect(program.sendUniformData).toCalledWith("u_diffuseMapRepeatRegion", wd.EVariableType.VECTOR_4, material.diffuseMap.repeatRegion);
            });
        });

        describe("if diffuseMap is ProceduralTexture, send the default value", function(){
            beforeEach(function(){
                material.diffuseMap = wd.MarbleProceduralTexture.create();
            });

            it("send diffuseMapSourceRegion", function () {
                lib.sendShaderVariables(program, cmd, material);

                expect(program.sendUniformData).toCalledWith("u_diffuseMapSourceRegion", wd.EVariableType.VECTOR_4, wd.RectRegion.create(0, 0, 1, 1));
            });
            it("send diffuseMapRepeatRegion", function () {
                lib.sendShaderVariables(program, cmd, material);

                expect(program.sendUniformData).toCalledWith("u_diffuseMapRepeatRegion", wd.EVariableType.VECTOR_4, wd.RectRegion.create(0, 0, 1, 1));
            });
        });
    });

    describe("setShaderDefinition", function(){
        var uniformVariableArr;

        beforeEach(function(){
            sandbox.stub(lib, "addUniformVariable");

            lib.setShaderDefinition(cmd, material);

            uniformVariableArr = lib.addUniformVariable.args[0][0];
        });

        it("send u_diffuseMapSampler", function(){
            expect(uniformVariableArr.indexOf("u_diffuseMapSampler") > -1).toBeTruthy();
        });
        it("send u_diffuseMapSourceRegion", function(){
            expect(uniformVariableArr.indexOf("u_diffuseMapSourceRegion") > -1).toBeTruthy();
        });
        it("send u_diffuseMapRepeatRegion", function(){
            expect(uniformVariableArr.indexOf("u_diffuseMapRepeatRegion") > -1).toBeTruthy();
        });
    });
});

