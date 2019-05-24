<template>
    <div class="account loginForm">
      <login-title :title='title'></login-title>
      <div class="successMain">
        <div class="tip">密码重置成功，<span  class='imp'>{{countNum}}</span>秒后将跳转回登录页面重新登录</div>
        <div class="back">如页面长时间无跳转，请点击下方按钮返回登录</div>
        <el-button @click.prevent='jumpNow' type='primary'>立即跳转</el-button>
      </div>

    </div>
</template>

<script>
  import loginTitle from '@/components/login/title'

    export default {
        name: "",
      components:{loginTitle},
        data() {
            return {
              title:'重置密码成功',
              countNum:'3',
            }
        },
        methods: {
            count(){
              const TIME_COUNT = 3;
              if (!this.timer) {
                this.count = TIME_COUNT;
                this.timer = setInterval(() => {
                  if (this.countNum > 0 && this.count <= TIME_COUNT) {
                    this.countNum--;
                  } else {
                    this.$router.push({path:'/login/index'})
                    clearInterval(this.timer);
                    this.timer = null;
                  }
                }, 1000)
              }
            },
          jumpNow(){
            this.$router.push({path:'/login/index'})
          }
        },
        mounted(){
          this.count();
        }
    }
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../assets/sass/variable";
.successMain{
  text-align: center;
  margin-top: 75px;
  margin-bottom: 50px;
  font-size: 14px;
  line-height: 42px;
  .imp{
    color: #F15F5F;
    font-size: 20px;
  }
  .el-button{
    margin-top: 30px;
    width: 20%;
  }
}


</style>
