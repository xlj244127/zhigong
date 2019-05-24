<template>
    <div class="limitSetting container">
      <common-tit :title="title" :type="true"></common-tit>
      <div class="opt">
        <div class="tableTitle">
          <span class="demonstration"  v-if="companyRole == 1">部门:&nbsp;</span>
          <el-select v-model="departmentVal" placeholder="所有部门" @change='changeDepartment' v-if="companyRole == 1">
            <el-option
              v-for="(item,index) in departmentList"
              :key="item.id"
              :label="item.departmentName"
              :value="item.id">
            </el-option>
          </el-select>
          <span class="demonstration">职务:&nbsp;</span>
          <el-select v-model="positionVal" placeholder="所有项目" @change='changePosition' :disabled="positionDisabled" :loading="positionLoading">
            <el-option
              v-for="(item,index) in positionsList"
              :key="item.id"
              :label="item.positionsName"
              :value="item.id">
            </el-option>
          </el-select>
          <el-button type="primary"  @click="submitSearch" class="search">搜 索</el-button>
        </div>

      </div>
      <el-table :data="tableData" class='limitTable' v-loading="loading" id="limitSettings" :class="{noBB:noBB}"
                element-loading-text='获取管理人员列表中'>
        <el-table-column align='center' label="所属部门" min-width="120" class="limitMain adminName"  prop="department.departmentName">
        </el-table-column>
        <el-table-column align='center'  label="职务" min-width="120"  class="limitMain"  prop="positionsName">
        </el-table-column>
        <el-table-column align='center' label="权限配置" min-width="130"  class="limitMain">
          <template slot-scope="scope">
            <template v-for="(item,index) in scope.row.postionspermissionsList">
              <span class="demonstration">{{item.permissionsName}}:</span>
              <el-switch
                v-model="item.isenble"
                active-color="#409EFF"
                inactive-color="#C0CCDA"
                :active-value="1"
                :inactive-value = "0"
                :disabled="switchDisabled"
                @change="changePermission(item,item.isenble)"
              >
              </el-switch>
            </template>
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
</template>

