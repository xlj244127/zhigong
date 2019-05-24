<template>
    <div data-page="companyBlackList" class="page navbar-fixed toolbar-fixed" @page:reinit="back">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center">公司黑名单</div>
            </div>
        </div>
        <div class="page-content infinite-scroll">
            <div class="ipt">
                <a href="/company/search/">
                    <input placeholder="输入姓名/手机号/身份证号搜索" type="text" readonly/>
                    <button class="sub">搜索</button>
                    <img src="../../../../../static/img/icon_search.png"/>
                </a>
            </div>

            <div>
                <div class="tst">
                    <div class="t-1">企业黑名单列表</div>
                    <div class="t-2" @click="byTypeAction">
                        <span class="t2">按类型筛选</span>
                        <img src="../../../../../static/img/btn_drop_down.png"/>
                    </div>
                </div>
                <ul class="aul">
                    <li v-for="item in blackList">
                        <div class="up" @click="enterDetail(item)">
                            <div class="a2"><img src="../../../../../static/img/avatar.png"/></div>
                            <div class="a3">
                                <div class="left">
                                    <span class="a3-1">{{item.name?item.name:item.mobile}}</span> <br/> <span class="a3-2">{{item.idNumber}}</span>
                                </div>
                                <div class="right">{{item.typeName}}</div>
                            </div>
                            <img class="img" src="../../../../../static/img/btn_right.png"/>
                        </div>

                        <div class="down row"  v-if="companyRole==1">
                            <div class="col-50 left" @click="editAction(item)">
                                <img src="../../../../../static/img/bianji.png"/>
                                <span>编辑</span>
                            </div>
                            <div class="col-50 right" @click="removeAction(item)">
                                <img src="../../../../../static/img/jiesuo.png"/>
                                <span>解除黑名单</span>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>

            <div class="fixed" v-show="this.totalItems>5">{{this.blackList.length==this.totalItems?'已全部加载完':'上拉加载更多'}}</div>
            <img @click="goTopAction" class="returnTop" src="../../../../../static/img/btn_return_top.png"/>
        </div>
    </div>
</template>

<script>
    import { blackListApi } from '../../../../api'
    var $$ = Dom7;
    export default {
        data(){
            return{
                companyRole: '',
                blackList: [],
                companyId: [],
                page: 1,
                pageSize: 5,
                totalPages: '',
                totalItems: ''
            }
        },
        methods:{
            back(){
                blackListApi.blackList(this.companyId, this.page, this.pageSize).then((result)=>{
                    console.log('公司黑名单',result);
                    this.blackList = result.data;
                    this.totalPages = result.pagination.totalPages;
                    this.totalItems = result.pagination.totalItems;
                })
            },
            byTypeAction(){
                let buttons = [];
                let arr = [{value: '恶意讨薪', code: '1'},{value: '打架闹事', code: '2'},{value: '盗窃', code: '3'},{value: '破坏损坏', code: '4'},{value: '在逃人员', code: '5'},{value: '其他', code: '6'}];
                var that = this;
                for (var i = 0; i < arr.length; i++) {
                    let value = arr[i].value;
                    let index = arr[i].code;
                    buttons.push(
                        {
                            text: value,
                            onClick: () => {
                                $$('.t2').text(value);
                                blackListApi.seachByType(this.companyId, index).then((result)=>{
                                    console.log('搜索结果2', result);
                                    that.blackList = result.data;
                                })

                            }
                        }
                    )
                }
                buttons.push(
                    {
                        text: '<div style="width: 100%; color: red">取消筛选</div>',
                        onClick: ()=>{
                            this.$f7.closeModal();
                        }
                    }
                )
                this.$f7.modal({
                    title: '黑名单类型:',
                    verticalButtons: true,
                    buttons
                })

            },
            editAction(item){
                this.$router.load({url: '/company/editPersonBlackList/'+item.id});
                this.$store.state.personDetail = item;
                console.log(this.$store.state.personDetail);
            },
            removeAction(item){                                             //解除黑名单后从新刷新下列表
                this.$f7.confirm('是否确认解除警报?', ()=>{
                    blackListApi.removeBlackList(item.id).then((result)=>{
                        console.log(result);

                        blackListApi.blackList(this.companyId).then((result)=>{
                            console.log('公司黑名单',result);
                            this.blackList = result.data;
                        })
                    })
                })
            },
            enterDetail(item){
                this.$router.load({url: '/company/personBlackListDetail/'+item.id})
            },
            goTopAction(){
                $$('.page-content').scrollTop(0,0);
            }
        },
        mounted(){
            this.companyId = this.$store.state.roleInfo.companyId;
            this.companyRole = this.$store.state.roleInfo.companyRole;
            blackListApi.blackList(this.companyId, this.page, this.pageSize).then((result)=>{
                console.log('公司黑名单',result);
                this.blackList = result.data;
                this.totalPages = result.pagination.totalPages;
                this.totalItems = result.pagination.totalItems;
            })

            var loading = false;
            $$('.infinite-scroll').on('infinite', ()=>{
                if(loading) return;
                loading = true;

                var that = this;
                setTimeout(()=>{
                    that.page++;
                    console.log('我被点击了',that.page);
                    loading = false;

                    if (that.page <= that.totalPages) {
                        blackListApi.blackList(that.companyId, that.page, that.pageSize).then((result)=>{
                            console.log('公司黑名单',result);
                            that.blackList = that.blackList.concat(result.data);
                            console.log('排序后',that.blackList);
                        })
                    }
                }, 1000);
            })

        }
    }
