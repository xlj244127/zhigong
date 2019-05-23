import { common } from '../lib/common'
import {Cache} from "../lib/utils";

var userApi = {
    login (mobile, vcode, clientId) {
        return common.postRequest('/user/login', {mobile, vcode, clientId});
    },
    loginWx (code, clientId) {
        return common.postRequest('/user/login-wx', {code, clientId});
    },
    loginBindWx (code, mobile, vcode, clientId) {
        return common.postRequest('/user/login-wx-bind', {code, mobile, vcode, clientId});
    },
    bindWx (code, mobile, vcode) {
        return common.postRequest('/user/wx-bind', {code, mobile, vcode});
    },
    //用户获取本身的信息
    detail () {
        return common.getRequest('/user/detail');
    },
    //根据不同id获取用户详情
    userDetail (id) {
        return common.getRequest('/user/'+id);
    },
    //根据不同id获取用户简要信息
    briefUserDetail (id) {
        return common.getRequest('/user/getUser/'+id);
    },

    sendMessage (mobile) {
        return common.postRequest('/user/send-message', {mobile}, {show: true, title: '发送验证码'});
    },

    //省 市 区
    adressProviceList () {
        return common.getRequest('/address/proviceList');
    },
    addressCityList (provinceId) {
        return common.getRequest('/address/cityList', {provinceId});
    },
    addressAreaList (cityId) {
        return common.getRequest('/address/districtList', {cityId});
    },

    //身份信息
    information () {
        return common.getRequest('/user/information', {}, {show: false});
    },
    //按手机号码添加
    searchUser (companyId, mobile) {
        return common.getRequest('/user/list',{companyId, mobile});
    },
    //邀请接口
    invite (mobile) {
        return common.postRequest('/user/invite',{mobile});
    },

    //修改用户接口,可以修改以下3个值,其中mobile和vcode必须同时给出
    //{mobile, vcode, profession, workType}
    change(params) {
        return common.postRequest('/user/save', params);
    },
    changeProfession(profession) {
        return this.change({profession});
    },
    changeWorkType(workType) {
        return this.change({workType});
    },
    changeMobile(mobile, vcode) {
        return this.change({mobile, vcode});
    },
    changeIdcard(params) {
        return common.postRequest('/user/saveIdInfo', params);
    },
    //录脸
    regFace(userId) {
        return common.postRequest('/user/regFace', {userId}, {show: false});
    },
    //获取用户的历史项目接口
    historyProjects() {
        return common.getRequest('/user/historyProjects');
    },


};

export {
    userApi
}
