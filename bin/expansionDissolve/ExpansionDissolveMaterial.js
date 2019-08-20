import { UniformsUtils, Color } from "three";
import { ShaderPhongMaterial } from "../index";
import { TilingFBMChunk } from "../index";
import VertexShader from "./ExpansionDissolveMaterial.vert.glsl";
import FragmentShader from "./ExpansionDissolveMaterial.frag.glsl";
import { AnimationChunk } from "../index";
import { MapChunk } from "../chunk/MapChunk";
/**
 * FBMノイズによるジオメトリの膨張でディゾルブを行うマテリアル。
 * 爆発しながら消滅するような表現になる。
 * 膨張の進行度合いはprogressで制御する。
 */
export class ExpansionDissolveMaterial extends ShaderPhongMaterial {
    /**
     *
     * @param parameters
     */
    constructor(parameters) {
        super(VertexShader(), FragmentShader(), parameters);
        // IAnimatable //
        this.speed = -0.5;
        this.isAnimate = true;
    }
    // IMap //
    get map() {
        return MapChunk.getMap(this);
    }
    set map(val) {
        MapChunk.setMap(this, val);
    }
    addTime(delta) {
        if (this.isAnimate) {
            AnimationChunk.addTime(this, delta);
        }
    }
    // ITiledFBM //
    get tiles() {
        return this.uniforms.tiles.value;
    }
    set tiles(value) {
        this.uniforms.tiles.value = value;
    }
    get hashLoop() {
        return this.uniforms.hashLoop.value;
    }
    set hashLoop(value) {
        this.uniforms.hashLoop.value = value;
    }
    get amp() {
        return this.uniforms.amp.value;
    }
    set amp(value) {
        this.uniforms.amp.value = value;
    }
    get scaleMax() {
        return this.uniforms.scaleMax.value;
    }
    set scaleMax(value) {
        this.uniforms.scaleMax.value = value;
    }
    get time() {
        return this.uniforms.time.value;
    }
    set time(value) {
        this.uniforms.time.value = value;
    }
    get progress() {
        return this.uniforms.progress.value;
    }
    set progress(value) {
        this.uniforms.progress.value = value;
    }
    get dissolveColor() {
        return this.uniforms.dissolveColor.value;
    }
    set dissolveColor(value) {
        this.uniforms.dissolveColor.value = value;
    }
    get dissolveOutColor() {
        return this.uniforms.dissolveOutColor.value;
    }
    set dissolveOutColor(value) {
        this.uniforms.dissolveOutColor.value = value;
    }
    initUniforms() {
        this.uniforms = UniformsUtils.merge([
            ShaderPhongMaterial.getBasicUniforms(),
            TilingFBMChunk.getUniform(),
            MapChunk.getUniform(),
            {
                scaleMax: { value: 20.0 },
                time: { value: 0.0 },
                progress: { value: 0.0 },
                dissolveColor: { value: new Color(1.0, 1.0, 1.0) },
                dissolveOutColor: { value: new Color(0.0, 0.0, 0.0) }
            }
        ]);
    }
    initChunks() {
        super.initChunks();
        TilingFBMChunk.registerChunk();
        MapChunk.registerChunk();
    }
    initDefines() {
        super.initDefines();
        this.defines = Object.assign(this.defines, TilingFBMChunk.getDefines());
        this.defines.USE_EXPANSION = true;
    }
}