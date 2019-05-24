<template>
    <div class="container">
      <common-tit :title="title" :type="true"></common-tit>
      <div class="infoChecking">
        您已提交创建公司申请 <br>
        请等待审核 <br>
        预计1个工作日内完成审核
      </div>
    </div>
</template>

<script>
  import commonTit from '@/components/common/commonTit'
    export default {
      name: "infoChecking",
      components:{
        commonTit
      },
      data() {
          return {
            title:"等待审核中",
          }
      },
      methods: {}
    }
</script>

<style lang="scss" type="text/scss" scoped>
.infoChecking{
  text-align: center;
  font-size: 18px;
  line-height: 2;
  letter-spacing: 1px;
  padding-top: 180px;
}
</style>
