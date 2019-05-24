<template>
    <div data-page="lookFace" class="page navbar-fixed">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">查看人脸信息</div>
            </div>
        </div>
        <div class="page-content">
            <div class="head">
                <img :src="img"/>
            </div>
        </div>
    </div>
</template>

<script>
    import {userApi} from '../../../../api'
    export default {
        data(){
            return{
                userId: '',
                img: ''
            }
        },
        methods:{

        },
        mounted(){
            this.userId = this.$route.params.id;
            console.log(this.userId);

            userApi.facePictrue(this.userId).then((result)=>{
                console.log(result.data);
                this.img = result.data+'?'+Math.random();
                console.log(this.img);
            })
        }
    }
</script>

<style scoped>
.page-content{
    width: 100%; height: 100%; background: #f4f4f4;
}
.head{
    background: #fff; overflow: hidden;
}
.head img{
    max-width: 90%; max-height: 90%; display: block; margin: 1.7rem auto;
}
</style>