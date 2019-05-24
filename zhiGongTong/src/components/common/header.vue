<template>
  <div id="header" v-loading.fullscreen.lock="fullscreenLoading"
       element-loading-text="正在登出">
    <el-button type="primary" v-if="companyId==0" @click.prevent="creatCompany" class="create"><img :src="createCompany" alt=""></el-button>
    <span class="fl companyName" v-else>{{companyName}}</span>
    <div class="fr tools">
      <div class="toolItem" @click.prevent='certificate(userId)'><span class="zhiGong setting-icon">&#xe63c;</span>个人认证</div>
      <el-tooltip placement="bottom" effect="light" class="fl">
        <div slot="content" class="qrCode-box">
          <div class="boxItem">
            <img :src="qrCode" alt="">
          </div>
        </div>
        <el-button class="toolItem">
          <span class="zhiGong">&#xe629;</span>  APP
        </el-button>
      </el-tooltip>
      <div class="toolItem" @click.prevent='settings()'><span class="zhiGong setting-icon">&#xe634;</span>设置</div>
      <div class="toolItem" @click.prevent='logOut()'><span class="zhiGong logout-icon">&#xe62f;</span>退出</div>
    </div>
  </div>
</template>

<script>
    import src from '../../assets/img/placeholder.jpg'
    import createCompany from '../../assets/img/create_company.png'
    import {LocalCache} from "../../lib/utils";
    import {companyApi,userApi} from "../../api";
    import qrCode from "../../assets/img/qr_code.png"
    export default {
        name: "commonHeader",
        props:['certStatus'],
        data() {
            return {
              companyName:'',
              src:src,
              companyId:'',
              createCompany:createCompany,
              qrCode:qrCode,
              fullscreenLoading:false,
              certOption:null,
              userId:'',
              companyRole:'',
            }
        },
        methods: {
          logOut(){
            this.$confirm('此操作退出该帐号, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.fullscreenLoading =true
              userApi.logOutWeb().then((res)=>{
                LocalCache.set('lastId',LocalCache.get('userInfo').id)
                LocalCache.del('userInfo');
                LocalCache.del('userDetail');
                LocalCache.del('companyInfo');
                LocalCache.del('scaleList');
                LocalCache.del('tradeList');
                LocalCache.del('setPwd');
                LocalCache.del('sessionkey');
                LocalCache.del('hasPassword');
                this.$message({
                  type: 'success',
                  message: '登出成功!'
                });
                console.log(res);
                this.fullscreenLoading = false
                this.$router.push({path:'/login/index'})
              }).catch((res)=>{
                this.$message({
                  type: 'error',
                  message: res.msg
                });
              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消登出'
              });
            });
          },
          settings(){
            this.$router.push({path:'/settings/index/'})
          },
          certificate(userId){
            //this.$router.push({path:'/cert/index/'})
            if(this.userDetail!=false){
              this.$router.push({path:'/cert/index/'})
            }else{
              this.$router.push({path:'/cert/editCert/'+userId})
            }
          },
          creatCompany(){
            this.$router.push({path:'/create/index/'})
          },

        },
      beforeMount(){
          this.userDetail = LocalCache.get('userDetail')
          this.userId = LocalCache.get('userInfo').id
      },
      mounted(){
        this.companyId = LocalCache.get('companyInfo').companyId;
        this.companyRole = LocalCache.get('companyInfo').companyRole;

        if(this.companyId!=0){
          companyApi.companyInfo(this.companyId).then((res)=>{
            //console.log(res);
            this.companyName= res.data.name;
          })
        }
      }
    }
</script>

<style lang="scss" type="text/scss">
  @import '../../assets/sass/variable';
.companyName{
  color: #333;
  font-size: 18px;
  line-height: 60px;
}
  .tools{
    font-size: 16px;
    color: #333333;
    .el-tooltip{
      border: none;
      height: 60px;
      width: 96px;
      -webkit-border-radius: 0;
      -moz-border-radius: 0;
      border-radius: 0;
      img{
        width: 14px;
        height: 14px;
        vertical-align: middle;
      }
    }
    .toolItem{
      float: left;
      height: 60px;
      line-height: 60px;
      text-align: center;
      cursor: pointer;
      padding: 0 20px;
      &:hover{
        color: #409eff;
        background: #ecf5ff;
      }
      img{
        width: 14px;
        height: 14px;
        vertical-align: middle;
      }
      .zhiGong{
        font-size: 24px;
        line-height: 60px;
        vertical-align: middle;
        margin-right: 6px;

        &.logout-icon{
          font-size: 22px;

        }
      }
    }

  }
  #header .el-button.create{
    float: left;
    margin-top: 7px;
    background: #ffffff;
    border: none;
    padding: 0;
  }
  .el-button .zhiGong{
    font-size: 22px;
    vertical-align: middle;
  }
  .qrCode-box{
    overflow: hidden;
    padding-left: 5px;
    padding-right: 5px;
    padding-top: 10px;
    padding-bottom: 10px;
    .boxItem{
      float: left;
      width: 120px;
      text-align: center;
      img{
        width: 100px;
        height: 100px;
      }
      p{
        font-size: 14px;
        color: #999999;
        line-height: 2;
      }
    }
  }
</style>
