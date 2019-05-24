<template>
<div id="index" class='container'>
  <data-list6 :dataList6='dataList6' :lastDataList="lastDataList"></data-list6>
  <el-row class="charts">
    <el-col :span='12'>
      <div v-if="companyRole==2" class="h3rem">
        <span class="demonstration">项目选择:</span>
        <el-select v-model="projectValue" placeholder="所有项目" @change='changeProjectId'>
          <el-option
            v-for="(item,index) in options"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div id='indexBar':class={h25rem:projectMode}
        v-loading="barLoading"
           element-loading-text="正在加载"
      ></div>
    </el-col>
    <el-col :span='12' >
      <div id='indexPie'></div>
    </el-col>
    <el-col :span="12" v-if="!hasPieData" class='pieDataNull'>
      <div class="pieNoData">
        <div class="pieTitle">信息录入状况</div>
        <div class="noDataPies">
          <div class="pieItem pieFirst"></div>
          <div class="pieItem pieSecond"></div>
        </div>
      </div>
    </el-col>
  </el-row>
  <!--暂时屏蔽月考勤统计-->
  <!--
  <div class="lineThrough"></div>
  <chart-attend :type="1"></chart-attend>
  -->
  <total-table ></total-table>
  <div class='setFormOuter' :class="{visible:visible}">
    <div class="setFormTitle">
      <span>欢迎使用智工通企业管理平台</span>
      <img :src="smile" alt="" class="fl">
      <div class="close fr" @click.prevent='close()'>
        <img :src="closeBtn" alt="">
      </div>
    </div>
    <div class="formTitle">智工通 —— 专注建筑业考勤及劳动力管理</div>
    <div class="formOut">
      <el-form :model='setForm' class="setForm" ref="setForm"  :rules='setRules'>
        <div class="tip">请设置密码，方便您下次进行账号密码登录</div>
        <el-form-item prop="mobile">
          <el-input v-model="setForm.mobile" auto-complete="off" type="number" placeholder="请输入手机号" :disabled='true'>
          </el-input>
        </el-form-item>
        <el-form-item prop="password" class="password pwdChangeView">
          <el-input v-model="setForm.password" auto-complete="on" :type="passwordType" placeholder="请输入新密码" @keyup.enter.native="submit()">
          </el-input>
          <div class='changeType' @click.prevent="changeType"  alt="">
            <img v-if="eyeStatus==1" :src="eyeOpen" alt="">
            <img v-else :src="eyeClose" alt=""></div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="info" @click.prevent="noVisible()" class="fl">不再提示</el-button>
        <el-button type="primary" @click.prevent="submit()" class="fr">确认</el-button>
      </div>
      <div class="tip-bottom">温馨提示：可在右上角“设置”中进行登录密码设置</div>
    </div>

  </div>
</div>
</template>

