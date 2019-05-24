<template>
  <div class="optionalNews">
    <mt-header fixed :title="title">
      <router-link to="/" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
      <router-link to="/search" slot="right" class="search"><img src="../assets/img/search_white.png" alt=""></router-link>
    </mt-header>
    <img src="../assets/img/demo_banner.png" alt="" class="banner">
    <div class="article">
      <div class="title">今年雾霾：提升综合服务能力、 强化风控迎接科创板机遇</div>
      <div class="subtitle"><span>南第一财经 2019-03-09 14:57</span></div>
      <div class="article-main">证券时报e公司讯，国信证券近日接受机构调研时 表示，科创板主要服务于符合国家战略、具备关键 核心技术的科技型创新企业，公司投行</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'myOptional',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      title:'',
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped type="text/scss">
.banner{
  display: block;
  width: 100% ;
  border-bottom: 10px solid #eee;
}
  .title{
    font-size: 22px;
    text-align: center;
    color: #333333;
    line-height: 32px;
    margin-top: 20px;
    margin-bottom: 15px;
  }
  .subtitle{
    height: 5px;
    font-size: 12px;
    line-height: 12px;
    margin-bottom: 20px;
    color: #999999;
    border-bottom: 1px solid #eee;
    span{
      padding: 0 10px 1px;
      background: #ffffff;
    }
  }
  .article-main{
    text-align: left;
  }
  .article{
    width: 90%;
    margin: 0 auto;
    font-size: 14px;
    color: #666666;

    line-height: 2;
  }
</style>
