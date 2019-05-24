<template>
    <f7-page name="typeList">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center">请选择您的工种</div>
            </div>
        </div>
        <div class="list-block">
            <ul>
                <!-- Single radio input -->
                <li v-for="(item, key) in data" :key="key">
                    <label class="label-radio item-content">
                        <!-- Checked by default -->
                        <input type="radio" name="my-radio" :value="item.code" v-model="chosen" >
                        <div class="item-inner">
                            <div class="item-title">{{item.value}}</div>
                        </div>
                    </label>
                </li>
            </ul>
        </div>
        <div class="w92per" v-show="btnStatus">
            <a href="#" class="btn" @click="submit">{{submitText}}</a>
        </div>
        <!--<div>当前选择的值为{{chosen}}</div>-->
    </f7-page>

</template>

<script type="text/ecmascript-6">
    import { dviApi, groupApi } from '../../api'
    export default {
        name: 'typeList',
        data () {
            return {
                data:'',
                userWorkType:'',
                chosen:'',
                groupLeaderId: 0,
                btnStatus:false,
                submitText:'确认提交'
            }
        },
        methods: {
            async initPage(that){
                let workTypes;
                workTypes = await dviApi.getWorkTypes();
                workTypes = workTypes.data.list;
                console.log(workTypes);
                this.data = workTypes;
                that.userWorkType = workTypes.value;
                this.btnStatus=true
            },
            submit(){
                console.log(this.chosen);
                let that = this;
                if(this.chosen)
                    groupApi.addToWorkGroup(this.chosen, this.groupLeaderId).then((result)=>{
                        that.$router.back();
                    });
            }
        },
        mounted(){

        },
        mounted() {
            this.initPage(this);
            this.groupLeaderId = this.$route.query.groupLeaderId;
            console.log(this.data);
        }
    }
</script>
<style scoped  lang="scss"  type="text/scss">
    .w92per{
        .btn{
            width: 70%; height: 2rem; background: #438cff; color: #fff; line-height: 2rem; text-align: center;
            margin-left: 15%; border: 1px solid #438cff; border-radius: 0.3rem; font-size: 0.8rem;
            display: inline-block;
        }
    }
    .list-block{
        margin-top: 0;
        ul:before{
            height: 0;
        }
    }
</style>