<template>
<div id="index" class='container'  v-loading="loading"
     element-loading-text="正在加载">
  <div class="changeDate">
    <span class="demonstration">请选择日期:</span>
    <el-date-picker v-model="dateValue" align="right" type="date" format='yyyy-MM-dd' :picker-options="pickerOptions1" @change="changeDate" :clearable="clearable">
    </el-date-picker>
  </div>

  <data-list6 :dataList6='dataList6' :lastDataList="lastDataList"></data-list6>
  <el-row class="charts">
    <el-col :span='12'>
      <div id='indexBar'></div>
    </el-col>
    <el-col :span='12'>
      <div id='indexPie'></div>
    </el-col>
    <el-col :span='12' v-if='!hasPieData' class='pieDataNull'>
      <!--123456-->
      <div class="pieNoData" >
        <div class="pieTitle">项目当日工种考勤统计</div>
        <img :src="pieNoData" alt="">
      </div>
    </el-col>
  </el-row>
  <!--暂时屏蔽月考勤统计-->
  <!--
  <div class="through-line"></div>
  <chart-attend :type="3" :projectId="projId"></chart-attend>
  -->
</div>
</template>

<script>
  import dataList6 from '@/components/dataList/dataList6'
  import chartAttend from '@/components/charts/chartAttend'
  import pieNoData from '../../assets/img/pie_no_data.png'
  import { userApi,statisticalSummaryApi ,companyApi} from '../../api'
  import {getToday,getYesterday} from "../../lib/getDate";
  import {LocalCache} from "../../lib/utils";
  import moment from 'moment'
  import {drawBar,drawPie} from "../../lib/drawCharts";
  export default {
      name: "",
      data() {
        return {
          dataList6:{},
          lastDataList:{},
          pieData:[],
          noAttend:[],
          lackAttend:[],
          normalAttend:[],
          pieVal:[],
          pieName:[],
          xAxisData:[],
          hasPieData:true,
          pieNoData:pieNoData,
          dateValue:'',
          pickerOptions1: {
            disabledDate(time) {
              return time.getTime() > Date.now();
            }
          },
          projId:'',
          loading:true,
          clearable:false,
        }
      },
      components:{
        dataList6,chartAttend
      },
      methods: {
        loadingClose(){
          setTimeout(() => {
            this.noBorderBottom =true
            this.loading = false;
          }, 500);
        },
        changeDate(){
          let chosenDay = moment(this.dateValue).format('YYYY-MM-DD'),
              chosenYesterday = moment(this.dateValue - 864000).format('YYYY-MM-DD');
          this.loading = true
          this.getData(chosenDay,chosenYesterday)
        },
        /*drawPie(pieData){

        },*/
        getData(today,yesterday){
          let that = this
          statisticalSummaryApi.summary(1,this.projectId).then((result)=>{
            console.log('summary',this.projectId);
            this.dataList6 = result.data;
          }).catch((res)=>{
            console.log(res.data);});
          statisticalSummaryApi.dayAttend(1, today).then((result)=>{
            console.log('totalAttendContrast',result.data);
            //console.log(result.data.totalWorkGroupStat.length);
            that.pieData = [];
            let data=[]
            for(var key in  result.data.totalWorkGroupStat){
              console.log(result.data.totalWorkGroupStat[key]);
              let obj = {
                name:result.data.totalWorkGroupStat[key].value,
                value:result.data.totalWorkGroupStat[key].attend
              }
              data.push(obj)
            }
            console.log(data.length);
            if(data.length==0){
              that.hasPieData = false
            }else{
              that.hasPieData = true
            }
            setTimeout(function () {
              drawPie('indexPie',data);
            },500)
            //console.log('pieData end',this.pieData,typeof this.pieData,JSON.parse(JSON.stringify(this.pieData)));
            that.normalAttend = [];
            that.noAttend = [];
            that.lackAttend = [];
            that.xAxisData = [];
            for(var key in  result.data.totalAttendContrast){
              that.xAxisData.push(key)
              that.normalAttend.push(result.data.totalAttendContrast[key].normalAttend);
              that.noAttend.push(result.data.totalAttendContrast[key].noAttend);
              that.lackAttend.push(result.data.totalAttendContrast[key].lackAttend);
            }
            console.log(that.normalAttend, that.lackAttend, that.noAttend, that.xAxisData);
            setTimeout(function () {
              drawBar('indexBar',that.normalAttend, that.lackAttend, that.noAttend, that.xAxisData)
              that.loadingClose()
            },500)


          }).catch((res)=>{
            console.log(res);
          });
          statisticalSummaryApi.dayAttend(1, yesterday).then((result)=>{
            this.lastDataList = result.data;
            //console.log('dayAttend', result.data)
          })
        }
      },
      beforeMount(){
        console.log('projectId',this.projectId);
      },
      mounted(){
        let companyInfo = LocalCache.get('companyInfo')
        this.yesterday = getYesterday();
        this.today = getToday();
        this.dateValue = this.today;
        if(companyInfo){
          this.companyId   = companyInfo.companyId;
          this.companyRole = companyInfo.companyRole;
          this.projectId   = companyInfo.projectId
        }else{
          userApi.information().then((result)=>{
            this.companyId = result.data.companyId;
            this.companyRole = result.data.companyRole;
            this.projectId = result.data.projectId;
          });
        }
        this.getData(this.today,this.yesterday)
      }
    }
</script>

<style lang="scss" type="text/scss">
  .changeDate{
    text-align: left;
    padding-left: 20px;
    padding-top: 15px;
  }
</style>
