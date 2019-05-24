<template>
    <div class="projAttend container">
      <common-tit :title="title" :type='true'></common-tit>
      <div class="searchOption">
        <div class="projName">{{projName}}</div>
        <span class="demonstration">请选择日期:</span>
        <el-date-picker v-model="dateValue" align="right" type="date" format='yyyy-MM-dd' :picker-options="pickerOptions1" @change="changeDate" :clearable="clearable">
        </el-date-picker>
        <div class="projOption fr">
          <!--<el-button type='primary' class="fl" @click="exportAttend">导出考勤报表</el-button>-->
          <el-button type='primary' class="fr" @click="exportWages()">
            <a :href="exportHref" class="export" target="_blank">导出工资表</a>
          </el-button>
        </div>
      </div>
      <div id="classmateTable" class="projectTable">
        <el-table :data="groupList" style="width: 95%;margin:0 auto"
                  v-loading="loading"
                  element-loading-text="正在加载"
                  :class="{nobb:noBorderBottom}"
        >
          <el-table-column align='center' label="项目名称" min-width="120" >
            <template slot-scope="scope" >
              <span @click="toViewGroup(scope.row.groupId)" class="view">{{scope.row.groupName}}</span>
            </template>
          </el-table-column>
          <el-table-column align='center' label="成员数(人)">
            <template slot-scope="scope">
              <span >{{toZero(scope.row.totalUsers)}}</span>
            </template>
          </el-table-column>
          <el-table-column align='center' label="已考勤(人)">
            <template slot-scope="scope">
              <span >{{toZero(scope.row.attendCount)}}</span>
            </template>
          </el-table-column>
          <el-table-column align='center' label="正常考勤(人)">
            <template slot-scope="scope">
              <span >{{toZero(scope.row.attendNormal)}}</span>
            </template>
          </el-table-column>
          <el-table-column align='center' label="异常考勤(人)">
            <template slot-scope="scope">
              <span >{{toZero(scope.row.attendException)}}</span>
            </template>
          </el-table-column>
          <el-table-column align='center' label="缺卡考勤(人)">
            <template slot-scope="scope">
              <span >{{toZero(scope.row.lackAttend)}}</span>
            </template>
          </el-table-column>
          <el-table-column align='center' label="无考勤(人)">
            <template slot-scope="scope">
              <span >{{toZero(scope.row.noAttend)}}</span>
            </template>
          </el-table-column>
          <el-table-column align='center' label="考勤率(%)">
            <template slot-scope="scope">
              <span >{{toPercent(scope.row.attendRate)}}</span>
            </template>
          </el-table-column>
          <el-table-column align='center' label="异常考勤率(%)">
            <template slot-scope="scope">
              <span >{{toPercent(scope.row.exceptionRate)}}</span>
            </template>
          </el-table-column>
          <el-table-column align='center' label="平均工时(小时)">
            <template slot-scope="scope">
              <span >{{toZero(scope.row.averDuration)}}</span>
            </template>
          </el-table-column>
          <el-table-column align='center' label="查看全部成员" min-width="100">
            <template slot-scope="scope">
              <span @click="toViewGroup(scope.row.groupId)" class="view"><i class='zhiGong'>&#xe626;</i>查看</span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination v-if="showPagination"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="16"
          layout="total, prev, pager, next"
          :total="totalNum">
        </el-pagination>
      </div>
    </div>
</template>

<script>
  import classmateTable from '@/components/table/classmateTable'
  import commonTit from '@/components/common/commonTit'
  import {statisticalSummaryApi,projectApi} from "../../api";
  import {getToday} from "../../lib/getDate";
  import moment from "moment"
  export default {
      name: "",
      components:{
       classmateTable,commonTit
      },
      prop:['projName','projData'],
      data() {
        return {
          pickerOptions1: {
            disabledDate(time) {
              return time.getTime() > Date.now();
            }
          },
          title:'项目考勤列表',
          proviceVal:'',
          noBorderBottom:false,
          dateValue:'',
          totalNum:1,
          currentPage:1,
          classmateList:[],
          red:false,
          org:false,
          groupList:[],
          loadAll:[],
          nameSearch:'',
          groupName:'',
          loading:false,
          nameList:[],
          noResult:'当前公司下暂无项目！',
          noSearchResult:'暂无符合条件的搜索结果！',
          companyRole:'',
          loading:true,
          road:'/attend/classAttend/',
          projName:'',
          loading:true,
          showPagination:false,
          clearable:false,
          exportHref:''
        }
      },
      watch:{
        dateValue(val){
          console.log(val);
        },
        attendValue(val){
          console.log(val);
        }
      },
      methods: {
        toPercent(val){
          if(val==''){
            return '0'
          }else{
            return Math.round(val*100)
          }
        },
        getAttend(today,projectId){
          let that = this
          statisticalSummaryApi.groupDayAttend(projectId, today).then((result)=>{
            console.log('groupDayAttend',result.data);
            that.groupList = result.data
          }).catch((res)=>{
            console.log(res);
          });
          that.loadingClose()
        },
        toViewGroup(val){
          this.$router.push({path:'/attend/classAttend/'+this.projectId+'/'+val})
        },
        handleSizeChange(val) {
          console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
          console.log(`当前页: ${val}`);
        },
        changeDate(){
          this.loading = true
          let changeDate = moment(this.dateValue).format("YYYY-MM-DD")
          this.getAttend(changeDate,this.projectId)
        },
        loadingClose(){
          setTimeout(() => {
            this.noBorderBottom =true
            this.loading = false;
          }, 500);
        },
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
        exportAttend(){

        },
        exportWages(){

        },
      },
      beforeMount(){
        this.projectId = this.$route.params.projectId
        console.log(this.projectId,this.dateValue);
        this.exportHref = 'http://api.zhigong.showtou.com:8080/api/reports/salary?projectId='+this.projectId+"&version=1.0.0.1&channel=src_web"
        projectApi.projectDetail(this.projectId).then((res)=>{
          //console.log(res);
          this.projName = res.data.name;
          this.$store.state.projName = res.data.name;
        }).catch((res)=>{
          console.log(res);
        })
      },
      mounted(){
        this.dateValue = getToday()
        this.getAttend(this.dateValue,this.projectId)
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
    text-align: left;
    .projName{
      font-size: 20px;
      text-align: left;
      float: left;
      line-height: 40px;
      margin-right: 20px;
    }
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
  .export{
    display: block;
    color: #ffffff;
    &:hover,&:link,&:visited{
      color: #ffffff;
    }
  }
  .projOption /deep/ .el-button{
    padding: 0;
    a{
      display: block;
      padding: 12px 20px;
    }
  }
</style>
