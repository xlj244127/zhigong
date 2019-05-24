<template>
    <div class="login">
      <form-title></form-title>
      <div class="formBg">
        <form-background>
        </form-background>
        <div class="qrcodes">
          <div class="qrcode fl">
            <div>公众号</div>
            <img :src="qrCodeWx" alt="">
            <p>智工通公众号关注</p>
          </div>
          <div class="qrcode fr">
            <div>APP</div>
            <img :src="qrCode" alt="">
            <p>智工通APP下载</p>
          </div>
        </div>
      </div>

    </div>
</template>

<script>
  import formTitle from '../../components/login/formTitle'
  import formBackground from '../../components/login/formBackground'
  import download_img from '@/assets/img/qr_code.png'
  import download_img_wx from '@/assets/img/qr_code_wx.png'
    export default {
      name: "",
      components:{
        formBackground,formTitle
      },
      data() {
          return {
            qrCode:download_img,
            qrCodeWx:download_img_wx
          }
      },
      methods: {}
    }
</script>

<style lang="scss" type="text/scss">
  @import '../../assets/sass/global';
  #app{
    height: 100%;
  }
  .login{
    width: 100%;
    min-height:830px;
    height: 100%;
    background-color: #5EB0FA;
    background-image: url(../../assets/img/login_bg_img.png) ;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;

    position: relative;
  }

  .formBg{
    width: 700px;
    position: absolute;
    right: 30%;
    top: 50%;
    margin-top: -215px;
    margin-right: -350px;
  }
  .qrcodes{
    width: 300px;
    overflow: hidden;
    margin: 60px auto 0;
    div{
      font-size: 16px;
      color: #ffffff;
      line-height: 20px;
      margin-bottom: 6px;
    }
    img{
      width: 97px;
      height: 97px;
      padding: 6px 5px 0;
      background: #ffffff;
      vertical-align: bottom;
    }
    p{
      text-align: center;
      color: #125ed5;
      font-size: 12px;
      line-height: 24px;
      background: #ffffff;
    }
  }
</style>
