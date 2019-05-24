<template>
    <div class='attendView container limitSetting'>
      <common-tit :title='title' :type='true'></common-tit>
      <div class="attendTitle">项目适用人员</div>
      <el-table :data="tableData" class='attendTable projTable'
                v-loading="loading"
                element-loading-text="正在加载"
                :class="{nobb:noBorderBottom}"
      >
        <el-table-column align='center' label="班组" min-width="120" class="limitMain adminName"  prop="work_group_name">
        </el-table-column>
        <el-table-column align='center'  label="姓名" min-width="120"  class="limitMain" >
          <template slot-scope="scope">
            {{toNull(scope.row.user_name)}}
          </template>
        </el-table-column>
        <el-table-column align='center' label="工种" min-width="130"  class="limitMain" >
          <template slot-scope="scope">
            {{toNull(scope.row.work_type_name)}}
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
              title:'查看项目适用人员',
              tableData:[],
              scale:"--",
              trade:'--',
              loading:true,
              companyRole:'',
              noBorderBottom:false,
            }
        },
        methods: {
          toNull(val){
            console.log(val);
            if(val==''||val==null){
              return '--'
            }else{
              return val
            }
          },
          loadingClose(){
            setTimeout(() => {
              this.noBorderBottom =true
              this.loading = false;
            }, 500);
          },
          getData(){
            dutyApi.getProjectWorkGroupList(this.companyId,this.projectId,"","","",this.dutyRuleId,true).then((res)=>{
              console.log('getProjectWorkGroupList',res.data);
              this.tableData = res.data
              this.loadingClose()
            }).catch((res)=>{
              console.log('error',res);
              this.loadingClose()
            })
          }
        },
      beforeMount(){
        this.companyRole = LocalCache.get('companyInfo').companyRole
        this.companyId   = LocalCache.get('companyInfo').companyId
        this.dutyRuleId  = this.$route.params.dutyRuleId
        this.projectId   = this.$route.params.projectId
      },
      mounted(){
          this.getData()
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
  }
</style>
