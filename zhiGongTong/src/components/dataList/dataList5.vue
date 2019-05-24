<template>
  <div class="dataList6 dataList dataList5">
    <el-row type='flex'>
      <el-col :span='4' class="item">
        <div class="dataType fl">
          <div class='zhiGong'>&#xe639;</div>
          <span class='fz16'>历史人数</span>
          <span class='fz12'>（个）</span>
        </div>
        <div class="dataNum fl">
          <div class="todayNum">{{toZero(todayList.totalUsers)}}</div>
          <div class="yesterdayNum">昨：{{toZero(yesList.totalUsers)}}人</div>
        </div>
      </el-col>
      <el-col :span='4' class="item">
        <div class="dataType fl">
          <div class='zhiGong'>&#xe63a;</div>
          <span class='fz16'>当前人数</span>
          <span class='fz12'>（个）</span>
        </div>
        <div class="dataNum fl">
          <div class="todayNum">{{toZero(todayList.currentlyUsers)}}</div>
          <div class="yesterdayNum">昨：{{toZero(yesList.currentlyUsers)}}人</div>
        </div>
      </el-col>
      <el-col :span='4' class="item">
        <div class="dataType fl">
          <div class='zhiGong'>&#xe62c;</div>
          <span class='fz16'>已考勤</span>
          <span class='fz12'>（个）</span>
        </div>
        <div class="dataNum fl">
          <div class="todayNum">{{toZero(todayList.attendCount)}}</div>
          <div class="yesterdayNum">昨：{{toZero(yesList.attendCount)}}人</div>
        </div>
      </el-col>
      <el-col :span='4' class="item">
        <div class="dataType fl">
          <div class='zhiGong'>&#xe624;</div>
          <span class='fz16'>异常考勤</span>
          <span class='fz12'>（个）</span>
        </div>
        <div class="dataNum fl">
          <div class="todayNum">{{toZero(todayList.attendException)}}</div>
          <div class="yesterdayNum">昨：{{toZero(yesList.attendException)}}人</div>
        </div>
      </el-col>
      <el-col :span='4' class="item">
        <div class="dataType fl">
          <div class='zhiGong'>&#xe621;</div>
          <span class='fz16'>考勤率</span>
          <span class='fz12'>（%）</span>
        </div>
        <div class="dataNum fl">
          <div class="todayNum">{{toPercent(todayList.attendRate)}}</div>
          <div class="yesterdayNum">昨：{{toPercent(yesList.attendRate)}}<span>%</span></div>
        </div>
      </el-col>
      <el-col :span='4' class="item">
        <div class="dataType fl">
          <div class='zhiGong'>&#xe62d;</div>
          <span class='fz16'>平均工时</span>
          <span class='fz12'>（小时）</span>
        </div>
        <div class="dataNum fl">
          <div class="todayNum">{{toZero(todayList.averDuration)}}</div>
          <div class="yesterdayNum">昨：{{toZero(yesList.averDuration)}}<span>小时</span></div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: "dataList5",
    data() {
        return {
          projName:'深圳南山智园项目',

          value2: '',
        }
    },
    methods: {
      toZero(val){
        if(!val){
          return 0
        }else{
          return val
        }
      },
      toPercent(val){
        if(!val){
          return 0
        }else{
          return Math.round( val*100 )
        }
      }
    },
    props:['todayList','yesList'],
    mounted(){

    },
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import '../../assets/sass/variable';
  .colFirst{
    padding-left: 15px;
  }
  .projName{
    font-size: 20px;
    font-weight: bold;
    text-align: left;
    line-height: 56px;
  }
.dataList6{
  padding-top: 10px;
}
  //item style
.dataList{
  overflow: hidden;
  .item{
    width: 240px;
    float: left;
    text-align: center;
    margin-right: 44px;
    &:nth-child(6){
      margin-right: 0;
    }
    &.projNum{
      .dataNum{
        line-height: 110px;
        font-size: 46px;
        color: $dataColor;
        padding-top: 0;
        height: 110px;
      }
    }
    .dataType{
      padding-top: 12px;
      padding-bottom: 13px;
      width: 35%;
      background: $dataBlue;
      .zhiGong{
        font-size: 40px;
        color: $cf;
      }
      span{
        color: $cf;
        display: block;
      }
      .fz16{
        line-height: 26px;
      }
      .fz12{
        line-height: 16px;
      }
    }
    .dataNum{
      width: 65%;
      background: $bgEc;
      height: 92px;
      padding-top: 18px;
      .todayNum{
        font-size: 30px;
        line-height: 60px;
        color: $dataColor;
      }
      .yesterdayNum{
        font-size: 16px;
        color: $c8;
        line-height: 32px;
      }
    }
  }
}
</style>
