<template>
<div class='container'  v-loading="loading"
     element-loading-text="正在加载">
    <el-row type="flex" class="entrySum" justify="space-around">
      <el-col :span="6"><div class="board zhiGong">&#xe623;</div><div class="sumMain"><p>{{entrySum.projectsUsersCount}}</p><div>总人数（人）</div></div></el-col>
      <el-col :span="6"><div class="board zhiGong">&#xe63d;</div><div class="sumMain"><p>{{entrySum.noIDUsersCount}}</p><div>未录身份证（人）</div></div></el-col>
      <el-col :span="6"><div class="board zhiGong">&#xe624;</div><div class="sumMain"><p>{{entrySum.noFacedUsersCount}}</p><div>未录人脸（人）</div></div></el-col>
    </el-row>
  <div class="block">
    <el-autocomplete v-model="nameSearch" :fetch-suggestions="querySearchAsync" placeholder="按项目名称搜索" @select="handleSelect" class='nameSearch'>
      <el-button slot="append" type="primary" icon="el-icon-search" @click="searchName"></el-button>
    </el-autocomplete>
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
  <div class="projectTable">
    <el-table :data="projectList" style="width: 95%;margin:0 auto"
              :class="{nobb:noBorderBottom}"
              v-loading="tableLoading"
              element-loading-text="正在加载"
    >

      <el-table-column align='center' prop="name" label="项目名称"></el-table-column>
      <el-table-column align='center' prop="noIDCount" label="未录身份证">
        <template slot-scope="scope" >
          <span  class="projectName">{{toZero(scope.row.noIDCount)}}</span>
        </template>
      </el-table-column>
      <el-table-column align='center' prop="noFacedCount" label="未录人脸">
        <template slot-scope="scope" >
          <span class="projectName">{{toZero(scope.row.noFacedCount)}}</span>
        </template>
      </el-table-column>
      <el-table-column align='center' prop="noFacedCount" label="查看">
        <template slot-scope="scope">
          <span @click="toView(scope.row.id)" class="view"><i class='zhiGong'>&#xe67c;</i>查看</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-if="showPagination"
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
    import { projectApi,companyApi,userApi } from "../../api";
    import { LocalCache } from "../../lib/utils";

    export default {
        name: "infoEntry",
        data() {
            return {
              loading:true,
              companyId:"",
              projectList:[],
              entrySum:{},
              proviceVal:'',
              noBorderBottom:false,
              cityVal:'',
              districtVal:'',
              proviceOptions:[],
              cityOptions:[],
              districtOptions:[],
              totalNum:1,
              currentPage:1,
              cityDisabled:true,
              districtDisabled:true,
              cityLoading:true,
              districtLoading:true,
              noResult:'当前公司下暂无项目！',
              noSearchResult:'暂无符合条件的搜索结果！',
              tableLoading:true,
              showPagination:false,
              nameSearch:'',

            }
        },
        methods: {
          loadingClose(){
            setTimeout(() => {
              this.loading = false;
            }, 500);
          },
          tableLoadingClose(){
            setTimeout(() => {
              this.noBorderBottom = true
              this.tableLoading = false;
            }, 500);
          },
          toZero(val){
            if(!val){
              return 0
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
              let  allCity = [{
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
              //this.tableLoading = true;
              //this.noBorderBottom = false;
              //this.getData(1,10,this.nameSearch,this.proviceVal,this.cityVal,this.districtVal,true)
            }else{
              this.cityLoading = false;
              this.cityVal = '';
            }
          },
          placeSearch(){
            this.tableLoading = true;
            this.noBorderBottom = false;
            this.getData(1,10,this.nameSearch,this.proviceVal,this.cityVal,this.districtVal,true)
          },
          searchName(){
            this.getData(1,10,this.nameSearch,this.proviceVal,this.cityVal,this.districtVal)
          },
          handleCurrentChange(val){
            this.getData(val,10,this.nameSearch,this.proviceVal,this.cityVal,this.districtId,true)
          },
          querySearchAsync(queryString, cb) {

            if(this.companyRole ==2){
              projectApi.projerProjList(1,10000,this.nameSearch,this.proviceVal,this.cityVal,this.districtVal,true).then((result)=>{
                console.log('projerProjList',result.data);
                this.nameList = result.data;
                var results = queryString ?  this.nameList.filter(this.createStateFilter(queryString)) :  this.nameList;
                this.totalNum = result.pagination.totalItems;
                if(result.pagination.totalPages>1){
                  this.showPagination = true
                }else{
                  this.showPagination = false
                }
                let nameList=new Array();
                for(var i=0;i<results.length;i++){
                  let obj={
                    value:results[i].name
                  }
                  nameList.push(obj)
                }
                cb(nameList);
                this.tableLoadingClose()
              })
            }else if (this.companyRole==1){
              companyApi.companyProjList(this.nameSearch,this.proviceVal,this.cityVal,1,10000).then((result)=>{
                console.log('我获取了公司项目列表');
                console.log(result);
                this.nameList = result.data
                var results = queryString ?  this.nameList.filter(this.createStateFilter(queryString)) :  this.nameList;
                this.totalNum = result.pagination.totalItems;
                //console.log(this.totalNum,pageSize,this.totalNum  > pageSize);
                if(result.pagination.totalPages>1){
                  this.showPagination = true
                }else{
                  this.showPagination = false
                }
                let nameList=new Array();
                for(var i=0;i<results.length;i++){
                  let obj={
                    value:results[i].name
                  }
                  nameList.push(obj)
                }
                cb(nameList);
                this.tableLoadingClose()
              });
            }else{
              this.entrySum.projectsUsersCount = 0
              this.entrySum.noIDUsersCount     = 0
              this.entrySum.noFacedUsersCount  = 0
              this.tableLoadingClose()
            }
          },
          createStateFilter(queryString) {
            return (state) => {
              return (state.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
          },
          handleSelect(item) {
            console.log(item);
            this.getData(1,10,this.nameSearch,this.proviceVal,this.cityVal,this.districtVal,'',true)
          },
          changeCity(){
            this.districtDisabled = false;
            this.districtLoading = true;
            this.districtVal = '' ;
            userApi.addressAreaList(this.cityVal).then((res)=>{
              //console.log(res.data.list);
              this.districtOptions = res.data.list;
              this.districtLoading = false;
            }).catch((res)=>{
              this.$message({
                type:'error',
                message:res.msg
              })
              this.districtLoading = false;
            })
          },
          changeDistrict(){
            //this.getData('',this.nameSearch,this.proviceVal,this.cityVal,this.districtVal,'',true)
            if(this.projectList.length==0){
              this.noResult = this.noSearchResult
            }
          },
          toView(val){
            this.$router.push({path:'/infoEntry/projectEntry/'+val})
          },
          getData(page,pageSize,name,provinceId,cityId,districtId,withDetail){
            if(this.companyRole ==2){
              projectApi.projerProjList(page,pageSize,name,provinceId,cityId,districtId,withDetail).then((result)=>{
                console.log('projerProjList',result.data);
                this.projectList = result.data;
                this.tableLoadingClose()
                this.totalNum = result.pagination.totalItems;
                console.log(this.totalNum,pageSize,this.totalNum  > pageSize);
                if(this.totalNum>pageSize){
                  this.showPagination = true
                }else{
                  this.showPagination = false
                }
              })
              projectApi.projInfoEnterSum().then((result)=>{
                console.log('我获取的项目信息汇总');
                console.log('projInfoEnterSum',result.data);
                this.entrySum = result.data;
              });
            }else if (this.companyRole==1){
              companyApi.companyInfoEnterSum().then((result)=>{
                console.log('companyInfoEnterSum',result.data);
                this.entrySum = result.data;
                this.entrySum.projectsUsersCount = result.data.companyUsersCount
                this.entrySum.noIDUsersCount = result.data.companyNoIDUsersCount
                this.entrySum.noFacedUsersCount = result.data.companyNoFacedUsersCount
              })
              companyApi.companyProjList(name,provinceId,cityId,page,pageSize).then((result)=>{
                console.log('我获取了公司项目列表');
                console.log(result);
                this.projectList = result.data;
                this.totalNum = result.pagination.totalItems;
                console.log(this.totalNum,pageSize,this.totalNum  > pageSize);
                if(this.totalNum>pageSize){
                  this.showPagination = true
                }else{
                  this.showPagination = false
                }
                this.tableLoadingClose()
              });
            }else{
              this.entrySum.projectsUsersCount = 0
              this.entrySum.noIDUsersCount     = 0
              this.entrySum.noFacedUsersCount  = 0
              this.tableLoadingClose()
            }
          },
        },
      beforeMount(){
          this.loadingClose()
          let allProvince =[{
              name:'全部省份',
              id:null
            }];
          userApi.addressProviceList().then((res)=>{
            this.proviceOptions = [...allProvince,...res.data.list]
          }).catch((res)=>{
            this.$message({
              type:'error',
              message:res.msg
            })
          })
          this.companyRole = LocalCache.get('companyInfo').companyRole;

      },
      mounted(){
        this.getData(1,10,this.nameSearch,this.proviceVal,this.cityVal,this.districtId,true)
      }
    }
</script>

<style lang="scss" type="text/scss" scoped>
  @import '../../assets/sass/variable';
  .entrySum{
    padding-top: 20px;
    padding-bottom: 19px;
    border-bottom: 1px solid #E8ECF1;
    height: 140px;
    line-height: 54px;
    margin-bottom: 20px;
    .el-col{
      background: #f4f4f4;
      .board{
        line-height: 100px;
        text-align: center;
        width: 35%;
        background-color: #51a6fe;
        text-align: center;
        color: #ffffff;
        font-size: 54px;
        float: left;
      }
      .sumMain{
        float: left;
        width: 65%;
        text-align: center;
        p{
          font-size: 32px;
          line-height: 58px;
          color: #69839F;
          padding-top: 12px;
        }
        div{
          font-size: 14px;
          color: #69839F;
          line-height: 24px;
        }
      }
    }
  }
  .block{
    margin-right: 20px;
    width: 95%;
    margin: 0 auto;
    text-align: left;
    padding-top: 5px;
    padding-bottom: 20px;
  }
  .el-table{
    border-top: 1px solid #ccc;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;

  }
  .view{
    cursor: pointer;
    color: $optBlue;
    i{
      font-size: 14px;
      margin-right: 4px;
    }
  }
  .block{
    //margin-left: 15px;
    .nameSearch{
      margin-right: 15px;
    }
  }
</style>
