<template>
  <div id="commonFooter">
    <span >Copyright © 2017-2019 粤ICP备18027238号</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    <a href="http://www.zhigongxx.com" target="_blank" class="darkBlue">深圳市智工信息技术有限公司</a>
  </div>
</template>

<script>
    export default {
        name: "commonFooter",
        date() {
          return{}
        },
      methods: {

      }
    }
</script>

<style lang="scss" type="text/scss">
  @import "../../assets/sass/variable";
  #commonFooter{
    line-height: 34px;
    font-size: 14px;
    text-align: center;
    color: $c3;
  }
  .darkBlue{
    color: $darkBlue;
    &:hover,&:link,&:visited{
      color: $darkBlue;
    }
  }
</style>
