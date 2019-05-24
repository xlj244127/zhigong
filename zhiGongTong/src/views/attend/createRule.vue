<template>
    <div class="createRule container">
      <common-tit :title="title" :type="true"></common-tit>
      <el-form :model="createRuleForm" label-width="25%" ref="createRuleForm" :rules='formRules'>
        <div class='w50p fl'>
          <el-form-item   label="考勤规则名称" prop="dutyruleName">
            <el-input v-model="createRuleForm.dutyruleName"></el-input>
          </el-form-item>
          <el-form-item   label="考勤日期" >
            <div class="checkAll"><el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">每天</el-checkbox></div>
            <el-checkbox-group v-model="createRuleForm.date"  class="fl" :min="1" :max="7"><!---->
              <el-checkbox v-for="(item,index) in dateLabelList" :label="dateCodeList[index]" :key="item" name="date" @change="handleCheckedChange">{{item}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item   label="考勤时间"  class="formTime clearFix">
            <div class="timeBox">
              <div class="timeItem" v-for="(item,index) in timeList" :key="item.index">
                <div class="timeRange">{{item.title}}{{item.index+1}} <span class="fr zhiGong" @click="delTimeRange(item.index)">&#xe635;</span></div>
                <el-time-picker
                  is-range
                  v-model="item.timeRange"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  placeholder="选择时间范围"
                  value-format="HH:mm"
                >
                </el-time-picker>
              </div>
            </div>
            <el-button @click="addTimeRange" type="primary" class="addTimeRange">添加时间段</el-button>
          </el-form-item>
          <el-form-item   label="法定节假日自动排休" >
            <el-switch
              v-model="createRuleForm.vacation"
              active-color="#409EFF"
              inactive-color="#C0CCDA"
              :active-value="1"
              :inactive-value = "0"
            >
            </el-switch>
          </el-form-item>
        </div>
        <div class="w50p fr">
        <div class="tit">适用范围</div>
          <div class="tips">
            未添加班组的项目，无法设置考勤规则<br>请先到项目管理中添加班组及班组人员
          </div>
          <el-tabs type="border-card" @tab-click="tabsClick" class="rangeTabs">
            <el-checkbox v-model="departmentCheck" @change="changeCheck" ref="tab0" class="check" ></el-checkbox>
            <el-checkbox v-model="projectCheck"  @change="changeCheck" ref="tab1" class="check check2"></el-checkbox>
            <el-tab-pane>
              <span  slot="label">
                部门
              </span>
              <el-tree
                :data="departmentTreeList"
                show-checkbox
                node-key="user_id"
                default-expand-all
                :expand-on-click-node="false"
                :props="defaultProps"
                ref="departmentTree"
                :default-checked-keys="departmentChecked"
                :render-content="renderContent">
              </el-tree>
            </el-tab-pane>
            <el-tab-pane>
              <span slot="label">
                 项目
              </span>
              <div class="projectPart">
                <div class="partItem">
                  <span class="fl">地区</span>
                  <el-select v-model="proviceVal" placeholder="请选择省份" @change='changeProvice'>
                    <el-option
                      v-for="(item,index) in proviceOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                  <el-select v-model="cityVal" placeholder="请选择城市" @change='changeCity' :disabled="cityDisabled" :loading="cityLoading">
                    <el-option
                      v-for="(item,index) in cityOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </div>
                <div class="partItem">
                  <span class="fl">项目</span>
                  <el-tree
                    :data="projectTreeList"
                    show-checkbox
                    node-key="project_id_work_group_id"
                    :props="positionProps"
                    :render-content="renderContentP"
                    ref="projectTree"
                    :default-checked-keys="projectChecked"
                  >
<!-- -->
                  </el-tree>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-form>
      <div class="button">
        <el-button type="primary" @click="save()" :loading="saveLoading">保 存</el-button>
      </div>
    </div>
</template>

<script>
  import commonTit from '@/components/common/commonTit'
  const dateCodeList=["2","3","4","5","6","7","1"],dateLabelList=["周一","周二","周三","周四","周五","周六","周日"];
  import { userApi,dutyApi } from "../../api";
  import { LocalCache } from "../../lib/utils";
  export default {
        name: "createRule",
      components:{
        commonTit
      },
        data() {
          var validateName =(rule,value,callback)=>{
            if(!value){
              callback(new Error('请输入考勤规则名称!'))
            } else {
              callback()
            }
          }
          var validateDate =(rule,value,callback)=>{
            //console.log('validateName',value);
            if(value.length==0){
              callback(new Error('请选择考勤日期!'))
            } else {
              callback()
            }
          }
          var validateTime =(rule,value,callback)=>{
            //console.log('validateName',value,this.createRuleForm.time);
            if(value.length==0){
              callback(new Error('请选择考勤日期!'))
            } else {
              callback()
            }
          }
            return {
              title:'创建考勤规则',
              formRules: {
                name:[{trigger: 'blur', validator: validateName }],
                date:[{trigger: 'change', validator: validateDate }],
                time:[{trigger: 'change', validator: validateTime }],
              },
              createRuleForm:{
                dutyruleName:'',
                date:[],
                time:[
                  {
                    timeRange:""
                  }
                ],
                vacation:0,
              },
              companyId:"",
              timeList:[
                {time:'',title:'时间段',index:0},
              ],
              dateLabelList:dateLabelList,
              dateCodeList:dateCodeList,
              checkAll: false,
              isIndeterminate: false,
              timeIndex:0,
              projectCheck:false,
              departmentCheck:false,
              tabIndex:0,
              dutyRange:[],
              tab0:{},
              tab1:{},
              departmentTreeList: [],
              projectTreeList: [],
              defaultProps: {
                children: 'list',
                label:"name" ,
              },
              positionProps:{
                label:"name" ,
                children: "list",
              },
              proviceOptions:[],
              cityOptions:[],
              proviceVal:'',
              cityVal:'',
              cityDisabled:true,
              cityLoading:true,
              dutyList:[],
              dutyRuleId:'',
              saveLoading:false,
              projectChecked:[],
              departmentChecked:[]
            }
        },
        methods: {
          handleCheckAllChange(val) {
            this.createRuleForm.date = val ? dateCodeList : [];
            this.isIndeterminate = false;
          },
          saveLoadingClose(){
            setTimeout(() => {
              this.saveLoading = false;
            }, 500);
          },
          handleCheckedChange(value) {
            let checkedCount = this.createRuleForm.date.length;
            console.log(value,this.createRuleForm.date);
            this.checkAll = checkedCount === this.dateCodeList.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.dateCodeList.length;
          },
          addTimeRange(){
            this.timeIndex++
            this.timeList.push({time:'',title:'时间段',index:this.timeIndex})
          },
          delTimeRange(index){
            let chosenIndex = index
            this.timeList=this.timeList.filter(function (item) {
              //console.log(item,item.index,chosenIndex);
              return item.index != chosenIndex
            })
          },
          changeProvice(){
            this.cityDisabled = true;
            var specialCity=[1,4,7,23,29,32,34]
            let specialCityIndexOf = specialCity.indexOf(this.proviceVal)
            if(this.proviceVal!=null){
              let allCity = [{
                name:'全部地区',
                id:null
              }]
              userApi.addressCityList(this.proviceVal).then((res)=>{
                if(specialCityIndexOf==-1){
                  this.cityOptions = [...allCity,...res.data.list];
                }else{
                  this.cityOptions =res.data.list;
                }
                this.cityVal = this.cityOptions[0].id
                this.cityLoading = false;
                setTimeout(() => {
                  this.cityDisabled = false;
                }, 200);
              }).catch((res)=>{
                this.$message({
                  type:'error',
                  message:res.msg
                })
                this.cityLoading = false;
                this.cityDisabled = false;
              })
            }else{
              this.cityLoading = false;
              this.cityVal = '';
            }
          },
          changeCity(){
          },
          tabsClick(val){
            this.tabIndex = val.paneName
            if(val.paneName==0){
              this.departmentCheck = true
              this.projectCheck = false
            }else{
              this.departmentCheck = false
              this.projectCheck = true
            }
          },
          getDepartmentsList(dutyRuleId){
            let that = this
            dutyApi.getDutyRuleByRuleIdAndDepartment(dutyRuleId,this.companyId).then((res)=>{
              if(this.dutyRuleId!=0){
                for(var q=0;q<res.data.length;q++){
                  for(var w=0;w<res.data[q].list.length;w++){
                    if(res.data[q].list[w].ischeck==1){
                      that.departmentChecked.push(res.data[q].list[w].user_id)
                    }
                  }
                }
                this.departmentTreeList = res.data
              }else{
                this.departmentTreeList = res.data
              }
            }).catch((res)=>{
              console.log("error", res);
            })
          },
          getProjectList(projectId, provinceId, cityId, dutyRuleId){
            let that = this
            dutyApi.getProjectWorkGroupList(this.companyId, projectId, provinceId, cityId, null,dutyRuleId, false).then((res)=>{
              console.log("getProjectWorkGroupList",res.data);
              if(this.dutyRuleId!=0){
                for(var q=0;q<res.data.length;q++){
                  for(var w=0;w<res.data[q].list.length;w++){
                    if(res.data[q].list[w].isCheck==1){
                      console.log("100000",res.data[q].list[w]);
                      for(var e=0;e<res.data[q].list[w].list.length;e++){
                        if(res.data[q].list[w].list[e].ischeck == 1){
                          that.projectChecked.push(res.data[q].list[w].list[e].project_id_work_group_id)
                        }
                      }
                    }
                  }
                }
                this.projectTreeList = res.data
              }else{
                this.projectTreeList = res.data
              }
            }).catch((res)=>{
              //console.log(res);
            })
          },
          changeCheck(val){
            console.log("changeCheck",val,this.$refs.tab0,this.$refs.tab1);
          },

          save(){
            this.saveLoading = true
            let that = this, dTree= this.$refs.departmentTree.getCheckedNodes() ,pTree= this.$refs.projectTree.getCheckedNodes();
            var departmentChecked = [],projectChecked = [];
            if(this.dutyRuleId == 0){
              for(var i=0;i<this.timeList.length;i++){
                if(this.timeList[i].timeRange){
                  let obj={
                    dutytimeName:"时间段"+(i+1),
                    dutytimeStart:this.timeList[i].timeRange[0]+":00",
                    dutytimeEnd:this.timeList[i].timeRange[1]+":00"
                  }
                  this.dutyList.push(obj)
                }
              }
            }else{
              for(var i=0;i<this.timeList.length;i++){
                if(this.timeList[i].timeRange){
                  let obj={
                    dutytimeName:"时间段"+(i+1),
                    dutytimeStart:this.timeList[i].timeRange[0],
                    dutytimeEnd:this.timeList[i].timeRange[1]
                  }
                  this.dutyList.push(obj)
                }
              }
            }

            if(dTree.length!=0){
              for(var i=0;i<dTree.length;i++){
                if(dTree[i].list==undefined){
                  let obj= {
                    departmentId:dTree[i].department_id,
                    positionsId:dTree[i].positions_id,
                    userId:dTree[i].user_id,
                    usedType:0,
                    companyId:that.companyId
                  }
                  departmentChecked.push(obj)
                }
              }
            }
            console.log("pTree",pTree);
            if(pTree.length!=0){
              for(var i=0;i<pTree.length;i++){
                if(pTree[i].list==undefined){
                  let obj= {
                    projectId:pTree[i].project_id,
                    workGroupId:pTree[i].work_group_id,
                    userId:null,
                    usedType:1,
                    companyId:that.companyId
                  }
                  projectChecked.push(obj)
                }
              }
            }
            console.log("projectChecked",projectChecked);
            if(this.departmentCheck == true && this.projectCheck == false){
              this.dutyRange = departmentChecked
            }else if(this.departmentCheck == true && this.projectCheck == true){
              this.dutyRange = [...departmentChecked,...projectChecked]
            }else if(this.departmentCheck == false && this.projectCheck == true){
              this.dutyRange = projectChecked
            }else{
              this.dutyRange = []
            }
            console.log("dutyRange",this.dutyRange);
            this.$refs.createRuleForm.validate((valid) => {
              if(valid){
                dutyApi.addDutyRule(JSON.stringify(this.dutyList),JSON.stringify(this.dutyRange),this.dutyRuleId,this.createRuleForm.dutyruleName,this.createRuleForm.vacation,this.createRuleForm.date.join(","),this.companyId).then((res)=>{
                  console.log(res);
                  that.$message.success(res.msg)
                  that.saveLoadingClose()
                  that.$router.push({
                    path:"/attend/rule"
                  })
                }).catch((res)=>{
                  console.log(res);
                  that.saveLoadingClose()
                })
              }else{
                console.log("error submit");
              }

            })
          },
          renderContent (h, { node, data, store }) {
            if(node.level==1){
              if(data.name){
                return (
                  <span class="custom-tree-node">
                    <span>{data.name}</span>
                  </span>
                );
              }else{
                return(
                  <span class="custom-tree-node">
                  <span>未分配部门</span>
                  </span>
                )
              }
            }else if(node.level==2){
              if(data.user_name){
                return(
                  <span class="custom-tree-node">
                  <span>{data.user_name}</span>
                </span>
                )
              }else if(data.nickname){
                return(
                  <span class="custom-tree-node">
                    <span>{data.nickname}</span>
                  </span>
                )
              }else if(data.mobile){
                return(
                  <span class="custom-tree-node">
                    <span>{data.mobile}</span>
                    <span class="positionName">{data.positions_name}</span>
                  </span>
                )
              }

            }

            /**/
          },
          renderContentP (h, { node, data, store }) {
            /*console.log(h,node,data,store)*/
            if(node.level==1){
              if(data.list.length==0){
                data.disabled = true
              }
              return  (
                <span class="custom-tree-node">
                <span>{data.name}</span>
              </span>
            )
            }else if(node.level==2){
              if(data.list.length==0){
                data.disabled = true
              }
              return (
                <span class="custom-tree-node">
                <span>{data.name}</span>
              </span>
              )
            }else if(node.level==3){
              return (
                <span class="custom-tree-node">
                <span>{data.user_name}</span>
                </span>
              )
            }

            /**/
          },
        },
      created(){
        let arrAll =[{
          name:"全部",
          id:null
        }];
        let that = this
        this.departmentCheck = true
        this.companyId = LocalCache.get("companyInfo").companyId;
        userApi.addressProviceList().then((res)=>{
          //this.proviceOptions = res.data.list
          this.proviceOptions =[...arrAll,...res.data.list] //res.data.list
        }).catch((res)=>{
          this.$message({
            type:'error',
            message:res.msg
          })
        })

        that.getProjectList(null, null, null, null);
      },
      beforeMount(){
        let that = this
        that.dutyRuleId = that.$route.params.dutyRuleId
        console.log("dutyRuleId",this.dutyRuleId,this.companyId);
        dutyApi.getDutyRuleUseList(that.dutyRuleId).then((res)=>{
          console.log("getDutyRuleUseList",res);
        })
        if(that.dutyRuleId != 0){
          that.getDepartmentsList(that.dutyRuleId);
        }else{
          that.getDepartmentsList(null);
        }
        if(this.dutyRuleId != 0 ){
          dutyApi.getDutyRuleDetail(that.dutyRuleId, that.companyId, null, 1, 10).then((res)=>{
            let resData = res.data[0],
                dateArr = resData.dutyDate.split(',');
            console.log(resData);
            if(dateArr.length == 7 ){
              that.checkAll = true
              that.isIndeterminate = false
            }else if(dateArr.lengt>0&&dateArr.Length<7){
              that.checkAll = false
              that.isIndeterminate = true
            }else{
              that.checkAll = false
              that.isIndeterminate = false
            }
            //this.dutyList,this.dutyRange,this.dutyRuleId,this.createRuleForm.name,this.createRuleForm.vacation,this.createRuleForm.date.join(","),this.companyId
            //that.createRuleForm.name = res.data.dutyruleName
            resData.date = dateArr
            that.createRuleForm = resData
            //that.createRuleForm.name = res.data.uselegaldayStr
            if(resData.uselegaldayStr=="是"){
              that.createRuleForm.vacation = 1
            }else{
              that.createRuleForm.vacation = 0
            }
            that.timeList = []
            for(var a=0;a<resData.detailList.length;a++){
              let obj={
                index:a,
                title:'时间段',
                timeRange:[],
                time:''
              }
              obj.timeRange.push(resData.detailList[a].dutytimeStart)
              obj.timeRange.push(resData.detailList[a].dutytimeEnd)
              that.timeList.push(obj)
            }
            that.createRuleForm.date = dateArr
            //console.log(that.createRuleForm,that.createRuleForm.vacation,resData.uselegaldayStr, typeof resData.dutyDate);
          }).catch((res)=>{
            console.log(res);
          })
        }
      },
      mounted(){

      },
      update(){

      }
    }
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../assets/sass/variable";
  .el-form{
    padding-top: 40px;
    padding-bottom: 40px;
    overflow: hidden;
  }
  .el-input{
    width: 75%;
    float: left;
  }
  .el-form-item{
    width: 90%;
    margin: 0 auto 22px;
  }
  .el-select{
    width: 75%;
    float: left;
  }
  .w50p{
    box-sizing: border-box;

  }
  .w50p.fr{
    min-height : 713px;
    border-left: $bd-d;
    .tit{
      font-size: 16px;
      line-height: 24px;
      padding-bottom: 10px;
    }
    .tips{
      font-size: 12px;
      color: #999999;
      padding-bottom: 10px;
    }
  }
  .timeBox{
    width: 320px;
    height: 420px;
    overflow-y: auto;
    overflow-y: scroll\9;
    border-top:  1px solid #ccc;
    border-left:  1px solid #ccc;
    border-right: 1px solid #ccc;
    -webkit-border-radius: 5px 5px 0 0;
    -moz-border-radius: 5px 5px 0 0;
    border-radius: 5px 5px 0 0;
  }
  .timeRange{
    text-align: left;
    text-indent: 20px;
    span.fr{
      margin-right: 20px;
      text-align: center;
    }
  }
  .addTimeRange{
    height: 38px;
    width: 320px;
    margin-left: 0;
    -webkit-border-radius: 0 0 5px 5px;
    -moz-border-radius: 0 0 5px 5px;
    border-radius: 0 0 5px 5px;
    float: left;
    border: 1px solid #ccc;
    background-color: #F2F6FB;
    border-top: none;
    box-sizing: content-box;
    color: #438CFF;
  }
  .projectPart{
    .partItem{
      overflow: hidden;
      line-height: 50px;
      .fl{
        color: #666666;
        font-size: 14px;

      }
    }
  }
  .createRule {
    /deep/ .positionName {
      margin-left: 20px;
      font-size: 14px;
    }
    /deep/ .el-tree-node__content{
      height: 32px;
      line-height: 32px;
    }
  }
</style>
