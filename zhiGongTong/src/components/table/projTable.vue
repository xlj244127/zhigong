<template>
  <div id="projTable">
    <common-tit :title='title' :type="false"></common-tit>
    <div id="attendTab">
      <el-row >
      <el-col :span='6'>
        <div class='colItem fl'>项目</div>
        <div class='colItem fr'>异常考勤率</div>
      </el-col>
      <el-col :span='6'>
        <div class='colItem fl'>项目</div>
        <div class='colItem fr'>异常考勤率</div>
      </el-col>
      <el-col :span='6'>
        <div class='colItem fl'>项目</div>
        <div class='colItem fr'>异常考勤率</div>
      </el-col>
      <el-col :span='6'>
        <div class='colItem fl'>项目</div>
        <div class='colItem fr'>异常考勤率</div>
      </el-col>
    </el-row>
      <el-row >
        <el-col :span='6'>
          <div class='colItem fl'>xxx项目</div>
          <div class='colItem fr'>100%</div>
        </el-col>
        <el-col :span='6'>
          <div class='colItem fl'>xxx项目</div>
          <div class='colItem fr'>100%</div>
        </el-col>
        <el-col :span='6'>
          <div class='colItem fl'>xxx项目</div>
          <div class='colItem fr'>100%</div>
        </el-col>
        <el-col :span='6'>
          <div class='colItem fl'>xxx项目</div>
          <div class='colItem fr'>100%</div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import commonTit from '@/components/common/commonTit'
    export default {
      name: "information",
      data() {
        return {
          title:'项目考勤'
        }
      },
      components:{
        commonTit
      },
      methods:{

      }
    }
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../assets/sass/variable";
  #projTable{
    margin: 10px 10px 20px;
    border: $bd-d;
  }
  #attendTab{
    margin: 19px 19px 19px;
  }
  .el-col{
    line-height: 50px;
    height: 70px;
    overflow: hidden;
    border-right:$bd-d;
    padding-bottom:  20px;
    &:last-child{
      height: 50px;
    }
    &:nth-child(4){
      border-right: none;
    }
  }
  .el-row:last-child .el-col{
    height: 50px;
    padding-bottom: 0;
  }
  .colItem{
    color: #333333;
    background: $lightBlue;
    &.fl{
      width: 55%;
      padding-left: 10%;
      -ms-text-overflow: ellipsis;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space:nowrap;
      text-align: left;
    }
    &.fr{
      width: 30%;
      float: right;
      text-align: center;
      padding-left: 5%;
    }
  }
</style>
