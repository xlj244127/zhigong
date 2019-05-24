<template>
  <div class="loginForm pwdContainer"
       v-loading.fullscreen.lock="fullscreenLoading"
       element-loading-text="正在提交重置密码表单">
    <login-title :title='title'></login-title>
    <reset-title :resetTitle='resetTitle'></reset-title>
    <el-form :model='resetForm' class="foregtForm" ref="resetForm"  :rules='veriRules'>
      <el-form-item prop="mobile">
        <el-input v-model="resetForm.mobile" auto-complete="off" type="number" :disable='true'>
        </el-input>
      </el-form-item>
      <el-form-item prop="password" class="password pwdChangeView">
        <el-input v-model="resetForm.password" auto-complete="on" :type="passwordType" placeholder="请输入新密码" @keyup.enter.native="submit()">
        </el-input>
        <div class='changeType' @click.prevent="changeType"  alt="">
          <img v-if="eyeStatus==1" :src="eyeOpen" alt="">
          <img v-else :src="eyeClose" alt="">
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click.prevent="nextStep">确认</el-button>
    </div>
    <div class="others">
        <span class="backLogin" @click.prevent="backLogin">
        {{backLogIn}}
      </span>
    </div>

  </div>
</template>

<script>
  import loginTitle from '@/components/login/title'
  import resetTitle from '@/components/login/resetTitle'
  import otherWay from '@/components/login/otherWay'
  import {userApi} from "../../api";
  import {LocalCache} from "../../lib/utils";
  import eyeClose from '../../assets/img/eye_close.png'
  import eyeOpen from '../../assets/img/eye_open.png'
  export default {
    name: "",
    components:{loginTitle,resetTitle},
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
        } else {
          callback()
        }
      }
      return {
        title:'重置密码',
        resetTitle:'请输入手机号码进行验证',
        backLogIn:'点击返回登录',
        resetForm:{
          mobile:'',
          password:'',
        },
        veriRules: {
          mobile: [{ trigger: 'blur', validator: validateMobile }],
          password:[{ trigger:'blur',validator:validateVeri }]
        },
        eyeOpen:eyeOpen,
        eyeClose:eyeClose,
        passwordType:'password',
        eyeStatus:1,
        fullscreenLoading:false
      }

    },
    methods: {
      changeType(){
        if(this.eyeStatus===2){
          this.eyeStatus = 1
          this.passwordType = "password"
        }else{
          this.eyeStatus = 2
          this.passwordType = "text"
        }
        console.log(this.eyeStatus,this.passwordType);
      },
      nextStep(){
        let that = this
        this.$refs.resetForm.validate((valid) => {
          //loginItem: window.getuiCID
          this.fullscreenLoading = true
          let resetToken
          if(this.$store.resetToken){
            resetToken = this.$store.resetToken
          }else{
            resetToken = LocalCache.get('resetToken')
          }
          if (valid) {
            userApi.resetPassword(
              resetToken,
              this.resetForm.password,
            ).then((result)=>{
              console.log('success',result);
              this.$message({
                type:'success',
                message:'修改密码成功',
              })
              LocalCache.del('resetToken')
              LocalCache.del('mobileForReset')
              that.fullscreenLoading = false
              that.$router.push({path:'/login/resetSuccess'})

            }).catch((result)=>{
              console.log('fail',result);
              that.fullscreenLoading = false
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
        this.$router.go(-2)
      }
    },
    mounted(){
      console.log(this.$store.mobileForReset);
      if(this.$store.mobileForReset!=undefined){
        this.resetForm.mobile = this.$store.mobileForReset
      }else{
        this.resetForm.mobile = LocalCache.get('mobileForReset')
      }
      console.log(this.resetForm.mobile);
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
