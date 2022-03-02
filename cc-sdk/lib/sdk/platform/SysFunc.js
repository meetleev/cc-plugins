class SysFunc {
    constructor(opt = {}) {
        this._opt = opt;
        this._settings = {};
    }

    onShow(callFunc) {
        cc.game.on(cc.game.EVENT_SHOW, callFunc);
    }

    onHide(callFunc) {
        cc.game.on(cc.game.EVENT_HIDE, callFunc);
    }

    getLaunchOptionsSync() {
        return {query: {}};
    }

    previewImage(current, urls) {
        Log.l('previewImage current urls', current, urls);
    }

    getSystemInfo() {
        return {};
    }

    getSystemScreenSize() {
        return cc.winSize;
    }

    getScreenPixelRatio() {
        return 0;
    }

    getSystemStatusBarHeight() {
        return 0;
    }

    getSDKVersion() {
        return 0;
    }

    login(object) {
        object && object.success && object.success({code: this.getDeviceId()});
    }

    // {success:f, fail:f, withCredentials:bool}
    getUserInfo(object = {}) {
        object.success && 'function' == typeof object.success && object.success();
    }

    // {adsVideoId:adsVideoId, loadSuccessFunc:f, success:f, fail:f, close:f}
    showRewardedVideoAd(obj = {}) {
        obj.success && obj.success();
    }

    // {adsInterstitialId:adsInterstitialId, success:f, fail:f, closeFunc:f}
    showInterstitialAd(obj = {}) {
    }

    // {bForceNew:false, adsBannerId:'',failedFunc:f}
    showBannerAds(obj) {
    }

    destroyBannerAds() {
    }

    hideBannerAds() {
    }

    isBannerAdsShow() {
        return false;
    }

    getSetting(func, bForceRefresh = false) {
    }

    // {success:f, fail:f}
    openSetting(object = {}) {
    }

    // {success:f, fail:f}
    location(object = {}) {
    }

    // {title:string, bMask:bool, timeout:number, success:f, fail:f}
    showLoading(object) {
    }

    hideLoading() {
    }

    showOpenAds(url) {
    }
    showShareMenu(title, imageUrl, query, callFuc) {
    }

    shareAppMessage(desc, shareLink, query) {
    }

    showToast(str) {
    }

    showModal(object = {}) {
    }

    createImage(sprite, url) {
        cc.loader.load(url, (err, texture) => {
            if (!err)
                sprite.spriteFrame = new cc.SpriteFrame(texture);
        });
    }

    navigateToMiniProgram(appId, path, imageUrl) {
        Log.l('navigateToMiniProgram appId, path, imageUrl', appId, path, imageUrl);
    }
}

// export default SysFunc;