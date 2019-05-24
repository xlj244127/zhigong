<template>
  <div class="chartLines" >
    <div class="chartTitle" v-if="type==2">
      {{title}}
      <div class="fr">
        <span class="demonstration">请选择月份:</span>
        <el-date-picker v-model="dateValue" align="right" type="month" value-format="timestamp" :picker-options="pickerOptions1" @change="changeDate" :clearable="clearable">
        </el-date-picker>
      </div>
    </div>
    <div class="chartTitle type3" v-if="type==3" >
      <span class="demonstration">请选择月份:</span>
      <el-date-picker v-model="dateValue" align="right" type="month" value-format="timestamp" :picker-options="pickerOptions1" @change="changeDate" :clearable="clearable">
      </el-date-picker>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick" class="attendPart">
      <el-tab-pane label="当前人数" name="first"></el-tab-pane>
      <el-tab-pane label="已考勤" name="second"></el-tab-pane>
      <el-tab-pane label="异常考勤" name="third"></el-tab-pane>
      <el-tab-pane label="考勤率" name="fourth"></el-tab-pane>
      <el-tab-pane label="平均工时" name="fifth"></el-tab-pane>
    </el-tabs>
    <div class="charts">
      <div class="fl chartsTitle">
        {{attendTitle}}
      </div>
      <div id='monthAttend' class="line1 fr"></div>
    </div>
    <el-tabs v-model="typeName" @tab-click="handleChangeType" class="attendPart" v-if="type!=1">
      <el-tab-pane :label="item.name" :name="item.code" v-for="item in workTypes" :key="item.code" :disabled="typeDisable"></el-tab-pane>
    </el-tabs>
    <div class="charts" v-if="type!=1">
      <div class="fl chartsTitle workTypeTitle">
        {{workTypeTitle}}
      </div>
      <div id='monthWorkType' class="line1 fr"></div>
    </div>
  </div>
