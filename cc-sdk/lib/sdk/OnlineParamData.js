let Str2Int = function (str) {
    if (null != str) {
        let tmp = str;
        if ('string' == typeof str)
            tmp = parseInt(str);
        return tmp;
    }
    return 0;
};

const WXShareDataIndex = 'SDK_NAME@iWXDataShareIndex';

class OnlineParamData {
    constructor() {
        this._sBanner = 0; //默认为0(关闭banner), 否则为banner的ID
        this._sVideo = 0;
        this._iADFlashTime = 2 * 60; // banner广告刷新时间，单位秒
        this._iADFlashTimeInGame = 2 * 60; // 游戏内banner广告刷新时间，单位秒
        this._iOpenSDKAds = 0;//0 SDK广告关, 1广告开
        this._sWXMidasPayID = ''; // 支付应用id
        this._iSDKAdsShowTimes = 0;//SDK广告展示次数
        this._iWeChatAdsShowTimes = 0;//微信广告展示次数
        this._iSDKBannerRefreshSecond = 2 * 60; // SDK ads
        this._iOpenShareAfterVideo = 0;//观看视频后打开分享
        this._iOpenBoxGamesScrollPromotion = 0; // 盒子游戏滚动推广 0 全关闭 1 开启 2 关闭banner显示
        let index = cc.sys.localStorage.getItem(WXShareDataIndex);
        if (undefined == index || '' == index) {
            this._iWXShareDataIdx = -1;
        } else {
            this._iWXShareDataIdx = index;
        }
        this.iSdkShareTime = 2000;
    }

    setOpenBoxGamesScrollPromotion(iOpenBoxGamesScrollPromotion) {
        let tmp = Str2Int(iOpenBoxGamesScrollPromotion);
        if (0 <= tmp)
            this._iOpenBoxGamesScrollPromotion = tmp;
    }

    getOpenBoxGamesScrollPromotion() {
        return this._iOpenBoxGamesScrollPromotion;
    }

    setBannerRefreshSecond(iADFlashTime) {
        let tmp = Str2Int(iADFlashTime);
        if (0 < tmp)
            this._iADFlashTime = tmp;
    }

    getBannerRefreshSecond() {
        return this._iADFlashTime;
    }

    setBannerInGameRefreshSecond(iADFlashTime) {
        let tmp = Str2Int(iADFlashTime);
        if (0 <= tmp)
            this._iADFlashTimeInGame = tmp;
    }

    getBannerInGameRefreshSecond() {
        return this._iADFlashTimeInGame;
    }

    setSDKBannerRefreshSecond(iADFlashTime) {
        let tmp = Str2Int(iADFlashTime);
        if (0 <= tmp)
            this._iSDKBannerRefreshSecond = tmp;
    }

    getSDKBannerRefreshSecond() {
        return this._iSDKBannerRefreshSecond;
    }

    setbanner(_banner) {
        this._sBanner = _banner;
    }

    getbanner() {
        return this._sBanner;
    }

    setvideo(_video) {
        this._sVideo = _video;
    }

    getvideo() {
        return this._sVideo;
    }

    isOpenSDKAds() {
        return this._iOpenSDKAds == 1;
    }

    setOpenSDKAds(iOpenSDKAds) {
        this._iOpenSDKAds = Str2Int(iOpenSDKAds);
    }

    setWXMidasPayID(sWXMidasPayID) {
        this._sWXMidasPayID = sWXMidasPayID;
    }

    getWXMidasPayID() {
        return this._sWXMidasPayID;
    }

    setWeChatAdsShowTimes(iWeChatAdsShowTimes) {
        let tmp = Str2Int(iWeChatAdsShowTimes);
        if (0 <= tmp)
            this._iWeChatAdsShowTimes = iWeChatAdsShowTimes;
    }

    getWeChatAdsShowTimes() {
        return this._iWeChatAdsShowTimes;
    }

    setSDKAdsShowTimes(iSDKAdsShowTimes) {
        let tmp = Str2Int(iSDKAdsShowTimes);
        if (0 <= tmp)
            this._iSDKAdsShowTimes = iSDKAdsShowTimes;
    }

    getSDKAdsShowTimes() {
        return this._iSDKAdsShowTimes;
    }

    setOpenShareAfterVideo(iOpenShareAfterVideo) {
        let tmp = Str2Int(iOpenShareAfterVideo);
        if (0 <= tmp)
            this._iOpenShareAfterVideo = iOpenShareAfterVideo;
    }

    isOpenShareAfterVideo() {
        return this._iOpenShareAfterVideo != 0;
    }

