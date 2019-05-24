<template>
    <div>
        <div class="top2">
            <div class="left">项目所在地</div>
            <div class="right" @click.stop.prevent="addressAction">
                <div class="r-1"><span>{{this.addressName}}</span><img src="../../../static/img/btn_drop_down.png"/></div>
                <div class="r-2">
                    <input id="pickerthree4" type="text"/>
                </div>
            </div>
        </div>
        <div class="top2">
            <div class="left">适用项目</div>
            <div class="right" @click.stop.prevent="selectProjAction">
                <div class="r-1"><span>{{this.projName}}</span><img src="../../../static/img/btn_drop_down.png"/></div>
                <div class="r-2">
                    <input id="pickerfour3" type="text"/>
                </div>
            </div>
        </div>
        <div class="list-block accordion-list">
            <label>
                <div class="all" @click="allSelect">
                    <input type="checkbox" name="all" />所有人员
                </div>
            </label>
            <ul class="aul" v-if="groupList.id==this.projectId">
                <li class="accordion-item" v-for="item in groupList.list">
                    <a href="#" class="item-content item-link">
                        <div class="item-inner">
                            <div class="tov">
                                <input type="checkbox" name="net" :data-id="item.id" :data-ischeck="item.isCheck">
                                <div @click.stop.prevent="departmentSelect(item.id)">{{item.name}}</div>
                            </div>
                        </div>
                    </a>
                    <div class="accordion-item-content">
                        <div class="content-block">
                            <label class="label-checkbox item-content" v-for="one in item.list">
                                <div class="item-inner">
                                    <div class="item-title">
                                        <div class="top">
                                            <div class="a2"><img :src="one.avatar"/></div>
                                            <div class="a3">
                                                <div class="left">
                                                    <span class="a3-1">{{(one.user_name?one.user_name:one.nickname)?(one.user_name?one.user_name:one.nickname):one.mobile}}</span>
                                                    <br/>
                                                    <span class="a3-2">{{one.mobile}}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                    <input type="checkbox" name="putu" :data-id="item.id" :data-groupId="one.work_group_id" :data-userId="one.user_id" :data-ischeck="one.ischeck"><!--:checked="{one.checked==true"-->
                                <div class="item-media">
                                    <i class="icon icon-form-checkbox"></i>
                                </div>
                            </label>
                        </div>
                    </div>
                </li>
            </ul>
            <div class="title">
                <span>提示：如适用多个项目，请在选择某一项目并选择该项目适用详情后，点击保存，再选择其他项目进行编辑</span>
            </div>
        </div>
        <div class="footer" @click="configAction">保存</div>
    </div>
</template>

