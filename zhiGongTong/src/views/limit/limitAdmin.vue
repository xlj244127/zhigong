<template>
  <div class='container limitAdmin'  v-loading="loading"
       element-loading-text="正在加载">
    <common-tit :title="title" :type='true'></common-tit>
    <div class="adminMain">
      <div class="fl manageList">
        <div class="manageTitle">
          部门管理  <span class="fr" @click="editML" v-if="editMLType == false">编辑</span><span class="fr" @click="editComplete" v-else>退出</span>
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
            <el-submenu :index="item.name" v-if="item.list!=null" v-for='item in menuList' :key='item.id'>
              <template slot="title">
                <span class="db" @click="changeDataByDepartmentId(item.id)" :class="{w100p:!editMLType}">{{item.name}}</span>
                <span v-if="editMLType == true" class="editML editChange" @click="editChange(item.id,item.name,9,item.id)">编辑</span>
                <span v-if="editMLType == true" class="editML editDelete" @click="deleteDepartment(item.id,item.list)">删除</span>
              </template>
              <el-menu-item-group>
                <el-menu-item :index="item2.positionsName" v-for="item2 in item.list" :key="item2.id">
                  <span class="db" @click="changeDataByPositionId(item.id,item2.id)" :class="{w100p:!editMLType}">{{item2.positionsName}}</span>
                  <span v-if="editMLType == true" class="editML editChange" @click="editChange(item2.id,item2.positionsName,10,item.id)">编辑</span>
                  <span v-if="editMLType == true" class="editML editDelete" @click="deletePosition(item2.id,item.id)">删除</span>
                </el-menu-item>

              </el-menu-item-group>
            </el-submenu>
            <el-menu-item :index="item.name" v-else>
              <span class="db" @click="changeDepartmentList(item.id)" :class="{w100p:!editMLType}">{{item.name}}</span>
              <span v-if="editMLType == true" class="editML editChange" @click="editChange(item.id,item.name,9,item.id)">编辑</span>
              <span v-if="editMLType == true" class="editML editDelete" @click="deleteDepartment(item.id,item.list)">删除</span>
            </el-menu-item>
        </el-menu>
        <div class="manageAdd">
          <el-button type="primary"  @click="add('department')" class="fl" >添加部门</el-button>
          <el-button type="primary"  @click="add('position')" class="fr" >添加职务</el-button>
        </div>
      </div>
      <div class="adminTablePart">
        <div class="searchOption">
          <div class="defaultStatus" v-if="bulkStatus==false">
            <el-autocomplete v-model="nameSearch" :fetch-suggestions="querySearchAsync" placeholder="请输入关键字搜索" @select="handleSelect"  class="fl">
              <el-button slot="append" type="primary" icon="el-icon-search" @click="searchName"></el-button>
            </el-autocomplete>

            <el-button type="primary"  @click="add('admin')" class="fr" >添加企业管理员</el-button><!--dialogFormVisible = true-->
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
                <span v-if="scope.row.gender == 1">男</span>
                <span v-else-if = "scope.row.gender == 2">女</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column align='center'  label="部门" min-width="100"  class="limitMain">
              <template slot-scope="scope">
                <div v-if="scope.row.userRights">
                  {{toNull(scope.row.userRights.department_name)}}
                </div>
                <div v-else>--</div>
              </template>
            </el-table-column>
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
            <el-table-column align='center' prop="mobile" label="联系电话" min-width="100"  class="limitMain"></el-table-column>
            <el-table-column align='center' label="查看" min-width="100"  class="limitMain">
              <template slot-scope="scope">
                <span @click.prevent="viewDetail(scope.row)" class="view"><i class='zhiGong'>&#xe67c;</i>点击查看</span>
              </template>
            </el-table-column>
            <el-table-column align='center' label="操作" min-width="130"  class="limitMain" v-if="companyRole==1&&bulkStatus==false">
              <template slot-scope="scope">
                <span @click.prevent="edit(scope.row)" class="view edit"><i class="zhiGong">&#xe626;</i>编辑</span>
                <span @click.prevent="delManager(scope.row.id)" class="view"><i class="zhiGong relieve">&#xe635;</i>删除</span>
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
    <el-dialog  :title="viewTitle" :visible.sync="dialogViewVisible" id="viewAndEdit">
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
        <div class="item">
          <div class="fl labelName">联系电话：</div>
          <div class="fr labelMain">{{toNull(editForm.mobile)}}</div>
        </div>
        <div class="item">
          <div class="fl labelName">身份证号：</div>
          <div class="fr labelMain">{{toNull(editForm.idNumber)}}</div>
        </div>
        <div class="item">
          <div class="fl labelName">部门：</div>
          <div class="fr labelMain" v-if="editType==0">
            <span v-if="editForm.userRights">
              {{toNull(editForm.userRights.department_name)}}
            </span>
            <span v-else>--</span>
          </div>
          <div class="fr labelMain" v-else-if="editType==1">
            <el-select v-model="editForm.userRights.department_id" placeholder="所有部门" @change='changeDepartment'>
              <el-option
                v-for="(item,index) in departmentList"
                :key="item.id"
                :label="item.departmentName"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="item">
          <div class="fl labelName">职务：</div>
          <div class="fr labelMain" v-if="editType==0">
            <span v-if="editForm.userRights">
              {{toNull(editForm.userRights.positions_name)}}
            </span>
            <span v-else>--</span>
          </div>
          <div class="fr labelMain" v-else-if="editType==1">
            <el-select v-model="editForm.userRights.positions_id" placeholder="所有职务" @change='changePosition' :disabled="positionDisabled" :loading='positionLoading'>
              <el-option
                v-for="(item,index) in positionList"
                :key="item.id"
                :label="item.positionsName"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
        </div>
      </el-form>
      <div v-if="editType==1" slot="footer" class="dialog-footer save">
        <el-button type="primary" :loading='loadingSave' @click.prevent="editSave(editForm)">保 存</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="addTitle" :visible.sync="dialogFormVisible" class='addForm' @close="dialogReset()">
      <el-form :model='addForm' ref="addForm" :rules="formRules">
        <el-form-item label="联系方式" :label-width="formLabelWidth" prop="mobile"  v-if="addType==3">
          <el-input v-model="addForm.mobile" type="number" maxLength="11" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="添加部门" :label-width="formLabelWidth" prop="departmentI"  v-if="addType==1" >
          <el-input v-model="addForm.departmentName" type="text" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="添加部门" :label-width="formLabelWidth" prop="departmentS"  v-else-if="addType==2||addType==3||addType==4" >
          <el-select v-model="addForm.departmentName" placeholder="所有部门" @change='changeDepartment' >
            <el-option
              v-for="(item,index) in departmentList"
              :key="item.id"
              :label="item.departmentName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="添加职务" :label-width="formLabelWidth" prop="positionI" v-if="addType==2">
          <el-input v-model="addForm.position" type="text" maxLength="11" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="添加职务" :label-width="formLabelWidth" prop="positionS" v-if="addType==3 ||addType==4">
          <el-select v-model="addForm.position" placeholder="所有部门" @change='changePosition' :disabled="positionDisabled" :loading='positionLoading'>
            <el-option
              v-for="(item,index) in positionList"
              :key="item.id"
              :label="item.positionsName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item  label="部门名称" :label-width="formLabelWidth" prop="projectId"  v-if="editType==9">
          <el-input v-model="addForm.departmentName" type="text" maxLength="10" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item  label="职务名称" :label-width="formLabelWidth" prop="projectId"  v-if="editType==10">
          <el-input v-model="addForm.position" type="text" maxLength="10" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading='loadingSave' @click.prevent="saveAndContinue('continue')" v-if="editType!=9&&editType!=10">保存并继续添加</el-button>
        <el-button type="primary" :loading='loadingSave' @click.prevent="saveOnly('only')">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { projectApi,companyApi,rightsApi } from "../../api";
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
      var validateDepartmentI = (rule,value,callback)=>{
        if(!this.addForm.departmentName){
          callback(new Error('请输入部门名称！'))
        } else {
          callback()
        }
      }
      var validateDepartmentS = (rule,value,callback)=>{
        if(!this.addForm.departmentName){
          callback(new Error('请选择所属部门！'))
        } else {
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
        uniqueOpen:true,
        addForm:{},
        male:male,
        female:female,
        nocert:noCertImg,
        addTitle:'',
        departmentList:[],
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
        activeIndex:'',
        loadingSave:false,
        companyRole:'',
        formLabelWidth:"20%",
        tableData:[],
        editForm:{
          department_name:'',
          department_id:'',
          positions_name:'',
          positions_id:'',
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
          departmentI: [{trigger: 'blur', validator: validateDepartmentI }],
          departmentS: [{trigger: 'change', validator: validateDepartmentS }],
          positionI: [{trigger: 'blur', validator: validatePositionI }],
          positionS: [{trigger: 'change', validator: validatePositionS }],
        },
        editRules:{
          departmentS: [{trigger: 'change', validator: validateDepartmentS }],
          positionS: [{trigger: 'change', validator: validatePositionS }],
        },
        nameLoading:true,
        addType:"",
        viewTitle:"",
        nameSearch:'',
        dialogFormVisible:false,
        bulkStatus:false,
        positionDisabled:true,
        positionLoading:false,
        multipleSelection: [],
        userIdList: [],
        defaultProps: {
          children: 'list',
          label:"name" ,
        },
        editMLType:false,
        departmentId:0,
        positionsId:0,
      }
    },
    methods: {
      handleOpen(key, keyPath) {
        //console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        //console.log(key, keyPath);
      },
      dialogClose(done){
        this.$refs['dialogData'].resetFields();
        done()
      },
      loadingClose(){
        setTimeout(() => {
          this.loading = false;
        }, 500);
      },
      tableLoadingClose(){
        setTimeout(() => {
          this.noBorderBottom = true
          this.tableLoading = false;
        }, 800);
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
      loadingSaveClose(type){
        setTimeout(() => {
          this.loadingSave = false;
          if(type=="only"){
            this.dialogFormVisible = false
          }else {
            this.dialogFormVisible = true
          }
        }, 1000);
      },
      //批量选择
      handleSelectionChange(val){
        //console.log(val);
        this.multipleSelection = val;
        this.userIdList = []
        for(var i=0;i<this.multipleSelection.length;i++){
          this.userIdList.push(this.multipleSelection[i].id)
        }
        this.userIdList = this.userIdList.join(',')
        //console.log(this.userIdList);
      },
      //获取公司部门列表
      getDepartments(){
        rightsApi.getDepartments(this.companyId,0).then((res)=>{
          console.log('getDepartments',res);
          this.departmentList = res.data
        }).catch((res)=>{
          this.$message.error(res.msg);
          //console.log("error",res);
        })
      },
      //获取公司职务列表
      getPositions(departmentId){
        rightsApi.getPositions(this.companyId,departmentId).then((res)=>{
          console.log("getPositions",res);
          if(res.data.length>1){
            this.positionList = res.data
          }else{
            this.positionList = res.data
          }
          this.positionLoading  = false
          this.positionDisabled = false
        }).catch((res)=>{
          console.log("error",res);
        })
      },
      getLeftList(departmentId){
        rightsApi.getPositionsNew(this.companyId,0,departmentId).then((res)=>{
          console.log('getPositionsNew',res.data);
          this.menuList = res.data
        }).catch((res)=>{
          console.log('error',res);
        })
      },
      // 批量管理
      bulkManage(){
        this.bulkStatus=true
        console.log(this.bulkStatus);
      },
      //返回
      backToDefault(){
        this.bulkStatus=false
      },
      //批量修改职务   addType 4
      blukChangeJob(){
        this.dialogFormVisible = true;
        this.loadingSave = false;
        this.addType = 4;
        this.addTitle="批量修改职务"
      },
      //修改部门
      changeDataByDepartmentId(id){
        this.getTableData("",this.page,this.pageSize,this.nameSearch,true,id,this.positionsId)
      },
      changeDataByPositionId(deparmentId,positionId){
        this.getTableData("",this.page,this.pageSize,this.nameSearch,true,deparmentId,positionId)
      },
      //修改部门
      changeDepartment(value){
        console.log(value);
        this.positionLoading  = true
        this.positionDisabled = true
        this.getPositions(value)
      },
      editChange(id,name,editType,departmentId){
        console.log(id);
        this.editType = editType
        this.dialogFormVisible = true
        this.loadingSave = false
        this.editPositionId = id
        this.addType = ""
        this.editDepartmentId = departmentId
        if(editType==10){
          this.addTitle="修改职务名称"
          this.addForm.position = name
          this.addForm.departmentName = ""
        }else if(editType==9){
          this.addTitle="修改部门名称"
          this.addForm.position = ""
          this.addForm.departmentName = name
        }
      },
      deleteDepartment(id,obj){
        let that = this;
        if(obj.length==0){
          this.$alert(
            "该部门已有职务，请先删除职务后再删除部门","提示",{
              confirmButtonText: '确定',
              type:'warning',
            }
          )
        }else{
          this.$confirm('此操作将删除该部门，是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            that.noBorderBottom = false;
            rightsApi.delDepartment(id).then((result)=>{
              //that.tableLoading = true
              console.log(result);
              that.getLeftList(0)
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
        }

      },
      //删除职务
      deletePosition(id,departmentId){
        let that = this
        this.$confirm('此操作将删除该职务，若该职务存在人员，删除后需重新设置人员职务，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.noBorderBottom = false;
          rightsApi.delPositions(id,departmentId).then((result)=>{
            //that.tableLoading = true
            console.log(result);
            that.getLeftList(0)
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
      //修改职务
      changePosition(){

      },
      saveEdit(){
        let that = this
      },
      //解除黑名单
      delManager(id){
        let that = this;
        this.$confirm('是否确定解除该黑名单人员？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.noBorderBottom = false;
          companyApi.delCompanyManager(id).then((result)=>{
            that.tableLoading = true
            console.log(result);
            that.getTableData("",that.page,that.pageSize,that.nameSearch,true,that.departmentId,that.positionsId)
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
      edit(data){
        let that = this
        console.log(data);
        this.dialogViewVisible = true ;
        this.editForm =data;
        this.viewLoading = true;
        this.editType= 1;
        if(data.userRights.department_id){
          that.getPositions(data.userRights.department_id);
        }
      },
      //查看详情
      viewDetail(data){
        console.log(data);
        this.dialogViewVisible = true ;
        this.editForm =data;
        this.viewLoading = true;
        this.editType= 0
      },
      searchName(){
        this.getTableData("",this.page,this.pageSize,this.nameSearch,true,this.departmentId,this.positionsId)
      },
      handleCurrentChange(val){
        this.getTableData("",val,this.pageSize,this.nameSearch,true,this.departmentId,this.positionsId)
      },
      querySearchAsync(queryString, cb) {
        let that = this
        companyApi.admins("",1, 10000, this.nameSearch,true,this.departmentId,this.positionsId).then((result)=>{
          //console.log('admins querySearchAsync',result,result.pagination.totalPages);
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
      createStateFilter(queryString) {
        return (state) => {
          return (state.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      handleSelect() {
        this.getTableData("",this.page,this.pageSize,this.nameSearch,true,this.departmentId,this.positionsId)
      },
      toDate(val){
        return moment(val).format("YYYY-MM-DD")
      },
      getTableData(name, page, pageSize, searchPara, viewRights, departmendId, positionsId){
        this.tableLoading = true;
        this.noBorderBottom = false
        let that = this
        companyApi.admins(name,page, pageSize, searchPara, viewRights, departmendId, positionsId).then((result)=>{
          console.log('admins',result.data,result);
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
      add(type){
        this.dialogFormVisible = true;
        this.loadingSave = false;
        if(type=='department'){
          this.addType = 1;
          this.addTitle="添加部门"
        }else if(type == 'position'){
          this.addType = 2;
          this.addTitle="添加职务"
        }else if(type == "admin"){
          this.addType = 3;
          this.addTitle="添加项目管理员"
        }
        this.editType=""
      },
      dialogReset(){
        this.$refs['addForm'].resetFields();
        this.addForm={};
        this.positionDisabled = true
      },
      save(type){
        let that = this
        this.$refs.addForm.validate((valid) => {
          if(valid){
            console.log(100);
            this.loadingSave = true
            if(this.addType==1){
              rightsApi.addDepartment("",this.companyId,this.addForm.departmentName).then((res)=>{
                console.log("addDepartment success",res);
                that.$message.success(res.msg);
                that.getDepartments();
                that.getLeftList(0);
              }).catch((res)=>{
                that.$message.error(res.msg);
                console.log("error",res);
              })
            }else if(this.addType==2){
              rightsApi.addPositions("", this.addForm.departmentName, this.companyId, this.addForm.position).then((res)=>{
                console.log("addDepartment success",res);
                this.$message.success(res.msg);
                that.getLeftList(0);
              }).catch((res)=>{
                this.$message.error(res.msg);
                console.log("error",res);
              })
            }else if(this.addType == 3){
              rightsApi.addProjectAdminPositionAndProject(this.addForm.position,"",null,this.addForm.departmentName,this.companyId,this.addForm.mobile).then((res)=>{
                console.log("addProjectAdminPositionAndProject success",res);
                this.$message.success(res.msg);
                //that.getLeftList();
              }).catch((res)=>{
                this.$message.error(res.msg);
              })
            }else if(this.addType == 4){//positionsId, userIdList, departmentId, companyId
              rightsApi.addProjectAdminPositionAndProjectBatch(this.addForm.position,this.userIdList,this.addForm.departmentName,this.companyId).then((res)=>{
                this.$message.success(res.msg);
                this.getTableData("",this.page,this.pageSize,this.nameSearch,true,this.departmentId,this.positionsId)
              }).catch((res)=>{
                console.log("error",res);
                this.$message.error(res.msg);
              })
            }else if(this.editType == 10){
              console.log(this.positionId,this.addForm.position);
              rightsApi.addPositions(this.editPositionId, this.editDepartmentId, this.companyId, this.addForm.position).then((res)=>{
                console.log("addDepartment success",res);
                this.$message.success(res.msg);
                this.dialogFormVisible = false
                that.getLeftList();
              }).catch((res)=>{
                this.$message.error(res.msg);
                console.log("error",res);
              })
            }else if(this.editType == 9){
              rightsApi.addDepartment(this.editDepartmentId,this.companyId,this.addForm.departmentName).then((res)=>{
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
      editSave(obj){
        console.log(obj,obj.id,obj.mobile);
        let uId = obj.id, contact = obj.mobile, that = this
        this.$refs.editForm.validate((valid) => {
          if(valid){
            console.log(100);
            this.loadingSave = true//positionsId, userId, projectIds, departmentId, companyId ,contact
            rightsApi.addProjectAdminPositionAndProject(that.editForm.userRights.positions_id,uId,null,that.editForm.userRights.department_id,that.companyId,contact).then((res)=>{
              console.log("addProjectAdminPositionAndProject success",res);
              this.$message.success(res.msg);
              //that.getLeftList();
              this.dialogView = false
              this.getTableData("",this.page,this.pageSize,this.nameSearch,true,this.departmentId,this.positionsId)
            }).catch((res)=>{
              this.$message.error(res.msg);
            })
            this.loadingSaveClose("only");
            console.log("error submit");
          }
        })
      },
      saveAndContinue(type){
        this.save(type)
      },
      saveOnly(type){
        this.save(type)
      },
      //编辑左侧职务
      editML(){
        this.editMLType = true
      },
      //玩成左侧职务编辑
      editComplete(){
        this.editMLType = false
      },
    },
    beforeMount(){
      this.loadingClose()
      this.companyId = LocalCache.get('companyInfo').companyId;
      this.companyRole = LocalCache.get('companyInfo').companyRole;
      if(this.companyRole==1){
        this.viewTitle = "企业管理员详情"
      }else if(this.companyRole==2){
        this.viewTitle = "项目管理员详情"
      }
      this.getDepartments()
      this.getLeftList(0)
    },
    mounted(){
      this.getTableData("",this.page,this.pageSize,this.nameSearch,true,0,0)
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
  }
  .limitAdmin{
    /deep/ .el-submenu{
      &.is-opened .el-submenu__title{
        background-color: #DDE6F0  !important;
      }
      &.is-active.is-opened .el-submenu__title{
        background: none !important;
      }
      .el-submenu__title{
        padding: 0 !important;
        .editML{
          font-size: 14px;
          color: #3e74ca;
          &.editDelete{
            color: #FA254D;
          }
        }
      }
      .el-submenu__icon-arrow{
        right: 0;
        left: 5px;
        margin-top: -5px;
        width: 12px;
        height: 12px;
      }
      &.is-opened>.el-submenu__title .el-submenu__icon-arrow{
        transform:rotateX(180deg);
      }
      .el-menu-item-group {
        .el-menu-item{
          padding-left: 0 !important;
          .editML{
            font-size: 12px;
            padding:0 3px;
            &.editDelete{
              color: #FA254D;
            }
          }
        }
      }
      .db{
        display: block;
        float: left;
        width: 112px;
        overflow: hidden;
        padding-left: 30px;
        -ms-text-overflow: ellipsis;
        text-overflow: ellipsis;
        white-space: nowrap;
        &.w100p{
          width: 100%;
          box-sizing: border-box;
        }
      }
    }

  }
</style>
