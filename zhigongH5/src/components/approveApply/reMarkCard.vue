<template>
    <div>
        <div class="up">
            <div class="p">
                <div class="left">补卡项目</div>
                <div class="right" @click.stop.prevent="selectProj">
                    <div class="shan">{{this.projName}}</div>
                    <input type="text" id="pickerseven" placeholder="请选择（必选项）" readonly/>
                </div>
                <img src="../../../static/img/btn_more.png"/>
            </div>
            <div class="p">
                <div class="left">补卡类型</div>
                <div class="right" @click.stop.prevent="selectTypeName">
                    <div class="shan">{{this.typeName}}</div>
                    <input type="text" id="picker-cardType" placeholder="请选择（必选项）" readonly/>
                </div>
                <img src="../../../static/img/btn_more.png"/>
            </div>
            <div class="Q">
                <div class="left">补卡日期</div>
                <div class="right" @click.stop.prevent="selectDate">
                    <input type="text" id="calendar-dft" placeholder="请选择（必选项）" readonly/>
                </div>
                <img src="../../../static/img/rili.png"/>
            </div>
            <div class="pq">
                <input class='none' type="text" id="picker-time" placeholder="请选择具体时间（必选项）" readonly/>
                <div class="r" v-for="(item, index) in sum">
                    <div class="left">补卡时间{{index+1}}</div>
                    <div class="right" @click.stop.prevent="selectTimeAction(index)">
                        <input type="text" name="time" :data-id="index" placeholder="请选择具体时间（必选项）" readonly/>
                    </div>
                    <img src="../../../static/img/btn_more.png"/>
                </div>
            </div>
            <div class="addTime" @click="addTimeAction">
                <img class="timgImg" src="../../../static/img/addTime.png"/>
                <span class="addText">添加补卡时间</span>
            </div>
        </div>
        <div class="cent">
            <div class="top">补卡详情</div>
            <textarea class="down" v-model="dutyRemark"></textarea>
        </div>

        <div class="footer" @click=submitAction>提交</div>
    </div>
</template>

