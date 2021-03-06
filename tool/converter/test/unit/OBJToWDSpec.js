var fs = require("fs-extra"),
    Converter = require("../../dist/converter/obj/OBJToWD"),
    path = require("path"),
    sinon = require("sinon");

require("jasmine-before-all");

describe("OBJToWD", function () {
    var sandbox = null;
    var converter = null;
    var testFile1, testFile2;
    var testFile3;
    var filePath1,filePath2;
    var filePath3;


    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        converter = Converter.OBJToWD.create("0.1.0");
    });
    afterEach(function () {
        sandbox.restore();
    });
    beforeAll(function () {
        filePath1 = path.join(process.cwd(), "tool/converter/test/res/test.obj");
        filePath2 = path.join(process.cwd(), "tool/converter/test/res/test2.obj");
        filePath3 = path.join(process.cwd(), "tool/converter/test/res/noMtl.obj");

        testFile1 = fs.readFileSync(filePath1);
        testFile2 = fs.readFileSync(filePath2);
        testFile3 = fs.readFileSync(filePath3);
    });

    function judge(file, filePath, assertion, done){
        converter.convert(file.toString(), filePath)
            .subscribe(function(arr){
                var json = arr[0],
                    sourceUrlArr = arr[1];

                assertion(json, sourceUrlArr);
            }, null, function(){
                done();
            })
    }

    it("convert metadata", function (done) {
        judge(testFile1, filePath1, function(json){
            expect(json.metadata).toEqual({
                formatVersion: '0.1.0',
                description: '',
                sourceFile: filePath1,
                generatedBy: 'OBJToWD'
            });
        }, done);
    });
    it("convert scene", function (done) {
        judge(testFile1, filePath1, function(json){
            expect(json.scene).toEqual({
                ambientColor: [0, 0, 0]
            });
        }, done);
    });

    describe("convert objects. object container has whole vertex data, each object has verticeIndices and normalIndices? , uvIndices?", function () {
        it("read normals from file", function (done) {
            judge(testFile1, filePath1, function(json){
                expect(json.objects).toEqual(
                    [{
                        children: [{
                            name: 'model1',
                            material: 'material1',
                            verticeIndices: [0, 3, 1, 0, 1, 2, 0, 1, 2, 0, 2, 3],
                            normalIndices: [1, 2, 3, 1, 3, 0, 5, 2, 1, 5, 1, 0],
                            uvIndices: [2, 1, 0, 2, 0, 3, 2, 0, 2, 2, 2, 3],
                            morphTargets: []
                        }, {
                            name: 'model2',
                            material: 'material2',
                            verticeIndices: [0, 2, 1, 0, 1, 3],
                            normalIndices: [3, 2, 1, 3, 1, 0],
                            uvIndices: [0, 1, 2, 0, 2, 3],
                            morphTargets: []
                        }],
                        name: 'test',
                        vertices: [1, -1, -1, 1, -1, 1, -1, -1, 1, -1, -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, -1, 1, -1, 1, -1, -1, 1, -1, -1, -1],
                        normals: [-1, -1, -1, -1, -1, 1, 1, -1, 1, 1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1, -1, -1, -1],
                        uvs: [0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1],
                        colors: []
                    }]
                );
            }, done);
        });
        it("if no normals, not compute it", function (done) {
            judge(testFile2, filePath2, function(json){
                expect(json.objects).toEqual(
                    [{
                        children: [{
                            name: 'model1',
                            material: 'material1',
                            verticeIndices: [0, 3, 1, 0, 1, 2],
                            normalIndices: [],
                            uvIndices: [2, 1, 0, 2, 0, 3],
                            morphTargets: []
                        }, {
                            name: 'model3',
                            material: 'material3',
                            verticeIndices: [0, 2, 1, 0, 1, 3],
                            normalIndices: [],
                            uvIndices: [0, 1, 2, 0, 2, 3],
                            morphTargets: []
                        }],
                        name: 'test2',
                        vertices: [10, -1, -1, 1, -1, 1, -1, -1, 1, -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1, -1, -1, -1],
                        normals: [],
                        uvs: [0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1],
                        colors: []
                    }]
                );

                done();
            }, done);
        });
        it("support no mtl file", function (done) {
            judge(testFile3, filePath3, function(json){
                expect(json.objects.length).toEqual(1);
                expect(json.objects).toEqual(
                    [
                        {
                            children: [{
                                name: null,
                                material: null,
                                verticeIndices: [-1, 0, 1],
                                normalIndices: [0, 1, -1],
                                uvIndices: [0, -1, 1],
                                morphTargets: []
                            }],
                            name: 'noMtl',
                            vertices: [0.061043, 0.025284, 0.03449, 0.011829, 0.022302, 0.083267, -0.058528, 0.017917, 0.083267],
                            normals: [0.912731, 0.155721, 0.377721, 0.912731, 0.155721, 0.377721, 0.912731, 0.155721, 0.377721],
                            uvs: [0.131375, 0.762327, 0.437504, 0.96342, 0.086658, 0.708747],
                            colors: []
                        }
                    ]
                );
            }, done);
        });
    });

    it("convert materials", function(done){
        judge(testFile1, filePath1, function(json, resourceUrlArr){
            expect(json.materials).toEqual(
                {
                    material1: {
                        type: 'LightMaterial',
                        diffuseColor: ['0.100000', '0.200000', '0.300000'],
                        specularColor: ['0.500000', '0.500000', '0.500000'],
                        diffuseMapUrl: '1.jpg',
                        specularMapUrl: null,
                        normalMapUrl: './resource/2.png',
                        shininess: 96.078431,
                        opacity: 0.1
                    },
                    material2: {
                        type: 'LightMaterial',
                        diffuseColor: ['0.300000', '0.200000', '0.100000'],
                        specularColor: ['0.800000', '0.500000', '0.600000'],
                        diffuseMapUrl: null,
                        specularMapUrl: '1.jpg',
                        normalMapUrl: null,
                        shininess: 80.078431,
                        opacity: 0.5
                    }
                }
            );
            filePath1 = path.join(process.cwd(), "tool/converter/test/res/test.obj");

            expect(resourceUrlArr).toEqual(
                [
                    path.resolve(path.dirname(filePath1), "1.jpg"),
                    path.resolve(path.dirname(filePath1), "./resource/2.png")
                ]
            );

            done();
        }, done);
    });
});

