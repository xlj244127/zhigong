<template>
  <div class="container"

  >
    <common-tit :title="title" :type="true"></common-tit>
    <el-form :model="createForm" label-width="120px" ref="createForm" :rules='formRules'
             v-loading="loadingSubmit" element-loading-text="正在提交 "
    >
      <div class='w50p fl'>
        <el-form-item   label="公司全称" prop="name">
          <el-input v-model="createForm.name"></el-input>
        </el-form-item>
        <el-form-item   label="所属行业" prop="profession">
          <el-select v-model="createForm.profession" placeholder="请选择所属行业" @change="changeTrade()">
            <el-option v-for = '(item,index) in tradeList' :key="item.code" :label='item.value' :value='item.code'></el-option>
          </el-select>

        </el-form-item>
        <el-form-item   label="用工规模" prop="dimension">
          <el-select v-model="createForm.dimension" placeholder="请选择用工规模" @change="changeScale()">
            <el-option v-for = '(item,index) in scaleList' :key="item.code" :label='item.value' :value='item.code'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item   label="联系人" prop="contact">
          <el-input v-model="createForm.contact"></el-input>
        </el-form-item>
        <el-form-item   label="联系电话" prop="mobile">
          <el-input v-model="createForm.mobile"></el-input>
        </el-form-item>
        <el-form-item   label="公司详细地址" prop="detailAddress">
          <el-input v-model="createForm.detailAddress"></el-input>
        </el-form-item>
        <el-form-item   label="办公电话" >
          <el-input v-model="createForm.phone"></el-input>
        </el-form-item>
        <el-form-item   label="联系邮箱" prop="email">
          <el-input v-model="createForm.email"></el-input>
        </el-form-item>
        <el-form-item   label="公司官网">
          <el-input v-model="createForm.homepage"></el-input>
        </el-form-item>

      </div>
      <div class="w50p fr">
        <div class="uploadLogo">上传公司LOGO</div>
        <el-upload
          class="avatar-uploader logo-uploader"
          :action="uploadRoad"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          accept="image/png,image/jpeg"
          :before-upload="beforeLogoUpload"
          v-loading="loadingLogo"
          element-loading-text="正在上传logo"
        >
          <img v-if="imageUrl" :src="imageUrl" class="logoImg">
          <div v-else class='logoTxt'>
            点击上传<br>LOGO
          </div>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过5MB</div>
        </el-upload>
        <el-upload
          class="avatar-uploader license-uploader"
          :action="uploadRoad"
          :show-file-list="false"
          :on-success="handleLicenseSuccess"
          accept="image/jpeg,image/png"
          :before-upload="beforeLicenseUpload"
          v-loading="loadingLicense"
          element-loading-text="正在上传营业执照"
        >
          <img v-if="licenseUrl" :src="licenseUrl" class="license">
          <div class="licenseBox" v-else>
            <i class="el-icon-plus avatar-uploader-icon"></i>
            <span>点击上传营业执照</span>
          </div>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过5MB</div>
        </el-upload>
      </div>
    </el-form>
    <div class="button">
      <el-button type='primary' @click.prevent="saveInfo()">提　交</el-button>
    </div>

  </div>
</template>

