<template>
  <div id="attendTable">
    <common-tit :title='title'></common-tit>
    <div id="tableInner">
      <el-row >
      <el-col :span='6' v-for="(item,index) in thList" :key="index" v-if='index<projectLength'>
        <div class='colItem fl'>{{item.project}}</div>
        <div class='colItem fr'>{{item.rate}}</div>
      </el-col>
    </el-row>
      <el-row :span="24" v-if='projectLength==0' class='noProjList'><span class="noData">该公司下暂无项目，快去创建项目吧！</span></el-row>
      <el-row class='rowMain'
              v-loading='tableLoading'
              element-loading-text="正在加载"
              v-else
      >
        <el-col :span='6' v-for="(item,index) in  projList"  :key='index'>
          <router-link :to="road+item.projectId" class="projItem">
            <div class='colItem toDetail fl'>{{item.projectName}}</div>
            <div class='colItem fr'>{{toPercent(1-item.exceptionRate)}}%</div>
          </router-link>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import commonTit from '@/components/common/commonTit'
  import {statisticalSummaryApi,projectApi } from '../../api'
  import moment from 'moment'
  import {getToday} from "../../lib/getDate";
  import {LocalCache} from "../../lib/utils";
    export default {
      name: "information",
      data() {
        return {
          title:'项目考勤',
          road:'/attend/projAttend/',
          projList:[
          ],
          exceptionRateList:[],
          tableLoading:true,
          projectLength:'',
          thList:[
            {
              project:'项目',
              rate:'考勤率'
            },{
              project:'项目',
              rate:'考勤率'
            },{
              project:'项目',
              rate:'考勤率'
            },{
              project:'项目',
              rate:'考勤率'
            }

          ]
        }
      },
      components:{
        commonTit
      },
      methods: {
        toZero(value) {
          if(value)
            return value;
          else
            return 0;
        },
        toPercent(val){
          if(!val){
            return 0
          }else{
            return Math.round( val*100 )
          }
        },
        getTableData(){

        },
      },
      beforeMount(){

      },
      mounted(){
        this.today = getToday();
        statisticalSummaryApi.allProjDayAttend(this.today).then((res)=>{
          console.log('allProjDayAttend',res);
          console.log(res.data.length);
          var resData= res.data;
          this.projectLength = resData.length
          if(resData.length<4){
            this.projectLength = resData.length
          }else{
            this.projectLength = 4
          }
          this.projList = resData
          setTimeout(() => {
            this.tableLoading = false;
          }, 500);
        }).catch((res)=>{
          console.log(res);
        })
      }
    }
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../assets/sass/variable";
  #attendTable{
    margin: 10px 10px 20px;
    border: $bd-d;
  }
  #tableInner{
    margin: 19px 19px 19px;
  }
  .el-row:first-child{
    .el-col{
      height: 50px;
      padding-top: 0;
    }
  }
  .el-col{
    line-height: 50px;
    height: 70px;
    overflow: hidden;
    border-right:$bd-d;
    padding-top: 20px;
    &:nth-child(4){
      border-right: none;
    }
  }
  .el-row.rowMain{
    min-height:70px;
    .el-col {
      cursor: pointer;
      display: block;
      .projItem{
        display: block;
        &:hover{
          color: $optBlue;
        }
      }
    }
  }
  .colItem{
    color: #333333;
    background: $lightBlue;
    &.fl{
      width: 48%;
      padding-left: 7%;
      -ms-text-overflow: ellipsis;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space:nowrap;
      text-align: left;
    }
    &.fr{
      width: 42%;
      float: right;
      text-align: center;
      padding-left: 3%;
    }
  }
</style>
