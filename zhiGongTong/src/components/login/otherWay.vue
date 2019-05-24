<template>
  <div class="others">
    <span v-if='type==1' class="fl" @click.prevent='JumpAccount'>账号密码登录</span>
    <span v-else class="fl" @click.prevent='JumpVeri'>验证码登录</span>
    <span class="fr" @click.prevent="forget">忘记密码?</span>
  </div>
</template>

<script>
    export default {
        name: "",
      props:['type'],
        data() {
            return {}
        },
        methods: {
          JumpAccount(){
            this.$router.push({path:'/login/index'})
          },
          JumpVeri(){
            this.$router.push({path:'/login/verification'})
          },
          forget(){
            this.$router.push({path:'/login/forgetPwd'})
          }
        }
    }
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../assets/sass/variable";
  .others{
    width: 60%;
    margin: 0 auto;
    span{
      font-size: 14px;
      text-decoration: underline;
      cursor: pointer;
      &.fl{
        color: $optBlue;
      }
      &.fr{
        color: $c9;
      }
    }
  }
</style>
