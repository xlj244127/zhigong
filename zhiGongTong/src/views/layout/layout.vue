<template>
  <el-container>
    <el-aside width="220px">
      <common-aside :userDetail="userDetail" :companyInfo="companyInfo" ></common-aside>
    </el-aside>
    <el-container>
      <el-header>
        <common-header></common-header>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
      <el-footer height="34px">
        <common-footer></common-footer>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script>
  import commonFooter from '@/components/common/footer'
  import commonAside  from '@/components/common/aside'
  import commonHeader from '@/components/common/header'
  import { userApi,dviApi } from "../../api";
  import { LocalCache } from "../../lib/utils"

  export default {
        name: "",
        data() {
            return {
              userDetail:{},
              companyInfo:{},
            }
        },
        components:{
          commonFooter: commonFooter,
          commonAside : commonAside,
          commonHeader: commonHeader
        },
        methods: {},
      mounted(){
        dviApi.getData('profession').then((res)=>{
          LocalCache.set('tradeList',res.data.list.reverse())
        });
        dviApi.getData('CompanyDimension').then((res)=>{
          LocalCache.set('scaleList',res.data.list.reverse())
        });
        dviApi.getWorkTypes().then((res)=>{
          LocalCache.set('workTypeList',res.data.list.reverse())
        });
        dviApi.getPositions().then((res)=>{
          LocalCache.set('positionList',res.data.list)
        });
        userApi.information().then((result)=>{
          LocalCache.set('companyInfo',result.data)
          this.companyInfo =result.data
        });
        this.userDetail = LocalCache.get('userInfo')
      },
    }
</script>

<style lang="scss" type="text/scss">
  @import '../../assets/sass/global';
  #app {
    font-family: PingFang SC,Helvetica Neue,Helvetica,Arial,Microsoft YaHei,\\5FAE\8F6F\96C5\9ED1,STHeitiSC-Light,simsun,\\5B8B\4F53,WenQuanYi Zen Hei,WenQuanYi Micro Hei,sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    height: 100%;
    overflow: hidden;
    .el-container{
      height: 100%;
    }
  }

  .el-aside {
    background-color: #4A90FE;
    color: #333;
    text-align: center;
    padding-top: 20px;
    width: 220px;
    float: left;
    height: 100%;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    padding: 0;
    height: 100%;
  }

  body > .el-container {
    margin-bottom: 40px;
    float: right;
  }

</style>
