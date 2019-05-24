<template>
    <f7-page name="personCenter">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left">
                    <a href="#" class="open-panel">
                        <img class="left" src="../../../static/img/cebianlan_icom.png" />
                    </a>
                </div>
                <div class="center">新增页面</div>
            </div>
        </div>
        <!---侧边栏--->
        <group-nav></group-nav>
        <!--页面主要类容-->
        <div class="content-block">
            <div style="width: 100%; height: 2rem; line-height: 2rem; background: #438cff; text-align: center"
            id="btn"
            >杰文</div>
        </div>
    </f7-page>
</template>

<script>
    var $$ = Dom7;
    import { userApi, dviApi } from '../../api'
    import { LocalCache } from '../../lib/utils'
    import groupNav from '../../components/broadside-navigation/group'
    export default {
        data(){
            return{

            }
        },
        components: {
            groupNav
        },
        methods: {

        },
        created(){

        },
        mounted() {
            document.getElementById('btn').onclick = function () {
                console.log('我点击了');
            }
        }
    }
</script>

<style scoped>

</style>