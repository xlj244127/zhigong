<template>
    <div class="main">
        <div class="top">
            <div class="left">审批详情列表</div>
            <div class="right" @click.stop.prevent="alertAction">
                <div class="r-1">
                    <span class="select">{{typeName}}</span>
                    <img src="../../../static/img/btn_drop_down.png"/>
                </div>
                <div class="r-2">
                    <input type="text" v-model='event' readonly id="calenda-dt">
                </div>
            </div>
        </div>
        <div class="box" v-for="item in auditList">
            <div class="b">
                <div class="b-1">{{item.userName}}</div><div class="b-2"><span>{{item.dutyTypeName}}</span></div>
            </div>
            <ul>
                <li><span>联系电话:</span>&nbsp;&nbsp;<span>{{item.userMobile}}</span></li>
                <li><span>申请人身份:</span>&nbsp;&nbsp;<span>{{item.roleName}}</span></li>
                <li><span>申请项目:</span>&nbsp;&nbsp;<span>{{item.projectName}}</span></li>
                <li><span>补卡日期:</span>&nbsp;&nbsp;<span>{{item.dutyDate}}</span></li>
                <li><span>补卡时间:</span>&nbsp;&nbsp;<span>{{item.dutyTimes}}</span></li>
                <li><span>补卡详情:</span>&nbsp;&nbsp;<span>{{item.dutyRemark}}</span></li>
                <li><span class="gray">申请时间:</span>&nbsp;&nbsp;<span class="gray">{{item.createTime}}</span></li>
            </ul>
            <div class="x">
                <div class="x-1" @click="rejectedAction(item.id)">审批不通过</div><div class="x-2" @click="approveAction(item.id)">审批通过</div>
            </div>
        </div>
    </div>
</template>

<script>
    var $$ = Dom7, pickerFiltrate;
    import {dutyApi} from "../../api";
    import moment from 'moment';

    export default {
        name: "approvalManagement",
        data(){
            return{
                companyId: '',
                pageSize: 3,
                event: '所有',
                groupWorkType: [],
                auditType: ''
            }
        },
        props: ['auditList', 'totalPages', 'typeName', 'page'],
        methods:{
            alertAction(){
                pickerFiltrate.open();
            },
            rejectedAction(id){
                this.$f7.prompt('请输入审批不通过的原因?', (value)=>{
                    console.log(value);
                    dutyApi.isPassAudit(id, 2, value).then((result)=> {
                        console.log(result.data)
                        this.pageList2();
                    })
                });
            },
            approveAction(id){
                this.$f7.confirm('是否确认通过审批?', ()=>{
                    dutyApi.isPassAudit(id, 1).then((result)=> {
                        console.log(result.data)
                        this.pageList2();
                    })
                });
            },
            pageList2(){
                this.page = 1;
                dutyApi.auditList(this.companyId, this.page, this.pageSize, 0, this.auditType).then((result)=>{
                    console.log('未审批列表',result.data);
                    this.totalPages = result.data.totalPages;
                    this.auditList = result.data.list;
                    this.auditList.map((res)=>{
                        res.createTime = moment(res.createTime).format('YYYY-MM-DD, HH:mm');
                    })
                })
            }
        },
        mounted(){
            this.companyId = this.$store.state.roleInfo.companyId;
            dutyApi.cardType().then((result)=>{
                console.log(result.data);
                this.groupWorkType = result.data;

                pickerFiltrate = this.$f7.picker({        //申请类容
                    input: '#calenda-dt',
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
                            this.typeName = p.cols[0].displayValue;
                            console.log('事件code', this.auditType);
                            this.pageList2();
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
                    console.log('我被点击了',this.page);
                    loading = false;

                    if (this.page <= this.totalPages) {
                        dutyApi.auditList(this.companyId, this.page, this.pageSize, 0).then((result)=>{
                            console.log('未审批列表',result.data);
                            result.data.list.map((res)=>{
                                res.createTime = moment(res.createTime).format('YYYY-MM-DD, HH:mm');
                            })
                            this.auditList = this.auditList.concat(result.data.list);
                            console.log('排序后',this.auditList);
                        })
                    }
                }, 1000);
            })

        }

    }
</script>

<style scoped>
    .main{
        margin-top: 5px;
    }
    .top{
        width: 100%; height: 2rem; box-sizing: border-box; padding: 0 0.6rem; border-bottom: 1px solid #f4f4f4;
        display: flex; justify-content: space-between; background: #fff;
    }
    .top .left{
        line-height: 2rem; font-size: 0.7rem; color: #999;
    }
    .top .right{
        height: 2rem; width: 6rem; display: flex; position: relative;
    }
    .top .right .r-1{
        width: 6rem; height: 2rem; line-height: 2rem; text-align: right; font-size: 0.6rem; color: #AAA;
    }
    .top .right .r-1 img{
        width: 0.6rem; height: 0.6rem; display: inline-block;
    }
    .top .right .r-2{
        width: 6rem; height: 2rem; position: absolute; left: 0; top: 0; opacity: 0; z-index: -1;
    }
    .top .right .r-2 input{
        line-height: 2rem; border: none; text-align: right;
    }

    .box{
        width: 100%; background: #fff; box-sizing: border-box; padding: 0 0.6rem; margin-bottom: 5px;
    }
    .box .b{
        width: 100%; height: 35px; line-height: 35px; display: flex; justify-content: space-between; border-bottom: 1px solid #91BFF9;
    }
    .box .b .b-1{
        font-size: 0.65rem; color: #438CFF;
    }
    .box .b .b-2{
        font-size: 0.45rem; color: #666;
    }
    .box .b .b-2 span{
        box-sizing: border-box; padding: 3px 6px; background: #ECF3FA;
    }
    .box ul li{
        width: 100%; height: 20px; line-height: 20px; font-size: 0.5rem; color: #666; box-sizing: border-box; padding-left: 8px;
        overflow: hidden; text-overflow: ellipsis; white-space: normal;
    }
    .box ul li .gray{
        color: #AAAAAA;
    }
    .box .x{
        width: 100%; height: 2.5rem; border-top: 1px solid #A5B3C3; display: flex; justify-content: space-around;
    }
    .box .x div{
        width: 75px; height: 22px; line-height: 22px; text-align: center; font-size: 0.55rem; border-radius: 0.55rem;
        margin-top: 0.6rem;
    }
    .box .x .x-1{
        color: #438CFF; border: 1px solid #438CFF;
    }
    .box .x .x-2{
        color: #fff; background: linear-gradient(to top, #297BE1, #91BFF9);
    }
</style>