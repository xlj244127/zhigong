<template>
    <div data-page="attendDate" class="page navbar-fixed toolbar-fixed"> <!--固定导航栏-->
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">考勤日期</div>
            </div>
        </div>
        <div class="page-content">
            <div class="nav">日期选择</div>
            <div class="main">
                <ul>
                    <li>
                        <label @click="allSelect">
                            <input type="checkbox" name="all" class="alldata" />&nbsp;每天
                        </label>
                    </li>
                    <li v-for="item in date">
                        <label>
                            <input type="checkbox" name="put" :data-id="item.code" :data-name="item.name" />&nbsp;{{item.name}}
                        </label>
                    </li>
                </ul>
            </div>
            <div class="footer" @click="configActon">确认</div>
        </div>
    </div>
</template>

<script>
    var $$ = Dom7;
    import { dutyApi } from '../../../../api'
    export default {
        data(){
            return{
                status: '',
                checked: 'false',
                dutyDate: [],
                dutyDateName: [],
                date: [{code: 2, name: '星期一'},{code: 3, name: '星期二'},{code: 4, name: '星期三'},{code: 5, name: '星期四'},{code: 6, name: '星期五'},{code: 7, name: '星期六'},{code: 1, name: '星期日'}]
            }
        },
        methods:{
            allSelect(){
                this.checked = !this.checked;
                if(this.checked) {
                    $$('.alldata').prop('checked', true);
                    $$("input[name=put]").each(function() {
                        $$(this).prop("checked", false);
                    });
                }else{
                    $$('.alldata').prop('checked', false);
                    $$("input[name=put]").each(function() {
                        $$(this).prop("checked", true);
                    });
                }
            },
            configActon(){
                this.dutyDate = [];
                this.dutyDateName = [];
                $$('input[name=put]:checked').each((xls, eml)=>{
                    this.dutyDate.push($$(eml).data('id'));
                    this.dutyDateName.push($$(eml).data('name'));
                })
                this.$store.state.dutyDate = this.dutyDate;
                this.$store.state.dutyDateName = this.dutyDateName;
                console.log(this.$store.state.dutyDate,this.$store.state.dutyDateName);
                this.$router.back();
            }
        },
        mounted(){
            this.status = this.$route.params.status;
            console.log('状态',this.status);
            if(this.status==0){
                if(this.$store.state.dutyDate.length != 0){
                    this.dutyDate = this.$store.state.dutyDate;
                    console.log('长度',this.dutyDate.length);
                    if(this.dutyDate.length!=7){
                        console.log('不全');
                        $$('.alldata').prop('checked', false);
                    }else{
                        console.log('全的');
                        $$('.alldata').prop('checked', true);
                    }
                    for(var i=0; i<this.dutyDate.length; i++){
                        $$('input[name=put]').each((xls, eml)=>{
                            if(this.dutyDate[i]==$$(eml).data('id')){
                                $$(eml).attr('checked',true);
                            }
                        })
                    }
                }
            }
            if(this.status==1){
                if(this.$store.state.dutyDate.length!=0){
                    this.dutyDate = this.$store.state.dutyDate;
                    if(this.dutyDate.length!=7){
                        console.log('不全');
                        $$('.alldata').prop('checked', false);
                    }else{
                        console.log('全的');
                        $$('.alldata').prop('checked', true);
                    }
                    for(var i=0; i<this.dutyDate.length; i++){
                        $$('input[name=put]').each((xls, eml)=>{
                            if(this.dutyDate[i]==$$(eml).data('id')){
                                $$(eml).attr('checked',true);
                            }
                        })
                    }
                }else if(this.$store.state.oneAttendRule){
                    console.log(this.$store.state.oneAttendRule.dutyDate.split(','),this.$store.state.oneAttendRule.dutyDate.split(',').length);
                    if(this.$store.state.oneAttendRule.dutyDate.split(',').length==7){
                        $$('.alldata').prop('checked', true);
                    }else{
                        $$('.alldata').prop('checked', false);
                    }
                    this.$store.state.oneAttendRule.dutyDate.split(',').map((res)=>{
                        $$('input[name=put]').each((xls, eml)=>{
                            console.log(res,$$(eml).data('id'));
                            if(res==$$(eml).data('id')){
                                $$(eml).attr('checked',true);
                            }
                        })
                    })
                }
            }

        }
    }
</script>

<style scoped>
    .page-content{
        width: 100%; height: 100%; background: #f4f4f4;
    }
    .nav{
        width: 100%; height: 2rem; line-height: 2rem; box-sizing: border-box; padding-left: 0.6rem; font-size: 0.7rem; color: #999; background: #fff;
        border-bottom: 1px solid #f4f4f4; margin-top: 0.5rem;
    }
    .main{
        background: #fff;
    }
    .main ul li{
        width: 100%; height: 2rem; border-bottom: 1px solid #f4f4f4;
    }
    .main ul li label{
        width: 100%; height: 100%; display: inline-block; line-height: 2rem; box-sizing: border-box; padding-left: 1.2rem; font-size: 0.7rem; color: #666;
    }
    .main ul li label input{
        transform: translateY(2px);
    }

    .footer{
        width: 100%; height: 2rem; line-height: 2rem; text-align: center; font-size: 0.8rem; color: #fff; background: #438CFF;
        position: fixed; left: 0; bottom: 0;
    }
</style>