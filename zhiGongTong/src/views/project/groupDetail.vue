<template>
    <div class="projectManager container groupDetail"

    >
      <common-tit :title="title" :type='true'></common-tit>
      <div class="groupMain" v-loading="loading" element-loading-text="正在加载数据中">
        <div class="projectName">{{projectName}}</div>
        <div id="classmateTable" class="groupTable">
          <div class="tableTitle">
            <span>{{groupName}}({{groupNumber}}个)</span>
            <span class="fr" @click="addMembers(3)">添加班组工人</span>
          </div>
          <el-table :data="groupList" style="width: 95%;margin:20px auto 0"  :class="{nobb:noBorderBottom}">
            <el-table-column align='center' label="姓名" min-width="120" >
              <template slot-scope="scope" >
                <span v-if="scope.row.name">{{scope.row.name}}</span>
                <span v-else-if="scope.row.nickname">{{scope.row.nickname}}</span>
                <span v-else>{{scope.row.mobile}}</span>
                <img :src="groupLeader" alt="" v-if="groupLeaderId == scope.row.id">
              </template>
            </el-table-column>
            <el-table-column align='center' label="性别"  min-width="60">
                <template slot-scope="scope">
                  <span v-if="scope.row.gender==1">男</span>
                  <span v-else-if="scope.row.gender==2">女</span>
                  <span v-else>--</span>
                </template>
            </el-table-column>
            <el-table-column align='center' prop="mobile" label="联系电话" min-width="120"></el-table-column>
            <el-table-column align='center'  label="工种类型" min-width="120">
              <template slot-scope="scope" >
                <span>{{toNull(scope.row.workGroupName)}}</span><span v-if="scope.row.projectRole==3||scope.row.littleBig==0" class="zhiGong fz16 sizeBig" >&#xe649;</span><span v-else-if="scope.row.projectRole==4||scope.row.littleBig==1" class="zhiGong fz16 sizeLittle">&#xe64a;</span>
              </template>
            </el-table-column>
            <el-table-column align='center'  label="查看" min-width="120">
              <template slot-scope="scope" >
                <span @click.prevent="viewDetail(scope.row,4)" class="view"><i class='zhiGong'>&#xe67c;</i>点击查看</span>
              </template>
            </el-table-column>
            <el-table-column align='center'  label="操作" min-width="130">
              <template slot-scope="scope" >
                <!--<span @click.prevent="edit" class="edit"><i class="zhiGong">&#xe626;</i>编辑</span>-->
                <span @click.prevent="del(scope.row.id)" class="view" v-if="groupLeaderId != scope.row.id"><i class="zhiGong">&#xe635;</i>删除</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column align='center' label="薪资规则" min-width="90"  class="limitMain">
              <template slot-scope="scope">
                <span @click.prevent="setPay(scope.row)" class="view"><i class="zhiGong">&#xe634;</i>设置</span>
              </template>
            </el-table-column>
            <el-table-column align='center'  label="备注" min-width="150">
              <template slot-scope="scope">
                <div class="grid-content">
                  <span v-if="scope.row.userDetail.idNumber">已录身份证</span>
                  <span class="red" v-else>未录身份证</span> |
                  <span v-if="scope.row.faced==1">已录人脸</span>
                  <span class="red" v-else>未录人脸</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <el-dialog title="添加班组工人" :visible.sync="dialogVisible" class='dialogForm' :before-close="dialogClose">
            <el-form :model='dialogData' ref="dialogData" :rules="formRules">
              <el-form-item label="联系方式" :label-width="formLabelWidth" prop="mobile">
                <el-input v-model="dialogData.mobile" type="number" maxLength="11" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="工种类型" :label-width="formLabelWidth" prop="type" >
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
              <div class="imgBox">
                <img :src="dialogView.avatar" alt="">
                <div class="tip" v-if='dialogView.workGroupName'>
                  {{dialogView.workGroupName}}
                </div>
              </div>

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
                <div class="fl labelName">班组：</div>
                <div class="fr labelMain">{{groupName}}</div>
              </div>
            </div>
          </el-dialog>
        </div>
        <el-pagination v-if="showPagination"
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page.sync="currentPage"
                       :page-size="10"
                       layout="total, prev, pager, next"
                       :total="totalNum">
        </el-pagination>
      </div>
    </div>
</template>

