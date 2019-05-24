<template>
    <div class='attendView container limitSetting'

    >
      <common-tit :title='title' :type='true'></common-tit>
      <div class="attendTitle">适用部门</div>
      <el-table :data="departmentData" class='attendTable projTable '
                v-loading="departmentLoading"
                element-loading-text="正在加载"
                :class="{nobb:noBorderBottom}"
      >
        <el-table-column align='center' label="所属部门" min-width="120" class="limitMain adminName" >
          <template slot-scope="scope">
            <span>{{toNull(scope.row.department_name)}}</span>
          </template>
        </el-table-column>
        <el-table-column align='center'  label="职务" min-width="120"  class="limitMain" >
          <template slot-scope="scope">
            <span>{{toNull(scope.row.positions_name)}}</span>
          </template>
        </el-table-column>
        <el-table-column align='center' label="人员" min-width="130"  class="limitMain">
          <template slot-scope="scope">
            <span>{{scope.row.name?scope.row.nickname:scope.row.mobile}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="attendTitle">适用项目</div>
      <el-table :data="projectData" class='attendTable projTable '
                v-loading="projectLoading"
                element-loading-text="正在加载"
                :class="{nobb:noBorderBottom}"
      >
        <el-table-column align='center' label="项目" min-width="120" class="limitMain adminName"  prop="project_name">
        </el-table-column>
        <el-table-column align='center' label="适用人数" min-width="120"  class="limitMain"  prop="usedNumbers">
        </el-table-column>
        <el-table-column align='center' label="查看项目适用人员" min-width="130"  class="limitMain">
          <template slot-scope="scope">
            <span @click="view(scope.row.project_id)" class="view"><i class='zhiGong'>&#xe67c;</i>点击查看</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
</template>

<script>
  import commonTit from '@/components/common/commonTit'
  import { dutyApi } from "../../api";
  import { LocalCache } from "../../lib/utils";
  export default {
        name: "",
      components:{
        commonTit
      },
        data() {
            return {
              title:'查看适用范围',
              departmentData:[],
              projectData:[],
              scale:"--",
              trade:'--',
              tableLoading:true,
              companyRole:'',
              departmentLoading:true,
              projectLoading:true,
              noBorderBottom:false,
            }
        },
        methods: {
          departmentLoadingClose(){
            setTimeout(() => {
              this.noBorderBottom =true
              this.departmentLoading = false;
            }, 500);
          },
          projectLoadingClose(){
            setTimeout(() => {
              this.noBorderBottom =true
              this.projectLoading = false;
            }, 500);
          },
          toNull(val){
            if(val==''||val==null||val==undefined){
              return '--'
            }else{
              return val
            }
          },
          view(projectId) {
            this.$router.push({path:'/attend/viewDetail/'+this.dutyRuleId+"/"+projectId})
          },
          getDepartmentData(){
            dutyApi.getDutyRuleByRuleIdAndDepartment(this.dutyRuleId,this.companyId).then((res)=>{
              console.log("getDutyRuleByRuleIdAndDepartment",res.data);
              this.departmentData = res.data[0].list;
              this.departmentLoadingClose()
            }).catch((res)=>{
              console.log('error',res);
              this.departmentLoadingClose()
            })
          },
          getProjectData(){
            dutyApi.getProjectCountList(this.companyId,"","","","",this.dutyRuleId).then((res)=>{
              console.log('getProjectWorkGroupList',res.data);
              this.projectData = res.data
              this.projectLoadingClose()
            }).catch((res)=>{
              console.log('error',res);
              this.projectLoadingClose()
            })
          }
        },
      beforeMount(){
        this.companyRole = LocalCache.get("companyInfo").companyRole
        this.companyId   = LocalCache.get("companyInfo").companyId
        this.dutyRuleId  = this.$route.params.dutyRuleId
        this.getDepartmentData()
        this.getProjectData()
      },
      mounted(){
      }
    }
</script>

<style lang="scss" type="text/scss">
  @import "../../assets/sass/variable";
  .commonTit{
    border-bottom: $bd-c;
  }
  .attend{
    width: 95%;
    margin: 0 auto;
  }
  .attendTitle{
    font-size: 16px;
    line-height: 40px;
    margin-top: 20px;
    text-align: left;
  }
  .attendView{
    .attendTitle,.attendTable{
      width: 95%;
      margin-left: auto;
      margin-right: auto;
    }
  }
  .view{
    cursor: pointer;
    color: $optBlue;
    i{
      vertical-align: middle;
      margin-right: 8px;
    }
  }
</style>
