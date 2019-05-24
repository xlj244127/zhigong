<template>
<div id="cert" class='container'>
  <common-tit :title="title" :type="true"></common-tit>
  <el-form  :inline="true" :model="certForm" class="certMain" ref="certForm" :rules='formRules'
    v-loading="submitLoading" element-loading-text="正在提交 "
  >
    <div class="certImgPart">
      <div class="upload fl">
        <div class="certTit">上传：<span>再次点击图片以修改</span></div>
        <div class="egFront">
          <div class="egTit fl">
            <p>身份证照片</p>
            <div>正面</div>
          </div>
          <el-upload
            class="avatar-uploader"
            :action="frontUpload"
            :show-file-list="false"
            :on-success="handleFrontSuccess"
            :before-upload="beforeFrontUpload"
            v-loading="loadingFront"
            accept="image/jpeg,image/png"
            element-loading-text="正在上传并读取身份证信息"
          >
            <div class="certCover"></div>
            <img v-if="frontUrl" :src="frontUrl" class="avatar" id="frontImg" :class="{shadow:frontStatus}" >
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <img :src="frontUrl" alt="" ref="frontImg" id="frontHidden">
          </el-upload>
        </div>
        <div class="egFront">
          <div class="egTit fl">
            <p>身份证照片</p>
            <div>反面</div>
          </div>
          <el-upload
            class="avatar-uploader"
            :action="backUpload"
            :show-file-list="false"
            :on-success="handleBackSuccess"
            accept=".jpg,.png"
            :before-upload="beforeBackUpload"
            v-loading="loadingBack"
            element-loading-text="正在上传身份证背面照"
          >
            <div class="certCover"></div>
            <img v-if="backUrl" :src="backUrl" class="avatar" :class="{shadow:backStatus}">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
      </div>
      <div class="example fl" ><!--v-if='egShow'-->
        <div class="certTit">示例：</div>
        <div class="egFront">
          <div class="egTit fl">
            <p>身份证照片</p>
            <div>正面</div>
          </div>
          <div class="egImg"><img :src="idFront" alt=""></div>
        </div>
        <div class="egBack">
          <div class="egTit fl">
            <p>身份证照片</p>
            <div>反面</div>
          </div>
          <div class="egImg"><img :src="idBack" alt=""></div>
        </div>
      </div>
    </div>
    <div class="tip">
      提示：上传身份证照可自动识别下列信息。请核对您的身份信息，如有误请重新上传身份证照片
    </div>
    <div class="form-input fl">
      <el-form-item label="姓名" :label-width="formLabelWidth" prop="name" >
        <el-input v-model="certForm.name" type="text" maxLength="11" auto-complete="off" ></el-input>
      </el-form-item>
      <el-form-item label="性别" prop='gender' :label-width="formLabelWidth">
        <el-radio-group v-model="certForm.gender">
          <el-radio :label='1'>男</el-radio><!--disabled-->
          <el-radio :label='2'>女</el-radio><!--disabled-->
        </el-radio-group>
      </el-form-item>
      <el-form-item label="民族" :label-width="formLabelWidth" prop="nation">
        <el-input v-model="certForm.nation" type="text" maxLength="11" auto-complete="off" ></el-input>
      </el-form-item>

      <el-form-item label="身份证号" :label-width="formLabelWidth" prop="idNumber">
        <el-input v-model="certForm.idNumber" type="text" maxLength="18" auto-complete="off" ></el-input>
      </el-form-item>
    </div>
   <div class="fr form-submit">
     <el-button type='primary' @click.prevent="back()">返 回</el-button>
     <el-button type='primary' @click.prevent="submitCert()">提 交</el-button>
   </div>
  </el-form>
</div>
</template>

