<template>
    <div data-page="equipManage" class="page navbar-fixed toolbar-fixed">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">项目信息录入情况</div>
            </div>
        </div>
        <div class="page-content infinite-scroll">
            <div class="main">
                <div class="nav row">
                    <div class="col-33">项目</div><div class="col-33">未实名认证</div><div class="col-33">未采集人像</div>
                </div>
                <ul class="aul">
                    <li v-for="item in list" @click="enterAction(item)">
                        <a class="row">
                            <div class="col-33 two">{{item.name}}</div><div class="col-33 one">{{item.noIDCount}}</div><div class="col-33 one">{{item.noFacedCount}}</div>
                            <img src="../../../../../static/img/btn_right.png" />
                        </a>
                    </li>
                </ul>
            </div>
            <div class="fixed" v-show="this.totalItems>15">{{this.list.length==this.totalItems?'已全部加载完':'上拉加载更多'}}</div>
            <img @click="goTopAction" class="returnTop" src="../../../../../static/img/btn_return_top.png"/>
        </div>
    </div>
</template>

<script>
    var $$ = Dom7;
    import { companyApi } from '../../../../api'
    export default {
        data() {
            return {
                list: [],
                page: 1,
                pageSize: 15,
                totalPages: '',
                totalItems: ''
            }
        },
        methods:{
            enterAction(item){
                this.$router.load({url: '/company/groupInfoEnteringList/'+item.id+'/'+item.name});
            },
            goTopAction(){
                $$('.page-content').scrollTop(0,0);
            }
        },
        mounted(){
            companyApi.companyProjList(this.page, this.pageSize).then((result)=>{
                console.log('我获取了公司项目列表');
                console.log(result);
                this.list = result.data;
                this.totalPages = result.pagination.totalItems;
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
                        companyApi.companyProjList(that.page, that.pageSize).then((result)=>{
                            console.log('我获取了公司项目列表');
                            console.log(result);
                            that.list = that.list.concat(result.data);
                            console.log('排序后',that.list);
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

.main{
    width: 100%; background: #fff; margin-top: 0.5rem; box-sizing: border-box; padding: 0 0.6rem;
}
.main .nav{
    width: 100%; height: 2rem; line-height: 2rem; display: flex; justify-content: space-between; border-bottom: 1px solid #f4f4f4;
    font-size: 0.7rem; color: #999;
}
.main .nav div{
    text-align: center;
}
.main .aul li{
    height: 2.5rem; line-height: 2.5rem; border-bottom: 1px solid #f4f4f4; position: relative;
}
.main .aul li a{
    width: 100%; height: 100%; display: block; font-size: 0.7rem; color: #666; display: flex;
}
.main .aul li a .one{
    text-align: center;
}
.main .aul li a .two{
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.main .aul li a img{
    width: 0.9rem; height: 0.9rem; position: absolute; right: 0; top: 0.8rem;
}

.fixed{
    width: 100%; height: 20px; line-height: 20px; text-align: center; font-size: 0.5rem; color: #999999; position: fixed; left: 0; bottom: 0; background: #fff;
}
.returnTop{
    width: 1.5rem; height: 1.5rem; position: fixed; right: 20px; bottom: 20px;
}
</style>