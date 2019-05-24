/**
 * Created by Administrator on 2017/6/30.
 */
let version = '1.2.0.12';
let _channel = 'src_wx';

let shareServer = "http://weixin.zhigong.showtou.com";
let shareAppid =  "wxd42de9cdb87ae153";
let serverceshi = 'http://api.zhigong.showtou.com';
// let serverceshi = "http://192.168.52.9"; //闫静的IP地址
let serverUrl = serverceshi+':8080/api';

// let shareServer = "http://weixin.zhigongxx.com";
// let shareAppid =  "wx512df2c69dbbcf89";
// let serverceshi = 'http://api.zhigongxx.com';
// let serverUrl = serverceshi+'/api';

let channel = function () {
    if(window.cordova) {
        if(window.cordova.platformId === 'ios')
            _channel = 'src_ios';
        else if(window.cordova.platformId === 'android')
            _channel = 'src_android';
    }

    return _channel;
};

export { serverUrl, version, channel, serverceshi, shareServer, shareAppid}
