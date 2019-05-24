<template>
    <div data-page="attendRuleDetail" class="page navbar-fixed toolbar-fixed" @page:reinit="back"> <!--固定导航栏-->
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">考勤规则详情</div>
                <div class="right">
                    <a href="#" v-show="isShow==1" @click="delAction">删除</a>
                </div>
            </div>
        </div>
        <div class="page-content">
            <div class="box">
                <div class="nav">
                    <div class="left">规则一</div>
                    <div class="right">
                        <img @click="editAction" v-show="isShow==1" src="../../../../../static/img/edit3.png"/>
                        <div @click="cancelAction" v-show="isShow==2">取消编辑</div>
                    </div>
                </div>
                <div v-show="isShow==1">
                    <div class="b">
                        <span>考勤规则名称:</span>&nbsp; &nbsp;<span>{{oneAttendRule.dutyruleName}}</span>
                    </div>
                    <div class="b">
                        <span>考勤日期:</span>&nbsp; &nbsp;<span>{{oneAttendRule.dutyDateStr}}</span>
                    </div>
                    <div class="b2">
                        <div class="left">考勤时间:</div>&nbsp; &nbsp;
                        <div class="right"><span v-for="item in oneAttendRule.detailList">{{item.dutytimeStart}},{{item.dutytimeEnd}}</span></div>
                    </div>
                    <div class="b">
                        <span>开启法定节假日自动排休:</span>&nbsp; &nbsp;<span>{{oneAttendRule.uselegaldayStr}}</span>
                    </div>
                    <div class="b" @click="enterDetail(oneAttendRule.id)">
                        <span>适用范围:</span>&nbsp; &nbsp;<span>{{oneAttendRule.useInfo}}</span>
                        <img src="../../../../../static/img/btn_more.png"/>
                    </div>
                </div>
                <div v-show="isShow==2">
                    <div class="cent">
                        <ul>
                            <li>
                                <div class="c-1">考勤规则名称</div>
                                <div class="c-3">
                                    <input type="text" v-model="attendName" placeholder="请输入考勤规则名称"/>
                                </div>
                            </li>
                            <li>
                                <div class="c-1">考勤日期</div>
                                <a href="/company/attendDate/1">
                                    <div class="right">
                                        <span class="date">{{this.attendDate}}</span>
                                        <img src="../../../../../static/img/btn_more.png"/>
                                    </div>
                                </a>
                            </li>
                            <li>
                                <div class="c-1">考勤时间</div>
                                <a href="/company/attendTime/1">
                                    <div class="right">
                                        <span class="time">{{this.attendTime}}</span>
                                        <img src="../../../../../static/img/btn_more.png"/>
                                    </div>
                                </a>
                            </li>
                            <li>
                                <div class="c-1">适用范围</div>
                                <a href="/company/applyRange/1/">
                                    <div class="right">
                                        <span>{{this.useInfo}}</span>
                                        <img src="../../../../../static/img/btn_more.png"/>
                                    </div>
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div class="bott">
                        <div class="left">开启法定节假日自动排序</div>
                        <div class="item-input">
                            <label class="label-switch" @click="infoAction">
                                <input v-if="canCall==true" value="1" class="lect" type="checkbox" checked>
                                <input v-if="canCall==false" value="0" class="lect" type="checkbox">
                                <div class="checkbox"></div>
                            </label>
                        </div>
                    </div>
                    <div class="footer" v-show="this.isCreater" @click="saveAction">保存</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    var $$ = Dom7;
    import { dutyApi } from '../../../../api'
    export default {
        data(){
            return{
                isShow: 1,
                canCall: true,
                page: 1,
                pageSize: 1,
                companyId: '',
                dutyRuleId: '',
                oneAttendRule: {},
                attendName: '',
                attendDate: '',     //展示的值
                dutyDate: [],       //提交的值
                attendTime: [],     //展示的值
                dutyTimeList: [],   //提交的值
                userDutyListStr: [],  //适用范围人员
                useInfo: '',
                useInfoName: [],
                departMentList: [],   //规则适用范围按部门
                projMemberList: [],    //规则适用范围按项目
                allManRule: [],         //这个规则适用的所有人
                isCreater: false

            }
        },
        methods: {
            back(){
                this.isShow = 2;
                this.isCreater = true;
                if(this.$store.state.dutyDate != 0){
                    this.dutyDate = this.$store.state.dutyDate;
                    this.attendDate = this.$store.state.dutyDateName.join(',');
                    console.log('日期',this.dutyDate);
                    console.log('日期2',this.attendDate);
                }
                if(this.$store.state.dutyTimeList!=0){
                    this.dutyTimeList = this.$store.state.dutyTimeList;
                    this.attendTime = this.$store.state.dutyTime.join(',');
                    console.log('时间',this.dutyTimeList);
                    console.log('时间2',this.attendTime);
                }
                if(this.$store.state.userDutyListStr.length!=0){
                    this.useInfoName = [];
                    this.userDutyListStr = [];
                    for(var i=0; i<this.$store.state.userDutyListStr.length; i++){
                        if(this.$store.state.userDutyListStr[i].id==0){
                            this.$store.state.userDutyListStr[i].name = '项目部';
                        }
                        if(this.$store.state.userDutyListStr[i].list.length!=0){
                            this.useInfoName.push(this.$store.state.userDutyListStr[i].name);
                        }
                        this.$store.state.userDutyListStr[i].list.map((res)=>{
                            this.userDutyListStr.push(res);
                        })
                    }
                    if(this.useInfoName.length==0){
                        this.useInfo = '';
                    }else{
                        this.useInfo = this.useInfoName.join(',');
                    }
                    console.log('适用的所有项目名称', this.useInfoName);
                    console.log('适用人',this.userDutyListStr);
                }
            },
            editAction(){
                this.isShow = 2;
            },
            cancelAction(){
                this.isShow = 1;
            },
            delAction(){
                this.$f7.confirm('是否确认删除该考勤规则?', ()=>{
                    dutyApi.deleteDutyRule(this.dutyRuleId, this.companyId).then((res)=>{
                        console.log(res.data);
                        this.$router.back();
                    })
                })
            },
            enterDetail(id){
                this.$router.load({url: '/company/rangeOfApplicationDetail/'+id});
            },
            infoAction(){
                this.canCall = !this.canCall;
                this.back();
            },
            saveAction(){
                if(this.attendName == ''){
                    this.$f7.alert('请输入考勤规则');
                    return;
                }
                if(this.dutyDate.length == 0){
                    this.$f7.alert('请选择考勤日期');
                    return;
                }
                console.log($$("input[name=putt]").data('id'));
                this.dutyTimeList.map((item)=>{
                    console.log(item.dutytimeStart.length);
                    if(item.dutytimeStart.length == 5){
                        item.dutytimeStart = item.dutytimeStart+':00',
                            item.dutytimeEnd = item.dutytimeEnd+':00'
                    }
                })
                if(this.dutyTimeList.length == 0){
                    this.$f7.alert('请选择考勤时间');
                    return;
                }
                if(this.userDutyListStr.length == 0){
                    this.$f7.alert('请选择适用范围');
                    return;
                }
                this.uselegalday = $$(".lect").val();
                console.log(this.companyId, JSON.stringify(this.dutyTimeList), JSON.stringify(this.userDutyListStr), this.ruleName, this.uselegalday, this.dutyDate);
                dutyApi.createDutyRule(
                    this.companyId,
                    JSON.stringify(this.dutyTimeList),
                    JSON.stringify(this.userDutyListStr),
                    this.attendName,
                    this.uselegalday,
                    this.dutyDate.join(','),
                    this.dutyRuleId
                ).then((reuslt)=>{
                    console.log(reuslt.data);
                    this.$router.back();
                })
            }
        },
        mounted(){
            this.dutyRuleId = this.$route.params.id;
            this.$store.state.dutyRuleId = this.dutyRuleId;
            this.companyId = this.$store.state.roleInfo.companyId;
            console.log('我获取', this.companyId, this.dutyRuleId);
            this.$store.state.dutyDate = [];
            this.$store.state.dutyTimeList = [];

            if(this.$store.state.oneAttendRule){
                this.oneAttendRule = this.$store.state.oneAttendRule;
                this.oneAttendRule.detailList.map((res)=>{
                    res.dutytimeStart = res.dutytimeStart.substr(0,5),
                    res.dutytimeEnd = res.dutytimeEnd.substr(0,5)

                    let obj = {
                        'dutytimeName': res.dutytimeName,
                        'dutytimeStart': res.dutytimeStart,
                        'dutytimeEnd': res.dutytimeEnd
                    }
                    let str = res.dutytimeStart+','+res.dutytimeEnd;
                    this.dutyTimeList.push(obj);
                    this.attendTime.push(str);
                })
                this.$store.state.dutyTimeList = this.dutyTimeList;
                this.$store.state.dutyTime = this.attendTime;
                this.attendTime = this.attendTime.join(',');
                console.log(this.oneAttendRule);

                this.attendName = this.oneAttendRule.dutyruleName;
                this.attendDate = this.oneAttendRule.dutyDateStr;
                this.dutyDate = this.oneAttendRule.dutyDate;
                this.$store.state.dutyDateName = this.attendDate.split(',');
                this.$store.state.dutyDate = this.dutyDate.split(',');
                console.log(this.dutyDate);
                this.useInfo = this.oneAttendRule.useInfo;
                console.log('用户名字列表', this.useInfo);
                if(this.oneAttendRule.detailList[0].uselegalday==0){
                    this.canCall = false;
                }
                if(this.oneAttendRule.detailList[0].uselegalday==1){
                    this.canCall = true;
                }

            }

            dutyApi.oneDutyAllPerson(this.dutyRuleId).then((result)=>{
                console.log('所有',result.data);
                this.$store.state.userDutyListStr = result.data;
            })


        }
    }
