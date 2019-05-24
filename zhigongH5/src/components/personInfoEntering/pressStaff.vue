<template>
    <div class="main">
        <ul class="aul">
            <li v-for="item in list">
                <div class="top" v-if="isGrouper!==null">
                    <div class="a2"><img :src="item.avatar"/></div>
                    <div class="a3">
                        <span class="a3-1">{{(item.name?item.name:item.nickname)?(item.name?item.name:item.nickname):item.mobile}}</span>
                        <span class="a3-3" v-show="item.projectRole==2">班组长</span>
                        <span class="a3-3" v-show="item.projectRole!=2">{{item.workGroupName}}</span>
                        <span class="a3-3" v-show="item.projectRole==3">大工</span>
                        <span class="a3-3" v-show="item.projectRole==4">小工</span>
                        <br/>
                        <span class="a3-2">{{item.mobile}}</span>
                    </div>
                </div>
                <div class="top" v-else>
                    <div class="a2"><img :src="item.avatar"/></div>
                    <div class="a3">
                        <span class="a3-1">{{(item.name?item.name:item.nickname)?(item.name?item.name:item.nickname):item.mobile}}</span>
                        <br/>
                        <span class="a3-2">{{item.mobile}}</span>
                    </div>
                </div>
                <div class="bott">
                    <div class="left">
                        <div @click="onAddIdentityCard(item)" v-if="item.userDetail.idNumber==null">
                            <img src="../../../static/img/infoInput_idcardWhite_icon.png"/><span>身份证</span>
                        </div>
                        <div class="f-1" @click="onAddIdentityCard(item)" v-else>
                            <img src="../../../static/img/infoInput_idcardBlue_icon.png"/><span>修改</span>
                        </div>
                    </div>
                    <div class="content-block accordion-list custom-accordion">
                        <div class="accordion-item">
                            <div class="accordion-item-toggle">
                                <div v-show="item.faced==0">
                                    <img src="../../../static/img/infoInput_lulianWhite_icon.png"/><span>录脸</span>
                                </div>
                                <div class="bgTwo" v-show="item.faced==1">
                                    <img src="../../../static/img/infoInput_lulianBlue_icon.png"/><span>重录</span>
                                </div>
                            </div>
                            <div class="accordion-item-content">
                                <img class="triangle" src="../../../static/img/xialashangjiaoxin.png"/>
                                <div @click="takePhtoUpLoading(item)">拍照上传</div>
                                <div @click="photoUpLoading(item)">相册上传</div>
                                <!--<div @click="record(item.id, item.name)">考勤机录脸</div>-->
                            </div>
                        </div>

                        <div v-show="item.faced==0" class="gray"><img src="../../../static/img/infoInput_lookWhite_icon.png"/><span>查看</span></div>
                        <div v-show="item.faced==1" class="accordion-item">
                            <div class="accordion-item-toggle">
                                <div>
                                    <img src="../../../static/img/infoInput_lookWhite_icon.png"/><span>查看</span>
                                </div>
                            </div>
                            <div class="accordion-item-content">
                                <img class="triangle" src="../../../static/img/xialashangjiaoxin.png"/>
                                <div @click="enterLookFacePage(item.id)">查看人脸</div>
                                <div @click="deletePhoto(item)">删除人脸</div>
                            </div>
                        </div>
                    </div>
                </div>
            </li>
        </ul>

        <div id="modal-text"><div class="text-center modal-text-wrap"><img src="../../../static/img/img_portrait.png"></div></div>
        <div id="modalTwo" style="display: none">
            <img style="width: 2rem; height: 2rem" src="../../../static/img/shangchuangchenggong.png">
            <div style="font-size: 0.8rem; color: #438CFF; margin-top: 0.5rem">上传成功</div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import { userApi, machineApi, notifyApi, commonApi, tabulateStatisticsApi, projectApi} from '../../api'
    import bluetooth from '../../lib/bluetoothUtil'
    import 'font-awesome/css/font-awesome.css'
    var groupId;
    let $$ = Dom7;
    var changeType;
    var personId;
    import imge from '../../../static/img/avatar.png'
    export default {
        name: "press-staff",
        data(){
            return{
                workerTitle: [],
                id: ''
            }
        },
        props: ['list','isGrouper', 'projectId', 'machineId', 'hasMachine'],
        methods:{
            idNumberChanged() {
                console.log('idNumberChanged');
            },
            onAddIdentityCard(item) {
                this.$store.state.addIdentityCard = item;
                this.$router.load({url: '/company/addIdentityCard?id='+item.id});
            },
            toFaced (id) {
                for(let i = 0; i < this.list.length; i++) {
                    let item = this.list[i];
                    if(item.id == id) {
                        item.faced = 1;
                        break;
                    }
                }
            },
            record(id, name) {
                let that = this;

                if(this.hasMachine == 0){
                    this.$f7.confirm('暂未绑定考勤机，是否去绑定考勤机？',
                        function(){
                            that.$router.load({url: '/company/equipManage/'});
                            return;
                        }
                    );
                }else if(this.hasMachine == 1){
                    this.$f7.modal({
                        title: '请按考勤机指令录入人脸',
                        text: $$('#modal-text').html(),
                        afterText: '<div style="color: #007aff;"><i class="fa fa-spinner fa-pulse fa-fw"></i> <span id="modal-prompt">正在录脸，请面朝考勤机</span></div>',
                        buttons: [
                            {
                                text: '取消录脸',
                                onClick() {
                                    notifyApi.stopFace(that.machineId);
                                    that.$root.eventHub.$off('pushNotification');
                                }
                            }
                        ]
                    });
                    this.$root.eventHub.$on('pushNotification', (result)=>{
                        result = JSON.parse(result);
                        if(result.type === 3) {
                            if(result.content.success) {
                                that.toFaced(id);
                                that.$root.eventHub.$off('pushNotification');
                                that.$f7.closeModal();
                            }
                            else
                                $$('#modal-prompt').text('录脸失败');
                        }
                    });
                    notifyApi.launchFace(this.machineId, id, name, this.$store.state.userInfo.id);
                }else{
                    if(!this.machineId){
                        this.$f7.alert('如果项目已经绑定了多台考勤机，请在右上角选择一个考勤机来进行录脸');
                        return;
                    }

                    this.$f7.modal({
                        title: '请按考勤机指令录入人脸',
                        text: $$('#modal-text').html(),
                        afterText: '<div style="color: #007aff;"><i class="fa fa-spinner fa-pulse fa-fw"></i> <span id="modal-prompt">正在录脸，请面朝考勤机</span></div>',
                        buttons: [
                            {
                                text: '取消录脸',
                                onClick() {
                                    notifyApi.stopFace(that.machineId);
                                    that.$root.eventHub.$off('pushNotification');
                                }
                            }
                        ]
                    });
                    this.$root.eventHub.$on('pushNotification', (result)=>{
                        result = JSON.parse(result);
                        if(result.type === 3) {
                            if(result.content.success) {
                                that.toFaced(id);
                                that.$root.eventHub.$off('pushNotification');
                                that.$f7.closeModal();
                            }
                            else
                                $$('#modal-prompt').text('录脸失败');
                        }
                    });
                    notifyApi.launchFace(this.machineId, id, name, this.$store.state.userInfo.id);
                }
            },

            //相册上传
            photoUpLoading(item) {
                console.log("用户id================================="+item.id);
                let that = this;
                navigator.camera.getPicture((imageData)=>{
                    console.log('File: ' + imageData);
                    commonApi.uploadFace(imageData, item.id+'.jpg', true).then((result)=>{
                        console.log(result.data);
                        item.faced = 1;
                        this.$f7.modal({
                            text: $$('#modalTwo').html()
                        });
                        setTimeout(()=>{
                            this.$f7.closeModal();
                        }, 2000);
                    }, (error)=>{
                        console.log('Upload error: ' + JSON.stringify(error));
                        that.$f7.alert('人脸特征提取失败，请重新上传');
                    });
                },(error)=>{
                    console.log(error);
                },{
                    quality: 75,
                    sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                    correctOrientation: true,
                    targetWidth: 1000,
                    targetHeight: 1000
                });
            },
            //调摄像头
            takePhtoUpLoading(item){
                console.log("用户id====================================="+item.id);
                let that = this;
                navigator.camera.getPicture((imageData)=>{
                    console.log('File: ' + imageData);
                    commonApi.uploadFace(imageData, item.id+'.jpg', true).then((result)=>{
                        console.log(result.data);
                        item.faced = 1;
                        this.$f7.modal({
                            text: $$('#modalTwo').html()
                        });
                        setTimeout(()=>{
                            this.$f7.closeModal();
                        }, 2000);
                    }, (error)=>{
                        console.log('Upload error: ' + JSON.stringify(error));
                        that.$f7.alert('人脸特征提取失败，请重新上传');
                    });
                }, (error)=>{
                    console.log(error);
                }, {
                    quality: 75,
                    allowEdit: false,
                    correctOrientation: true,
                    targetWidth: 1000,
                    targetHeight: 1000
                });
            },
            //删除人脸
            deletePhoto(item){
                this.$f7.confirm('是否确定删除该工人录脸信息?', ()=>{
                    commonApi.deleteFace(item.id).then((result)=>{
                        console.log(result);
                        item.faced = 0;
                    })
                })
            },
            //查看人脸照片
            enterLookFacePage(userId){
                this.$router.load({url: '/company/lookFace/'+userId});
            },
        },
        mounted(){

        }
    }
