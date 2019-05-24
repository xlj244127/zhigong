import { common } from '../lib/common'

var notifyApi = {
    //调起录脸
    launchFace (machineId, userId, userName, cbUserId) {
        return common.postRequest('/notify/launchFace', {machineId, userId, userName, cbUserId}, {show: false})
    },
    //停止录脸
    stopFace (machineId) {
        return common.postRequest('/notify/stopFace', {machineId}, {show: false})
    },


    //用户用App扫描企业版二维码成功后，通知企业版，扫描成功
    shaoMaoFaSong (qrcodeId) {
        return common.postRequest('/notify/notifyScanSuccess', {qrcodeId})
    },
    //用户用App扫描企业版二维码成功后，确认可以登录，发送登录Token给企业版
    queRenDengLu (qrcodeId) {
        return common.postRequest('/notify/notifyLoginConfirmed', {qrcodeId})
    },
    //用户用App扫描企业版二维码成功后，通知企业版，取消登录
    quXiaoDengLu (qrcodeId) {
        return common.postRequest('/notify/notifyScanCancelled', {qrcodeId})
    },

};

export {
    notifyApi
}
