let config = {
    // version: "1.0.0",
    // appId: 0,
    oppo_cfg: {
        pkgName: '', // 游戏包名
        app_key: '', // OPPO 联盟广告后台分配的应用 ID
        adsBannerId: '', // banner广告Id
        adsVideoId: '', // 视频广告Id
        adsInterstitialId: '', // 插屏广告Id
    },
    vivo_cfg: {
        adsBannerId: '', // banner广告Id
        adsInterstitialId: '', // 插屏广告Id
    },
    baidu_cfg: {
        adsVideoId: '', // 广告位 ID
        appSid: '', // 应用 ID
    },
    wechat_cfg: {
        app_key: '', // *必填  微信Id
        privateKey: '', // *必填
        mta_cfg: {appID: '', eventID: ''}, //  腾讯微信统计分析，可选
    },
    share_opts_cfg: {
        title: '快来和我一起玩吧', // 转发标题
        imageUrl: '', // 转发显示图片的链接，只支持网络图片路径
    },
};

SDK_NAME.sdkConfig = config;
// export default config;