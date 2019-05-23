
wx.config({
    debug: false,
    appId: 'wxcb910856c6a02137',
    timestamp: '${params.timestamp}',
    nonceStr: '${params.noncestr}',
    signature:'${params.signature}',
    jsApiList: [ 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone']
})
wx.ready(function(){
    wx.checkJsApi({
        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone']
    });
    /*分享到朋友圈*/
    wx.onMenuShareTimeline({
        title: '计划书', // 分享标题
        desc: '保险让生活更美好！', // 分享描述
        link: '${fenxurl}', // 分享链接
        imgUrl: '${params.urlg}/PF_IDENTIFY/Cacheable/image/business/plan-cover/product_img.png', // 分享图标
        success: function () {
            // 用户确认分享后执行的回调函数
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });
    /*分享给朋友*/
    wx.onMenuShareAppMessage({
        title: '计划书', // 分享标题
        desc: '保险让生活更美好！', // 分享描述
        link: '${fenxurl}', // 分享链接
        imgUrl: '${params.urlg}/PF_IDENTIFY/Cacheable/image/business/plan-cover/product_img.png', // 分享图标
        success: function () {
            // 用户确认分享后执行的回调函数
            alert("您已分享");
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
            alert('您已取消分享');
        }
    });
    /*分享给QQ好友*/
    wx.onMenuShareQQ({
        title: '计划书', // 分享标题
        desc: '保险让生活更美好！', // 分享描述
        link: '${fenxurl}', // 分享链接
        imgUrl: '${params.urlg}/PF_IDENTIFY/Cacheable/image/business/plan-cover/product_img.png', // 分享图标
        success: function () {
            // 用户确认分享后执行的回调函数
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });
    /*分享到QQ空间*/
    wx.onMenuShareQZone({
        title: '计划书', // 分享标题
        desc: '保险让生活更美好！', // 分享描述
        link: '${fenxurl}', // 分享链接
        imgUrl: '${params.urlg}/PF_IDENTIFY/Cacheable/image/business/plan-cover/product_img.png', // 分享图标
        success: function () {
            // 用户确认分享后执行的回调函数
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });

})
