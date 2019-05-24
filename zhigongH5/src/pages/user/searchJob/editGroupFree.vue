<template>
    <div data-page="editGroupFree" class="page navbar-fixed">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">编辑</div>
            </div>
        </div>
        <div class="page-content">
            <div class="head">
                <div class="left">班组所在地</div><div class="right">{{cityWorkerList.name}}</div>
            </div>
            <div class="aside">
                <div class="top">
                    <div class="left">空闲班组列表</div>
                    <div class="right" v-show="isShow==1" @click="btnDeteleAction"><img src="../../../../static/img/shanchu@2x.png"/></div>
                    <div class="right2" v-show="isShow==2">
                        <div @click="cancelAction" class="g2">取消</div><div @click="confirmAction" class="g3">确认删除</div>
                    </div>
                </div>
                <div class="box">
                    <ul class="aul" v-show="isShow==1">
                        <li class="li" v-for="(item, index) in cityWorkerList.list">
                            <div class="up">
                                <div class="m-1">{{item.workType.split('_')[0]}}</div>
                                <div class="m-2">
                                    <div class="m-2-1" @click="reduceAction(index)">
                                        <img src="../../../../static/img/jianBlue.png"/>
                                    </div>
                                    <div class="m-2-2">
                                        <span class="m4">{{item.freeAmount}}</span><br/><span class="m5">人数</span>
                                    </div>
                                    <div class="m-2-1" @click="addAction(index)">
                                        <img src="../../../../static/img/jiaBlue.png"/>
                                    </div>
                                </div>
                                <div class="m-3" @click="selectTimeAction(index)">
                                    <div class="up">
                                        <span>{{item.freeTime}}</span>&nbsp;
                                        <img src="../../../../static/img/riqi2.png"/>
                                    </div>
                                    <div class="down">
                                        <input id="calendar-default" type="text" readonly/>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <ul class="aul2" v-show="isShow==2">
                        <li v-for="item in cityWorkerList.list">
                            <label class="label-checkbox item-content">
                                <div class="item-inner">
                                    <div class="up">
                                        <div class="m-1">{{item.workType.split('_')[0]}}</div>
                                        <div class="m-2">
                                            <div class="m-2-1">
                                                <img src="../../../../static/img/jianBlue.png"/>
                                            </div>
                                            <div class="m-2-2">
                                                <span class="m4">{{item.freeAmount}}</span><br/><span class="m5">人数</span>
                                            </div>
                                            <div class="m-2-1">
                                                <img src="../../../../static/img/jiaBlue.png"/>
                                            </div>
                                        </div>
                                        <div class="m-3">
                                            <div class="up">
                                                <span>{{item.freeTime}}</span>&nbsp;
                                                <img src="../../../../static/img/riqi2.png"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <input type="checkbox" name="putt" :data-id="item.id">
                                <div class="item-media">
                                    <i class="icon icon-form-checkbox"></i>
                                </div>
                            </label>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="footer" v-if="isShow==1">
                <div class="f-1" @click="completeAction">确定修改</div>
            </div>
        </div>
    </div>
</template>

