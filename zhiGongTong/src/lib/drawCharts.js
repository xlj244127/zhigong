let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/bar')
require('echarts/lib/chart/line')
require('echarts/lib/chart/pie')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')
require('echarts/lib/component/dataZoom')
let drawPie= function drawPie(id,pieData) {
  let myChart = echarts.init(document.getElementById(id));
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
    color:['#DD1017','#F4AC00','#03C6C5','#DE296E','#FF7510'],
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
};
let drawPies= function drawPies(id,withIDCount,withoutIDCount,withFaceCount,withoutFaceCount,lineLength) {
  console.log(id,withIDCount,withoutIDCount,withFaceCount,withoutFaceCount);
  let myChart = echarts.init(document.getElementById(id));
  myChart.setOption({
    title: {
      text: '信息录入状况',
      x:'center'},
    tooltip: {
      show:true,
      trigger: 'item',
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
      data: ['已录入','未录入'],
    },
    color:['#4ade86','#ffb561'],
    grid:{
      bottom:'0'
    },
    minAngel:'1',
    grid:{
      bottom:'0'
    },
    minAngel:'1',
    series: [{
      name: '身份认证',
      type: 'pie',
      radius:['15%','35%'],
      center:['27%','50%'],
      data:[{
        name:'已录入',
        value:withIDCount
      },{
        name:'未录入',
        value:withoutIDCount
      }],
      stillShowZeroSum:false,
      label:{
        normal:{
          formatter:'{a}\n{b}\n{c}人'
        }
      },
      labelLine:{
        normal:{
          length:0,
          length2:lineLength,
          smooth:true
        }
      }
    },{
      name: '录脸认证',
      type: 'pie',
      radius:['15%','35%'],
      center:['72%','50%'],
      data:[{
        name:'已录入',
        value:withFaceCount
      },{
        name:'未录入',
        value:withoutFaceCount
      }],
      stillShowZeroSum:false,
      label:{
        normal:{
          formatter:'{a}\n{b}\n{c}人'
        }
      },
      labelLine:{
        normal:{
          length:0,
          length2:lineLength,
          smooth:false
        }
      }
    }]
  })
};
let drawBars= function drawBars() {

};
let drawLine= function drawLine() {

};
let drawBar = function drawBar(id,normalData,lackData,noData,xAxisData) {
  let myChart= echarts.init(document.getElementById(id));
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
      },
      min:0,
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
}
let drawLines= function drawLines(id,xData,yData,name) {
  let chart = document.getElementById(id),myChart = echarts.init(chart);
  chart.style.width = ((window.innerWidth-277)*0.8-40)+'px';
  myChart.setOption({
    tooltip: {
      trigger: 'axis',
      formatter: function (param) {
        var ming = param[0].seriesName;
        var formatterHtml;
        //console.log(param[0]);
        if(ming == '考勤率' || ming == '异常考勤率'){
          formatterHtml = param[0].axisValue + '日' + '<br/>' + param[0].data + '%'
        }else if(ming == '平均工时'){
          formatterHtml = param[0].axisValue + '日' + '<br/>' + param[0].data + '小时'
        }else{
          formatterHtml = param[0].axisValue + '日' + '<br/>' + param[0].data + '人'
        }
        return [
          formatterHtml
        ].join('');
      },
      axisPointer: {
        type: 'cross'
      }
    },
    grid: {
      top: '5%',
      left: '3%',
      right: '3%',
      bottom: '5%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      splitNumber: 2,
      scale: true,
      splitLine:{
        show:false
      },
      axisLabel: {
        show: true,
        interval: 3
      },

      data: xData
    },
    yAxis: {
      type: 'value',

    },
    series: [{
      name: name,
      type: 'line',
      data: yData
    }]
  })

}

export {
  drawPie,
  drawPies,
  drawBar,
  drawBars,
  drawLine,
  drawLines
}