</script>

<style scoped>
    .page-content{
        width: 100%; height: 100%; background: #f4f4f4;
    }
    .ipt{
        width: 100%; height: 2.5rem; background: #fff; box-sizing: border-box; padding: 0 0.6rem; margin-top: 0.5rem;
    }
    .ipt a{
        width: 100%; height: 100%; position: relative; display: flex; justify-content: space-between;
    }
    .ipt a input{
        flex: 1;  margin-left: 2rem; border: none;
    }
    .ipt a .sub{
        width: 2.7rem; height: 1.5rem; line-height: 1.5rem; border-radius: 0.3rem; margin-top: 0.5rem; color: #fff;
        border:  none;
    }
    .ipt a img{
        width: 0.9rem; height: 0.9rem; position: absolute; left: 0.6rem; top: 0.8rem;
    }

    .tst{
        width: 100%; height: 2rem; line-height: 2rem; background: #fff; display: flex; justify-content: space-between;
        box-sizing: border-box; padding: 0 0.6rem; margin-top: 0.5rem; border-bottom: 1px solid #f4f4f4;
    }
    .tst .t-1{
        font-size: 0.7rem; color: #999;
    }
    .tst .t-2{
        font-size: 0.6rem; color: #aaa;
    }
    .tst .t-2 img{
        width: 0.6rem; height: 0.6rem; display: inline;
    }

    .aul li{
        margin-bottom: 0.25rem; background: #fff; margin-bottom: 0.25rem;
    }
    .aul li .up{
        width: 100%; height: 3.25rem; box-sizing: border-box; padding-left: 0.6rem; position: relative; display: flex;
    }
    .aul li .up .img{
        width: 0.9rem; height: 0.9rem; position: absolute; right: 0.6rem; top: 1.15rem;
    }
    .aul li .up .a2{
        width: 2rem; height: 2rem; border: 1px solid #000; border-radius: 50%; margin-top: 0.5rem;
    }
    .aul li .up .a2 img{
        width: 2rem; height: 2rem; border-radius: 50%;
    }
    .aul li .up .a3{
        width: 100%; padding: 0.8rem 0 0 0.75rem; display: flex; justify-content: space-between;
    }
    .aul li .up .a3 .left{
        flex: 1;
    }
    .aul li .up .a3 .left .a3-1{
        font-size: 0.8rem; color: #438cff;
    }
    .aul li .up .a3 .left .a3-2{
        font-size: 0.6rem; color: #999;
    }
    .aul li .up .a3 .right{
        width: 6.5rem; font-size: 0.6rem; color: #EF7373; padding-top: 0.25rem;
        transform: translateX(-1.3rem); height: 1rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }

    .aul li .down{
        width: 100%; height: 2.5rem; line-height: 2.5rem; box-sizing: border-box; display: flex;
    }
    .aul li .down .left, .right{
        text-align: center; font-size: 0.75rem; color: #438CFF;
    }
    .aul li .down .left img{
        width: 0.7rem; height: 0.7rem; display: inline;
    }
    .aul li .down .right img{
        width: 0.55rem; height: 0.7rem; display: inline;
    }

    .oneself{
        margin-top: 0.5rem;
    }
    .other{
        width: 100%; text-align: center; font-size: 0.7rem; color: #999; margin-top: 4.25rem;
    }

    .fixed{
        width: 100%; height: 20px; line-height: 20px; text-align: center; font-size: 0.5rem; color: #999999; position: fixed; left: 0; bottom: 0; background: #fff;
    }
    .returnTop{
        width: 1.5rem; height: 1.5rem; position: fixed; right: 20px; bottom: 20px;
    }
</style>