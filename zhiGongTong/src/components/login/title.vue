<template>
    <div class="loginTitle">
      <div class="loginItem fl" @click.prevent="jumpToAccount" :class='{active:account}'><span>账号登录</span></div>
      <div class="loginItem fr" @click.prevent="jumpToQrCode" :class="{active:qrcode}"><span>扫码登录</span></div>
      <div class="line"></div>
    </div>
</template>

<script>
    export default {
        name: "",
        data() {
            return {
              account:false,
              qrcode:false,
            }
        },
        methods: {
          jumpToAccount(){
            this.$router.push({path:'/login/index'})
          },
          jumpToQrCode(){
            this.$router.push({path:'/login/qrCode'})
          }
        },
        beforeMount(){
          let path = this.$route.path;
          console.log(path);
          if(path=='/login/index'||path == "/login/verification"){
            this.account = true
          } else {
            this.qrcode = true
          }
        }
    }
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../assets/sass/variable";
.loginTitle{
  font-size: 18px;
  line-height: 3;
  background-color: #f5f6fa;
  color: #666666;
  text-align: left;
  overflow: hidden;
  text-align: center;
  .loginItem{
    width: 49%;
    box-sizing: border-box;
    cursor: pointer;
    &.active{
      color: $optBlue;
      span{
        border-bottom: 2px solid $optBlue;
        padding: 0 12px 13px;
        font-size: 18px;
        line-height: 20px;
      }
    }
  }
  .line{
    width: 1px;
    height: 30px;
    margin: 12px auto 0;
    background:  #eaeaea ;

  }
}
</style>
