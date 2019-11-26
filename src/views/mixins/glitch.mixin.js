import * as PIXI from 'pixi.js'
import { gsap } from "gsap";

import lineFragShader from '../shaders/Line/fragShader.js'
import lightFragShader from '../shaders/LightBeam/fragShader.js'
import analogGlitchFragShader from '../shaders/AnalogGlitch/fragShader.js'
import digitalGlitchFragShader from '../shaders/DigitalGlitch/fragShader.js'

import FilterBeta from '../shaders/classes.js';

import digitalGlitchMask from '../../assets/images/mask_alpha.png';


export const glitch = {
    data(){
      return {
        filters: {
          light: null,
          line: null,
          analogGlitch: null,
          digitalGlitch: null
        }
      }
    },

    computed: {
      lightFilterObj(){
          return this.filters.light
      },

      lineFilterObj(){
        return this.filters.line
      },

      analogGlitchFilterObj(){
        return this.filters.analogGlitch
      },    
      
      digitalGlitchFilterObj(){
        return this.filters.digitalGlitch
      },          

    },

    mounted: function() {
    },

    methods: {

      initLightFilter(){
        
        let lightShader = new FilterBeta(
          lightFragShader, 
          this.pixiApp,
          {},
          { isActive: false }
        );
  
        // lightShader.reset = () => {
        //   lightShader.uniforms.delta = 0;
        // }
  
        return lightShader;
  
      },

      initAnalogGlitchFilter(){

        let analogGlitchFilter = new FilterBeta(
          analogGlitchFragShader, 
          this.pixiApp,
          {
            threshold: {
              x: 0.0, 
              y: 0.0
            },
            scanlineJitter: {
              x: 0.0085,
              y: 0.0035
            },
            horizontalShake: 0.000125
          },
          {
            isActive: false
          }
        );
  
        analogGlitchFilter.refreshGlitch = function(lowCoord, highCoord){
          let offset = 0.225;
          let baseCorrd = Math.ceil(Math.random() * 100) / 100;
          let topCoord = baseCorrd + offset;

          if(topCoord > 1){
            topCoord = 1.0
          }

          if(lowCoord && highCoord){
            baseCorrd = lowCoord;
            topCoord = highCoord;
          }

          this.uniforms.threshold.x = baseCorrd;
          this.uniforms.threshold.y = topCoord;  
        }
  
        return analogGlitchFilter;
  
      },

      initDigitalGlitchFilter(){  
        const loader = new PIXI.Loader(); // you can also create your own if you want
  
        loader.add('glitchMaskAlpha', digitalGlitchMask)
          
        return new Promise((resolve, reject) => {
          loader.load((loader, resources) => {  
            let filterObj = new FilterBeta(
              digitalGlitchFragShader, 
              this.pixiApp,
              {
                uTextureOne: resources.glitchMaskAlpha.texture,                
              }
            );
  
            resolve(filterObj);  
          })
        })
       
      },

      initLineShader() {
        let lineFilter = new FilterBeta(
          lineFragShader, 
          this.pixiApp,
          {
            opacity: {
              x: 0.975,
              y: 0.975
            }
  
          },
          true,
        );
  
        return lineFilter;

      },

      initShaders(cb = null) {
        let lightFilterObj,
            analogGlitchFilterObj,
            digitalGlitchFilterObj,
            lineFilterObj;


        digitalGlitchFilterObj = this.initDigitalGlitchFilter()
          .then(( filterObj ) => {
            lightFilterObj = this.initLightFilter();
            analogGlitchFilterObj = this.initAnalogGlitchFilter();
            lineFilterObj = this.initLineShader();

            this.filters.light = lightFilterObj;
            this.filters.analogGlitch = analogGlitchFilterObj;
            this.filters.line = lineFilterObj;
            this.filters.digitalGlitch = filterObj;

            if(cb){
              cb();
            }

          })
      },

      initShakeTl(){
        let tl = gsap.timeline({
          repeat: 1,
          repeatDelay: Math.random(),
          onComplete: () => {
            this.analogGlitchFilterObj.data.isActive = false;
  
          }
        });
  
        tl.to(
          "#stage", {
            duration: 0.25,
            onStart: () => {
              this.analogGlitchFilterObj.uniforms.threshold.x = 0.0;
              this.analogGlitchFilterObj.uniforms.threshold.y = 0.25;
              
              this.analogGlitchFilterObj.refreshGlitch();
  
            },
            onComplete: () => {
              // lightFilter.resetAnimation()
            }
          },
        );
  
        tl.to(
          "#stage", {
            duration: 0.25,
            onStart: () => {
              this.analogGlitchFilterObj.refreshGlitch(0.65, 0.95);
              this.analogGlitchFilterObj.uniforms.horizontalShake = 0.0;
  
            },
          },
        );      
  
        tl.to(        
          "#stage", {
            duration: 1.225 - Math.random(),
            onStart: () => {
              this.analogGlitchFilterObj.data.isActive = false;
              this.analogGlitchFilterObj.refreshGlitch(0.05, 0.05 + Math.random());
              this.analogGlitchFilterObj.uniforms.horizontalShake = 0.0125;            
  
            },
            onComplete: () => {
            }
          }
        )
  
        tl.to(
          "#stage", {
            duration: 0.25,
            onStart: () => {
              this.bunny.flip();
  
              this.analogGlitchFilterObj.refreshGlitch(0.45, 0.65);
              this.analogGlitchFilterObj.data.isActive = true;
  
            },
            onUpdate: () => {
              this.bunny.flip();
  
            },
            onComplete: () => {
              this.analogGlitchFilterObj.uniforms.threshold.x = 0.0;
              this.analogGlitchFilterObj.uniforms.threshold.y = 0.0;
              this.analogGlitchFilterObj.uniforms.horizontalShake = 0.0;
  
              this.lineFilterObj.uniforms.opacity.x = 0;
  
  
  
            }
          },
        );   
        
        tl.pause();
        return tl;
  
      },
      
      initBlinkTl(cb = null){
        let canvas = document.querySelector('canvas');

        let tlBlink = gsap.timeline({
          onStart: () => {
            this.digitalGlitchFilterObj.filter.enabled = true;
          },
          onComplete: () => {
            if(cb){
              cb()
            }
          } 
        });
  
        tlBlink.to(
            canvas, {
              duration: 0.25, 
              ease: "bounce.out",
              opacity: 1.0,         
            }
        )
  
        tlBlink.to(
            canvas, {
              duration: 1.85, 
              ease: "bounce.out",
              opacity: 0.75,         
            },
        )      
  
        tlBlink.to(
            canvas, {
              duration: 0.85, 
              ease: "bounce.out",
              opacity: 1.0,      
              onUpdate: (e) => {
                canvas.style.opacity = Math.random()
              },
              onComplete: () => {
                this.bunny.flip();
              }
            }
        )
  
        tlBlink.to(
            canvas, {
              duration: 0.25, 
              ease: "bounce.out",
              opacity: 1.0,   
              onStart: () => {
                // NEED TO REDO - NOT RELIABLE
                // let glitchObj = this.bunny.filters.shift();
                this.digitalGlitchFilterObj.filter.enabled = false;
              },     
              onComplete: () => {
                canvas.style.opacity = 1.0;
  
                this.filters.light.data.isActive = true
                // lightFilter.data.isActive = true;
              }
            },
  
        )  

        tlBlink.pause();
        return tlBlink;

      }      

  
    }
  }