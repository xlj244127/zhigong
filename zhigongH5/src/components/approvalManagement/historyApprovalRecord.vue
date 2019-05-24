<template>
   <div>
       <ul class="aul">
           <li>
               <div class="hd">
                   <input class="picker" id="picker-toolbar17" readonly/>
               </div>
               <div class="hd2" @click.stop.prevent="applayAction">
                   <span class="h-1 h3">{{typeName2}}</span>
                   <img class="h-2" src="../../../static/img/xiala_.icom.png"/>
               </div>
           </li>
           <li class="pickerResult">
               <div class="hd">
                   <input class="picker" readonly/>
               </div>
               <div class="hd2" @click.stop.prevent="selectResultAction">
                   <span class="h-1 h3">{{applyResult}}</span>
                   <img class="h-2" src="../../../static/img/xiala_.icom.png"/>
               </div>
           </li>
           <li>
               <div class="hd">
                   <input class="picker" id="picker-device13" readonly/>
               </div>
               <div class="hd2" @click.stop.prevent="selectTimeAction">
                   <span class="h-1 h4">{{typeTime}}</span>
                   <img class="h-2" src="../../../static/img/xiala_.icom.png"/>
               </div>
           </li>
       </ul>
       <div class="box" v-for="item in historyAuditList">
           <div class="b">
               {{item.userName}}
           </div>
           <ul>
               <li><span>联系电话:</span>&nbsp;&nbsp;<span>{{item.userMobile}}</span></li>
               <li><span>申请人身份:</span>&nbsp;&nbsp;<span>{{item.roleName}}</span></li>
               <li><span>申请项目:</span>&nbsp;&nbsp;<span>{{item.projectName}}</span></li>
               <li><span>申请类型:</span>&nbsp;&nbsp;<span>{{item.dutyTypeName}}</span></li>
               <li><span>补卡日期:</span>&nbsp;&nbsp;<span>{{item.dutyDate}}</span></li>
               <li><span>补卡时间:</span>&nbsp;&nbsp;<span>{{item.dutyTimes}}</span></li>
               <li><span>补卡详情:</span>&nbsp;&nbsp;<span>{{item.dutyRemark}}</span></li>
               <li><span class="gray">申请时间:</span>&nbsp;&nbsp;<span class="gray">{{item.createTime}}</span></li>
               <li><span class="gray">审批时间:</span>&nbsp;&nbsp;<span class="gray">{{item.auditTime}}</span></li>
           </ul>
           <div class="x">
               <div class="x-1" v-show="item.isAudit==2">
                   <div class="one">理由</div>
                   <div class="two">&nbsp;  &nbsp;  &nbsp; &nbsp;<span>{{item.auditRemark}}</span></div>
               </div>
               <div class="x-2"><span>审批人:</span>&nbsp;&nbsp;<span>{{item.auditName}}</span></div>
           </div>
           <img class="fixImg" v-show="item.isAudit==1" src="../../../static/img/pass.png"/>
           <img class="fixImg" v-show="item.isAudit==2" src="../../../static/img/noPass.png"/>
       </div>
       <!--上传身份证正面照的两种方式-->
       <div class="popover popover-link">
           <div class="popover-angle"></div>
           <div class="popover-inner">
               <div class="list-block">
                   <ul>
                       <li @click="passAction"><a href="#" class="list-button item-link">通过审批</a></li>
                       <li @click="unPassAction"><a href="#" class="list-button item-link">未通过审批</a></li>
                   </ul>
               </div>
           </div>
       </div>
   </div>
</template>

