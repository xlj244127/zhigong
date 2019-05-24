<template>
    <div class="projectManager container"
      v-loading="loading"
         element-loading-text="正在加载数据中"
    >
      <common-tit :title="title" :type='true'></common-tit>
      <div class="projectName" v-if="projectId != 0&&companyRole!=1">{{editForm.name}}</div>
      <el-form :model="editForm" :label-width="labelWidth" ref="editForm" :rules='formRules' class="editProject">
          <el-form-item label="项目名称" prop="name" v-if="projectId == 0||companyRole==1">
            <el-input v-model="editForm.name"></el-input>
          </el-form-item>
          <el-form-item label="请选择所在地" prop="location">
            <el-select v-model="editForm.provinceId" placeholder="请选择省份" @change='changeProvice'>
              <el-option
                v-for="(item,index) in proviceOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select >
            <el-select v-model="editForm.cityId" placeholder="请选择城市" @change='changeCity' :disabled="cityDisabled" :loading="cityLoading">
              <el-option
                v-for="(item,index) in cityOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <el-select v-model="editForm.districtId" placeholder="请选择区县" @change='changeDistrict()' :disabled="districtDisabled" :loading="districtLoading">
              <el-option
                v-for="(item,index) in districtOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>

          </el-form-item>
          <el-form-item label="详细地址">
            <el-input v-model="editForm.address"></el-input>
          </el-form-item>
          <el-form-item label="项目创建时间" >
            <el-date-picker v-model="editForm.startTime" align="right" type="date" value-format="yyyy-MM-dd" :picker-options="pickerOptions" :clearable="clearable">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="设置劳务公司" >
            <el-input v-model="editForm.company"></el-input>
          </el-form-item>
      </el-form>
      <div class="addProjectManager">
        <div class="addButton" @click="addManager" v-if="projAdminList.length==0">
          添加项目管理员
        </div>
        <div id="managerTable" v-else>
          <div class="tableTitle">
            <span>项目管理员({{projAdminList.length}}人)</span>
            <span class="fr" @click="addManager">添加项目管理员</span>
          </div>
          <div class="projTable projAdminTable">
            <el-row class="th">
              <el-col :span="4"><div class=" bg-purple">姓名</div></el-col>
              <el-col :span="3"><div class=" bg-purple">性别</div></el-col>
              <el-col :span="3"><div class=" bg-purple">联系电话</div></el-col>
              <el-col :span="5"><div class=" bg-purple">查看</div></el-col>
              <el-col :span="4"><div class=" bg-purple">操作</div></el-col>
              <el-col :span="5"><div class=" bg-purple">备注</div></el-col>
            </el-row>
            <div class="tableMain">
              <el-row :span="24" v-if='projAdminList.length==0'  class="noData"><span>当前公司下暂无项目！</span></el-row>
              <div class="block" v-else>
                <el-row v-for="(item,index) in projAdminList" :key='index' class="limitMain">
                  <el-col :span="4"><div class="name"><div class="imgBox"><img :src="item.avatar" alt=""></div>
                    <span class="nameInner" v-if="item.name">{{item.name}}</span>
                    <span class="nameInner" v-else-if="item.nickname">{{item.nickname}}</span>
                    <span class="nameInner" v-else>{{item.mobile}}</span>
                  </div></el-col>
                  <el-col :span="3"><span v-if='item.gender==1'>男</span><span v-else-if="item.gender==2">女</span><span v-else>--</span></el-col>
                  <el-col :span="3">{{item.mobile}}</el-col>
                  <el-col :span="5"><span @click.prevent="view(index)" class="view"><i class='zhiGong'>&#xe67c;</i>点击查看</span></el-col>
                  <el-col :span="4"><!--<span @click.prevent="edit" class="edit"><i class="zhiGong">&#xe626;</i>编辑</span>--><span @click.prevent="delProjAdmin(item.id)" class="view"><i class="zhiGong">&#xe635;</i>删除</span></el-col>
                  <el-col :span="5">
                    <div class="grid-content">
                      <span v-if="item.userDetail.idNumber">已录身份证</span>
                      <span class="red" v-else>未录身份证</span> |
                      <span v-if="item.faced==1">已录人脸</span>
                      <span class="red" v-else>未录人脸</span>
                    </div>
                  </el-col>
                </el-row>
              </div>

            </div>

          </div>
        </div>
        <div class="button">
      </div>
        <el-button type='primary' @click.prevent="createProject()">提　交</el-button>
      </div>
      <el-dialog :data='dialogView' title="项目管理员详情" :visible.sync="dialogViewVisible">
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
        </div>
      </el-dialog>
      <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" class='dialogForm' >
        <el-form :model='dialogData' ref="dialogData" :rules="formRules">
          <!-- <el-form-item label="姓名" :label-width="formLabelWidth" prop="name">
             <el-input v-model="addAdmin.name" auto-complete="off"></el-input>
           </el-form-item>-->
          <el-form-item label="联系方式" :label-width="labelWidth" prop="mobile">
            <el-input v-model="dialogData.mobile" type="number" maxLength="11" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" :loading='loadingSave' @click.prevent="saveAndContinue('continue',role)">保存并继续添加</el-button>
          <el-button type="primary" :loading='loadingSave' @click.prevent="saveOnly('only',role)">保存</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
  import classmateTable from '@/components/table/classmateTable'
  import commonTit from '@/components/common/commonTit'
  import {userApi,projectApi} from "../../api";
  import {getToday} from "../../lib/getDate";
  import moment from 'moment'
  import {LocalCache} from "../../lib/utils";
  import noCertImg from '../../assets/img/no_cert_img.png'
  import male from '@/assets/img/male.png'
  import female from '@/assets/img/female.png'
  export default {
      name: "editDetail",
      components:{
       classmateTable,commonTit
      },
      prop:['projName','projData'],
      data() {
        var validateName =(rule,value,callback)=>{
          if(!value){
            callback(new Error('请输入项目名'))
          } else {
            callback()
          }
        }
        var validateLocation =(rule,value,callback)=>{

          if(!this.editForm.provinceId){
            callback(new Error('请选择省份'))
          } else if (!this.editForm.cityId){
            callback(new Error('请选择城市'))
          } else if (!this.editForm.districtId){
            callback(new Error('请选择区县'))
          } else {
            callback()
          }
        }
        var  validateMobile=(rule,value,callback)=>{
          const reg= /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
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
        return {
          title:'项目管理',
          labelWidth:'150px',
          proviceOptions:[],
          cityOptions:[],
          districtOptions:[],
          red:false,
          org:false,
          loading:false,
          cityDisabled:true,
          districtDisabled:true,
          cityLoading:true,
          districtLoading:true,
          editForm:{
            name:'',
            provinceId:'',
            cityId:'',
            districtId:'',
            startTime:'',
            company:'',
          },
          loadingSave:false,
          dialogTitle:'添加项目管理员',
          dialogVisible:false,
          formRules: {
            name:[{required: true, trigger:'blur',validator:validateName}],
            location:[{required: true,trigger:'change',validator:validateLocation}],
            mobile:[{required: true,trigger:'blur',validator:validateMobile}],

          },
          role:1,
          pickerOptions: {
            shortcuts: [{
              text: '今天',
              onClick(picker) {
                picker.$emit('pick', new Date());
              }
            }, {
              text: '昨天',
              onClick(picker) {
                const date = new Date();
                date.setTime(date.getTime() - 3600 * 1000 * 24);
                picker.$emit('pick', date);
              }
            }, {
              text: '一周前',
              onClick(picker) {
                const date = new Date();
                date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', date);
              }
            }]
          },
          dialogData:{},
          projAdminList:[],
          projectAdmins:[],
          dialogView:{
            detail:{}
          },
          male:male,
          female:female,
          nocert:noCertImg,
          dialogViewVisible:false,
          companyRole:'',
          clearable:false,
          projectAdminIds:[]
        }
      },
      methods: {
        toNull(val){
          if(val==''){
            return '--'
          }else{
            return val
          }
        },
        loadingSaveClose(){
          setTimeout(() => {
            this.dialogData.mobile=""
            this.loadingSave = false;
          }, 500);
        },
        changeProvice(){
          this.cityDisabled = false;
          this.cityLoading = true;
          this.editForm.cityId = '';
          this.editForm.districtId = '' ;
          userApi.addressCityList(this.editForm.provinceId).then((res)=>{
            //console.log('city',res.data.list);
            this.cityOptions = res.data.list;
            this.cityLoading = false;
          }).catch((res)=>{
            this.$message({
              type:'error',
              message:res.msg
            })
            this.cityLoading = false;
          })
        },
        changeCity(){
          this.districtDisabled = false;
          this.districtLoading = true;
          this.editForm.districtId = '' ;
          userApi.addressAreaList(this.editForm.cityId).then((res)=>{
            //console.log(res.data.list);
            //console.log('AreaList',res.data.list);
            this.districtOptions = res.data.list;
            this.districtLoading = false;
          }).catch((res)=>{
            this.$message({
              type:'error',
              message:res.msg
            })
            this.districtLoading = false;
          })
        },
        changeDistrict(index){
        },
        view(index){
          this.dialogViewVisible=true;
          this.dialogView =this.projAdminList[index];
          this.dialogView.idNumber =this.projAdminList[index].userDetail.idNumber;
        },
        addManager(){
            this.dialogVisible = true
        },
        delProjAdmin(val){
          let that = this ;
          this.$confirm('此操作将删除该项目管理员, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if(this.projectId != 0){
              projectApi.delProjUsers(this.projectId, val).then(()=>{
                // console.log('删除了项目管理员');
                that.projAdminList.splice(that.projAdminList.findIndex(v => v.id === val),1);
                that.projAdminNumber = that.projAdminNumber - 1;
                that.$message({
                  type: 'success',
                  message: '删除成功!'
                });
              })
            }else{
              that.projAdminList.splice(that.projAdminList.findIndex(v => v.id === val),1);
              that.projAdminNumber = that.projAdminNumber - 1;
              that.$message({
                type: 'success',
                message: '删除成功!'
              });
            }

          }).catch(() => {
            that.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
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
            //loginItem: window.getuiCID
            //console.log(that.dialogData.mobile);

            if (valid) {
              this.loadingSave = true;
              let  companyId =LocalCache.get('companyInfo').companyId
              userApi.searchUser(companyId,that.dialogData.mobile).then((result)=>{
                let resData=result.data.list;
                console.log(resData);
                if(that.projectId==0){
                  userApi.userDetail(resData[0].id).then((result)=>{
                    console.log(result.data,result.data.avatar);
                    resData[0].userDetail = result.data.userDetail;
                    if(this.projectAdminIds.indexOf(result.data.id)==-1){
                      let l =this.projAdminList.length
                      that.projAdminList[l] = result.data
                      that.projectAdminIds.push(result.data.id)
                    }else{
                      this.$message({
                        type: 'error',
                        message: '该用户已经被添加到项目管理员列表中！'
                      })
                    }
                  }).catch((res)=> {
                    this.$message({
                      type: 'error',
                      message: res.msg
                    })
                  })
                }else{
                  projectApi.addRoleToList(that.projectId, role, resData[0].id).then((res)=>{
                    this.$message({
                      type:'success',
                      message:res.msg
                    });
                    console.log('addRoleToList',res);
                    that.getProjAdminList(that.projectId)
                  }).catch((res)=> {
                    this.$message({
                      type: 'error',
                      message: res.msg
                    })
                  })
                }
                that.loadingSaveClose()
                if(type == 'only'){
                  that.dialogVisible = false
                }
              }).catch((res)=>{
                this.$message({
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
        createProject(){
          this.$refs.editForm.validate((valid) => {
            if (valid) {
              for(var i=0;i<this.projAdminList.length;i++){
                this.projectAdmins.push(this.projAdminList[i].id)
              }
              this.projectAdmins = this.projectAdmins.join(',')
              console.log(this.projectAdmins);
              projectApi.editProj (
                this.projectId,
                this.companyId,
                this.editForm.name,
                this.editForm.provinceId,
                this.editForm.cityId,
                this.editForm.districtId,
                this.editForm.address,
                this.editForm.startTime,
                this.projectAdmins,
                this.editForm.company,
              ).then((res)=>{
                this.$message({
                  type:'success',
                  message:res.msg
                })
                this.$router.go(-1)
              }).catch((res)=>{
                this.$message({
                  type:'error',
                  message:res.msg
                })
              })
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
        getProjAdminList(projectId){
          projectApi.projManagerList(projectId).then((result)=>{
            console.log('projAdminList',result.data);
            this.projAdminList = result.data;
          }).catch((res)=>{
            this.$message({
              type:'error',
              message:res.msg
            })
          });
        },
      },
      beforeMount(){
        this.companyId = LocalCache.get('companyInfo').companyId;
        this.companyRole = LocalCache.get('companyInfo').companyRole;
        this.projectId = this.$route.params.projectId;
        if(this.projectId != 0){
          projectApi.projectDetail(this.projectId).then((res)=>{
            console.log(res.data);
            this.editForm = res.data
            this.editForm.startTime = moment(res.data.startTime).format('YYYY-MM-DD');
            console.log(this.editForm);
            userApi.addressCityList(res.data.provinceId).then((res)=>{
              //console.log('city',res.data.list);
              this.cityOptions = res.data.list;
              this.cityLoading = false;
              this.cityDisabled = false;
            }).catch((res)=>{
              this.$message({
                type:'error',
                message:res.msg
              })
              this.cityLoading = false;
            })
            userApi.addressAreaList(res.data.cityId).then((res)=>{
              this.districtOptions = res.data.list;
              this.districtLoading = false;
              this.districtDisabled = false;
            }).catch((res)=>{
              this.$message({
                type:'error',
                message:res.msg
              })
              this.districtLoading = false;
            })
          }).catch((res)=>{
            this.$message({
              type:'error',
              message:res.msg
            })
          });
          this.getProjAdminList(this.projectId)
        }
        userApi.addressProviceList().then((res)=>{
          this.proviceOptions = res.data.list
        }).catch((res)=>{
          this.$message({
            type:'error',
            message:res.msg
          })
        })
        this.editForm.startTime = moment(new Date()).format('YYYY-MM-DD')
      },
      mounted(){
        projectApi.allProjectList().then((res)=>{
          this.projectList = res.data
          for(var i=0;i<res.data.length;i++){
            this.projectList[i].startTime = moment(this.projectList[i].startTime).format('YYYY-MM-DD')
          }
        }).catch((res)=>{

        })

      }
    }
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../assets/sass/variable";
  .projectName{
    font-size: 22px;
    text-align: left;
    line-height: 30px;
    margin-top: 25px;
    margin-bottom: 0;
    margin-left: 2.5%;
    height: 30px;
  }
  .searchOption{
    width: 95%;
    margin: 0 auto;
    overflow: hidden;
    padding-top: 30px;
    .block,.el-autocomplete{
      float: left;
      margin-right: 20px;
    }
  }
  .editProject{
    margin-top: 30px;
  }
  .addProjectManager{
    .addButton{
      margin-left: 150px;
      color: $optBlue;
      font-size: 14px;
      text-align: left;
      cursor: pointer;
      text-decoration: underline;
      margin-bottom: 50px;
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
  .el-select{
    width: 180px;
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
  .el-input{
    width: 570px;
    float: left;
  }
  .el-select{
    float: left;
    margin-right: 15px;
  }
  .el-select:last-child{
    margin-right: 0;
  }
  .red{
    color: #ff8585;
  }
  .el-button{
    padding: 12px 40px;
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
  .projTable .tableMain{
    border-left: none;
    border-right: none;
  }
</style>
