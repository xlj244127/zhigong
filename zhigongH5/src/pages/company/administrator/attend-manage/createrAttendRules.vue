<template>
    <div data-page="createrAttendRules" class="page navbar-fixed toolbar-fixed" @page:reinit="back"> <!--固定导航栏-->
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">创建考勤规则</div>
            </div>
        </div>
        <div class="page-content">
            <div class="nav">规则一</div>
            <div class="cent">
                <ul>
                    <li>
                        <div class="c-1">考勤规则名称</div>
                        <div class="c-3">
                            <input type="text" v-model="ruleName" placeholder="请输入考勤规则名称"/>
                        </div>
                    </li>
                    <li>
                        <div class="c-1">考勤日期</div>
                        <a href="/company/attendDate/0">
                            <div class="right date">
                                请选择（必选项)
                            </div>
                            <img src="../../../../../static/img/btn_more.png"/>
                        </a>
                    </li>
                    <li>
                        <div class="c-1">考勤时间</div>
                        <a href="/company/attendTime/0">
                            <div class="right time">
                                请选择（必选项)
                            </div>
                            <img src="../../../../../static/img/btn_more.png"/>
                        </a>
                    </li>
                    <li>
                        <div class="c-1">适用范围</div>
                        <a href="/company/applyRange/0">
                            <div class="right name">
                                请选择（必选项)
                            </div>
                            <img src="../../../../../static/img/btn_more.png"/>
                        </a>
                    </li>
                </ul>
            </div>
            <div class="bott">
                <div class="left">开启法定节假日自动排序</div>
                <div class="item-input">
                    <label class="label-switch" @click="infoAction()">
                        <input v-if="canCall==true" class="lect" name="putt" data-id="0" type="checkbox" checked>
                        <input v-if="canCall==false" class="lect" name="putt" data-id="1" type="checkbox">
                        <div class="checkbox"></div>
                    </label>
                </div>
            </div>

            <div class="footer" @click="saveAction">保存</div>
        </div>
    </div>
</template>

<script>
    var $$ = Dom7;
    import { dutyApi } from '../../../../api'
    export default {
        data(){
            return{
                canCall: true,
                companyId: '',
                ruleName: '',
                uselegalday: 1,
                dutyDate: [],           //考勤日期code
                dutyDateName: [],       //展示考勤日期名字
                dutyTimeList: [],       //考勤时间列表
                dutyTime: [],           //展示考勤时间
                userDutyListStr: [],     //考勤人员
                useInfoName: []
            }
        },
        methods:{
            back(){
                if(this.$store.state.dutyDate.length!=0){
                    this.dutyDate = this.$store.state.dutyDate;
                    this.dutyDateName = this.$store.state.dutyDateName;
                    $$('.date').text(this.dutyDateName.join(','));
                    console.log(this.dutyDate);
                }
                if(this.$store.state.dutyTimeList!=0){
                    this.dutyTimeList = this.$store.state.dutyTimeList;
                    this.dutyTime = this.$store.state.dutyTime;
                    $$('.time').text(this.dutyTime.join(','));
                    console.log(this.dutyTime);
                    console.log(this.dutyTimeList);
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
                        $$('.name').text('请选择（必选项)');
                    }else{
                        $$('.name').text(this.useInfoName.join(','));
                    }
                    console.log('适用的所有项目名称', this.useInfoName);
                    console.log('创建适用人',this.userDutyListStr);
                }
            },
            infoAction(){
                this.canCall = !this.canCall;
                this.uselegalday = $$('.lect').data('id');
                console.log(this.uselegalday);
            },
            saveAction(){
                if(this.ruleName == ''){
                    this.$f7.alert('请输入考勤规则名称');
                    return;
                }
                if(this.dutyDate.length == 0){
                    this.$f7.alert('请选择考勤日期');
                    return;
                }
                console.log($$("input[name=putt]").data('id'));
                this.dutyTimeList.map((item)=>{
                    item.dutytimeStart = item.dutytimeStart+':00',
                    item.dutytimeEnd = item.dutytimeEnd+':00'
                })
                if(this.dutyTimeList.length == 0){
                    this.$f7.alert('请选择考勤时间');
                    return;
                }
                if(this.userDutyListStr.length == 0){
                    this.$f7.alert('请选择适用范围');
                    return;
                }
                this.uselegalday = $$("input[name=putt]").data('id');
                console.log(this.companyId, JSON.stringify(this.dutyTimeList), JSON.stringify(this.userDutyListStr), this.ruleName, this.uselegalday, this.dutyDate.join(','));
                dutyApi.createDutyRule(
                    this.companyId,
                    JSON.stringify(this.dutyTimeList),
                    JSON.stringify(this.userDutyListStr),
                    this.ruleName,
                    this.uselegalday,
                    this.dutyDate.join(',')
                ).then((reuslt)=>{
                    console.log(reuslt.data);
                    this.$router.back()
                })
            }
        },
        mounted(){
            this.companyId = this.$store.state.roleInfo.companyId;
            this.$store.state.dutyDate = [];
            this.$store.state.dutyTimeList = [];
            this.$store.state.userDutyListStr = [];
        }
    }
</script>

<style scoped>
    .page-content{
        width: 100%; height: 100%; background: #f4f4f4;
    }
    .nav{
        width: 100%; height: 2rem; line-height: 2rem; box-sizing: border-box; padding-left: 0.6rem;
        border-bottom: 1px solid #f4f4f4; background: #fff; margin-top: 0.5rem;
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
    .cent ul li a .right{
        height: 2rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 0.7rem; color: #999;
    }
    .cent ul li a img{
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