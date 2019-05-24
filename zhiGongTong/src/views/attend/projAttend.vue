<template>
  <div class="projAttend container"
       v-loading='loading'
       element-loading-text="正在加载">
    <div class="colFirst">
        <span class="projectName">{{projectName}}</span>
        <span class="demonstration">请选择日期:</span>
        <el-date-picker v-model="dateValue" align="right" type="date" format='yyyy-MM-dd' :picker-options="pickerOptions1" @change="changeDate" :clearable="clearable">
        </el-date-picker>
    </div>
    <div class="projTop">
      <data-list5 :todayList='todayList' :yesList='yesList'></data-list5>
    </div>
    <el-row class="charts">
      <el-col :span='12'>
        <div id='indexBar'></div>
      </el-col>
      <el-col :span='12' >
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
    <!--<class-table :projName='projectName' :projData="groupDayAttendList" :projectId='projectId'>
    </class-table>-->

    <!--
    <div class="through-line"></div>
    <chart-attend :type="2" :projectId='projectId'></chart-attend>
    -->
  </div>
</template>

<script>
  import classTable from '@/components/table/classTable'
  import chartAttend from '@/components/charts/chartAttend'
  import dataList5 from '@/components/dataList/dataList5'
  import { statisticalSummaryApi,projectApi } from "../../api";
  import { getToday,getYesterday } from "../../lib/getDate";
  import moment from 'moment'
  import pieNoData from '../../assets/img/pie_no_data.png'
  let echarts =require('echarts/lib/echarts')
  require('echarts/lib/chart/pie')
  require('echarts/lib/chart/bar')
  require('echarts/lib/component/tooltip')
  require('echarts/lib/component/title')
  require('echarts/lib/component/legend')
  export default {
    name: "",
    components:{
      dataList5,classTable,chartAttend
    },
    data() {
      return {
        title:'',
        projName:'',
        loading:false,
        pickerOptions1: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        today:'',
        yesterday:'',
        dateList:{},
        todayList:{},
        yesList:{},
        groupDayAttendList:{},
        projectId:'',
        noAttend:[],
        normalAttend:[],
        lackAttend:[],
        xAxisData:[],
        dateValue:'',
        hasPieData:true,
        pieNoData:pieNoData,
        projectIdChange:'',
        options:[{
          value:'1',
          label:'fafaer'
        },{
          value:'21',
          label:'fafae333r'
        }],
        projectName:'',
        clearable:false,
      }
    },
    methods: {
      drawPie(pieData){
        let myChart= echarts.init(document.getElementById('indexPie'));
        myChart.setOption({
          noDataLoadingOption: {
            text: '暂无数据',
            effect: 'bubble',
            effectOption: {
              effect: {
                n: 0
              }
            }
          },
          title: {
            text: '项目当日工种考勤统计',
            x:'center'
          },
          tooltip: {
            show:true,
            trigger: 'item',
            formatter:'{a} <br/>{b} : {c} ({d}%)'
          },
          legend:{
            orient: 'vertical',
            show: true,
            x: 'right',
            textStyle:{
              fontSize:12,
              color:'#999',
            },
            itemHeight:12
          },
          color:['#85DD80','#438CF9','#FF7510','#DE296E','#03C6C5','#F4AC00','#7AACF7','#9E7BF7','#CA50E8','#DD1017','#75DCCA','#F5897E','#5D55F9','#1FAB92','#76D2EC'],
          grid:{
            bottom:'0'
          },
          minAngel:'1',
          grid:{
            bottom:'0'
          },
          minAngel:'1',
          series: [{
            name: '项目当日工种考勤统计',
            type: 'pie',
            radius:'55%',
            center:['45%','55%'],
            data:pieData,
            stillShowZeroSum:false,
            label:{
              normal:{
                formatter:'{b} : {c}人'
              }
            },
            labelLine:{
              normal:{
                length:15,
                length2:15,
                smooth:false
              }
            }
          }]
        })
      },
      drawBar(normalData,lackData,noData,xAxisData){
        let myChart= echarts.init(document.getElementById('indexBar'));
        myChart.setOption({
          title: {
            text: '全部项目考勤对比图',
            x:'center'},
          tooltip: {
            show:true,
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
              shadowStyle:{
                color:'rgba(150,150,150,0.15)'
              }
            }
          },
          legend:{
            orient: 'vertical',
            show: true,
            x: 'right',
            textStyle:{
              fontSize:12,
              color:'#999',
            },
            itemHeight:12,
            data: ['正常考勤','缺卡','无考勤']
          },
          color:['#38D778','#FFA137','#E3314E','#DE296E','#FF7510'],
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [{
            type: 'category',
            data: xAxisData,
            axisTick: {show: false},
            axisLabel: {
              // inside: true,
              padding: [15, 0, 0, 0],
              textStyle: {
                color: "#333",
                fontSize: 16,
                lineHeight:18
              }
            }
          }],
          yAxis: [{
            type: 'value',
            splitLine: {
              lineStyle: {
                color: 'rgba(80,224,255,0.3)',
                type: 'dashed'
              },
              show:false,
            },
            minInterval: 1,
            scale:true,
            name: '考勤人数',
            nameTextStyle: {
              color: "#fff",
              fontSize: 16,
              padding: [0, 0, 10, 0]
            }
          }],
          series: [{
            name: '正常考勤',
            type: 'bar',
            barWidth: '15%',
            barGap:'40%',
            data:normalData,
            label: {
              normal: {
                show: false,
                position: "top",
                textStyle: {
                  color: "#38D778",
                  fontSize: 16
                }
              }
            },
          },{
            name: '缺卡',
            type: 'bar',
            barWidth: '15%',
            barGap:'40%',
            data:lackData,
            label: {
              normal: {
                show: false,
                position: "top",
                textStyle: {
                  color: "#FFA137",
                  fontSize: 16
                }
              }
            },
          },{
            name: '无考勤',
            type: 'bar',
            barWidth: '15%',
            barGap:'40%',
            data:noData,
            label: {
              normal: {
                show: false,
                position: "top",
                textStyle: {
                  color: "#E3314E",
                  fontSize: 16
                }
              }
            },
          }]
        })
      },
      getAttend(today,yesterday,projectId){
        let that = this
        statisticalSummaryApi.oneProjDayAttend(1,today,projectId).then((result)=>{
          this.todayList = result.data;
          console.log('oneProjDayAttend',result.data);
          that.pieData = [];
          let data=[]
          for(var key in  result.data.totalWorkGroupStat){
            console.log(result.data.totalWorkGroupStat[key]);
            let obj ={
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
          that.drawPie(data);
          that.normalAttend=[];
          that.xAxisData=[];
          that.noAttend=[];
          that.lackAttend=[];
          for(var key in  result.data.totalAttendContrast){
            that.xAxisData.push(key);
            that.normalAttend.push(result.data.totalAttendContrast[key].normalAttend);
            that.noAttend.push(result.data.totalAttendContrast[key].noAttend);
            that.lackAttend.push(result.data.totalAttendContrast[key].lackAttend);
          }
          that.drawBar(that.normalAttend, that.lackAttend, that.noAttend, that.xAxisData)
        }).catch((res)=>{
          console.log(res);
        });
        statisticalSummaryApi.oneProjDayAttend(1,yesterday,projectId).then((res)=>{
          this.yesList   = res.data
        }).catch((res)=>{
          console.log(res);
        });
        statisticalSummaryApi.groupDayAttend(projectId, today).then((result)=>{
          console.log('groupDayAttend',result.data);
          this.groupDayAttendList = result.data
        }).catch((res)=>{
          console.log(res);
        });
        setTimeout(() => {
          this.loading = false;
        }, 500);
      },
      changeDate(value){
        this.loading = true;
        var day =moment(value).format('YYYY-MM-DD'),
          yesterday = moment(value-1000*60*60*24).format('YYYY-MM-DD');
        console.log(day,yesterday);
        this.today = day
        this.getAttend(day,yesterday,this.projectId)
      },
      todayToYesterday(value){
        let timeStamp = moment(value, 'YYYY-MM-DD').valueOf();
        return moment(timeStamp-1000*60*60*24).format('YYYY-MM-DD')
      }
    },
    beforeMount(){
      this.dateValue = moment(new Date()).format('YYYY-MM-DD');
      this.loading = true;
      this.projectId=this.$route.params.projectId;
      projectApi.projectDetail(this.projectId).then((res)=>{
        this.projectName = res.data.name;
        this.$store.state.projectName = res.data.name;
      }).catch((res)=>{
        console.log(res);
      })
    },
    mounted(){
      this.yesterday = getYesterday();
      this.getAttend(this.dateValue,this.yesterday,this.projectId)
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import '../../assets/sass/variable';
  .projTop{
    overflow: hidden;
    padding:0  10px 0;
  }
  .colFirst{
    padding-left: 10px;
    padding-right: 10px;
    margin-top: 20px;
    margin-bottom: 20px;
    text-align: left;
    .el-select{
      margin-right: 30px;
    }
    .projectName{
      font-size: 20px;
    }
  }
  .projName{
    padding-top: 10px;
    font-size: 20px;
    font-weight: bold;
    text-align: left;
    line-height: 48px;
  }
  .date{
    text-align: left;
  }

</style>
