<template>
  <div class='container blacklist'  v-loading="loading"
       element-loading-text="正在加载">
    <board :boardStyle="boardStyle" :blackListStat="blackListStat"></board>
    <div class="searchOption">
      <span class="demonstration">黑名单类型:</span>
      <el-select v-model="typeCode" placeholder="所有类型" @change='changeType' class="fl">
        <el-option
          v-for="(item,index) in typeList"
          :key="item.code"
          :label="item.value"
          :value="item.code">
        </el-option>
      </el-select>
      <el-autocomplete v-model="nameSearch" :fetch-suggestions="querySearchAsync" placeholder="请输入关键字搜索" @select="handleSelect"  class="fl">
        <el-button slot="append" type="primary" icon="el-icon-search" @click="searchName"></el-button>
      </el-autocomplete>
      <el-button type="primary"  @click="addBlacklist" class="fr" >添加企业黑名单</el-button><!--dialogFormVisible = true-->
    </div>
    <div id="blacklistTable" class="projectTable">
      <el-table :data="blacklistData" class='tableMain'  :class="{nobb:noBorderBottom}"
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
        <el-table-column align='center' label="操作" min-width="130"  class="limitMain" v-if="companyRole==1">
          <template slot-scope="scope">
            <span @click.prevent="edit(scope.row.id,1)" class="view edit"><i class="zhiGong">&#xe626;</i>编辑</span>
            <span @click.prevent="relieve(scope.row.id,1)" class="view"><i class="zhiGong relieve">&#xe644;</i>解除黑名单</span>
          </template>
        </el-table-column>
        <el-table-column align='center' label="查看" min-width="100"  class="limitMain">
          <template slot-scope="scope">
            <span @click.prevent="viewDetail(scope.row.id)" class="view"><i class='zhiGong'>&#xe67c;</i>点击查看</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-if="showPagination"
                     @current-change="handleCurrentChange"
                     :current-page.sync="page"
                     :page-size="pageSize"
                     layout="total, prev, pager, next, jumper"
                     :total="blacklistTotal">
      </el-pagination>
    </div>
    <el-dialog title="添加黑名单人员" :visible.sync="dialogFormVisible">
      <el-tabs v-model="addWays" type="card" @tab-click="handleClick">
        <el-tab-pane label="项目添加" name="first">
          <el-form :model='dialogData' ref="dialogData" :rules="formRules">
          <el-form-item label="所属项目" :label-width="formLabelWidth" prop="projectId">
            <el-select v-model="dialogData.projectId" placeholder="请选择项目" @change='changeProjectId' class="fl">
              <el-option
                v-for="(item,index) in projectList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属班组" :label-width="formLabelWidth" prop="groupId">
            <el-select v-model="dialogData.groupId" placeholder="请选择班组" @change='changeGroupId' class="fl" :loading="groupLoading">
              <el-option
                v-for="(item,index) in groupList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="人员姓名" :label-width="formLabelWidth" prop="name">
            <el-select v-model="dialogData.name" placeholder="请选择班组人员姓名" @change='changeName' class="fl" :loading="nameLoading">
              <el-option
                v-for="(item,index) in nameList"
                :key="item.id"
                :label="item.name?item.name:item.mobile"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="人员身份证" :label-width="formLabelWidth" prop="idNumber" >
            <el-input v-model="dialogData.idNumber" type="text"  auto-complete="off" placeholder="根据所选人员自动显示"  class="fl"></el-input>
          </el-form-item >
          <el-form-item label="类型" :label-width="formLabelWidth" >
            <el-checkbox-group v-model="dialogData.type"  class="fl"  :min="1">
              <el-checkbox v-for="(item,index) in typeLabelList" :label="typeCodeList[index]" :key="item">{{item}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="说明" prop="remark" :label-width="formLabelWidth" >
            <el-input type="textarea" v-model="dialogData.remark"  class="fl"></el-input>
          </el-form-item>
        </el-form>
        </el-tab-pane>
        <el-tab-pane label="身份证添加" name="second">
          <el-form :model='dialogData2' ref="dialogData2" :rules="formRule2">
          <el-form-item label="人员姓名" :label-width="formLabelWidth" prop="name" >
            <el-input v-model="dialogData2.name" type="text" maxLength="11" auto-complete="off" placeholder="请输入人员姓名"  class="fl"></el-input>
          </el-form-item >
          <el-form-item label="人员身份证" :label-width="formLabelWidth" prop="idNumber" >
            <el-input v-model="dialogData2.idNumber" type="text" maxLength="18" auto-complete="off" placeholder="请输入身份证号码"  class="fl"></el-input>
          </el-form-item >
          <el-form-item label="手机号码" :label-width="formLabelWidth" prop="mobile" >
            <el-input v-model="dialogData2.mobile" type="tel" maxLength="11" auto-complete="off" placeholder="请输入手机号码"  class="fl"></el-input>
          </el-form-item >
          <el-form-item label="类型" :label-width="formLabelWidth" >
            <el-checkbox-group v-model="dialogData2.type"  class="fl"  :min="1">
              <el-checkbox v-for="(item,index) in typeLabelList" :label="typeCodeList[index]" :key="item">{{item}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="说明" prop="remark" :label-width="formLabelWidth" >
            <el-input type="textarea" v-model="dialogData2.remark"  class="fl"></el-input>
          </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer ">
        <el-button type="primary" :loading='loadingSave' @click.prevent="save('only')" class="saveButton">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑黑名单人员" :visible.sync="editVisible">
      <el-form :model='editData' ref="editData" :rules="editRules">
            <el-form-item label="人员姓名" :label-width="formLabelWidth" prop="name" >
              <el-input v-model="editData.name" type="text" maxLength="11" auto-complete="off" placeholder="请输入人员姓名"  class="fl" :disabled="true"></el-input>
            </el-form-item >
            <el-form-item label="人员身份证" :label-width="formLabelWidth" prop="name" >
              <el-input v-model="editData.idNumber" type="text" maxLength="11" auto-complete="off" placeholder="请输入身份证号码"  class="fl" :disabled="true"></el-input>
            </el-form-item >
            <el-form-item label="手机号码" :label-width="formLabelWidth" prop="name" >
              <el-input v-model="editData.mobile" type="tel" maxLength="11" auto-complete="off" placeholder="请输入手机号码"  class="fl"></el-input>
            </el-form-item >
            <el-form-item label="类型" :label-width="formLabelWidth" >
              <el-checkbox-group v-model="editData.type"  class="fl"  :min="1">
                <el-checkbox v-for="(item,index) in typeLabelList" :label="typeCodeList[index]" :key="item">{{item}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="说明" prop="desc" :label-width="formLabelWidth" >
              <el-input type="textarea" v-model="editData.remark"  class="fl"></el-input>
            </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer ">
        <el-button type="primary" :loading='loadingSave' @click.prevent="saveEdit()" class="saveButton">保存</el-button>
      </div>
    </el-dialog>
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
  import { projectApi,blackListApi } from "../../api";
  import { LocalCache } from "../../lib/utils";
  import board from "@/components/blacklist/board"
  import moment from "moment"
  const typeList = [
    {value: '所有类型', code: ''},{value: '恶意讨薪', code: '1'},{value: '打架闹事', code: '2'},{value: '盗窃', code: '3'},{value: '破坏损坏', code: '4'},{value: '在逃人员', code: '5'},{value: '其他', code: '6'}
      ]
  const typeCodeList=["1","2","3","4","5","6"],typeLabelList=["恶意讨薪","打架闹事","盗窃","破坏损坏","在逃人员","其他"];
  export default {
    name: "infoEntry",
    components:{
      board
    },
    data() {
      var  validateMobile=(rule,value,callback)=>{
        const reg= /^1(3[0-9]|4[457]|5[0-35-9]|6[0-9]|7[0135678]|8[0-9]|9[0-9])\d{8}$/;
        if(!value){
          callback(new Error('请输入手机号'))
        } else if (value.toString().length != 11) {
          callback(new Error('电话号码必须是11位'));
        } else if(!reg.test(value)){
          callback(new Error('请输入正确格式的手机号'))
        }else{
          callback()
        }
      }
      var validateIdNumber =(rule,value,callback)=>{
        var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
        if(!value){
          callback(new Error('请输入身份证号'))
        } else if(!reg.test(value)){
          callback(new Error('请输入正确的身份证格式'))
        } else {
          callback()
        }
      }
      var  validateProjectId=(rule,value,callback)=>{
        if(!this.dialogData.projectId){
          callback(new Error('请选择项目名称！'))
        } else {
          callback()
        }
      }
      var  validateGroupId=(rule,value,callback)=>{
        if(!this.dialogData.projectId){
          callback(new Error('请选择班组名称！'))
        } else {
          callback()
        }
      }
      var  validateName=(rule,value,callback)=>{
        if(!this.dialogData.name){
          callback(new Error('请选择人员名称！'))
        } else {
          callback()
        }
      }
      var  validateName2=(rule,value,callback)=>{
        if(!this.dialogData2.name){
          callback(new Error('请输入人员名称！'))
        } else {
          callback()
        }
      }
      var  validateType = (rule,value,callback)=>{
        if(!this.dialogData.type){
          callback(new Error('请选择黑名单类型！'))
        } else {
          callback()
        }
      }
      var  validateType2 = (rule,value,callback)=>{
        if(!this.dialogData2.type){
          callback(new Error('请选择黑名单类型！'))
        } else {
          callback()
        }
      }
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
        blacklistTotal:'',
        page:1,
        noResult:'当前公司下暂无项目！',
        noSearchResult:'暂无符合条件的搜索结果！',
        tableLoading:true,
        showPagination:false,
        nameSearch:'',
        boardStyle:'corporation',
        typeCode:'',
        blackListStat:{
          companyBA:0,
          warnBA:0,
          processBA:0,
          publicBA:0
        },
        typeList:typeList,
        typeLabelList:typeLabelList,
        typeCodeList:typeCodeList,
        dialogFormVisible:false,
        dialogData:{
          type:[],
          idNumber:''
        },
        dialogData2:{
          type:[],
          idNumber:''
        },
        addWays:'first',
        loadingSave:false,
        companyRole:'',
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
        showPagination:true,
        pageSize:10,
        blacklistTotal:0,
        page:1,
        editVisible:false,
        blackListId:'',
        viewLoading:false,
        editData:{
          type:[]
        },
        formRules: {
          projectId: [{trigger: 'change', validator: validateProjectId }],
          groupId: [{trigger: 'change', validator: validateGroupId }],
          name: [{trigger: 'change', validator: validateName }],
          type: [{trigger: 'change', validator: validateType }],
        },
        formRule2:{
          name: [{trigger: 'blur', validator: validateName2 }],
          idNumber: [{trigger: 'blur', validator: validateIdNumber }],
          mobile: [{trigger: 'blur', validator: validateMobile }],
          type: [{trigger: 'change', validator: validateType }],
        },
        editRules:{
          mobile: [{trigger: 'blur', validator: validateMobile }],
        },
        groupLoading:true,
        nameLoading:true
      }
    },
    methods: {
      loadingClose(){
        setTimeout(() => {
          this.loading = false;
        }, 500);
      },
      groupLoadingClose(){
        setTimeout(() => {
          this.groupLoading = false;
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
        if(!val){
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
      saveEdit(){
        let that = this

        this.$refs.editData.validate((valid) => {
          if(valid){
            that.loadingSave = true;
            console.log(this.blacklistId);
            blackListApi.editBlackListMember(
              this.companyId,
              this.blacklistId,
              this.editData.userId,
              this.editData.mobile,
              this.editData.type.join(','),
              this.editData.remark
            ).then((result)=>{
              that.$message({
                type: 'success',
                message: '添加黑名单成功!',
                duration:1000,
                onClose:function (res) {
                  that.editVisible = false
                  that.getTableData(that.page,that.pageSize,that.nameSearch,that.typeCode,that.companyId)
                  that.loadingSaveClose()
                  that.dialogClose();
                }
              });
            }).catch((res)=>{
              that.$message({
                type: 'error',
                message: res.msg,
                duration:3000,
              });
              that.loadingSaveClose()
            })
          }

        })
      },
      //解除黑名单
      relieve(id){
        let that = this;
        this.$confirm('是否确定解除该黑名单人员？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.noBorderBottom = false;
          blackListApi.removeBlackList(id).then((result)=>{
            that.tableLoading = true
            console.log(result);
            that.getStat()
            that.getTableData(that.page,that.pageSize,that.nameSearch,that.typeCode,that.companyId)
          }).catch((res)=>{
            that.$message({
              type: 'error',
              message: res.msg
            });
          })
        }).catch(() => {
          that.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      //编辑黑名单信息
      edit(id){
        this.editVisible = true ;

        this.editData= {
          type:[]
        }
        this.blacklistId = "";
        let checkedType = [], that = this,_reg = /^[0-9]+.?[0-9]*$/;
        blackListApi.personDetail(id).then((result)=>{
          console.log('personDetail',result.data,result.data.type)
          that.editData = result.data;
          if(that.editData.name==null){
            that.editData.name = result.data.mobile
          };
          that.blacklistId = result.data.id
          for(var i=0;i<result.data.type.length;i++){
            console.log(_reg.test(result.data.type[i]))
            if(_reg.test(result.data.type[i])){
              console.log(result.data.type[i]);
              checkedType.push(typeCodeList[result.data.type[i]-1])
            }
          }
          console.log(checkedType);
          that.editData.type = checkedType
          that.editData.date = that.toDate(result.data.createTime)
        })
      },
      //查看详情
      viewDetail(id){
        this.dialogViewVisible = true ;
        this.dialogView= {}
        this.viewLoading = true
        blackListApi.personDetail(id).then((result)=>{
          console.log('personDetail',result.data);
          this.dialogView = result.data;
          this.dialogView.date = this.toDate(result.data.createTime)
          this.viewLoadingClose()
        })
      },
      handleClick(tab, event) {
        console.log(tab, event);
      },
      searchName(){
        this.getTableData(this.page,this.pageSize,this.nameSearch,this.typeCode,this.companyId)
      },
      handleCurrentChange(val){
        this.getTableData(val,this.pageSize,this.nameSearch,this.typeCode,this.companyId)
      },
      querySearchAsync(queryString, cb) {
        let that = this
        blackListApi.blackList(1, 10000, this.nameSearch, this.typeCode, this.companyId).then((result)=>{
          console.log('blackList',result,result.pagination.totalPages);
          this.nameList = result.data
          var results = queryString ?  this.nameList.filter(this.createStateFilter(queryString)) :  this.nameList;
          this.totalNum = result.pagination.totalItems;
          if(result.pagination.totalPages>1){
            that.showPagination = true
          }else{
            that.showPagination = false
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
        }).catch((result)=>{
          console.log(result);
        })
      },
      createStateFilter(queryString) {
        return (state) => {
          return (state.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      handleSelect() {
        this.getTableData(this.page,this.pageSize,this.nameSearch,this.typeCode,this.companyId)
      },
      changeType(val){
        this.getTableData(this.page,this.pageSize,this.nameSearch,val,this.companyId)
      },
      getProjectList(){
        projectApi.allProjectList().then((result)=>{
          this.projectList = result.data
        }).catch((res)=>{
          this.$message({
            type: 'error',
            message: res.msg,
            duration:3000,
          });
        })
      },
      changeProjectId(val){
        console.log(val);
        this.groupLoading = true
        if(this.dialogData.groupId){
          this.dialogData.groupId = " "
        }
        if(this.dialogData.name){
          this.dialogData.name = " "
        }
        if(this.dialogData.idNumber){
          this.dialogData.idNumber = " "
        }
        console.log(this.dialogData.groupId);
        projectApi.projGroupsList(val).then((result)=> {
          this.groupList = result.data
          this.groupLoadingClose()
        }).catch((res)=>{
          this.$message({
            type: 'error',
            message: res.msg,
            duration:3000,
          });
        })
      },
      changeGroupId(val){
        //console.log(this.projectId);
        this.nameLoading = true
        if(this.dialogData.name){
          this.dialogData.name = " "
        }
        if(this.dialogData.idNumber){
          this.dialogData.idNumber = " "
        }
        projectApi.lookProjGroupMenber(1,1000,this.dialogData.projectId,val).then((result)=> {
          this.nameList = result.data
          this.nameLoadingClose()
        }).catch((res)=>{
          this.$message({
            type: 'error',
            message: res.msg,
            duration:3000,
          });
        })
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
      getData(page,pageSize,name,provinceId,cityId,districtId,withDetail){

      },
      toDate(val){
        return moment(val).format("YYYY-MM-DD")
      },
      getStat(){
        blackListApi.blackListStat(this.companyId).then((result)=>{
          console.log('企业管理员黑名单统计',result);
          this.blackListStat = result.data;
          this.hasDate = result.data.publicNum;
          this.loading = false
        })
      },
      getTableData(page, pageSize, name, type, companyId){
        this.tableLoading = true;
        this.noBorderBottom = false
        let that = this
        blackListApi.blackList(page, pageSize, name, type, companyId).then((result)=>{
          console.log('blackList',result);
          this.blacklistData = result.data;

          this.blacklistTotal = result.pagination.totalItems
          if(result.pagination.totalPages>1){
            that.showPagination = true
          }else{
            that.showPagination = false
          }
          this.tableLoadingClose()
        }).catch((result)=>{
          console.log(result);
        })
      },
      addBlacklist(){
        this.dialogFormVisible = true;
        this.loadingSave = false;
      },
      dialogClose(){
        this.$refs.dialogData.resetFields();
        this.$refs.dialogData2.resetFields();
        this.dialogData.type = [];
      },
      save(type){
        let that = this
        console.log(this.addWays);
        if(this.addWays=="first"){
          this.$refs.dialogData.validate((valid) => {
            that.loadingSave = true;
            if (valid) {
              if(this.dialogData.type.length>0) {
                blackListApi.addBlackListMember(
                  1,
                  this.dialogData.type.join(','),
                  this.dialogData.name,
                  this.dialogData.groupId,
                  this.dialogData.projectId,
                  this.companyId,
                  this.dialogData.idNumber,
                  this.dialogData.remark
                ).then((result)=>{
                  console.log(result);
                  that.$message({
                    type: 'success',
                    message: '添加黑名单成功!',
                    duration:1000,
                    onClose:function (res) {
                      that.dialogFormVisible = false
                      that.loading = true
                      that.getStat()
                      that.getTableData(that.page,that.pageSize,that.nameSearch,that.typeCode,that.companyId)
                      that.dialogClose()
                      that.dialogData.type = [];
                      that.loadingSaveClose()
                    }
                  });
                }).catch((res)=>{
                  that.$message({
                    type: 'error',
                    message: res.msg,
                    duration:3000,
                  });
                  that.loadingSaveClose()
                })
              }else{
                that.$message({
                  type: 'error',
                  message: "请选择黑名单类型！",
                  duration:3000,
                });
                that.loadingSaveClose()
              }
            }else{
              return false
            }

          })
        }else if(this.addWays=="second"){
          this.$refs.dialogData2.validate((valid) => {
            that.loadingSave = true;
            if (valid) {
              console.log(this.dialogData2.type);
              if(this.dialogData2.type.length>0){
                blackListApi.otherAddBlackListMember(
                  this.companyId,
                  this.dialogData2.name,
                  this.dialogData2.idNumber,
                  this.dialogData2.type.join(','),
                  this.dialogData2.remark,
                  this.dialogData2.mobile
                ).then((result)=>{
                  console.log(result);
                  that.$message({
                    type: 'success',
                    message: '添加黑名单成功!',
                    duration:1000,
                    onClose:function (res) {
                      that.dialogFormVisible = false
                      that.loading = true
                      that.getStat()
                      that.getTableData(that.page,that.pageSize,that.nameSearch,that.typeCode,that.companyId)
                      that.dialogClose()
                      that.dialogData.type = [];
                      that.loadingSaveClose()
                    }
                  });
                }).catch((res)=>{
                  that.$message({
                    type: 'error',
                    message: res.msg,
                    duration:3000,
                  });
                  that.loadingSaveClose()
                })
              }else{
                that.$message({
                  type: 'error',
                  message: "请选择黑名单类型！",
                  duration:3000,
                });
                that.loadingSaveClose()
              }

            }else{
              return false
            }
          })
        }
      },
    },
    beforeMount(){
      this.loadingClose()
      this.companyId = LocalCache.get('companyInfo').companyId;
      this.companyRole = LocalCache.get('companyInfo').companyRole;
      this.getProjectList()
    },
    mounted(){
      this.getStat()
      this.getTableData(this.page,this.pageSize,this.nameSearch,this.typeCode,this.companyId)
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

</style>
