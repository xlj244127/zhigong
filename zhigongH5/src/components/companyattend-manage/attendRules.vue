<template>
    <div>
        <div class="main">
            <ul>
                <li v-for="(item, index) in attendRlueList" @click="enterDetail(item)">
                    <div class="m">
                        <span class="m-1">规则 <span>{{index+1}}</span></span><span>{{item.dutyruleName}}</span>
                        <img src="../../../static/img/btn_right.png"/>
                    </div>
                </li>
            </ul>
        </div>
        <div class="footer">
            <a href="/company/createrAttendRules/">创建考勤规则</a>
        </div>
    </div>
</template>

<script>
    import { dutyApi } from '../../api'
    export default {
        name: "attendRules",
        data(){
            return{
                companyId: '',
            }
        },
        props: ['attendRlueList'],
        methods: {
            enterDetail(item){
                console.log(item.id);
                this.$store.state.oneAttendRule = item;
                this.$router.load({url: '/company/attendRuleDetail/'+item.id});
            }
        },
        mounted(){
            this.companyId = this.$store.state.roleInfo.companyId;
        }
    }
</script>

<style scoped>
    .main{
        margin-bottom: 2rem;
    }
    .main ul li{
        width: 100%; height: 2.5rem; line-height: 2.5rem; background: #fff; box-sizing: border-box; padding: 0 0.6rem; margin-top: 5px; position: relative;
    }
    .main ul li .m{
        font-size: 0.6rem; color: #666;
    }
    .main ul li .m .m-1{
        width: 38px; height: 1rem; line-height: 1rem; text-align: center; font-size: 0.5rem; color: #999; background: #EFEFEF; display: inline-block; margin-right: 0.6rem;
    }
    .main ul li .m img{
        width: 0.9rem; height: 0.9rem; position: absolute; right: 24px; top: 16px;
    }
    .footer{
        width: 100%; height: 2rem; line-height: 2rem; background: #438CFF;  position: fixed; left: 0; bottom: 0;
    }
    .footer a{
        width: 100%; height: 100%; display: inline-block; font-size: 0.8rem; color: #fff; text-align: center;
    }
</style>