<template>
  <div id="app" :class="routeClass">

    <transition
      name="color-fade"
      mode="out-in"
    >
        <router-view id="viewport-content"/>
    </transition>


  </div>
</template>

<script>

export default {
  name: 'App',
  data: function(){
    return{
      activateMenu: false,
      currRoute: this.$route.path,
      routeClass: '',

    }
  },

  computed: {
  },
  mounted(){

  },
  methods: {
    updatedC: function() {
          this.activateMenu = !this.activateMenu
    },
    resetMenu: function (){
      this.activateMenu = false;
    }
  },
  updated: function() {
    console.log("clicked: ", this.$route.path);
  }

}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Yantramanav:400,500,700,900&display=swap');
@import url('https://fonts.googleapis.com/css?family=Bowlby+One+SC&display=swap');

@import './styles/global.scss';

body, html {
  height: 100vh;
  width: 100vw;
  padding: 0;
  margin: 0;
  overflow: hidden;
}


#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  // background-image: linear-gradient(to bottom right, red, yellow);
  background: rgb(255, 0, 0);    
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  display: inline-block;

    transition: 
      opacity 0.35s ease-in 0.5s,
      background 0.35s ease-in 0.5s;

  .color-fade-leave-active {
    transition: 
      opacity 0.35s ease-in 0.5s,
      background 0.35s ease-in 0.5s;
  }

  .color-fade-leave-to {
    transform: translate(0, -20px);
    opacity: 0;    
  }

  .color-fade-enter-active {
    transition: 
      opacity 0.35s ease-in 0.5s,
      background 0.35s ease-in 0.5s;
  }

  .color-fade-enter {
    transform: translate(0, -20px);
    opacity: 0;    
  }

  .color-fade-enter-to {
    transform: translate(0, 0);
    opacity: 1;
  }


  &.about {
    background: $pink;
  }

  &.beta {
    background: $orange;
  }

  &.charlie {
    background: $yellow;
  }  

  &.delta {
    background: $blue;
  }    


}

#viewport-main, #viewport-content {
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    display: grid;
}

#footer {
  position: fixed;
  width: 100vw;
  height: 10vh;
  bottom: 0;
  text-align: center;

  #menu-icon {
    //position: absolute;
    margin: auto;
    left: 0; right: 0;
    z-index: 50;

    height: 35px;
    width: 35px;
  }

}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}



</style>
