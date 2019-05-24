<template>
    <div class="main">
        <div class="text">
            <span>暂无公司</span>
            <br/>
            <span>请创建公司或联系企业主添加到您的公司</span>
        </div>
        <button class="btn"><a href="/company/createCompany">创建公司</a></button>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        name: "no-company",
        data(){
            return{

            }
        }
    }
</script>

<style scoped>
    .main{
        width: 100%;
    }
    .text{
        margin-top: 7rem; text-align: center; font-size: 0.7rem; color: #666;
    }
    .btn{
        width: 30%; height: 2rem; background: #438cff; text-align: center; margin: 2rem auto 0; display: block; line-height: 2rem;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
        border: none;

    }
    .btn a{
        color: #fff; display: inline-block; width: 100%; height: 100%;
    }
</style>