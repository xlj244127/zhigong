<template>
    <div data-page="personBlackListDetail" class="page navbar-fixed toolbar-fixed">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center">个人黑名单详情</div>
            </div>
        </div>
        <div class="page-content">
            <div class="main">
                <div class="cont">
                    <div class='left'>
                        <ul>
                            <li>姓名:<span>{{personDetail.name?personDetail.name:personDetail.mobile}}</span></li>
                            <li>身份证:<span>{{personDetail.idNumber}}</span></li>
                            <li>类型:<span class="color">{{personDetail.typeName}}</span></li>
                            <li>添加日期:<span>{{new Date(personDetail.createTime).getFullYear()}}-{{new Date(personDetail.createTime).getMonth()+1}}-{{new Date(personDetail.createTime).getDate()}}</span></li>
                            <li>来源:<span>{{personDetail.companyName}}</span></li>
                            <li>来源项目:<span>{{personDetail.projectName}}</span></li>
                            <li>来源班组:<span>{{personDetail.workGroupName}}</span></li>
                            <li>添加人员:<span>{{personDetail.adUserName}}</span></li>
                        </ul>
                    </div>
                    <div class='right'>
                        <img :src="personDetail.avatar"/>
                    </div>
                </div>
            </div>
            <div class="boot">
                <div class="b-1">说明</div>
                <ul class="b-2">
                    <li v-for="item in personDetail.blacklistRemark">
                        <div class="up">
                            &nbsp; &nbsp; &nbsp;
                            {{item.remark}}
                        </div>
                        <div class="down">
                            来源:
                            <span>{{new Date(personDetail.createTime).getFullYear()}}-{{new Date(personDetail.createTime).getMonth()+1}}-{{new Date(personDetail.createTime).getDate()}}</span>
                            <span>{{item.companyName}}</span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import { blackListApi } from '../../../../api'
    import { userApi } from '../../../../api'
    export default {
        data(){
            return{
                id: '',
                personDetail: '',
                adUserName: ''
            }
        },
        methods:{

        },
        created(){
            this.id = this.$route.params.id;
            blackListApi.personDetail(this.id).then((result)=>{
                console.log('个人详情',result);
                this.personDetail = result.data;
            })

        }
    }
</script>

<style scoped>
    .main{
        width: 100%; background: #fff; box-sizing: border-box; padding: 0 0.6rem; margin-top: 0.5rem;
    }
    .main .cont{
        width: 100%; display: flex; border-bottom: 1px solid #f4f4f4;
    }
    .main .cont .left{
        flex: 1;
    }
    .main .cont .left ul li{
        -ms-text-overflow: ellipsis;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        width: 11rem;
    }
    .main .cont .left ul li, .main .foot ul li{
        height: 2rem; line-height: 2rem; font-size: 0.7rem; color: #666;
    }
    .main .cont .right{
        width: 4.8rem; height: 6.4rem; border: 1px solid #ccc; margin: 0.8rem 0.75rem 0 0;
    }
    .main .cont .right img{
        width: 100%; height: 100%;
    }
    .main .cont .left ul li span{
        padding-left: 0.4rem;
    }
    .main .cont .left ul li .color{
        color: #EF7373;
    }

    .boot{
        box-sizing: border-box; padding: 0 0.6rem;
    }
    .boot .b-1{
        font-size: 0.7rem; color: #666; width: 100%; height: 2rem; line-height: 2rem; font-size: 0.7rem; color: #666;
    }
    .boot .b-2{

    }
    .boot .b-2 li{
        width: 100%; max-height: 5rem; border: 1px solid #438CFF; overflow: auto; box-sizing: border-box; padding: 0 0.2rem;
        margin-bottom: 0.5rem;
    }
    .boot .b-2 li .up{
        width: 100%; min-height: 1rem; font-size: 0.7rem; color: #888;
    }
    .boot .b-2 li .down{
        width: 100%; height: 1rem; font-size: 0.45rem; color: #888; text-align: right;
        overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
</style>