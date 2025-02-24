/**
 * 6角形グリッドでディゾルブを行うフラグメントシェーダー
 * {@link https://qiita.com/edo_m18/items/37d8773a5295bc6aba3d}
 */
export default () => {
  // language=GLSL
  return `
#define PHONG

#include <mesh_phong_uniform>
varying vec2 uvPosition;
#include <mesh_position_varying>

//user settings
#include <repeat_pattern_uniform_chunk>
#include <mask_map_uniform_chunk>
#include <reversible_uniform_chunk>
uniform float progress;
uniform float delay;
uniform float gridWeight;
uniform bool isAscending;

uniform vec3 gridEmissive;
uniform float gridEmissiveWeight;
#include <hex_grid_function_chunk>

#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
// #include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
float reverse( float val, bool isReversed){
  return isReversed ? 1.0 - val : val;
}
void main() {
    #include <clipping_planes_fragment>
  
    #include <mesh_phong_diffuse_color>
    
    #include <logdepthbuf_fragment>
    #include <__ShaderMaterial__map_fragment_begin_chunk>
    #include <map_fragment>
    #include <color_fragment>

    #include <repeat_pattern_fragment_chunk>    
    vec4 hc = hexCoords( uv );
    vec2 id = hc.zw;

    #include <mask_map_fragment_chunk>
  
    float range = 1.0 - delay;
    float rateY = isAscending 
      ? ( division-id.y ) / division
      : id.y  / division;
  
    float currentProgress = progress - (rateY * delay);
    currentProgress /= range;
    currentProgress = clamp( currentProgress, 0.0, 1.0);
  
    float w = gridWeight + currentProgress / 2.0 + (1.0 - mask);
    w = clamp( w, 0.0, 1.0);
    float margin = clamp ( w * 0.33, 0.00, 0.02 );
  
    float gridLine = smoothstep(w, w + margin, hc.y);
    gridLine =  reverse ( gridLine , isReversed);
    diffuseColor.a *= gridLine ;
    
    float emmesiveWeight = currentProgress / 2.0 * gridEmissiveWeight;
    emmesiveWeight =  reverse ( emmesiveWeight, isReversed );
    float emissiveVal = smoothstep(emmesiveWeight, emmesiveWeight + margin, hc.y);
    emissiveVal = 1.0 - emissiveVal;
    diffuseColor.rgb += gridEmissive * emissiveVal;

    #include <mesh_phong_switching_alpha_map>

    // #include <alphamap_fragment>
    #include <alphatest_fragment>
    #include <specularmap_fragment>
    #include <normal_fragment_begin>
    #include <normal_fragment_maps>
    #include <emissivemap_fragment>
    // accumulation
    #include <lights_phong_fragment>
    #include <lights_fragment_begin>
    #include <lights_fragment_maps>
    #include <lights_fragment_end>
    // modulation
    #include <aomap_fragment>
    vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
    #include <envmap_fragment>
    #include <output_fragment>
    #include <tonemapping_fragment>
    #include <encodings_fragment>
    #include <fog_fragment>
    #include <premultiplied_alpha_fragment>
    #include <dithering_fragment>
}`;
};
