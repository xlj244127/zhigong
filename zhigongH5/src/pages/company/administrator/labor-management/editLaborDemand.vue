<template>
    <div data-page="editLaborDemand" class="page navbar-fixed">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">编辑用工需求</div>
            </div>
        </div>
        <div class="page-content">
            <div class="head">{{this.projName}}</div>
            <div class="nav">
                <div class="left">添加空闲班组</div>
                <div class="right">
                    <div class="r-1">
                        <img v-show="isShow==1" @click="deleteAction" src="../../../../../static/img/shanchu@2x.png"/>
                    </div>
                    <div class="r-3" v-show="isShow==2" @click="comfirmDeleteAction">确认删除</div>
                    <div class="r-2" v-show="isShow==1" @click="addTypeAction">
                        <div class="cover">添加工种</div>
                        <div class="down">
                            <input type="text" id="picker-devicefive_2" readonly/>
                        </div>
                    </div>
                </div>
            </div>
            <div class="main">
                <ul class="aul" id="aul" v-if="isShow==1">
                    <li class="li2" v-for="(item, index) in upData" :data-id="item.workType.split('_')[1]">
                        <div class="m-1">{{item.workType.split('_')[0]}}</div>
                        <div class="m-2" @click.stop.prevvent="reduceAction(index)">
                            <img src="../../../../../static/img/jian.png"/>
                        </div>
                        <div class="m-3">{{item.demandAmount}}</div>
                        <div class="m-2" @click="addAction(index)">
                            <img src="../../../../../static/img/jia.png"/>
                        </div>
                        <div class="m-4" @click="selectTimeAction(index)">
                            <div class="left">
                                <span class="t-1">{{item.demandTime==''?'选择空闲日期':item.demandTime}}</span>
                                <img src="../../../../../static/img/riqi2.png"/>
                            </div>
                            <div class="right">
                                <input id="calendar-defaultsix_2" type="text" readonly/>
                            </div>
                        </div>
                    </li>
                </ul>
                <ul class="aul2 infinite-scroll" v-if="isShow==2">
                    <li v-for="item in upData" id="li2">
                        <label class="label-checkbox item-content">
                            <div class="item-inner">
                                <div class="m-1">{{item.workType.split('_')[0]}}</div>
                                <div class="m-2">
                                    <img src="../../../../../static/img/jian.png"/>
                                </div>
                                <div class="m-3">{{item.demandAmount}}</div>
                                <div class="m-2">
                                    <img src="../../../../../static/img/jia.png"/>
                                </div>
                                <div class="m-4">
                                    <span>{{item.demandTime==''?'选择空闲日期':item.demandTime}}</span>
                                    <img src="../../../../../static/img/riqi2.png"/>
                                </div>
                            </div>
                            <input type="checkbox" name="put" :data-id="item.workType.split('_')[1]">
                            <div class="item-media">
                                <i class="icon icon-form-checkbox"></i>
                            </div>
                        </label>
                    </li>
                </ul>
            </div>

            <div class="footer" v-if="isShow==1">
                <div class="f-1" @click="publicAction">确认修改</div>
            </div>

        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    var $$ = Dom7;
    import { tabulateStatisticsApi, userApi, wxApi} from '../../../../api';
    import { LocalCache } from '../../../../lib/utils';
    import moment from 'moment';
    var pickerDevicee;
    var calendarInline;
    let monthNames = ['01', '02', '03', '04', '05', '06', '07', '08' , '09' , '10', '11', '12'];
    let dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    let dayNamesShort = ['日', '一', '二', '三', '四', '五', '六'];

    var index2;
    var ids = {};
    export default {
        data(){
            return{
                userInfo: {},
                workerTitle: [],
                isShow: 1,
                typecode: '',
                typename: '',
                upData: [],
                time: '',
                workType: '',
                list: [],
                projectId: '',
                batchNumber: '',
                projNeedList: {},
                projName: '',
                groupId: ''
            }
        },
        methods:{
            addressAction(){
                pickerAddress.open();
            },
            deleteAction(){
                this.isShow = 2;
                this.upData = this.$store.state.upData;
                console.log(this.upData);

            },
            comfirmDeleteAction(){
                ids = {};
                $$('input[name=put]:checked').each((idx, elm)=>{
                    let id = $$(elm).data('id');
                    ids[id] = id;
                    console.log(ids);
                    this.upData = this.upData.filter((item)=>{
                        return !ids[item.workType.split('_')[1]];
                    })
                });
                this.$store.state.upData = this.upData;
                console.log(this.upData);
                this.isShow = 1;
            },
            reduceAction(index){
                let code = $$('.m-3').eq(index).parent().data('id');
                console.log(code);

                for(var i=0; i<this.upData.length; i++){
                    if(this.upData[i].workType.split('_')[1]==code){
                        if(this.upData[i].demandAmount==1){

                        }else{
                            this.upData[i].demandAmount--
                        }
                    }
                }
            },
            addAction(index){
                let code = $$('.m-3').eq(index).parent().data('id');
                console.log(code);

                for(var i=0; i<this.upData.length; i++){
                    if(this.upData[i].workType.split('_')[1]==code){
                        this.upData[i].demandAmount++
                    }
                }
            },
            selectTimeAction(index){
                index2 = index;
                console.log(index2);
                setTimeout(() => {
                    calendarInline.open();
                })
            },
            addTypeAction(){
                console.log('我点击了');
                pickerDevicee.open();
            },
            publicAction(){
                this.list=$$.extend([],this.upData);      //赋值后修改不会改变原数组
                for(var i=0; i<this.list.length; i++){
                    this.list[i].workType = this.list[i].workType.split('_')[1];
                    if(this.list[i].demandTime == ''){
                        this.$f7.alert('请选择工种预计空闲时间');
                        return;
                    }
                }
                console.log('list', this.list);
                console.log('data',this.upData);

                wxApi.addOreditNeedWorker(
                    this.batchNumber,
                    this.projectId,
                    JSON.stringify(this.list)
                ).then((result)=>{
                    console.log(result.data);
                    this.upData = [];
                    this.$store.state.upData = this.upData;
                    this.$router.back();
                })
            }

        },
        mounted(){
            this.batchNumber = this.$route.params.id;
            this.groupId = this.$store.state.roleInfo.groupId;

            if(this.$store.state.projNeedList){
                this.projNeedList = this.$store.state.projNeedList;
                this.projName = this.projNeedList.project.name;
                this.projectId = this.projNeedList.project.id;
            }
            console.log(this.userInfo);
            console.log('项目需求列表',this.projNeedList);
            console.log('项目名',this.projName);

            if(this.$store.state.workerTitle){
                this.workerTitle = this.$store.state.workerTitle;
                pickerDevicee = this.$f7.picker({
                    input: '#picker-devicefive_2',
                    formatValue(p, values, displayValues) {
                        return displayValues;
                    },
                    toolbarTemplate:
                    '<div class="toolbar">' +
                    '<div class="toolbar-inner">' +
                    '<div class="left">' +
                    '<a href="#" class="link close-picker">取消</a>' +
                    '</div>' +
                    '<div class="right"><a href="#" class="link close-picker" id="btnOk">确定</a></div>' +
                    '</div>' +
                    '</div>',
                    onOpen: (p) => {
                        p.container.find('#btnOk').off('click').click(() => {
                            this.typecode = p.cols[0].value;
                            this.typename = p.cols[0].displayValue+'_'+p.cols[0].value;
                            console.log(this.typename);

                            for(var i=0; i<this.upData.length; i++){
                                if(this.upData[i].workType.split('_')[1] == this.typecode){
                                    this.$f7.alert('该工种已被经选择');
                                    return;
                                }
                            }

                            let obj = {
                                workType: this.typename,
                                demandAmount: 1,
                                demandTime: ''
                            }
                            this.upData.push(obj);
                            this.$store.state.upData = this.upData;

                        })
                    },
                    cols: [
                        {
                            textAlign: 'center',
                            values: this.workerTitle.map((one)=>{return one.code}),
                            displayValues: this.workerTitle.map((one)=>{return one.value})
                        }
                    ]
                });
            }else{
                tabulateStatisticsApi.typeSort('workType').then((result)=>{
                    this.workerTitle = result.data.list;
                    this.$store.state.workerTitle = this.workerTitle;
                    console.log(this.workerTitle);
                    pickerDevicee = this.$f7.picker({
                        input: '#picker-devicefive_2',
                        formatValue(p, values, displayValues) {
                            return displayValues;
                        },
                        toolbarTemplate:
                        '<div class="toolbar">' +
                        '<div class="toolbar-inner">' +
                        '<div class="left">' +
                        '<a href="#" class="link close-picker">取消</a>' +
                        '</div>' +
                        '<div class="right"><a href="#" class="link close-picker" id="btnOk">确定</a></div>' +
                        '</div>' +
                        '</div>',
                        onOpen: (p) => {
                            p.container.find('#btnOk').off('click').click(() => {
                                this.typecode = p.cols[0].value;
                                this.typename = p.cols[0].displayValue+'_'+p.cols[0].value;
                                console.log(this.typename);

                                for(var i=0; i<this.upData.length; i++){
                                    if(this.upData[i].workType.split('_')[1] == this.typecode){
                                        this.$f7.alert('该工种已被经选择');
                                        return;
                                    }
                                }

                                let obj = {
                                    workType: this.typename,
                                    demandAmount: 1,
                                    demandTime: ''
                                }
                                this.upData.push(obj);
                                this.$store.state.upData = this.upData;

                            })
                        },
                        cols: [
                            {
                                textAlign: 'center',
                                values: this.workerTitle.map((one)=>{return one.code}),
                                displayValues: this.workerTitle.map((one)=>{return one.value})
                            }
                        ]
                    });
                })
            }

            if(this.$store.state.projNeedList){
                for(var i=0; i<this.projNeedList.workDemandList.length; i++){
                    let obj = {
                        workType: this.projNeedList.workDemandList[i].workType,
                        demandAmount: this.projNeedList.workDemandList[i].demandAmount,
                        demandTime: this.projNeedList.workDemandList[i].demandTime
                    }
                    this.upData.push(obj);
                }
                this.$store.state.upData = this.upData;
                console.log('列表one',this.upData);
            }else{
                wxApi.getEditContent(this.batchNumber).then((result)=>{
                    console.log('列表',result.data);
                    for(var i=0; i<result.data.length; i++){
                        this.projectId = result.data[i].projectId;

                        for (var j = 0; j < this.workerTitle.length; j++) {
                            if (result.data[i].workType == this.workerTitle[j].code) {
                                let obj = {
                                    workType: this.workerTitle[j].value+'_'+this.workerTitle[j].code,
                                    demandAmount: result.data[i].demandAmount,
                                    demandTime: result.data[i].demandTime
                                }
                                this.upData.push(obj);
                            }
                        }
                    }
                    this.$store.state.upData = this.upData;
                    console.log('列表one',this.upData);
                })
            }

            var that = this;
            calendarInline = this.$f7.calendar({
                input: '#calendar-defaultsix_2',
                dateFormat: 'yyyy-MM-dd',
                monthNames, dayNames, dayNamesShort,
                onDayClick(p, dayContainer, year, month, day) {
                    let $day = moment().year(year).month(month).date(day).format('YYYY-MM-DD');

                    let code = $$('.m-3').eq(index2).parent().data('id');
                    for(var i=0; i<that.upData.length; i++){
                        if(that.upData[i].workType.split('_')[1]==code){
                            that.upData[i].demandTime = $day;
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
        width: 100%; height: 100%; background: #f4f4f4; position: relative;
    }
    .head{
        width: 100%; height: 2rem; line-height: 2rem; box-sizing: border-box; padding-left: 0.6rem; font-size: 0.8rem; color: #438CFF;
        overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }

    .nav{
        width: 100%; height: 2rem; line-height: 2rem; display: flex; justify-content: space-between; box-sizing: border-box;
        padding: 0 0.6rem; border-bottom: 1px solid #f4f4f4; background: #fff; margin-top: 0.4rem;
    }
    .nav .left{
        flex: 1; font-size: 0.7rem; color: #666666;
    }
    .nav .right{
        width: 8rem; display: flex; justify-content: space-between;
    }
    .nav .right .r-1{
        width: 3rem; height: 2rem; text-align: center;
    }
    .nav .right .r-1 img{
        width: 1.85rem; height: 0.55rem; display: inline;
    }
    .nav .right .r-3{
        width: 2.5rem; height: 0.9rem; line-height: 0.9rem; text-align: center; border: 1px solid #438CFF; border-radius: 0.45rem; font-size: 0.4rem; color: #438CFF; margin-top: 0.5rem;
    }
    .nav .right .r-2{
        width: 3.25rem; height: 1.1rem; line-height: 1.1rem; text-align: center; background: #438CFF; color: #fff; font-size: 0.55rem;
        border-radius: 0.55rem; margin-top: 0.45rem; position: relative;
    }
    .nav .right .r-2 .cover{
        width: 100%; height: 100%;
    }
    .nav .right .r-2 .down{
        width: 100%; height: 100%; position: absolute; left: 0; top: 0; right: 0; bottom: 0; opacity: 0;
    }
    .nav .right .r-2 .down input{
        width: 100%;
    }

    .main{
        background: #fff;
    }
    .main .aul{

    }
    .main .aul li{
        width: 100%; height: 2.5rem; line-height: 2.5rem; display: flex; font-size: 0.7rem; box-sizing: border-box; padding: 0 0.6rem;
        border-bottom: 1px solid #f4f4f4;
    }
    .main .aul li .m-1{
        min-width: 4.25rem; color: #666666;
    }
    .main .aul li .m-2{
        width: 2rem; height: 2.5rem; text-align: center;
    }
    .main .aul li .m-2 img{
        width: 1.01rem; height: 1.01rem; display: inline-block; margin-top: 0.7rem;
    }
    .main .aul li .m-3{
        width: 2.1rem; height: 0.9rem; line-height: 0.9rem; text-align: center; font-size: 0.65rem; color: #888; border: 1px solid #E1E1E1;
        border-radius: 0.1rem; margin-top: 0.75rem;
    }
    .main .aul li .m-4{
        position: relative;
    }
    .main .aul li .m-4 .left{

    }
    .main .aul li .m-4 .left span{
        color: #438CFF;
    }
    .main .aul li .m-4 .left img{
        width: 0.6rem; height: 0.65rem;
    }
    .main .aul li .m-4 .right{
        position: absolute; left: 0; top: 0; right: 0; bottom: 0; opacity: 0;
    }
    .main .aul li .m-4 .right input{
        width: 100%;
    }

    .main .aul2 li{
        border-bottom: 1px solid #f4f4f4;
    }
    .main .aul2 li .item-content{
        width: 100%; display: flex; height: 2.5rem; line-height: 2.5rem;
    }
    .main .aul2 li .item-content .item-inner{
        width: 100%; display: flex; box-sizing: border-box; padding: 0 0.6rem;
    }
    .main .aul2 li .item-content .item-inner .m-1{
        min-width: 4.3rem; color: #666666;
    }
    .main .aul2 li .item-content .item-inner .m-2{
        width: 2rem; height: 2.5rem; text-align: center;
    }
    .main .aul2 li .item-content .item-inner .m-2 img{
        width: 1.01rem; height: 1.01rem; display: inline-block; margin-top: 0.7rem;
    }
    .main .aul2 li .item-content .item-inner .m-3{
        width: 2.1rem; height: 0.9rem; line-height: 0.9rem; text-align: center; font-size: 0.65rem; color: #888; border: 1px solid #E1E1E1;
        border-radius: 0.1rem; margin-top: 0.75rem;
    }
    .main .aul2 li .item-content .item-inner .m-4 span{
        color: #438CFF;
    }
    .main .aul2 li .item-content .item-inner .m-4 img{
        width: 0.6rem; height: 0.65rem;
    }
    .main .aul2 li .item-content .item-media{
        width: 2.2rem;
    }
    .main .aul2 li .item-content .item-media .icon{
        width: 0.8rem; height: 0.8rem; margin-top: 0.75rem;
    }

    .footer{
        width: 100%; height: 2.5rem; background: #fff; position: fixed; left: 0; bottom: 0;
    }
    .footer .f-1{
        margin: 0.5rem auto; width: 90%; height: 1.5rem; line-height: 1.5rem; text-align: center; border-radius: 0.75rem; color: #fff; background: #438CFF;
    }
</style>