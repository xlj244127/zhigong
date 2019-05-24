<template>

</template>

<script>
    import {groupApi} from "../../api";

    export default {
      name: "information",
      props:['groupId'],
      data() {
        return {
          totalNum:'',
          currentPage:1,
          classmateList:[]
        }
      },
      methods:{
        handleSizeChange(val) {
          console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
          console.log(`当前页: ${val}`);
        }
      },
      mounted(){
        console.log(this.groupId);
        groupApi.getWorkersAttend(1,10000,'',this.groupId,getToday(),'').then((res)=>{
          console.log(res);
          this.totalNum = res.data.length
          this.classmateList= res.data
        }).catch((res)=>{
          this.$message({
            type:'error',
            message:res.msg
          })
        })
      }
    }
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../assets/sass/variable";
  #classTable{
  }
  #tableInner{
    width: 95%;
    margin: 20px auto 20px;
    border-top: $bd-c;
    border-left: $bd-c;
    border-right: $bd-c;
  }
  .el-row{
    height: 40px;
    border-bottom: $bd-c;
  }
  .el-row:first-child{
    background:rgba(238,241,246,1);
    border-bottom: none;
  }

  .el-col{
    line-height: 40px;

    height: 40px;
    overflow: hidden;
  }
  .el-pagination{
    font-weight: 400;
  }
</style>
