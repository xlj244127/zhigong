<template>
    <div data-page="groupApplication" class="page navbar-fixed">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">我的联系记录</div>
            </div>
        </div>
        <div class="page-content infinite-scroll">
            <div class="main">
                <ul class="aul2">
                    <li v-for="item in groupList">
                        <div class="contactTime"><span>联系时间:</span>&nbsp;&nbsp;<span>{{item.showTime}}</span></div>
                        <div class="a2">
                            <div class="a2-1">
                                <span class="wg">{{item.workGroupName}}</span>
                                <img v-show="item.userDetailEntity.idNumber" src="../../../../../static/img/shareYishiming.png"/>
                                <img v-show="item.userCount>1" src="../../../../../static/img/shareYirengzhen.png"/>
                                <span v-show="item.userCount>1" class="wg2">班组{{item.userCount}}人</span>
                            </div>
                            <div class="a2-2" @click="contactAction(item.workGroupTel)">
                                <img src="../../../../../static/img/phone_icom.png"/>
                            </div>
                        </div>
                        <div class="a3">
                            <div class="up">
                                <div class="a3-2" v-for="one in item.list">
                                    <div class="left">{{one.workType.split('_')[0]}}</div>
                                    <div class="left2"><span class="t">{{one.freeAmount}}</span><span class="t2">人</span></div>
                                    <div class="left3">{{one.freeTime}}起</div>
                                </div>
                                <div class="a4-2" v-show="item.remark">
                                    <img src="../../../../../static/img/tonggao.png"/>
                                    <div class="right">{{item.remark}}</div>
                                </div>
                                <div class="u-1">
                                    <img src="../../../../../static/img/dingwei_icom.png"/>
                                    <span>{{item.province.name}}</span><span>{{item.city.name}}</span>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
                <div v-show="groupList.length<this.pageSize || groupList.length==this.totalItems" class="word">已无更多信息</div>
            </div>
        </div>
    </div>
</template>

<script>
    var $$ = Dom7;
    import {userApi, tabulateStatisticsApi, wxApi} from "../../../../api";
    import moment from 'moment';
    import phone_icon from '../../../../../static/img/phone_icon.png';
    export default {
        data(){
            return{
                page: 1,
                pageSize: 5,
                totalPages: '',
                totalItems: '',
                companyId: '',
                groupList: [],
                workerTitle: []
            }
        },
        methods:{
            contactAction(mobile){
                console.log(mobile);
                this.$f7.modal({
                    text:  '<div class="tabs">' +
                                '<img style="width: 1rem; height: 1.1rem; transform: translateY(0.3rem)" src=' + phone_icon + '>' +
                                '<a>' + mobile + '</a>' +
                            '</div>',
                    buttons: [
                        {
                            text: '取消'
                        },
                        {
                            text: '<a style="width: 100%; height: 100%; display: inline-block" href="tel:'+mobile+'" class="external">' + "拨号" + '</a>'
                        },
                    ]
                })
            }
        },
        mounted(){
            this.companyId = this.$store.state.roleInfo.companyId;
            if(this.$store.state.workerTitle) {
                this.workerTitle = this.$store.state.workerTitle;
            }else{
                tabulateStatisticsApi.typeSort('workType').then((result)=> {
                    this.workerTitle = result.data.list.reverse();
                })
            }
            wxApi.projContactGroupHistory(this.page, this.pageSize).then((result)=>{
                console.log('项目联系班组历史',result.data);
                this.groupList = result.data;
                this.totalPages = result.pagination.totalPages;
                this.totalItems = result.pagination.totalItems;
                for(var i=0; i<this.groupList.length; i++){
                    this.groupList[i].showTime = moment(this.groupList[i].showTime).format('YYYY-MM-DD, h:mm');
                    for(var k=0; k<this.groupList[i].list.length; k++) {
                        for (var j = 0; j < this.workerTitle.length; j++) {
                            if (this.groupList[i].list[k].workType == this.workerTitle[j].code) {
                                this.groupList[i].list[k].workType = this.workerTitle[j].value+'_'+this.workerTitle[j].code;
                            }
                        }
                    }
                }
                console.log('列表',this.groupList);
            })

            var loading = false;
            $$('.infinite-scroll').on('infinite', ()=>{
                if(loading) return;
                loading = true;
                console.log('我被点击了');
                setTimeout(()=>{
                    this.page++;
                    console.log('我被点击了2',this.page);
                    loading = false;

                    if (this.page <= this.totalPages) {
                        wxApi.projContactGroupHistory(
                            this.page,
                            this.pageSize
                        ).then((result)=>{
                            console.log('kk',result.data);
                            this.groupList = this.groupList.concat(result.data);
                            for(var i=0; i<this.groupList.length; i++){
                                this.groupList[i].showTime = moment(this.groupList[i].showTime).format('YYYY-MM-DD, h:mm');
                                for(var k=0; k<this.groupList[i].list.length; k++) {
                                    for (var j = 0; j < this.workerTitle.length; j++) {
                                        if (this.groupList[i].list[k].workType == this.workerTitle[j].code) {
                                            this.groupList[i].list[k].workType = this.workerTitle[j].value+'_'+this.workerTitle[j].code;
                                        }
                                    }
                                }
                            }
                            console.log('列表',this.groupList);
                        })
                    }
                }, 1000);
            })
        }
    }
