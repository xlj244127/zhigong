<template>
<div class="formTitle">
  <a href="http://www.zhigongxx.com">
    <img :src="titleSrc" alt="">
  </a>
</div>
</template>

<script>
  import formTitle from '@/assets/img/login_formTitle.png'
    export default {
        name: "",
        data() {
            return {
              titleSrc:formTitle
            }
        },
        methods: {}
    }
</script>

<style lang="scss" type="text/scss" scoped>
.formTitle{
  padding-bottom: 12px;
  display: block;
  margin: 0 auto;
  padding-top: 30px;
  padding-left: 54px;
  text-align: left;
}
</style>
