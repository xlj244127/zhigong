<template>
    <div class="projAttend container">
      <common-tit :title="title" :type='true'></common-tit>
      <div class="searchOption">
        <el-autocomplete v-model="nameSearch" :fetch-suggestions="querySearchAsync" placeholder="按项目名称搜索" @select="handleSelect">
          <el-button slot="append" type="primary" icon="el-icon-search" @click="searchName"></el-button>
        </el-autocomplete>
        <div class="block">
          <span class="demonstration">请选择所在地:</span>
          <el-select v-model="proviceVal" placeholder="请选择省份" @change='changeProvice'>
            <el-option
              v-for="(item,index) in proviceOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select v-model="cityVal" placeholder="请选择城市" @change='changeCity' :disabled="cityDisabled" :loading="cityLoading">
            <el-option
              v-for="(item,index) in cityOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <!--<el-select v-model="districtVal" placeholder="请选择区县" @change='changeDistrict' :disabled="districtDisabled" :loading="districtLoading">
            <el-option
              v-for="(item,index) in districtOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>-->
          <el-button type="primary"  @click="placeSearch">搜 索</el-button>
        </div>
        <el-button type="primary" class="fr" @click="createProject()" v-if="companyRole == 1">创建项目</el-button>
      </div>
      <div id="classmateTable" class="projectTable">
        <el-table :data="projectList" style="width: 95%;margin:0 auto"
                  :class="{nobb:noBorderBottom}"
                  v-loading="loading"
                  element-loading-text="正在加载"
        >
          <el-table-column align='center' label="项目名称" min-width="120" >
            <template slot-scope="scope" >
              <span @click="toView(scope.row.id)" class="projectName">{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column align='center' prop="startTime" label="项目创建时间"></el-table-column>
          <el-table-column align='center' prop="location" label="项目所在地" min-width="150"></el-table-column>
          <el-table-column align='center' prop="userCount" label="项目总人数(人)" min-width="72"></el-table-column>
          <el-table-column align='center' prop="adminCount" label="项目管理员(人)" min-width="72"></el-table-column>
          <el-table-column align='center' prop="groupCount" label="班组(个)" min-width="72"></el-table-column>
          <el-table-column align='center' prop="groupUserCount" label="班组人数(人)" min-width="72"></el-table-column>
          <el-table-column align='center' prop="tempCount" label="临时工(人)" min-width="72"></el-table-column>
          <el-table-column align='center' prop="machineCount" label="考勤机(台)" min-width="72"></el-table-column>
          <el-table-column align='center' prop="company" label="劳务公司" min-width="120"></el-table-column>
          <el-table-column align='center' label="项目设置" min-width="120">
            <template slot-scope="scope">
              <span @click.prevent="toEdit(scope.row.id)" class="edit view"><i class="zhiGong">&#xe626;</i>编辑</span><span @click.prevent="toDel(scope.row.id)" class="view"  v-if="companyRole == 1"><i class="zhiGong">&#xe635;</i>删除</span>
            </template>
          </el-table-column>
          <el-table-column align='center' label="人员设置" min-width="100">
            <template slot-scope="scope">
              <span @click="toView(scope.row.id)" class="view"><i class='zhiGong'>&#xe626;</i>查看编辑</span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination v-if="showPagination"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="10"
          layout="total, prev, pager, next, jumper"
          :total="totalNum">
        </el-pagination>
      </div>
    </div>
</template>

<script>
  import classmateTable from '@/components/table/classmateTable'
  import commonTit from '@/components/common/commonTit'
  import {userApi,projectApi} from "../../api";
  import moment from 'moment'
  import {LocalCache} from "../../lib/utils";
  export default {
      name: "",
      components:{
       classmateTable,commonTit
      },
      prop:['projName','projData'],
      data() {
        return {
          title:'项目管理',
          proviceVal:'',
          noBorderBottom:false,
          cityVal:'',
          districtVal:'',
          proviceOptions:[],
          cityOptions:[],
          districtOptions:[],
          totalNum:1,
          currentPage:1,
          classmateList:[],
          red:false,
          org:false,
          projectList:[],
          loadAll:[],
          nameSearch:'',
          groupName:'',
          cityDisabled:true,
          districtDisabled:true,
          cityLoading:true,
          districtLoading:true,
          nameList:[],
          noResult:'当前公司下暂无项目！',
          noSearchResult:'暂无符合条件的搜索结果！',
          companyRole:'',
          loading:true,
          showPagination:false,
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
        changeProvice(){
          this.cityDisabled = true;
          var specialCity=[1,4,7,23,29,32,34]
          let specialCityIndexOf = specialCity.indexOf(this.proviceVal)
          if(this.proviceVal!=null){
            //this.cityLoading = true;
            //this.cityVal = '';
            //this.districtVal = '' ;
            let allCity = [{
              name:'全部地区',
              id:null
            }]
            userApi.addressCityList(this.proviceVal).then((res)=>{
              //console.log(res.data.list);
              if(specialCityIndexOf==-1){
                this.cityOptions = [...allCity,...res.data.list];
              }else{
                this.cityOptions =res.data.list;
              }
              this.cityVal = this.cityOptions[0].id
              this.cityLoading = false;
              setTimeout(() => {
                this.cityDisabled = false;
              }, 200);
            }).catch((res)=>{
              this.$message({
                type:'error',
                message:res.msg
              })
              this.cityLoading = false;
              this.cityDisabled = false;
            })
          }else{

            this.cityLoading = false;
            this.cityVal = '';
          }
        },
        placeSearch(){
          this.loading = true;
          this.noBorderBottom = false;
          this.getData(1,10,'',this.nameSearch,this.proviceVal,this.cityVal,this.districtVal,'',true)
        },
        changeCity(){
          //this.districtDisabled = false;
          //this.districtLoading = true;
          this.districtVal = '' ;
          /*userApi.addressAreaList(this.cityVal).then((res)=>{
            //console.log(res.data.list);
            this.districtOptions = res.data.list;
            this.districtLoading = false;
          }).catch((res)=>{
            this.$message({
              type:'error',
              message:res.msg
            })
            this.districtLoading = false;
          })*/
        },
        changeDistrict(){
          this.getData(this.page,10,'',this.nameSearch,this.proviceVal,this.cityVal,this.districtVal,'',true)
          if(this.projectList.length==0){
            this.noResult = this.noSearchResult
          }
        },
        toView(val){
          this.$router.push({path:'/project/detail/'+val})
        },
        toEdit(val){
          this.$router.push({path:'/project/editDetail/'+val})
        },
        createProject(val){
          this.$router.push({path:'/project/editDetail/'+0})
        },
        toDel(val){
          console.log(val);
          let that = this;
          this.$confirm('此操作将删除该项目, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            projectApi.delProj(val).then(()=>{
              that.projectList.splice(that.projectList.findIndex(v => v.id === val),1);
              that.$message({
                type: 'success',
                message: '删除成功!'
              });
            })

          }).catch(() => {
            that.$message({
              type: 'info',
              message: '已取消删除'
            });
          });

        },
        handleSizeChange(val) {
          console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
          this.loading = true;
          this.noBorderBottom = false
          this.getData(val,10,'',this.nameSearch,this.proviceVal,this.cityVal,this.districtVal,'',true)
        },

        querySearchAsync(queryString, cb) {
          if(this.companyRole==1){
            projectApi.allProjectList("","",'',this.nameSearch,this.proviceVal,this.cityVal,this.districtVal,'',true).then((res)=>{
              console.log(res);
              this.nameList = res.data
              var results = queryString ?  this.nameList.filter(this.createStateFilter(queryString)) :  this.nameList;
              let nameList=new Array();
              for(var i=0;i<results.length;i++){
                let obj={
                  value:results[i].name
                }
                nameList.push(obj)
              }
              cb(nameList);

            }).catch((res)=>{
              console.log(res);
            })
          }else if(this.companyRole==2){
            projectApi.projerProjList("","",this.nameSearch,this.proviceVal,this.cityVal,this.districtVal,true).then((res)=>{
              console.log('projerProjList',res.data);
              this.nameList = res.data
              var results = queryString ?  this.nameList.filter(this.createStateFilter(queryString)) :  this.nameList;
              let nameList2=new Array()
              for(var i=0;i<results.length;i++){
                let obj={
                  value:results[i].name
                }
                nameList2.push(obj)
              }
              cb(nameList2);
            }).catch((res)=>{
              console.log(res);
            })
          }

        },
        createStateFilter(queryString) {
          return (state) => {
            return (state.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
          };
        },
        handleSelect(item) {
          console.log(item);
          this.loading = true
          this.noBorderBottom = false
          this.getData(1,10,'',this.nameSearch,this.proviceVal,this.cityVal,this.districtVal,'',true)
        },
        getData(page,pageSize,status, name, provinceId, cityId, districtId, order, withDetail){
          if(this.companyRole==1){
            projectApi.allProjectList(page,pageSize,status, name, provinceId, cityId, districtId, order, withDetail).then((res)=>{
              console.log(res);
              this.projectList = res.data
              for(var i=0;i<res.data.length;i++){
                this.projectList[i].startTime = moment(this.projectList[i].startTime).format('YYYY-MM-DD')
              }
              this.loadingClose()
              this.totalNum = res.pagination.totalItems
              if(res.pagination.totalPages<=1){
                this.showPagination = false
              }else{
                this.showPagination = true
              }

            }).catch((res)=>{
              console.log(res);
              this.loadingClose()
            })
          }else if (this.companyRole==2){
            projectApi.projerProjList(page,pageSize,name, provinceId, cityId, districtId, withDetail).then((res)=>{
              console.log('projerProjList',res.data);
              this.projectList = res.data
              for(var i=0;i<res.data.length;i++){
                this.projectList[i].startTime = moment(this.projectList[i].startTime).format('YYYY-MM-DD')
              }
              this.totalNum = res.pagination.totalItems
              if(res.pagination.totalPages<=1){
                this.showPagination = false
              }else{
                this.showPagination = true
              }
              this.loadingClose()
            }).catch((res)=>{
              console.log(res);
              this.loadingClose()
            })
          }else{
            this.loadingClose()
          }

        },
        changeDate(){

        },
        searchName(){
          this.getData(1,10,'',this.nameSearch,this.proviceVal,this.cityVal,this.districtVal,'',true)
        },
        view(index){

        },
        loadingClose(){
          setTimeout(() => {
            this.noBorderBottom =true
            this.loading = false;
          }, 500);
        },
      },
      beforeMount(){
        this.companyRole = LocalCache.get('companyInfo').companyRole ;
        let arrAll =[{
          name:"全部",
          id:null
        }]
        userApi.addressProviceList().then((res)=>{
          this.proviceOptions =[...arrAll,...res.data.list] //res.data.list
        }).catch((res)=>{
          this.$message({
            type:'error',
            message:res.msg
          })
        })
        let companyInfo = LocalCache.get('companyInfo')
        if(companyInfo.companyRole==1){
          this.managerStatus = true
        }else{
          this.managerStatus = false
        }
      },
      mounted(){
        //proviceVal:'',
        //  cityVal:'',
        //  districtVal:'',
        this.getData(1,10,'',this.nameSearch,this.proviceVal,this.cityVal,this.districtVal,'',true)
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
