<template>
  <div class="myOptional">
    <mt-header fixed title="搜索">
      <router-link to="/" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
    </mt-header>
    <mt-search v-model="value">
      <mt-cell v-for="item in result" :title="item.title" :value="item.value" :key="item.key">

      </mt-cell>
    </mt-search>
  </div>
</template>

<script>
export default {
  name: 'myOptional',
  data () {
    return {
      result:[{

      }],
      value:''
    }
  },
  methods:{

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .noData{
    text-align: center;
    font-size: 14px;
    line-height: 40px;
    height: 40px;
    color: #999999;
    border-bottom: 1px solid #eee;
  }
</style>