</template>
<script>

  let echarts =require('echarts/lib/echarts')
  require('echarts/lib/chart/line')
  require('echarts/lib/component/tooltip')
  require('echarts/lib/component/title')
  require('echarts/lib/component/legend')
  require('echarts/lib/component/dataZoom')
  import {statisticalSummaryApi} from "../../api";
  import {drawLines} from "../../lib/drawCharts";
  import { LocalCache } from "../../lib/utils";

  export default {
    name: "",
    props:['type'],
    data() {
      return {
        title:'项目月考勤统计',
        dateValue:'',
        pickerOptions1: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },

        attendTitle:'',
        workTypeTitle:'',
        activeName: 'first',
        monthDate:[],
        currentlyUsers:[],
        attendRate:[],
        exceptionRate:[],
        averDuration:[],
        monthDate:[],
        attendCount:[],
        index:0,
        currentMonth:'',
        workTypes:[],
        typeName:'',
        projectId:'',
        typeDisable:'',
        clearable:false,
      }
    },
    methods: {
      changeDate(){

      },
      handleClick(tab, event) {
        console.log(tab, event);
        if(tab.index!=this.index){
          if(tab.index==0){
            this.drawAttend(this.monthDate,this.currentlyUsers)
            this.index = 0
          }else if(tab.index==1){
            this.drawAttend(this.monthDate,this.attendCount)
            this.index = 1
          }else if(tab.index==2){
            this.drawAttend(this.monthDate,this.exceptionRate)
            this.index = 2
          }else if(tab.index==3){
            this.drawAttend(this.monthDate,this.attendRate)
            this.index = 3
          }else if(tab.index==4){
            this.drawAttend(this.monthDate,this.averDuration)
            this.index = 4
          }
          this.attendTitle = '项目'+tab.label+'月折线图'+this.currentMonth+'月';
        }
      },
      handleChangeType(tab){
        drawLines('monthWorkType', this.monthDate, this.yDataList[tab.index], '');
      },
      drawAttend(xData,yData){
        let chart=document.getElementById('monthAttend'),myChart= echarts.init(chart);
        chart.style.width = ((window.innerWidth-277)*0.8-40)+'px';
        myChart.setOption({
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
            itemHeight:12
          },
          color:['#38D778','#FFA137','#E3314E','#DE296E','#FF7510'],
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
            top:'5%'
          },
          xAxis: {
            type: 'category',
            data: xData
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: yData,
            type: 'line',
            smooth: true
          }],
        })
      },
      changeDate(value){
        this.loading = true;
      },
      getChartsData(date,projectId){
        statisticalSummaryApi.getMonthAttend(1, date, projectId).then((result)=>{
          console.log('月统计', result);
          let arr = result.data.monthAttends;
          for(var day in arr){
            this.monthDate.push(day);
            if(arr[day].currentlyUsers==undefined){
              this.currentlyUsers.push(arr[day].CurrentlyUsers);
            }else{
              this.currentlyUsers.push(arr[day].currentlyUsers);
            }
            this.attendRate.push(arr[day].attendRate*100);
            this.exceptionRate.push(arr[day].exceptionRate*100);
            this.averDuration.push(arr[day].averDuration);
            this.attendCount.push(arr[day].attendCount);
          }
          console.log(this.monthDate,this.currentlyUsers);
          this.drawAttend(this.monthDate,this.currentlyUsers)
          this.attendTitle = '项目当前人数月折线图'+this.currentMonth+'月';
          if(this.type!=1){
            let arr2 = result.data.totalWorkGroupStat;
            for(var code in arr2){
              this.workTypes.push(
                {code: code.split('_')[0], name: code.split('_')[1]}
              )
            }
            console.log('workTypes',this.workTypes);
            console.log(arr2);
            var that = this;
            let yData = [];
            setTimeout(()=>{
              for(var w in arr2){
                for(var m in this.workTypes){
                  if(w.split('_')[0] == this.workTypes[m].code){
                    //let id = w.split('_')[0];
                    for(var day in arr2[w]){
                      yData.push(arr2[w][day]);
                    }
                  }
                }
              }
              console.log(yData);
              let workTypeList = LocalCache.get("workTypeList")
              if(this.workTypes.length==0){
                this.workTypes = [];
                for(var i=0;i<workTypeList.length;i++){
                  let obj ={
                    name:workTypeList[i].value,
                    code:workTypeList[i].code
                  }
                  this.workTypes.push(obj)
                }
                console.log('workTypeLength',this.workTypes.length);
                this.typeName = workTypeList[0].code
                this.typeDisable = true
              }
             /*
              console.log('workTypeList',this.workTypes);*/
              this.typeDisable = false
              var resultArr = [];
              for(var i=0,len=yData.length;i<len;i+=yData.length/this.workTypes.length){
                resultArr.push(yData.slice(i,i+yData.length/this.workTypes.length));
              }
              console.log(resultArr);
              this.yDataList =resultArr
              drawLines('monthWorkType', this.monthDate, this.yDataList[0], '');
            },300);
            this.workTypeTitle='全部项目工种人数月折线图'+this.currentMonth+'月'
          }
        }).catch((res)=>{
          console.log(res);
        })
      }
    },
    created(){

    },

    beforeMount(){
      this.dateValue='2018-07'
      //this.dateValue=getCurrentMonth()
      this.currentMonth = this.dateValue.split('-')[1]
      this.projectId = this.$route.params.projectId
      this.getChartsData(this.dateValue,this.projectId)

    },
    mounted(){

    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  .chartTitle{
    font-size: 18px;
    line-height: 3;
    height: 54px;
    background: #eff5fb;
    padding-left: 30px;
    padding-right: 30px;
    text-align: left;
    .demonstration{
      font-size: 14px;
    }
  }
  #monthAttend,#monthWorkType{
    width: 1200px;
    margin: 0 auto;
    height: 320px;
  }
  .attendPart{
    width: 460px;
    margin: 0 auto;
  }
  .el-tabs__item{
    font-size: 16px;
  }
  .el-tabs__header{
    margin: 0;
  }
  .charts{
    overflow: hidden;
    width: 80%;
    margin: 0 auto;
  }
  .chartsTitle{
    font-size: 16px;
    width: 16px;
    line-height: 18px;
    padding-left: 24px;
    padding-top: 25px;
    &.workTypeTitle{
      padding-top: 25px;
    }
  }
  .type3{
    text-align: left;
    padding-left: 30px;
    background: #ffffff;
  }
</style>
