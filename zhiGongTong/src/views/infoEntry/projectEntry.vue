<template>
<div class="container projectDetail projectEntry"
>
  <common-tit :title="title" :type='true'></common-tit>
  <!-- <div class="setOptions">
   <el-autocomplete v-model="nameSearch" :fetch-suggestions="querySearchAsync" placeholder="按班组名称搜索" @select="handleSelect">
      <el-button slot="append" type="primary" icon="el-icon-search" @click="searchName"></el-button>
    </el-autocomplete>
    <span class="demonstration">班组选择:</span>
    <el-select v-model="groupValue" placeholder="所有班组" @change='changeGroupId'
               :loading="optionLoading"
               >
      <el-option
        v-for="(item,index) in groupOptions"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      >
      </el-option>
    </el-select>
  </div>-->
  <el-tabs v-model="activeName" type="card" @tab-click="handleClick" class="projTable entryTable projectEntryTable">
    <el-tab-pane v-for="(obj,index) in entryList" :key="index" >
      <span slot="label">{{obj.name}}</span>
      <el-table :data="obj.members"
                :class="{nobb:noBorderBottom}"
                v-loading="tableLoading"
                element-loading-text="正在加载"
      >
        <el-table-column align='left' prop="name" label="姓名" min-width="110">
          <template slot-scope="scope">
            <div class="imgBox"><img :src="scope.row.avatar" alt=""></div>
            <span @click="toView(scope.row)" class="projectName" v-if="scope.row.name">{{scope.row.name}}</span>
            <span @click="toView(scope.row)" class="projectName" v-else-if="scope.row.nickname">{{scope.row.nickname}}</span>
            <span @click="toView(scope.row)" class="projectName" v-else>{{scope.row.mobile}}</span>
          </template>
        </el-table-column>
        <el-table-column align='center' prop="mobile" label="联系电话"></el-table-column>
        <el-table-column align='center' prop="name" label="类型/工种">
          <template slot-scope="scope">
            <span v-if="obj.typeName=='admin'">项目管理员</span>
            <span v-else-if="obj.typeName=='temp'">
              <span v-if="scope.row.position==null">--</span>
              <span v-else-if="scope.row.position==0">其他</span>
              <span v-else>{{toHr(scope.row.positionName)}}</span>
            </span>
            <span v-else>{{toHr(scope.row.workGroupName)}}</span>
          </template>
        </el-table-column>
        <el-table-column align='center' label="身份证">
          <template slot-scope="scope">
            <span class="view" @click="jumpCert(scope.row.id)"><i class='zhiGong jumpCert'>&#xe63e;</i></span>
          </template>
        </el-table-column>
        <el-table-column align='center' label="录脸">
          <template slot-scope="scope" >
            <el-upload :action="faceUpload+'/'+scope.row.id"
                       :show-file-list="false"
                       :on-success="handleFaceSuccess"
                       :before-upload="beforeFaceUpload"
                       :filename="scope.row.id+'.jpg'"
                       :with-credentials='withCredentials'
                       class="edit view"
            ><i class="zhiGong">&#xe63e;</i>上传
            </el-upload>
            <span @click.prevent="toDel(scope.row)" class="view"><i class="zhiGong">&#xe635;</i>删除</span>
          </template>
        </el-table-column>
        <el-table-column align='center' label="查看">
          <template slot-scope="scope">
            <span @click.prevent="toView(scope.row)" class="view"><i class='zhiGong'>&#xe67c;</i>点击查看</span>
          </template>
        </el-table-column>
        <el-table-column align='center' label="备注">
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
    </el-tab-pane>
  </el-tabs>
  <el-dialog :data='dialogData' title="企业管理员详情" :visible.sync="dialogVisible" class="dialog">
    <div class="adminDetail">
      <div class="imgBox"><img :src="dialogData.avatar" alt=""></div>
      <div class='male'>
        <span v-if="dialogData.gender==1"><img :src="male" alt=""></span>
        <span v-else-if = "dialogData.gender == 2"><img :src="female" alt=""></span>
        <span v-else @click.prevent="toCert()"><img :src="nocert" alt=""></span>
      </div>
      <div class="item">
        <div class="fl labelName">姓名：</div>
        <div class="fr labelMain">{{toHr(dialogData.name)}}</div>

      </div>
      <div class="item">
        <div class="fl labelName">联系电话：</div>
        <div class="fr labelMain">{{dialogData.mobile}}</div>
      </div>
      <div class="item">
        <div class="fl labelName">身份证号码：</div>
        <div class="fr labelMain">
          <span v-if="dialogData.userDetail">{{toHide(dialogData.userDetail.idNumber)}}</span>
          <span v-else>--</span>
        </div>
      </div>
    </div>
  </el-dialog>
</div>
</template>

