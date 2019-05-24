<template>
    <div class="login">
      <form-background  class="formBg">
      </form-background>
    </div>
</template>

<script>

  import formBackground from '../../components/login/formBackground'
    export default {
      name: "",
      components:{
        formBackground
      },
      data() {
          return {}
      },
      methods: {}
    }
</script>

<style lang="scss" type="text/scss">
  @import '../../assets/sass/global';
  #app{
    height: 100%;
  }
  .login{
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
    position: relative;
  }

  .formBg{
    width: 700px;
    position: absolute;
    right: 40%;
    top: 50%;
    margin-top: -250px;
    height: 500px;
    margin-left: -400px;

  }
</style>