</script>

<style scoped>
    .navbar .right{
        color: #438cff;
    }
    .page-content{
        width: 100%; height: 100%; background: #f4f4f4;
    }
    .box{

    }
    .box .nav{
        width: 100%; height: 2rem; line-height: 2rem; box-sizing: border-box; padding: 0 0.6rem; display: flex; justify-content: space-between;
        background: #fff; border-bottom: 1px solid #f4f4f4;
    }
    .box .nav .left{
        font-size: 0.7rem; color: #999;
    }
    .box .nav .right{

    }
    .box .nav .right img{
        width: 2.5rem; height: 0.9rem; margin-top: 0.6rem;
    }
    .box .b{
        width: 100%; height: 2.5rem; line-height: 2.5rem; font-size: 0.7rem; color: #666; box-sizing: border-box; padding: 0 0.6rem;
        background: #fff; border-bottom: 1px solid #f4f4f4; position: relative; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .box .b img{
        width: 0.9rem; height: 0.9rem; position: absolute; right: 12px; top: 16px;
    }
    .box .b2{
        width: 100%; min-height: 2.5rem; border-bottom: 1px solid #f4f4f4; background: #fff; display: flex; box-sizing: border-box; padding: 0 0.6rem;
    }
    .box .b2 .left{
        line-height: 2.5rem; font-size: 0.7rem; color: #666;
    }
    .box .b2 .right{
        line-height: 1.5rem; flex: 1; width: 100%; font-size: 0.7rem; color: #666;
    }
    .box .b2 .right span{
        width: 33%; display: inline-block; padding-top: 10px;
    }

    .cent{
        width: 100%; box-sizing: border-box; padding: 0 28px 0 0.6rem; background: #fff;
    }
    .cent ul{
        overflow: hidden;
    }
    .cent ul li{
        width: 100%; height: 2rem; line-height: 2rem; display: flex; padding: 5px 0;
    }
    .cent ul li .c-1{
        font-size: 0.7rem; color: #666;
    }
    .cent ul li .c-3{
        flex: 1; height: 2rem; margin-left: 0.6rem; color: #999;
    }
    .cent ul li .c-3 input{
        width: 100%; height: 100%; box-sizing: border-box; padding-left: 0.6rem; border: 1px solid #E1E1E1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .cent ul li a{
        flex: 1; display: block; border: 1px solid #E1E1E1; margin-left: 0.6rem; box-sizing: border-box; padding-left: 0.4rem; min-width: 60px; position: relative;
    }
    .cent ul li .right{
        height: 2rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 0.7rem; color: #999;
    }
    .cent ul li .right img{
        width: 0.9rem; height: 0.9rem; position: absolute; right: 4px; top: 10px;
    }

    .bott{
        width: 100%; height: 2.5rem; background: #fff; display: flex; justify-content: space-between; box-sizing: border-box; padding: 0 28px 0 0.6rem;
    }
    .bott .left{
        font-size: 0.7rem; color: #666; line-height: 2.5rem;
    }
    .bott .item-input{
        width: auto; margin-top: 16px; margin-left: 4px;
    }
    .label-switch{
        width: 36px; height: 18px;
    }
    .label-switch .checkbox{
        width: 36px; height: 18px;
    }
    .label-switch input[type=checkbox]:checked+.checkbox{
        background: #438CFF;
    }
    .label-switch .checkbox:before{
        width: 36px; height: 18px;
    }
    .label-switch .checkbox:after{
        width: 14px; height: 14px;
    }
    .footer{
        width: 100%; height: 2rem; line-height: 2rem; text-align: center; font-size: 0.8rem; color: #fff; background: #438CFF;
        position: fixed; left: 0; bottom: 0;
    }
</style>