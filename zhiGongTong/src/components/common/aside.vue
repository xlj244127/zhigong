<template>
  <div id="commonMenu">
    <div class="menuInfo">
      <h1>{{title}}</h1>
      <div class="imgBox">
        <img :src="src" alt="" class='avatar'>
        <span class="cert certed" @click.prevent="toCert()" v-if='certOption'><img :src="certed" alt=""></span>
        <span class="cert noCert" @click.prevent="toEditCert(userId)" v-else><img :src="noCert" alt=""></span>
      </div>
      <div class="name">
        <span class="namePart" v-if="userName!=null" :title="userName">{{userName}}</span>
        <span class="namePart" v-else-if="wxOpenid!=null">{{wxOpenid}}</span>
        <span class="namePart" v-else>{{mobile}}</span>
      </div>
      <div class="type type-admin" v-if='companyRole==1'>{{admin}}</div>
      <div class="type type-proj" v-if='companyRole==2'>{{proj}}</div>
    </div>
    <div class="menu">

      <el-menu
        default-active="1"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        background-color="#4A90FE"
        text-color="#fff"
        active-text-color="#fff">
        <label v-for='(item,index) in menuList' :key='index'>
          <el-submenu :index="item.nameIndex" v-if="item.children!=null">
            <template slot="title">
              <i class="iconfont":class="item.class"></i>
              <span>{{item.name}}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item :index="item2.nameIndex" v-for="(item2,index) in item.children" :key="index">
                <router-link :to='item2.link'>
                  <i class="iconfont" :class='item2.class'></i>
                  <span>{{item2.name}}</span>
                </router-link>
              </el-menu-item>

            </el-menu-item-group>
          </el-submenu>
          <el-menu-item :index="item.nameIndex" v-else>
            <router-link :to='item.link'>
              <i class="iconfont" :class='item.class'></i>
              <span>{{item.name}}</span>
            </router-link>
          </el-menu-item>
        </label>
      </el-menu>
    </div>
  </div>
</template>

