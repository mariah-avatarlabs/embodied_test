export default `
   varying vec2 vTextureCoord;
   uniform sampler2D uSampler;

   uniform vec2 resolution;
   uniform vec2 scanlineJitter;
   uniform vec2 threshold;
   uniform float delta;
   uniform float horizontalShake;


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

    //   vec2 treshhold = vec2(0.0, 0.95);


      // -- ANALOG GLITCH -- //

      vec2 _VerticalJump = vec2(0.0, 0.0);

      // Scan line jitter
      float jitter = nrand(v, delta) * 2.0 - 1.0;
      jitter *= step(scanlineJitter.y, abs(jitter)) * scanlineJitter.x;

      // Vertical jump
      float jump = lerp(v, frac(v + _VerticalJump.y), _VerticalJump.x);

      // Horizontal shake
      float shake = (nrand(delta, 2.0) - 0.5) * horizontalShake;  

      vec4 src1 = texture2D(uSampler, fract(vec2(u + jitter + shake, jump)));


      float below = step(threshold.x, vTextureCoord.y); 
      float below2 = step(vTextureCoord.y, threshold.y); 


      if(below == 1.0 && below2 == 1.0){
         gl_FragColor = src1;
      } else {
         gl_FragColor = color;
      }


   }

`
