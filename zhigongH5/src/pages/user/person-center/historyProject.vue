<template>
    <f7-page name="historyProject"> <!--固定导航栏-->
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">历史项目</div>
            </div>
        </div>
        <div class="page-content">
            <img class="fixed" src="../../../../static/img/btn_return_top.png"/>
            <div class="top"></div>
            <div class="content-block">
                <ul class="list list-header">
                    <li>项目名称</li>
                    <li>项目地点</li>
                    <li>工作时间</li>
                </ul>
                <ul class="list list-content" v-for="item in projects">
                    <li>{{ item.name }}</li>
                    <li>{{ item.location }}</li>
                    <li>0</li>
                </ul>
            </div>
        </div>
    </f7-page>
</template>

<script>
    import { userApi } from '../../../api'

    export default {
        data() {
            return {
                projects: []
            };
        },
        mounted() {
            userApi.historyProjects().then((result)=>{
                console.log(result.data);
                this.projects = result.data;
            });

        }
    }
</script>

<style scoped>
.page-content .fixed{
    width: 1.5rem; height: 1.5rem; position: fixed; right: 0.5rem; bottom: 0.5rem;
}
.top{
    width: 100%; height: 0.5rem; background: #f4f4f4;
}
.content-block{
    margin: 0;
}
.list{
    display: flex; font-size: 0.8rem; border-bottom: 1px solid #ccc; box-sizing:border-box; padding-left: 0.6rem;
}
.list li{
    flex: 1; color: #666; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.list.list-header li {
    height: 2.5rem;
    line-height: 2.5rem;
}
.list.list-content li{
    font-size: 0.6rem;
    line-height: 0.7rem;
    padding: 0.5rem 0;
    color: #999;
}
</style>