<script>
    import src from '../../assets/img/placeholder.jpg'
    import certedImg from '../../assets/img/certed_img.png'
    import noCertImg from '../../assets/img/no_cert_img.png'
    import avatar from '../../assets/img/default_avatar.png'
    import { rightsApi } from "../../api";
    import { LocalCache } from "../../lib/utils";
    import {app} from "../../main";
    export default {
      name: "commonAside",
      inject:['reload'],
      data() {
        return{
          title:'智工通企业管理平台',
          userName:'',
          type:'',
          src:avatar,
          companyId:'',
          admin:'企业管理员',
          proj:'项目管理员',
          companyRole:'',
          certed:certedImg,
          noCert:noCertImg,
          certOption:false,
          userId:'',
          menuList:[
            {
              class:'icon-shouye',
              name:'首页',
              link:'/index',
              children:null,
              nameIndex:'1',
            },{
              class:'icon-xiangmuguanli1',
              name:'项目管理',
              nameIndex:"2",
              link:'/project/index',
              children:null
            },{
              class:'icon-kaoqinguanli',
              name:'考勤管理',
              children:[{
                class:'icon-projectStatistics',
                name:'考勤统计',
                link:'/attend/projectList',
                nameIndex:"31"
              },{
                class:'icon-projectAttend',
                name:'项目考勤',
                link:'/attend/index',
                nameIndex:"32"
              }],
              nameIndex:"3",
            },{
              class:'icon-quanxianshezhi',
              name:'权限设置',
              link:'/limit/index',
              children:null,
              nameIndex:"4",
            },{
              class:'icon-qiyexinxi',
              name:'企业信息',
              link:'/information/index',
              children:null,
              nameIndex:"5",
            }
          ]
        }
      },
      components:{

      },
        props:['userDetail','companyInfo'],
      methods: {
        toCert(){
          this.$router.push({path:'/cert/index/'})
        },
        toEditCert(userId){
          //console.log(userId);
          this.$router.push({path:'/cert/editCert/'+userId})
        },
        handleOpen(key, keyPath) {
         //console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
          //console.log(key, keyPath);
        }
      },
      watch:{
        userDetail:{
          handler(curVal,oldVal){
            //console.log(curVal, oldVal);
            this.userName = curVal.name
            if(this.$store.state.avatar != ''){
              this.src = this.$store.state.avatar
            }else{
              this.src = curVal.avatar
            }

            this.wxOpenid= curVal.wxOpenid
            this.mobile =curVal.mobile
          },
          deep:true
        }
      },

      beforeMount(){
        let that = this,
            companyInfo = LocalCache.get('companyInfo'),
            newId = companyInfo.companyId,
            userInfo = LocalCache.get('userInfo');
        this.userId =userInfo.id;
        this.companyRole =companyInfo.companyRole;
        //console.log(this.userId);
        let firstArr = [{
          class:'icon-shouye',
          name:'首页',
          link:'/index',
          children:null,
          nameIndex:'1',
        },{
          class:'icon-xiangmuguanli1',
          name:'项目管理',
          nameIndex:'2',
          link:'/project/index',
          children:null
        }],secordArr=[{
          class:'icon-bianji1',
          name:'信息录入',
          link:'/infoEntry/index',
          children:null,
          nameIndex:'4',
        }],thirdArr=[],limitArr=[],approveArr=[],attendArr=[];
        if(that.companyRole==1){
          attendArr = [{
            class:'icon-kaoqinguanli',
            name:'考勤管理',
            children:[{
              /*class:'icon-projectStatistics',*/
              name:'考勤统计',
              link:'/attend/index',
              nameIndex:'31'
            },{
              /*class:'icon-projectAttend',*/
              name:'项目考勤',
              link:'/attend/projectList',
              nameIndex:'32'
            }],
            nameIndex:'3',
          }]
          limitArr = [{
            class:'icon-quanxianshezhi',
            name:'权限管理',
            children:[{
              name:'企业管理员',
              link:'/limit/admin',
              nameIndex:'51'
            },{
              name:'项目管理员',
              link:'/limit/project',
              nameIndex:'52'
            }],
            nameIndex:'5',
          }]
          thirdArr = [{
            class:'icon-heimingdan',
            name:'黑名单管理',
            link:'/blacklist/index',
            children:null,
            nameIndex:'7',
          },{
            class:'icon-qiyexinxi',
            name:'企业信息',
            link:'/information/index',
            children:null,
            nameIndex:'8',
          }]
        }else{
          attendArr = [{
            class:'icon-kaoqinguanli',
            name:'考勤管理',
            children:[{
              /*class:'icon-projectAttend',*/
              name:'项目考勤',
              link:'/attend/projectList',
              nameIndex:'31'
            }],
            nameIndex:'3',
          }]
          limitArr = [{
            class:'icon-quanxianshezhi',
            name:'权限管理',
            children:[{
              name:'项目管理员',
              link:'/limit/project',
              nameIndex:'52'
            }],
            nameIndex:'5',
          }]
          thirdArr =[
            {
              class:'icon-heimingdan',
              name:'黑名单管理',
              link:'/blacklist/index',
              children:null,
              nameIndex:'7',
            }
          ]
        }
        let rightIds = []
        rightsApi.getUserRights(newId,this.userId).then((res)=>{
          console.log("getUserRights",res.data);
          for(var i=0;i<res.data.length;i++){
            rightIds.push(res.data[i].permissionsId)
          }
          console.log("rightIds",rightIds);
          console.log(rightIds.indexOf(3));
          if(rightIds.indexOf(1)!=-1){
            let limitAdd = [{
              name:"权限设置",
              link:'/limit/settings',
              nameIndex:'53'
            }]
            limitArr[0].children = [...limitArr[0].children,...limitAdd]
            console.log(limitArr);
          }
          /*if(rightIds.indexOf(2)!=-1){ //考勤规则有判定条件
            let attendAdd = [{
              name:"考勤规则",
              link:'/attend/rule',
              nameIndex:'33'
            }]
            attendArr[0].children = [...attendArr[0].children,...attendAdd]
            console.log(attendArr);
          }
          if(rightIds.indexOf(3)!=-1){ //审批管理有判定条件
            let approveAdd = [{
              class:'icon-shenpi',
              name:'审批管理',
              link:'/approve/index',
              children:null,
              nameIndex:'6',          }]
            approveArr = approveAdd
            console.log(attendArr);
          }*/
          let attendAdd = [{
            name:"考勤规则",
            link:'/attend/rule',
            nameIndex:'33'
          }]
          attendArr[0].children = [...attendArr[0].children,...attendAdd]
          let approveAdd = [{
            class:'icon-shenpi',
            name:'审批管理',
            link:'/approve/index',
            children:null,
            nameIndex:'6',          }]
          approveArr = approveAdd
          //this.menuList = [...firstArr,...attendArr,...secordArr,...limitArr,...approveArr,...thirdArr] 含有权限规则的侧栏
          this.menuList = [...firstArr,...attendArr,...secordArr,...approveArr,...thirdArr]
        }).catch((res)=>{
          this.$message.error(res.msg)
          console.log("error",res);
        })
        let index={

        }

        let userDetail =LocalCache.get('userDetail')
        //console.log(userDetail);
        if(userDetail == false){
          this.certOption = false
        }else{
          this.certOption = true
        }
      },
      mounted(){

      }
    }
</script>

<style lang="scss" type="text/scss" scoped>
  @import "../../assets/sass/variable";
  //menuInfo
  h1{
    font-size: 20px;
    line-height: 80px;
    color: $cf;
  }
  .imgBox{
    width: 90px;
    height: 90px;
    margin: 0 auto;
    background: #eeeeee;
    position: relative;
    @include brs(50%);
    .avatar{
      width: 90px;
      height: 90px;
      @include brs(50%);
      overflow: hidden;
    }
    .cert{
      position: absolute;
      right: -39px;
      top: 0;
    }
  }
  .name{
    font-size: 16px;
    line-height: 20px;
    padding-top: 18px;
    padding-bottom: 15px;
    color: #ffffff;
    width: 180px;
    overflow: hidden;
    white-space:nowrap;
    -ms-text-overflow: ellipsis;
    text-overflow: ellipsis;
    margin: 0 auto;
  }
  .type{
    width: 90px;
    height: 24px;
    @include brs(13px);
    margin: 0 auto;
    font-size: 14px;
    line-height: 24px;
    background: #ffffff;
    &.type-admin{
      border: 1px solid $org;
      color: $org;
    }
    &.type-proj{
      border: 1px solid $projRed;
      color: $projRed;
    }
  }
  .menuInfo{
    padding-bottom: 30px;
    border-bottom: 1px solid #62A2FD;
  }
  //menu
  .menu {
    padding-top: 20px;
    li {
      font-size: 20px;
      line-height: 56px;
      color: $cf;
      text-align: left;
      color: #ffffff;
      cursor: pointer;
      a{
        text-decoration: none;
        display: block;
      }
      i{
        font-size: 20px;
        color: #ffffff;
      }
      span{
        padding-left: 12px;
      }
      img{
        float: left;
        width: 24px;
        height: 24px;
      }
    }
  }
  #commonMenu /deep/ .el-submenu__title{
    padding-left: 20px !important;
  }
</style>