<script>
  import commonTit from '@/components/common/commonTit'
  import {userApi,projectApi,groupApi,workDemandApi} from "../../api";
  import {LocalCache} from "../../lib/utils";
  import moment from 'moment'
  import noCertImg from '../../assets/img/no_cert_img.png'
  import male from '@/assets/img/male.png'
  import female from '@/assets/img/female.png'
  import groupLeader from '@/assets/img/groupLeader.png'
  export default {
      name: "",
    components:{
      commonTit
    },
      data() {
        var  validateMobile=(rule,value,callback)=>{
          const reg= /^(0|86|17951)?(13[0-9]|15[0-9]|17[678]|18[0-9]|14[0-9]|16[0-9]|19[0-9])[0-9]{8}$/
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
          title:'班组工人列表',
          projectList:[],
          loading:false,
          projectId:'',
          projDetail:{},
          projAdminList:[],
          groupList:[],
          dialogData:{
            mobile:'',
            workTypeName:''
          },
          dialogTitle:"",
          dialogVisible:false,
          loadingSave:false,
          projAdminNumber:'',
          groupNumber:'',
          formRules: {
            mobile:[{trigger: 'blur', validator: validateMobile }],
            type:[{trigger: 'change', validator: validateType }],
          },
          formLabelWidth:"30%",
          role:4,
          dialogViewTitle:"",
          dialogViewVisible:false,
          dialogView:{},
          male:male,
          female:female,
          nocert:noCertImg,
          tempList:[],
          tempNumber:'',
          positionShow:false,
          groupId:'',
          projectName:'',
          groupName:'',
          workTypeList:[],
          workTypeDisabled:true,
          workTypeLoading:true,
          loading:true,
          noBorderBottom:false,
          showPagination:false,
          pageSize:10,
          page:1,
          currentPage:1,
          groupLeaderId:'',
          groupLeader:groupLeader,
          salaryData:{
            salaryType:'',
            salary:''
          },
          salaryRules:{
            salary:[{trigger: 'blur', validator: validateSalary }],
            salaryType:[{trigger: 'change', validator: validateSalaryType }]
          },
          salaryVisible:false,
          salaryName:"",
          companyId:"",
          salaryId:"",
          sortList:[],
          sort:"",
          workSize:"",
          workSizeDisabled:true,
          workSizeLoading:true,
          workSizeArr:[
            {code:3,value:'大工'},
            {code:4,value:'小工'},
          ],
          littleBig:0,
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
        loadingClose(){
          setTimeout(() => {
            this.noBorderBottom = true
            this.loading = false;
          }, 500);
        },
        toNull(val){
          if(!val){
            return '--'
          }else{
            return val
          }
        },
        del(val){
          let that = this;
          this.$confirm('此操作将删除该班组成员, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            projectApi.delProjUsers(that.projectId, val).then((result) => {
              console.log('删除项目工人');
              console.log(result);
              that.groupList.splice(that.groupList.findIndex(v => v.id === val),1);
              that.$message({
                type: 'success',
                message: result.msg
              });
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
        viewDetail(data){
          console.log(data);
          this.dialogData.mobile = ""
          this.dialogData.workTypeName = ""
          this.positionShow = true
          this.dialogViewTitle = "班组工人详情"
          this.dialogView =data;
          let idNumber =data.userDetail.idNumber;
          if(idNumber){
            this.dialogView.idNumber = idNumber.substring(0, 3)+'***********'+idNumber.substring(14, 18)
          }else{
            this.dialogView.idNumber = idNumber
          }
          this.dialogViewVisible=true;
        },
        addMembers(val){
          this.dialogVisible = true
        },
        handleCurrentChange(val){
          console.log(val);
          this.noBorderBottom = false
          this.loading = true
          this.getProjGroupMember(val,10,this.projectId,this.groupId);
        },
        handleSizeChange(val){
          console.log(val);
        },
        getProjGroupMember(page,pageSize,projectId,groupId){
          projectApi.lookProjGroupMenber(page,pageSize,projectId,groupId).then((result)=>{
            console.log('lookProjGroupMenber',result);
            this.groupList = result.data;
            this.groupNumber = result.pagination.totalItems;
            this.loadingClose()
            this.totalNum = result.pagination.totalItems
            if(result.pagination.totalPages<=1){
              this.showPagination = false
            }else{
              this.showPagination = true
            }
          }).catch((res)=>{
            this.$message({
              type:'error',
              message:res.msg
            })
            this.loadingClose()
            console.log(res);
          })
          projectApi.getProjectGroupsUserList(projectId,groupId).then((result)=>{
            console.log("getProjectGroupsUserList",result);
          }).catch((res)=>{
            this.$message({
              type:'error',
              message:res.msg
            })
            this.loadingClose()
            console.log(res);
          })
        },
        loadingSaveClose(){
          setTimeout(() => {
            this.loadingSave = false;
          }, 500);
        },
        dialogClose(done){
          this.$refs['dialogData'].resetFields();
          done()
        },
        saveAndContinue(type,role){
          console.log(role);
          this.save(type,role)
        },
        saveOnly(type,role){
          this.save(type,role)
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
        salaryClose(done){
          this.$refs['salaryData'].resetFields();
          done()
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
        },
        save(type,role){
          let that = this
          this.$refs.dialogData.validate((valid) => {
            if (valid) {
              this.loadingSave = true;
              if(that.workSize == 3){
                that.littleBig = 0
              }else if(that.workSize == 4){
                that.littleBig = 1
              }
              userApi.searchUser(that.companyId,that.dialogData.mobile).then((result)=>{
                let resData=result.data.list;
                console.log(resData);
                groupApi.projAddWorker(that.dialogData.workTypeName, resData[0].id, that.groupId, that.littleBig).then((result) => {     //添加工人到班组
                  console.log(result.data);
                  projectApi.addWorkerToprojGroup(that.projectId, that.workSize, resData[0].id, that.groupId).then((result) => { //添加工人到项目
                    this.$message({
                      type:'success',
                      message:result.msg
                    });
                    that.getProjGroupMember(1,10,that.projectId,that.groupId)
                    that.loadingSaveClose();

                    if(type == 'only'){
                      that.dialogVisible = false
                    }
                  }).catch((res)=>{
                    that.loadingSaveClose()
                    this.$message({
                      type:'error',
                      message:res.msg
                    })
                    console.log(res);
                  })
                  that.$refs['dialogData'].resetFields();
                }).catch((res)=>{
                  this.$message({
                    type:'error',
                    message:res.msg
                  })
                  that.loadingSaveClose()
                })
              });
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
      },
      beforeMount(){
        this.projectId = this.$route.params.projectId;
        this.groupId = this.$route.params.groupId;
        this.groupLeaderId = this.$route.params.groupLeaderId;
        //this.workTypeList = LocalCache.get('workTypeList')
        this.companyId =LocalCache.get('companyInfo').companyId
        projectApi.projectDetail(this.projectId).then((res)=>{
          console.log('projectDetail',res.data);
          this.projectName = res.data.name;
        }).catch((res)=>{
          this.$message({
            type:'error',
            message:res.msg
          })
        });
        workDemandApi.workTypes(null).then((res)=>{
          console.log("workTypes",res);
          this.sortList = res.data;
        }).catch((res)=>{
          console.log(res);
        })
        groupApi.getWorkGroup(this.groupId).then((res)=>{
          console.log('getWorkGroup',res.data);
          this.groupName = res.data.name;
        }).catch((res)=>{
          this.$message({
            type:'error',
            message:res.msg
          })
        });

      },
      mounted(){
        this.getProjGroupMember(1,10,this.projectId,this.groupId)
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
  .projectName{
    font-size: 22px;
    text-align: left;
    line-height: 80px;
    margin-left: 2.5%;
  }
  .projectManager .tableTitle{
    margin-top: 10px;

  }
  .red{
    color: #ff8585;
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
  .tableMain{
    .el-row:first-child{
      background:#fff;
      border-bottom: 1px solid #ccc;
    }
    .el-row:last-child{
      border-bottom: none;
    }
  }
  .projOption /deep/ .el-button{
    padding: 0;
    a{
      display: block;
      padding: 12px 20px;
    }
  }
  .salaryForm /deep/ .el-radio-group{
    padding: 12px 0;
  }
  .fz16{
    font-size: 16px;
    padding-left: 5px;
    vertical-align: top;
  }
  .sizeBig{
    color: #3aa3f3;
  }
  .sizeLittle{
    color: #87b3d7;
  }
  .dialogForm /deep/ .el-select{
    margin-right: 10px;
  }
</style>
