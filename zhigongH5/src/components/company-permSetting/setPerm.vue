<template>
    <div>
        <div class="nav">
            <div class="left">部门权限列表</div>
            <div class="right" @click.stop.prevent="selectAction">
                <div class="cover">
                    <span class="h3">全部</span>
                    <img src="../../../static/img/btn_drop_down.png"/>
                </div>
                <div class="down">
                    <input type="text" id="devicefive_11" readonly/>
                </div>
            </div>
        </div>
        <div class="cent">
            <div class="c">
                <div>部门</div><div>职务</div><div>权限</div><div>设置权限</div>
            </div>
            <div class="t">
                <ul>
                    <li v-for="item in positions">
                        <div class="t-1">{{item.department.departmentName}}</div>
                        <div class="t-1">{{item.positionsName}}</div>
                        <div class="t-2">
                            <span class="span2" v-show="item.postionspermissionsList.length==3" v-for="one in item.postionspermissionsList" v-if="one.isenble==1"><i>{{one.permissionsName}}</i><br/></span>
                        </div>
                        <div class="t-3" @click="enterSetPerm(item)">
                            <img src="../../../static/img/bainji@2x.png"/>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    var $$ = Dom7;
    var pickerDevicee;
    import { rightsApi } from '../../api';
    export default {
        name: "setPerm",
        data(){
            return{
                sum: ['审批管理','审批管理','审批管理'],

                page: '',
                pageSize: '',
                departments: [],
                departmentId: '',
                departmentName: ''
            }
        },
        props:["positions"],
        methods:{
            selectAction(){
                console.log('我点击了');
                pickerDevicee.open();
            },
            enterSetPerm(item){
                this.$router.load({url: '/company/setPerm'});
                this.$store.state.oneDepartmentPerm = item.postionspermissionsList;
                console.log(item.postionspermissionsList);
            }
        },
        mounted(){
            this.companyId = this.$store.state.roleInfo.companyId;
            rightsApi.getDepartments(this.companyId, 0).then((result)=>{
                console.log(result.data);
                this.departments = result.data;

                pickerDevicee = this.$f7.picker({
                    input: '#devicefive_11',
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
                            this.departmentId = p.cols[0].value;
                            this.departmentName = p.cols[0].displayValue;
                            $$('.h3').text(this.departmentName);
                            console.log(this.departmentName);
                            rightsApi.getPermissionListPage(this.companyId, this.page, this.pageSize, this.departmentId).then((result)=>{
                                console.log('指定部门',result.data.list);
                                this.positions = result.data.list;
                            })
                        })
                    },
                    cols: [
                        {
                            textAlign: 'center',
                            values: this.departments.map((one)=>{return one.id}),
                            displayValues: this.departments.map((one)=>{return one.departmentName})
                        }
                    ]
                });
            })
        }
    }
</script>

<style scoped>
    .nav{
        width: 100%; height: 2rem; line-height: 2rem; display: flex; background: #fff; justify-content: space-between; box-sizing: border-box; padding: 0 0.6rem;
        font-size: 0.7rem; color: #999;
    }
    .nav .right{
        width: 7rem; line-height: 2rem; position: relative;
    }
    .nav .right .cover{
        width: 100%; height: 100%; text-align: right;
    }
    .nav .right .cover img{
        width: 0.6rem; height: 0.6rem; display: inline; transform: translateY(2px);
    }
    .nav .right .down{
        width: 100%; height: 100%; position: absolute; left: 0; top: 0; right: 0; bottom: 0; opacity: 0; z-index: -1;
    }
    .nav .right .down input{
        width: 100%;
    }

    .cent{
        background: #fff; margin-top: 5px;
    }
    .cent .c{
        width: 100%; height: 35px; display: flex; border-bottom: 1px solid #f4f4f4;
    }
    .cent .c div{
        width: 25%; line-height: 35px; text-align: center; font-size: 0.7rem; color: #AAA;
    }
    .cent .t{

    }
    .cent .t ul li{
        width: 100%; height: 2.5rem; display: flex; border-bottom: 1px solid #f4f4f4;
    }
    .cent .t ul li div{
        width: 25%; font-size: 0.6rem; color: #666;
    }
    .cent .t ul li .t-1{
        line-height: 2.5rem; text-align: center;
    }
    .cent .t ul li .t-2{
        text-align: center; font-size: 0.55rem; color: #666;
    }
    .cent .t ul li .t-2 .span2{
        position: relative; top: 3px;
    }
    .cent .t ul li .t-2 .span3{
        position: relative; top: 12px;
    }
    .cent .t ul li .t-2 .span4{
        position: relative; top: 18px;
    }
    .cent .t ul li .t-2 span i{
        font-style: normal;
    }
    .cent .t ul li .t-3{
        text-align: center;
    }
    .cent .t ul li .t-3 img{
        width: 36px; height: 12px; display: inline-block; margin-top: 1rem;
    }
</style>