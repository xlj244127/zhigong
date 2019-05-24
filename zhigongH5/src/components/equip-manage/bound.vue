<template>
    <div class="main">
        <ul class="aul row">
            <li class="col-25">考勤机编号</li><li class="col-50">绑定项目</li><li class="col-25">状态</li>
        </ul>
        <div class="block">
            <div v-for="item in userArr">
                <ul class="aul2 row">
                    <li class="col-25">{{item.code.substr(item.code.length-6,item.code.length-1)}}</li>
                    <li class="col-50">{{ item.projectName }}</li>
                    <li class="col-25 one" v-if="item.status==0">{{ machineStatus[item.status] }}</li><li class="col-25 two" v-if="item.status==1">{{ machineStatus[item.status] }}</li><li class="col-25 three" v-if="item.status==2">{{ machineStatus[item.status] }}</li>
                </ul>
                <div class="skip" @click.stop.prevent="enterDetail(item)">
                    <div class="s-1" @click.stop.prevent="unBindAction(item)">解绑</div>
                    <img src="../../../static/img/btn_right.png"/>
                </div>
            </div>
            <div v-for="item in freeArr">
                <ul class="aul2 row">
                    <li class="col-25">{{item.code.substr(item.code.length-6,item.code.length-1)}}</li>
                    <li class="col-50">{{ item.projectName }}</li>
                    <li class="col-25 one" v-if="item.status==0">{{ machineStatus[item.status] }}</li><li class="col-25 two" v-if="item.status==1">{{ machineStatus[item.status] }}</li><li class="col-25 three" v-if="item.status==2">{{ machineStatus[item.status] }}</li>
                </ul>
                <div class="skip" @click="enterDetail(item)">
                    <div class="s-1" @click.stop.prevent="unBindAction(item)">解绑</div>
                    <img src="../../../static/img/btn_right.png"/>
                </div>
            </div>
            <div v-for="item in offLineArr">
                <ul class="aul2 row">
                    <li class="col-25">{{item.code.substr(item.code.length-6,item.code.length-1)}}</li>
                    <li class="col-50">{{ item.projectName }}</li>
                    <li class="col-25 one" v-if="item.status==0">{{ machineStatus[item.status] }}</li><li class="col-25 two" v-if="item.status==1">{{ machineStatus[item.status] }}</li><li class="col-25 three" v-if="item.status==2">{{ machineStatus[item.status] }}</li>
                </ul>
                <div class="skip" @click="enterDetail(item)">
                    <div class="s-1" @click.stop.prevent="unBindAction(item)">解绑</div>
                    <img src="../../../static/img/btn_right.png"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { companyApi, machineApi } from '../../api'
    export default {
        name: "bound",
        props: ['freeArr', 'userArr', 'offLineArr'],
        data(){
            return{
                machineStatus: ['空闲', '在用', '离线']
            }
        },
        methods:{
            unBindAction(item){
                console.log(this.listOne);
                this.$f7.confirm('是否确定解除绑定?', ()=>{
                    let that = this;
                    machineApi.projUnBind(item.id).then((result)=>{
                        console.log('我解绑了考勤机');
                        console.log(result);
                        //考勤机从项目解绑后需要清空$store里面缓存的数据
                        if(that.$store.state.machineList)
                            delete that.$store.state.machineList[item.projectId];
                        if(that.$store.state.selectedMachine)
                            delete that.$store.state.selectedMachine[item.projectId];
                        that.$emit('isShow');
                    })
                })
            },
            enterDetail(item){
                console.log(item.code);
                this.$router.load({url: '/company/attendMachineDetail/'+item.code})
                this.$store.state.machineDetail = item;
            }
        },
        mounted(){
            console.log('+++++++++++++++++++++++++++++++++',this.freeArr,this.userArr,this.offLineArr);
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
        width: 100%; height: 2.5rem; line-height: 2.5rem; border-bottom: 1px solid #f4f4f4; display: flex;
    }
    .main .block .aul2 li{
        height: 2rem; line-height: 2rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 0.7rem; color: #666;
    }
    .main .block .aul2 .one{
        color: orange;
    }
    .main .block .aul2 .two{
        color: #1AAD19;
    }
    .main .block .aul2 .three{
        color: #ef7373;
    }

    .main .block .skip{
        width: 100%; height: 2rem; line-height: 2rem; margin-bottom: 0.5rem; display: flex;
    }
    .main .block .skip .s-1{
        width: 4rem; line-height: 2rem; text-align: center; margin: 0 auto; font-size: 0.7rem; color: #438cff;
    }
    .main .block .skip img{
        width: 0.9rem; height: 0.9rem; transform: translateY(0.5rem);
    }
</style>