import { GridMaterial } from "../GridMaterial";
import { HexGridChunk } from "../index";
import FragmentShader from "./HexDissolveMaterial.frag.glsl";
import { Color, UniformsUtils } from "three";
/**
 * 六角形グリッドマテリアル
 */
export class HexDissolveMaterial extends GridMaterial {
    /**
     * ディゾルブの進行度を指定する。
     * 1.0でディゾルブ完了となる。
     */
    get progress() {
        return this.uniforms.progress.value;
    }
    set progress(value) {
        this.uniforms.progress.value = value;
    }
    /**
     * ディゾルブの開始ずれを指定する。
     * 最後にディゾルブが始まるグリッドが、progressのどの値で開始されるかを意味する。
     * ex)
     * delay = 0.8の時、最後のグリッドはprogress = 0.8 ~ 1.0でディゾルブする。
     */
    get delay() {
        return this.uniforms.delay.value;
    }
    set delay(value) {
        this.uniforms.delay.value = value;
    }
    get isAscending() {
        return this.uniforms.isAscending.value;
    }
    set isAscending(value) {
        this.uniforms.isAscending.value = value;
    }
    /**
     * グリッド線の太さ
     * 0.0で線なし、0.5でグリッド面なしになる。
     */
    get gridWeight() {
        return this.uniforms.gridWeight.value;
    }
    set gridWeight(value) {
        this.uniforms.gridWeight.value = value;
    }
    get gridEmissive() {
        return this.uniforms.gridEmissive.value;
    }
    set gridEmissive(value) {
        this.uniforms.gridEmissive.value = value;
    }
    /**
     * ディゾルブ中に表示されるグローラインの太さ
     * 数値はグリッド線の太さの倍率、2.0ならグローアウトラインはディゾルブラインの倍の太さになる。
     *
     * 注意 : isReversed = true かつgridEmissiveWeightが2.0以下の場合、グロー線が消えなくなる。
     * 反転させる場合は、2.0以上を指定すること。
     */
    get gridEmissiveWeight() {
        return this.uniforms.gridEmissiveWeight.value;
    }
    set gridEmissiveWeight(value) {
        this.uniforms.gridEmissiveWeight.value = value;
    }
    constructor(parameters) {
        super(null, FragmentShader(), parameters);
    }
    initUniforms() {
        this.uniforms = UniformsUtils.merge([
            GridMaterial.getBasicUniforms(),
            {
                progress: { value: 0.0 },
                delay: { value: 0.8 },
                gridWeight: { value: 0.0 },
                isAscending: { value: true },
                gridEmissive: { value: new Color(0x000000) },
                gridEmissiveWeight: { value: 2.5 },
            },
        ]);
    }
    initChunks() {
        super.initChunks();
        HexGridChunk.registerChunk();
    }
}