<script>
    var $$ = Dom7;
    import {wxApi} from '../../../api';
    var index2;
    var calendarInline;
    let monthNames = ['01', '02', '03', '04', '05', '06', '07', '08' , '09' , '10', '11', '12'];
    let dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    let dayNamesShort = ['日', '一', '二', '三', '四', '五', '六'];
    import moment from 'moment';
    export default {
        data(){
            return{
                cityWorkerList: {},
                isShow: 1,
                upData: []
            }
        },
        methods:{
            btnDeteleAction(){
                this.isShow = 2;
            },
            cancelAction(){
                this.isShow = 1;
            },
            confirmAction(){
                let ids = [];
                let idsObj = {};
                $$('input[name=putt]:checked').each((idx, elm)=>{
                    let id = $$(elm).data('id');
                    ids.push(id);
                    idsObj[id] = id;
                })
                console.log('ids',ids.join(','));

                this.$f7.confirm('是否确认删除?', ()=>{
                    wxApi.deleteGrouperPublic(ids.join(',')).then((result)=>{
                        console.log(result.data);
                        this.isShow = 1;
                        this.cityWorkerList.list = this.cityWorkerList.list.filter((item)=>{
                            return !idsObj[item.id];
                        })
                    })
                })
            },
            completeAction(){
                this.upData = [];
                for(var i=0; i<this.cityWorkerList.list.length; i++){
                    let obj = {
                        id: this.cityWorkerList.list[i].id,
                        freeTime: this.cityWorkerList.list[i].freeTime,
                        freeAmount: this.cityWorkerList.list[i].freeAmount,
                        workType: this.cityWorkerList.list[i].workType.split('_')[1]
                    }
                    this.upData.push(obj);
                }
                console.log('上传',this.upData);

                wxApi.modifyGrouperPublicType( JSON.stringify(this.upData) ).then((result)=>{
                    console.log(result.data);
                    this.$router.load({url:"/user/searchProj/"});
                })
            },
            reduceAction(index){
                for(var i=0; i<this.cityWorkerList.list.length; i++){
                    if(i==index){
                        if(this.cityWorkerList.list[i].freeAmount==1){

                        }else{
                            this.cityWorkerList.list[i].freeAmount--
                        }
                    }
                }
            },
            addAction(index){
                for(var i=0; i<this.cityWorkerList.list.length; i++){
                    if(i==index){
                        this.cityWorkerList.list[i].freeAmount++
                    }
                }
            },
            selectTimeAction(index){
                index2 = index;
                setTimeout(()=>{
                    calendarInline.open();
                })
            },
        },
        mounted(){
            this.cityWorkerList = this.$store.state.cityWorkerList;
            console.log(this.cityWorkerList);

            var that = this;
            calendarInline = this.$f7.calendar({
                input: '#calendar-default',
                dateFormat: 'yyyy-MM-dd',
                monthNames, dayNames, dayNamesShort,
                onDayClick(p, dayContainer, year, month, day) {
                    let $day = moment().year(year).month(month).date(day).format('YYYY-MM-DD');
                    console.log($day, index2);
                    for(var i=0; i<that.cityWorkerList.list.length; i++){
                        if(i==index2){
                            console.log(that.cityWorkerList.list[i].freeTime);
                            that.cityWorkerList.list[i].freeTime = $day;
                        }
                    }
                    p.close();
                    that.$f7.closeModal();
                }
            });
        }
    }
</script>

