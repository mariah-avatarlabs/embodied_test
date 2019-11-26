var mixin = {
    created: function() {


    },
    methods: {
      Filter: function (filterObj, pixiAppObj, animationObj = null) {
          this.root = filterObj;
          this.app = pixiAppObj;
          
          this.tween = animationObj;
      }
    }
  }