export default `
   varying vec2 vTextureCoord;
   uniform sampler2D uSampler;
   uniform sampler2D uTextureOne;
   uniform float delta;

   void main() 
   {
        vec4 color = texture2D(uSampler, vTextureCoord);
    	vec4 two = texture2D(uTextureOne, vTextureCoord);

        float u = vTextureCoord.x;
        float v = vTextureCoord.y;
            
        // -- DIGITAL SHADER -- //
        // color.r = 1.0;
        
        if(two.r == 1.0){
            color.a = 1.0;
        }

        if(two.r > 0.0){
            color.a = 0.0;
        }        

        gl_FragColor = color;
    


   }

`