<script>
  import dataList6 from '@/components/dataList/dataList6'
  import chartPies from '@/components/charts/chartPies'
  import chartAttend from '@/components/charts/chartAttend'
  import totalTable from '@/components/table/totalTable'
  import closeBtn from '../../assets/img/close.png'
  import smile from '../../assets/img/smile.png'
  import eyeClose from '../../assets/img/eye_close.png'
  import eyeOpen from '../../assets/img/eye_open.png'
  import { userApi,statisticalSummaryApi,projectApi } from '../../api'
  import { LocalCache } from '../../lib/utils'
  import { getToday,getYesterday  } from '../../lib/getDate'
  import { drawBar,drawPies} from "../../lib/drawCharts";
    export default {
        inject:['reload'],
        name: "",
        data() {
          var validateMobile = (rule,value,callback)=>{
            const reg= /^1[2-9]\d{9}$/;
            if(!value){
              callback(new Error('请输入手机号'))
            } else if (value.toString().length != 11) {
              callback(new Error('电话号码必须是11位'));
            } else if (!reg.test(value)){
              callback(new Error('请输入正确格式的手机号'))
            } else {
              callback()
            }
          }
          var validateVeri   = (rule,value,callback)=>{

            if(!value){
              callback(new Error('请输入密码'))
            } else if (value.match(/[\u4e00-\u9fa5]/)){
              callback(new Error('不能输入中文字！'))
            } else if (value.length<6){
              callback(new Error('密码长度不能低于6位！'))
            } else {
              callback()
            }
          }
            return {
              dataList6:{},
              lastDataList:{},
              companyId:'',
              companyRole:'',
              projectId:'',
              totalList:{
                totalUser:'--',
                attended:'--',
                idNumberNum:'--',
                classNum:'--',
                execptionAttend:'--',
                unIdNumber:'--',
                machine:'--',
                attendPercent:'--',
                faced:'--',
                averageTime:'--',
                exceptionPercent:'--',
                unfaced:'--'
              },
              yerData:[],
              pieData:[],
              setRules: {
                mobile: [{ trigger: 'blur', validator: validateMobile }],
                password:[{ trigger:'blur',validator:validateVeri }]
              },
              setForm:{
                mobile:''
              },
              visible:true,
              closeBtn:closeBtn,
              eyeOpen:eyeOpen,
              eyeClose:eyeClose,
              smile:smile,
              passwordType:'password',
              eyeSrc:'../../assets/img/eye_open.png',
              eyeStatus:1,
              today:'',
              yesterday:'',
              withIDCount:'',
              withoutIDCount:'',
              withFaceCount:'',
              withoutFaceCount:'',
              xAxisData:[],
              noAttend:[],
              lackAttend:[],
              normalAttend:[],
              hasPieData:true,
              projectMode:false,
              projectValue:'',
              options:[],
              barLoading:true,

            }
        },
      components:{
        dataList6,chartPies,totalTable,chartAttend
      },
      methods: {
        noVisible(){
          LocalCache.set('hasPassword','-1')
          this.visible = false
        },
        close(){
          this.visible = false;
        },
        changeType(){
          if(this.eyeStatus===2){
            this.eyeStatus =1
            this.passwordType="password"
          }else{
            this.eyeStatus =2
            this.passwordType="text"
          }
          console.log(this.eyeStatus,this.passwordType);
        },
        submit(){
          this.$refs.setForm.validate((valid) => {
            //loginItem: window.getuiCID
            if (valid) {
              userApi.setPasssword(
                this.setForm.password,
              ).then((result)=>{
                LocalCache.set('hasPassword',true)
                this.visible = false
                //this.$router.push({path:'/index/'})
              })
            } else {
              this.$message.error('提交参数错误！')
              return false;
            }
          });

        },
        getDataList6(){
          this.yesterday = getYesterday()
          this.today = getToday()
          let that = this
          if(this.companyRole == 1){
            statisticalSummaryApi.summary(1).then((result)=>{
              this.dataList6 = result.data;
              console.log('dataList6',this.dataList6);
              this.withIDCount      = result.data.withIDCount
              this.withoutIDCount   = result.data.withoutIDCount
              this.withFaceCount    = result.data.withFaceCount
              this.withoutFaceCount = result.data.withoutFaceCount
              if(
                (this.withIDCount == 0 || this.withIDCount == null )&&
                (this.withoutIDCount == 0 || this.withoutIDCount == null )&&
                (this.withoutFaceCount == 0 || this.withoutFaceCount == null )&&
                (this.withFaceCount == 0 || this.withFaceCount == null )&&
                (this.companyRole != 3 || this.companyRole != 0 )
              ){
                this.hasPieData = false
              } else {
                this.hasPieData = true
              }
              console.log(this.withIDCount, this.withoutIDCount, this.withFaceCount, this.withoutFaceCount,this.hasPieData);
              let w =document.body.clientWidth;
              if(w<1366){
                this.lineLength=10
              }else{
                this.lineLength=30
              }
              drawPies("indexPie",this.withIDCount,this.withoutIDCount,this.withFaceCount,this.withoutFaceCount,this.lineLength)
            }).catch((res)=>{
              console.log(res);
            });
            statisticalSummaryApi.dayAttend(1, this.today).then((result)=>{
              console.log('totalAttendContrast',result.data.totalWorkGroupStat);
              that.xAxisData = [];
              for(var key in  result.data.totalAttendContrast){
                that.xAxisData.push(key)
                that.normalAttend.push(result.data.totalAttendContrast[key].normalAttend);
                that.noAttend.push(result.data.totalAttendContrast[key].noAttend);
                that.lackAttend.push(result.data.totalAttendContrast[key].lackAttend);
              }
              drawBar("indexBar",this.normalAttend, this.lackAttend, this.noAttend, that.xAxisData)
              //console.log('drawBar',this.normalAttend,this.lackAttend,this.noAttend);
              setTimeout(() => {
                this.barLoading = false;
              }, 500);
            }).catch((res)=>{
              console.log(res);
            });
            statisticalSummaryApi.dayAttend(1, this.yesterday).then((result)=>{
              that.lastDataList = result.data;
            }).catch((res)=>{
              console.log(res.data);
            });
          }else if(this.companyRole == 2){
            console.log(1000000);
            statisticalSummaryApi.projSummary(1).then((result)=>{
              console.log('项目管理首页');
              console.log('dataList6',result.data);
              this.dataList6 = result.data;
              console.log('dataList6',this.dataList6);
              this.withIDCount      = result.data.withIDCount
              this.withoutIDCount   = result.data.withoutIDCount
              this.withFaceCount    = result.data.withFaceCount
              this.withoutFaceCount = result.data.withoutFaceCount
              if(
                (this.withIDCount == 0 || this.withIDCount == null )&&
                (this.withoutIDCount == 0 || this.withoutIDCount == null )&&
                (this.withoutFaceCount == 0 || this.withoutFaceCount == null )&&
                (this.withFaceCount == 0 || this.withFaceCount == null )&&
                (this.companyRole != 3 || this.companyRole != 0 )
              ){
                this.hasPieData = false
              } else {
                this.hasPieData = true
              }
              console.log(this.withIDCount, this.withoutIDCount, this.withFaceCount, this.withoutFaceCount,this.hasPieData);
              let w =document.body.clientWidth;
              if(w<1366){
                this.lineLength=10
              }else{
                this.lineLength=30
              }
              drawPies("indexPie",this.withIDCount,this.withoutIDCount,this.withFaceCount,this.withoutFaceCount,this.lineLength)
            });
            that.drawProjBar(this.projectValue);
            statisticalSummaryApi.oneProjDayAttend(1, this.yesterday, this.projectId).then((result)=>{
              this.lastDataList = result.data;
              console.log('oneProjDayAttend',result.data);
            })
          }else{
            drawBar("indexBar",[0,0], [0,0], [0,0], [this.today,this.yesterday])
          }


          //console.log('xAxisData',this.xAxisData);



        },
        drawProjBar(projectId){
          let that = this
          statisticalSummaryApi.oneProjDayAttend(1,this.today,projectId).then((result)=>{
            //console.log('oneProjDayAttend',result.data.totalAttendContrast);
            let normalAttend = [],
                noAttend = [],
                lackAttend = [];
            that.xAxisData = [];
            for(var key in  result.data.totalAttendContrast){
              console.log(key);
              that.xAxisData.push(key)
              normalAttend.push(result.data.totalAttendContrast[key].normalAttend);
              noAttend.push(result.data.totalAttendContrast[key].noAttend);
              lackAttend.push(result.data.totalAttendContrast[key].lackAttend);
            }
            drawBar('indexBar',normalAttend, lackAttend, noAttend, that.xAxisData)
          }).catch((res)=>{
            console.log(res.data);
          });
        },
        changeProjectId(){
          this.drawProjBar(this.projectValue)
        },
      },
      beforeMount(){
        let hasPasswordValue = LocalCache.get('hasPassword');
        if(hasPasswordValue!=0){
          this.visible = false;
        }
        let userInfo = LocalCache.get('userInfo');
        this.setForm.mobile = userInfo.mobile;
        let companyInfo = LocalCache.get('companyInfo')
        this.companyInfo = LocalCache.get('companyInfo')
        this.companyId = companyInfo.companyId
        this.companyRole = companyInfo.companyRole
        this.projectId = companyInfo.projectId
        this.today = getToday()
        this.yesterday = getYesterday()
      },
      mounted(){
        if(this.companyId != 0){
          this.getDataList6();
        }else{
          this.barLoading = false
          drawBar("indexBar",['0','0'], ['0','0'], ['0','0'], [this.today,this.yesterday])
          this.hasPieData = false
        }
        if(this.companyRole==2){
          this.projectMode=true
          projectApi.projerProjList().then((result)=>{
            console.log('projerProjList',result);
            this.options = result.data;
            if(this.options!=0){
              this.projectValue = result.data[0].id
              this.drawProjBar(this.projectValue)
            }
          }).catch((result)=>{
            this.$message({
              type:'error',
              message:result.msg
            })
          })
        }else if(this.companyRole==3){
          console.log('非管理人员登录');
          this.barLoading = false
          drawBar("indexBar",['0','0'], ['0','0'], ['0','0'], [this.today,this.yesterday])
          this.hasPieData = false
        }
        console.log('this.projectMode',this.projectMode);
        this.projectId = this.companyInfo.projectId
        this.today = getToday()
        this.yesterday = getYesterday()
        this.lineLength=30

      }
    }
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../assets/sass/variable";
  .charts{
    margin-top: 18px;
  }
  #index{
    position: relative;
  }
  .setFormOuter{
    display: none;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: #ffffff;
    z-index: 2001;
    &.visible{
      display: block;
    }
    .setFormTitle{
      padding-left: 50px;
      font-size: 20px;
      line-height: 4;
      overflow: hidden;
      span{
        float: left;
        color: $c6;
        display: block;
      }
      img.fl{
        margin-left: 6px;
        margin-top: 27px;
      }
      .close{
        margin-top: 10px;
        margin-right: 10px;
        width: 34px;
        height: 34px;
        line-height: 1;
        img{
          width: 34px;
          height: 34px;

        }
      }
    }
    .formTitle{
      font-size: 18px;
      line-height: 56px;
      text-align: center;
      padding-top: 120px;
    }
  }
  .formOut{
    width: 600px;
    margin: 0 auto;
    border: 10px solid rgba(106,106,106,0.1);
    .tip-bottom{
      font-size: 12px;
      color: $c9;
      line-height: 5;
    }
  }
  .setForm{
    width: 600px;
    .el-input{
      width: 60%;
    }
    .tip{
      font-size: 16px;
      line-height: 5;
    }
  }
  .dialog-footer{
    width: 60%;
    margin: 0 auto;
    overflow: hidden;
    .fl{
      width: 45%;
    }
    .fr{
      width: 45%;
    }
  }
  .el-form-item__error{
     left: 20%;
   }
  .password .changeType{
    right: 20%;
  }
  .h3rem{
    height: 3rem;
    text-align: left;
    padding-left: 30px;
  }
</style>