<script>
  import commonTit from '@/components/common/commonTit'
  import { userApi,companyApi,dviApi,uploadRoad } from '../../api/index'
  import { LocalCache } from "../../lib/utils";
    export default {
      name: "createCompany",
      components:{
        commonTit
      },
        data() {
          var  validateMobile=(rule,value,callback)=>{
            const reg= /^(0|86|17951)?(13[0-9]|15[0-9]|17[678]|18[0-9]|14[0-9]|16[0-9]|19[0-9])[0-9]{8}$/;
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
          var validateName =(rule,value,callback)=>{
            if(!value){
              callback(new Error('请输入公司名'))
            } else {
              callback()
            }
          }
          var validateContact =(rule,value,callback)=>{
            if(!value){
              callback(new Error('请输入联系人'))
            } else {
              callback()
            }
          }
          var validateDetailAddress =(rule,value,callback)=>{
            if(!value){
              callback(new Error('请输入详细地址'))
            } else {
              callback()
            }
          }
          var validateMail =(rule,value,callback)=>{
            var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
            if(!value){
              callback(new Error('请输入邮箱地址'))
            }else if(!reg.test(value)){
              callback(new Error('请输入正确格式的邮箱地址'))
            }else{
              callback()
            }
          }
            return {
              title:'修改企业信息',
              createForm:{
                name:'',
                contacts:'',
                mobile:'',
                phone:'',
                address:'',
                tel:'',
                mail:'',
                dimension:'',
                profession:'',

              },
              formRules: {
                name:[{trigger:'blur',validator:validateName}],
                profession: [{ required: true, message: '请选择行业', trigger: 'change' }],
                dimension: [{ required: true, message: '请选择用工规模', trigger: 'change' }],
                mobile:[{trigger: 'blur', validator: validateMobile }],
                contact:[{trigger: 'blur', validator: validateContact }],
                detailAddress:[{trigger: 'blur', validator: validateDetailAddress }],
                email:[{trigger: 'blur', validator: validateMail }],
              },
              options2: [],
              props: {
                value: 'label',
                children: 'cities'
              },
              selectedOptions: [],
              imageUrl: '',
              scaleList:[],
              tradeList:[],
              licenseUrl:'',
              loadingSubmit:false,
              loadingLogo:false,
              loadingLicense:false,
              uploadRoad:''
            }
        },
        methods: {
          changeTrade(){
            this.tradeList=this.tradeList.slice(0);
          },
          changeScale(){
            this.scaleList=this.scaleList.slice(0);
          },
          submit(){
            this.$router.push({path:'/information/index'})
          },
          loadingLogoClose(){
            setTimeout(() => {
              this.loadingLogo = false;
            }, 500);
          },
          loadingLicenseClose(){
            setTimeout(() => {
              this.loadingLicense = false;
            }, 500);
          },
          loadingSubmitClose(){
            setTimeout(() => {
              this.loadingSubmit = false;
            }, 500);
          },
          handleAvatarSuccess(res, file) {
            this.loadingLogoClose()
            this.imageUrl =  res.data.image;
          },
          handleLicenseSuccess(res, file) {
            console.log('LicenseSuccess',res);
            this.loadingLicenseClose()
            this.licenseUrl = res.data.image;
          },
          beforeLogoUpload(file) {
            this.loadingLogo = true ;
            const isJPG = file.type === 'image/jpeg';
            const isPNG = file.type === 'image/png';
            const isLt5M = file.size / 1024 / 1024 < 5;
            if (!isJPG && !isPNG) {
              this.loadingLogoClose()
              this.$message.error('上传图片必须是JPG/PNG 格式!');
            }
            if (!isLt5M) {
              this.loadingLogoClose()
              this.$message.error('上传头像图片大小不能超过 5MB!');
            }
            return (isJPG || isPNG) &&  isLt5M;
          },
          beforeLicenseUpload(file) {
            this.loadingLicense = true ;
            const isJPG = file.type === 'image/jpeg';
            const isPNG = file.type === 'image/png';
            const isLt5M = file.size / 1024 / 1024 < 5;
            if (!isJPG && !isPNG) {
              this.loadingLicenseClose()
              this.$message.error('上传图片必须是JPG/PNG 格式!');
            }
            if (!isLt5M) {
              this.loadingLicenseClose()
              this.$message.error('上传头像图片大小不能超过 5MB!');
            }
            return (isJPG || isPNG) &&  isLt5M;
          },
          saveInfo(){

           this.$refs.createForm.validate((valid) => {
             if (valid) {
               this.loadingSubmit = true
               companyApi.create (
                 this.createForm.name,
                 this.createForm.detailAddress,
                 this.createForm.contact,
                 this.createForm.mobile,
                 this.createForm.phone,
                 this.imageUrl,
                 this.licenseUrl,
                 this.createForm.dimension,
                 this.createForm.profession,
                 this.createForm.email,
                 this.createForm.homepage
               ).then((result)=>{
                 console.log(result);
                 this.loadingSubmit = false
                 this.$router.push({path:'/create/infoChecking'});
               }).catch((res)=>{
                 console.log(res);
               })
             } else {
               console.log('error submit!!');
               return false;
             }
           });


          }
        },
        mounted(){
        this.uploadRoad = uploadRoad.image();
        this.tradeList =LocalCache.get('tradeList')
        this.scaleList =LocalCache.get('scaleList')
        }


    }
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../assets/sass/variable";
  .button{
    margin-top: 30px;
  }
  .el-form{
    padding-top: 40px;
    padding-bottom: 40px;
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
    width: 80%;
    margin: 0 auto;
  }
  .avatar-uploader .el-upload {
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 40px;
    color: #8c939d;
    width: 360px;
    text-align: center;
    padding-top: 56px;
    padding-bottom: 18px;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .w50p.fr{
    height:  558px;
  }
  .button{
    margin-top: 20px;
    .el-button{
      padding: 12px 40px;
      font-size: 16px;
    }
  }
  .avatar-uploader{
    font-size: 18px;
    line-height: 26px;
    text-align: center;
    &.el-upload{

    }
  }
  .logoImg{
    width: 158px;
    height: 158px;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    border: 3px solid #eee;
  }
  .logoTxt{
    padding-top: 53px;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    border: 3px solid #eee;
    width: 158px;
    height: 105px;
  }
  .uploadLogo{
    margin-bottom: 20px;
  }
  .el-upload__tip{
    font-size: 12px;
    line-height: 20px;
    margin-top: 20px;
    color: $c9;
  }
  .w50p.fl{
    width: 49%;
    border-right: $bd-e;
  }
  .licenseBox,.license{
    width: 360px;
    height: 200px;
    border: 3px dashed #e5e9ee;
    text-align: center;
    -webkit-border-radius: 12px;
    -moz-border-radius: 12px;
    border-radius: 12px;
  }
  .license-uploader{
    border-top: 1px solid #eee;
    padding-top: 20px;
    margin-top: 20px;
  }

</style>
