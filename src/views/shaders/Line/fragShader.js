    
    export default `
    varying vec2 vTextureCoord;
    uniform sampler2D uSampler;
    uniform vec2 resolution;
    uniform vec2 opacity;
    uniform float delta;
 
    // https://www.shadertoy.com/view/XtK3W3 


    float frac( float baseF ){
        return baseF - floor(baseF);
    }

    void main() 
    {
       vec4 color = texture2D(uSampler, vTextureCoord);
 
       float u = vTextureCoord.x;
       float v = vTextureCoord.y;
               

       // -- LINE SHADER - HORIZ-- //
    //    if (floor( mod((vTextureCoord.y / (frac(delta) / 0.5)) * 250.0, 2.0)) == 0.0)
    //    {
    //         color.rgb *= 1.0 - (0.25 * 0.975);
    //    }

    
   if ( floor( mod( sin(vTextureCoord.y / frac(delta) * 1.11 ) * 250.0, 2.0)) == 0.0)
    {
            // color.rgb *= 0.75;
            color.rgb *= 1.0 - (0.25 * opacity.x);
        }       

       // -- LINE SHADER - VERT-- //
       if (floor( mod((vTextureCoord.x) * 350.0, 2.5)) == 0.0)
       {
            color.rgb *= 1.0 - (0.25 * opacity.y);
       }    
 
       gl_FragColor = color;
     
 
 
    }
 
 `
 
    
    // Apply a line pattern every 4 pixels
