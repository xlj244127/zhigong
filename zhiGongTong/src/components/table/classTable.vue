<template>
  <div id="classTable">
    <common-tit :title='projName' :type='true'></common-tit>
    <div id="tableInner">
      <el-row>
        <el-col :span='3'>项目成员</el-col>
        <el-col :span='2'>成员数(人)</el-col>
        <el-col :span='2'>已考勤(人)</el-col>
        <el-col :span='2'>正常考勤(人)</el-col>
        <el-col :span='2'>异常考勤(人)</el-col>
        <el-col :span='2'>缺卡考勤(人)</el-col>
        <el-col :span='2'>无考勤(人)</el-col>
        <el-col :span='2'>考勤率(%)</el-col>
        <el-col :span='2'>异常考勤率(%)</el-col>
        <el-col :span='2'>平均工时(小时)</el-col>
        <el-col :span='3'>查看全部成员</el-col>
      </el-row>
      <el-row :span="24" v-if='projData.length == 0' class='projData'><span class="noData">该项目下下暂无班组，快去导入或创建班组吧！</span></el-row>
      <el-row v-for="(item,index) in projData" :key='item.index' v-else>
        <el-col :span='3'><router-link :to="road+projectId+'/'+item.groupId">{{item.groupName}}</router-link></el-col>
        <el-col :span='2'>{{toZero(item.totalUsers)}}</el-col>
        <el-col :span='2'>{{toZero(item.attendCount)}}</el-col>
        <el-col :span='2'>{{toZero(item.attendNormal)}}</el-col>
        <el-col :span='2'>{{toZero(item.attendException)}}</el-col>
        <el-col :span='2'>{{toZero(item.lackAttend)}}</el-col>
        <el-col :span='2'>{{toZero(item.noAttend)}}</el-col>
        <el-col :span='2'>{{toPercent(item.attendRate)}}%</el-col>
        <el-col :span='2'>{{toPercent(item.exceptionRate)}}%</el-col>
        <el-col :span='2'>{{toZero(item.averDuration)}}</el-col>
        <el-col :span='3'>
          <router-link :to="road+projectId+'/'+item.groupId">查看</router-link>
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
          title:'xxx项目班组考勤',
          road:'/attend/classAttend/'
        }
      },
      components:{
        commonTit
      },
      props:['projName','projData','projectId'],
      methods:{
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
      },
      mounted(){
        console.log(this.classList);
        if(this.classList != null){

        }
      }
    }
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../assets/sass/variable";
  #classTable{
    margin: 10px 10px 20px;
    border: $bd-d;
  }
  #tableInner{
    margin: 19px 19px 19px;
  }
  .el-row{
    height: 70px;
  }
  .el-col{
    line-height: 50px;
    background:rgba(245,249,253,1);
    height: 50px;
    overflow: hidden;
    padding-bottom:  20px;
    a{
      color: $optBlue;
    }
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
