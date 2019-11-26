export default `
   varying vec2 vTextureCoord;
   uniform sampler2D uSampler;
   uniform sampler2D uTextureOne;
   
   uniform float delta;


    float frac( float baseF ){
        return baseF - floor(baseF);
    }

   void main() 
   {
        vec4 color = texture2D(uSampler, vTextureCoord);
        vec4 glitch = texture2D(uTextureOne, vTextureCoord);

        float u = vTextureCoord.x;
        float v = vTextureCoord.y;

        // to uniform
        float _Intensity = 0.00125;

            
        // -- DIGITAL SHADER -- //
        
        float thresh = 1.001 - _Intensity * 1.0;
        float w_d = step(thresh, pow(glitch.z, 0.25)); // displacement glitch
        float w_f = step(thresh, pow(glitch.w, .00025)); // frame glitch
        float w_c = step(thresh, pow(glitch.z, 3.5)); // color glitch

        // Displacement.
        vec2 uv = vec2(vTextureCoord.xy + glitch.xy * w_d);
        vec4 source = texture2D(uSampler, uv);


        color.r = 1.0;
        gl_FragColor = source;
    


   }

`
