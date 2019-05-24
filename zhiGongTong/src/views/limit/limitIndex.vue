<template>
    <div class="limitSetting container"
    v-loading="loadingLimit"
    element-loading-text='获取企业管理员中'>
      <common-tit :title="title" :type="true"></common-tit>
      <div class="opt">
        <!--<el-form  :inline="true" :model="searchForm" class="searchForm fl">
          <el-input v-model="searchForm.searchKey"></el-input>
          <el-button type="primary" @click.prevent="onSubmit">搜索</el-button>
        </el-form>-->

        <div class="tableTitle">
          <el-button type="primary" class="fr" @click.prevent="add('addForm')">添加企业管理员</el-button>
        </div>

      </div>
      <el-table :data="tableData" class='limitTable'>
        <el-table-column align='left' label="姓名" min-width="120" class="limitMain adminName"  >
          <template slot-scope="scope" >
            <div class="imgBox"><img :src="scope.row.avatar" alt=""></div>
            <span @click="view(scope.row)" class="projectName" v-if="scope.row.name">{{scope.row.name}}</span>
            <span @click="view(scope.row)" class="projectName" v-else-if="scope.row.nickname">{{scope.row.nickname}}</span>
            <span @click="view(scope.row)" class="projectName" v-else>{{scope.row.mobile}}</span>
          </template>
        </el-table-column>
        <el-table-column align='center'  label="性别"  class="limitMain">
          <template slot-scope="scope" >
            <div class="grid-content"><span v-if='scope.row.gender==1'>男</span><span v-else-if="scope.row.gender==2">女</span><span v-else>--</span></div>
          </template>
        </el-table-column>
        <el-table-column align='center' prop="mobile" label="联系电话" min-width="130"  class="limitMain"></el-table-column>

        <el-table-column align='center' label="查看" min-width="130"  class="limitMain">
          <template slot-scope="scope">
            <span @click.prevent="view(scope.row)" class="view"><i class='zhiGong'>&#xe67c;</i>点击查看</span>
          </template>
        </el-table-column>
        <el-table-column align='center' label="操作" min-width="130"  class="limitMain">
          <template slot-scope="scope">
            <span @click.prevent="del(scope.row.id)" class="view"><i class="zhiGong">&#xe635;</i>删除</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-if="showPagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="10"
        layout="total, prev, pager, next, jumper"
        :total="totalNum">
      </el-pagination>
      <el-dialog :data='dialogData' title="企业管理员详情" :visible.sync="dialogVisible">
        <div class="adminDetail">
          <div class="imgBox"><img :src="dialogData.avatar" alt=""></div>
          <div class='male'>
           <span v-if="dialogData.gender==1"><img :src="male" alt=""></span>
           <span v-else-if = "dialogData.gender == 2"><img :src="female" alt=""></span>
           <span v-else @click.prevent="toCert()"><img :src="nocert" alt=""></span>
          </div>
          <div class="item">
            <div class="fl labelName">姓名：</div>
            <div class="fr labelMain">{{dialogData.name}}</div>

          </div>
          <div class="item">
            <div class="fl labelName">联系电话：</div>
            <div class="fr labelMain">{{dialogData.mobile}}</div>
          </div>
          <div class="item">
            <div class="fl labelName">身份证号码：</div>
            <div class="fr labelMain">{{dialogData.idNumber}}</div>
          </div>
        </div>
      </el-dialog>
      <el-dialog title="添加企业管理员" :visible.sync="dialogFormVisible" class='dialogForm' :before-close="dialogClose">
        <el-form :model='addAdmin' ref="addForm" :rules="formRules">
         <!-- <el-form-item label="姓名" :label-width="formLabelWidth" prop="name">
            <el-input v-model="addAdmin.name" auto-complete="off"></el-input>
          </el-form-item>-->
          <el-form-item label="联系方式" :label-width="formLabelWidth" prop="mobile">
            <el-input v-model="addAdmin.mobile" type="number" maxLength="11" auto-complete="off"></el-input>
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
  import commonTit from '@/components/common/commonTit'
  import male from '@/assets/img/male.png'
  import female from '@/assets/img/female.png'
  import noCertImg from '../../assets/img/no_cert_img.png'
  import {companyApi,userApi} from "../../api";
  import {LocalCache} from "../../lib/utils";

  export default {
      name: "limitSetting",
      components:{
        commonTit
      },
      data() {
        /*var validateName =(rule,value,callback)=>{
          if(!value){
            callback(new Error('请输入姓名'))
          } else {
            callback()
          }
        }*/
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

          return {
            title:"企业管理员列表",
            searchForm:{
              searchKey:''
            },
            tableData:[{
              name:'minimo',
              avatar:'../../assets/img/placeholder.jpg',
              male:'男',
              mobile:'138745115121'
            },],
            dialogData:{
              avatar:'',
              male:'',
              mobile:'',
              idNumber:''
            },
            male:male,
            female:female,
            nocert:noCertImg,
            dialogVisible: false,
            dialogFormVisible:false,
            addAdmin:{
              mobile:''
            },
            formLabelWidth:"30%",
            formRules: {
             /* name:[{trigger:'blur',validator:validateName}],*/
              mobile:[{trigger: 'blur', validator: validateMobile }]
            },
            totalNum:0,
            currentPage:1,
            loadingLimit:false,
            loadingSave:false,
            showPagination:false,
          }
      },
      methods: {
        onSubmit() {
          console.log('submit!');
        },
        view(data){
          this.dialogVisible=true;
          this.dialogData =data;
        },
        edit(index){

        },
        toCert(){

        },
        handleSizeChange(val) {
          console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
          console.log(`当前页: ${val}`);
          this.getManagerList(val,10)
        },
        del(val){
          let that =this
          if(this.tableData.length==1){
            this.$message({
              type: 'warn',
              message: '不能把企业管理员全部删除!'
            });
          }else{
            this.$confirm('此操作将删除该管理员, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              companyApi.delCompanyManager(val).then(()=>{
                console.log('删除了企业管理员');
                that.tableData.splice(that.tableData.findIndex(v => v.id === val),1);
                that.$message({
                  type: 'success',
                  message: '删除成功!'
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
        add(formName){
          this.dialogFormVisible=true;
        },
        dialogClose(done){
          this.$refs['addForm'].resetFields();
          done()
        },
        saveAndContinue(type){
          this.save(type)
        },
        saveOnly(type){
          this.save(type)
        },
        save(type){
          let that = this
          this.$refs.addForm.validate((valid) => {
            //loginItem: window.getuiCID
            console.log(that.addAdmin.mobile);
            if (valid) {
              this.loadingSave = true;
              let  companyId =LocalCache.get('companyInfo').companyId
              userApi.searchUser(companyId,that.addAdmin.mobile).then((result)=>{
                let resData=result.data;
                console.log(resData);
                companyApi.addCompanyManager(resData.list[0].id).then((result)=>{
                  console.log('addCompanyManager',result);
                  if(result.data == null){
                    this.$message({
                      type: 'warn',
                      message: result.msg
                    });
                  }else{
                    this.$message({
                      type: 'success',
                      message: result.msg
                    });
                    //this.addAdmin.mobile = ''
                    that.getManagerList(1,10)
                    that.loadingSaveClose()
                    if(type == 'only'){
                      that.dialogFormVisible = false
                    }
                    this.$refs['addForm'].resetFields();
                  }
                }).catch((res)=>{
                  this.$message({
                    type:'error',
                    message:res.msg
                  })
                  that.loadingSaveClose()
                })
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
        loadingLimitClose(){
          setTimeout(() => {
            this.loadingLimit = false;
          }, 500);
        },
        loadingSaveClose(){
          setTimeout(() => {
            this.loadingSave = false;
          }, 500);
        },
        getManagerList(page,pageSize){
          companyApi.companyManagerList(page,pageSize).then((result)=>{
            console.log('companyManagerList',result.data,result);
            this.tableData = result.data;
            let pagination = result.pagination
            this.totalNum  = pagination.totalItems
            this.loadingLimitClose()
            if(pagination.totalPages<=1){
              this.showPagination = false
            }else{
              this.showPagination = true
            }
          }).catch((res)=>{
            this.loadingLimitClose()
            this.$message({
              message:res.msg,
              type:'error'
            })
          })
        }
      },
      mounted(){
        this.loadingLimit=true
        this.userId = LocalCache.get('userInfo').id
        this.getManagerList(1,10);
      }
    }
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../assets/sass/variable";
  .opt{
    width: 90%;
    margin: 0 auto;
    padding-top: 30px;
    padding-bottom: 30px;
    overflow: hidden;
  }
  .searchForm{
    .el-input{
      width: 200px;
      margin-right: -8px;
      border-right: none;
    }
  }
  .limitTable{
    line-height: 60px;
    width: 90%;
    margin: 0 auto;
    border-left: $bd-c;
    border-top: $bd-c;
    border-right: $bd-c;
    border-bottom: none;
    .th{
      background: #EEF1F6;
      color: #333333;
      font-size: 16px;
    }
    .grid-content{
      height: 64px;
      line-height: 64px;
    }
    .name{
      padding-left: 25%;
      .nameInner{
        float: left;
      }
    }
    .imgBox{
      width: 44px;
      height: 44px;
      margin-right: 5px;
      -webkit-border-radius: 50%;
      -moz-border-radius: 50%;
      border-radius: 50%;
      overflow: hidden;
      vertical-align: middle;
      border: 1px solid #eee;
      display: inline-block;
      img{
        width: 44px;
        height: 44px;
      }
    }
    .imgBox,.projectName{
      cursor: pointer;
    }
    .imgBox{
      margin-left: 15%;
    }
    .view{
      cursor: pointer;
      color: $optBlue;
      i{
        font-size: 14px;
        margin-right: 4px;
      }
    }
    .limitMain{
      border-bottom: $bd-c;
      font-size: 14px;
      //.grid-content{
      //  height: 64px;
      //  line-height: 64px;
      //}
      //.name{
      //  padding-left: 25%;
      //  .nameInner{
      //    float: left;
      //  }
      //}
      //.imgBox{
      //  width: 44px;
      //  height: 44px;
      //  margin-right: 10px;
      //  margin-top: 9px;
      //  -webkit-border-radius: 50%;
      //  -moz-border-radius: 50%;
      //  border-radius: 50%;
      //  overflow: hidden;
      //  vertical-align: middle;
      //  border: 1px solid #eee;
      //  float: left;
      //  img{
      //    width: 44px;
      //    height: 44px;
      //  }
      //}
      //.view{
      //  cursor: pointer;
      //  color: $optBlue;
      //  i{
      //    font-size: 14px;
      //    margin-right: 4px;
      //  }
      //}
    }
    .edit{
      margin-right: 20px;
    }
  }

  .dialogForm{
    .el-input{
      width: 60%;
      float: left;
    }
  }
  .limitSetting.container{
    padding-bottom: 60px;
  }
  .cell{
    padding: 0;
  }
  .adminName{

  }
</style>
