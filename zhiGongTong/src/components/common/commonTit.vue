<template>
  <div class='commonTit' :class="{smallSize:type}">
    {{title}}
    <span @click="jump(projectId)" class="view fr" v-if="jumpShow">查看项目>></span>
    <span @click="jumpBack()" class="view fr" v-if="backToList">返回项目列表>></span>
  </div>
</template>

<script>
    export default {
        name: "",
        data() {
            return {}
        },
        props:['title','type','jumpShow','projectId','backToList'],
        methods: {
          jump(id){
            this.$router.push({
              path:'/project/detail/'+id
            })
          },
          jumpBack(){
            this.$router.push({
              path:'/attend/projectList/'
            })
          }
        }
    }
</script>

<style lang="scss" type="text/scss" scoped>
.commonTit{
  width: 100%;
  background-color: #EFF5FB;
  height: 60px;
  font-size: 20px;
  line-height: 60px;
  text-align: left;
  text-indent: 29px;
}
  .smallSize{
    font-size: 16px;
  }
  .view{
    font-size: 16px;
    margin-right: 30px;
    cursor: pointer;
  }
</style>
