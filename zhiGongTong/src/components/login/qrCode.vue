<template>

</template>

<script>
  import qrCode from 'qrcode2'
  import {commonApi} from "../../api";
  export default {
        name: "",
        data() {
            return {
              qrTitle:'扫描二维码登录',
              qrCode:'',
              openApp:'打开智工通APP',
              scan:'首页右上角扫一扫登录',
              loginId:'',
              imUser:null,
            }
        },
      methods: {
        qrcode(loginId) {
          let qrcode = new qrCode(this.$refs.qrCode,
            loginId, // 二维码内容
          )
          console.log(qrcode)
        }
      },
      created(){

      },
      beforeMount(){


      },
      mounted(){
        this.qrcode(this.loginId);
      }
    }
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../assets/sass/variable";
.qrCode{
  width: 300px;
  float: right;
  margin-top: 20px;
  margin-bottom: 20px;
  border-left: $bd-d;
  .qrTitle{
    margin-bottom: 20px;
    font-size: 16px;
    line-height: 40px;
    text-align: center;
  }
  .qrBox{
    width: 150px;
    height: 150px;
    padding: 9px;
    border: $bd-d;
    margin: 0 auto 15px;
    #qrCode{
      width: 150px;
      height: 150px;

    }
    img{

    }
  }
  .qrTips{
    text-align: center;
    color: $c9;
    font-size: 12px;
    margin-top: 15px;
    line-height: 20px;
    padding-bottom: 10px;
  }
}
</style>
