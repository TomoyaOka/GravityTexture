 uniform vec2 uResolution;
 uniform vec2 uImageResolution;
 uniform vec3 uMouse;
 uniform sampler2D disp;
 uniform sampler2D uTexture;

 uniform float uProgress;
 uniform float uTime;
 uniform float uSize;

 varying vec2 vUv;
 varying vec3 vPosition;


 float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}


void main() {

    //aspect
    vec2 ratio = vec2(
        min((uResolution.x / uResolution.y) / (uImageResolution.x / uImageResolution.y), 1.0),
        min((uResolution.y / uResolution.x) / (uImageResolution.y / uImageResolution.x), 1.0)
    );

    vec2 uv = vec2(
        vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
        vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );

    //mouse
    vec2 direction = normalize(vPosition.xy - uMouse.xy);
    float dist = length(vPosition - uMouse);

    float prox = uSize - map(dist,0.0,0.2,0.0,1.0);

    prox = clamp(prox,0.0,1.0);
    

    //noise-map
    vec4 disp = texture2D(disp, uv);
    vec2 dispVector = vec2(disp.x,disp.y);

    //zoom
    vec2 zoom = uv + direction * prox * uProgress;
    //zoom + noise
    vec2 zoomUv = mix(uv , uMouse.xy + vec2(0.4),prox * uProgress * sin(uv.x + uTime + dispVector));
  
    //rgb_shift
    vec2 shift = 0.03 * direction * prox * uProgress;
    float r = texture2D(uTexture, zoomUv + shift).r;
    float g = texture2D(uTexture, zoomUv + shift * 0.0003).g;
    float b = texture2D(uTexture, zoomUv).b;

    vec4 texColor = vec4(r,g,b,1.);
    

    gl_FragColor = texColor;
    // gl_FragColor = vec4(dist,dist,dist,1.);
}