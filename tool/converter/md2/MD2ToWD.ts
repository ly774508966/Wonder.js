import fs = require("fs");
import path = require("path");
import wdFrp = require("wdfrp");
import wdCb = require("wdcb");
import Log = require("../../ts/Log");
import ModelLoaderUtils = require("../common/ModelLoaderUtils");
import ObjectsConverter = require("./MD2ObjectsConverter");
import contract = require("../../ts/definition/typescript/decorator/contract");
import chai = require("chai");

var describe = contract.describe,
    it = contract.it,
    requireInNodejs = contract.requireInNodejs,
    requireGetter = contract.requireGetter,
    requireSetter = contract.requireSetter,
    requireGetterAndSetter = contract.requireGetterAndSetter,
    ensure = contract.ensure,
    ensureGetter = contract.ensureGetter,
    ensureSetter = contract.ensureSetter,
    ensureGetterAndSetter = contract.ensureGetterAndSetter,
    invariant = contract.invariant;

var expect = chai.expect;

export class MD2ToWD {
    public static create(version:string) {
        var obj = null;

        obj = new this(version);

        return obj;
    }

    constructor(version:string) {
        this.version = version;
    }

    public name:string = "MD2ToWD";
    public version:string = null;

    private _objectsConverter:any = ObjectsConverter.create();

    @ensure(function(stream:wdFrp.Stream){
        it("should return stream", () => {
            expect(stream).instanceOf(wdFrp.Stream);
        });
    })
    public convert(fileBuffer:Buffer, filePath:string):wdFrp.Stream {
        var self = this,
            resultJson:any = {};

        resultJson.metadata = self._convertMetadata(filePath);
        resultJson.scene = {};
        resultJson.objects = self._convertObjects(fileBuffer, filePath);
        resultJson.materials = {};

        return wdFrp.just([resultJson]);
    }

    private _convertMetadata(filePath:string) {
        var result:any = {};

        result.formatVersion = this.version;
        result.description = "";
        result.sourceFile = filePath;
        result.generatedBy = this.name;

        return result;
    }

    private _convertObjects(fileBuffer:Buffer, filePath:string) {
        return this._objectsConverter.convert(fileBuffer, filePath);
    }
}

