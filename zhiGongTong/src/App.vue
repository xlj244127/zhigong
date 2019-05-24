<template>
  <div id="app">
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>

<script>
  import 'babel-polyfill'
  export default {
    provide(){
      return {
        reload:this.reload
      }
    },
    data() {
      return {
        isRouterAlive:true
      }
    },
    components:{
    },
    methods: {
      reload(){
        this.isRouterAlive = false
        this.$nextTick(function () {
          this.isRouterAlive = true
        })
      }
    }
  }
</script>

<style lang="scss" type="text/scss">


</style>