<style scoped>
    .page-content{
        width: 100%; height: 100%; background: #f4f4f4;
    }
    .head{
        width: 100%; height: 45px; line-height: 45px; box-sizing: border-box; padding: 0 0.6rem; font-size: 0.7rem;
        display: flex; justify-content: space-between; background: #fff; margin-bottom: 0.5rem;
    }
    .head .left{
        color: #666666;
    }
    .head .right{
        color: #438CFF;
    }

    .aside{

    }
    .aside .top{
        width: 100%; height: 2rem; line-height: 2rem; box-sizing: border-box; padding: 0 0.6rem; font-size: 0.7rem;
        display: flex; justify-content: space-between; background: #fff; border-bottom: 1px solid #f4f4f4;
    }
    .aside .top .left{
        color: #999999;
    }
    .aside .top .right{

    }
    .aside .top .right img{
        width: 1.85rem; height: 0.55rem;
    }
    .aside .right2{
        width: 6rem; display: flex; justify-content: space-between;
    }
    .aside .right2 .g2{
        width: 35px; height: 17px; line-height: 17px; text-align: center; border: 1px solid #438CFF; border-radius: 0.45rem;
        font-size: 0.4rem; color: #5496FE; margin-top: 0.6rem;
    }
    .aside .right2 .g3{
        width: 48px; height: 17px; line-height: 17px; text-align: center; border: 1px solid #438CFF; border-radius: 0.45rem;
        font-size: 0.4rem; color: #5496FE; margin-top: 0.6rem;
    }

    .box .aul{
        background: #fff; margin-bottom: 4rem;
    }
    .box .aul li{
        width: 100%; border-bottom: 1px solid #f4f4f4; box-sizing: border-box; padding: 0 0.75rem 0 0.6rem;
    }
    .box .aul li .up{
        width: 100%; height: 2.5rem; line-height: 2.5rem; display: flex; justify-content: space-between;
    }
    .box .aul li .up .m-1{
        width: 4rem; font-size: 0.7rem; color: #666;
    }
    .box .aul li .up .m-2{
        display: flex;
    }
    .box .aul li .up .m-2 .m-2-1{
        width: 2.5rem; text-align: center;
    }
    .box .aul li .up .m-2 .m-2-1>img{
        width: 0.8rem; height: 0.8rem; display: inline; transform: translateY(0.3rem);
    }
    .box .aul li .up .m-2 .m-2-2{
        width: 1.7rem; min-height: 44px;
    }
    .box .aul li .up .m-2 .m-2-2 .m4{
        width: 1.7rem; height: 0.7rem; line-height: 0.7rem; text-align: center; font-size: 0.65rem; color: #156EFE; border: 1px solid #bbd2f7;
        border-radius: 0.1rem; margin-top: 0.9rem; display: inline-block; float: left;
    }
    .box .aul li .up .m-2 .m-2-2 .m5{
        width: 1.7rem; height: 12px; text-align: center; font-size: 0.5rem; color: #C8DDFF; display: inline-block; transform: translateY(-35px);
    }
    .box .aul li .up .m-3{
        position: relative;
    }
    .box .aul li .up .m-3 .up{

    }
    .box .aul li .up .m-3 .up span{
        color: #AAAAAA;
    }
    .box .aul li .up .m-3 .up img{
        width: 0.6rem; height: 0.65rem; display: inline; transform: translateY(0.9rem);
    }
    .box .aul li .up .m-3 .down{
        position: absolute; left: 0; top: 0; right: 0; bottom: 0; opacity: 0;
    }
    .box .aul li .up .m-3 .down input{
        width: 100%; color: #777;
    }

    .box .aul2{
        background: #fff; margin-bottom: 4rem;
    }
    .box .aul2 li{
        border-bottom: 1px solid #f4f4f4;
    }
    .box .aul2 li .item-content{
        width: 100%; display: flex; height: 2.5rem; line-height: 2.5rem;
    }
    .box .aul2 li .item-content .item-inner{
        width: 100%; display: flex; box-sizing: border-box; padding: 0 0.6rem;
    }
    .box .aul2 li .item-content .item-inner .up{
        width: 100%; height: 2.5rem; line-height: 2.5rem; display: flex; justify-content: space-between;
    }
    .box .aul2 li .item-content .item-inner .up .m-1{
        width: 4rem; font-size: 0.7rem; color: #666;
    }
    .box .aul2 li .item-content .item-inner .up .m-2{
        display: flex;
    }
    .box .aul2 li .item-content .item-inner .up .m-2 .m-2-1{
        width: 2.5rem; text-align: center;
    }
    .box .aul2 li .item-content .item-inner .up .m-2 .m-2-1>img{
        width: 0.8rem; height: 0.8rem; display: inline; transform: translateY(0.3rem);
    }
    .box .aul2 li .item-content .item-inner .up .m-2 .m-2-2{
        width: 1.7rem; min-height: 44px;
    }
    .box .aul2 li .item-content .item-inner .up .m-2 .m-2-2 .m4{
        width: 1.7rem; height: 0.7rem; line-height: 0.7rem; text-align: center; font-size: 0.65rem; color: #156EFE; border: 1px solid #bbd2f7;
        border-radius: 0.1rem; margin-top: 0.9rem; display: inline-block; float: left;
    }
    .box .aul2 li .item-content .item-inner .up .m-2 .m-2-2 .m5{
        width: 1.7rem; height: 12px; text-align: center; font-size: 0.5rem; color: #C8DDFF; display: inline-block; transform: translateY(-35px);
    }
    .box .aul2 li .item-content .item-inner .up .m-3{
        position: relative;
    }
    .box .aul2 li .item-content .item-inner .up .m-3 .up{

    }
    .box .aul2 li .item-content .item-inner .up .m-3 .up span{
        color: #AAAAAA;
    }
    .box .aul2 li .item-content .item-inner .up .m-3 .up img{
        width: 0.6rem; height: 0.65rem; display: inline; transform: translateY(0.9rem);
    }
    .box .aul2 li .item-content .item-media{
        width: 2.2rem;
    }
    .box .aul2 li .item-content .item-media .icon{
        width: 0.8rem; height: 0.8rem; margin-top: 0.75rem;
    }

    .footer{
        width: 100%; height: 2.5rem; background: #fff; position: fixed; left: 0; bottom: 0;
    }
    .footer .f-1{
        margin: 0.5rem auto; width: 90%; height: 1.5rem; line-height: 1.5rem; text-align: center; border-radius: 0.75rem; color: #fff; background: #438CFF;
    }
</style>