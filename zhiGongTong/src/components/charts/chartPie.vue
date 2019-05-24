<template>
  <div id='indexPie'></div>
</template>

<script>

  let echarts =require('echarts/lib/echarts')
  require('echarts/lib/chart/pie')
  require('echarts/lib/component/tooltip')
  require('echarts/lib/component/title')
  require('echarts/lib/component/legend')

    export default {
        name: "",
        data() {
            return {}
        },
        methods: {
          drawPie(){
            let myChart= echarts.init(document.getElementById('indexPie'));
            myChart.setOption({
              title: {
                text: '全部项目考勤对比图',
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
                name: '班组日考勤',
                type: 'pie',
                radius:'55%',
                center:['45%','55%'],
                data:[{
                  name:'水电工',
                  value:'40'
                },{
                  name:'木工',
                  value:'30'
                },{
                  name:'油漆工',
                  value:'25',

                },{
                  name:'瓷砖工',
                  value:'15',

                },{
                  name:'瓷砖工2',
                  value:'30',

                }],
                stillShowZeroSum:false,
                label:{
                  normal:{
                    formatter: {
                    }
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
        },
      mounted(){
          this.drawPie()
      }
    }
</script>

<style lang="scss" type="text/scss">
  #indexPie{
    width: 100%;
    height: 28rem;
    padding-top: 1rem;
    padding-bottom: 1rem;
    background: #ffffff;
  }
</style>
