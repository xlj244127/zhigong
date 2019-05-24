<template>
  <div class="myOptional">
    <mt-header fixed title="我的自选">
      <router-link to="/search" slot="right" class="search"><img src="../assets/img/search_white.png" alt=""></router-link>
    </mt-header>
    <ul>
      <li v-for="(item,index) in optionalList" v-if="optionalList.length!=0">
        <div class="name" @click="jumpTo(item.id)">{{item.name}}</div>
        <div class="code" @click="jumpTo(item.id)">{{item.code}}</div>
        <div class="option" @click="del(item.id)"><span>删除</span></div>
      </li>
      <li v-else class="noData">
        您还没有添加股票到自选股
      </li>
    </ul>
  </div>
</template>

<script>

  export default {
  name: 'myOptional',
  data () {
    return {
      optionalList:[
        {
          name:"平安银行",
          code:"000001",
          id:"1",
        }
      ],
    }
  },
  methods:{
    jumpTo(val){
      this.$router.load({url:"/optionalNews/"+val});
    },
    del(val){
      console.log(val)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped type="text/scss">

  ul>li{
    overflow: hidden;
    border-bottom: 1px solid #eee;
  }
  .name,.code,.option{
    float: left;
    font-size: 40px;
    line-height: 40px;
    width: 30%;
  }
  .name{
    padding-left: 5%;
    text-align: left;
    color: #333333;
    font-size: 16px;
  }
  .code{
    color: #666666;
    font-size: 14px;
  }
  .option{
    text-align: center;
    font-size: 12px;
    color: #ff6f28;
    text-align: right;
    padding-right: 5%;
    span{
      padding: 2px;
      border: 1px solid #ff6f28;
      -webkit-border-radius: 3px;
      -moz-border-radius: 3px;
      border-radius: 3px;
    }
  }
</style>
