<template>
  <div class='container blacklist'  v-loading="loading"
       element-loading-text="正在加载">
    <board :boardStyle="boardStyle" :blackListStat="blackListStat"></board>
    <div id="blacklistTable" class="projectTable" >
      <div v-for="item in  blacklistData">
        <div class="projectTitle">
          {{item.name}}
        </div>
        <el-table :data="item.blacklist" class='tableMain'  :class="{nobb:noBorderBottom}"
                  v-loading="tableLoading"
                  element-loading-text="正在加载"
        >
          <el-table-column align='center' label="姓名" min-width="120" class="limitMain">
            <template slot-scope="scope" >
              <div class="name">
                <span v-if="scope.row.name">{{scope.row.name}}</span>
                <span v-else-if="scope.row.nickname">{{scope.row.nickname}}</span>
                <span v-else>{{scope.row.mobile}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column align='center' label="身份证号" min-width="120" class="limitMain">
            <template slot-scope="scope" >
              <div class="name">
                <span class="nameInner" >{{toNull(scope.row.idNumber)}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column align='center' prop="mobile" label="联系电话" min-width="130"  class="limitMain"></el-table-column>
          <el-table-column align='center' prop="typeName" label="类型" min-width="130"  class="limitMain"></el-table-column>
          <el-table-column align='center' label="查看" min-width="100" class="limitMain">
            <template slot-scope="scope">
              <span @click.prevent="viewDetail(scope.row.id)" class="view"><i class='zhiGong'>&#xe67c;</i>点击查看</span>
            </template>
          </el-table-column>
        </el-table>
      </div>

    </div>

    <el-dialog :data='dialogView' :title="dialogViewTitle" :visible.sync="dialogViewVisible">
      <div class="adminDetail" v-loading="viewLoading" element-loading-text="正在加载">
        <div class="imgBox fr"><img :src="dialogView.avatar" alt=""></div>
        <div class="item itemShort">
          <div class="fl labelName">姓名：</div>
          <div class="fl labelMain labelShort">{{toNull(dialogView.name)}}</div>
        </div>
        <div class="item itemShort">
          <div class="fl labelName">联系方式：</div>
          <div class="fl labelMain labelShort">{{toNull(dialogView.mobile)}}</div>
        </div>
        <div class="item itemShort">
          <div class="fl labelName">身份证号：</div>
          <div class="fl labelMain labelShort">{{toNull(dialogView.idNumber)}}</div>
        </div>
        <div class="item itemShort">
          <div class="fl labelName">类型：</div>
          <div class="fl labelMain labelShort">{{toNull(dialogView.typeName)}}</div>
        </div>
        <div class="item itemShort">
          <div class="fl labelName">添加日期：</div>
          <div class="fl labelMain labelShort">{{toNull(dialogView.date)}}</div>
        </div>
        <div class="item itemShort">
          <div class="fl labelName">来源企业：</div>
          <div class="fl labelMain labelShort">{{toNull(dialogView.companyName)}}</div>
        </div>
        <div class="item itemShort">
          <div class="fl labelName">来源项目：</div>
          <div class="fl labelMain ">{{toNull(dialogView.projectName)}}</div>
        </div>
        <div class="item itemShort">
          <div class="fl labelName">来源班组：</div>
          <div class="fl labelMain ">{{toNull(dialogView.workGroupName)}}</div>
        </div>
        <div class="item itemShort">
          <div class="fl labelName">添加人员：</div>
          <div class="fl labelMain ">{{toNull(dialogView.adUserName)}}</div>
        </div>
        <div class="item itemShort">
          <div class="fl labelName">说明：</div>
          <div class="fl labelMain" v-for="item in dialogView.blacklistRemark">{{toNull(item.remark)}}</div>
        </div>


      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { userApi,blackListApi } from "../../api";
  import { LocalCache } from "../../lib/utils";
  import board from "@/components/blacklist/board"
  import moment from "moment"
  export default {
    name: "infoEntry",
    components:{
      board
    },
    data() {
      return {
        loading:true,
        companyId:"",
        projectList:[],
        blacklistSum:{},
        proviceVal:'',
        noBorderBottom:false,
        cityVal:'',
        districtVal:'',
        proviceOptions:[],
        cityOptions:[],
        districtOptions:[],
        totalNum:1,
        currentPage:1,
        noResult:'当前公司下暂无项目！',
        noSearchResult:'暂无符合条件的搜索结果！',
        tableLoading:true,
        showPagination:false,
        nameSearch:'',
        boardStyle:'processed',
        typeList: [
          {value: '恶意讨薪', code: '1'},{value: '打架闹事', code: '2'},{value: '盗窃', code: '3'},{value: '破坏损坏', code: '4'},{value: '在逃人员', code: '5'},{value: '其他', code: '6'}
        ],
        typeCode:'',
        blackListStat:{
          companyBA:0,
          warnBA:0,
          processBA:0,
          publicBA:0
        },
        dialogFormVisible:false,
        dialogData:{

        },
        addWays:'first',
        loadingSave:false,
        formRules:{

        },
        formLabelWidth:"20%",
        projectList:[],
        groupList:[],
        nameList:[],
        blacklistData:[],
        noBorderBottom:false,
        dialogViewTitle:'黑名单人员详情',
        dialogView:{

        },
        dialogViewVisible:false,
        companyRole:'',
        viewLoading:false,
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
      viewLoadingClose(){
        setTimeout(() => {
          this.viewLoading = false;
        }, 500);
      },
      toNull(val){
        if(!val){
          return '--'
        }else{
          return val
        }
      },
      //查看详情
      viewDetail(id){
        this.dialogViewVisible = true ;
        this.dialogView = {} ;
        blackListApi.personDetail(id).then((result)=>{
          console.log('personDetail',result.data);
          this.dialogView = result.data;
          this.dialogView.date= this.toDate(result.data.createTime)
          this.viewLoadingClose()
        })
      },

      toDate(val){
        return moment(val).format("YYYY-MM-DD")
      },
      getStat(){
        blackListApi.blackListStat(this.companyId).then((result)=>{
          console.log('企业管理员黑名单统计',result);
          this.blackListStat = result.data;
          this.hasDate = result.data.publicNum;
        })
      },
      getTableData(companyId){
        this.tableLoading = true;
        this.noBorderBottom = false
        this.viewLoading = true
        blackListApi.alarmAddNoDealWith(companyId, 0).then((result)=>{
          console.log('黑名单警报',result);
          this.blacklistData = result.data;
          this.tableLoadingClose()
        }).catch((res)=>{

        })
      },
      addBlacklist(){

      },
    },
    beforeMount(){
      this.loadingClose()
      this.companyId = LocalCache.get('companyInfo').companyId;
      this.companyRole = LocalCache.get('companyInfo').companyRole;

    },
    mounted(){
      this.getStat()
      this.getTableData(this.companyId)
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import '../../assets/sass/variable';
  .projectTitle{
    font-size: 16px;
    text-align: left;
    line-height: 2;
    margin-top: 28px;
    font-weight: bold;
    color: #666666;

  }
  .view{
    cursor: pointer;
    color: $optBlue;
    &.edit{
      margin-right: 12px;
    }
    i{
      font-size: 14px;
      margin-right: 4px;
      &.relieve{
        font-size: 18px !important;
      }
    }
  }

</style>
