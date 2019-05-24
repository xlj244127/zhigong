<template>
  <div class="projAttend container">
    <common-tit :title="title" :type='true'></common-tit>
    <div class="searchOption">
      <el-autocomplete v-model="nameSearch" :fetch-suggestions="querySearchAsync" placeholder="按照考勤规则名称搜索" @select="handleSelect">
        <el-button slot="append" type="primary" icon="el-icon-search" @click="searchName"></el-button>
      </el-autocomplete>
      <el-button class="fr" type="primary" @click="jumpToCreat">
        创建规则
      </el-button>
    </div>
    <div id="classmateTable" class="projectTable">
      <el-table :data="ruleList" style="width: 95%;margin:0 auto"
                v-loading="loading"
                element-loading-text="正在加载"
                :class="{nobb:noBorderBottom}"
      >
        <el-table-column align='center' label="考勤规则名称" prop='dutyruleName' min-width="120" >
        </el-table-column>
        <el-table-column align='center' prop="dutyDateStr" label="考勤日期">
        </el-table-column>
        <el-table-column align='center'  label="考勤时间">
          <template slot-scope="scope">
            <div v-for="item in scope.row.detailList">
              {{item.dutytimeStart}}--{{item.dutytimeEnd}}
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="法定节假日自动排休" min-width="80" prop="uselegaldayStr"></el-table-column>
        <el-table-column align='center' label="查看" min-width="70"  class="limitMain">
          <template slot-scope="scope">
            <span @click.prevent="viewDetail(scope.row.id)" class="view"><i class='zhiGong'>&#xe67c;</i>点击查看</span>
          </template>
        </el-table-column>
        <el-table-column align='center' label="操作" min-width="80"  class="limitMain" v-if="companyRole==1">
          <template slot-scope="scope">
            <span @click.prevent="editRule(scope.row.id)" class="view edit"><i class="zhiGong">&#xe626;</i>编辑</span>
            <span @click.prevent="delRule(scope.row.id)" class="view"><i class="zhiGong relieve">&#xe644;</i>删除</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-if="showPagination"
                     @current-change="handleCurrentChange"
                     :current-page.sync="currentPage"
                     :page-size="10"
                     layout="total, prev, pager, next, jumper"
                     :total="totalNum"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import classmateTable from '@/components/table/classmateTable'
  import commonTit from '@/components/common/commonTit'
  import {dutyApi,userApi} from "../../api";
  import {LocalCache} from "../../lib/utils";
  import {getToday} from "../../lib/getDate";
  export default {
    name: "",
    components:{
      classmateTable,commonTit
    },
    prop:['projName','projData'],
    data() {
      return {
        title:'项目考勤列表',
        noBorderBottom:false,
        totalNum:1,
        currentPage:1,
        nameSearch:'',
        groupName:'',
        nameList:[],
        noResult:'当前公司下暂无项目！',
        noSearchResult:'暂无符合条件的搜索结果！',
        companyRole:'',
        loading:true,
        showPagination:false,
        nameList:[],
        ruleList:[],
      }
    },
    methods: {
      placeSearch(){
        this.loading = true;
        this.noBorderBottom = false;
        this.getData(this.nameSearch,1,10)
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.getData(this.nameSearch,val,10)
      },

      querySearchAsync(queryString, cb) {
        dutyApi.getDutyRuleDetail("",this.companyId,this.nameSearch,1,1000).then((res)=>{
          console.log('querySearchAsync',res.data);
          let resData = res.data
          this.nameList = res.data;
          var results = queryString ?  this.nameList.filter(this.createStateFilter(queryString)) :  this.nameList;
          this.totalNum = res.pagination.totalItems
          let nameList=new Array();
          for(var i=0;i<results.length;i++){
            let obj={
              value:results[i].dutyruleName
            }
            nameList.push(obj)
          }
          cb(nameList);
          if(res.pagination.totalPages>1){
            this.showPagination = true
          }else{
            this.showPagination = false
          }
          this.loadingClose()
        }).catch((res)=>{
          console.log(res);
          this.loadingClose()
        })
      },
      jumpToCreat(){
        this.$router.push({path:'/attend/createRule/0'})
      },
      createStateFilter(queryString) {
        return (state) => {
          return (state.projectName.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      handleSelect(item) {
        console.log(item);
        //this.getData('',this.nameSearch,this.proviceVal,this.cityVal,this.districtVal,'',true)
      },
      getData(dutyRuleName,page,pageSize){
        this.today = getToday();
        dutyApi.getDutyRuleDetail("",this.companyId,dutyRuleName,page,pageSize).then((res)=>{
          console.log('getDutyRuleDetail',res);
          this.ruleList = res.data
          this.totalNum = res.pagination.totalItems
          if(res.pagination.totalPages>1){
            this.showPagination = true
          }else{
            this.showPagination = false
          }

          this.loadingClose()
        }).catch((res)=>{
          console.log(res);
          this.loadingClose()
        })
      },
      changeDate(){

      },
      searchName(){
        this.getData(this.nameSearch,1,10)
      },
      viewDetail(id){
        this.$router.push({
          path:"/attend/view/"+id
        })
      },
      loadingClose(){
        setTimeout(() => {
          this.noBorderBottom =true
          this.loading = false;
        }, 500);
      },
      delRule(id){
        let that = this;
        this.$confirm('此操作将删除该考勤规则, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          dutyApi.deleteDutyRule(id,that.companyId).then(()=>{
            that.$message({
              type: 'success',
              message: '删除成功!',
            });
            that.getData(this.nameSearch,1,10)
          })
        }).catch(() => {
          that.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      editRule(id){
        this.$router.push({
          path:"/attend/createRule/"+id
        })
      },
    },
    beforeMount(){
      this.companyRole = LocalCache.get('companyInfo').companyRole
      this.companyId   = LocalCache.get('companyInfo').companyId
    },
    mounted(){
      this.getData(this.nameSearch,1,10)
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../assets/sass/variable";
  .searchOption{
    width: 95%;
    margin: 0 auto;
    overflow: hidden;
    padding-top: 30px;
    .block,.el-autocomplete{
      float: left;
      margin-right: 20px;
    }
  }
  #tableInner{
    width: 95%;
    margin: 20px auto 20px;
    border: $bd-c;
    .tableHeader{
      height: 52px;
      .el-col{
        height: 52px;
        padding-top: 8px;
        padding-bottom: 8px;
        span{
          font-size: 12px;
          display: block;
          text-align: center;
        }
      }
      .lh22{
        line-height: 18px;
      }
      .lh44{
        line-height: 36px;
      }
    }
  }
  .tableMain{
    .el-row:first-child{
      background:#fff;
      border-bottom: 1px solid #ccc;
    }
    .el-row:last-child{
      border-bottom: none;
    }
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
    &.red{
      color: $red;
    }
    &.org{
      color: $lackOrg;
    }
  }
  .el-pagination{
    font-weight: 400;
  }
  .el-select{
    width: 180px;
  }
  #app #tableInner .el-col{
    font-size: 14px;
  }
  .view{
    cursor: pointer;
    color: $optBlue;
    margin-right: 20px;
    &:last-child{
      margin-right: 0;
    }
    i{
      font-size: 14px;
      margin-right: 4px;
    }
  }
  .edit{
    margin-right: 8px;
  }
  .tov{
    -ms-text-overflow: ellipsis;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .el-table{
    border-top: 1px solid #ccc;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;

  }
  #classmateTable{
    margin-top: 20px;
  }
  .projectName{
    color: $optBlue;
    cursor: pointer;
  }
</style>