<script>
    var $$ = Dom7;
    var pickerProj, pickerAddress;
    import { rightsApi, wxApi, userApi, projectApi, dutyApi } from '../../api';
    export default {
        name: "AccordingProj",
        data(){
            return{
                checked: true,
                companyId: '',
                dutyRuleId: '',
                projectId: '',
                projName: '请选择适用项目',
                projList: [],
                addressName: '请选择项目地址',
                provinceName: '',
                cityName: '',
                groupList: [],
                groupIdAddWorkerType: [],

                proviceList: [],            //以下都是调省市区插件的参数
                proviceIdList: [],
                cityList: [],
                provinceId: '',
                cityIdList: [''],
                cityNameList: [''],
                cityId: '',
                localAddress: {},             //省市区的地址全放里面存缓存里

                userDutyListStr: [],
                groupId: '',
                selectedPerson: [],
                arr: [],
                isExists : false
            }
        },
        props: ['status'],        //判断是创建(0)还是编辑(1)
        methods:{
            addressAction(){
                console.log('点击了');
                this.projList = [];
                this.groupList = [];
                pickerAddress.open();
            },
            selectProjAction(){
                console.log('点击了');
                if(this.provinceId=='' || this.cityId==''){
                    this.$f7.alert('请先选择地址信息，按地址选择项目');
                }else{
                    pickerProj.open();
                }
            },
            allSelect(){
                this.checked = !this.checked;
                if(this.checked) {
                    $$("input[name=all]").prop("checked", true);
                    $$("input[name=net]").each(function() {
                        $$(this).prop("checked", false);
                    });
                    $$("input[name=putu]").each(function() {
                        $$(this).prop("checked", false);
                    });
                }else{
                    $$("input[name=all]").prop("checked", false);
                    $$("input[name=net]").each(function() {
                        $$(this).prop("checked", true);
                    });
                    $$("input[name=putu]").each(function() {
                        $$(this).prop("checked", true);
                    });
                }
            },
            departmentSelect(param){
                console.log('点击了',param);
                this.checked = !this.checked;
                if(this.checked) {
                    $$("input[name=net]").each(function() {
                        if($$(this).data('id')==param){
                            console.log('点击了2', $$(this).data('id'));
                            $$(this).prop("checked", false);
                        }
                    });
                    $$("input[name=putu]").each(function() {
                        if($$(this).data('id')==param){
                            $$(this).prop("checked", false);
                        }
                    });
                }else{
                    $$("input[name=net]").each(function() {
                        if($$(this).data('id')==param){
                            $$(this).prop("checked", true);
                        }
                    });
                    $$("input[name=putu]").each(function() {
                        if($$(this).data('id')==param){
                            $$(this).prop("checked", true);
                        }
                    });
                }
            },
            common(){
                this.userDutyListStr = [];
                let list = [];
                $$("input[name=putu]").each((xls, elm)=>{
                    if($$(elm).prop("checked")){
                        if($$(elm).data('groupId')){
                            this.groupId = $$(elm).data('groupId');
                        }else{
                            this.groupId = null;
                        }
                        let obj = {
                            projectId: this.projectId,
                            workGroupId: this.groupId,
                            userId:  $$(elm).data('userId'),
                            usedType: 1,
                            companyId: this.companyId
                        }
                        list.push(obj);
                    }
                });
                this.userDutyListStr.push({
                    'id': this.projectId,
                    'list': list,
                    'name': this.projName
                });

                if(this.$store.state.userDutyListStr.length!=0){
                    this.arr = [];
                    this.$store.state.userDutyListStr.map((res)=>{
                        this.arr.push(res.id);
                    })
                }

            },
            configAction(){
                this.common();
                if(this.$store.state.userDutyListStr.length!=0){
                    console.log(this.userDutyListStr, this.arr, this.userDutyListStr[0].id, this.projectId);
                    if(this.arr.indexOf(this.projectId) == -1){
                        console.log('进入two');
                        this.$store.state.userDutyListStr = this.$store.state.userDutyListStr.concat(this.userDutyListStr);
                    }else{
                        this.$store.state.userDutyListStr.map((res)=> {
                            if(res.id == this.projectId){
                                console.log('进入one');
                                res.list = this.userDutyListStr[0].list
                            }
                        })
                    }
                }else{
                    this.$store.state.userDutyListStr = this.userDutyListStr;
                }

                console.log('按项目筛选的人', this.$store.state.userDutyListStr);
                this.$emit('modelAction');
            },
            getProjs(){
                wxApi.projectList(
                    this.companyId,
                    this.provinceId,
                    this.cityId
                ).then((result)=>{
                    console.log('根据省市区获取项目'+result.date);
                    this.projList = result.data;
                    console.log('项目',this.projList);
                    if(this.projList.length==0){
                        this.projectId = '';
                        this.projName = '';
                        this.groupList = [];
                    }else{
                        this.projectId = this.projList[0].id;
                        this.projName = this.projList[0].name;
                        dutyApi.getProjWorkGroupList(this.dutyRuleId, this.companyId, this.projectId, this.provinceId, this.cityId).then((result)=>{
                            console.log('项目下面的班组2',result.data);
                            this.groupList = result.data[0];
                            // if(this.status==1){
                                this.$nextTick(()=>{
                                    if(this.$store.state.userDutyListStr.length!=0){
                                        this.$store.state.userDutyListStr.map((res)=>{
                                            if(res.id == this.projectId){
                                                res.list.map((one)=>{
                                                    if(one.workGroupId == null){
                                                        one.workGroupId = 0;
                                                    }
                                                    $$("input[name=putu]").each((xls, elm)=>{
                                                        if($$(elm).data('userId')==one.userId){
                                                            $$(elm).attr('checked',true);
                                                        }
                                                    })
                                                    $$("input[name=net]").each((xls2, elm2)=>{
                                                        if($$(elm2).data('id')==one.workGroupId){
                                                            $$(elm2).attr('checked',true);
                                                        }
                                                    })
                                                })
                                            }
                                            // else{
                                            //     $$("input[name=putu]").each((xls, elm)=>{
                                            //         console.log('用户',$$(elm).data('ischeck'));
                                            //         if($$(elm).data('ischeck')==1){
                                            //             $$(elm).attr('checked',true);
                                            //         }
                                            //     })
                                            //     $$("input[name=net]").each((xls2, elm2)=>{
                                            //         console.log('班组',$$(elm2).data('ischeck'));
                                            //         if($$(elm2).data('ischeck')==1){
                                            //             $$(elm2).attr('checked',true);
                                            //         }
                                            //     })
                                            // }
                                        })
                                    }

                                })
                            // }
                        })
                    }

                    pickerProj = this.$f7.picker({
                        input: '#pickerfour3',
                        toolbarTemplate:
                        '<div class="toolbar">' +
                        '<div class="toolbar-inner">' +
                        '<div class="left">' +
                        '<a href="#" class="link close-picker">取消</a>' +
                        '</div>' +
                        '<div class="right"><a href="#" class="link close-picker" id="btnOk">绑定</a></div>' +
                        '</div>' +
                        '</div>',
                        onOpen:  (p)=>{
                            p.container.find('#btnOk').click(()=>{
                                this.projectId = pickerProj.cols[0].value;
                                this.projName = pickerProj.cols[0].displayValue;
                                console.log(this.projectId, this.projName);
                                dutyApi.getProjWorkGroupList(this.dutyRuleId, this.companyId, this.projectId, this.provinceId, this.cityId).then((result)=>{
                                    console.log('项目下面的班组2',result.data);
                                    this.groupList = result.data[0];
                                    // if(this.status==1){
                                        this.$nextTick(()=>{
                                            if(this.$store.state.userDutyListStr.length!=0){
                                                this.$store.state.userDutyListStr.map((res)=>{
                                                    if(res.id == this.projectId){
                                                        res.list.map((one)=>{
                                                            if(one.workGroupId == null){
                                                                one.workGroupId = 0;
                                                            }
                                                            $$("input[name=putu]").each((xls, elm)=>{
                                                                if($$(elm).data('userId')==one.userId){
                                                                    $$(elm).attr('checked',true);
                                                                }
                                                            })
                                                            $$("input[name=net]").each((xls2, elm2)=>{
                                                                if($$(elm2).data('id')==one.workGroupId){
                                                                    $$(elm2).attr('checked',true);
                                                                }
                                                            })
                                                        })
                                                    }
                                                    // else{
                                                    //     $$("input[name=putu]").each((xls, elm)=>{
                                                    //         console.log('用户',$$(elm).data('ischeck'));
                                                    //         if($$(elm).data('ischeck')==1){
                                                    //             $$(elm).attr('checked',true);
                                                    //         }
                                                    //     })
                                                    //     $$("input[name=net]").each((xls2, elm2)=>{
                                                    //         console.log('班组',$$(elm2).data('ischeck'));
                                                    //         if($$(elm2).data('ischeck')==1){
                                                    //             $$(elm2).attr('checked',true);
                                                    //         }
                                                    //     })
                                                    // }
                                                })
                                            }

                                        })
                                    // }

                                })
                            });
                        },
                        cols: [
                            {
                                textAlign: 'center',
                                values: this.projList.map((project)=>{return project.id}),
                                displayValues: this.projList.map((project)=>{return project.name}),
                            }
                        ]
                    });
                })
            },
            selectCity(){
                let that = this;
                pickerAddress = this.$f7.picker({
                    input: '#pickerthree4',
                    rotateEffect: true,
                    toolbarTemplate:
                    '<div class="toolbar">' +
                    '<div class="toolbar-inner">' +
                    '<div class="left">' +
                    '<a href="#" class="link close-picker">取消</a>' +
                    '</div>' +
                    '<div class="right">' +
                    '<a href="#" class="link close-picker">确定</a>' +
                    '</div>' +
                    '</div>' +
                    '</div>',
                    cols: [
                        {
                            values: that.proviceList.map((provice)=>{return provice.id}),
                            displayValues: that.proviceList.map((provice)=>{return provice.name}),
                            onChange: (Picker, value, displayValue)=> {
                                $$('.ad').text(displayValue);
                                that.provinceId = value;
                                that.provinceName = displayValue;
                                console.log('省名字',displayValue);

                                if(that.localAddress[value].cityObj){
                                    if(value == pickerAddress.cols[0].value){
                                        that.cityIdList = [];
                                        that.cityNameList = [];
                                        for(var key in that.localAddress[value].cityObj){
                                            that.cityIdList.unshift(that.localAddress[value].cityObj[key].id);
                                            that.cityNameList.unshift(that.localAddress[value].cityObj[key].name);
                                        }
                                        that.cityId = that.cityIdList[0];
                                        that.cityName = that.cityNameList[0];
                                        that.addressName = that.provinceName + that.cityName;
                                        $$('.ad-2').text(that.cityNameList[0]);
                                        console.log('市',that.cityId,$$('.ad-2').text());
                                        console.log('市列表',that.cityNameList);
                                        console.log('省下市',that.localAddress[value]);
                                        if (pickerAddress.cols[1].replaceValues) {
                                            pickerAddress.cols[1].replaceValues(
                                                that.cityIdList,
                                                that.cityNameList
                                            );

                                            that.getProjs();
                                        }
                                    }
                                }else{
                                    let cityObj = {};
                                    userApi.addressCityList(that.provinceId).then((result)=> {
                                        if(value == pickerAddress.cols[0].value){
                                            that.cityList = result.data.list;
                                            that.cityIdList = [];
                                            that.cityNameList = [];
                                            for(var i=0; i<that.cityList.length; i++){
                                                cityObj[that.cityList[i].id] = that.cityList[i];
                                                that.cityIdList.unshift(that.cityList[i].id);
                                                that.cityNameList.unshift(that.cityList[i].name);
                                            }
                                            that.cityId = that.cityIdList[0];
                                            that.cityName = that.cityNameList[0];
                                            that.addressName = that.provinceName + that.cityName;
                                            $$('.ad-2').text(that.cityNameList[0]);
                                            console.log('市',that.cityId,$$('.ad-2').text());
                                            console.log('市列表2',that.cityNameList);
                                            this.localAddress[that.provinceId].cityObj = cityObj;
                                            console.log('省下的所有市',this.localAddress[that.provinceId]);

                                            if (pickerAddress.cols[1].replaceValues) {
                                                pickerAddress.cols[1].replaceValues(
                                                    that.cityIdList,
                                                    that.cityNameList
                                                );

                                                this.getProjs();

                                            }
                                        }
                                    });
                                }
                                pickerAddress.cols[1].onChange();
                            }
                        },
                        {
                            textAlign: "left",
                            values: that.cityIdList,
                            displayValues: that.cityNameList,
                            onChange: (Picker, value, displayValue)=>{
                                if(value){
                                    $$('.ad-2').text(displayValue);
                                    that.cityId = value;
                                    that.cityName = displayValue;
                                    that.addressName = that.provinceName + that.cityName;
                                    console.log('市2',value,displayValue);
                                    that.getProjs();
                                }

                            }
                        }
                    ],
                    onOpen: (picker)=>{
                        pickerAddress.cols[0].onChange('Picker', that.provinceId, that.provinceName);
                        console.log('调用了');
                    }
                });
            }
        },
        mounted(){
            console.log('我被调用了--------------------------------------------------------------');
            this.dutyRuleId = this.$store.state.dutyRuleId;
            this.companyId = this.$store.state.roleInfo.companyId;

            //获取省市区地址
            if(this.$store.state.localAddress){
                this.localAddress = this.$store.state.localAddress;
                for(var key in this.localAddress){
                    this.proviceList.unshift(this.localAddress[key]);
                };
                console.log('省',this.proviceList);

                this.selectCity();
            }else{
                userApi.adressProviceList().then((result)=>{
                    this.proviceList = result.data.list;
                    for(var i=0; i<result.data.list.length; i++){
                        this.localAddress[result.data.list[i].id] = result.data.list[i];
                    };
                    this.$store.state.localAddress = this.localAddress;

                    this.selectCity();
                });
            }
        }
    }
