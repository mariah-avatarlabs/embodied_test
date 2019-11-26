export default `
   varying vec2 vTextureCoord;
   uniform sampler2D uSampler;
   uniform float delta;


   float frac( float baseF ){
      return baseF - floor(baseF);
   }

   void main() 
   {
      vec4 color = texture2D(uSampler, vTextureCoord);

      float u = vTextureCoord.x;
      float v = vTextureCoord.y;
         
      // -- LIGHT SHADER -- //

      vec3 colorA = vec3(0.0);
      vec3 colorB = vec3(0.0);

      float scanTimeDuration = delta / 15.0;


      // Horizontal shake
      float shake = 0.025;        

      float below = step((0.0 + scanTimeDuration), vTextureCoord.y); 
      float below2 = step(vTextureCoord.y, (scanTimeDuration + 0.05)); 

      colorA = vec3(below * below2);

      if( colorA.r != 0.0) {
         // colorA = vec3( mix(colorA, vec3(color.r, color.g, color.b), sin( frac(delta + 0.75) + vec3(0.25) ) ));
         colorA = vec3( mix(colorA, vec3(color.r, color.g, color.b), vec3(0.25)) );

         vec4 src1 = texture2D(uSampler, fract(vec2(u + shake, vTextureCoord.y)));
         gl_FragColor =  src1;

      }

      if( colorA.r == 0.0 ) {
         colorA = vec3(color.r, color.g, color.b);
         gl_FragColor =  vec4(colorA, color.a);

      } 

    


   }

`
