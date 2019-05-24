<template>
  <div class="container">
    <common-tit :title="title" :type="true"></common-tit>
    <el-form :model="editForm" label-width="120px" ref="editForm" :rules='formRules'>
      <div class='w50p fl'>
        <el-form-item   label="公司全称" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item   label="所属行业" prop="trade">
          <el-select v-model="editForm.trade" placeholder="请选择所属行业" @change="changeTrade()">
            <el-option v-for = '(item,index) in tradeList' :key="item.code" :label='item.value' :value='item.code'></el-option>
          </el-select>

        </el-form-item>
        <el-form-item   label="用工规模" prop="scale">
          <el-select v-model="editForm.scale" placeholder="请选择用工规模" @change="changeScale()">
            <el-option v-for = '(item,index) in scaleList' :key="item.code" :label='item.value' :value='item.code'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item   label="联系人" prop="contact">
          <el-input v-model="editForm.contact"></el-input>
        </el-form-item>
        <el-form-item   label="联系电话" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
        <el-form-item   label="公司详细地址" prop="detailAddress">
          <el-input v-model="editForm.detailAddress"></el-input>
        </el-form-item>
        <el-form-item   label="办公电话" >
          <el-input v-model="editForm.phone"></el-input>
        </el-form-item>
        <el-form-item   label="联系邮箱" >
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item   label="公司官网">
          <el-input v-model="editForm.homepage"></el-input>
        </el-form-item>

      </div>
      <div class="w50p fr">
        <div class="uploadLogo">上传LOGO</div>
        <div v-loading="uploadLoading">
          <img v-if="imageUrl" :src="imageUrl" class="avatar" >
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </div>

        <el-upload
          class="avatar-uploader"
          :action="uploadUrl"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          accept="image/png,image/jpeg"
        >
          <el-button  type="primary" >点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
        <!--<div class="IEupload" v-else>
          <label for="ieButton" class="el-button">点击上传2</label>
          <input type="file" accept="image/png,image/jpeg" @change='ieUpload(this)' ref="fileReceive" id='ieButton'>
        </div>-->
      </div>
    </el-form>
    <div class="button">
      <el-button type='primary' @click.prevent="saveInfo()">提　交</el-button>
    </div>
  </div>
</template>