</script>

<style scoped>
    .page-content{
        width: 100%; height: 100%; background: #f4f4f4;
    }
    .main .aul2{
        margin-top: 0.25rem;
    }
    .main .aul2 li{
        margin-bottom: 0.5rem;
    }
    .main .aul2 li .contactTime{
        width: 100%; height: 1rem; line-height: 1rem; text-align: right; font-size: 0.6rem; color: #999; background: #fff; box-sizing: border-box; padding-right: 0.7rem;
    }
    .main .aul2 li .a2{
        width: 100%; height: 1.75rem; line-height: 1.75rem; border-bottom: 1px solid #DDDEE2; display: flex; justify-content: space-between;
        background: #F2F7FB; box-sizing: border-box; padding: 0 0.6rem;
    }
    .main .aul2 li .a2 .a2-1 .wg{
        font-size: 0.75rem; color: #555; padding-right: 0.5rem;
    }
    .main .aul2 li .a2 .a2-1 img{
        width: 1.9rem; height: 0.7rem; transform: translateY(3px);
    }
    .main .aul2 li .a2 .a2-1 .wg2{
        display: inline-block; height: 0.6rem; line-height: 0.6rem; border: 1px solid #FC7C2E; font-size: 0.4rem; color: #F55C11; border-radius: 1px; padding: 0 4px; transform: translateY(-2px);
    }
    .main .aul2 li .a2-2{
        height: 1.75rem;
    }
    .main .aul2 li .a2-2 img{
        width: 1.25rem; height: 1.25rem; display: inline-block; margin-top: 0.3rem;
    }

    .main .aul2 li .a3{
        font-size: 0.55rem; color: #777777; background: #fff; box-sizing: border-box; padding: 0 0.6rem;
    }
    .main .aul2 li .a3 .up .a3-2{
        width: 100%; height: 1.5rem; line-height: 1.5rem; display: flex; justify-content: space-between; border-bottom: 1px solid #f4f4f4; box-sizing: border-box; padding: 0 2.6rem 0 0.5rem;
    }
    .main .aul2 li .a3 .up .a3-2 .left{
        min-width: 4.4rem; display: inline-block; font-size: 0.65rem; color: #438CFF;
    }
    .main .aul2 li .a3 .up .a3-2 .left2{
        padding-right: 2rem; font-size: 0.6rem;
    }
    .main .aul2 li .a3 .up .a3-2 .left2 .t{
        color: #EF7373;
    }
    .main .aul2 li .a3 .up .a3-2 .left2 .t2{
        color: #777777;
    }
    .main .aul2 li .a3 .up .a3-2 .left3{
        font-size: 0.55rem; color: #777;
    }
    .main .aul2 li .a3 .up .a4-2{
        display: flex; background: #F8F8F8; box-sizing: border-box; padding: 6px 0;
    }
    .main .aul2 li .a3 .up .a4-2 img{
        width: 0.55rem; height: 0.55rem; display: inline-block; transform: translateY(2px); padding-right: 4px;
    }
    .main .aul2 li .a3 .up .a4-2 .right{
        font-size: 0.55rem; color: #666;
    }
    .main .aul2 li .a3 .up .u-1{
        width: 100%; height: 1.2rem; line-height: 1.2rem; font-size: 0.5rem; color: #999;
    }
    .main .aul2 li .a3 .up .u-1 img{
        width: 0.5rem; height: 0.6rem; transform: translateY(0.1rem);
    }
    .main .word{
        width: 90%; height: 24px; line-height: 24px; font-size: 10px; text-align: center; margin: 20px auto; color: #6AA5EE; border: 1px solid #DEE8F7;  border-radius: 6px;
    }
</style>