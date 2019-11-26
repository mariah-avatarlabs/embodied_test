<template>
  <div>
    <div id='stage'></div>
  </div>
</template>

<script>
import * as PIXI from 'pixi.js'
// import { GlitchFilter, GlowFilter } from 'pixi-filters';
// import { TweenMax } from "gsap/TweenMax";
import { gsap } from "gsap";

import titleData from "../assets/data/typography.json";

import img from '../assets/images/Wilde_pose.png';
import imgB from '../assets/images/Wilde_pose_blue.png';

import mixins from './shaders/mixin.js';
import { glitch } from './mixins/glitch.mixin.js';

export default {
  name: 'app',
  mixins: [mixins, glitch],
  data(){
    return {
      pixiApp: null,
      canvasW: 0,
      canvasH: 0,
      delta: 0.0,
      data: null,
      lineCoords: [],
      alpha: 0,
      dragIndex: 0,
      rotatorIndx: 0,
      dragging: false
    }
  },
  created() {

  },
  mounted() {
    this.calculateFit();
    this.initPixi();
    // this.animBg();

  },
  methods: {
    animBg(){
      const rectGraphic = new PIXI.Graphics();

      rectGraphic.beginFill(0xDE3249);
      rectGraphic.drawRect(
        0, 
        50, 
        this.pixiApp.renderer.width, 
        400
      );
      rectGraphic.endFill();

      let lineObj = this.pixiApp.stage.addChild(rectGraphic);

    },

    initTypography() {
      let typeContainer = new PIXI.Container();

      let titleObjsArray = titleData.titles;
      for (let titleObjIndx in titleObjsArray){
        
        let currTitleObjData = titleObjsArray[titleObjIndx]
        let textObj = this.createTypeObj(
          currTitleObjData,
          titleObjIndx
        );
        
        console.log("int: ", textObj)


        typeContainer.addChild(textObj);
      }

      this.pixiApp.stage.addChild(typeContainer);
      typeContainer.x = this.pixiApp.screen.width / 2;

      console.log("canvas height: ", typeContainer.height)

      document.addEventListener('click', (event) => {
        this.rotateCarousel(typeContainer, typeContainer.children);
      });

      typeContainer.filters = [new PIXI.filters.BlurFilter()];

      // TweenMax.to(typeContainer.children, 15, {
      //   ease: Linear.easeNone,
      //   y: "+=" + document.querySelector('canvas').height / 3,
      //   modifiers: {
      //     y: function(y){
      //       // console.log("newPos: ", y % typeContainer.height)
      //       return y %= document.querySelector('canvas').height / 3;
      //     }
      //   },
      //   repeat: -1,
      // });


    },

    rotateCarousel(container, array){

      console.log('carouselrotate: ', array)
      // if(this.rotatorIndx == array.length){
      //   this.rotatorIndx = 0;
      // } else {
      //   this.rotatorIndx+=1;
      // }

      TweenMax.to(array, 0.5, {
        y: "+=" + array[0].height,
        ease: Linear.easeNone,
        paused: false,
        // repeat: -1,
        onComplete: function() {
          console.log('FIN: ', container.height, this.target)
          for(let el in this.target){
            let targetel = this.target[el];

            if(targetel.y >= container.height){
              targetel.y = 0;
            }

            console.log('POSE: ', targetel.y)
          }
        
        },
        modifiers: {
          y: function(y) {
            y %= array[0].height
            return y
          }
        }
      });



      // for (let typeChild in array){


      // }


    },

    createTypeObj(typeObj, indx){
      let baseHeight = document.querySelector('canvas').height / 3;
      console.log("BASE: ", baseHeight)

      let textSize = baseHeight * 0.90;

      let textPadding = baseHeight * 0.10;

      let textHeight = textSize + textPadding;

      const style = new PIXI.TextStyle({
        fontFamily : 'Bowlby One SC', 
        fontSize: textSize,        
        fill: "white",
        fontWeight: "normal",
        align : 'center'
      });

      let pixiTextObj = new PIXI.Text(
        typeObj.title, 
        style
      );

      pixiTextObj.y = textHeight * indx;
      pixiTextObj.anchor.set(0.5, 0.5);

      pixiTextObj.interactive = true;
      // pixiTextObj.on('click', (e) => {
      //   window.open(typeObj.link);
      // })

      return pixiTextObj;

    },

    glitchDonald(){

      var container = new PIXI.Container();
      container.filterArea = this.pixiApp.screen;
      this.pixiApp.stage.addChild(container);

      this.bunny.filters = [
        this.digitalGlitchFilterObj.filter,
        this.lineFilterObj.filter,
        this.lightFilterObj.filter,
        this.analogGlitchFilterObj.filter
      ]

      let animateLine = () => {
        this.delta += 0.1;
        
        this.lineFilterObj.filter.uniforms.delta = this.delta
        // filterLine.uniforms.delta = this.delta;
        
        if(this.filters.light.data.isActive){
          // console.log('IS ACTIVE')
          this.filters.light.uniforms.delta += 0.1;
          // console.log(lightFilter.uniforms.delta)

        }

        if(this.analogGlitchFilterObj.data.isActive) {
          this.analogGlitchFilterObj.uniforms.delta += 0.5 + Math.sin(this.delta) * 0.5;
        }

      }

      this.pixiApp.ticker.add(animateLine);
      
      let canvas = document.querySelector('canvas');

      let shakeAnim = this.initShakeTl();
      let startAnim = () => {
        shakeAnim.restart();
      }

      let blinkAnim = this.initBlinkTl(() => {
        startAnim();
      })
      blinkAnim.restart();


    },

    initPixi(){
      this.pixiApp = new PIXI.Application({
        width: window.innerWidth,
        height: this.canvasH,
        // backgroundColor: 0x1099bb,
        // antialiasing: true,
        // resolution: Window.devicePixelRatio || 1,
        // autoDensity: true,    
        transparent: true,
        // resizeTo: document.querySelector('#app')    
      });
      
      document.querySelector('#stage').appendChild(this.pixiApp.view);

      let texture = PIXI.Texture.from(img);
      let textureB = PIXI.Texture.from(imgB);

      this.bunny = PIXI.Sprite.from(textureB)
      this.pixiApp.stage.addChild(this.bunny);

      this.bunny.flip = () => {

        if(this.bunny.texture == texture) {
          this.bunny.texture = textureB;
        } else if (this.bunny.texture == textureB) {
          this.bunny.texture = texture
        }

      }

      this.initShaders(() => {
        this.glitchDonald();
      });
      
    },

    dragOnPath(){
      // MAKE PATH
      const pathGraphic = new PIXI.Graphics();

      pathGraphic.lineStyle(5, 0xFEEB77, 1);
      pathGraphic.moveTo(200, 20) 
      pathGraphic.lineTo(200, 200)
      pathGraphic.arcTo(
        350, 200, 
        450, 900, 
        100
      )
      pathGraphic.arcTo(
        450, 900, 
        650, 450, 
        100
      )
      pathGraphic.lineTo(200, 500)


      let lineObj = this.pixiApp.stage.addChild(pathGraphic);
      lineObj = lineObj.geometry.points

      let moPathCoords = () => {
        if(lineObj.length > 0){
          //https://forum.vuejs.org/t/how-to-access-the-elements-of---ob---observer-in-vuejs/22404/5

          for (var i = 0; i < lineObj.length; i += 2) {
            this.lineCoords.push({ x: lineObj[i], y: lineObj[i+1] });
            this.pixiApp.ticker.remove(moPathCoords)
          }

          // MAKE TARGET CIRCLE
          const targetGraphic = new PIXI.Graphics();
          targetGraphic.interactive = true;

          targetGraphic.lineStyle(0);
          targetGraphic.beginFill(0xDE3249, 1);
          targetGraphic.drawCircle(
            this.lineCoords[this.dragIndex].x, 
            this.lineCoords[this.dragIndex].y, 
            25
          );
          targetGraphic.endFill();      
      

          let moPathTween = TweenMax.to(
            targetGraphic, 
            25, 
            {
              bezier: { 
                values: this.lineCoords,
                curviness: 0
              },
              paused: true,
              // repeat: -1,
              // yoyo: true
            }
          );          

          function onDragStart(event) {
              // store a reference to the data
              // the reason for this is because of multitouch
              // we want to track the movement of this particular touch
              this.data = event.data;
              this.alpha = 0.5;
              this.dragging = true;
          }

          function onDragMove(event) {
            if(this.dragging && this.isOver){
              moPathTween.play();
            }

              // if (this.dragging && this.lineCoords[this.dragIndex]) {
              //     // const newPosition = this.data.getLocalPosition(this.parent);
              //     targetGraphic.x = this.lineCoords[this.dragIndex].x;
              //     targetGraphic.y = this.lineCoords[this.dragIndex].y;
              //     this.dragIndex +=1;
              // }
          }

          function onDragEnd() {
              this.alpha = 1;
              this.dragging = false;
              // set the interaction data to null
              this.data = null;
              moPathTween.pause();

          }          
      
          function onButtonOver() {
            this.isOver = true;
          }

          function onButtonOut() {
            moPathTween.pause();
            this.isOver = false;
          }


          targetGraphic.on('pointerover', onButtonOver)
          targetGraphic.on('pointerout', onButtonOut)

          targetGraphic.on('pointerdown', onDragStart)
          targetGraphic.on('pointermove', onDragMove);          
          targetGraphic.on('pointerup', onDragEnd);
          targetGraphic.on('pointerupoutside', onDragEnd);



          this.pixiApp.stage.addChild(targetGraphic);

          

        }

      }

      this.pixiApp.ticker.add(moPathCoords)




    },

    calculateFit() {
      let baseW = 1280;
      let baseH = 760;

      let newW = (baseW * window.innerHeight) / baseH;
      let newH = (baseH * window.innerWidth) / baseW;

      this.canvasH = newH;
      this.canvasW = newW;


    },

    resizeCanvas() {
      // if(window.innerWidth > )
    }
    
  }
}
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css?family=Yantramanav:400,500,700,900&display=swap');
@import url('https://fonts.googleapis.com/css?family=Bowlby+One+SC&display=swap');

@import '../styles/global.scss';
@import '../styles/mixins.scss';

body, html, div {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

#stage {
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;  

  &::before, &::after {
    content: "";
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    height: 25vh;
    width: 100%;
    z-index: 10;
    display: none;
  }

  &::before {
  background-image : linear-gradient(to top, 
                    rgba(255,255,255, 0), 
                    rgb(255, 0, 0) 40%);    
    top: 0;
  }

  &::after {
  background-image : linear-gradient(to bottom, 
                    rgba(255,255,255, 0), 
                    rgb(255, 0, 0) 40%);    
    bottom: 0;
  }  

}

// #app {
//   font-family: 'Avenir', Helvetica, Arial, sans-serif;
//   -webkit-font-smoothing: antialiased;
//   -moz-osx-font-smoothing: grayscale;
//   text-align: center;
//   color: #2c3e50;
//   height: 100%;
//   width: 100%;
//   background: orange;
//   position: relative;
//   overflow: hidden;
// }


</style>
