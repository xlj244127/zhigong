<template>
  <div class='container blacklist'  v-loading="loading"
       element-loading-text="正在加载">
    <board :boardStyle="boardStyle" :blackListStat="blackListStat"></board>
    <p class="common">
      公共黑名单功能后续开通，敬请期待
    </p>
  </div>
</template>

<script>
  import { userApi,blackListApi } from "../../api";
  import { LocalCache } from "../../lib/utils";
  import board from "@/components/blacklist/board"

  export default {
    name: "infoEntry",
    components:{
      board
    },
    data() {
      return {
        loading:true,
        companyId:"",
        blacklistSum:{},
        boardStyle:'public',
        blackListStat:{},
      }
    },
    methods: {
      loadingClose(){
        setTimeout(() => {
          this.loading = false;
        }, 500);
      },

      toZero(val){
        if(!val){
          return 0
        }else{
          return val
        }
      },

      getData(){
        blackListApi.blackListStat(this.companyId).then((result)=>{
          console.log('企业管理员黑名单统计',result);
          this.blackListStat = result.data;
          this.hasDate = result.data.publicNum;
        })
      },
    },
    beforeMount(){
      this.loadingClose()
      this.companyId = LocalCache.get('companyInfo').companyId;
    },
    mounted(){
      this.getData()
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import '../../assets/sass/variable';
  .blacklist{
    .common{
      font-size: 18px;
      text-align: center;
      line-height: 300px;
    }
  }
</style>
