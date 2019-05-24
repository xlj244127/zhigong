<template>
  <!-- App -->
  <div id="app">
    <!-- Statusbar -->
    <f7-statusbar></f7-statusbar>

      <!-- Login Screen Views -->
      <f7-login-screen>
          <f7-view>
              <f7-pages>
                  <offlineMode></offlineMode>
              </f7-pages>
          </f7-view>
      </f7-login-screen>

    <!-- Main Views -->
    <f7-views>
      <f7-view id="main-view" main>
        <f7-pages>
          <!--<f7-page>-->
            <!--<f7-block>-->
                <home v-if="!userInfo"></home>
                <choose v-else-if="userStatus == null" @chosen="chosen"></choose>
                <admin-home v-else-if="userStatus"></admin-home>
                <staff-home v-else></staff-home>
            <!--</f7-block>-->
          <!--</f7-page>-->
        </f7-pages>
      </f7-view>
    </f7-views>
  </div>
</template>

<script type="text/ecmascript-6">
    import { LocalCache } from './lib/utils'
    import { userApi } from './api'
    import Home from './pages/Home.vue'
    import Choose from './pages/user/Choose.vue'
    import AdminHome from './pages/user/AdminHome.vue'
    import StaffHome from './pages/user/StaffHome.vue'
    import OfflineMode from './pages/company/offLineMode.vue'

    export default {
        data() {
            return {
                isAdmin: false,
                userStatus:''
            }
        },
        computed: {
            userInfo() {
                return this.$store.state.userInfo;
            }
        },
        components: {
            Home, Choose, AdminHome, StaffHome, OfflineMode
        },
        mounted() {
            this.isAdmin = LocalCache.get('isAdmin');
            this.$store.state.userInfo = LocalCache.get('userInfo');

            if(this.$store.state.userInfo!=null){
                userApi.detail().then((result)=>{
                    console.log('我的个人信息',result.data);
                    let userInfo = LocalCache.get('userInfo');
                    userInfo.name = result.data.name;
                    userInfo.avatar = result.data.avatar;
                    this.$store.state.userInfo.name = userInfo.name;
                    LocalCache.set('userInfo', userInfo);
                    this.$store.state.userInfo = result.data;

                    userApi.information().then((result)=>{
                        //console.log('APP.Vue roleInfo',result.data);
                        this.$store.state.roleInfo = result.data;
                        var companyRole = this.$store.state.roleInfo.companyRole;
                        if(this.isAdmin==true){
                            this.userStatus=true;
                        }else if(this.isAdmin==false){
                            this.userStatus=false;
                        }else if(this.isAdmin==null){
                            if(companyRole==1||companyRole==2){
                                this.userStatus=true
                            }else if(companyRole==3){
                                this.userStatus=false
                            }else{
                                this.userStatus=null
                            }
                        }
                    });
                })

            }

        },
        methods: {
            reinit () {
                // window.history.back();
            },
            chosen(isAdmin) {
                this.isAdmin = isAdmin
            }
        }
    }
</script>