<script>
  import {projectApi,commonApi,uploadRoad} from "../../api";
  import commonTit from '@/components/common/commonTit'
  import male from '@/assets/img/male.png'
  import female from '@/assets/img/female.png'
  import noCertImg from '../../assets/img/no_cert_img.png'
    export default {
      inject:['reload'],
        name: "",
        components:{
          commonTit
        },
        data() {
            return {
              title:'',
              nameSearch:'',
              groupOptions:[],
              groupValue:'',
              projectId:'',
              optionLoading:true,
              noBorderBottom:false,
              tableLoading:true,
              entryList:[],
              activeName:'',
              dialogVisible:false,
              dialogData:{},
              male:male,
              female:female,
              nocert:noCertImg,
              withCredentials:true,
              uploadData:{
                genData:true,
              },

            }
        },
        methods: {
          toHr(val){
            if(val){
              return val
            }else{
              return '--'
            }
          },
          toHide(val){
            if(val){
              return val
            }else{
              return '--'
            }
          },
          handleFaceSuccess(res, file){
            let that = this
            console.log('handleAvatarSuccess',res);
            if(res.code==0){
              this.$message({
                type:'success',
                message:"上传成功！",
                duration:1200,
                onClose:function () {
                  that.reload()
                }
              })
            } else {
              this.$message({
                type:'error',
                message:res.msg
              })
            }

          },
          beforeFaceUpload(file){
            const isJPG = file.type === 'image/jpeg';
            const isPNG = file.type === 'image/png';
            const isLt5M = file.size / 1024 / 1024 < 5;
            if (!isJPG && !isPNG) {
              this.$message.error('上传图片必须是JPG/PNG 格式!');
              return false
            }
            if (!isLt5M) {
              this.$message.error('上传头像图片大小不能超过 5MB!');
              return false
            }
            return (isJPG || isPNG) &&  isLt5M;
            //this.c
          },
          handleSelect(item) {
            console.log(item);
            this.getData(this.nameSearch,true)
          },
          handleClick(val){
            //this.noBorderBottom = false
            console.log(val.paneName,this.noBorderBottom);
          },
          getData(){
            projectApi.projEnterGroup(this.projectId).then((result)=>{
              console.log('projEnterGroup',result.data);
              this.entryList = result.data;
              this.loadingClose()
            });
          },
          searchName(){
            this.getData(this.nameSearch,true)
          },
          loadingClose(){
            setTimeout(() => {
              this.noBorderBottom =true
              this.tableLoading = false;
            }, 500);
          },
          opitonsLoadingClose(){
            setTimeout(() => {
              this.optionLoading = false;
            }, 500);
          },
          uploadFace(val){
            console.log(val);
            //commonApi.uploadFace(imageData, val.id+'.jpg', true).then((result)=>{
            //  console.log(result.data);
            //  item.faced = 1;
            //  this.$f7.modal({
            //    text: $$('#modalTwo').html()
            //  });
            //  setTimeout(()=>{
            //    this.$f7.closeModal();
            //  }, 2000);
            //}, (error)=>{
            //  console.log('Upload error: ' + JSON.stringify(error));
            //  that.$f7.alert('人脸特征提取失败，请重新上传');
            //});
          },
          toDel(val){
            this.$confirm('此操作将删除该员工的录脸照片, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              commonApi.deleteFace(val.id).then((result)=>{
                console.log(result);
                val.faced = 0;
              })

            }).catch(() => {
              that.$message({
                type: 'info',
                message: '已取消删除'
              });
            });
          },
          toView(val){
            this.dialogVisible=true;
            this.dialogData =val;
            console.log(val);
          },
          jumpCert(val){
            console.log(val);
            this.$router.push({path:'/cert/editCert/'+val})
          }
        },
        beforeMount(){
          this.projectId =this.$route.params.projectId;
          projectApi.projectDetail(this.projectId).then((res)=>{
            console.log('projectDetail',res.data);
            this.title = res.data.name
          })
          this.getData();
          this.faceUpload = uploadRoad.uploadFace();
        },
      mounted(){

      }
    }
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../assets/sass/variable";
  .setOptions{
    width: 95%;
    margin: 0 auto;
    text-align: left;
    padding-top: 20px;
    padding-bottom: 30px;
  }
  .imgBox{
    width: 44px;
    height: 44px;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    overflow: hidden;
    vertical-align: middle;
    border: 1px solid #eee;
    margin-top: 6px;
    margin-right: 8px;
    margin-left: 22%;
    img{
      width: 44px;
      height: 44px;
    }
  }
  .projTable{
    border: none;
  }
  .red{
    color: #ff8585;
  }
  .view{
    cursor: pointer;
    color: $optBlue;
    i{
      font-size: 16px;
      margin-right: 4px;
    }
    .jumpCert{
      font-size: 22px;
      margin-right: 0;
    }
    &.edit{
      margin-right: 15px;
    }
  }
  .dialog{
    .imgBox{
      width: 160px;
      height: 160px;
      img{
        width: 160px;
        height: 160px;
      }
    }
    .male{
      margin-top: 10px;
    }
  }
  .projectEntryTable{
    margin-top: 25px;
  }
</style>