</script>

<style scoped>
    .top2{
        width: 100%; height: 2rem; line-height: 2rem; display: flex; box-sizing: border-box; padding: 0 0.6rem; background: #fff;
        margin-bottom: 5px;
    }
    .top2 .left{
        font-size: 0.7rem; color: #666;
    }
    .top2 .right{
        flex: 1; margin-left: 10px; position: relative; padding-right: 14px;
    }
    .top2 .right .r-1{
        width: 100%; height: 100%; text-align: right; overflow: hidden; text-overflow: ellipsis; white-space: normal;
        font-size: 0.7rem; color: #999;
    }
    .top2 .right .r-1 img{
        width: 0.6rem; height: 0.6rem; display: inline-block; transform: translateY(2px); position: absolute; right: 0px; top: 12px;
    }
    .top2 .right .r-2{
        width: 100%; height: 100%; position: absolute; left: 0; top: 0; z-index: -1;
    }
    .top2 .right .r-2 input{
        width: 100%; height: 100%; border: none;
    }

    .list-block .item-content{
        padding: 0; min-height: 35px;
    }
    .list-block .all{
        width: 100%; height: 2rem; line-height: 2rem; box-sizing: border-box; padding-left: 0.6rem; background: #fff; color: #666;
    }
    .list-block .item-inner{
        display: flex; margin: 0; padding: 0; min-height: 35px;
    }
    .list-block .item-title{
        width: 100%; box-sizing: border-box; padding-left: 50px;
    }
    .list-block .item-inner .tov{
        height: 2.2rem; line-height: 2.2rem; padding-left: 0.6rem; position: relative;
    }
    .list-block .item-inner .tov input{
        position: absolute; left: 0.8rem; top: 16px;
    }
    .list-block .item-inner .tov div{
        box-sizing: border-box; padding-left: 1rem;
    }

    .list-block{
        margin: 0; font-size: 0.7rem; color: #666;
    }
    .list-block ul{
        background: #f4f4f4;
    }
    .list-block li{
        margin-bottom: 5px; background: #fff;
    }

    .top{
        display: flex; width: 100%; height: 65px; border-top: 1px solid #f4f4f4;
    }
    .top .a2{
        width: 2rem; height: 2rem; border: 1px solid #000; border-radius: 50%; margin-top: 0.5rem;
    }
    .top .a2 img{
        width: 2rem; height: 2rem; border-radius: 50%;
    }
    .top .a3{
        padding: 0.7rem 0 0 0.8rem; flex: 1; overflow: hidden; position: relative;
    }
    .top .a3 .left .a3-1{
        font-size: 0.8rem; color: #438cff;
    }
    .top .a3 .left .a3-2{
        font-size: 0.6rem; color: #999;
    }

    .form-checkbox i, label.label-checkbox i.icon-form-checkbox{
        width: 16px; height: 16px; position: absolute; left: 24px;
    }

    .title{
        width: 100%; box-sizing: border-box; padding: 0 12px; font-size: 0.55rem; color: #AAAAAA; text-align: center; margin-top: 0.7rem;
        margin-bottom: 6rem;
    }

    .footer{
        width: 108px; height: 2rem; line-height: 2rem; text-align: center; font-size: 0.8rem; color: #fff; background: #438CFF;
        position: fixed; left: 36%; bottom: 28px; border-radius: 2.5px;
    }
</style>