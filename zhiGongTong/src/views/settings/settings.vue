<template>
    <div class="settings container">
      <common-tit :title='title'></common-tit>
      <div class="settingMain">
        <div class="lastLoginTime">上次登录时间：{{lastLoginTime}}</div>
        <div class="settingInner">
          <div class="item">
            <div class="fl">
              <div class="imgBox"
                   v-loading = 'loadingAvatar'
              ><img :src="avatar" alt=""></div>
              <div class="avatarInfo">请上传jpg/png格式图片，文件需小于5M</div>
            </div>
            <div class="fr">
              <div class='change'>
               <el-upload
                 class="upload-demo"
                 :action="avatarUpload"
                 :show-file-list="false"
                 :on-success="handleAvatarSuccess"
                 :before-upload="beforeAvatarUpload"
                 :data='commonData'
                 :with-credentials='withCredentials'
               >
                 <span>修改头像</span>
               </el-upload>

             </div>
              <!--<div class="change uploadPart">
                <label for="uploadFile" >上传头像</label>
                <input type="file" accept="image/png, image/jpeg" id="uploadFile" ref='uploadFile' @change="uploading">
              </div>-->
            </div>
          </div>
          <div class="item">
            <div class="fl">
              <div class="fontBox">登录密码</div>
              <div class="avatarInfo">设置密码，进行账号密码登录</div>
            </div>
            <div class="fr">
              <div class='change'><span v-if="!hasPassword" class="setPwd" @click.prevent='setPwd'>设置</span><span v-else @click.prevent='changePwd'>修改</span></div>
            </div>
          </div>
          <div class="item">
            <div class="fl">
              <div class="fontBox">手机绑定</div>
              <div class="avatarInfo">您已绑定手机{{bindMobile}}</div>
            </div>
            <div class="fr">
              <div @click.prevent="changeMobile" class='change'><span>修改</span></div>
            </div>
          </div>
        </div>
        <el-dialog :visible.sync="setPwdVisible" title="设置登录密码" class="settingDialog" >
          <div class="tip">请设置密码，方便您下次进行账号密码登录</div>
          <el-form :model='setPassword' :rules='setPasswordRules' ref="setPassword">
            <el-form-item >
              <el-input v-model="mobile" auto-complete="off" disabled></el-input>
            </el-form-item>
            <el-form-item class="pwdChangeView password">
              <el-input v-model="setPassword.password" auto-complete="off" :type="passwordType"></el-input>
              <div class="pwdTip"><span>*</span>字母，符号或数字，至少8位字符</div>
              <div class='changeType' @click.prevent="changeType"  alt="">
                <img v-if="eyeStatus==1" :src="eyeOpen" alt="">
                <img v-else :src="eyeClose" alt="">
              </div>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click.prevent="submitSetPassword">提交</el-button>
          </div>
        </el-dialog>
        <el-dialog :visible.sync="changePwdVisible" title="修改登录密码" class="changePwdDialog settingDialog">
          <el-form :model='changePassword' ref="changePassword" :rules="changePasswordRules">
            <el-form-item :label-width='labelWidth' label='旧密码' prop="oldPwd">
              <el-input v-model="changePassword.oldPwd" auto-complete="off" type="password" placeholder='请输入旧密码'>
                <template slot="append">
                  <router-link :to="{path:'/login/forgetPwd/'}">忘记密码</router-link>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item :label-width='labelWidth' label='新密码' class="pwdChangeView password changePwd" prop="newPwd">
              <el-input v-model="changePassword.newPwd" auto-complete="off" :type="passwordType" placeholder='请输入新密码'>
                <template slot="append"><div class="pwdTip"><span>*</span>字母，符号或数字，至少6位字符</div></template>
              </el-input>
              <div class='changeType' @click.prevent="changeType"  alt="">
                <img v-if="eyeStatus==1" :src="eyeOpen" alt="">
                <img v-else :src="eyeClose" alt="">
              </div>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click.prevent="submitChangePassword()">提交</el-button>
          </div>
        </el-dialog>
        <el-dialog :visible.sync="changeMobileVisible" title="修改绑定手机" class="changeMobileDialog settingDialog">
          <el-form :model='changeMobileObj' ref="changeMobileObj"  :rules='changeMobileRules'>
            <el-form-item prop='oldMobile'>
              <el-input v-model="changeMobileObj.oldMobile" auto-complete="off" disabled>
              </el-input>
            </el-form-item>
            <el-form-item prop='oldCode'>
              <el-input v-model="changeMobileObj.oldCode" auto-complete="off" type="number" placeholder="请输入验证码">
                <el-button slot="append" @click.prevent="getOldCode()" :disabled='oldDisabled'>{{getOldTxt}}</el-button>
              </el-input>
            </el-form-item>
            <el-form-item prop='newMobile'>
              <el-input v-model="changeMobileObj.newMobile" auto-complete="off" type="number">
              </el-input>
            </el-form-item>
            <el-form-item prop='newCode'>
              <el-input v-model="changeMobileObj.newCode" auto-complete="off" type="number" placeholder="请输入验证码">
                <el-button slot="append" @click.prevent="getNewCode()" :disabled='newDisabled'>{{getNewTxt}}</el-button>
              </el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click.prevent="submitChangeMobile">提交</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
