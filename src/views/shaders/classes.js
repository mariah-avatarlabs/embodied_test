import * as PIXI from 'pixi.js'
import vShader from '../shaders/vertShader.js';


export default class FilterBeta {
    constructor(
        fragShader, 
        pixiAppObj, 
        uniforms = {}, 
        data = {},
        oscillate = false,
        animationObj = null
    ) {

        this.app = pixiAppObj;
        this.willOscillate = false;
        this.oscDeltaVal = 0;
        this.data = data;

        
        let defaultUniforms = {
            delta: 0,
            resolution: {
              type: 'v2',
              value: { 
                x: this.app.screen.width, 
                y: this.app.screen.height 
              }
            }
        };
        this.uniforms = { ...defaultUniforms, ...uniforms }

        this.filter = new PIXI.Filter(
            vShader, 
            fragShader, 
            this.uniforms
          );
    
        // this.animation = (cb = null) => {
        //     if(this.willOscillate){
        //         this.oscDeltaVal += 0.1;
        //         this.uniforms.delta = 
        //             0.5 + Math.sin(this.oscDeltaVal) * 0.5;

        //         // console.log('FPS: ', Math.ceil(this.app.ticker.FPS / 10) * 10)
        //     } else {
        //         this.uniforms.delta += 0.1;
        //     }
        //     // this.uniforms.delta = 0.5 + Math.sin(this.uniforms.delta) * 0.5;


        // }


    }

    resetDelta(){
        this.uniforms.delta = 0;
    }


}
