<template>
    <div class="projectManager projectDetail container"
      v-loading="loading"
         element-loading-text="正在加载数据中"
    >
      <common-tit :title="title" :type='true'></common-tit>
      <div class="projOption">
        <el-button type='primary' class="fl" @click="viewAttend">查看项目考勤</el-button>
        <el-button type='primary' class="fl" @click="editProj">编辑项目</el-button>
        <el-button type='primary' plain class="fr" @click="delProj()" v-if="companyRole==1">删除项目</el-button>
      </div>

      <div class="projSimple"
           v-loading="simpleLoading"
           element-loading-text="正在加载数据中"
      >
        <el-row>
          <el-col :span='3'>项目名称</el-col>
          <el-col :span='9'><div class="tov">{{projDetail.name}}</div></el-col>
          <el-col :span='3'>项目总人数</el-col>
          <el-col :span='9'><div class="tov">{{projDetail.userCount}}</div></el-col>
        </el-row>
        <el-row>
          <el-col :span='3'>项目所在地</el-col>
          <el-col :span='9'><div class="tov">{{projDetail.location}}{{projDetail.address}}</div></el-col>
          <el-col :span='3'>项目考勤机</el-col>
          <el-col :span='9'><div class="tov">{{projDetail.machineCount}}</div></el-col>
        </el-row>
        <el-row>
          <el-col :span='3'>开工时间</el-col>
          <el-col :span='9'><div class="tov">{{projDetail.startTime}}</div></el-col>
          <el-col :span='3'>劳务公司</el-col>
          <el-col :span='9'><div class="tov">{{projDetail.company}}</div></el-col>
        </el-row>
      </div>
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick" class="projTable">
        <el-tab-pane >
          <span slot="label">项目管理员({{projAdminNumber}}人)</span>
          <div class="tableTitle">
            <span class="fr" @click="addMembers(1)">添加管理员</span>
          </div>
          <el-table :data="projAdminList" class='tableMain'  :class="{nobb:noBorderBottom}">
            <el-table-column align='center' label="姓名" min-width="120" class="limitMain">
              <template slot-scope="scope" >
                <div class="name">
                  <div class="imgBox"><img :src="scope.row.avatar" alt=""></div>
                  <span class="nameInner" v-if="scope.row.name">{{scope.row.name}}</span>
                  <span class="nameInner" v-else-if="scope.row.nickname">{{scope.row.nickname}}</span>
                  <span class="nameInner" v-else>{{scope.row.mobile}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column align='center'  label="性别"  class="limitMain">
              <template slot-scope="scope" >
                <div class=""><span v-if='scope.row.gender==1'>男</span><span v-else-if="scope.row.gender==2">女</span><span v-else>--</span></div>
              </template>
            </el-table-column>
            <el-table-column align='center' prop="mobile" label="联系电话" min-width="130"  class="limitMain"></el-table-column>

            <el-table-column align='center' label="查看" min-width="130"  class="limitMain">
              <template slot-scope="scope">
                <span @click.prevent="viewDetail(scope.row,1)" class="view"><i class='zhiGong'>&#xe67c;</i>点击查看</span>
              </template>
            </el-table-column>
            <el-table-column align='center' label="操作" min-width="130"  class="limitMain">
              <template slot-scope="scope">
                <span @click.prevent="delMember(scope.row.id,1)" class="view"><i class="zhiGong">&#xe635;</i>删除</span>
              </template>
            </el-table-column>
            <el-table-column align='center' label="薪资规则" min-width="90"  class="limitMain">
              <template slot-scope="scope">
                <span @click.prevent="setPay(scope.row)" class="view"><i class="zhiGong">&#xe634;</i>设置</span>
              </template>
            </el-table-column>
            <el-table-column align='center' label="备注" min-width="130"  class="limitMain">
              <template slot-scope="scope">
                <div >
                  <span v-if="scope.row.userDetail">
                    <span v-if="scope.row.userDetail.idNumber">已录身份证</span>
                    <span class="red" v-else>未录身份证</span>
                  </span>
                  <span class="red" v-else>未录身份证</span> |
                  <span v-if="scope.row.faced==1">已录人脸</span>
                  <span class="red" v-else>未录人脸</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination v-if="adminPagination"
                         @current-change="handleAdminCurrentChange"
                         :current-page.sync="adminCurrentPage"
                         :page-size="pageSize"
                         layout="total, prev, pager, next"
                         :total="projAdminNumber">
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane >
          <span slot="label">项目班组({{groupNumber}}个)</span>
          <div class="tableTitle">
            <span class="fr" @click="addMembers(4)">添加班组工人</span>
            <span class="fr mr10" @click="addMembers(2)">添加班组长</span>
          </div>
          <el-table :data="groupList" class='tableMain'  :class="{nobb:noBorderBottom}">
            <el-table-column align='center' label="姓名" min-width="120" class="limitMain">
              <template slot-scope="scope" >
                <span class="nameInner" v-if="scope.row.name">{{scope.row.name}}</span>
                <span class="nameInner" v-else-if="scope.row.nickname">{{scope.row.nickname}}</span>
                <span class="nameInner" v-else>{{scope.row.mobile}}</span>
              </template>
            </el-table-column>
            <el-table-column align='center'  label="性别"  class="limitMain">
              <template slot-scope="scope" >
                <div class=""><span v-if='scope.row.gender==1'>男</span><span v-else-if="scope.row.gender==2">女</span><span v-else>--</span></div>
              </template>
            </el-table-column>
            <el-table-column align='center'  label="联系电话" min-width="130"  class="limitMain">
              <template slot-scope="scope">
                <span >{{scope.row.user.mobile}}</span>
              </template>
            </el-table-column>
            <el-table-column align='center' prop="memberCount" label="班组工人" min-width="130"  class="limitMain"></el-table-column>

            <el-table-column align='center' label="查看" min-width="130"  class="limitMain">
              <template slot-scope="scope">
                <span @click.prevent="viewDetail(scope.row,2)" class="view"><i class='zhiGong'>&#xe67c;</i>点击查看</span>
              </template>
            </el-table-column>
            <el-table-column align='center' label="操作" min-width="130"  class="limitMain">
              <template slot-scope="scope">
                <span @click.prevent="delMember(scope.row.id,2)" class="view"><i class="zhiGong">&#xe635;</i>删除</span>
              </template>
            </el-table-column>

            <el-table-column align='center' label="备注" min-width="130"  class="limitMain">
              <template slot-scope="scope">
                <div @click.prevent="infoInput(scope.row)" >
                  <span v-if="scope.row.user.userDetail">
                    <span v-if="scope.row.user.userDetail.idNumber">已录身份证</span>
                    <span class="red" v-else>未录身份证</span>
                  </span>
                  <span class="red" v-else>未录身份证</span> |
                  <span v-if="scope.row.faced==1">已录人脸</span>
                  <span class="red" v-else>未录人脸</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination v-if="groupPagination"
                         @size-change="handleSizeChange"
                         @current-change="handleCurrentChange"
                         :current-page.sync="currentPage"
                         :page-size="pageSize"
                         layout="total, prev, pager, next"
                         :total="groupNumber">
          </el-pagination>

        </el-tab-pane>
        <el-tab-pane >
          <span slot="label">临时工({{tempNumber}}个)</span>
          <div class="tableTitle">
            <span class="fr" @click="addMembers(3)">添加临时工</span>
          </div>
          <el-table :data="tempList" class='tableMain'  :class="{nobb:noBorderBottom}">
            <el-table-column align='center' label="姓名" min-width="120" class="limitMain">
              <template slot-scope="scope" >
                <div class="name">
                  <div class="imgBox"><img :src="scope.row.avatar" alt=""></div>
                  <span class="nameInner" v-if="scope.row.name">{{scope.row.name}}</span>
                  <span class="nameInner" v-else-if="scope.row.nickname">{{scope.row.nickname}}</span>
                  <span class="nameInner" v-else>{{scope.row.mobile}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column align='center'  label="性别"  class="limitMain">
              <template slot-scope="scope" >
                <div class=""><span v-if='scope.row.gender==1'>男</span><span v-else-if="scope.row.gender==2">女</span><span v-else>--</span></div>
              </template>
            </el-table-column>
            <el-table-column align='center' prop="mobile" label="联系电话" min-width="130"  class="limitMain"></el-table-column>
            <el-table-column align='center' prop="positionName" label="职务" min-width="130"  class="limitMain">
              <template slot-scope="scope">
                <span v-if="scope.row.position==null">--</span>
                <span v-else-if="scope.row.position==0">其他</span>
                <span v-else>{{scope.row.positionName}}</span>
              </template>
            </el-table-column>

            <el-table-column align='center' label="查看" min-width="130"  class="limitMain">
              <template slot-scope="scope">
                <span @click.prevent="viewDetail(scope.row,3)" class="view"><i class='zhiGong'>&#xe67c;</i>点击查看</span>
              </template>
            </el-table-column>
            <el-table-column align='center' label="操作" min-width="130"  class="limitMain">
              <template slot-scope="scope">
                <!--<span @click.prevent="edit" class="edit"><i class="zhiGong">&#xe626;</i>编辑</span>-->
                <span @click.prevent="delMember(scope.row.id,3)" class="view"><i class="zhiGong">&#xe635;</i>删除</span>
              </template>
            </el-table-column>
            <el-table-column align='center' label="薪资规则" min-width="90"  class="limitMain">
              <template slot-scope="scope">
                <span @click.prevent="setPay(scope.row)" class="view"><i class="zhiGong">&#xe634;</i>设置</span>
              </template>
            </el-table-column>
            <el-table-column align='center' label="备注" min-width="130"  class="limitMain">
              <template slot-scope="scope">
                <div >
                  <span v-if="scope.row.userDetail">
                    <span v-if="scope.row.userDetail.idNumber">已录身份证</span>
                    <span class="red" v-else>未录身份证</span>
                  </span>
                  <span class="red" v-else>未录身份证</span> |
                  <span v-if="scope.row.faced==1">已录人脸</span>
                  <span class="red" v-else>未录人脸</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination v-if="tempPagination"
                         @size-change="handleSizeChange"
                         @current-change="handleCurrentChange"
                         :current-page.sync="currentPage"
                         :page-size="pageSize"
                         layout="total, prev, pager, next"
                         :total="tempNumber">
          </el-pagination>
        </el-tab-pane>
      </el-tabs>
      <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" class='dialogForm' :before-close="dialogClose">
        <el-form :model='dialogData' ref="dialogData" :rules="formRules">
          <!-- <el-form-item label="姓名" :label-width="formLabelWidth" prop="name">
             <el-input v-model="addAdmin.name" auto-complete="off"></el-input>
           </el-form-item>-->
          <el-form-item label="联系方式" :label-width="formLabelWidth" prop="mobile">
            <el-input v-model="dialogData.mobile" type="number" maxLength="11" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="班组工种" :label-width="formLabelWidth" prop="workTypes"  v-if="WMShow">
            <el-select v-model="dialogData.workTypes" multiple placeholder="请选择工种类型(可多选)" @change="selectWorkTypes" class="workTypeSelect">
              <el-option-group v-for="(workType,index) in workTypesList" :key="workType.id" :label="workType.name" class="workTypeGroup">
                <el-option v-for="item in workType.list" :key="item.code" :label="item.value" :value="item.code" class="workTypeItem"></el-option>
              </el-option-group>
            </el-select>
          </el-form-item>
          <el-form-item label="职务" :label-width="formLabelWidth" prop="position"  v-if="jobShow">
            <el-select v-model="dialogData.job" placeholder="请选择工种类型" @change="selectPosition" >
              <el-option
                v-for="(item,index) in jobList"
                :key="item.id"
                :label="item.positionsName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="职务" :label-width="formLabelWidth" prop="position"  v-if="positionShow">
            <el-select v-model="dialogData.position" placeholder="请选择工种类型" @change="selectPosition" >
              <el-option
                v-for="(item,index) in positionList"
                :key="item.id"
                :label="item.value"
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属班组" :label-width="formLabelWidth" prop="groupId" v-if="workerShow">
            <el-select v-model="dialogData.groupId" placeholder="请选该项目下所属班组" @change="changeGroup" >
              <el-option
                v-for="(item,index) in groupList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="工种类型" :label-width="formLabelWidth" prop="workTypeName" v-if="workerShow">
            <el-select v-model="sort" placeholder="请选择工种种类" @change="changeSort">
              <el-option
                v-for="(item,index) in sortList"
                :key="item.id"
                :label="item.name"
                :value="item.list">
              </el-option>
            </el-select>
            <el-select v-model="dialogData.workTypeName" placeholder="请选择工种类型" :disabled="workTypeDisabled" :loading="workTypeLoading" @change="changeWorkType">
              <el-option
                v-for="(item,index) in sort"
                :key="item.id"
                :label="item.value"
                :value="item.code">
              </el-option>
            </el-select>
            <el-select v-model="workSize" placeholder="请选择大小工" :disabled="workSizeDisabled" :loading="workSizeLoading">
              <el-option
                v-for="(item,index) in workSizeArr"
                :key="item.id"
                :label="item.value"
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" :loading='loadingSave' @click.prevent="saveAndContinue('continue',role)">保存并继续添加</el-button>
          <el-button type="primary" :loading='loadingSave' @click.prevent="saveOnly('only',role)">保存</el-button>
        </div>
      </el-dialog>
      <el-dialog title="设置薪资规则" :visible.sync="salaryVisible" class='dialogForm salaryForm' :before-close="salaryClose">
        <el-form :model='salaryData' ref="salaryData" :rules="salaryRules">
          <el-form-item label="姓名" :label-width="formLabelWidth" prop="name">
            <div class="fl">{{salaryName}}</div>
          </el-form-item>
          <el-form-item label="选择薪资方式" :label-width="formLabelWidth" prop="salaryType">
            <el-radio-group v-model="salaryData.salaryType" class="fl">
              <el-radio :label="1">按天</el-radio>
              <el-radio :label="4">按月</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="请输入薪资" :label-width="formLabelWidth" prop="salary">
            <el-input v-model="salaryData.salary" type="number" :maxLength="6" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" :loading='loadingSave' @click.prevent="saveSalary">保存</el-button>
        </div>
      </el-dialog>
      <el-dialog :data='dialogView' :title="dialogViewTitle" :visible.sync="dialogViewVisible">
        <div class="adminDetail">
          <div class="imgBox"><img :src="dialogView.avatar" alt=""></div>
          <div class='male'>
            <span v-if="dialogView.gender==1"><img :src="male" alt=""></span>
            <span v-else-if = "dialogView.gender == 2"><img :src="female" alt=""></span>
            <span v-else><img :src="nocert" alt=""></span>
          </div>
          <div class="item">
            <div class="fl labelName">姓名：</div>
            <div class="fr labelMain">{{toNull(dialogView.name)}}</div>
          </div>
          <div class="item">
            <div class="fl labelName">联系电话：</div>
            <div class="fr labelMain">{{toNull(dialogView.mobile)}}</div>
          </div>
          <div class="item">
            <div class="fl labelName">身份证号码：</div>
            <div class="fr labelMain">{{toNull(dialogView.idNumber)}}</div>
          </div>
          <div class="item" v-if="positionShow">
            <div class="fl labelName">职务：</div>
            <div class="fr labelMain">{{toNull(dialogView.positionName)}}</div>
          </div>
        </div>
      </el-dialog>
    </div>
</template>

<script>
  import classmateTable from '@/components/table/classmateTable'
  import commonTit from '@/components/common/commonTit'
  import {userApi,projectApi,groupApi,workDemandApi,rightsApi} from "../../api";
  import {LocalCache} from "../../lib/utils";
  import moment from 'moment'
  import noCertImg from '../../assets/img/no_cert_img.png'
  import male from '@/assets/img/male.png'
  import female from '@/assets/img/female.png'
  export default {
      name: "",
      components:{
       classmateTable,commonTit
      },
      prop:['projName','projData'],
      data() {
        var  validateMobile=(rule,value,callback)=>{
          const reg= /^(0|86|17951)?(13[0-9]|15[0-9]|17[678]|18[0-9]|14[0-9]|16[0-9]|19[0-9])[0-9]{8}$/;
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
        var  validatePosition=(rule,value,callback)=>{
          const _reg = /^[0-9]+.?[0-9]*$/;
          //console.log(this.dialogData.position,_reg.test(this.dialogData.position));
          //if(!_reg.test(this.dialogData.position)){
            //callback(new Error('请选择临时工职务！'))
          //} else {
            callback()
          //}
        }
        var  validateType=(rule,value,callback)=>{
          console.log(value,this.sort);
          if(!this.sort){
            callback(new Error("请选择工种种类！"))
          } else if (!this.dialogData.workTypeName){
            callback(new Error('请选择工种类型！'))
          } else {
            callback()
          }
        }
        var  validateGroup=(rule,value,callback)=>{
          if(!this.dialogData.groupId){
            callback(new Error('请选择所属班组！'))
          } else {
            callback()
          }
        }
        var  validateSalaryType = (rule,value,callback)=>{
          if(!this.salaryData.salaryType){
            callback(new Error('请选择薪资类型！'))
          } else {
            callback()
          }
        }
        var  validateSalary = (rule,value,callback)=>{
          if(!this.salaryData.salary){
            callback(new Error('请输入薪资金额！'))
          }else if(this.salaryData.salary.length>7){
            callback(new Error('请输入长度低于7位的薪资！'))
          } else {
            callback()
          }
        }
        return {
          title:'项目详情',
          projectList:[],
          loading:false,
          projectId:'',
          projDetail:{},
          projAdminList:[],
          groupList:[],
          dialogData:{
            mobile:'',
            position:'',
            workTypeName:'',
            groupId:''
          },
          salaryData:{
            salaryType:'',
            salary:''
          },
          activeName:'',
          dialogTitle:"",
          dialogVisible:false,
          loadingSave:false,
          projAdminNumber:'',
          groupNumber:'',
          formRules: {
            mobile:[{trigger: 'blur', validator: validateMobile }],
            position:[{trigger: 'blur', validator: validatePosition }],
            workTypeName:[{trigger: 'blur', validator: validateType }],
            groupId:[{trigger: 'blur', validator: validateGroup }],
          },
          salaryRules:{
            salary:[{trigger: 'blur', validator: validateSalary }],
            salaryType:[{trigger: 'change', validator: validateSalaryType }]
          },
          formLabelWidth:"30%",
          role:'',
          dialogViewTitle:"",
          dialogViewVisible:false,
          dialogView:{},
          male:male,
          female:female,
          nocert:noCertImg,
          noBorderBottom:false,
          tempList:[],
          tempNumber:'',
          positionShow:false,
          workerShow:false,
          companyRole:'',
          simpleLoading:true,
          adminLoading:true,
          groupLoading:true,
          tempLoading:true,
          pageSize:12,
          currentPage:1,
          adminPagination:false,
          groupPagination:false,
          tempPagination:false,
          adminCurrentPage:1,
          groupCurrentPage:1,
          tempCurrentPage:1,
          salaryVisible:false,
          salaryName:"",
          companyId:"",
          salaryId:"",
          sortList:[],
          sort:"",
          workSize:"",
          jobShow:false,
          WMShow: false,
          workTypeDisabled:true,
          workSizeDisabled:true,
          workSizeLoading:false,
          workTypeLoading:false,
          workSizeArr:[
            {code:3,value:'大工'},
            {code:4,value:'小工'},
          ],
          littleBig:0,
          jobList:[],
          workTypesList:[],
        }
      },
      methods: {
        changeSort(){
          this.workTypeDisabled = false
          this.workTypeLoading  = false
        },
        changeWorkType(){
          this.workSizeDisabled = false
          this.workSizeLoading  = false
        },
        selectPosition(val){
          console.log(val);
        },
        handleSizeChange(){},
        handleCurrentChange(){},
        handleAdminCurrentChange(val){
          this.adminCurrentPage = val
          this.getData(val,this.pageSize,this.projectId,this.groupId,this.dateValue, this.nameSearch)
        },
        handleGroupCurrentChange(val){
          this.groupCurrentPage = val
        },
        handleTempCurrentChange(val){
          this.tempCurrentPage = val
        },
        handleClick(val){
          //this.noBorderBottom = false
          console.log(val.paneName,this.noBorderBottom);
        },
        infoInput(val){
          console.log(val);
        },
        changeGroup(val){
          console.log(val);
        },
        simpleLoadingClose(){
          setTimeout(() => {
            this.noBorderBottom = true
            this.simpleLoading = false;
          }, 500);
        },
        adminLoadingClose(){
          setTimeout(() => {
            this.noBorderBottom = true
            this.adminLoading = false;
          }, 500);
        },
        groupLoadingClose(){
          setTimeout(() => {
            this.noBorderBottom = true
            this.groupLoading = false;
          }, 500);
        },
        tempLoadingClose(){
          setTimeout(() => {
            this.tempLoading = false;
          }, 500);
        },
        toNull(val){
          if(!val){
            return '--'
          }else{
            return val
          }
        },
        selectWorkTypes(val){
          console.log("selectWorkTypes",val);
        },
        dialogClose(done){
          this.$refs['dialogData'].resetFields();
          done()
        },
        salaryClose(done){
          this.$refs['salaryData'].resetFields();
          done()
        },
        delProj(){
          let that = this;
          this.$confirm('此操作将删除该项目, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            projectApi.delProj(that.projectId).then(()=>{
              that.projectList.splice(that.projectList.findIndex(v => v.id === val),1);
              that.$message({
                type: 'success',
                message: '删除成功!',
                duration:1000,
                onClose:function (res) {
                  that.$router.push({path:'/project/index'})
                }
              });
            })

          }).catch(() => {
            that.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        },
        viewDetail(row,role){
          //console.log(row,role,row.userRights.positions_name);
          if(role==1){
            this.positionShow = true
            this.dialogView =row;
            this.dialogView.positionName = row.userRights.positions_name,
            this.dialogView.idNumber =row.userDetail.idNumber;
            this.dialogViewTitle = "项目管理员详情"
            this.dialogViewVisible=true;
          } else if (role == 3) {
            this.positionShow = true
            this.dialogViewTitle = "临时工详情"
            this.dialogView =row;
            this.dialogView.idNumber =row.userDetail.idNumber;
            this.dialogViewVisible=true;
          } else {
            console.log(row);
            this.$router.push({path:'/project/groupDetail/'+this.projectId+'/'+row.id+'/'+row.user.id})
          }

        },
        viewAttend(){
          var id = this.projectId;
          this.$router.push({path:'/attend/projAttend/'+id})
        },
        editProj(){
          var id = this.projectId;
          this.$router.push({path:'/project/editDetail/'+id})
        },
        addMembers(val){
          this.dialogVisible = true
          this.dialogData.mobile = ""
          this.dialogData.position = ""
          //console.log(val);
          if(val == 1){
            this.dialogTitle="添加项目管理员";
            this.role = 1
            this.positionShow = false
            this.jobShow = true
            this.WMShow = false
            this.workerShow = false
          } else if (val == 3){
            this.dialogTitle="添加临时工";
            this.role = 3
            this.positionShow = true
            this.WMShow = false
            this.jobShow = false
            this.workerShow = false
          } else if (val == 4){
            this.dialogTitle="添加班组工人";
            this.role = 4
            this.positionShow = false
            this.WMShow = false
            this.jobShow = false
            this.workerShow = true
          } else if (val == 2){
            this.dialogTitle="添加班组长"
            this.role = 2
            this.positionShow = false
            this.jobShow = false
            this.WMShow = true
            this.workerShow = false
          }
        },
        setPay(obj){
          if(obj.name){
            this.salaryName = obj.name
          }else if(obj.nickname){
            this.salaryName = obj.nickname
          }else{
            this.salaryName = obj.mobile
          }
          console.log("setPay obj",obj);
          this.salaryId = obj.id
          this.salaryVisible = true
          projectApi.getSalary(this.projectId,this.salaryId).then((res)=>{
            //console.log(res.data);
            if(res.data.salaryType){
              this.salaryData.salaryType = res.data.salaryType
            }
            if(res.data.salary){
              this.salaryData.salary = res.data.salary
            }
          }).catch((res)=>{
            console.log(res);
          })


        },
        getData(projectId,groupId,day,name){
          //.catch((res)=>{
          //  this.$message({
          //    type:'error',
          //    message:res.msg
          //  })
          //})
        },
        changeDate(){

        },
        delMember(val,role){
          let that = this ;
          let comfirmTitle
          if(role==1){
            comfirmTitle ='此操作将删除该项目管理员, 是否继续?'
          } else if(role==2){
            comfirmTitle ='此操作将删除该班组, 是否继续?'
          } else if(role==3){
            comfirmTitle ='此操作将删除该临时工, 是否继续?'
          }
          this.$confirm(comfirmTitle, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if(role ==1 ){
              projectApi.delProjUsers(that.projectId, val).then(()=>{
                // console.log('删除了项目管理员');
                that.projAdminList.splice(that.projAdminList.findIndex(v => v.id === val),1);
                that.projAdminNumber = that.projAdminNumber - 1;
                if(that.projAdminNumber>that.pageSize){
                  that.showAdminPagination = true
                }
                that.$message({
                  type: 'success',
                  message: '删除成功!'
                });
              }).catch((res) => {
                that.$message({
                  type: 'error',
                  message: res.msg
                });
              });
            }else if(role == 2){
              console.log(100);
              var obj = {
                id: val,
                types: []
              }
              let a=[];
              a.push(obj)
              projectApi.delGroup(that.projectId, JSON.stringify(a)).then(()=>{
                // console.log('删除了项目管理员');
                console.log(1000);
                that.groupList.splice(that.groupList.findIndex(v => v.id === val),1);
                that.groupNumber = that.groupNumber - 1;
                that.$message({
                  type: 'success',
                  message: '删除成功!'
                });
              }).catch((res) => {
                that.$message({
                  type: 'error',
                  message: res.msg
                });
              });
            }else if(role==3){

              projectApi.delProjUsers(that.projectId, val).then(()=>{
                // console.log('删除了项目管理员');
                that.tempList.splice(that.tempList.findIndex(v => v.id === val),1);
                that.tempNumber = that.tempNumber - 1;
                that.$message({
                  type: 'success',
                  message: '删除成功!'
                });
              }).catch((res) => {
                that.$message({
                  type: 'error',
                  message: res.msg
                });
              });
            }

          }).catch(() => {
            that.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        },
        getProjAdminList(projectId,page){
          projectApi.projManagerListNew(projectId,page,10,this.companyId,"",true,null).then((result)=>{
            console.log('projManagerListNew',result);
            this.projAdminNumber = result.pagination.totalItems
            if(result.pagination.totalItems>10){
              this.adminPagination = true
            }
            this.projAdminList = result.data;
            this.adminLoadingClose()
          }).catch((res)=>{
            this.$message({
              type:'error',
              message:res.msg
            })
            this.adminLoadingClose()
          });
        },
        getProjGroupList(projectId){
          projectApi.projGroupsList(projectId).then((result)=>{
            console.log('projGroupsList',result.data);
            this.groupNumber = result.data.length
            //if(this.groupNumber>this.pageSize){
            //  this.groupPagination = true
            //}
            this.groupList = result.data;
            console.log(this.groupList);
            this.groupLoadingClose()
          }).catch((res)=>{
              this.$message({
                type:'error',
                message:res.msg
              })
            this.groupLoadingClose()
            console.log(res);
          })
        },
        getProjTempList(projectId){
          projectApi.projTemporaryWorkerList(projectId).then((result)=>{
            console.log('projTemporaryWorkerList',result.data);
            this.tempNumber = result.data.length;
            //if(this.tempNumber>this.pageSize){
            //  this.tempPagination = true
            //}
            this.tempList = result.data;
            this.tempLoadingClose();
          }).catch((res)=>{
            this.$message({
              type:'error',
              message:res.msg
            })
            this.tempLoadingClose();
            console.log(res);
          })
        },
        loadingSaveClose(){
          setTimeout(() => {
            this.loadingSave = false;
            this.dialogData.mobile=""
          }, 500);
        },
        saveAndContinue(type,role){
          console.log(role);
          this.save(type,role)
        },
        saveOnly(type,role){
          this.save(type,role)
        },
        save(type,role){
          let that = this
          this.$refs.dialogData.validate((valid) => {
            if (valid) {
              this.loadingSave = true;

              console.log(role);
              userApi.searchUser(that.companyId,that.dialogData.mobile).then((result)=>{
                let resData=result.data.list;
                if(that.role ==1){
                  projectApi.addRoleToList(that.projectId, role, resData[0].id, that.dialogData.position).then((res)=>{
                    that.$message({
                      type:'success',
                      message:res.msg
                    });
                    that.getProjAdminList(that.projectId,this.adminCurrentPage)
                  }).catch((res)=>{
                    that.$message({
                      type:'error',
                      message:res.msg
                    })

                  });
                } else if (that.role==3){
                  projectApi.addRoleToList(that.projectId, role, resData[0].id, that.dialogData.position).then((res)=>{
                    that.$message({
                      type:'success',
                      message:res.msg
                    });
                    that.getProjTempList(that.projectId)
                  }).catch((res)=>{
                    that.$message({
                      type:'error',
                      message:res.msg
                    })

                  });
                } else if (that.role == 4){
                  console.log("role4",that.dialogData.workTypeName, resData[0].id, that.dialogData.groupId);
                  let groupId = that.dialogData.groupId,
                    workTypeId=that.dialogData.workTypeName;
                  if(that.workSize == 3){
                    that.littleBig = 0
                  }else if(that.workSize == 4){
                    that.littleBig = 1
                  }
                  groupApi.projAddWorker(workTypeId, resData[0].id, groupId, that.littleBig).then((res) => {
                    //添加工人到班组
                    console.log('projAddWorker params',workTypeId, resData[0].id, groupId, that.littleBig);
                    //console.log('projAddWorker',res.data);
                    projectApi.addWorkerToprojGroup(that.projectId, that.workSize, resData[0].id, groupId).then((result) => { //添加工人到项目
                      console.log('addWorkerToprojGroup params',that.projectId, that.workSize, resData[0].id, groupId);
                      this.$message({
                        type:'success',
                        message:result.msg
                      });
                      that.getProjGroupList(that.projectId)
                      that.loadingSaveClose();
                    }).catch((res)=>{
                      that.loadingSaveClose()
                      this.$message({
                        type:'error',
                        message:res.msg
                      })
                      console.log(res);
                    })
                  }).catch((res)=>{
                    that.loadingSaveClose()
                    that.$message({
                      type:'error',
                      message:res.msg
                    })
                  })
                } else if (that.role == 2){
                  projectApi.addGroupLeader(that.projectId, resData[0].id, that.dialogData.workTypes.join(",")).then((res)=>{
                    that.$message({
                      type:'success',
                      message:res.msg
                    });
                    that.getProjGroupList(that.projectId)
                  }).catch((res)=>{
                    that.$message({
                      type:'error',
                      message:res.msg
                    })
                  })
                }

                that.loadingSaveClose()
                if(type == 'only'){
                  that.dialogVisible = false
                  that.$refs['dialogData'].resetFields();
                }
              }).catch((res)=>{
                that.$message({
                  type:'error',
                  message:res.msg
                })
                that.loadingSaveClose()
              });
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
        saveSalary(){
          this.$refs.salaryData.validate((valid) => {
            if (valid) {
              this.loadingSave = true;
              let that = this
              //projectId, userId, salaryType, salary
              projectApi.updateSalary(that.projectId, that.salaryId, that.salaryData.salaryType, that.salaryData.salary).then((res)=>{
                console.log(res.data);
                that.$message.success(res.msg)
                that.loadingSaveClose()
                that.salaryVisible = false
                that.$refs['salaryData'].resetFields();
              }).catch((res)=>{
                console.log("error res", res);
              })

            } else {
              console.log('error submit!!');
              return false;
            }
          });
        }
      },
      beforeMount(){
        this.projectId    = this.$route.params.projectId;
        this.companyRole  = LocalCache.get('companyInfo').companyRole ;
        this.companyId    = LocalCache.get('companyInfo').companyId;
        this.positionList = LocalCache.get("positionList")
        projectApi.projectDetail(this.projectId).then((res)=>{
          //console.log('projectDetail',res.data);
          this.projDetail = res.data
          this.projDetail.startTime = moment(this.projDetail.startTime).format('YYYY-MM-DD')
          this.simpleLoadingClose()
        }).catch((res)=>{
          this.$message({
            type:'error',
            message:res.msg
          })
        });
        rightsApi.getPositionsNew(this.companyId,1,null).then((res)=>{
          console.log('success getPositionsNew',res.data);
          this.jobList = res.data[0].list
        }).catch((res)=>{
          console.log('error',res);
        })
        workDemandApi.workTypes(null).then((res)=>{
          console.log("workTypes",res);
          this.sortList = res.data;
          this.workTypesList = res.data;
        }).catch((res)=>{
          console.log(res);
        })
      },
      mounted(){
        this.getProjAdminList(this.projectId,this.adminCurrentPage)
        this.getProjGroupList(this.projectId,this.groupCurrentPage)
        this.getProjTempList(this.projectId,this.tempCurrentPage)
      }
    }

</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../assets/sass/variable";
  .projOption,.projSimple{
    overflow: hidden;
    width: 95%;
    margin: 20px auto 10px;
  }

  .red{
    color: #ff8585;
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
  .projSimple{
    border-top: 1px solid #D3DCE3;
    border-bottom: 1px solid #D3DCE3;
    border-left: 1px solid #D3DCE3;
    border-right: 1px solid #D3DCE3;
    font-size: 14px;
    .el-row{
      height: 42px;
      .el-col-9:last-child{
        border-right: none;
      }
    }
    .el-row:first-child{
      background:#fff;
      border-bottom:  1px solid #D3DCE3;
    }
    .el-row:nth-child(2){
      background:#F0F2F8;
      border-bottom:  1px solid #D3DCE3;
    }
    .el-row:nth-child(3){
      border-bottom: none;
    }
    .el-col-3,.el-col-9{
      border-right: 1px solid #D3DCE3;
      line-height: 42px;
      height: 42px;
    }
    .el-col-9{
      text-align: left;
      padding-left: 20px;
      padding-right: 20px;
      .tov{
        width: 100%;
        overflow: hidden;
        @extend %tov;
      }

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
  .dialogForm .el-input{
    width: 60%;
    float: left;
  }
  .el-select{
    float: left;
  }
  .projectDetail{
    .el-tabs{
      width: 95%;
      margin: 0 auto;
    }
  }
  .projTable{
    border: none;
  }
  .projectManager .tableTitle{
    overflow: hidden;
    margin-top: -20px;
    width: 100%;
    .fr{
      margin-bottom: 10px;
    }
  }
  .salaryForm /deep/ .el-radio-group{
    padding: 12px 0;
  }
  .dialogForm /deep/ .el-select{
    margin-right: 10px;
  }
  .workTypeSelect{
    width: 60%;
  }
  .workTypeItem{
    width: 25%;
    float: left;
  }
  .workTypeGroup{

    overflow: hidden;
  }
  .is-multiple{
    width: 60%;
  }
  /deep/ .el-select-dropdown{
    width: 60%;
  }
</style>
