<template>
    <div class="page">
        <div class="page-content">
            <div class="navbar">
                <div class="navbar-inner">
                    <div class="left sliding">
                        <a href="#" class="back link">
                            <i class="icon icon-back"></i>
                        </a>
                    </div>
                    <div class="center sliding">选择添加方式</div>
                </div>
            </div>
            <div class="content-block">
                <div class="line"></div>
                <ul class="list">
                    <li @click="skipPhoneAdd">
                        <a>
                            <span>搜索手机号码添加</span> <img src="../../../../static/img/btn_right.png"/>
                        </a>
                    </li>
                    <!--<li>
                        <a href="#">
                            <span>手机通讯录添加</span> <img src="../../../../static/img/btn_right.png"/>
                        </a>
                    </li>
                    <li>
                        &lt;!&ndash;<a @click="genQrcode">&ndash;&gt;
                        <a href="/user/groupQrcode">
                            <span>生成群发二维码</span> <img src="../../../../static/img/btn_right.png"/>
                        </a>
                    </li>
                    <li>
                        <input class="picker" id="pickerWorkType" readonly>
                        <a>
                            <span>扫描成员二维码</span> <img src="../../../../static/img/btn_right.png"/>
                        </a>
                    </li>-->
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import { groupApi, dviApi    } from '../../../api'
    import scanUtil from '../../../lib/scanUtil'

    export default {
        data(){
            return{
            }
        },
        methods:{
            skipPhoneAdd() {
                //添加工人
                this.$router.load({url: '/company/phoneAdd/:id/'+ 4});
            },
            async initPicker() {
                let that = this;
                let workTypes;
                if(!this.$store.state.workTypes) {
                    workTypes = await dviApi.getWorkTypes();
                    workTypes = workTypes.data.list;
                    this.$store.state.workTypes = workTypes;
                }
                else
                    workTypes = this.$store.state.workTypes;

                this.$f7.picker({
                    input: '#pickerWorkType',
                    toolbarCloseText: '选择工种',
                    onClose(p){
                        let index = p.cols[0].activeIndex;
                        let workType = p.cols[0].displayValues[index];
                        that.scanQrcode(workType);
                    },
                    cols: [
                        {
                            textAlign: 'center',
                            values: workTypes.map((workType)=>{return workType.code;}),
                            displayValues: workTypes.map((workType)=>{return workType.value;}),
                        }
                    ]
                });
            },
            scanQrcode(workType) {
                let that = this;
                scanUtil.barcodeScan().then((result)=>{
                    let code = result.text;
                    console.log('Scan bacode: ' + code);
                    let strs = code.split('##');
                    if(strs.length >= 2) {
                        let userId = strs[strs.length - 1];
                        groupApi.addGroupMember(workType, userId).then((result)=>{
                            that.$f7.alert('添加班组成员成功');
                        });
                    }
                    else
                        that.$f7.alert('不能识别的二维码！');
                });
            },
            genQrcode() {
                scanUtil.barcodeEncode('AddToWorkGroup##'+this.$store.state.userInfo.id).catch((ex)=>{
                    console.log('Bacode: ' + JSON.stringify(ex));
                });
            }
        },
        mounted(){
            this.initPicker();
        }
    }
</script>

<style scoped>
    .line{
        width: 100%; height: 0.5rem; background: #f4f4f4;
    }
    .list li{
        width: 100%; height: 2.5rem; line-height: 2.5rem; border-bottom: 1px solid #ccc; box-sizing: border-box; padding: 0 0.6rem; position: relative;
    }
    .list li a{
        width: 100%; height: 100%; display: block; font-size: 0.8rem; color: #438cff;
    }
    .list li a img{
        width: 0.9rem; height: 0.9rem; position: absolute; right: 0.6rem; top: 0.8rem;
    }
    .picker {
        position: absolute;  left: 0;  width: 100%;  top: 0;  bottom: 0; opacity: 0;
    }
</style>