<script>
  import commonTit from '@/components/common/commonTit'
  import { companyApi,uploadRoad,ieVersion,commonApi } from '../../api'
  import { LocalCache } from "../../lib/utils"
  export default {
      name: "editInfo",
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
          var validateName =(rule,value,callback)=>{
            if(!value){
              callback(new Error('请输入公司名'))
            } else {
              callback()
            }
          }
          var validateTrade =(rule,value,callback)=>{
            if(!value){
              callback(new Error('请选择行业'))
            } else {
              callback()
            }
          }
          var validateScale =(rule,value,callback)=>{
            if(!value){
              callback(new Error('请选择规模'))
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
            return {
              title:'修改企业信息',
              editForm:{
                name:'',
                trade:'',
                scale:'',
                contacts:'',
                mobile:'',
                address:'',
                tel:'',
                mail:'',
                address:''
              },
              formRules: {
                name:[{trigger:'blur',validator:validateName}],
                trade:[{trigger:'blur',validator:validateTrade}],
                scale:[{trigger: 'blur', validator: validateScale }],
                mobile:[{trigger: 'blur', validator: validateMobile }],
                contact:[{trigger: 'blur', validator: validateContact }],
                detailAddress:[{trigger: 'blur', validator: validateDetailAddress }],
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
              logoUpload:'',
              uploadLoading:false,
              acceptType:'image/jpeg,image/png',
              params:{
                key:''
              },
              uploadUrl:'',
              ieJudgeResult:false,
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
          clickUpload(){
            console.log(1);
          },
          handleAvatarSuccess(res, raw) {
            console.log('handleAvatarSuccess',res,raw);
            this.imageUrl = res.data.image;
            this.editForm.logo = res.data.image;
            setTimeout(() => {
              this.uploadLoading = false;
            }, 500);
          },
          beforeAvatarUpload(file) {
            console.log(100);
            console.log(file);
            this.uploadLoading=true;
            this.uploadUrl = uploadRoad.image();
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;
            const isPNG = file.type === 'image/png';
            if (!isJPG && !isPNG) {
              this.$message.error('上传头像图片只能是 jpg/png 格式!');
            }
            if (!isLt2M) {
              this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return (isJPG || isPNG) && isLt2M;
          },
          ieUpload(){
            this.uploadLoading = true
            console.log(this.$refs.fileReceive.files[0]);
            commonApi.uploadImage(this.$refs.fileReceive.files[0]).then((res)=>{
              this.imageUrl = res.data.image;
              this.editForm.logo = res.data.image;
              setTimeout(() => {
                this.uploadLoading = false;
              }, 500);
            })
          },
          saveInfo(){
            this.$refs.editForm.validate((valid) => {
              console.log(this.editForm.scale);
              console.log(this.editForm.trade);
              if (valid) {
                companyApi.editCompany (
                  this.companyId,
                  this.editForm.name,
                  this.editForm.detailAddress,
                  this.editForm.contact,
                  this.editForm.mobile,
                  this.editForm.phone,
                  this.editForm.logo,
                  this.editForm.license,
                  this.editForm.scale,
                  this.editForm.trade,
                  this.editForm.email,
                  this.editForm.homepage
                ).then((result)=>{
                  console.log(result);
                  this.$router.go(-1);
                })
              } else {
                console.log('error submit!!');
                return false;
              }
            });
          }
        },
        beforeMount(){
          this.uploadUrl=uploadRoad.image();
          if(ieVersion.judge()){
            this.ieJudgeResult = true
          }else{
            this.ieJudgeResult = false
          }
        },
        mounted(){
          let companyInfo = LocalCache.get('companyInfo');
          this.companyId = companyInfo.companyId;

          if(companyInfo.companyId!=0){
            companyApi.companyInfo(companyInfo.companyId).then((res)=>{
              console.log('companyInfo',res.data);
              this.$store.state.companyInfo = res.data
              this.editForm = res.data;
              this.imageUrl =  this.editForm.logo;
              this.scaleList = LocalCache.get('scaleList')
              this.tradeList = LocalCache.get('tradeList')
              console.log('dimension',this.scaleList);
              console.log('profession',this.tradeList);
              this.editForm.scale = this.scaleList[res.data.dimension-1].code;
              this.editForm.trade = this.tradeList[res.data.profession-1].code;
              console.log(this.editForm.scale,this.editForm.trade);
            })
          }


        }


    }
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../assets/sass/variable";
  .el-form{
    padding-top: 40px;
    padding-bottom: 40px;
    overflow: hidden;
  }
  .el-input{
    width: 75%;
    float: left;
  }
  .el-form-item{
    width: 80%;
    margin: 0 auto 22px;
  }
  .el-select{
    width: 75%;
    float: left;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    overflow: hidden;
    margin: 0 auto;
    border: 3px solid #ccc;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    overflow: hidden;
    margin: 0 auto;
    border: 3px solid #ccc;
  }
  .w50p.fr{
    height:  558px;
  }
  .w50p{
    box-sizing: border-box;
    border-right: $bd-d;
  }
  .button{
    margin-top: 30px;
    .el-button{
      padding: 12px 40px;
      font-size: 16px;
    }
  }
  .uploadLogo{
    padding-top: 80px;
    font-size: 20px;
    color: $c6;
    line-height: 3.5;
  }
  .el-upload__tip{
    font-size: 14px;
    color: $c6;
    margin-top: 20px;
  }
  .el-upload .el-button{
    padding: 10px 28px;
    margin-top: 25px;
  }
</style>
