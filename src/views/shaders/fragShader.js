export default `
   varying vec2 vTextureCoord;
   uniform sampler2D uSampler;

   uniform vec2 resolution;
   uniform float delta;
   uniform float deltaOG;


   float frac( float baseF ){
      return baseF - floor(baseF);
   }

   float lerp( float in1, float in2, float t )
   {
      return ((1.0 - t) * in1 + t * in2);
   }

   float nrand(float x, float y)
   {
      return frac(sin(dot(vec2(x, y), vec2(12.9898, 78.233))) * 43758.5453);
   }


   void main() 
   {
      vec4 color = texture2D(uSampler, vTextureCoord);
      vec2 st = gl_FragCoord.xy/resolution.xy;

      float u = vTextureCoord.x;
      float v = vTextureCoord.y;


      // -- ANALOG GLITCH -- //

      vec2 _ScanLineJitter = vec2(0.0085, 0.0035);
      float _HorizontalShake = 0.0065;
      vec2 _VerticalJump = vec2(0.0, 0.0);

      // Scan line jitter
      float jitter = nrand(v, delta) * 2.0 - 1.0;
      jitter *= step(_ScanLineJitter.y, abs(jitter)) * _ScanLineJitter.x;

      // Vertical jump
      float jump = lerp(v, frac(v + _VerticalJump.y), _VerticalJump.x);

      // Horizontal shake
      float shake = (nrand(delta, 2.0) - 0.5) * _HorizontalShake;  

      vec4 src1 = texture2D(uSampler, fract(vec2(u + jitter + shake, jump)));
      // src1.a = color.a;

      float below = step(0.25, vTextureCoord.y); 
      float below2 = step(vTextureCoord.y, 0.35); 

      if(below == 1.0 && below2 == 1.0){
         gl_FragColor = src1;
      } else {
         gl_FragColor = color;
      }


   }

`
