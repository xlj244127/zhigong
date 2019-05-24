<template>
    <div class="loginForm pwdContainer"
         v-loading.fullscreen.lock="fullscreenLoading"
         element-loading-text="正在提交表单">
      <login-title :title='title'></login-title>
      <reset-title :resetTitle='resetTitle'></reset-title>
      <el-form :model='forgetForm' class="foregtForm" ref="forgetForm"  :rules='veriRules'>
        <el-form-item  prop='mobile'>
          <el-input v-model="forgetForm.mobile" auto-complete="off" type="number" placeholder="请输入手机号">
          </el-input>
        </el-form-item>
        <el-form-item prop='vcode'>
          <el-input v-model="forgetForm.vcode" auto-complete="off" type="number" placeholder="请输入验证码">
            <el-button slot="append" @click.prevent='getCode' :disabled='disabled'>{{getCodeTxt}}</el-button>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click.prevent="nextStep">下一步</el-button>
      </div>
      <div class="others">
        <span class="backLogin" @click.prevent="backLogin" >
        {{backLogIn}}
      </span>
      </div>

    </div>
</template>

<script>
  import loginTitle from '@/components/login/title'
  import resetTitle from '@/components/login/resetTitle'
  import {userApi} from "../../api";
  import {LocalCache} from "../../lib/utils";
  import otherWay from '@/components/login/otherWay'
    export default {
        name: "",
      components:{loginTitle,resetTitle},
        data() {
          var  validateMobile=(rule,value,callback)=>{
            const reg= /^1[2-9]\d{9}$/;
            if(!value){
              callback(new Error('请输入手机号'))
            } else if (value.toString().length != 11) {
              callback(new Error('电话号码必须是11位'));
            } else if(!reg.test(value)){
              callback(new Error('请输入正确格式的手机号'))
            }else{
              callback()
            }
          }
          var validateVeri =(rule,value,callback)=>{
            if(!value){
              callback(new Error('请输入验证码'))
            } else {
              callback()
            }
          }
            return {
              title:'找回密码',
              resetTitle:'请输入手机号码进行验证',
              backLogIn:'点击返回登录',
              forgetForm:{},
              veriRules: {
                mobile: [{  trigger: 'blur', validator: validateMobile }],
                vcode:[{trigger:'blur',validator:validateVeri}]
              },
              countNum:'59',
              getCodeTxt:'获取验证码',
              disabled:false,
              fullscreenLoading:false
            }

        },
        methods: {
          getCode(){
            const TIME_COUNT = 59,
              mobile =this.forgetForm.mobile;
            this.$refs.forgetForm.validateField('mobile',(valid) => {
              if(valid==''){
                if (!this.timer) {
                  this.countNum = TIME_COUNT;
                  this.getCodeTxt = '重新发送(60s)'
                  userApi.sendMessage(
                    mobile
                  ).then((result)=>{
                    if(result.code==0){
                      this.$message({
                        type:'success',
                        message:'短信发送成功！'
                      })
                    }
                    this.timer = setInterval(() => {if (this.countNum > 0 && this.count <= TIME_COUNT) {
                      this.getCodeTxt = '重新发送('+this.countNum+'s)'
                      this.countNum--;
                      this.disabled=true
                    } else {
                      this.getCodeTxt = '重新获取验证码';
                      clearInterval(this.timer);
                      this.timer =null;
                      this.disabled=false;
                      this.countNum = '59';
                    }}, 1000)
                    console.log(result);
                    //console.log(JSON.stringify(result));
                  });
                }
              }
            })
          },
          nextStep(){

            this.$refs.forgetForm.validate((valid) => {
              //loginItem: window.getuiCID
              this.fullscreenLoading = true
              if (valid) {
                userApi.forgetPassword(
                  this.forgetForm.mobile,
                  this.forgetForm.vcode,
                ).then((result)=>{
                  console.log(result);
                  LocalCache.set('resetToken', result.data.resetToken);
                  LocalCache.set('mobileForReset',this.forgetForm.mobile);
                  this.$store.resetToken = result.data.resetToken
                  this.$store.mobileForReset = this.forgetForm.mobile
                  this.fullscreenLoading = false
                  this.$router.push({path:'/login/resetPwd'});
                }).catch((result)=>{
                  this.fullscreenLoading = false
                  this.$message({
                    type:'error',
                    message:result.msg
                  })
                })

              } else {
                this.$message.error('提交参数错误！')
                return false;
              }
            });
          },
          backLogin(){
            console.log(this.$router.go(-1));
            this.$router.go(-1)
          }
        }
    }
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../assets/sass/variable";
  .pwdContainer{
    .foregtForm,.dialog-footer,.others{
      width: 40%;
      margin: 0 auto;
    }
    .dialog-footer .el-button{
      width: 100%;
    }
    .backLogin{
      font-size: 14px;
      cursor: pointer;
      color: $c9;
    }
    .others{
      margin-top: 20px;
    }
  }
</style>
