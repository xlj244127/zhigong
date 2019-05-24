<template>
    <div class="page navbar-fixed" data-page="attendMachineDetail">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">考勤机详情</div>
            </div>
        </div>
        <div class="page-content">
            <div class="main">
                <ul class="aul">
                    <li>考勤机编号: <span>{{this.code}}</span></li>
                    <li>网络: <span>4G</span></li>
                    <li>绑定项目: <span>{{projDetail.projectName}}</span></li>
                    <li>状态: <span class="one" v-if="projDetail.status==0">{{machineStatus[projDetail.status]}}</span>
                             <span class="two" v-if="projDetail.status==1">{{machineStatus[projDetail.status]}}</span>
                             <span class="three" v-if="projDetail.status==2">{{machineStatus[projDetail.status]}}</span>
                    </li>
                </ul>
                <div class="foot"><div class="f-1">位置:</div> <div id="f-2">{{this.address}}</div></div>
            </div>
            <div>
                <div id="containe"></div>
                <div id="tip">
                    <span id="result"></span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {map2} from '../../../../lib/echarts.js'
    export default {
        data(){
            return{
                projDetail: {},
                position: [],
                address: '',
                machineStatus: ['空闲', '在用', '离线'],
                code: ''
            }
        },
        methods:{

        },
        mounted(){
            this.projDetail = this.$store.state.machineDetail;
            this.code = this.projDetail.code.substr(this.projDetail.code.length-6, this.projDetail.code.length-1);
            console.log(this.code);
            console.log('考勤机编号',this.projDetail);
            this.position.push(this.projDetail.longitude);
            this.position.push(this.projDetail.latitude);
            console.log(this.position);

            //展示地图
            setTimeout(()=>{
                map2(this.position);
            },1000);

        }
    }
</script>

<style scoped>
.page-content{
    width: 100%; height: 100%; background: #f4f4f4;
}
.main{
    background: #fff; box-sizing: border-box; padding: 0 0.6rem; margin-top: 0.5rem;
}
.aul{

}
.aul li{
    width: 100%; height: 2.5rem; line-height: 2.5rem; font-size: 0.7rem; color: #666; border-bottom: 1px solid #f4f4f4;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.aul li .one{
    color: orange;
}
.aul li .two{
    color: #1AAD19;
}
.aul li .three{
    color: #ef7373;
}

.foot{
    width: 100%; height: 3.25rem; display: flex; font-size: 0.7rem; color: #666; box-sizing: border-box; padding-top: 0.7rem;
}
.foot .f-1{
    width: 2.25rem;
}

    #containe{
        width: 100%; height: 344px; position: absolute;
    }
</style>