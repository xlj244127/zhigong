<template>
  <div class="formMain">
    <router-view></router-view>
    <!--<div class="qrcodes">
      <div class="qrcode">
        <div>APP</div>
        <img :src="qrCode" alt="">
        <p>智工通公众号关注</p>
      </div>
      <div class="qrcode">
        <div>公众号</div>
        <img :src="qrCodeWx" alt="">
        <p>智工通APP下载</p>
      </div>
    </div>-->
  </div>
</template>

<script>
  import formTitle from '../../components/login/formTitle'
  import download_img from '@/assets/img/qr_code.png'
  import download_img_wx from '@/assets/img/qr_code_wx.jpg'

    export default {
        name: "",
      components:{
        formTitle
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

<style lang="scss" type="text/scss" scoped>
  .formMain{
    background: rgba(255,255,255,0.9);
    width: 700px;
    overflow: hidden;
    padding-bottom: 30px;
    height: 360px;
  }

  .qrcodes{
    width: 400px;
    overflow: hidden;
    margin-top: calc(50% + 90px);
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