<script>
  import commonTit from '@/components/common/commonTit'
  import {rightsApi} from "../../api";
  import {LocalCache} from "../../lib/utils";

  export default {
      inject:['reload'],
      name: "limitSetting",
      components:{
        commonTit
      },
      data() {
          return {
            title:"权限设置列表",
            totalNum:0,
            currentPage:1,
            companyId:'',
            loadingLimit:false,
            loadingSave:false,
            showPagination:false,
            loading:true,
            departmentVal:'',
            positionVal:'',
            departmentList:[],
            positionsList:[],
            positionDisabled:true,
            positionLoading:false,
            switchDisabled:false,
            noBB:false,
            tableData:[
              {
                department:'人力资源部',
                job:'仓库管理员',
                setting:1,
                rule:0,
                manage:1,
              },
            ],
            companyRole:"",
            departmentId:''
          }
      },
      methods: {
        handleCurrentChange(val) {
          this.getData(val,10,this.departmentVal,this.positionVal)
        },

        loadingClose(){
          setTimeout(() => {
            this.noBB = true
            this.loading = false;
          }, 500);
        },
        disabledClose(){
          setTimeout(() => {
            this.switchDisabled = false;
          }, 500);
        },
        //获取公司部门列表
        getDepartments(departmentType){
          let arrAll =[{
            departmentName:"全部",
            id:null
          }]

          rightsApi.getDepartments(this.companyId,departmentType).then((res)=>{
            console.log('getDepartments',res.data);
            this.departmentList = [...arrAll,...res.data]
            if(departmentType == 1 ){
              this.departmentVal = res.data[0].id
              this.getPositions(res.data[0].id)
              this.getData(1,10,res.data[0].id,this.positionVal)
            }
          }).catch((res)=>{
            this.$message.error(res.msg);
            console.log("error",res);
          })
        },
        //获取公司职务列表
        getPositions(departmentId){
          let arrAll =[{
            positionsName:"全部",
            id:null
          }]
          rightsApi.getPositions(this.companyId,departmentId).then((res)=>{
            //console.log("getPositions",res);
            if(res.data.length>1){
              this.positionsList = [...arrAll,...res.data]
            }else{
              this.positionsList = res.data
            }

            this.positionLoading = false
          }).catch((res)=>{
            console.log("error",res);
          })
        },
        changeDepartment(val){
          if(val){
            this.positionDisabled = false
            this.positionLoading = true
            this.getPositions(val)
          }else{
            this.positionDisabled = true
          }
        },

        getData(page, pageSize, departmentId, positionsId){
          rightsApi.getPermissionListPage(page,pageSize,"",departmentId, positionsId,this.companyId).then((res)=>{
            console.log('getPermissionListPage',res.data);
            this.tableData = res.data.list
            this.totalNum = res.data.totalItems
            this.loadingClose()
            if(res.data.totalItems>10){
              this.showPagination = true

            }else{
              this.showPagination = false
            }
          }).catch((res)=>{
            console.log("error",res);
          })
        },
        submitSearch(){
          this.noBB = false
          this.loading = true
          this.getData(1,10,this.departmentVal,this.positionVal)
        },
        changePosition(){

        },
        changePermission(item,isenble){
          let that = this
          console.log('changePermission',item,item.isenble);
          this.switchDisabled = true
          rightsApi.addPermissionList(item.departmentId,item.positionsId,this.companyId,item.permissionsId).then((res)=>{
            console.log('addPermissionList',res);
            this.$message({
              type:'success',
              message:res.msg,
              onClose:function () {
                that.reload()
              }
            })
            this.disabledClose()
          }).catch((res)=>{
            this.$message({
              type:'error',
              message:res.msg,
            })
          })
        }
      },
      beforeMount(){
        this.companyId = LocalCache.get("companyInfo").companyId;
        this.companyRole = LocalCache.get("companyInfo").companyRole;
        if(this.companyRole == 2){
          this.getDepartments(null)
        }else{
          this.getDepartments(1)
          this.positionDisabled = false

        }

        //this.getPositions()
        this.getData(1,10,this.departmentVal,this.positionVal)
      },
      mounted(){
        this.loading=false
        this.userId = LocalCache.get('userInfo').id
      }
    }
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../assets/sass/variable";
  .opt{
    width: 90%;
    margin: 0 auto;
    padding-top: 30px;
    padding-bottom: 30px;
    overflow: hidden;
  }
  .limitTable{
    line-height: 60px;
    width: 90%;
    margin: 0 auto;
    border-left: $bd-c;
    border-top: $bd-c;
    border-right: $bd-c;
    border-bottom: $bd-c;
    &.noBB{
      border-bottom: none;
    }
    .th{
      background: #EEF1F6;
      color: #333333;
      font-size: 16px;
    }
    .grid-content{
      height: 64px;
      line-height: 64px;
    }
    .name{
      padding-left: 25%;
      .nameInner{
        float: left;
      }
    }
    .imgBox{
      width: 44px;
      height: 44px;
      margin-right: 5px;
      -webkit-border-radius: 50%;
      -moz-border-radius: 50%;
      border-radius: 50%;
      overflow: hidden;
      vertical-align: middle;
      border: 1px solid #eee;
      display: inline-block;
      img{
        width: 44px;
        height: 44px;
      }
    }
    .imgBox,.projectName{
      cursor: pointer;
    }
    .imgBox{
      margin-left: 15%;
    }
    .view{
      cursor: pointer;
      color: $optBlue;
      i{
        font-size: 14px;
        margin-right: 4px;
      }
    }
    .limitMain{
      border-bottom: $bd-c;
      font-size: 14px;
    }
    .edit{
      margin-right: 20px;
    }
  }
  .tableTitle{
    overflow: hidden;
    span,.el-select{
      float: left;
    }
    span{
      line-height: 40px;
    }
    .el-select{
      margin-right: 20px;
    }
  }
  .limitTable{
    .demonstration{
      margin-left: 20px;
    }
  }
  .search{
    float: left;
  }
</style>