    getSdkVideoShare() {
        return this._iOpenShareAfterVideo;
    }


    getOrgOnlineParamObject() {
        return this.pOrgOnlineParamObject;
    }

    setOnlineParamData(p = {}) {
        this.pOrgOnlineParamObject = p;
        this.setBannerRefreshSecond(p.sdkRefresh);
        this.setBannerInGameRefreshSecond(p.ADFlashTimeInGame);
        this.setOpenSDKAds(p.iOpenSDKAds);
        this.setSDKAdsShowTimes(p.iSDKAdsShowTimes);
        this.setWeChatAdsShowTimes(p.iWeChatAdsShowTimes);
        this.setSDKBannerRefreshSecond(p.iSDKBannerRefreshSecond);
        this.setOpenShareAfterVideo(p.sdkVideoShare);
        this.setOpenBoxGamesScrollPromotion(p.sdkMoreGame);
        this.setSDKShareTime(p.sdkShareTime);
    }

    setSDKShareTime(second) {
        let tmp = Str2Int(second);
        if (0 <= tmp)
            this.iSdkShareTime = second;
    }

    getSDKShareTime() {
        return this.iSdkShareTime;
    }

    setWXShareData(data) {
        this.pWXShareData = data;
    }

    getWXShareData() {
        return this.pWXShareData;
    }

    getRandomWXShareData() {
        this.pWXShareData = this.pWXShareData || [];
        if (this._iWXShareDataIdx >= this.pWXShareData.length)
            this._iWXShareDataIdx = 0;
        let shareData = this.pWXShareData[this._iWXShareDataIdx];
        if (!shareData)
            shareData = {desc: '戳这里，好玩的停不下来！'};
        cc.sys.localStorage.setItem(WXShareDataIndex, this._iWXShareDataIdx);
        return shareData;
    }

    getWXShareDataIdx() {
        return this._iWXShareDataIdx;
    }

    setWXShareDataIdx(idx) {
        this._iWXShareDataIdx = idx;
        cc.sys.localStorage.setItem(WXShareDataIndex, this._iWXShareDataIdx);
    }

    setMoreGameData(data) {
        this.pMoreGameData = data;
    }

    getMoreGameData() {
        return (this.pMoreGameData || [[], []]);
    }

    setWXOfficialAccountData(data) {
        this.pWXOfficialAccountData = data;
    }

    getWXOfficialAccountData() {
        return (this.pWXOfficialAccountData || []);
    }

    setWXInGameAdvertUrl(data) {
        this.pWXInGameAdvertUrl = data;
    }

    getWXInGameAdvertUrl() {
        return this.pWXInGameAdvertUrl;
    }

    isTestMode() {
        if (undefined == this.pOrgOnlineParamObject)
            this.pOrgOnlineParamObject = {};
        return Str2Int(this.pOrgOnlineParamObject.sdkTestMode) == 1;
    }

    // 开屏
    isShowOpenSDKAds() {
        if (undefined == this.pOrgOnlineParamObject)
            this.pOrgOnlineParamObject = {};
        return Str2Int(this.pOrgOnlineParamObject.sdkShowOpenAds) == 1;
    }

    getSDKShareCount() {
        if (undefined == this.pOrgOnlineParamObject)
            this.pOrgOnlineParamObject = {};
        return Str2Int(this.pOrgOnlineParamObject.sdkShareCount);
    }

    getShareTipsList() {
        if (undefined == this.pOrgOnlineParamObject) {
            this.pOrgOnlineParamObject = {};
            this.pOrgOnlineParamObject.sdkShare1 = '分享失败,请分享到群';
            this.pOrgOnlineParamObject.sdkShare2 = '分享失败,请分享到不同群';
        }
        return [this.pOrgOnlineParamObject.sdkShare1, this.pOrgOnlineParamObject.sdkShare2];
    }

    getSDKBannerMin() {
        if (undefined == this.pOrgOnlineParamObject) {
            this.pOrgOnlineParamObject = {};
            this.pOrgOnlineParamObject.sdkBannerMin = 30;
        }
        return Str2Int(this.pOrgOnlineParamObject.sdkBannerMin);
    }

    getSDKBannerCount() {
        if (undefined == this.pOrgOnlineParamObject) {
            this.pOrgOnlineParamObject = {};
            this.pOrgOnlineParamObject.sdkBannerCount = 3;
        }
        return Str2Int(this.pOrgOnlineParamObject.sdkBannerCount);
    }
}

// export default OnlineParamData;