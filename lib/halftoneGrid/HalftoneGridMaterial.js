"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HalftoneGridMaterial = void 0;
const ShaderPhongMaterial_vert_glsl_1 = __importDefault(require("../ShaderPhongMaterial.vert.glsl"));
const WavyGridMaterial_1 = require("../WavyGridMaterial");
const HalftoneGridMaterial_frag_glsl_1 = __importDefault(require("./HalftoneGridMaterial.frag.glsl"));
const three_1 = require("three");
/**
 * MaskMapをハーフトーン分解するマテリアル
 */
class HalftoneGridMaterial extends WavyGridMaterial_1.WavyGridMaterial {
    get radius() {
        return this.uniforms.radius.value;
    }
    set radius(value) {
        this.uniforms.radius.value = value;
    }
    constructor(parameters) {
        super((0, ShaderPhongMaterial_vert_glsl_1.default)(), (0, HalftoneGridMaterial_frag_glsl_1.default)(), parameters);
    }
    initUniforms() {
        this.uniforms = three_1.UniformsUtils.merge([
            WavyGridMaterial_1.WavyGridMaterial.getBasicUniforms(),
            {
                radius: { value: 0.75 },
            },
        ]);
    }
}
exports.HalftoneGridMaterial = HalftoneGridMaterial;
