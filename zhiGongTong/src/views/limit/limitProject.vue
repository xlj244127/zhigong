<template>
  <div class='container limitProject'  v-loading="loading"
       element-loading-text="正在加载">
    <common-tit :title="title" :type='true'></common-tit>
    <div class="adminMain">
      <div class="fl manageList">
        <div class="manageTitle">
          {{departmentName}}   <span class="fr" @click="editML" v-if="editMLType == false">编辑</span><span class="fr" @click="editComplete" v-else>退出</span>
        </div>
        <el-menu
          :default-active="activeIndex"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          background-color="#F5FAFE"
          active-background-color="#DDE6F0"
          text-color="#3E74CA"
          active-text-color="#3E74CA"
          :unique-opened="uniqueOpen"
          :collapse-transition="false"
        >
            <el-menu-item index="0" :key='0' @click="changePosition(null)">
              <template slot="title">
                <span>全部</span>
              </template>
            </el-menu-item>
            <el-menu-item :index='item.positionsName' v-for='(item,index) in menuList' :key='item.id' class="editBox">
              <template slot="title">
                <span class="db" @click="changePosition(item.id)" >{{item.positionsName}}</span>
                <span v-if="editMLType == true" class="editML editChange" @click="editChange(item.id,item.positionsName)">编辑</span>
                <span v-if="editMLType == true" class="editML editDelete" @click="editDelete(item.id)">删除</span>
              </template>
            </el-menu-item>
        </el-menu>

        <div class="manageAdd">
          <el-button type="primary"  @click="add('position')" >添加职务</el-button>
        </div>
      </div>
      <div class="adminTablePart">
        <div class="searchOption">
          <div class="defaultStatus" v-if="bulkStatus==false">
            <el-autocomplete v-model="nameSearch" :fetch-suggestions="querySearchAsync" placeholder="请输入关键字搜索" @select="handleSelect"  class="fl">
              <el-button slot="append" type="primary" icon="el-icon-search" @click="searchName"></el-button>
            </el-autocomplete>
            <span class="demonstration fl">请选择项目:</span>
            <el-select v-model="projectId" placeholder="请选择项目" @change='changeProject' class="fl projectSelect">
              <el-option
                v-for="(item,index) in projectList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <el-button type="primary"  @click="add('admin')" class="fr" >添加项目管理员</el-button><!--dialogFormVisible = true-->
            <div class="fr bulkManage" @click="bulkManage">批量管理</div>
          </div>
          <div class="bulkStatus" v-else>
            <el-button type="primary"  @click="backToDefault" class="fl" >返回</el-button>
            <el-button type="primary"  @click="blukChangeJob" class="fl" >批量修改职务</el-button>
          </div>
        </div>
        <div id="limitAdminList" class="projectTable">
          <el-table :data="tableData" class='tableMain'  :class="{nobb:noBorderBottom,showSelection:bulkStatus}"
                    v-loading="tableLoading"
                    element-loading-text="正在加载"
                    @selection-change="handleSelectionChange"
          >
            <el-table-column
              type="selection"
              width="30">
            </el-table-column>
            <el-table-column align='center' label="姓名" min-width="120" class="limitMain">
              <template slot-scope="scope" >
                <div class="imgBox"><img :src="scope.row.avatar" alt=""></div>
                <span @click="viewDetail(scope.row)" class="projectName" v-if="scope.row.name">{{scope.row.name}}</span>
                <span @click="viewDetail(scope.row)" class="projectName" v-else-if="scope.row.nickname">{{scope.row.nickname}}</span>
                <span @click="viewDetail(scope.row)" class="projectName" v-else>{{scope.row.mobile}}</span>
              </template>
            </el-table-column>
            <el-table-column align='center' label="性别" min-width="40" class="limitMain">
              <template slot-scope="scope">
                <span v-if="scope.row.gender==1">男</span>
                <span v-else-if = "scope.row.gender == 2">女</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column align='center' prop="mobile" label="联系电话" min-width="100"  class="limitMain"></el-table-column>
            <el-table-column align='center' label="职务" min-width="100"  class="limitMain">
              <template slot-scope="scope">
                <div v-if="scope.row.userRights">
                  {{toNull(scope.row.userRights.positions_name)}}
                </div>
                <div v-else>--</div>
              </template>
            </el-table-column>
            <el-table-column align='center' label="权限" min-width="130"  class="limitMain">
              <template slot-scope="scope">
                <div v-if="scope.row.userRights">
                  {{toNull(scope.row.userRights.permissions_name)}}
                </div>
                <div v-else>--</div>
              </template>
            </el-table-column>
            <el-table-column align='center' label="查看" min-width="100"  class="limitMain">
              <template slot-scope="scope">
                <span @click.prevent="viewDetail(scope.row)" class="view"><i class='zhiGong'>&#xe67c;</i>点击查看</span>
              </template>
            </el-table-column>
            <el-table-column align='center' label="操作" min-width="130"  class="limitMain" v-if="companyRole==1&&bulkStatus==false">
              <template slot-scope="scope">
                <span @click.prevent="edit(scope.row)" class="view edit"><i class="zhiGong">&#xe626;</i>编辑</span>
                <span @click.prevent="delManager(scope.row.id)" class="view"><i class="zhiGong relieve" v-if="companyRole==1">&#xe644;</i>删除</span>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination v-if="showPagination"
                         @current-change="handleCurrentChange"
                         :current-page.sync="page"
                         :page-size="pageSize"
                         layout="total, prev, pager, next, jumper"
                         :total="total">
          </el-pagination>
        </div>
      </div>

    </div>
    <el-dialog :title="viewTitle" :visible.sync="dialogViewVisible" id="viewAndEdit">
      <el-form :model='editForm' ref="editForm" :rules="editRules" class="adminDetail">
        <div class="imgBox"><img :src="editForm.avatar" alt=""></div>
        <div class='male'>
          <span v-if="editForm.gender==1"><img :src="male" alt=""></span>
          <span v-else-if = "editForm.gender == 2"><img :src="female" alt=""></span>
          <span v-else @click.prevent="toCert()"><img :src="nocert" alt=""></span>
        </div>
        <div class="item">
          <div class="fl labelName">姓名：</div>
          <div class="fr labelMain">{{toNull(editForm.name)}}</div>

        </div>
        <div class="item" >
          <div class="fl labelName">联系电话：</div>
          <div class="fr labelMain">{{toNull(editForm.mobile)}}</div>
        </div>
        <el-form-item class="item mb0">
          <div class="fl labelName">职务：</div>
          <div class="fr labelMain" v-if="editType==0">
            <span v-if="editForm.userRights">
              {{toNull(editForm.userRights.positions_name)}}
            </span>
            <span v-else>--</span>
          </div>
          <div class="fr labelMain" v-else-if="editType==1">
            <el-select v-model="editForm.job" placeholder="所有部门" @change='changeDepartment'>
              <el-option
                v-for="(item,index) in positionList"
                :key="item.id"
                :label="item.positionsName"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
        </el-form-item>
        <div class="item">
          <div class="fl labelName">身份证号码：</div>
          <div class="fr labelMain">
            <span v-if="editForm.userDetail">
              {{toNull(editForm.userDetail.idNumber)}}
            </span>
            <span v-else>--</span>
          </div>
        </div>
        <div class="item"  v-if="editType==0">
          <div class="fl labelName">项目：</div><!--project_name-->
          <div class="fr labelMain">
            <span v-if="editForm.userRights">
              {{toNull(editForm.userRights.project_name)}}
            </span>
            <span v-else>--</span>
          </div>
        </div>
        <div class="item " v-if="editType==0">
          <div class="fl labelName">权限：</div>
          <div class="fr labelMain" v-if="editType==0">
             <span v-if="editForm.userRights">
              {{toNull(editForm.userRights.permissions_name)}}
            </span>
            <span v-else>--</span>
          </div>
        </div>
        <div class="save" v-if="editType==1">
          <el-button type="primary" :loading='loadingSave' @click.prevent="editSave(editForm)">保 存</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog :title="addTitle" :visible.sync="dialogFormVisible" class='addForm'>
      <el-form :model='addForm' ref="addForm" :rules="formRules">
        <el-form-item label="联系方式" :label-width="formLabelWidth" prop="mobile"  v-if="addType==3">
          <el-input v-model="addForm.mobile" type="number" maxLength="11" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="添加职务" :label-width="formLabelWidth" prop="job"  v-if="addType!=1&&editType!=10">
          <el-input v-model="addForm.position" type="text" maxLength="11" auto-complete="off" v-if="addType==2"></el-input>
          <el-select v-model="addForm.position" placeholder="所有职务" @change='changeJob'  v-if="addType==3||addType==4">
            <el-option
              v-for="(item,index) in positionList"
              :key="item.id"
              :label="item.positionsName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item  label="选择项目" :label-width="formLabelWidth" prop="projectId"  v-if="addType==3">
          <el-select v-model="addForm.projectId" multiple filterable placeholder="请选择" @change="changeProjectId">
            <el-option
              v-for="item in projectList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item  label="职务名称" :label-width="formLabelWidth" prop="projectId"  v-if="editType==10">
          <el-input v-model="addForm.name" type="text" maxLength="10" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading='loadingSave' @click.prevent="saveAndContinue('continue')">保存并继续添加</el-button>
        <el-button type="primary" :loading='loadingSave' @click.prevent="saveOnly('only')">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { projectApi,rightsApi } from "../../api";
  import { LocalCache } from "../../lib/utils";
  import board from "@/components/blacklist/board"
  import moment from "moment"
  import commonTit from '@/components/common/commonTit'
  import male from '@/assets/img/male.png'
  import female from '@/assets/img/female.png'
  import noCertImg from '../../assets/img/no_cert_img.png'
  export default {
    name: "infoEntry",
    components:{
      board,commonTit
    },
    data() {
      var  validateMobile=(rule,value,callback)=>{
        const reg= /^1(3[0-9]|4[457]|5[0-35-9]|6[0-9]|7[0135678]|8[0-9]|9[0-9])\d{8}$/;
        console.log(value);
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
      var validatePositionI = (rule,value,callback)=>{
        if(!this.addForm.position){
          callback(new Error('请输入职务名称！'))
        } else {
          callback()
        }
      }
      var validatePositionS = (rule,value,callback)=>{
        if(!this.addForm.position){
          callback(new Error('请选择所属职务！'))
        } else {
          callback()
        }
      }
      return {
        title:'部门架构详情',
        loading:true,
        menuList:[],
        editForm:{},
        uniqueOpen:true,
        addForm:{

        },
        activeIndex:"1",
        male:male,
        female:female,
        nocert:noCertImg,
        addTitle:'',
        positionList:[],
        editType:0,
        companyId:"",
        projectList:[],
        noBorderBottom:false,
        page:1,
        noResult:'当前公司下暂无项目！',
        noSearchResult:'暂无符合条件的搜索结果！',
        tableLoading:true,
        showPagination:false,
        bulkStatus:false,
        loadingSave:false,
        companyRole:'',
        formLabelWidth:"20%",
        tableData:[],
        dialogView:{
        },
        dialogViewVisible:false,
        pageSize:10,
        total:0,
        editVisible:false,
        viewLoading:false,
        editData:{
          type:[]
        },
        formRules:{
          mobile: [{trigger: 'blur', validator: validateMobile }],
          positionI: [{trigger: 'blur', validator: validatePositionI }],
          positionS: [{trigger: 'change', validator: validatePositionS }],
        },
        editRules:{
          positionS: [{trigger: 'change', validator: validatePositionS }],
        },
        groupLoading:true,
        nameLoading:true,
        addType:"",
        viewTitle:"",
        nameSearch:'',
        dialogFormVisible:false,
        projectId:"",
        projectList:[],
        positionId:"",
        departmentName:'',
        departmentId:"",
        editMLType:false,
        editPositionId:"",
      }
    },
    methods: {
      handleOpen(key, keyPath) {
        //console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        //console.log(key, keyPath);
      },
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
      changeProject(val){
        console.log(val);
        this.getTableData(val,this.page,this.pageSize,this.nameSearch,this.positionId)
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
      //批量管理
      bulkManage(){
        this.bulkStatus=true
        console.log(this.bulkStatus);
      },
      backToDefault(){
        this.bulkStatus=false
      },
      //修改部门
      changeDepartment(){},
      //修改职务
      changeJob(){
      },

      //删除左侧职务
      //批量修改职务
      blukChangeJob(){
        this.dialogFormVisible = true;
        this.loadingSave = false;
        this.addType = 4;
        this.addTitle="批量修改职务"
      },
      saveEdit(){
        let that = this
      },
      //删除项目管理员
      delManager(id){
        let that = this;
        this.$confirm('此操作将删除该项目管理员, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.noBorderBottom = false;
          projectApi.delProjUsers(that.projectId, id).then(()=>{
            // console.log('删除了项目管理员');
            that.getTableData(that.projectId,that.page,that.pageSize,that.nameSearch,that.positionId)
          }).catch((res) => {
            that.$message({
              type: 'error',
              message: res.msg
            });
          });
        }).catch(() => {
          that.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      //编辑黑名单信息
      edit(data){
        this.dialogViewVisible = true ;
        this.editForm =data;
        this.viewLoading = true;
        this.editType= 1
        this.addType = ""
      },
      //编辑左侧职务
      editML(){
        this.editMLType = true
      },
      //玩成左侧职务编辑
      editComplete(){
        this.editMLType = false
      },
      //修改左侧职务
      editChange(id,name){
        console.log(id);
        this.editType = 10
        this.dialogFormVisible = true
        this.loadingSave = false
        this.addType = ""
        this.addTitle="修改职务名称"
        this.editPositionId = id
        this.addForm.name = name
      },
      editDelete(id){
        let that = this;
        //该职务存在人员，是否确定删除职务？删除后需重新设置人员职务
        this.$confirm('此操作将删除该职务，若该职务存在人员，删除后需重新设置人员职务，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.noBorderBottom = false;
          rightsApi.delPositions(id,that.departmentId).then((result)=>{
            //that.tableLoading = true
            console.log(result);
            that.getLeftList()
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
      //查看详情
      viewDetail(data){
        console.log(data);
        this.dialogViewVisible = true ;
        this.editForm =data;
        this.viewLoading = true;
        this.editType= 0
      },
      changePosition(id){
        this.getTableData(this.projectId,this.page,this.pageSize,this.nameSearch,id)
      },
      searchName(){
        this.getTableData(this.projectId,this.page,this.pageSize,this.nameSearch,this.positionId)
      },
      handleCurrentChange(val){
        this.getTableData(this.projectId,val,this.pageSize,this.nameSearch,this.positionId)
      },
      querySearchAsync(queryString, cb) {
        let that = this
        //this.getTableData(this.projectId,val,this.pageSize,this.nameSearch,this.positionId)
        projectApi.projManagerListNew(this.projectId,1, 10000,this.companyId, this.nameSearch, true,this.positionsId).then((result)=>{
          console.log('search projManagerListNew',result.pagination.totalPages);
          this.nameList = result.data
          var results = queryString ?  this.nameList.filter(this.createStateFilter(queryString)) :  this.nameList;
          this.total = result.pagination.totalItems;
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
      changeProjectId(val){
        console.log("projectIdList",val);
      },
      createStateFilter(queryString) {
        return (state) => {
          return (state.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      handleSelect() {
        this.getTableData(this.projectId,this.page,this.pageSize,this.nameSearch,this.positionId)
      },
      getProjectList(){
        projectApi.allProjectList().then((result)=>{
          this.projectList = result.data
          console.log('this.projectList',this.projectList);
        }).catch((res)=>{
          this.$message({
            type: 'error',
            message: res.msg,
            duration:3000,
          });
        })
      },
      getLeftList(){
        rightsApi.getPositionsNew(this.companyId,1,null).then((res)=>{
          console.log('success getPositionsNew',res.data);
          this.departmentName = res.data[0].name
          this.departmentId = res.data[0].id
          this.menuList = res.data[0].list
          this.positionList = res.data[0].list
        }).catch((res)=>{
          console.log('error',res);
        })
      },
      toDate(val){
        return moment(val).format("YYYY-MM-DD")
      },
      getTableData(projectId, page, pageSize, searchPara, positionsId){
        this.tableLoading = true;
        this.noBorderBottom = false
        let that = this
        //projectId, page, pageSize, companyId, searchPara, viewRights, positionsId
        projectApi.projManagerListNew(projectId, page, pageSize, this.companyId, searchPara, true, positionsId).then((result)=>{
          console.log('projManagerList',result.data,result);
          this.tableData = result.data;
          let pagination = result.pagination
          this.total  = pagination.totalItems
          this.tableLoadingClose()
          if(pagination.totalPages<=1){
            this.showPagination = false
          }else{
            this.showPagination = true
          }
        }).catch((res)=>{
          this.tableLoadingClose()
          this.$message({
            message:res.msg,
            type:'error'
          })
        })
      },
      //add 整合
      add(type){
        this.dialogFormVisible = true;
        this.loadingSave = false;
        this.editType = ""
        if(type == 'position'){
          this.addType = 2;
          this.addTitle="添加职务"
        }else if(type == "admin"){
          this.addType = 3;
          this.addTitle="添加项目管理员"
        }
      },
      dialogClose(){
        this.$refs.addForm.resetFields();
      },
      save(type){
        let that = this
        this.$refs.addForm.validate((valid) => {
          if(valid){
            console.log(100);
            this.loadingSave = true
            if(this.addType==2){
              rightsApi.addPositions("", "", this.companyId, this.addForm.position).then((res)=>{
                console.log("addDepartment success",res);
                this.$message.success(res.msg);
                that.dialogFormVisible = false
                that.getLeftList();
              }).catch((res)=>{
                this.$message.error(res.msg);
                console.log("error",res);
              })
            }else if(this.addType == 3){//positionsId, userId, projectIds, departmentId, companyId ,contact
              rightsApi.addProjectAdminPositionAndProject(this.addForm.position,"",this.addForm.projectId.join(","),this.departmentId,this.companyId,this.addForm.mobile).then((res)=>{
                console.log("addProjectAdminPositionAndProject success",res);
                this.$message.success(res.msg);
                //that.getLeftList();
              }).catch((res)=>{
                this.$message.error(res.msg);
              })
            }else if(this.addType == 4){//positionsId, userIdList, departmentId, companyId
              //console.log(this.userIdList);
              rightsApi.addProjectAdminPositionAndProjectBatch(this.addForm.position,this.userIdList,this.departmentId,this.companyId).then((res)=>{
                console.log('addProjectAdminPositionAndProjectBatch',res);
                this.$message.success(res.msg);
                this.getTableData("",this.page,this.pageSize,this.nameSearch,"")
              }).catch((res)=>{
                console.log("error",res);
                this.$message.error(res.msg);
              })
            }else if(this.editType == 10){
              console.log(this.editPositionId,this.addForm.name);
              rightsApi.addPositions(this.editPositionId, "", this.companyId, this.addForm.name).then((res)=>{
                console.log("addDepartment success",res);
                this.$message.success(res.msg);
                this.dialogFormVisible = false
                that.getLeftList();
              }).catch((res)=>{
                this.$message.error(res.msg);
                console.log("error",res);
              })
            }
            this.loadingSaveClose(type);
          }
        })
      },
      //批量选择
      handleSelectionChange(val){
        console.log(val);
        this.multipleSelection = val;
        this.userIdList = []
        for(var i=0;i<this.multipleSelection.length;i++){
          this.userIdList.push(this.multipleSelection[i].id)
        }
        this.userIdList = this.userIdList.join(',')
        console.log(this.userIdList);
      },
      saveAndContinue(type){
        this.save(type)
      },
      saveOnly(type){
        this.save(type)
      },
      dialogReset(){
        this.$refs['addForm'].resetFields();
        this.addForm={};
        this.positionDisabled = true
      },
      editSave(obj){
        let uId = obj.id, contact = obj.mobile, that = this, projectId= obj.userRights.project_id;
        console.log(obj,obj.id,obj.mobile,projectId,this.editForm.job);
        this.$refs.editForm.validate((valid) => {
          if(valid){
            this.loadingSave = true//positionsId, userId, projectId, departmentId, companyId ,contact
            rightsApi.addProjectAdminPositionAndProject(that.editForm.job,uId,projectId,that.departmentId,that.companyId,contact).then((res)=>{
              console.log("addProjectAdminPositionAndProject success",res);
              this.$message.success(res.msg);
              //that.getLeftList();
              this.dialogViewVisible = false
              this.getTableData("",this.page,this.pageSize,this.nameSearch,"")
            }).catch((res)=>{
              this.$message.error(res.msg);
            })
            this.loadingSaveClose("only");
          }else{
            this.$message.error()
          }
        })
      }
    },
    beforeMount(){
      this.loadingClose()
      this.companyId = LocalCache.get('companyInfo').companyId;
      this.companyRole = LocalCache.get('companyInfo').companyRole;
      this.getProjectList()
      this.getLeftList()
      if(this.companyRole==1){
        this.viewTitle = "企业管理员详情"
      }else if(this.companyRole==2){
        this.viewTitle = "项目管理员详情"
      }
    },
    mounted(){
      //projectId, page, pageSize, searchPara, positionsId
      this.getTableData(this.projectId,this.page,this.pageSize,this.nameSearch,this.positionId)
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
  .projectTable{
    .el-table td{
      padding: 10px 0;
    }
    .imgBox,.projectName{
      float: left;
    }
    .projectName{
      line-height: 40px;
    }
    .imgBox{
      width: 40px;
      height: 40px;
      margin-right: 5px;
      -webkit-border-radius: 50%;
      -moz-border-radius: 50%;
      border-radius: 50%;
      overflow: hidden;
      vertical-align: middle;
      border: 1px solid #eee;
      display: inline-block;
      margin-left: 8%;
      img{
        width: 40px;
        height: 40px;
      }
    }
    .save .el-button{
      margin-top: 20px;
      padding: 10px 36px;
    }
  }
  .searchOption{
    overflow: hidden;
    margin-bottom: 10px;
    .demonstration{
      margin-left: 20px;
      line-height: 40px;
      margin-right: 6px;
    }
  }
  .mb0{
    margin-bottom: 0px;
  }
  .limitProject{
    .db{
      display: block;
      overflow: hidden;
      -ms-text-overflow: ellipsis;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 112px;
    }
    /deep/ .el-menu-item{
      padding: 0;
    }
    .editBox{
      position: relative;
      .editML{
        position: absolute;
        font-size: 14px;
        line-height: 14px;
        padding:4px 6px ;
        top: 0;
        right: 0;
        -webkit-border-radius: 3px;
        -moz-border-radius: 3px;
        border-radius: 3px;
        color: #ffffff;
        top: 5px;
      }
      .editChange{
        color: #3E74CA;
        right: 45px;
      }
      .editDelete{
        color: #FA254D;
        right: 5px;
      }
    }
  }
</style>
