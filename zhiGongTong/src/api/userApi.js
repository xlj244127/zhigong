import { common } from '../lib/common'
import {Cache} from "../lib/utils";

var userApi = {
    login (mobile, vcode) {
        return common.postRequest('/user/login', {mobile, vcode});
    },
    loginWx (code) {
        return common.postRequest('/user/login-wx', {code});
    },
    loginWeb(mobile,password,clientId){
      return common.postRequest('/user/login-web', {mobile,password,clientId});
    },
    loginToken(token){
      return common.postRequest('/user/login-token', {token});
    },
    loginBindWx (code, mobile, vcode) {
        return common.postRequest('/user/login-wx-bind', {code, mobile, vcode});
    },
    bindWx (code, mobile, vcode) {
        return common.postRequest('/user/wx-bind', {code, mobile, vcode});
    },
    //设置密码
    setPasssword (password,originalPassword) {
      return common.postRequest('/user/setPassword', {password,originalPassword});
    },
    //忘记密码
    forgetPassword(mobile,vcode){
      return common.postRequest('/user/forgetPassword', {mobile,vcode});
    },
    //重置密码
    resetPassword(resetToken,password){
      return common.postRequest('/user/resetPassword', {resetToken,password});
    },
    ChangeMobile(newMobile,vcode,newVcode){
      return common.postRequest('/user/changeMobile', {newMobile,vcode,newVcode});
    },
    //企业版登出
    logOutWeb(){
      return common.postRequest('/user/logout-web')
    },
    //用户获取本身的信息
    detail () {
        return common.getRequest('/user/detail');
    },
    //根据不同id获取用户详情(简要信息)
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
    addressProviceList () {
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
    searchUser (companyId,mobile) {
        return common.getRequest('/user/list',{companyId,mobile});
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
    changeAvatar(type, data) {
        let file = common.base64ToBlob(type, data);
      console.log(file);
      return common.postRequest('/user/changeAvatar', {file});
    },
    //录脸
    regFace(userId) {
        return common.postRequest('/user/regFace', {userId}, {show: false});
    },
    //获取用户的历史项目接口
    historyProjects() {
        return common.getRequest('/user/historyProjects');
    }
};

export {
    userApi
}