<script>
  import commonTit from '@/components/common/commonTit'
  import idFront from '../../assets/img/id_front.png'
  import idBack from '../../assets/img/id_back.png'
  import { commonApi,uploadRoad,userApi } from "../../api";
  import { LocalCache } from "../../lib/utils";
  import { serverUrl } from "../../config";

  export default {
      inject:['reload'],
      name: "cert",
      data() {
        var validateName =(rule,value,callback)=>{
          if(!value){
            callback(new Error('请输入姓名'))
          } else {
            callback()
          }
        }
        var validateMale =(rule,value,callback)=>{
          if(!value){
            callback(new Error('请选择性别'))
          } else {
            callback()
          }
        }
        var validateNation =(rule,value,callback)=>{
          if(!value){
            callback(new Error('请输入民族'))
          } else {
            callback()
          }
        }
        var validateIdNumber =(rule,value,callback)=>{
          var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
          if(!value){
            callback(new Error('请输入身份证号'))
          } else if(!reg.test(value)){
            callback(new Error('请输入正确的身份证格式'))
          } else {
            callback()
          }
        }
        return {
          title:'填写认证信息',
          userId:'',
          frontUrl:'',
          backUrl:'',
          certForm:{
            gender:''
          },
          idFront:idFront,
          idBack:idBack,
          formLabelWidth:'120px',
          formRules: {
            name:[{trigger: 'blur', validator: validateName }],
            gender:[{trigger: 'blur', validator: validateMale }],
            nation:[{trigger: 'blur', validator: validateNation }],
            idNumber:[{trigger: 'blur', validator: validateIdNumber }],
          },
          disabled:true,
          frontUpload:'',
          backUpload:'',
          loadingFront:false,
          loadingBack:false,
          submitLoading:false,
          frontStatus:true,
          backStatus:true,
          egShow:true,
        }
      },
      components:{
        commonTit
      },
      methods: {
        back(){
          this.$router.go(-1)
        },
        loadingFrontClose(){
          setTimeout(() => {
            this.loadingFront = false;
          }, 500);
        },
        loadingBackClose(){
          setTimeout(() => {
            this.loadingBack = false;
          }, 500);
        },
        loadingSubmitClose(){
          setTimeout(() => {
            this.submitLoading = false;
          }, 500);
        },
        handleFrontSuccess(res, file) {
          this.imageUrl = URL.createObjectURL(file.raw);
          this.frontUrl=res.data.image;
          this.loadingFrontClose()
          this.frontStatus = false
        },
        handleBackSuccess(res, file) {
          this.licenseUrl = URL.createObjectURL(file.raw);
          console.log('handleBackSuccess',res,file);
          this.backUrl=res.data.image
          this.loadingBackClose()
          this.backStatus = false
        },
        beforeFrontUpload(file,raw) {
          this.loadingFront = true
          const isJPG = file.type === 'image/jpeg';
          const isPNG = file.type === 'image/png';
          const isLt2M = file.size / 1024 / 1024 < 2;
          if (!isJPG && !isPNG) {
            this.$message.error('上传图片必须是JPG/PNG 格式!');
            this.loadingFrontClose()
          }
          if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!');
            this.loadingFrontClose()
          }
          console.log('beforeFrontUpload',file);
          commonApi.uploadIdCard(file,'front').then((res)=>{
            console.log('front',res);
            let resData = res.data
            console.log(resData.image_status);
            if(resData.image_status!="normal"){
              this.$message({
                type:'error',
                message:'请上传更清晰，易识别的身份证正面照，以方便读取！'
              })
              this.certForm = resData
              this.loadingFrontClose()
            }else{
              this.$message({
                type:'success',
                message:'读取身份证信息成功！'
              })
              this.certForm = resData
              this.loadingFrontClose()
            }
            if(this.certForm.gender=="男"){
              this.certForm.gender = 1
            }else{
              this.certForm.gender = 2
            }
          }).catch((res)=>{
            this.$message({
              type:'error',
              message:res.msg
            })
            this.loadingFrontClose()
          })
          return (isJPG || isPNG) &&  isLt2M;
        },
        beforeBackUpload(file) {
          this.loadingBack = true
          const isJPG = file.type === 'image/jpeg';
          const isPNG = file.type === 'image/png';
          const isLt2M = file.size / 1024 / 1024 < 2;
          if (!isJPG && !isPNG) {
            this.$message.error('上传图片必须是JPG/PNG 格式!');
            this.loadingBackClose()
          }
          if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!');
            this.loadingBackClose()
          }
          return (isJPG || isPNG) &&  isLt2M;
        },
        decodeUnicode(str) {
          str = str.replace(/\\/g, "%");
          return unescape(str);
        },
        submitCert(){
          this.$refs.certForm.validate((valid) => {
            this.certForm.idPhotoFront = this.frontUrl
            this.certForm.idPhotoBack  = this.backUrl
            let companyInfo = LocalCache.get('companyInfo')
            if(!this.userId){
              let userInfo = LocalCache.get('userInfo')
              this.userId =userInfo.id;
            }
            this.certForm.id  = this.$route.params.id
            this.certForm.companyId  = companyInfo.companyId
            let that = this
            if (valid) {
              this.submitLoading = true
              userApi.changeIdcard (
                this.certForm
              ).then((result)=>{
                console.log(result);
                userApi.detail().then((result)=>{
                  LocalCache.set('userInfo', result.data);
                  this.$message({
                    type:'success',
                    message:"个人认证保存成功！"
                  });
                  that.loadingSubmitClose()
                  that.submitLoading = false
                  userApi.detail().then((result)=>{
                    //console.log('detail',result.data);
                    if(result.data.userDetail.idNumber){
                      LocalCache.set('userDetail',result.data.userDetail)
                    }else{
                      LocalCache.set('userDetail',false)
                    }
                    that.reload()
                    if(this.userId == this.$route.params.id){
                      that.$router.push({path:'/cert/index'})
                    }else{
                      that.$router.go(-1)
                    }

                  });
                  //
                }).catch((result)=>{
                  console.log(result);
                  this.$message({
                    close:true,
                    type:'error',
                    message:result.msg,
                  })
                  that.submitLoading = false
                })

              }).catch((res)=>{
                this.$message({
                  type:'error',
                  message:res.msg
                })
                that.submitLoading = false
              })
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        }
      },
      beforeMount(){
        let userInfo = LocalCache.get('userInfo'),
            userDetail = LocalCache.get('userDetail');
            this.userId =userInfo.id;

        if(this.$route.params.id == userInfo.id){
          this.userName =userInfo.name;
          this.certForm.gender = userInfo.gender;
          if(userDetail != false){
            this.frontUrl = userDetail.idPhotoFront;
            this.backUrl = userDetail.idPhotoBack;
            this.certForm.name = userInfo.name;
            this.certForm.nation = userDetail.nation;
            this.certForm.gender = userInfo.gender;
            console.log(this.certForm.name,this.certForm.gender);
            this.certForm.idNumber = userDetail.idNumber;
          }
        }else{
          userApi.userDetail(this.$route.params.id).then((res)=>{
            console.log('others userDetail',res.data);
            this.userName =res.data.name;
            this.certForm.gender = res.data.gender;
            this.frontUrl = res.data.userDetail.idPhotoFront;
            this.backUrl = res.data.userDetail.idPhotoBack;
            this.certForm.name = res.data.name;
            this.certForm.nation = res.data.userDetail.nation;
            this.certForm.gender = res.data.gender;
            console.log(this.certForm.name,this.certForm.gender);
            this.certForm.idNumber = res.data.userDetail.idNumber;

          }).catch((res)=>{
            this.$message.error(res.msg)
          })
        }
        this.frontUpload = uploadRoad.idCard()
        this.backUpload = uploadRoad.image()
        this.egShow = false
      }
    }
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../assets/sass/variable";
  .el-form{
    padding-top: 40px;
    overflow: hidden;
  }
  .el-form-item{
    width: 80%;
    margin: 0 auto 22px;
  }
  .el-select{
    width: 100%;
  }
  .avatar-uploader{
    height: 218px;
    width: 378px;
    float: left;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    .certCover{
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0,0,0,0);
    }
    .shadow{
      -ms-filter: blur(5px);
      filter: blur(5px);
    }
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .el-upload{
    overflow: hidden;
    -webkit-border-radius: 6px;
    -moz-border-radius: 6px;
    border-radius: 6px;
    width: 378px;
    height: 218px;

    img{
      width: 378px;
      height: 218px;
      -webkit-border-radius: 6px;
      -moz-border-radius: 6px;
      border-radius: 6px;


    }
  }
  .avatar-uploader-icon {
    font-size: 28px;
    width: 378px;
    height: 218px;
    line-height: 218px;
    text-align: center;
    color: $optBlue;
    -webkit-border-radius: 6px;
    -moz-border-radius: 6px;
    border-radius: 6px;
    overflow: hidden;
  }
  .certMain{
    width: 94%;
    margin: 0 auto;
  }
  .certTit{
    text-align: left;
    span{
      font-size: 14px;
      color: #999999;
      margin-left: 229px;
    }
  }
  .upload,.example{
    width: 50%;
  }
  .egFront,.egBack{
    padding-top: 10px;
    overflow: hidden;
    padding-bottom: 10px;
  }

  .egTit{
    padding-top: 80px;
    padding-left: 8%;
    padding-right: 5%;
    p{
      font-size: 16px;
      line-height: 32px;
    }
    div{
      font-size: 14px;
      line-height: 26px;
    }
  }

  .egImg{
    float: left;
    width: 378px;
    height: 218px;
  }
  .certImgPart{
    padding-bottom: 20px;
    margin-bottom: 10px;
    border-bottom: $bd-d;
    overflow: hidden;
  }
  .tip{
    font-size: 12px;
    color: $c6;
    padding-bottom: 16px;
    text-align: left;
  }
  .form-input{
    width: 60%;
    text-align: left;
  }
  .el-button{
    padding: 12px 50px;
    margin-top: 200px;
    margin-top: 200px;
  }
  .avatar-uploader{
    position: relative;
  }
  #frontHidden{
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
  }
</style>
