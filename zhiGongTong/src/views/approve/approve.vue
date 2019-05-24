<template>
  <div class='container blacklist approve'  v-loading="loading"
       element-loading-text="正在加载">
    <div class="searchOption">
      <span class="demonstration">申请类型:</span>
      <el-select v-model="typeCode" placeholder="所有类型" @change='changeType' class="fl">
        <el-option
          v-for="(item,index) in typeList"
          :key="item.code"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <span class="demonstration">审批结果:</span>
      <el-select v-model="resultCode" placeholder="所有类型" @change='changeType' class="fl">
        <el-option
          v-for="(item,index) in resultList"
          :key="item.code"
          :label="item.value"
          :value="item.code">
        </el-option>
      </el-select>
      <el-autocomplete v-model="nameSearch" :fetch-suggestions="querySearchAsync" placeholder="请输入关键字搜索" @select="handleSelect"  class="fl">
        <el-button slot="append" type="primary" icon="el-icon-search" @click="searchName"></el-button>
      </el-autocomplete>
    </div>
    <div id="approveTable" class="projectTable">
      <el-table :data="approveData" class='tableMain'  :class="{nobb:noBorderBottom}"
                v-loading="tableLoading"
                element-loading-text="正在加载"
      >
        <el-table-column align='center' label="申请时间" min-width="80 " class="limitMain" prop="startTime">
          <template slot-scope="scope">
            <span>{{toDate(scope.row.createTime)}}</span>
          </template>
        </el-table-column>

        <el-table-column align='center' label="申请人" min-width="120" class="limitMain">
          <template slot-scope="scope" >
            <div class="name">
              <span>{{toNull(scope.row.userName)}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column align='center' prop="userMobile" label="联系电话" min-width="130"  class="limitMain"></el-table-column>
        <el-table-column align='center'  label="申请人身份" min-width="100"  class="limitMain">
          <template slot-scope="scope">
            {{toNull(scope.row.workType)}}
          </template>
        </el-table-column>
        <el-table-column align='center' prop="projectName" label="申请项目" min-width="130"  class="limitMain"></el-table-column>
        <el-table-column align='center' prop="dutyTypeName" label="申请类型" min-width="100"  class="limitMain"></el-table-column>
        <el-table-column align='center' prop="dutyDate" label="补卡日期" min-width="90"  class="limitMain"></el-table-column>
        <el-table-column align='center' label="补卡时间" min-width="90"  class="limitMain">
          <template slot-scope="scope">
            <span>{{scope.row.dutyTimes}}</span>
          </template>
        </el-table-column>
        <el-table-column align='center' prop="detail" label="补卡详情" min-width="90"  class="limitMain">
          <template slot-scope="scope">
            {{toNull(scope.row.dutyRemark)}}
          </template>
        </el-table-column>
        <el-table-column align='center' prop="result" label="审批结果" min-width="90"  class="limitMain">
          <template slot-scope="scope">
            <span v-if="scope.row.isAudit==0">待审批</span>
            <span v-else-if="scope.row.isAudit==1">审批通过</span>
            <span v-else>审批不通过</span>
          </template>
        </el-table-column>
        <el-table-column align='center' prop="time2" label="审批时间" min-width="80"  class="limitMain">
          <template slot-scope="scope">
            <span v-if="scope.row.auditTime==null">--</span>
            <span v-else>{{toDate(scope.row.auditTime)}}</span>
          </template>
        </el-table-column>
        <el-table-column align='center' prop="auditRemark" label="备注" min-width="90"  class="limitMain">
          <template slot-scope="scope">
            {{toNull(scope.row.auditRemark)}}
          </template>
        </el-table-column>
        <el-table-column align='center' label="审批操作" min-width="130"  class="limitMain" v-if="companyRole==1">
          <template slot-scope="scope">
            <div v-if="scope.row.isAudit==2||scope.row.isAudit==1">----</div>
            <div v-else>
              <span @click.prevent="noPass(scope.row.id)" class="view edit"><i class="zhiGong">&#xe626;</i>退回</span>
              <span @click.prevent="pass(scope.row.id)" class="view"><i class="zhiGong relieve">&#xe644;</i>同意</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-if="showPagination"
                     @current-change="handleCurrentChange"
                     :current-page.sync="page"
                     :page-size="pageSize"
                     layout="total, prev, pager, next, jumper"
                     :total="approveTotal">
      </el-pagination>
      <el-dialog title="添加备注" :visible.sync="dialogFormVisible" class='dialogForm' :before-close="dialogClose">
        <el-form :model='audit' ref="auditForm" :rules="formRules">
          <el-form-item label="备注" :label-width="formLabelWidth" prop="remark">
            <el-input v-model="audit.remark" type="text" maxLength="20" auto-complete="off" class="fl"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" :loading='loadingSave' @click.prevent="save()">保存</el-button>
        </div>
      </el-dialog>
    </div>

  </div>
</template>

<script>
  import { dutyApi } from "../../api/index";
  import { LocalCache } from "../../lib/utils";
  import moment from "moment"
  export default {
    name: "approve",
    data() {
      var validateRemark =(rule,value,callback)=>{
         if(!value){
           callback(new Error('请输入备注'))
         } else {
           callback()
         }
       }
      return {
        formRules: {
          remark:[{trigger: 'blur', validator: validateRemark }]
        },
        loading:true,
        companyId:"",
        projectList:[],
        proviceVal:'',
        noBorderBottom:false,
        cityVal:'',
        districtVal:'',
        proviceOptions:[],
        cityOptions:[],
        districtOptions:[],
        page:1,
        noResult:'当前公司下暂无项目！',
        noSearchResult:'暂无符合条件的搜索结果！',
        tableLoading:true,
        nameSearch:'',
        loadingSave:false,
        companyRole:'',
        formLabelWidth:"20%",
        projectList:[],
        groupList:[],
        nameList:[],
        noBorderBottom:false,
        showPagination:false,
        pageSize:10,
        page:1,
        editVisible:false,
        blackListId:'',
        groupLoading:true,
        nameLoading:true,
        approveTotal:0,
        approveData:[],
        typeList:[{
          code:null,
          value:'全部'
        },{
          code:3,
          value:'考勤机故障'
        },{
          code:2,
          value:'外出办事'
        },{
          code:1,
          value:'出差'
        },{
          code:4,
          value:'忘记打卡'
        }],
        typeCode:'',
        resultCode:'',
        resultList:[{
          code:null,
          value:'全部'
        },{
          code:0,
          value:'待审批'
        },{
          code:1,
          value:'审批通过'
        },{
          code:2,
          value:'审批不通过'
        }],
        dialogFormVisible:false,
        audit:{
          remark:""
        },
        noPassId:""
      }
    },
    methods: {
      loadingClose(){
        setTimeout(() => {
          this.loading = false;
        }, 500);
      },
      nameLoadingClose(){
        setTimeout(() => {
          this.nameLoading = false;
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
      toZero(val){
        if(!val){
          return 0
        }else{
          return val
        }
      },
      toNull(val){
        if(!val||val==null||val==undefined){
          return '--'
        }else{
          return val
        }
      },
      loadingSaveClose(){
        setTimeout(() => {
          this.loadingSave = false;
        }, 500);
      },
      handleClick(tab, event) {
        console.log(tab, event);
      },
      searchName(){
        this.getTableData(1)
      },
      handleCurrentChange(val){
        this.tableLoading = true
        this.getTableData(val)
      },
      dialogClose(done){
        this.$refs['auditForm'].resetFields();
        done()
      },
      querySearchAsync(queryString, cb) {
        let that = this
        this.noBorderBottom = false
        //auditType, isAudit, userName, companyId, page, pageSize, order, searchDate, searchDateType
        dutyApi.getDutyAuditList(this.typeCode,this.resultCode,this.nameSearch,this.companyId,1,1000,"","","").then((res)=>{
          //console.log("getDutyAuditList",res.data);
          this.nameList = res.data.list
          console.log("queryString",queryString);
          var results = queryString ?  this.nameList.filter(this.createStateFilter(queryString)) :  this.nameList;
          that.approveTotal = res.data.totalItems
          let nameList=new Array();
          if(res.data.totalPages<=1){
            that.showPagination = false
          }else{
            that.showPagination = true
            that.approveTotal = res.data.totalItems
          }
          let o={}
          for(var i=0;i<results.length;i++){
            if(results[i].userName){
              let obj={
                value:results[i].userName
              }
              nameList.push(obj)
            }
          }
          var obj2 = {};
          nameList = nameList.reduce(function(item,next){
            console.log(item, next);
            obj2[next.value] ? '' : obj2[next.value] = true && item.push(next);
            return item;
          },[]);


          console.log('nameList',nameList);
          cb(nameList);

          that.tableLoadingClose()
        }).catch((res)=>{
          that.$message.error(res.msg)
          that.tableLoadingClose()
        })
      },
      createStateFilter(queryString) {
        return (state) => {
          console.log("state",state);
          return (state.userName.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      handleSelect() {
        this.getTableData(1)
      },
      changeType(){
        this.tableLoading = true
        this.getTableData(1)
      },
      changeName(val){
        //console.log("nameVal:"+val,this.nameList);
        this.dialogData.idNumber = ""
        let that = this
        for(var i=0;i<that.nameList.length;i++){
          if(that.nameList[i].id==val){
            //console.log(i,that.nameList[i].id);
            if(that.nameList[i].userDetail){
              that.dialogData.idNumber = that.nameList[i].userDetail.idNumber
              //console.log('userDetail exist',that.nameList[i].userDetail.idNumber,that.dialogData.idNumber);
            }else{
              //console.log('userDetail inexist');
              that.dialogData.idNumber = ""
            }
            return true
          }else{
            this.dialogData.idNumber = ""
          }
        }
      },
      toDate(val){
        return moment(val).format(" YYYY-MM-DD HH:mm")
      },
      getTableData(page){
        let that = this
        this.noBorderBottom = false
        //auditType, isAudit, userName, companyId, page, pageSize, order, searchDate, searchDateType
        dutyApi.getDutyAuditList(this.typeCode,this.resultCode,this.nameSearch,this.companyId,page,this.pageSize,"","","").then((res)=>{
          console.log("getDutyAuditList",res.data);
          that.approveData = res.data.list
          that.tableLoadingClose()
          if(res.data.totalPages<=1){
            that.showPagination = false
          }else{
            that.showPagination = true
            that.approveTotal = res.data.totalItems
          }
        }).catch((res)=>{
          that.$message.error(res.msg)
          that.tableLoadingClose()
        })
      },
      pass(id){
        this.tableLoading = true
        dutyApi.auditDutyAudit(id,1,"").then((res)=>{
          console.log(res);
          this.$message.success(res.msg)
          this.getTableData(1)
        }).catch((res)=>{
          console.log(res);
          this.$message.error(res.msg)
          this.getTableData(1)
        });
      },
      noPass(id){
        this.dialogFormVisible = true
        this.noPassId = id
        this.save(id)
      },
      save(id){
        let that = this
        this.$refs["auditForm"].validate((valid) => {
          if(valid){
            that.tableLoading = true
            dutyApi.auditDutyAudit(that.noPassId,2,that.audit.remark).then((res)=>{
              console.log(res);
              that.noBorderBottom = true
              that.dialogFormVisible = false
              that.$message.success(res.msg)
              that.getTableData(1)
            }).catch((res)=>{
              console.log(res);
              this.$message.error(res.msg)
            });
          }else{
            console.log('error submit!!');
            return false;
          }
        })
      }
    },
    beforeMount(){
      this.loadingClose()
      this.companyId = LocalCache.get('companyInfo').companyId;
      this.companyRole = LocalCache.get('companyInfo').companyRole;
      let arrAll=[{id:null,name:"全部"}]
      dutyApi.getDutyAuditEnum().then((res)=>{
        //console.log(res.data);
        this.typeList = [...arrAll,...res.data]
      })
    },
    mounted(){
      this.getTableData(1)
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import '../../assets/sass/variable';
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
        font-size: 18px;
      }
    }
  }
  .dialog-footer{
    padding-top: 30px;
  }
  .saveButton{
    padding: 10px 40px;
  }
  #approveTable{
    width: 95%;
    margin: 0 auto;
  }
</style>
