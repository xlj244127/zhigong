<template>
    <div class="main">
        <ul class="aul row">
            <li class="col-25">考勤机编号</li><li class="col-50">绑定项目</li><li class="col-25">状态</li>
        </ul>
        <div class="block" v-for="item in listTwo">
            <ul class="aul2">
                <li>{{item.code.substr(item.code.length-6,item.code.length-1)}}</li>
                <li class="name"></li>
            </ul>
            <div class="skip" @click.stop.prevent="enterDetail(item)">
                <div class="sk">
                    <div class="s-1" @click.stop.prevent="openAction(item.code)">绑定</div>
                    <input type="text" placeholder="请选择项目组" readonly id="picker-device">
                </div>
                <img src="../../../static/img/btn_right.png"/>
            </div>
        </div>
    </div>
</template>

<script>
    import { projectApi, machineApi } from '../../api'

    let $$ = Dom7;
    let pickerDevice;
    let currentDevCode = 0;
    let projList = null;

    export default {
        name: "unbound",
        data(){
            return{

            }
        },
        props: ["listTwo"],
        methods:{
            openAction(code){
                currentDevCode = code;
                console.log(currentDevCode);
                pickerDevice.open();
            },
            enterDetail(item){
                console.log(item.code);
                this.$router.load({url: '/company/attendMachineDetail/'+item.code})
                this.$store.state.machineDetail = item;
            }
        },
        mounted(){
            let that = this;
            this.companyRole = this.$store.state.roleInfo.companyRole;
            if(this.companyRole == 1){
                projectApi.allProjectList().then((result)=>{
                    console.log("获取公司所有项目", result);
                    projList = result.data;

                    pickerDevice = this.$f7.picker({
                        input: '#picker-device',
                        toolbarTemplate:
                        '<div class="toolbar">' +
                        '<div class="toolbar-inner">' +
                        '<div class="left">' +
                        '<a href="#" class="link close-picker">取消</a>' +
                        '</div>' +
                        '<div class="right"><a href="#" class="link close-picker" id="btnOk">绑定</a></div>' +
                        '</div>' +
                        '</div>',
                        onOpen:  (p)=>{
                            p.container.find('#btnOk').click(()=>{
                                let that = this;
                                machineApi.projBind(currentDevCode, pickerDevice.cols[0].value).then((result)=>{
                                    console.log('项目绑定成功');
                                    console.log(result);
                                    //考勤机绑定到项目后需要清空$store里面缓存的数据
                                    if(that.$store.state.machineList)
                                        delete that.$store.state.machineList[pickerDevice.cols[0].value];
                                    if(that.$store.state.selectedMachine)
                                        delete that.$store.state.selectedMachine[pickerDevice.cols[0].value];
                                    that.$emit('changeShow');
                                });
                            });
                        },
                        cols: [
                            {
                                textAlign: 'center',
                                values: projList.map((project)=>{return project.id}),
                                displayValues: projList.map((project)=>{return project.name}),
                            }
                        ]
                    });
                });
            }
            if(this.companyRole == 2){
                projectApi.userProjs().then((result)=>{
                    console.log("根据id获取项目列表", result);
                    projList = result.data;

                    pickerDevice = this.$f7.picker({
                        input: '#picker-device',
                        toolbarTemplate:
                        '<div class="toolbar">' +
                        '<div class="toolbar-inner">' +
                        '<div class="left">' +
                        '<a href="#" class="link close-picker">取消</a>' +
                        '</div>' +
                        '<div class="right"><a href="#" class="link close-picker" id="btnOk">绑定</a></div>' +
                        '</div>' +
                        '</div>',
                        onOpen:  (p)=>{
                            p.container.find('#btnOk').click(()=>{
                                let that = this;
                                machineApi.projBind(currentDevCode, pickerDevice.cols[0].value).then((result)=>{
                                    console.log('项目绑定成功');
                                    console.log(result);
                                    //考勤机绑定到项目后需要清空$store里面缓存的数据
                                    if(that.$store.state.machineList)
                                        delete that.$store.state.machineList[pickerDevice.cols[0].value];
                                    if(that.$store.state.selectedMachine)
                                        delete that.$store.state.selectedMachine[pickerDevice.cols[0].value];
                                    that.$emit('changeShow');
                                });
                            });
                        },
                        cols: [
                            {
                                textAlign: 'center',
                                values: projList.map((project)=>{return project.id}),
                                displayValues: projList.map((project)=>{return project.name}),
                            }
                        ]
                    });
                });
            }

        }
    }
</script>

<style scoped>
.main{
    width: 100%;
}
.main .aul{
    width: 100%; display: flex; justify-content: space-between; box-sizing: border-box; padding: 0 0.6rem; background: #fff; border-bottom: 1px solid #f4f4f4;
}
.main .aul li{
    height: 2rem; line-height: 2rem; font-size: 0.7rem; color: #aaa;
}
.main .block{
    background: #fff; box-sizing: border-box; padding: 0 0.6rem;
}
.main .block .aul2{
    width: 100%; height: 2.5rem; line-height: 2.5rem; border-bottom: 1px solid #f4f4f4; display: flex; font-size: 0.7rem; color: #666;
}
.main .block .aul2 .name{
    padding-left: 36px;
}
.main .block .aul2 .oneImg{
    width: 1.35rem; height: 0.6rem;
}
.main .block .skip{
    width: 100%; height: 2rem; line-height: 2rem; margin-bottom: 0.5rem; display: flex; justify-content: space-between;
}
.main .block .sk{
    width: 4rem; height: 2rem; margin: 0 auto; position: relative;
}
.main .block .skip .sk .s-1{
    width: 4rem; height: 2rem; text-align: center; font-size: 0.7rem; color: #438cff;
}
.main .block .skip .sk #picker-device{
    width: 4rem; height: 38px; border: none; position: absolute; top: 0px; z-index: -1;
}
.main .block .skip img{
    width: 0.9rem; height: 0.9rem; transform: translateY(0.5rem);
}
</style>