<script>
    var $$ = Dom7;
    var calendarInline, applayFor;
    import moment from 'moment';
    let monthNames = ['01', '02', '03', '04', '05', '06', '07', '08' , '09' , '10', '11', '12'];
    let dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    let dayNamesShort = ['日', '一', '二', '三', '四', '五', '六'];
    import {projectApi, dutyApi} from "../../api";
    export default {
        name: "historyApprovalRecord",
        data(){
            return{
                is: 2,
                groupWorkType: [],
                companyId: '',
                pageSize: 3,
                dutyTypeName: '',
                searchDate: ''
            }
        },
        props: ['historyAuditList','totalPages2', 'typeName2', 'isAudit', 'auditType', 'applyResult', 'typeTime', 'page'],
        methods:{
            applayAction(){
                applayFor.open();
            },
            selectResultAction(){
                this.$f7.popover('.popover-link', '.pickerResult');
            },
            selectTimeAction(){
                calendarInline.open();
            },
            passAction(){
                this.$f7.closeModal('.popover-link');
                this.isAudit = 1;
                this.applyResult = '通过审批';
                this.approvalRecord();
            },
            unPassAction(){
                this.$f7.closeModal('.popover-link');
                this.isAudit = 2;
                this.applyResult = '未通过审批';
                this.approvalRecord();
            },
            approvalRecord(){
                this.page = 1;
                dutyApi.auditList(this.companyId, this.page, this.pageSize, this.isAudit, this.auditType, 1, this.searchDate).then((result)=>{
                    console.log('已审批列表',result.data);
                    this.totalPages2 = result.data.totalPages;
                    this.historyAuditList = result.data.list;
                    this.historyAuditList.map((res)=>{
                        res.createTime = moment(res.createTime).format('YYYY-MM-DD, HH:mm');
                        if(res.auditTime){
                            res.auditTime = moment(res.auditTime).format('YYYY-MM-DD, HH:mm');
                        }
                    })
                })
            }
        },
        mounted(){
            this.companyId = this.$store.state.roleInfo.companyId;
            console.log('进入了历史页面',this.companyId);

            //选择日期
            var that = this;
            calendarInline = this.$f7.calendar({
                input: '#calendar-default13',
                dateFormat: 'yyyy-MM-dd',
                monthNames, dayNames, dayNamesShort,
                onDayClick(p, dayContainer, year, month, day) {
                    let $day = moment().year(year).month(month).date(day).format('YYYY-MM-DD');
                    that.typeTime = $day;
                    that.searchDate = $day;
                    that.approvalRecord();

                    p.close();
                    that.$f7.closeModal();
                }
            });
            dutyApi.cardType().then((result)=> {
                console.log(result.data);
                this.groupWorkType = result.data;

                applayFor = this.$f7.picker({        //申请类容
                    input: '#picker-device13',
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
                    onChange: (p) => {
                        $$('#btnOk').off('click').click(() => {
                            this.auditType = p.cols[0].value;
                            this.typeName2 = p.cols[0].displayValue;
                            console.log('事件code', this.auditType);
                            this.approvalRecord();
                        })
                    },
                    cols: [
                        {
                            textAlign: 'center',
                            values: this.groupWorkType.map((three) => {
                                return three.id
                            }),
                            displayValues: this.groupWorkType.map((three) => {
                                return three.name
                            })
                        }
                    ]
                });
            })

            var loading = false;
            $$('.infinite-scroll').on('infinite', ()=>{
                if(loading) return;
                loading = true;

                setTimeout(()=>{
                    this.page++;
                    console.log('我被点击了',this.page,this.totalPages2);
                    loading = false;

                    if (this.page <= this.totalPages2) {
                        dutyApi.auditList(this.companyId, this.page, this.pageSize, this.isAudit, this.auditType, 1, this.searchDate).then((result)=>{
                            console.log('已审批列表',result.data);
                            result.data.list.map((res)=>{
                                res.createTime = moment(res.createTime).format('YYYY-MM-DD, HH:mm');
                                if(res.auditTime){
                                    res.auditTime = moment(res.auditTime).format('YYYY-MM-DD, HH:mm');
                                }
                            })
                            this.historyAuditList = this.historyAuditList.concat(result.data.list);
                            console.log('排序后',this.historyAuditList);
                        })
                    }
                }, 1000);
            })

        }
    }
</script>

<style scoped>
    .popover{
        width: 130px; left: 140px;
    }
    .aul{
        width: 100%; display: flex; background: #fff; margin-top: 5px;
    }
    .aul li{
        width: 50%; height: 2rem; line-height: 2rem; font-size: 0.8rem; color: #999; border: 1px solid #f4f4f4; position: relative;
    }
    .aul li:last-of-type{
        border-right: none;
    }
    .aul li .hd{
        width: 100%;
    }
    .aul li .hd .picker{
        width: 100%; height: 2rem; border: none; position: absolute; left: 0; top: 0; right: 0; bottom: 0; opacity: 0; z-index: -1;
    }
    .aul li .hd2{
        width: 100%; height: 2rem; line-height: 2rem; text-align: center; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .aul li .hd2 .h-1{
        font-size: 0.7rem; color: #999;
    }
    .aul li .hd2 .h-2{
        width: 0.5rem; height: 0.5rem; display: inline;
    }

    .box{
        width: 100%; background: #fff; box-sizing: border-box; padding: 0 0.6rem; margin-bottom: 10px; position: relative;
    }
    .box:first-of-type{
        margin-top: 5px;
    }
    .box .b{
        width: 100%; height: 35px; line-height: 35px; border-bottom: 1px solid #91BFF9; font-size: 0.65rem; color: #438CFF;
        box-sizing: border-box; padding: 0 0.6rem;
    }
    .box ul li{
        width: 100%; height: 20px; line-height: 20px; font-size: 0.5rem; color: #666; box-sizing: border-box; padding-left: 8px;
        overflow: hidden; text-overflow: ellipsis; white-space: normal;
    }
    .box ul li .gray{
        color: #AAAAAA;
    }
    .box .x{
        width: 100%; min-height: 1rem; border-top: 1px solid #91BFF9;
    }
    .box .x .x-1{
        width: 100%; display: flex; padding: 10px 0;
    }
    .box .x .x-1 .one{
        width: 25px; height: 15px; line-height: 15px; text-align: center; background: #F57979; font-size: 0.45rem; color: #fff; border-radius: 2px;
        margin-left: 8px
    }
    .box .x .x-1 .two{
        flex: 1; font-size: 0.5rem; color: #EF7373; padding-left: 10px;
    }
    .box .x .x-2{
        width: 100%; height: 1rem; line-height: 1rem; box-sizing: border-box; padding-right: 0.6rem; text-align: right; font-size: 0.5rem; color: #999;
    }
    .box .fixImg{
        width: 70px; height: 60px; position: absolute; right: 40px; top: 62px;
    }
</style>