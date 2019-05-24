import Vue from 'vue'
import { common } from '../lib/common'
import { serverUrl } from '../config'

var commonApi = {
  uploadFaceBase64(type, data, fileName) {
    let file = common.base64ToBlob(type, data);
    if(fileName)
      return common.postFileRequest('/common/faceUpload', {file:{file, fileName}}, {show: false, title:''});
    else
      return common.postFileRequest('/common/faceUpload', {file}, {show: false, title:''});
  },
    uploadBase64(type, data) {
        let file = common.base64ToBlob(type, data);
        return common.postFileRequest('/common/upload', {file}, {show: false, title:''});
    },
    uploadFace(file, fileName) {
      if(fileName)
        return common.postFileRequest('/common/faceUpload', {file:{file, fileName}}, {show: false, title:''});
      else
        return common.postFileRequest('/common/faceUpload', {file}, {show: false, title:''});
    },
    upload(file) {
        return common.postFileRequest('/common/upload', {file}, {show: false, title:''});
    },
    uploadImage(file) {
        return common.postFileRequest('/common/uploadImage', {file}, {show: false, title:''});
    },
    uploadIdCard(file,side){
        return common.postFileRequest('/common/uploadIdCard',{file,side},{show: false, title:''})
    },

    getBaiduApiToken () {
        return common.getRequest('/common/getBaiduApiToken', {}, {show: false, title:''});
    },
    baiduIdcardRecognize(id_card_side, image) {
        return new Promise((resolve, reject) => {
            common.showLoading(true, '正在识别');
            this.getBaiduApiToken().then((result)=>{
                console.log('Baidu Token: ' + JSON.stringify(result));
                return Vue.http.post('https://aip.baidubce.com/rest/2.0/ocr/v1/idcard?access_token='+result.data.Access_Token, {
                    detect_direction: 'true',
                    id_card_side, //正反面，front, back
                    image, //Base64格式
                    detect_risk: 'false'
                }, {
                    emulateJSON: true
                });
            }).then((response) => {
                common.hideLoading(true, '正在识别');
                resolve(response.body);
            }).catch((err) => {
                console.log('Recognize err: ' + JSON.stringify(err));
                common.hideLoading(true, '正在识别');
                reject(err);
            });
        });},
    getXiaomiApiToken(account) {
      return Vue.http.get(serverUrl+'/common/getXiaomiApiToken?account='+account, {
      }, {
        emulateJSON: true
      });
    },
    deleteFace(userId) {
      return common.postRequest('/common/deleteFace', {userId});
    },
    uploadFace(file, genData) {
      return common.postRequest('/common/faceUpload', {file:{file, genData}},{show: false, title:''});
    },
    faceUploadWithId(file, userId) {
      return common.postRequest('/common/faceUploadWithId/'+userId, {file},{show: false, title:''});
    },
};
var uploadRoad = {
  image(){
    return serverUrl+'/common/uploadImage'
  },
  idCard(){
    return serverUrl+'/common/uploadIdCard'
  },
  file(){
    return serverUrl+'/common/upload'
  },
  changeAvatar(){
    return serverUrl+'/user/changeAvatar'
  },
  uploadFace(){
    return serverUrl+'/common/faceUploadWithId'
  }
}
var ieVersion = {
  judge() {
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
    var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
    var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
    if(isIE || isEdge || isIE11) {
      return true
    } {
      return false //不是ie浏览器
    }
  }
}
export {
    commonApi, uploadRoad, ieVersion
}