</script>

<style scoped>
    .main{
        width: 100%; background: #fff; box-sizing: border-box; padding: 0 0.6rem;
    }
    .main .aul li{
        width: 100%; min-height: 5rem; border-bottom: 1px solid #f4f4f4; position: relative;
    }
    .main .aul li:first-of-type{
        border-bottom: 1px solid #f4f4f4;
    }
    .main .aul li .top{
        display: flex;
    }
    .main .aul li .top .a2{
        width: 2rem; height: 2rem; border: 1px solid #000; border-radius: 50%; margin-top: 0.5rem;
    }
    .main .aul li .top .a2 img{
        width: 2rem; height: 2rem; border-radius: 50%;
    }
    .main .aul li .top .a3{
        padding: 0.7rem 0 0 0.8rem;
        flex: 1;
        overflow: hidden;
    }
    .main .aul li .top .a3 .a3-1{
        font-size: 0.8rem; color: #438cff;
    }
    .main .aul li .top .a3 .a3-3{
        box-sizing: border-box; padding: 3px 6px; font-size: 0.45rem; color: #666666; background: #E9E9E9; display: inline-block; margin-left: 0.8rem; border-radius: 2px;
    }
    .main .aul li .top .a3 .a3-2{
        font-size: 0.6rem; color: #999;
    }

    .main .aul li .bott{
        display: flex; justify-content: space-between;
    }
    .main .aul li .bott .left{
        width: 33%; text-align: center;
    }
    .main .aul li .bott .left div{
        width: 3.5rem; height: 1.1rem; line-height: 1.1rem; text-align: center; border: 1px solid #438cff; border-radius: 1rem; margin-top: 0.5rem;
        overflow: hidden; background: #438CFF; font-size: 0.6rem; color: #fff;
    }
    .main .aul li .bott .left .f-1{
        background: #fff; color: #438CFF;
    }
    .main .aul li .bott .left div img{
        width: 0.75rem; height: 0.75rem; display: inline; transform: translateY(0.2rem); padding-right: 1px;
    }
    .main .aul li .bott .gray{
        width: 3.25rem; height: 1.1rem; line-height: 1.1rem; text-align: center; border-radius: 1rem; margin-top: 0.3rem;
        overflow: hidden; background: gray; font-size: 0.6rem; color: #fff; margin-top: 0.5rem;
    }
    .main .aul li .bott .gray img{
        width: 0.75rem; height: 0.75rem; display: inline; transform: translateY(0.2rem);
    }
    .list-block .accordion-item .content-block, .list-block .accordion-item .list-block{
        flex: 1; width: 100%; display: flex; justify-content: space-around;
    }
    .list-block .accordion-item-toggle div{
        width: 3.25rem; height: 1.1rem; line-height: 1.1rem; text-align: center; border: 1px solid #438cff; border-radius: 1rem; margin-top: 0.3rem;
        overflow: hidden; background: #438CFF; font-size: 0.6rem; color: #fff; margin-top: 0.5rem;
    }
    .list-block .accordion-item-toggle .bgTwo{
        background: #fff; color: #438CFF;
    }
    .list-block .accordion-item-toggle img{
        width: 0.75rem; height: 0.75rem; display: inline; transform: translateY(0.2rem);
    }
    .accordion-item-expanded>.accordion-item-content{
         margin: 0 0 0.5rem 0; transform: translateY(-0.2rem);
    }
    .accordion-item-expanded>.accordion-item-content .triangle{
        width:0.8rem; height: 0.5rem; position: relative; left: 0.5rem; top: 0.3rem;
    }
    .accordion-item-expanded>.accordion-item-content>div{
        box-sizing: border-box; padding: 0.5rem 0.3rem; text-align: center; border: 1px solid #438cff; border-bottom: none;
        overflow: hidden; font-size: 0.6rem; color: #438CFF;
    }
    .accordion-item-expanded>.accordion-item-content>div:first-of-type{
        border-radius: 0.15rem 0.15rem 0 0;
    }
    .accordion-item-expanded>.accordion-item-content>div:last-of-type{
        border-bottom: 1px solid #438cff; border-radius: 0 0 0.15rem 0.15rem;
    }

    #modal-text {
        display: none;
    }
    .modal .modal-text img {
        width: 5rem;
        height: 5rem;
    }
    .modal-text-wrap {
        padding: 1rem 0;
    }

</style>