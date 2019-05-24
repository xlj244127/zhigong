<template>
    <div class="account loginForm"
         v-loading.fullscreen.lock="fullscreenLoading"
         element-loading-text="正在登录"


    >
      <login-title></login-title>
      <div class="loginFormMain fl formOnly"><!--添加二维码时删掉formOnly-->
        <el-form :model='loginForm'  class="loginForm" ref="loginForm"  :rules='loginRules'>
          <div class="loginFormTitle">
            {{formTitle}}
          </div>
          <el-form-item prop="mobile">
            <el-input v-model="loginForm.mobile" auto-complete="off" type="number" placeholder="请输入手机号" >
            </el-input>
          </el-form-item>
          <el-form-item prop="password" class="password pwdChangeView">
            <el-input v-model="loginForm.password" auto-complete="on" :type="passwordType" placeholder="请输入新密码" @keyup.enter.native="logIn">
            </el-input>
            <div class='changeType' @click.prevent="changeType"  alt="">
              <img v-if="eyeStatus==1" :src="eyeOpen" alt="">
              <img v-else :src="eyeClose" alt=""></div>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="logIn">登录</el-button>
        </div>
        <other-way :type='type'></other-way>
      </div>
    </div>
</template>

<script>
  import loginTitle from '@/components/login/title'
  import qrCode from '@/components/login/qrCode'
  import otherWay from '@/components/login/otherWay'
  import md5 from 'js-md5'
  import eyeClose from '../../assets/img/eye_close.png'
  import eyeOpen from '../../assets/img/eye_open.png'
  import {userApi} from "../../api";
  import {LocalCache} from "../../lib/utils";

  export default {
    name: "",
    components:{loginTitle,qrCode,otherWay},
    inject:['reload'],
        data() {
          var  validateMobile = (rule,value,callback)=>{
            const reg= /^1[2-9]\d{9}$/;
            if(!value){
              callback(new Error('请输入手机号'))
            } else if (value.toString().length != 11) {
              callback(new Error('电话号码必须是11位'));
            } else if (!reg.test(value)){
              callback(new Error('请输入正确格式的手机号'))
            } else {
              callback()
            }
          }
          var validateVeri = (rule,value,callback)=>{
            if(!value){
              callback(new Error('请输入密码'))
            } else if (value.match(/[\u4e00-\u9fa5]/)){
              callback(new Error('不能输入中文字！'))
            } else if (value.length<6){
              callback(new Error('密码长度不能低于6位！'))
            } else {
              callback()
            }
          }
            return {
              title:'登录',
              formTitle:'使用账号密码登录',
              type:'2',
              loginForm:{},
              loginRules: {
                mobile: [{ trigger: 'blur', validator: validateMobile }],
                password:[{ trigger:'blur',validator:validateVeri }]
              },
              eyeOpen:eyeOpen,
              eyeClose:eyeClose,
              passwordType:'password',
              eyeStatus:2,
              fullscreenLoading:false,
              msg:'',
            }
        },
        methods: {
          changeType(){
            if(this.eyeStatus===1){
              this.eyeStatus = 2
              this.passwordType = "password"
            }else{
              this.eyeStatus = 1
              this.passwordType = "text"
            }
          },
          afterLogin(result){
            let that = this
            LocalCache.set('userInfo', result.data);
            this.$store.userInfo = result.data;
            LocalCache.set('sessionkey', result.data.sessionkey);
            console.log(this.$store.userInfo);
            let passwordValue;
            if(result.data.hasPassword){
              passwordValue = 1
            }else{
              passwordValue = 0
            }
            LocalCache.set('hasPassword',passwordValue)
            userApi.detail().then((result)=>{
              //console.log('detail',result.data);
              if(result.data.userDetail.idNumber){
                LocalCache.set('userDetail',result.data.userDetail)
              }else{
                LocalCache.set('userDetail',false)
              }

            });
            userApi.information().then((res)=>{
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
          logIn(){
            let that =this
            this.$refs.loginForm.validate((valid) => {
              //loginItem: window.getuiCID
              if (valid) {
                this.fullscreenLoading = true
                userApi.loginWeb(
                  this.loginForm.mobile,
                  md5(this.loginForm.password),
                ).then((result)=>{
                  console.log(result.data);
                  that.afterLogin(result);
                }).catch((result)=>{
                  console.log(result);
                  setTimeout(() => {
                    that.fullscreenLoading = false;
                  }, 500);
                  this.$message({
                    type:'error',
                    message:result.msg,
                  })
                })
              } else {
                this.$message({
                  type:'error',
                  message:'请正确填写登录信息'
                })
                return false;
              }
            });
          },
          requestImg(){

          },

        },

      created(){

      },
      beforeMount(){

      }
    }
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../assets/sass/variable";
  .loginFormMain{
    width: 600px;
    margin: 0 auto ;
    .el-form-item{
      width: 60%;
      margin: 0 auto 22px ;
      .el-input{
        width: 100%;
      }
    }
  }
  .others,.dialog-footer{
    width: 60%;
    margin-left: auto;
    margin-right: auto;
  }
  .dialog-footer{
    margin-bottom: 42px;
    margin-top: 22px;
  }
  .dialog-footer .el-button{
    width: 100%;
    padding: 12px 0;
  }
.loginFormTitle{
  font-size: 16px;
  line-height: 5;
  text-align: center;
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
