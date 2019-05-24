<template>
    <div class="main3">
        <ul class="aul3">
            <li v-for="item in workerSearchJobList">
                <div class="sit">
                    <div class="ent">
                        <img class="st" src="../../static/img/wendan.png"/>
                        <div class="st2">
                            <div class="skew">
                                <div class="skew-main">{{item.title?item.title:item.city.name+'招'+item.workType}}</div>
                            </div>
                        </div>
                        <img class="st3" src="../../static/img/shibianxin_icom.png"/>
                    </div>
                    <div class="int" @click="contactGrouper(item)">
                        <img src="../../static/img/phone_icom.png"/>
                    </div>
                </div>
                <div class="a2">
                    <div class="a2-1">
                        <span class="wg">{{item.workGroup.name}}</span>
                        <img v-if="item.workGroup.user.userDetail.idNumber" src="../../static/img/shareYishiming.png"/>
                        <img v-if="item.workGroup.memberCount>1" src="../../static/img/shareYirengzhen.png"/>
                        <span v-if="item.workGroup.memberCount>1"  class="wg2">班组{{item.workGroup.memberCount}}人</span>
                    </div>
                    <!--<div class="a2-2">-->
                        <!--<img src="../../static/img/phone_icom.png"/>-->
                    <!--</div>-->
                </div>
                <div class="single">
                    <div class="up">
                        <div class="left">
                            <img src="../../static/img/recruit_time_worker.png" v-if="item.demandType==1"/>
                            <img src="../../static/img/recruit_contractor.png" v-else-if="item.demandType==2"/>
                            <img src="../../static/img/recruit_group.png" v-else-if="item.demandType==3"/>
                            <img src="../../static/img/recruit_worker.png" v-else-if="item.demandType==4"/>
                            <img src="../../static/img/zhaogong.png" v-else/>
                            <span>{{item.workTypeName}}</span>
                        </div>
                        <div class="left2">需求 <span class="f-2">|</span> <span class="f-3">{{item.demandAmount}}</span>人</div>
                        <div class="left3"><span>{{item.salary}}{{item.salaryLabel}}</span></div>
                    </div>
                    <div class="cent">
                        <div class="left"><span v-show="item.treatmentsName!=''" v-for="one in item.treatmentsName.split(',')">{{one}}</span><span v-show="item.tlementName!=''">{{item.tlementName}}</span></div>
                        <div class="right">时间 <span>|</span> {{item.demandTime}}</div>
                    </div>
                    <div class="cent3" v-show="item.remark!=''">
                        <img src="../../static/img/tonggao.png"/>
                        <div class="right">{{item.remark}}</div>
                    </div>
                    <div class="down">
                        <div class="address">
                            <img src="../../static/img/grayxiaodinwei2.png"/>
                            <span v-if="item.province">{{item.province.name}}</span><span v-if="item.city">{{item.city.name}}</span><span v-if="item.district">{{item.district.name}}</span><span>{{item.address}}</span>

                        </div>
                        <div class="share" @click="shareItem(item)">
                            <img src="../../static/img/search_share.png" alt="">
                        </div>
                    </div>

                </div>
            </li>
        </ul>
        <div class="fix" @click="refreshResume">置顶简历</div>
        <div class="fix2">
            <a @click="createCard" href="#"><span>+</span>&nbsp;发布找活</a>
            <div class="imgTip" v-if="tipShow">
                <img src="../../static/img/search_tip_1.png" alt="" class="tipMain">
                <img src="../../static/img/search_tip_close.png" alt="" @click="closeTip()" class="tipClose">
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    var $$ = Dom7;
    import {userApi, wxApi, projectApi} from "../api";
    import { LocalCache } from '../lib/utils';
    import phone_icon from '../../static/img/phone_icon.png';
    export default {
        name: "searchJob",
        data(){
            return{
                userId: '',
                workGroupId: '',
                tipShow: true,
                groupOneRecruit:{}
            }
        },
        props: ['workerSearchJobList', 'number', 'userCardExist', 'userCardId'],
        methods:{
            refreshResume(){
                if(this.userCardExist){
                    console.log(this.userCardId);
                    wxApi.refreshLookingJob(this.userCardId).then((res)=>{
                        console.log(res);
                        if(res.code==0){
                            this.$f7.alert("简历已刷新，请返回列表查看")
                        }
                    })
                }else{
                    this.$f7.alert("暂无简历，请您先发布简历")
                }
            },
            closeTip(){
                this.tipShow = false
            },
            createCard(){
                this.$router.load({url: '/user/createCard/'})
            },
            shareItem(item){
                this.groupOneRecruit = {};
                console.log('单个班组招工信息',item);
                this.groupOneRecruit = {
                    'id': item.id,
                    'title': item.title,
                    'groupName': item.workGroup.name,
                    'workTypeName': item.workTypeName,
                    'demandAmount': item.demandAmount,
                    'salary': item.salary,
                    'salaryType': item.salaryType,
                    'salaryLabel': item.salaryLabel,
                    'treatmentsName': item.treatmentsName
                }
                this.$router.load({url: '/user/shareItemJob/'});
                this.$store.state.recruit = item;
                this.$store.state.groupOneRecruit = this.groupOneRecruit;
            },
            contactGrouper(item){
                if (this.number == 0) {
                    this.$f7.alert('您的联系次数已用完，邀请工友获得联系次数');
                } else {
                    wxApi.getGrouperPhone(item.workGroupId).then((result) => {
                        this.mobile = result.data;
                        let hideMobile = this.mobile.substr(0,3)+'****'+this.mobile.substr(7);
                        console.log(result.data);
                        this.$f7.modal({
                            text: '<div class="tabs">' +
                            '<img style="width: 1rem; height: 1.1rem; transform: translateY(0.3rem)" src=' + phone_icon + '>' +
                            '<a>' + hideMobile + '</a>' +
                            '</div>',
                            buttons: [
                                {
                                    text: '取消'
                                },
                                {
                                    text: '<a style="width: 100%; height: 100%; display: inline-block" href="tel:'+this.mobile+'" class="link external">' + "拨号" + '</a>',
                                    onClick: ()=>{
                                        wxApi.subOneTimes(this.userId).then((result) => {
                                            this.number = result.data.times;
                                            console.log('次数', result.data);
                                            this.$emit('childComponents',this.number);
                                        })
                                        wxApi.contactGroupApply(item.id).then((result) => {
                                            console.log(result.data);
                                            item.send = true;
                                        })
                                    }
                                },
                            ]
                        })
                    })
                }
            }
        },
        mounted(){
            this.userId = LocalCache.get('userInfo').id;
            this.workGroupId = this.$store.state.workGroupId;
            console.log('工人找工作列表',this.workerSearchJobList);
        }
    }
