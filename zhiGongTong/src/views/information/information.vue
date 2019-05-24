<template>
    <div class='information container'>
      <common-tit :title='title' :type='true'></common-tit>
      <div class="infoMain"
           v-loading='tableLoading'
           element-loading-text="正在加载"
      >
        <el-row>
          <el-col :span="4">公司全称</el-col>
          <el-col :span="8">{{toNull(tableData.name)}}</el-col>
          <el-col :span="4">公司LOGO</el-col>
          <el-col :span="8"><div class="logoBox"><img :src="tableData.logo" /></div></el-col>
        </el-row>
        <el-row>
          <el-col :span="4">所属行业</el-col>
          <el-col :span="8">{{trade}}</el-col>
          <el-col :span="4">公司地址</el-col>
          <el-col :span="8"><div class="address">{{toNull(tableData.detailAddress)}}</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="4">用工规模</el-col>
          <el-col :span="8">{{toNull(scale)}}</el-col>
          <el-col :span="4">办公电话</el-col>
          <el-col :span="8">{{toNull(tableData.mobile)}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">联系人</el-col>
          <el-col :span="8">{{toNull(tableData.contact)}}</el-col>
          <el-col :span="4">联系邮箱</el-col>
          <el-col :span="8">{{toNull(tableData.email)}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">联系电话</el-col>
          <el-col :span="8">{{toNull(tableData.phone)}}</el-col>
          <el-col :span="4">公司网址</el-col>
          <el-col :span="8"><a :href="tableData.homepage"></a>{{toNull(tableData.homepage)}}</el-col>
        </el-row>
      </div>
      <div class="button">
        <el-button type='primary' @click.prevent="edit()" v-if="companyRole==1">编 辑</el-button>
      </div>
    </div>
</template>

<script>
  import commonTit from '@/components/common/commonTit'
  import {companyApi,userApi,dviApi} from "../../api";
  import { LocalCache } from "../../lib/utils";
  export default {
        name: "",
      components:{
        commonTit
      },
        data() {
            return {
              title:'企业信息详情',
              tableData:{
                name:'--',
                logo:'',
                industry:'',
                detailAddress:'',
                scale:'--',
                phone:'--',
                contact:'--',
                email:'--',
                mobile:"--",
                homepage:'--'
              },
              scale:"--",
              trade:'--',
              tableLoading:true,
              companyRole:'',
            }
        },
        methods: {
          toNull(val){
            if(val==''){
              return '--'
            }else{
              return val
            }
          },
          edit() {
            this.$router.push({path:'/information/editInfo/'})
          }
        },
      beforeMount(){
        this.companyRole = LocalCache.get('companyInfo').companyRole
      },
      mounted(){

        let companyInfo = LocalCache.get('companyInfo'), companyId= companyInfo.companyId;
        if(companyId!=0){
          companyApi.companyInfo(companyId).then((res)=>{
            console.log('companyInfo',res.data);
            this.$store.state.companyInfo = res.data
            this.tableData = res.data;
            this.tradeList = LocalCache.get('tradeList');
            this.scaleList = LocalCache.get('scaleList');
            console.log(res.data.dimension,res.data.profession);
            if(res.data.dimension){
              this.scale = this.scaleList[res.data.dimension-1].value;
            }else {
              this.scale = '--'
            }
            if(res.data.profession){
              this.trade = this.tradeList[res.data.profession-1].value;
            }else{
              this.trade = '--'
            }

            setTimeout(() => {
              this.tableLoading = false;
            }, 500);
          })
        }else{
          setTimeout(() => {
            this.tableLoading = false;
          }, 500);
        }
      }
    }
</script>

<style lang="scss" type="text/scss">
  @import "../../assets/sass/variable";
  .commonTit{
    border-bottom: $bd-c;
  }
  .infoMain{
    width: 90%;
    margin: 0 auto;
    margin-top: 50px;
    border: $bd-d;
    margin-bottom: 60px;
    .el-row{
      font-size: 18px;
      line-height: 4;
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
        &:last-child{
          border-right: none;
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
  .button{
    height: 40px;
    width: 90%;
    margin: 0 auto;
    .el-button{
      float: right;
      padding: 12px 40px;
      font-size: 16px;
    }
  }
  .logoBox{
    width: 48px;
    height: 48px;
    margin-top: 10px;
    margin-bottom: 10px;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    border: 2px solid #eee;
    overflow: hidden;
    img{
      width: 48px;
      height: 48px;
    }
  }
</style>
