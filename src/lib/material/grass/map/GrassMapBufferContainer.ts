module wd {
    export class GrassMapBufferContainer extends CommonBufferContainer{
        public static create(entityObject:GameObject) {
            var obj = new this(entityObject);

            return obj;
        }

        public geometryData:GrassMapGeometryData;

        private _quadIndexBuffer:ArrayBuffer = null;

        public createBuffersFromGeometryData(){
            super.createBuffersFromGeometryData();

            this.getChild(EBufferDataType.CUSTOM, "quadIndices");
        }

        public getBufferForRenderSort():Buffer{
            var buffer = this.getChild(EBufferDataType.VERTICE);

            if(!buffer){
                return null;
            }

            return buffer;
        }

        @cacheBufferForBufferContainer()
        protected getCustomData(dataName:string){
            var geometryData = this.geometryData[dataName];

            if(!this.hasData(geometryData)){
                return null;
            }

            this.createOnlyOnceAndUpdateArrayBuffer("_quadIndexBuffer", geometryData, 1);

            return this._quadIndexBuffer;
        }
    }
}