<script>
    var $$ = Dom7, pickerProj, calendarInline, cardType, pickerTime, applyDate = '';
    let monthNames = ['01', '02', '03', '04', '05', '06', '07', '08' , '09' , '10', '11', '12'];
    let dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    let dayNamesShort = ['日', '一', '二', '三', '四', '五', '六'];
    import moment from 'moment';
    import {projectApi, dutyApi} from "../../api";
    export default {
        name: "reMarkCard",
        data(){
            return{
                companyId: '',
                projList: [],
                projectId: '',
                cardTypeList: [],
                cardTypeCode: '',
                startTime: '',
                endTime: '',
                auditUserList: [],
                dutyRemark: '',
                dutyTime: [],
                oneTime: '',
                sum: 2,
                projName: '请选择补卡项目',
                typeName: '请选择补卡类型'
            }
        },
        methods:{
            selectProj(){
                pickerProj.open();
            },
            selectTypeName(){
                cardType.open();
            },
            selectDate(){
                calendarInline.open();
            },
            selectTimeAction(index){
                this.cardTime(index);
            },
            addTimeAction(){
                this.sum++
            },
            submitAction(){
                if(this.projectId == ''){
                    this.$f7.alert('请选择补卡项目');
                    return;
                }
                if(this.cardTypeCode == ''){
                    this.$f7.alert('请选择补卡类型');
                    return;
                }
                if(applyDate == ''){
                    this.$f7.alert('请选择补卡时间');
                    return;
                }

                this.dutyTime = [];
                $$('input[name=time]').each((xls, elm)=>{
                        if($$(elm).val() != ''){
                        this.dutyTime.push($$(elm).val());
                    }
                })
                if(this.dutyTime.length == 0){
                    this.$f7.alert('请选择补卡时间');
                    return;
                }
                console.log(this.companyId, this.projectId, this.cardTypeCode, applyDate, this.dutyTime.join(','), this.dutyRemark);
                dutyApi.applyAttendApproval(
                    this.projectId,
                    this.cardTypeCode,
                    applyDate,
                    this.dutyTime.join(','),
                    this.dutyRemark
                ).then((result)=>{
                    console.log('申请成功',result.data);

                    this.projectId = '';
                    this.typeName = '请选择补卡项目';
                    this.cardTypeCode = '';
                    this.typeName = '请选择补卡类型';
                    applyDate = '';
                    $$('#calendar-dft').val('');
                    this.dutyTime = [];
                    $$('input[name=time]').each((xls, elm)=>{
                        $$(elm).val('');
                    })
                    this.dutyRemark = '';

                    this.$emit('getIsShow');
                })
            },
            cardTime(index){
                pickerTime = this.$f7.picker({
                    input: '#picker-time',
                    toolbarTemplate:
                    '<div class="toolbar">' +
                    '<div class="toolbar-inner">' +
                    '<div class="left">' +
                    '<a href="#" class="link close-picker">取消</a>' +
                    '</div>' +
                    '<div class="right"><a href="#" class="link close-picker" id="btnOk">确定</a></div>' +
                    '</div>' +
                    '</div>',
                    onChange:  (p)=>{
                        console.log(p.cols[0].value, p.cols[1].value);
                        $$('input[name=time]').each((xls, elm)=>{
                            if($$(elm).data('id')==index){
                                console.log($$(elm).data('id'),index);
                                $$(elm).val(p.cols[0].value + p.cols[1].value);
                            }
                        })
                    },
                    cols: [
                        {
                            textAlign: 'center',
                            values: (()=>{
                                var arr2 = [];
                                for (var i = 0; i <= 24; i++) { arr2.push(i<10?'0'+i+':':i+':'); }
                                return arr2;
                            })()
                        },
                        {
                            values: (()=>{
                                var arr2 = [];
                                for (var i = 0; i <= 59; i++) { arr2.push(i<10?'0'+i:i); }
                                return arr2;
                            })()
                        }
                    ]
                })
                pickerTime.open();
            }
        },
        mounted(){
            this.companyId = this.$store.state.roleInfo.companyId;
            projectApi.userProjs().then((result)=>{
                console.log('用户所在的所有项目',result.data);
                this.projList = result.data;
                pickerProj = this.$f7.picker({
                    input: '#pickerseven',
                    toolbarTemplate:
                    '<div class="toolbar">' +
                    '<div class="toolbar-inner">' +
                    '<div class="left">' +
                    '<a href="#" class="link close-picker">取消</a>' +
                    '</div>' +
                    '<div class="right"><a href="#" class="link close-picker" id="btnOk">确定</a></div>' +
                    '</div>' +
                    '</div>',
                    onOpen:  (p)=>{
                        p.container.find('#btnOk').click(()=> {
                            this.projectId = pickerProj.cols[0].value;
                            this.projName = pickerProj.cols[0].displayValue;
                            console.log(this.projectId, this.projName);

                            dutyApi.getAuditUserList(this.companyId, this.projectId).then((result)=> {
                                console.log('获取审批人列表', result.data);
                                this.auditUserList = result.data;
                            })
                        })
                    },
                    cols: [
                        {
                            textAlign: 'center',
                            values: this.projList.map((project)=>{return project.id}),
                            displayValues: this.projList.map((project)=>{return project.name}),
                        }
                    ]
                });
            })
            dutyApi.cardType().then((result)=>{
                console.log('补卡类型',result.data);
                this.cardTypeList = result.data;
                cardType = this.$f7.picker({
                    input: '#picker-cardType',
                    toolbarTemplate:
                    '<div class="toolbar">' +
                    '<div class="toolbar-inner">' +
                    '<div class="left">' +
                    '<a href="#" class="link close-picker">取消</a>' +
                    '</div>' +
                    '<div class="right"><a href="#" class="link close-picker" id="btnOk">确定</a></div>' +
                    '</div>' +
                    '</div>',
                    onOpen:  (p)=>{
                        p.container.find('#btnOk').click(()=>{
                            this.cardTypeCode = cardType.cols[0].value;
                            this.typeName = cardType.cols[0].displayValue;
                            console.log(this.cardTypeCode, $$('#picker-cardType').val());
                        })
                    },
                    cols: [
                        {
                            textAlign: 'center',
                            values: this.cardTypeList.map((item)=>{return item.id}),
                            displayValues: this.cardTypeList.map((item)=>{return item.name}),
                        }
                    ]
                })
            })

            calendarInline = this.$f7.calendar({
                input: '#calendar-dft',
                dateFormat: 'yyyy-MM-dd',
                monthNames, dayNames, dayNamesShort,
                onDayClick(p, dayContainer, year, month, day) {
                    let $day = moment().year(year).month(month).date(day).format('YYYY-MM-DD');
                    applyDate = $day;
                    $$('#calendar-dft').val(applyDate);
                    console.log(applyDate);
                    p.close();
                    // this.$f7.closeModal();
                }
            });

        }
    }