</template>

<script>
  import commonTit from '@/components/common/commonTit';
  import {LocalCache} from "../../lib/utils";
  import {userApi,uploadRoad} from "../../api";
  import eyeClose from '../../assets/img/eye_close.png'
  import eyeOpen from '../../assets/img/eye_open.png'
  import md5 from 'js-md5'
  import {common} from "../../lib/common";
  import {version,channel,serverUrl} from "../../config";

  export default {
      name: "",
      components:{
        commonTit
      },
      data() {
        var  validateMobile=(rule,value,callback)=>{
          const reg= /^(0|86|17951)?(13[0-9]|15[0-9]|17[678]|18[0-9]|14[0-9]|16[0-9]|19[0-9])[0-9]{8}$/
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
        var validatePassword = (rule,value,callback)=>{
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
            title:"设置中心",
            lastLoginTime:'2017-03-08 19:55:33',
            avatar:'',
            setPwdVisible:false,
            changePwdVisible:false,
            changeMobileVisible:false,
            mobile:'',
            bindMobile:'',
            setPassword:{},
            changePassword:{},
            labelWidth:"30%",
            changeMobileObj:{},
            oldDisabled:false,
            newDisabled:false,
            getOldTxt:'获取验证码',
            getNewTxt:'获取验证码',
            oldCount:'59',
            newCount:'59',
            changeMobileRules: {
              oldMobile: [{  trigger: 'blur', validator: validateMobile }],
              newMobile: [{  trigger: 'blur', validator: validateMobile }],
              oldCode:[{  trigger:'blur',validator:validateVeri}],
              newCode:[{  trigger:'blur',validator:validateVeri}]
            },
            changePasswordRules:{
              oldPwd:[{  trigger:'blur',validator:validatePassword}],
              newPwd:[{  trigger:'blur',validator:validatePassword}]
            },
            setPasswordRules:{
              password:[{  trigger:'blur',validator:validatePassword}]
            },
            hasPassword:true,
            eyeOpen:eyeOpen,
            eyeClose:eyeClose,
            passwordType:'password',
            eyeStatus:2,
            avatarUpload:'',
            loadingAvatar:false,
            commonData:{
              sessionkey:'',
              channel:'',
              version:'',
              timestamp:'',
              sign:''
            },
            withCredentials:true,
          }
      },
      methods: {
        getOldCode(){
          const TIME_COUNT = 59,
                mobile =this.changeMobileObj.oldMobile;
          this.$refs.changeMobileObj.validateField('oldMobile',(valid) => {
            if(valid==''){
              if (!this.timer) {
                this.oldCount = TIME_COUNT;
                this.getOldTxt = '重新发送(60s)'
                userApi.sendMessage(
                  mobile
                ).then((result)=>{
                  if(result.code==0){
                    this.$message({
                      type:'success',
                      message:'短信发送成功！'
                    })
                  }
                  this.timer = setInterval(() => {if (this.oldCount > 0 && this.oldCount <= TIME_COUNT) {
                    this.getOldTxt = '重新发送('+this.oldCount+'s)'
                    this.oldCount--;
                    this.oldDisabled=true
                  } else {
                    this.getOldTxt = '重新获取验证码';
                    clearInterval(this.timer);
                    this.timer =null;
                    this.oldDisabled=false;
                    this.oldCount = '59';
                  }}, 1000)
                  console.log(result);
                });
              }
            }
          })
        },
        getNewCode(){
          const TIME_COUNT = 59,
            mobile =this.changeMobileObj.newMobile;
          this.$refs.changeMobileObj.validateField('newMobile',(valid) => {
            if(valid==''){
              if (!this.newTimer) {
                this.newCount = TIME_COUNT;
                this.getNewTxt = '重新发送(60s)'
                userApi.sendMessage(
                  mobile
                ).then((result)=>{
                  if(result.code==0){
                    this.$message({
                      type:'success',
                      message:'短信发送成功！'
                    })
                  }
                  this.newTimer = setInterval(() => {if (this.newCount > 0 && this.newCount <= TIME_COUNT) {
                    this.getNewTxt = '重新发送('+this.newCount+'s)'
                    this.newCount--;
                    this.newDisabled=true
                  } else {
                    this.getNewTxt = '重新获取验证码';
                    clearInterval(this.newTimer);
                    this.newTimer =null;
                    this.newDisabled=false;
                    this.newCount = '59';
                  }}, 1000)
                  console.log(result);
                  //console.log(JSON.stringify(result));
                });
              }
            }
          })
        },
        uploading(){
          let file = this.$refs.uploadFile.files[0],
              that = this;
          if(file){
            console.log(100);
            const isJPG = file.type === 'image/jpeg';
            const isPNG = file.type === 'image/png';
            const isLt5M = file.size / 1024 / 1024 < 5;
            let imageType ;
            if (!isJPG && !isPNG) {
              this.$message.error('上传图片必须是JPG/PNG 格式!');
              return false
            }
            if (!isLt5M) {
              this.$message.error('上传头像图片大小不能超过 5MB!');
              return false
            }
            if(isJPG){
              imageType = "image/jpeg"
            }
            if(isPNG){
              imageType = "image/png"
            }
            let data = common.getBase64ImageData(that.$refs.uploadFile)
            console.log(that.$refs.uploadFile);
            userApi.changeAvatar(
              data,
              imageType
            ).then((result)=>{
              console.log(result);
            }).catch((res)=>{
              console.log(res);
            })
          }else{
            this.$message({
              type:'error',
              message:'请选择一张大小不超过5M、格式为png/jpg图片上传'
            })
          }
        },
        logOut(){
          userApi.logOutWeb().then((res)=>{
            LocalCache.del('userInfo');
            LocalCache.del('userDetail');
            LocalCache.del('companyInfo');
            LocalCache.del('scaleList');
            LocalCache.del('tradeList');
            LocalCache.del('setPwd');
            LocalCache.del('sessionkey');
            LocalCache.del('hasPassword');
            this.$message({
              type: 'success',
              message: '登出成功!'
            });
            console.log(res);
            this.$router.push({path:'/login/index/'})
          }).catch((res)=>{
            this.$message({
              type: 'error',
              message: res.msg
            });
          })
        },
        changeType(){
          if(this.eyeStatus===1){
            this.eyeStatus = 2
            this.passwordType = "password"
          }else{
            this.eyeStatus = 1
            this.passwordType = "text"
          }
          console.log(this.eyeStatus,this.passwordType);
        },
        submitChangeMobile(){
          let that = this
          this.$refs.changeMobileObj.validate((valid) => {
            if (valid) {
              //alert('submit')
              userApi.ChangeMobile(
                that.changeMobileObj.newMobile,
                that.changeMobileObj.oldCode,
                that.changeMobileObj.newCode,
              ).then((result)=>{
                //console.log(result);
                if(result.code=="0"){
                  that.logOut()
                }else{
                  that.$message({
                    type:'error',
                    message:result.msg
                  })
                }

              }).catch((result)=>{
                //console.log('error',result);
                that.$message({
                  type:'error',
                  message:result.msg
                })
              })
            } else {
              console.log('error submit!!');
              return false;
            }
          })
        },
        submitChangePassword(){
          let that = this
          console.log('start changePassword')
          this.$refs.changePassword.validate((valid) => {
            if (valid) {
              console.log(100);
              userApi.setPasssword(
                that.changePassword.newPwd,
                md5(that.changePassword.oldPwd),
              ).then((result)=>{
                console.log(result);
                if(result.code=="0"){
                  that.logOut()
                }else{
                  that.$message({
                    type:'error',
                    message:result.msg
                  })
                }
              }).catch((result)=>{
                console.log(result);
                that.$message({
                  type:'error',
                  message:result.msg
                })
              })
            } else {
              console.log('error submit!!');
              return false;
            }
          })
        },
        setPwd(){
          this.setPwdVisible = true;
        },
        changePwd(){
          this.changePwdVisible = true;
        },
        changeMobile(){
          this.changeMobileVisible = true;
        },
        submitSetPassword(){
          this.$refs.setPassword.validate((valid) => {
            if (valid) {
              if (valid) {
                userApi.setPasssword(
                  this.setPassword.password,
                ).then((result)=>{
                  LocalCache.set('hasPassword',true)
                  this.hasPassword= true
                  this.setPwdVisible = false
                  this.$message({
                    type:'success',
                    message:"设置密码成功！"
                  })
                })
              } else {
                this.$message.error('提交参数错误！')
                return false;
              }
            } else {
              console.log('error submit!!');
              return false;
            }
          })
        },
        handleAvatarSuccess(res, file){
          console.log('handleAvatarSuccess',res);
          if(res.code==0){
            this.avatar  = res.data
            userApi.detail().then((res)=>{
              console.log(res);
              LocalCache.set('userInfo',res.data)
            })
            this.$store.state.avatar = res.data
          } else {
            this.$message({
              type:'error',
              message:res.msg
            })
          }
          this.loadingAvatar = false
        },
        beforeAvatarUpload(file){
          this.loadingAvatar = true;
          console.log(file);
          const isJPG = file.type === 'image/jpeg';
          const isPNG = file.type === 'image/png';
          const isLt5M = file.size / 1024 / 1024 < 5;
          if (!isJPG && !isPNG) {
            this.$message.error('上传图片必须是JPG/PNG 格式!');
            return false
          }
          if (!isLt5M) {
            this.$message.error('上传头像图片大小不能超过 5MB!');
            return false
          }
          return (isJPG || isPNG) &&  isLt5M;

        }

      },
      beforeMount(){
        this.hasPassword = LocalCache.get('hasPassword');
        this.commonData.channel = channel
        this.commonData.version = version
        this.commonData.timestamp = new Date().getTime()
        this.commonData.sessionkey = LocalCache.get('sessionkey')
        let hasPassword = LocalCache.get('hasPassword')
        if(hasPassword<=0){
          this.hasPassword = false
          this.mobile = LocalCache.get('userInfo').mobile;
        }
      },
      mounted(){
        this.avatar = LocalCache.get('userInfo').avatar
        this.avatarUpload = uploadRoad.changeAvatar();

        console.log(this.commonData);
        //console.log(uploadRoad.changeAvatar());
        this.changeMobileObj.oldMobile = LocalCache.get('userInfo').mobile;
        this.mobile = LocalCache.get('userInfo').mobile;
        this.bindMobile = LocalCache.get('userInfo').mobile.replace(/^(\d{4})\d{4}(\d+)/,"$1****$2");
      }
    }
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../assets/sass/variable";
  .settingMain{
    width: 90%;
    margin: 20px auto;
    .lastLoginTime{
      text-align: right;
      font-size: 14px;
      line-height: 26px;
      color: $c6;
    }
    .settingInner{
      border: $bd-d;
      .item{
        overflow: hidden;
        padding: 13px 30px 7px;
        height: 100px;
        border-bottom: $bd-d;
        &:last-child{
          border-bottom: none;
        }
        .change{
          color: #32709F;
          line-height: 94px;
          span{
            cursor: pointer;
          }
        }
        .uploadPart{
          width: 64px;

          overflow: hidden;
          position: relative;
          label{
            position: absolute;
            top: 0;
            left: 0;
            background: #ffffff;
          }
        }
        .fontBox{
          line-height: 40px;
          text-align: left;
          color: $fontBlue;
          padding-top: 10px;
        }
        .imgBox{
          background: #eeeeee;
          -webkit-border-radius: 50%;
          -moz-border-radius: 50%;
          border-radius: 50%;
          overflow: hidden;
          display: block;
          width: 60px;
          height: 60px;
          img{
            width: 60px;
            height: 60px;
          }
        }
        .avatarInfo{
          font-size: 14px;
          line-height: 34px;
        }
      }
    }
  }
  .tip{
    font-size: 16px;
    line-height: 80px;
    text-align: center;
    color: #666666;
  }
  .settingDialog{
    .el-input{
      width: 42%;
      margin: 0 auto;
    }
    .dialog-footer .el-button{
      width: 20%;
    }
    .pwdTip{
      font-size: 14px;
      color: #999999;
      padding-left: 32.5%;
      text-align:left;
      span{
        color: $fontRed;
        font-size: 20px;
        margin-top: 15px;
        float: left;
        margin-right: 4px;
        line-height: 20px;
      }
    }
  }
  .changePwdDialog{
    .el-form{
      padding-top: 30px;
      padding-bottom: 30px;
    }
    .el-input{
      float: left;
      width: 75%;
    }
    .pwdTip{
      padding-left: 0;
    }

  }
  .password .changeType{
    right: 30%;
  }
  .changePwd .changeType{
    right: 56%;
  }
</style>
