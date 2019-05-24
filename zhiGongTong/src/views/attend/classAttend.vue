<template>
    <div class="projAttend container"

    >
      <common-tit :title="title" :backToList="true"></common-tit>
      <div class="searchOption">
          <div class="block">
            <span class="demonstration">请选择日期:</span>
            <el-date-picker v-model="dateValue" align="right" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" :picker-options="pickerOptions" @change ='changeDate()' :clearable="clearable">
            </el-date-picker>
          </div>
        <!--<div class="block">
          <span class="demonstration">查看该项目下其它班组:</span>
          <el-select v-model="attendValue" >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>-->
        <el-autocomplete v-model="nameSearch" :fetch-suggestions="querySearchAsync" placeholder="按姓名搜索" @select="handleSelect">
          <el-button slot="append" icon="el-icon-search" @click="searchName"></el-button>
        </el-autocomplete>
      </div>
      <div id="classmateTable" class="groupAttendTable">
        <div id="tableInner">
          <el-table :data="classmateList" style="width: 100%;margin:0 auto"
                    :class="{nobb:noBorderBottom}"
                    v-loading="loading"
                    element-loading-text="正在加载">
            <el-table-column align='center' label="姓名" min-width="100" >
              <template slot-scope="scope" >
                <span class="projectName" v-if="scope.row.name">{{scope.row.name}}</span>
                <span class="projectName" v-else-if="scope.row.nickname">{{scope.row.nickname}}</span>
                <span class="projectName" v-else>{{scope.row.mobile}}</span>
              </template>
            </el-table-column>
            <el-table-column align='center' prop="gender" label="性别"  min-width="60"></el-table-column>
            <el-table-column align='center'  label="工种类型" min-width="130" v-if="groupId!=-2 && groupId != -1">
              <template slot-scope="scope" >
                <span>{{toNull(scope.row.workGroupType)}}</span>
              </template>
            </el-table-column>
            <el-table-column align='center' label="考勤次数" min-width="60">
              <template  slot-scope="scope" >
                <span :class='{red:scope.row.red,org:scope.row.org}'>{{scope.row.count}}</span>
              </template>
            </el-table-column>
            <el-table-column align='center' prop="startTime" label="首次考勤时间" min-width="80"></el-table-column>
            <el-table-column align='center' prop="endTime" label="末次考勤时间" min-width="80"></el-table-column>
            <el-table-column align='center' label="其他考勤时间" min-width="80">
              <template  slot-scope="scope" >
                <el-tooltip placement="bottom" effect="light" v-if='scope.row.count>=3' class="toolTip">
                  <div slot="content">
                    {{scope.row.middleTimes}}
                  </div>
                  <el-button>{{scope.row.secondTime}}</el-button>
                </el-tooltip>
                <span v-else>{{scope.row.secondTime}}</span>
              </template>
            </el-table-column>
            <el-table-column align='center' prop="duration" label="工时时长" min-width="80"></el-table-column>
            <el-table-column align='center' label="考勤结果" min-width="80">
              <template slot-scope="scope" >
                <span :class='{red:scope.row.red,org:scope.row.org}'>{{scope.row.statusName}}</span>
              </template>
            </el-table-column>
            <el-table-column align='center' label="薪资规则" min-width="80">
              <template slot-scope="scope" >
                <span v-if="scope.row.salaryType==1">
                  按日
                </span>
                <span v-else-if="scope.row.salaryType==4">
                  按月
                </span>
                <span v-else>
                  --
                </span>
              </template>
            </el-table-column>
          </el-table>
        </div>
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
  import {statisticalSummaryApi,projectApi,groupApi} from "../../api";
  import {getToday} from "../../lib/getDate";

  export default {
      name: "",
      components:{
       classmateTable,commonTit
      },
      prop:['projName','projData'],
      data() {
        return {
          title:'',
          options: [{
            value: '1',
            label: '所有考勤'
          }, {
            value: '2',
            label: '正常考勤'
          }, {
            value: '3',
            label: '缺卡考勤'
          }, {
            value: '4',
            label: '无考勤'
          }],
          nameList:[],
          dateValue: '',
          totalNum:0,
          currentPage:1,
          classmateList:[],
          noBorderBottom:false,
          pickerOptions: {
            disabledDate(time) {
              return time.getTime() > Date.now();
            },
            /*shortcuts: [{
              text: '今天',
              onClick(picker) {
                picker.$emit('pick', new Date());
              }
            }, {
              text: '昨天',
              onClick(picker) {
                const date = new Date();
                date.setTime(date.getTime() - 3600 * 1000 * 24);
                picker.$emit('pick', date);
              }
            }, {
              text: '一周前',
              onClick(picker) {
                const date = new Date();
                date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', date);
              }
            }]*/
          },
          attendValue: '',
          classValue: '',
          red:false,
          org:false,
          classmateList:[],
          loadAll:[],
          nameSearch:'',
          groupName:'',
          loading:true,
          page:1,
          showPagination:false,
          pageSize:20,
          clearable:false,
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
        toNull(val){
          if(val==''){
            return '--'
          }else{
            return val
          }
        },
        handleSizeChange(val) {
          console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
          console.log(`当前页: ${val}`);
          this.page = val
          this.currentPage =val
          this.getData(val,this.pageSize,this.projectId,this.groupId,this.dateValue, this.nameSearch)
        },
        loadingClose(){
          setTimeout(() => {
            this.noBorderBottom = true
            this.loading = false;
          }, 500);
        },
        querySearchAsync(queryString, cb) {
          groupApi.getWorkersAttend(this.page,this.pageSize,'',this.projectId,this.groupId,this.dateValue,this.nameSearch).then((res)=>{
            this.nameList = res.data;
            var results = queryString ?  this.nameList.filter(this.createStateFilter(queryString)) :  this.nameList;
            console.log('results',results);
            //console.log(queryString.toLowerCase());
            let nameList=new Array();
            for(var i=0;i<results.length;i++){
              let obj={
                value:results[i].name
              }
              nameList.push(obj)
            }
            cb(nameList);
          })
        },
        createStateFilter(queryString) {
          return (state) => {
            return (state.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
          };
        },
        handleSelect(item) {
          console.log(item);
          this.getData(this.page,this.pageSize,this.projectId,this.groupId,this.dateValue, item.value)
        },
        getData(page,pageSize,projectId,groupId,day,name){
          groupApi.getWorkersAttend(page,pageSize,'',projectId,groupId,day,name).then((res)=>{
            console.log('classAttend',res);
            let l = res.data.length
            this.classmateList= res.data
            this.totalNum = res.pagination.totalItems;
            console.log(this.totalNum,pageSize,this.totalNum  > pageSize);
            if(this.totalNum>pageSize){
              this.showPagination = true
            }else{
              this.showPagination = false
            }

            for(var i=0; i<l ;i++){
              if(this.classmateList[i].gender==1){
                this.classmateList[i].gender='男'
              }else if(this.classmateList[i].gender==2){
                this.classmateList[i].gender='女'
              }else{
                this.classmateList[i].gender='--'
              }
              if(!res.data[i].attend){
                this.classmateList[i].count ='0'
                this.classmateList[i].startTime ='--'
                this.classmateList[i].endTime ='--'
                this.classmateList[i].secondTime ='--'
                this.classmateList[i].duration ='--'
                this.classmateList[i].statusName ='无考勤'
                this.classmateList[i].red =true
                this.classmateList[i].org =false
              }else{
                if(res.data[i].attend.count=='1'){
                  this.classmateList[i].org =true
                  this.classmateList[i].red =false
                  this.classmateList[i].secondTime = '--'
                  this.classmateList[i].endTime = '--'
                  this.classmateList[i].duration = '--'
                  this.classmateList[i].middleTimes = '--'
                }else if(res.data[i].attend.count=='2'){
                  this.classmateList[i].secondTime = '--'
                  this.classmateList[i].duration = Math.floor(res.data[i].attend.duration/60)+'小时'+res.data[i].attend.duration%60+'分钟'
                  this.classmateList[i].endTime = res.data[i].attend.endTime
                }else{
                  this.classmateList[i].secondTime = res.data[i].attend.middleTimes.split(',')[0]
                  this.classmateList[i].duration = Math.floor(res.data[i].attend.duration/60)+'小时'+res.data[i].attend.duration%60+'分钟'
                  this.classmateList[i].endTime = res.data[i].attend.endTime
                  this.classmateList[i].middleTimes = res.data[i].attend.middleTimes
                }
                this.classmateList[i].count = res.data[i].attend.count
                this.classmateList[i].startTime = res.data[i].attend.startTime
                this.classmateList[i].statusName = res.data[i].attend.statusName
              }
            }
            this.loadingClose();
          }).catch((res)=>{
            this.$message({
              type:'error',
              message:res.msg
            })
          })
        },
        changeDate(){
          console.log(this.dateValue);
          this.loading = true
          this.getData(this.page,this.pageSize,this.projectId,this.groupId,this.dateValue, this.nameSearch)
        },
        searchName(){
          this.getData(this.page,this.pageSize,this.projectId,this.groupId,this.dateValue, this.nameSearch)
        }
      },
    beforeMount(){
      this.projectId = this.$route.params.projectId,
        this.groupId   = this.$route.params.groupId;
    },
      mounted(){

        projectApi.projectDetail(this.projectId).then((res)=>{
          //console.log('projGroupsList',res.data);
          this.projName = res.data.name;
          this.$store.state.projName = res.data.name;
          if(this.groupId==-1){
            this.title = this.projName+'项目组——临时工组';
          }else if(this.groupId==-2){
            this.title = this.projName+'项目组——项目管理员组';
          }else{
            groupApi.getWorkGroup(this.groupId).then((res)=>{
              console.log('getWorkGroup',res.data);
              this.groupName = res.data.name;
              this.$store.state.groupName = res.data.name;
              this.title = this.projName+'项目组——'+this.groupName;
            }).catch((res)=>{
              this.$message({
                type:'error',
                message:res.msg
              })
            })
          }
        })

        this.dateValue = getToday();
        this.getData(this.page,this.pageSize,this.projectId,this.groupId,this.dateValue, this.nameSearch)
        console.log(this.projName);
        console.log('params',this.projectId,this.groupId);
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
  .red{
    color: $red;
  }
  .org{
    color: $lackOrg;
  }
  .el-pagination{
    font-weight: 400;
  }

</style>
