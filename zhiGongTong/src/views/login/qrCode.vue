<template>
  <div class="loginQRCode loginForm"
       v-loading.fullscreen.lock="fullscreenLoading"
       element-loading-text="正在登录"
  >
    <login-title></login-title>
    <div class="main" v-if="!scanVisible">
      <div class="qrCode">
        <div class="qrBox" >
          <div id="qrCode" ref="qrCode"></div>
        </div>
        <div class="qrTips">
          <div class="open">{{openApp}}</div>
          <div class="scan">{{scan}}</div>
        </div>
      </div>
    </div>
    <div class="loginFormMain formOnly scanTrue" v-else>
      <img :src="scanSuccess" alt="">
      <p>扫描成功！</p>
      <div class='tip'>请勿刷新本页面，按手机提示操作！</div>
      <div class='back' @click="scanVisibleChange">账号密码登录</div>
    </div>
  </div>
</template>

<script>
  import qrCode from 'qrcode2'
  import {commonApi,userApi} from "../../api";
  import scanSuccess from '../../assets/img/scan_success.png'
  import loginTitle from '@/components/login/title'
  import {LocalCache} from "../../lib/utils";
  export default {
        name: "",
    components:{
      loginTitle:loginTitle
    },
        data() {
            return {
              qrTitle:'扫描二维码登录',
              qrCode:'',
              openApp:'打开智工通APP',
              scan:'首页右上角扫一扫登录',
              loginId:'',
              imUser:null,
              fullscreenLoading:false,
              scanVisible:false,
              scanSuccess:scanSuccess,
            }
        },
      methods: {
        qrcode(loginId) {
          let qrcode = new qrCode(this.$refs.qrCode,
            loginId, // 二维码内容
          )
          console.log(qrcode)
        },
        scanVisibleChange(){
          this.scanVisible= false
        },
        randomString(num) {
          var data = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
          var result = "";
          for (var i = 0; i < num; i++) {
            var r = Math.floor(Math.random() * 62);
            result += data[r];
          }
          return result;
        },
        afterLogin(result){
          let that = this
          console.log(result);
          LocalCache.set('userInfo', result.data);
          console.log('userInfo', result.data);
          LocalCache.set('sessionkey', result.data.sessionkey);
          console.log('sessionkey', result.data.sessionkey);
          let passwordValue;
          if(result.data.hasPassword){
            passwordValue = 1
          }else{
            passwordValue = 0
          }
          LocalCache.set('hasPassword',passwordValue)
          console.log('afterLogin start');
          userApi.detail().then((result)=>{
            //console.log('detail',result.data);
            if(result.data.userDetail.idNumber){
              LocalCache.set('userDetail',result.data.userDetail)
            }else{
              LocalCache.set('userDetail',false)
            }

          });
          userApi.information().then((res)=>{
            console.log('information',res);
            LocalCache.set('companyInfo',res.data)
            if(LocalCache.has('userInfo')==true){
              this.fullscreenLoading = false
              that.$router.push({path: '/index/'});
            }
          }).catch((res)=>{
            this.$message({
              type:'error',
              message:res.msg,
            })
          });
          setTimeout(() => {
            that.fullscreenLoading = false;
          }, 1000);
        },
      },
      created(){
        let getToken = this.randomString(16);
        this.loginId = 'zgLogin'+getToken;
        console.log(this.loginId);
        let that = this
        commonApi.getXiaomiApiToken(getToken).then((response)=>{
          let token = response.body;
          console.log(response);
          if(!token) {
            that.$message.error('获取消息令牌失败，Token为空');
            return;
          }
          that.imUser = new MIMCUser(getToken);
          console.log(that.imUser);
          that.imUser.registerFetchToken(()=>{
            console.log(token);
            return token;
          });
          that.imUser.registerStatusChange((bindResult, errType, errReason, errDesc)=>{
            /**
             * @param[bindResult] bool: true/false 表示登录成功/失败
             * @param[errType] string: 登录失败类型
             * @param[errReason] string: 登录失败原因
             * @param[errDesc] string: 登录失败描述
             **/
            console.log(bindResult);
            if(!bindResult)
              console.log('Xiaomi account status changed: result: ' + bindResult + ', errType: '+errType + ', errReason: '+errReason + ', errDesc: '+errDesc);
          });
          that.imUser.registerP2PMsgHandler((msg)=>{
            console.log(msg.getPayload());
            //msg.getPacketId(); // 客户端生成的消息ID
            //msg.getSequence(); // 由服务器生成，用于去重排序(升序)
            //msg.getFromAccount(); // 消息发送者在APP帐号系统的帐号ID
            //msg.getTimeStamp(); // 消息发送时间戳
            //msg.getPayload(); // payload为用户自定义消息，utf-8 string类型
            let that = this
            console.log(msg.getPayload());
            this.msg=JSON.parse(msg.getPayload()).type
            let resType =JSON.parse(msg.getPayload()).type
            console.log(this.msg);
            //10取消 8扫码 9确认
            if(resType==8){
              this.scanVisible= true
              this.title='扫码成功';
            } else if (resType==9){
              let token = JSON.parse(msg.getPayload()).content.token;
              console.log(token);
              userApi.loginToken(token).then((res)=>{
                console.log('loginToken',res.data);
                that.afterLogin(res);
              }).catch((res)=>{
                that.$message({
                  type:'error',
                  message:res.msg,
                })
              })
            } else if (resType==10){
              that.scanVisible= false
              that.title='登录';
              //that.markQrCode('1231231230')
              that.reload();
            }
          });
          that.imUser.login();
          console.log(that.imUser);
        });
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
  margin: 50px auto 20px;
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
  .scanTrue{
    width: 100%;
    img{
      display: block;
      margin: 80px auto 20px;
    }
    p{
      font-size: 18px;
      color: #333333;
      line-height: 24px;
      text-align: center;
      text-indent: 14px;
    }
    .tip{
      font-size: 14px;
      color: #999999;
      text-align: center;
      margin-top: 30px;
      margin-bottom: 40px;
      text-indent: 14px;
    }
    .back{
      text-align: right;
      color: $optBlue;
      text-decoration: underline;
      margin-right: 20px;
      font-size: 14px;
    }
  }
</style>
