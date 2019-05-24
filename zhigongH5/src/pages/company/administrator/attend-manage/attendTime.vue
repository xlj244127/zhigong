<template>
    <div data-page="attendTime" class="page navbar-fixed toolbar-fixed"> <!--固定导航栏-->
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">考勤时间</div>
            </div>
        </div>
        <div class="page-content">
            <div class="nav">
                <div class="left">考勤时间段</div>
                <div class="right" @click="addTimeRange">
                    <img src="../../../../../static/img/jiaBlue.png"/>
                    <span>添加考勤时间段</span>
                </div>
            </div>
            <div class="box allbox" v-for="(item, index) in sum">
                <div class="b">
                    <div class="b-1"><i class="i2">{{index+1}}</i><i class="i3">时间段</i></div>
                    <div class="b-2" @click="delAction(index)"><img src="../../../../../static/img/shanchu@2x.png"/></div>
                </div>
                <div class="x" @click.stop.prevent="selectTime('.r-1', '.r-2', index)">
                    <div class="up">
                        <div class="left">上班时间</div>
                        <div class="right time" :data-id="index"><span class="r-1">00</span>:<span class="r-2">00</span></div>
                        <img src="../../../../../static/img/btn_more.png"/>
                    </div>
                    <div class="down">
                        <input type="text" id="picker-describe" class="picker"/>
                    </div>
                </div>
                <div class="x" @click.stop.prevent="selectTimeTwo('.r-3', '.r-4', index)">
                    <div class="up">
                        <div class="left">下班时间</div>
                        <div class="right time2" :data-id="index"><span class="r-3">00</span>:<span class="r-4">00</span></div>
                        <img src="../../../../../static/img/btn_more.png"/>
                    </div>
                    <div class="down">
                        <!--<input type="text" class="pickerTwo"/>-->
                    </div>
                </div>
            </div>
            <div class="footer" @click="configAction">确定</div>
        </div>
    </div>
</template>

<script>
    var $$ = Dom7;
    var pickerDescribe;
    export default {
        data(){
            return{
                status: '',
                sum: 1,
                dutyTimeList: [],
                dutyTime: []
            }
        },
        methods:{
            addTimeRange(){
                this.sum++
            },
            delAction(index){
                $$('.allbox').each((xls ,elm)=>{
                    if(xls==index){
                        $$(elm).remove();
                    }
                })
            },
            selectTime(className2, className3, index){
                this.callFuncion(className2, className3, index);
                console.log('点击one',className2, className3, index);
            },
            selectTimeTwo(className2, className3, index){
                this.callFuncion(className2, className3, index);
                console.log('点击two',className2, className3, index);
            },
            callFuncion(className2, className3, index){
                console.log('点击three',className2, className3, index);
                pickerDescribe = this.$f7.picker({
                    input: '#picker-describe',
                    rotateEffect: true,
                    toolbarCloseText: '确定',
                    cols: [
                        {
                            textAlign: 'left',
                            values: (()=>{
                                var arr = [];
                                for (var i = 0; i <= 23; i++) { arr.push(i < 10 ? '0' + i : i); }
                                return arr;
                            })(),
                            onChange: (Picker, value, displayValue)=>{
                                console.log('one',value,index,className2);
                                $$(className2).each((xlx,elm)=>{
                                    if($$(elm).parent('.right').data('id')==index){
                                        console.log('值one',value,className2,index,xlx);
                                        $$(elm).text(value);
                                    }
                                })
                            }
                        },
                        {
                            values: (()=>{
                                var arr2 = [];
                                for (var i = 0; i <= 59; i++) { arr2.push(i < 10 ? '0' + i : i); }
                                return arr2;
                            })(),
                            onChange: (Picker, value, displayValue)=>{
                                console.log('two',value,index,className3);
                                $$(className3).each((xls,elm)=>{
                                    if($$(elm).parent('.right').data('id')==index){
                                        console.log('值two',value,className3,index,xls);
                                        $$(elm).text(value);
                                    }
                                })
                            }
                        },
                    ],
                })
                pickerDescribe.open();
            },
            configAction(){
                this.dutyTimeList = [];
                this.dutyTime = [];
                $$('.allbox').each((xls,elm)=>{
                    let str = $$(elm).find('.time').text()+','+$$(elm).find('.time2').text();
                    console.log(str);
                    let obj = {
                        dutytimeName: '时间段'+(xls+1),
                        dutytimeStart: $$(elm).find('.time').text(),
                        dutytimeEnd: $$(elm).find('.time2').text()
                    }
                    this.dutyTimeList.push(obj);
                    this.dutyTime.push(str);
                })
                this.$store.state.dutyTimeList = this.dutyTimeList;
                this.$store.state.dutyTime = this.dutyTime;
                console.log(this.dutyTimeList, this.dutyTime);
                this.$router.back();
            }
        },
        created(){
            this.status = this.$route.params.status;
            console.log('状态',this.status);
            if(this.status==0){
                if(this.$store.state.dutyTimeList.length != 0){
                    this.sum = this.$store.state.dutyTimeList.length;
                    console.log(this.sum);
                    this.dutyTimeList = this.$store.state.dutyTimeList;
                    console.log('缓存中的考勤时间段',this.dutyTimeList);
                    this.$nextTick(() => {
                        console.log('我调用了这个');
                        $$('.allbox').each((xls, elm)=>{
                            console.log('下标',xls);
                            $$(elm).find('.time .r-1').text(this.dutyTimeList[xls].dutytimeStart.split(':')[0]);
                            $$(elm).find('.time .r-2').text(this.dutyTimeList[xls].dutytimeStart.split(':')[1]);
                            $$(elm).find('.time2 .r-3').text(this.dutyTimeList[xls].dutytimeEnd.split(':')[0]);
                            $$(elm).find('.time2 .r-4').text(this.dutyTimeList[xls].dutytimeEnd.split(':')[1]);
                        })
                    })
                }
            }
            if(this.status==1){
                if(this.$store.state.dutyTimeList.length != 0){
                    this.sum = this.$store.state.dutyTimeList.length;
                    console.log(this.sum);
                    this.dutyTimeList = this.$store.state.dutyTimeList;
                    console.log('缓存中的考勤时间段',this.dutyTimeList);
                    this.$nextTick(() => {
                        console.log('我调用了这个');
                        $$('.allbox').each((xls, elm)=>{
                            console.log('下标',xls);
                            $$(elm).find('.time .r-1').text(this.dutyTimeList[xls].dutytimeStart.split(':')[0]);
                            $$(elm).find('.time .r-2').text(this.dutyTimeList[xls].dutytimeStart.split(':')[1]);
                            $$(elm).find('.time2 .r-3').text(this.dutyTimeList[xls].dutytimeEnd.split(':')[0]);
                            $$(elm).find('.time2 .r-4').text(this.dutyTimeList[xls].dutytimeEnd.split(':')[1]);
                        })
                    })
                }else if(this.$store.state.oneAttendRule.detailList.length!=0){
                    this.sum = this.$store.state.oneAttendRule.detailList.length;
                    console.log(this.sum);
                    this.$store.state.oneAttendRule.detailList.map((res)=>{
                        let obj = {
                            dutytimeName: res.dutytimeName,
                            dutytimeStart: res.dutytimeStart,
                            dutytimeEnd: res.dutytimeEnd
                        }
                        this.dutyTimeList.push(obj);
                    })
                    console.log('缓存中的考勤时间段2',this.dutyTimeList);
                    this.$nextTick(() => {
                        console.log('我调用了这个2');
                        $$('.allbox').each((xls, elm)=> {
                            $$(elm).find('.time .r-1').text(this.dutyTimeList[xls].dutytimeStart.split(':')[0]);
                            $$(elm).find('.time .r-2').text(this.dutyTimeList[xls].dutytimeStart.split(':')[1]);
                            $$(elm).find('.time2 .r-3').text(this.dutyTimeList[xls].dutytimeEnd.split(':')[0]);
                            $$(elm).find('.time2 .r-4').text(this.dutyTimeList[xls].dutytimeEnd.split(':')[1]);
                        })
                    })
                }
            }
        },
        mounted(){


        }
    }
