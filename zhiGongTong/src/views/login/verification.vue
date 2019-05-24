<template>
  <div class="account loginForm"
       v-loading.fullscreen.lock="fullscreenLoading"
       element-loading-text="正在登录"
  >
    <login-title :title='title'></login-title>
      <div class="loginFormMain" ><!--添加二维码时删掉formOnly-->
        <el-form :model='loginForm' class="" ref="loginForm"  :rules='veriRules'>
          <div class="loginFormTitle">
            {{formTitle}}
          </div>
          <el-form-item  prop='mobile'>
            <el-input v-model.tel="loginForm.mobile" maxlength=11 minlength=0 auto-complete="off" type="number" placeholder="请输入手机号" >
            </el-input>
          </el-form-item>
          <!--<el-form-item>
            <el-input v-model="loginForm.veri" auto-complete="off" type="number" placeholder="请输入验证码">
              <el-button slot="append" @click.prevent='requestImg'>获取图片验证码</el-button>
            </el-input>
          </el-form-item>-->
          <el-form-item prop='vcode'>
            <el-input v-model="loginForm.vcode" auto-complete="off" type="number" placeholder="请输入验证码">
              <el-button slot="append" @click.prevent='getCode' :disabled="disabled">{{getCodeTxt}}</el-button>
            </el-input>
          </el-form-item>
          <el-form-item  class="dialog-footer">
            <el-button type="primary" @click.prevent="loginAction()">登录</el-button>
          </el-form-item>
        </el-form>
        <other-way :type='type'></other-way>
      </div>


  </div>
</template>

<script>
  import loginTitle from '@/components/login/title'
  import otherWay from '@/components/login/otherWay'
  import { userApi,rightsApi } from '../../api'
  import { LocalCache } from '../../lib/utils'
  export default {
    name: "",
    inject:['reload'],
    components:{loginTitle,otherWay},
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
        title:'登录',
        formTitle:'使用手机验证码登录',
        type:'1',
        loginForm:{
          vcode:"",
          mobile:""
        },
        countNum:'59',
        veriRules: {
          mobile: [{  trigger: 'blur', validator: validateMobile }],
          vcode:[{trigger:'blur',validator:validateVeri}]
        },
        getCodeTxt:'获取验证码',
        disabled:false,
        fullscreenLoading:false,
      }
    },
    methods: {
      getCode(){
        const TIME_COUNT = 59,
          mobile =this.loginForm.mobile;

        this.$refs.loginForm.validateField('mobile',(valid) => {
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
                //console.log(JSON.stringify(result));
              });
              this.timer = setInterval(() => {if (this.countNum > 0 && this.countNum <= TIME_COUNT) {
                this.getCodeTxt = '重新发送('+this.countNum+'s)'
                this.countNum--;
                this.disabled=true
              } else {
                this.getCodeTxt = '重新获取验证码';
                clearInterval(this.timer);
                this.timer =null;
                this.disabled=false;
                this.countNum = '59';
              }
              }, 1000)
            }
          }
        })
        /**/
      },
      loginAction(){
        this.$refs.loginForm.validate((valid) => {
          //loginItem: window.getuiCID
          this.fullscreenLoading = true
          let that = this
          if (valid) {
            //alert('submit')

            userApi.login(
              this.loginForm.mobile,
              this.loginForm.vcode,
            ).then((result)=>{
              that.afterLogin(result)
            }).catch((result)=>{
              console.log(result);
              setTimeout(() => {
                that.fullscreenLoading = false;
              }, 500);
              this.$message({
                type:'error',
                message:result.msg
              })
            })
          } else {
            this.$message({
              type:'error',
              message:'请正确填写登录信息'
            })
            console.log('error submit!!');
            return false;
          }
        });


      },
      requestImg(){

      },

      afterLogin(result){
        let that = this
        LocalCache.set('userInfo', result.data);
        LocalCache.set('sessionkey', result.data.sessionkey);
        let passwordValue;
        if(result.data.hasPassword){
          passwordValue = 1
        }else{
          passwordValue = 0
        }
        LocalCache.set('hasPassword',passwordValue)
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
        userApi.detail().then((result)=>{
          //console.log('detail',result.data);
          if(result.data.userDetail.idNumber){
            LocalCache.set('userDetail',result.data.userDetail)
          }else{
            LocalCache.set('userDetail',false)
          }
        });

        setTimeout(() => {
          that.fullscreenLoading = false;
        }, 1000);
      },

    },
    created(){


    },
    mounted(){
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../assets/sass/variable";
  .loginFormMain{
    width: 600px;
    margin: 0 auto;
    .el-form-item{
      width: 60%;
      margin: 0 auto 22px;
      .el-input{
        width: 100%;
      }
    }
  }
  .others,.dialog-footer{
    width: 60%;
    margin: 0 auto;
  }
  .dialog-footer{
    margin-bottom: 10px;
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

</style>