</script>

<style scoped>
    .main3 .aul3 li{
        background: #fff; margin-bottom: 0.5rem;
    }
    .main3 .aul3 li .sit{
        width: 100%; height: 35px; background: #fff; display: flex; justify-content: space-between; box-sizing: border-box; padding: 0 0.6rem;
    }
    .main3 .aul3 li .sit .ent{
        flex: 1; text-align: center;
    }
    .main3 .aul3 li .sit .int{
        width: 34px; text-align: right;
    }
    .main3 .aul3 li .sit .int img{
        width: 1.25rem; height: 1.25rem; margin-top: 7px;
    }
    .main3 .aul3 li .sit .ent .st{
        width: 1rem; height: 1rem; display: inline-block; margin-top: 6px; transform: translateX(5px);
    }
    .main3 .aul3 li .sit .ent .st2{
        color: #fff; display: inline-block; transform: translateY(-8px); position: relative; z-index: 2;
    }
    .main3 .aul3 li .sit .ent .st2 .skew{
        height: 22px; background: #9FC6FC; color: #123f65; font-weight: 700; letter-spacing: 1px; font-size: 0.65rem; transform: skew(-15deg);
    }
    .main3 .aul3 li .sit .ent .st2 .skew .skew-main{
        transform: skew(15deg); padding: 0 7px; transform: translateY(4px);
    }
    .main3 .aul3 li .sit .ent .st3{
        width: 1.7rem; height: 1.4rem; display: inline-block; transform: translateX(-26px); position: relative; top: 2px;
    }
    .main3 .aul3 li .a2{
        width: 100%; height: 1.75rem; line-height: 1.75rem; border-bottom: 1px solid #DDDEE2; display: flex; justify-content: space-between;
        background: #F2F7FB; box-sizing: border-box; padding: 0 0.6rem;
    }
    .main3 .aul3 li .a2 .a2-1 .wg{
        font-size: 0.75rem; color: #555; padding-right: 0.5rem;
    }
    .main3 .aul3 li .a2 .a2-1 img{
        width: 1.9rem; height: 0.7rem; transform: translateY(3px);
    }
    .main3 .aul3 li .a2 .a2-1 .wg2{
        display: inline-block; height: 0.6rem; line-height: 0.6rem; border: 1px solid #FC7C2E; font-size: 0.4rem; color: #F55C11; border-radius: 1px; padding: 0 4px; transform: translateY(-2px);
    }
    .main3 .aul3 li .a2-2{
        height: 1.75rem;
    }
    .main3 .aul3 li .a2-2 img{
        width: 1.25rem; height: 1.25rem; display: inline-block; margin-top: 0.3rem;
    }
    .main3 .aul3 li .single{
        width: 100%; box-sizing: border-box; padding: 0 0.6rem 0.3rem; background: #fff;
    }
    .main3 .aul3 li .single .up{
        width: 100%; height: 30px; line-height: 30px; display: flex; justify-content: space-between;
    }
    .main3 .aul3 li .single .up .left{
        display: inline-block; font-size: 0.75rem; color: #438CFF; font-weight: 700;
    }
    .main3 .aul3 li .single .up .left img{
        height: 0.75rem; display: inline-block; transform: translateY(2px);
    }
    .main3 .aul3 li .single .up .left2{
        font-size: 0.6rem; color: #666666;
    }
    .main3 .aul3 li .single .up .left2 .f-2{
        color: #ccc;
    }
    .main3 .aul3 li .single .up .left2 .f-3{
        color: #F13333; font-size: 0.75rem;
    }
    .main3 .aul3 li .single .up .left3 span{
        box-sizing: border-box; padding: 3px 4px; background: #F05A5A; border-radius: 1px; font-size: 0.6rem; color: #fff;
    }
    .main3 .aul3 li .single .cent{
        width: 100%; height: 30px; line-height: 30px; display: flex; justify-content: space-between;
    }
    .main3 .aul3 li .single .cent .left span{
        display: inline-block; height: 0.8rem; line-height: 0.8rem; box-sizing: border-box; padding: 0 6px; background: #EEEEEE;
        font-size: 0.55rem; color: #666; margin-right: 5px;
    }
    .main3 .aul3 li .single .cent .right{
        font-size: 0.6rem; color: #666;
    }
    .main3 .aul3 li .single .cent .right span{
        color: #ccc;
    }
    .main3 .aul3 li .single .cent3{
        display: flex; background: #f4f8fd; box-sizing: border-box; padding: 6px 0;
    }
    .main3 .aul3 li .single .cent3 img{
        width: 0.55rem; height: 0.55rem; display: inline-block; transform: translateY(2px); padding-right: 4px;
    }
    .main3 .aul3 li .single .cent3 .right{
        font-size: 0.55rem; color: #333;
    }
    .main3 .aul3 li .single .down{
        overflow: hidden;
        padding-top: .2rem;
        line-height: 1.1rem;
        height: 1.1rem; background: #fff; font-size: 0.6rem; color: #999;
        padding-bottom: .3rem;
    }
    .main3 .aul3 li .single .down .address{
        float: left;
        width: 80%;
        -ms-text-overflow: ellipsis;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    .main3 .aul3 li .single .down  img{
        width: 0.5rem; height: 0.6rem; display: inline-block; transform: translateY(1px);
    }

    .main3 .fix{
        width: 3.8rem; height: 1.1rem; line-height: 1.1rem; text-align: center; border-radius: 0.55rem 0 0 0.55rem;  background: linear-gradient(to top, #fc4413, #fbb838);
        font-size: 0.6rem; color: #fff; position: fixed; right: 0; top: 69%;
    }
    .main3 .fix2{
        width: 95px; height: 30px; line-height: 30px; text-align: center; border-radius: 0.75rem; font-size: 0.7rem; color: #fff; font-weight: 700;
        background: linear-gradient(to top, #297BE1, #91BFF9);
        position: fixed; left: 36%; bottom: 20px; z-index: 4;
    }
    .main3 .fix2 a{
        display: inline-block; width: 100%; height: 100%; font-size: 0.7rem; color: #fff;
    }
    .imgTip img{
        position: absolute;
        top: -5.5rem;
        left: 50%;
        margin-left: 20px;
    }
    .imgTip .tipMain{
        width: 6.75rem;
    }
    .imgTip .tipClose{
        width: 1rem;
        margin-left: 6.5rem;
        margin-top: 1rem;
    }
    .single .share{
        height: 1.1rem;
        text-align: right;
        float: right;
    }
    .main3 .aul3 li .single .down .share img{
        width: 2.475rem;
        height: 1.1rem;
    }
</style>