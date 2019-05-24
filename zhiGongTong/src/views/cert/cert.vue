<template>
<div id="cert" class='container'>
  <common-tit :title="title" :type="true"></common-tit>
  <div  class="certMain"
    v-loading="loading" element-loading-text="正在加载 "
  >
    <div class="certImgPart">
      <div class="example fl">
        <div class="certTit">示例：</div>
        <div class="egFront">
          <div class="egTit fl">
            <p>身份证照片</p>
            <div>正面</div>
          </div>
          <div class="egImg">
            <img :src="frontUrl" alt="">
            <div class="imgCover"></div>
          </div>
        </div>
        <div class="egBack">
          <div class="egTit fl">
            <p>身份证照片</p>
            <div>反面</div>
          </div>
          <div class="egImg">
            <img :src="backUrl" alt="">
            <div class="imgCover"></div>
          </div>
        </div>
      </div>
      <div class="information fl">
        <div class="certTit">个人信息：</div>
        <div class="infoMain"
        >
          <el-row>
            <el-col :span="8">姓名</el-col>
            <el-col :span="16">{{name}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="8">性别</el-col>
            <el-col :span="16">{{gender}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="8">民族</el-col>
            <el-col :span="16">{{nation}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="8">身份证号码</el-col>
            <el-col :span="16">{{idNumber}}</el-col>
          </el-row>
        </div>
      </div>
    </div>
    <div class="fr form-submit">
      <el-button type='primary' @click.prevent="toEdit(userId)">编 辑</el-button>
    </div>
  </div>
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

        return {
          title:'个人认证信息',
          loading:true,
          userId:'',
          userName:'',
          frontUrl:'',
          backUrl:'',
          name:'',
          nation:'',
          gender:'',
          idNumber:'',
        }
      },
      components:{
        commonTit
      },

      methods: {
        loadingClose(){
          setTimeout(() => {
            this.loading = false;
          }, 500);
        },
        toEdit(userId){
          this.$router.push({path:'/cert/editCert/'+userId})
        }
      },
      mounted(){
        let userInfo = LocalCache.get('userInfo'),
          userDetail =LocalCache.get('userDetail')
        console.log(this.$route.params.id);
        this.userId =userInfo.id;
        this.userName =userInfo.name;
        this.frontUrl = userDetail.idPhotoFront;
        this.backUrl = userDetail.idPhotoBack;
        this.name = userInfo.name;
        this.nation = userDetail.nation;
        //this.gender = userInfo.gender;
        if(userInfo.gender==1){
          this.gender = '男'
        }else if(userInfo.gender==2){
          this.gender = '女'
        }else{
          this.gender = '--'
        }
        this.idNumber = userDetail.idNumber.substring(0, 3)+'***********'+userDetail.idNumber.substring(14, 18)
        this.loadingClose()
        console.log(this.loading);

        //userApi.detail().then((res)=>{
       //  let userDetail  = res.data.userDetail;
       //  let userInfo  =res.data;
       //
       //})
      }
    }
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../assets/sass/variable";
  .certMain{
    width: 94%;
    margin: 0 auto;
  }
  .certTit{
    text-align: left;

  }

  .egFront,.egBack{
    padding-top: 10px;
    overflow: hidden;
    padding-bottom: 10px;
  }
  .information{
    margin-top: 40px;
    width: 49%;
    float: left;
    .certTit{
      margin-left: 40px;
    }
  }
  .example{
    width: 50%;
    margin-top: 40px;
    border-right: 1px solid #E7EAEE;
  }
  .egImg{
    display: block;
    float: left;
    width: 380px;
    height: 220px;
    border: 1px solid $optBlue;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    overflow: hidden;
    position: relative;
    .imgCover{
      background-color:rgba(0,0,0,0);
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
    }
    img{
      width: 380px;
      height: 220px;
      display: block;
      -ms-filter: blur(5px);
      filter: blur(5px);
    }
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
  .infoMain{
    width: 90%;
    margin: 0 auto;
    margin-top: 50px;
    border-bottom: $bd-d;
    margin-bottom: 60px;
    .el-row{
      font-size: 18px;
      line-height: 4;
      border-left: $bd-d;
      border-top:  $bd-d;
      &:nth-child(2n){
        background: #F0F2F8;
      };
      &:last-child{

      }
      .el-col{
        border-right: $bd-d;
        &:nth-child(2n){
          text-align: left;
          padding-left: 30px;
          color: #666666;
        }
      }
      .el-col-8{
        padding-right: 30px;
        .address{
          width: 100%;
          overflow: hidden;
          @extend %tov;
        }
      }
    }

  }
  .egImg{
    float: left;
    width: 380px;
    height: 220px;
  }
  .certImgPart{
    padding-bottom: 20px;
    margin-bottom: 10px;
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
    margin-top: 50px;
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
