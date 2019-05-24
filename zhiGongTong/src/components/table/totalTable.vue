<template>
  <div id="totalTable">
    <common-tit :title='title' :type="false" :jumpShow="true" :projectId="projectValue"></common-tit>

    <div class="searchOption">
      <div class="block">
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
      <div class="block">
        <span class="demonstration">请选择日期:</span>
        <el-date-picker v-model="dateValue" align="right" type="date" value-format="yyyy-MM-dd" :picker-options="pickerOptions" @change='changeDateValue' :clearable="clearable">
        </el-date-picker>
      </div>
    </div>
    <div id="tableInner"
      v-loading='tableLoading'
      element-loading-text="正在加载"
    >
      <el-row >
      <el-col :span='8'>
        <div class='colItem fl'>当前人数</div>
        <div class='colItem fr'>{{toZero(totalList.currentlyUsers)}}<span class="unit">人</span></div>
      </el-col>
      <el-col :span='8'>
        <div class='colItem fl'>已考勤</div>
        <div class='colItem fr'>{{toZero(totalList.attendCount)}}<span class="unit">人</span></div>
      </el-col>
      <el-col :span='8'>
        <div class='colItem fl'>已录身份证</div>
        <div class='colItem fr'>{{toZero(totalList.withIDCount)}}<span class="unit">人</span></div>
      </el-col>
    </el-row>
      <el-row >
        <el-col :span='8'>
          <div class='colItem fl'>总人数</div>
          <div class='colItem fr'>{{toZero(totalList.totalUsers)}}<span class="unit">个</span></div>
        </el-col>
        <el-col :span='8'>
          <div class='colItem fl'>异常考勤</div>
          <div class='colItem fr'>{{toZero(totalList.attendException)}}<span class="unit">人</span></div>
        </el-col>
        <el-col :span='8'>
          <div class='colItem fl'>未录身份证</div>
          <div class='colItem fr'>{{toZero(totalList.withoutIDCount)}}<span class="unit">人</span></div>
        </el-col>
      </el-row>
      <el-row >
        <el-col :span='8'>
          <div class='colItem fl'>班组数</div>
          <div class='colItem fr'>{{toZero(totalList.groupCount)}}<span class="unit">人</span></div>
        </el-col>
        <el-col :span='8'>
          <div class='colItem fl'>考勤率</div>
          <div class='colItem fr'>{{toPercent(totalList.attendRate)}}<span class="unit">%</span></div>
        </el-col>
        <el-col :span='8'>
          <div class='colItem fl'>已录人脸</div>
          <div class='colItem fr'>{{toZero(totalList.withFaceCount)}}<span class="unit">人</span></div>
        </el-col>
      </el-row>
      <el-row >
        <el-col :span='8'>
          <div class='colItem fl'>平均工时</div>
          <div class='colItem fr'>{{toZero(totalList.averDuration)}}<span class="unit">小时</span></div>
        </el-col>
        <el-col :span='8'>
          <div class='colItem fl'>异常考勤率</div>
          <div class='colItem fr'>{{toPercent(totalList.exceptionRate)}}<span class="unit">%</span></div>
        </el-col>
        <el-col :span='8'>
          <div class='colItem fl'>未录人脸</div>
          <div class='colItem fr'>{{toZero(totalList.withoutFaceCount)}}<span class="unit">人</span></div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import commonTit from '@/components/common/commonTit'
  import { projectApi,statisticalSummaryApi } from "../../api";
  import { getToday,getYesterday } from '../../lib/getDate'
  import { LocalCache } from "../../lib/utils";

  export default {
      name: "information",
      props:[],
      data() {
        return {
          title:'项目考勤',
          projectValue:"",
          dateValue:'',
          tableLoading:true,
          options: [
          ],
          totalList:{

          },
          projNameList:[],
          companyId:'',
          machines:'',
          pickerOptions: {
            disabledDate(time) {
              return time.getTime() > Date.now();
            },
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
          clearable:false,
        }
      },
      components:{
        commonTit
      },
      methods:{
        toZero(value) {
          if(value)
            return value;
          else
            return 0;
        },
        toPercent(val){
          if(!val){
            return 0
          }else{
            return Math.round( val*100 )
          }
        },
        changeProjectId(){
          if(this.companyId != 0){
            this.tableLoading = true
            if(this.projectValue==0){
              this.defaultData(this.dateValue);
            }else{
              this.oneProjectData(this.dateValue,this.projectValue);
            }
          }
        },
        changeDateValue(){
          if(this.companyId != 0){
            this.tableLoading = true
            console.log(this.dateValue);
            if(this.dateValue ==null){
              this.dateValue = getToday();
            }
            if(this.projectValue==0){
              this.defaultData(this.dateValue);
            }else{
              this.oneProjectData(this.dateValue,this.projectValue);
            }
          }
        },
        oneProjectData(dateValue,projectId){
          statisticalSummaryApi.oneProjDayAttend(1,dateValue,projectId).then((res)=>{
            this.totalList = res.data;
            this.machines = this.toZero(res.data.unbindMachineCount)+this.toZero(res.data.usedMachine)+this.toZero(res.data.usingMachineCount)
            console.log('dayAttend',res.data);
            setTimeout(() => {
              this.tableLoading = false;
            }, 500);
          })
        }
      },
      mounted(){
        this.companyId   = LocalCache.get('companyInfo').companyId;
        this.companyRole = LocalCache.get('companyInfo').companyRole;
        if(this.companyId!=0){
          if(this.companyRole==1){
            //page,pageSize,status, name, provinceId, cityId, districtId, order, withDetail
            projectApi.allProjectList(1,1000,'','','','','','',false).then((result)=>{
              console.log('allProjectList',result.data);
              this.options = result.data;
              if(this.options==0){
                this.tableLoading = false
              }else{
                this.projectValue = result.data[0].id
                this.dateValue = getToday();
                this.oneProjectData(this.dateValue,this.projectValue)
              }

            }).catch((res)=>{
              this.$message({
                type:'error',
                message:res.msg
              })
            });
          }else if (this.companyRole==2){
            projectApi.projerProjList(1,1000,'','','','',false).then((result)=>{
              console.log('projerProjList',result.data);
              this.options = result.data;
              if(this.options==0){
                this.tableLoading = false
              }else{
                this.projectValue = result.data[0].id
                this.dateValue = getToday();
                this.oneProjectData(this.dateValue,this.projectValue)
              }
            }).catch((result)=>{
              this.$message({
                type:'error',
                message:result.msg
              })
            })
          }else if(this.companyRole == 3){
            setTimeout(() => {
              this.tableLoading = false;
            }, 500);
          }
        }else{
          setTimeout(() => {
            this.tableLoading = false;
          }, 500);
        }

      }
    }
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../assets/sass/variable";
  #totalTable{
    margin: 10px 10px 20px;
    border: $bd-d;
  }
  #tableInner{
    margin: 19px 19px 19px;
    .el-col{
      font-size: 16px;
      line-height: 60px;
      border-right: $bd-d;
      padding-left: 5%;
      padding-right: 5%;
      &:last-child{
        border-right: none;
      }
      .colItem{
        .unit{
          width: 60px;
          text-align: right;
          float: right;
        }
      }
    }
  }
  .searchOption{
    width: 90%;
    margin: 0 auto;
    overflow: hidden;
    padding-top: 30px;
    .block,.el-autocomplete{
      float: left;
      margin-right: 20px;
    }
  }
</style>