</script>

<style scoped>
    .up{
        box-sizing: border-box; padding: 0 28px 0 12px; background: #fff; overflow: hidden; margin-top: 5px;
    }
    .up .p{
        width: 100%; height: 2rem; line-height: 2rem; display: flex; position: relative; margin: 5px 0 10px 0;
    }
    .up .p img{
        width: 0.9rem; height: 0.9rem; position: absolute; right: 10px; top: 12px;
    }
    .up .p .left{
        width: 3.2rem; font-size: 0.7rem; color: #666;
    }
    .up .p .right{
        flex: 1; height: 2rem;
    }
    .up .p .right .shan{
        width: 100%; height: 2rem; border: 1px solid #f4f4f4; font-size: 0.7rem; color: #666;
        box-sizing: border-box; padding: 0 1rem 0 0.5rem; overflow: hidden;
    }
    .up .p .right input{
        width: 100%; height: 2rem; border: 1px solid #f4f4f4;
        position: absolute; left: 0; top: 0; right: 0; bottom: 0; z-index: -1;
    }
    .up .Q{
        width: 100%; height: 2rem; line-height: 2rem; display: flex; position: relative; margin: 5px 0 10px 0;
    }
    .up .Q img{
        width: 0.9rem; height: 0.9rem; position: absolute; right: 10px; top: 12px;
    }
    .up .Q .left{
        width: 3.2rem; font-size: 0.7rem; color: #666;
    }
    .up .Q .right{
        flex: 1; height: 2rem;
    }
    .up .Q .right input{
        width: 100%; height: 2rem; border: 1px solid #f4f4f4; box-sizing: border-box; padding-left: 0.5rem; font-size: 0.7rem; color: #666;
    }
    .up .pq .none{
        display: none;
    }
    .up .pq .r{
        width: 100%; height: 2rem; line-height: 2rem; display: flex; position: relative; margin: 5px 0 10px 0;
    }
    .up .pq .r img{
        width: 0.9rem; height: 0.9rem; position: absolute; right: 10px; top: 12px;
    }
    .up .pq .r .left{
        width: 3.5rem; font-size: 0.7rem; color: #666;
    }
    .up .pq .r .right{
        flex: 1; height: 2rem;
    }
    .up .pq .r .right input{
        width: 100%; height: 2rem; border: 1px solid #f4f4f4; box-sizing: border-box; padding-left: 0.5rem;
    }

    .up .addTime{
        width: 100%; height: 24px; text-align: right;
    }
    .up .addTime .timgImg{
        width: 0.65rem; height: 0.65rem; display: inline; transform: translateY(3px);
    }
    .up .addTime .addText{
        font-size: 0.45rem; color: #999;
    }

    .cent{
        box-sizing: border-box; padding: 0 0.6rem; background: #fff; margin-top: 5px;
    }
    .cent .top{
        width: 100%; height: 32px; line-height: 32px; font-size: 0.7rem; color: #666;
    }
    .cent .down{
        width: 100%; height: 90px; margin-bottom: 0.6rem;
    }

    .footer{
        width: 108px; height: 2rem; line-height: 2rem; text-align: center; font-size: 0.7rem; color: #fff; border-radius: 5px;
        background: #438CFF; margin: 2rem auto;
    }
</style>