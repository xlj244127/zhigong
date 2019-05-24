<template>
  <div class="dataList6 dataList">
    <el-row type='flex'>
      <el-col :span='3' class="item projNum">
          <div class="dataType fl">
            <div class='zhiGong'>&#xe632;</div>
            <span class='fz16'>项目数</span>
            <span class='fz12'>（个）</span>
          </div>
          <div class="dataNum fl">
            {{toZero(dataList6.projectCount)}}
          </div>
      </el-col>
      <el-col :span='3' class="item">
        <div class="dataType fl">
          <div class='zhiGong'>&#xe639;</div>
          <span class='fz16'>历史人数</span>
          <span class='fz12'>（人）</span>
        </div>
        <div class="dataNum fl">
          <div class="todayNum">{{toZero(dataList6.totalUsers)}}</div>
          <div class="yesterdayNum">昨：{{toZero(lastDataList.totalUsers)}}人</div>
        </div>
      </el-col>
      <el-col :span='3' class="item">
        <div class="dataType fl">
          <div class='zhiGong'>&#xe63a;</div>
          <span class='fz16'>当前人数</span>
          <span class='fz12'>（人）</span>
        </div>
        <div class="dataNum fl">
          <div class="todayNum">{{toZero(dataList6.currentlyUsers)}}</div>
          <div class="yesterdayNum">昨：{{toZero(lastDataList.currentlyUsers)}}人</div>
        </div>
      </el-col>
      <el-col :span='3' class="item">
        <div class="dataType fl">
          <div class='zhiGong'>&#xe62c;</div>
          <span class='fz16'>已考勤</span>
          <span class='fz12'>（人）</span>
        </div>
        <div class="dataNum fl">
          <div class="todayNum">{{toZero(dataList6.attendCount)}}</div>
          <div class="yesterdayNum">昨：{{toZero(lastDataList.attendCount)}}人</div>
        </div>
      </el-col>
      <el-col :span='3' class="item">
        <div class="dataType fl">
          <div class='zhiGong'>&#xe624;</div>
          <span class='fz16'>异常考勤</span>
          <span class='fz12'>（人）</span>
        </div>
        <div class="dataNum fl">
          <div class="todayNum">{{toZero(dataList6.attendException)}}</div>
          <div class="yesterdayNum">昨：{{toZero(lastDataList.attendException)}}人</div>
        </div>
      </el-col>
      <el-col :span='3' class="item">
        <div class="dataType fl">
          <div class='zhiGong'>&#xe621;</div>
          <span class='fz16'>考勤率</span>
          <span class='fz12'>（%）</span>
        </div>
        <div class="dataNum fl">
          <div class="todayNum">{{toPercent(dataList6.attendRate)}}</div>
          <div class="yesterdayNum">昨：{{toPercent(lastDataList.attendRate)}}%</div>
        </div>
      </el-col>
      <el-col :span='3' class="item">
        <div class="dataType fl">
          <div class='zhiGong'>&#xe62d;</div>
          <span class='fz16'>平均工时</span>
          <span class='fz12'>（小时）</span>
        </div>
        <div class="dataNum fl">
          <div class="todayNum">{{toZero(dataList6.averDuration)}}</div>
          <div class="yesterdayNum">昨：{{toZero(lastDataList.averDuration)}}小时</div>
        </div>
      </el-col>

    </el-row>
  </div>
</template>

<script>
  import {dataReset} from "../../lib/utils";
  export default {
    name: "",
    data() {
        return {

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
    props:['dataList6','lastDataList'],
    mounted(){
      console.log('lastDataList',this.lastDataList);
    },
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import '../../assets/sass/variable';
.dataList6{
  padding: 15px 5px 0;
}
  //item style
.dataList{
  overflow: hidden;
  .item{
    width: 240px;
    float: left;
    text-align: center;
    margin-right: 30px;
    &:nth-child(7){
      margin-right: 0;
    }
    &.projNum{
      .dataNum{
        line-height: 110px;
        font-size: 50px;
        color: $dataColor;
        padding-top: 0;
        height: 110px;
      }
    }
    .dataType{
      padding-top: 12px;
      padding-bottom: 13px;
      width: 40%;
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
      width: 60%;
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