</script>

<style scoped>
    .page-content{
        width: 100%; height: 100%; background: #f4f4f4;
    }
    .nav{
        width: 100%; height: 2rem; line-height: 2rem; background: #fff; display: flex; justify-content: space-between;
        box-sizing: border-box; padding: 0 0.6rem;
    }
    .nav .left{
        font-size: 0.7rem; color: #999;
    }
    .nav .right{
        width: 92px; height: 1rem; line-height: 1rem; font-size: 0.5rem; color: #fff; background: #438CFF; margin-top: 10px;
    }
    .nav .right img{
        display: inline-block; width: 10px; height: 10px; transform: translate(2px,2px);
    }
    .box{
        background: #fff; margin-top: 6px;
    }
    .box .b{
        width: 100%; height: 35px; line-height: 35px; box-sizing: border-box; padding: 0 0.6rem; display: flex; justify-content: space-between;
        border-bottom: 1px solid #f4f4f4;
    }
    .box .b .b-1 .i2{
        font-size: 1rem; color: #438CFF; font-weight: 700;
    }
    .box .b .b-1 .i3{
        font-size: 0.5rem; color: #5595FA;
    }
    .box .b .b-2{

    }
    .box .b .b-2 img{
        width: 36px; height: 12px;
    }
    .box .x{
        width: 100%; height: 2rem; line-height: 2rem; position: relative; border-bottom: 1px solid #f4f4f4;
    }
    .box .x .up{
        width: 100%; height: 100%; display: flex; position: relative; justify-content: space-between;
        box-sizing: border-box; padding: 0 0.6rem; font-size: 0.7rem; color: #666;
    }
    .box .x .up .right{
        margin-right: 40px;
    }
    .box .x .up img{
        width: 0.9rem; height: 0.9rem; position: absolute; right: 26px; top: 12px;
    }
    .box .x .down{
        width: 100%; height: 100%; position: absolute; left: 0; top: 0; opacity: 0; z-index: -1;
    }
    .box .x .down input{
        width: 100%; height: 100%; border: none;
    }

    .footer{
        width: 100%; height: 2rem; line-height: 2rem; text-align: center; font-size: 0.8rem; color: #fff;
        position: fixed; left: 0; bottom: 0; background: #438CFF;
    }

    .picker-items-col{
        width: 50%;
    }
</style>