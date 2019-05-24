import Vue from 'vue'
import { serverUrl, version, channel } from '../config'
import { app } from '../main.js'
import { LocalCache, Cache } from './utils'
import md5 from 'js-md5'

let paramsSign = function (params) {
  let str = '';
  let keys = [];
  let i = 0;
  for (let prop in params) {
    if (params.hasOwnProperty(prop)) {
      keys[i++] = prop
    }
  }
  keys.sort();
  for (i = 0; i < keys.length; i++) {
    str = str + keys[i] + '=' + params[keys[i]]
    if (i < keys.length - 1) {
      str = str + '||'
    }
  }
  return md5.hex(str);
};

let getSign = function (params, method) {
  let map = {'method': method};
  for (let key in params) {
    if (params.hasOwnProperty(key)) {
      map[key] = decodeURIComponent(params[key])
    }
  }
  return paramsSign(map)
};

let common = {
  showLoading: function (show = true, title = '') {
      try {
          if(show) {
              if(title === '')
                  app.$f7.showIndicator();
              else
                  app.$f7.showPreloader(title);
          }
      }catch(err) {
      }
  },
  hideLoading: function (show = true, title = '') {
      try {
          if(show) {
              if(title === '')
                  app.$f7.hideIndicator();
              else
                  app.$f7.hidePreloader();
          }
      }catch(err) {
      }
  },
  getRequest: function (url, params = {}, preLoader = {show: true, title:''}, {global = true} = {}) {
    Object.assign(params, {
      sessionkey: LocalCache.get('sessionkey'),
      version, channel, timestamp: new Date().getTime()
    });
    // 参数签名
    let sign = getSign(params, url);
    Object.assign(params, {
      sign
    });
    return new Promise((resolve, reject) => {
      common.showLoading(preLoader.show, preLoader.title);
      Vue.http({
        method: 'GET',
        url: serverUrl + url,
        params,
        global: global
      }).then((response) => {
        common.hideLoading(preLoader.show, preLoader.title);
        var data = response.body
        if (data.code == status_code.SUCCESS) {
          resolve(data)
        }else if (data.code == status_err_code.UNAUTH_ERR) {
              //Sessionkey错误，需要重新登录
              LocalCache.del('userInfo');
              LocalCache.del('isAdmin');
              LocalCache.del('sessionkey');
              window.location.reload();
        }
        else {
          reject(data)
            let message = '未知错误';
            if(data.msg)
                message = data.msg;
          if (data.code == status_err_code.OPERATION_ERR) {
            // ?
          } else {
            app.$f7.alert(message)
          }

        }

      }).catch((err) => {
        common.hideLoading(preLoader.show, preLoader.title);
        reject(err);
      })
    })
  },
  postRequest: function (url, params = {}, preLoader = {show: true, title:''}, {global = true} = {}) {
    Object.assign(params, {sessionkey: LocalCache.get('sessionkey'), version, channel, timestamp: new Date().getTime()});

    // 参数签名
    let sign = getSign(params, url);
    Object.assign(params, {
        sign
    });
    return new Promise((resolve, reject) => {
      common.showLoading(preLoader.show, preLoader.title);
      Vue.http({
        method: 'POST',
        url: serverUrl + url,
        params,
        // body: params,
        emulateJSON: true,
        emulateHTTP: true,
        global: global
      }).then((response) => {
        common.hideLoading(preLoader.show, preLoader.title);
        var data = response.body
        if (data.code == status_code.SUCCESS) {
          resolve(data)
        }else if (data.code == status_err_code.UNAUTH_ERR) {
          //Sessionkey错误，需要重新登录
          LocalCache.del('userInfo');
          LocalCache.del('isAdmin');
          LocalCache.del('sessionkey');
          window.location.reload();
        }
        else {
          reject(data);
          let message = '未知错误';
          if(data.msg)
            message = data.msg;
          if (data.code == status_err_code.NEED_BINDING) {
            // ?
          } else {
            app.$f7.alert(message);
          }
        }
      }).catch((err) => {
        common.hideLoading(preLoader.show, preLoader.title);
        reject(err)
      })

    })

  },

  postFileRequest: function (url, params = {}, preLoader = {show: true, title:''}, {global = true} = {}) {
    Object.assign(params, {sessionkey: LocalCache.get('sessionkey'), version, channel, timestamp: new Date().getTime()});
    // 参数签名
    let sign = getSign(params, url);
    Object.assign(params, {
        sign
    });
    let formdata = new FormData();
    for (let key in params) {
      if (params.hasOwnProperty(key)) {
        if(typeof params[key] === 'object')
          if(params[key].hasOwnProperty('file') && params[key].hasOwnProperty('fileName'))
            formdata.append(key, params[key]['file'], params[key]['fileName']);
          else
            formdata.append(key, params[key]);
        else
          formdata.append(key, params[key]);
      }
    }
    return new Promise((resolve, reject) => {
      Vue.http({
        method: 'POST',
        url: serverUrl + url,
        body: formdata,
        global: global
      }).then((response) => {
        var data = response.body
        if (data.code == status_code.SUCCESS) {
          resolve(data)
        }else if (data.code == status_err_code.UNAUTH_ERR) {
            //Sessionkey错误，需要重新登录
            LocalCache.del('userInfo');
            LocalCache.del('isAdmin');
            LocalCache.del('sessionkey');
            window.location.reload();
        }
        else {
          reject(data)
          app.$f7.alert(data.msg)
        }
      }).catch((err) => {
        reject(err)
      })
    })

  },
  getBase64ImageData (image) {
    let data = image.src;
    if(data.startsWith('data:image'))
      return Promise.resolve(data.split(",")[1]);

    if(window.cordova && (window.cordova.platformId === 'android' || window.cordova.platformId === 'ios'))
      return this.getBase64ImageDataLocal(image.src);

    return new Promise((resolve, reject) => {
      var canvas = document.createElement("CANVAS");
      var ctx = canvas.getContext("2d");
      canvas.height = image.naturalHeight;
      canvas.width = image.naturalWidth;
      ctx.drawImage(image, 0, 0);

      console.log("Canvas size: " + canvas.width + "*" + canvas.height);
      var imageData = canvas.toDataURL("image/jpeg");

      resolve(imageData.split(",")[1]);
    });
  },
  getBase64ImageDataLocal(image) {
    return new Promise((resolve, reject) => {
      window.resolveLocalFileSystemURL(image, function(fileEntry){
          console.log("Success read image from local. image: " + image);
          fileEntry.file(function(file){
              var fr = new FileReader();
              fr.onload = function(evt) {
                  resolve(evt.target.result.split(",")[1]);
              };
              fr.readAsDataURL(file);
          });
      });
    });
  },
  newBlob: (data, datatype) => {
    var out;
    try {
      out = new Blob([data], {type: datatype})
    }
    catch (e) {
      window.BlobBuilder = window.BlobBuilder ||
        window.WebKitBlobBuilder ||
        window.MozBlobBuilder ||
        window.MSBlobBuilder

      if (e.name === 'TypeError' && window.BlobBuilder) {
        var bb = new window.BlobBuilder()
        bb.append(data.buffer)
        out = bb.getBlob(datatype)
      }
      else if (e.name === 'InvalidStateError') {
        out = new Blob([data], {type: datatype})
      }
    }
    return out
  },
  base64ToBlob: (type, data) => {
    data = window.atob(data);
    let ia = new Uint8Array(data.length);
    for (let i = 0; i < data.length; i++) {
      ia[i] = data.charCodeAt(i)
    }
    return new common.newBlob(ia, type)
  },
};

let hasProxy = function () {
  return Cache.get('sell') || false
};
export { hasProxy }

const status_code = {
  SUCCESS: 0,
};

const status_err_code = {
  UNAUTH_ERR: 1,
  PARAME_ERR: 2,
  NEED_BINDING: 3,
  SIGN_PARAME_ERR: 4,
  SIGN_ERR: 5,
  CLIENT_FREEZE_ERR: 6,
  UPLOAD_ERR: 8,
  OPERATE_ERR: 9,
  DATABASE_ERR: 10,
  FAILURE: 11
};
export { common, status_code, status_err_code }