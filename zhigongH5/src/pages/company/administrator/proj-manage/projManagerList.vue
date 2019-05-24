<template>
    <div data-page="projManagerList" class="page navbar-fixed toolbar-fixed" @page:reinit="back">   <!--&lt;!&ndash;固定导航栏&ndash;&gt;-->
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">查看项目管理员</div>
                <div class="right sliding" @click="delAction">
                    <a>
                        删除
                    </a>
                </div>
            </div>
        </div>

        <div class="page-content">
            <div class="header">
                <span class="h-1">设置项目管理员</span> <span class="h-2">（可设置多名项目管理员）</span>
            </div>
            <div class="main">
                <ul class="aul">
                    <li v-for="item in this.projerList" @click="enterDetail(item)">
                        <a>
                            <div class="a2"><img :src="item.avatar"/></div>
                            <div class="a3">
                                <span class="a3-1">{{(item.name?item.name:item.nickname)?(item.name?item.name:item.nickname):item.mobile}}</span> <br/>
                                <span class="a3-2">{{item.mobile}}</span>&nbsp; &nbsp;&nbsp;
                                <span class="a3-3">{{item.userRights.positions_name}}</span>
                            </div>
                            <img class="img" src="../../../../../static/img/btn_right.png"/>
                        </a>
                        <div class="fix" @click.stop.prevent="addDutyAction(item)">
                            <img src="../../../../../static/img/addPosition.png"/>
                            <span id="pickerSlectDuty"></span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import { projectApi, rightsApi } from '../../../../api'
    var projectId, pickPosition;
    export default {
        data(){
            return{
                projerList: [],
                companyId: '',
                dutys: [],
                dutyId: '',
                departmentId: '',
                userId: '',
                contact: ''
            }
        },
        methods:{
            back(){
                console.log('back....');
                //没有项目id就从缓存中获取数据，有项目id就从接口获取数据
                if(projectId==':id'){
                    this.projerList = this.$store.state.projerList;
                    console.log(this.projerList);
                }else{
                    projectApi.projManagerList(projectId,"","","","","").then((result)=>{
                        console.log(result);
                        this.projerList = result.data;
                    }).catch((res)=>{
                        res.log
                    })
                }
            },
            delAction(){
                this.$router.load({url: '/company/delProjManager/'+projectId});
            },
            enterDetail(item){
                this.$router.load({url: '/company/projMannagerDetail/'+item.id});
            },
            addDutyAction(item){
                this.userId = item.id;
                this.contact = item.mobile;
                console.log('用户id和电话', this.userId, this.contact);
                pickPosition.open();
            }
        },
        mounted(){
            this.companyId = this.$store.state.roleInfo.companyId;
            projectId = this.$route.params.id;
            //没有项目id就从缓存中获取数据，有项目id就从接口获取数据
            if(projectId==':id'){
                this.projerList = this.$store.state.projerList;
                console.log(this.projerList);
            }else{
                projectApi.projManagerList(projectId,"","","","","").then((result)=>{
                    console.log(result);
                    this.projerList = result.data;
                })
            }

            rightsApi.getPositionsNew(this.companyId, 1).then((result)=>{
                console.log('公司职务列表', result.data);
                this.departmentId = result.data[0].id;
                this.dutys = result.data[0].list;

                var that = this;
                pickPosition = this.$f7.picker({
                    input: '#picker_position',
                    toolbarTemplate:
                    '<div class="toolbar">' +
                    '<div class="toolbar-inner">' +
                    '<div class="left">' +
                    '<a href="#" class="link close-picker">取消</a>' +
                    '</div>' +
                    '<div class="right"><a href="#" class="link close-picker" id="btnOk">确定</a></div>' +
                    '</div>' +
                    '</div>',
                    onOpen(p){
                        p.container.find('#btnOk').click(()=>{
                            that.dutyId = p.cols[0].value;
                            rightsApi.addProjectAdminPositionAndProject(that.companyId, that.departmentId, that.dutyId, that.userId, that.contact, projectId).then((result)=>{
                                console.log(result.data);
                            })
                        })
                    },
                    cols: [
                        {
                            textAlign: 'center',
                            values: that.dutys.map((one)=>{return one.id;}),
                            displayValues: that.dutys.map((one)=>{return one.positionsName;})
                        }
                    ]
                });
            })

        }
    }
</script>

<style scoped>
    .page-content{
        width: 100%; height: 100%; background: #f4f4f4;
    }
    .header{
        box-sizing: border-box; padding: 1rem 0 0.5rem 0.6rem;
    }
    .header .h-1{
        font-size: 0.7rem; color: #999;
    }
    .header .h-2{
        font-size: 0.6rem; color: #ccc;
    }
    .main{
        width: 100%; background: #fff;
    }
    .main .aul li{
        width: 100%; height: 3.25rem; border-bottom: 1px solid #f4f4f4; box-sizing: border-box; padding-left: 0.6rem; position: relative;
    }
    .main .aul li a{
        width: 100%; height: 100%; display: flex;
    }
    .main .aul li .fix{
        position: absolute; left: 170px; top: 18px; z-index: 2;
    }
    .main .aul li .fix img{
        width: 55px; height: 0.8rem;
    }
    .main .aul li .fix #pickerSlectDuty{
        display: none;
    }
    .main .aul li a .img{
        width: 0.9rem; height: 0.9rem; position: absolute; right: 0.6rem; top: 1.15rem;
    }
    .main .aul li a .a2{
        width: 2rem; height: 2rem; border: 1px solid #000; border-radius: 50%; margin-top: 0.5rem;
    }
    .main .aul li a .a2 img{
        width: 2rem; height: 2rem; border-radius: 50%;
    }
    .main .aul li a .a3{
        padding: 0.8rem 0 0 0.75rem;
    }
    .main .aul li a .a3 .a3-1{
        font-size: 0.8rem; color: #438cff;
    }
    .main .aul li a .a3 .a3-2{
        font-size: 0.6rem; color: #999;
    }
    .main .aul li a .a3 .a3-3{
        font-size: 0.5rem; color: #438CFF;
    }

</style>