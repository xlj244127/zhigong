<template>
  <div class='blacklistBoard'>
    <el-row type="flex" class="entrySum" justify="space-around">
      <el-col :span="5"><div class="board zhiGong" @click="jump('index')" :class="{yellow:corporation}">&#xe63f;</div><div class="sumMain" @click="jump('index')" ><p>{{blackListStat.companyBA}}</p><div>企业黑名单（人）</div></div></el-col>
      <el-col :span="5"><div class="board zhiGong" @click="jump('alarm')" :class="{yellow:alarm}">&#xe640;</div><div class="sumMain" @click="jump('alarm')" ><p>{{blackListStat.warnBA}}</p><div>黑名单警报（个）</div></div></el-col>
      <el-col :span="5"><div class="board zhiGong" @click="jump('processed')" :class="{yellow:processed}">&#xe641;</div><div class="sumMain" @click="jump('processed')" ><p>{{blackListStat.processBA}}</p><div>已处理黑名单（个）</div></div></el-col>
      <el-col :span="5"><div class="board zhiGong" @click="jump('public')" :class="{red:public}">&#xe642;</div><div class="sumMain"  @click="jump('public')"><p>{{blackListStat.publicBA}}</p><div>公共黑名单（人）</div></div></el-col>
    </el-row>
    <div class="board-tip">
      说明：企业黑名单为本企业项目存在不良行为的人员，公共黑名单为被其他企业列入黑名单的人员
    </div>
  </div>
</template>

<script>
  import { blackListApi } from "../../api";
  import { LocalCache } from "../../lib/utils";

  export default {
    name: "infoEntry",
    props:['boardStyle','blackListStat'],
    data() {
      return {
        loading:true,
        companyId:"",
        public:false,
        corporation:false,
        alarm:false,
        processed:false,
        process:false,
        companyBl:false,
        warn:false,

      }
    },
    methods: {
      loadingClose(){
        setTimeout(() => {
          this.loading = false;
        }, 500);
      },

      toZero(val){
        if(!val){
          return 0
        }else{
          return val
        }
      },
      getData(){

      },
      jump(val){
        this.$router.push({path:'/blacklist/'+val})
      }
    },
    beforeMount(){
      this.loadingClose()
      this.companyId = LocalCache.get('companyInfo').companyId;
    },
    mounted(){
      this.getData()

      if(this.boardStyle=="public"){
        this.public = true
      }else if(this.boardStyle=="corporation"){
        this.corporation = true
      }else if(this.boardStyle == "alarm"){
        this.alarm = true
      }else if(this.boardStyle == "processed"){
        this.processed = true
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import '../../assets/sass/variable';
  .entrySum{
    padding-top: 20px;
    height: 120px;
    line-height: 54px;
    margin-bottom: 10px;
    .el-col{
      background: #f4f4f4;
      .board{
        line-height: 100px;
        text-align: center;
        width: 35%;
        background-color: #51a6fe;
        text-align: center;
        color: #ffffff;
        font-size: 54px;
        float: left;
        cursor: pointer;
        &.red{
          background-color: #F55F37;
        }
        &.yellow{
          background-color: #F9A954;
        }
      }
      .sumMain{
        float: left;
        width: 65%;
        text-align: center;
        cursor: pointer;
        p{
          font-size: 32px;
          line-height: 58px;
          color: #69839F;
          padding-top: 12px;
        }
        div{
          font-size: 14px;
          color: #69839F;
          line-height: 24px;
        }
      }
    }
  }
  .board-tip{
    text-align: right;
    font-size: 12px;
    color: #999;
    border-bottom: 1px solid #E8ECF1;
    padding-right: 2%;
    line-height: 30px;
    margin-top: 15px;
  }
</style>
