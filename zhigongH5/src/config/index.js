/**
 * Created by Administrator on 2017/6/30.
 */
// 微信App Id
let wechat = {
    appId: 'wxcb910856c6a02137'
};
let version = '1.2.0.135';
let _channel = 'src_browser';

let shareServer = "http://weixin.zhigong.showtou.com";
let shareAppid =  "wxd42de9cdb87ae153";

let serverceshi = 'http://api.zhigong.showtou.com';
//let serverceshi = 'http://192.168.50.29';

let serverUrl = serverceshi + ':8080/api';

let getui = {
    appId: 'dg7fWRyq7CA558TLVsYHHA',
    appKey: 'kzep0uE9dS7Htl0XJXN3q2',
    appSecret: 'iSc7jSmV5Z5Z3jgpS3Ujw5'
};

// let shareServer = "http://weixin.zhigongxx.com";
// let shareAppid =  "wx512df2c69dbbcf89";
// let serverceshi = 'http://api.zhigongxx.com';
// let serverUrl = serverceshi + '/api';
// let getui = {
//     appId: 'Owbk7fQKrq5EhxSh24O8v5',
//     appKey: '0AoB8Mkdax7Z3fydEAipk7',
//     appSecret: 'EohCO0cnitAdnqV3DDG8S6'
// };

let channel = function () {
    if(window.cordova) {
        if(window.cordova.platformId === 'ios')
            _channel = 'src_ios';
        else if(window.cordova.platformId === 'android')
            _channel = 'src_android';
    }

    return _channel;
};

export { wechat, serverUrl, version, channel, getui, serverceshi, shareServer, shareAppid}
