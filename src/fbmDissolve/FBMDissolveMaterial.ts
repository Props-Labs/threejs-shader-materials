import { ShaderPhongMaterial } from "..";
import VertexShader from "../ShaderPhongMaterial.vert.glsl";
import { ITiledFBM, TilingFBMChunk } from "../chunk";
import FragmentShader from "./FBMDissolveMaterial.frag.glsl";
import { Color, ShaderMaterialParameters, UniformsUtils } from "three";

export class FBMDissolveMaterial
  extends ShaderPhongMaterial
  implements ITiledFBM
{
  get tiles(): number {
    return this.uniforms.tiles.value;
  }
  set tiles(value: number) {
    this.uniforms.tiles.value = value;
  }
  get hashLoop(): number {
    return this.uniforms.hashLoop.value;
  }
  set hashLoop(value: number) {
    this.uniforms.hashLoop.value = value;
  }
  get amp(): number {
    return this.uniforms.amp.value;
  }
  set amp(value: number) {
    this.uniforms.amp.value = value;
  }

  get progress(): number {
    return this.uniforms.progress.value;
  }
  set progress(value: number) {
    this.uniforms.progress.value = value;
  }

  get edgeWeight(): number {
    return this.uniforms.edgeWeight.value;
  }
  set edgeWeight(value: number) {
    this.uniforms.edgeWeight.value = value;
  }

  get edgeColor(): Color {
    return this.uniforms.edgeColor.value;
  }
  set edgeColor(value: Color) {
    this.uniforms.edgeColor.value = value;
  }

  /**
   *
   * @param parameters
   */
  constructor(parameters?: ShaderMaterialParameters) {
    super(VertexShader(), FragmentShader(), parameters);
  }

  protected initUniforms(): void {
    this.uniforms = UniformsUtils.merge([
      ShaderPhongMaterial.getBasicUniforms(),
      TilingFBMChunk.getUniform(),
      {
        progress: { value: 0.0 },
        edgeWeight: { value: 0.1 },
        edgeColor: { value: new Color(1.0, 1.0, 1.0) },
      },
    ]);
  }

  protected initChunks(): void {
    super.initChunks();
    TilingFBMChunk.registerChunk();
  }

  /**
   * definesを初期化する。
   */
  protected initDefines(): void {
    super.initDefines();
    this.defines = Object.assign({}, TilingFBMChunk.getDefines(), this.defines);
  }

  protected initDefaultSetting(parameters?: ShaderMaterialParameters): void {
    super.initDefaultSetting(parameters);

    if (parameters.transparent == null) {
      this.transparent = true;
    } else {
      this.transparent = parameters.transparent;
    }
  }
}
