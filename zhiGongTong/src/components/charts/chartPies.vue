<template>
  <div id='indexPie'></div>
</template>

<script>

  let echarts =require('echarts/lib/echarts')
  require('echarts/lib/chart/pie')
  require('echarts/lib/component/tooltip')
  require('echarts/lib/component/title')
  require('echarts/lib/component/legend')
  import {statisticalSummaryApi} from "../../api";
  import {getToday} from "../../lib/getDate";

  export default {
        name: "",
        data() {
            return {
              lineLength:30
            }
        },
        prop:['withIDCount','withoutIDCount','withFaceCount','withoutFaceCount'],
        methods: {
          drawPie(withIDCount,withoutIDCount,withFaceCount,withoutFaceCount){
            let myChart = echarts.init(document.getElementById('indexPie'));
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
                    formatter:'{b}\n{c}人'
                  }
                },
                labelLine:{
                  normal:{
                    length:0,
                    length2:this.lineLength,
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
                    formatter:'{b}\n{c}人'
                  }
                },
                labelLine:{
                  normal:{
                    length:0,
                    length2:this.lineLength,
                    smooth:false
                  }
                }
              }]
            })
          },
        },
      mounted(){
        console.log(this.$store.state.withIDCount);
        if(this.$store.state.withIDCount){
          this.drawPie(this.$store.state.withIDCount,this.$store.state.withoutIDCount,this.$store.state.withFaceCount,this.$store.state.withoutFaceCount)
        }else{
          statisticalSummaryApi.summary(1).then((result)=>{
            this.withIDCount      = result.data.withIDCount
            this.withoutIDCount   = result.data.withoutIDCount
            this.withFaceCount    = result.data.withFaceCount
            this.withoutFaceCount = result.data.withoutFaceCount
            this.drawPie(this.withIDCount,this.withoutIDCount,this.withFaceCount,this.withoutFaceCount)
          }).catch((res)=>{
            console.log(res.data);
          });

        }
        let that = this
        window.onresize=function (e) {
          console.log(e.currentTarget,e.currentTarget.outerWidth);
          let w =e.currentTarget.outerWidth;
          if(w<1366){
            that.lineLength=10
          }else{
            that.lineLength=30
          }
          that.drawPie(that.withIDCount,that.withoutIDCount,that.withFaceCount,that.withoutFaceCount)
        }
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
