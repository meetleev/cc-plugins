class BaiduSysFunc extends SysFunc {
    constructor(opt = {}) {
        super(opt);
        this._opt = opt;
        if (undefined == this._opt.baidu_cfg)
            this._opt.baidu_cfg = {}
        this._systemInfo = swan.getSystemInfoSync();
        Log.l('baidu system info', this._systemInfo);
        this.getSetting(null, true);
    }

    onShow(callFunc) {
        swan.onShow(callFunc);
    }

    onHide(callFunc) {
        swan.onHide(callFunc);
    }

    getSystemInfo() {
        if (!this._systemInfo)
            this._systemInfo = swan.getSystemInfoSync();
        return this._systemInfo;
    }

    getSystemScreenSize() {
        let res = this.getSystemInfo();
        return {width: res.screenWidth, height: res.screenHeight};
    }

    getScreenPixelRatio() {
        let res = this.getSystemInfo();
        return res.pixelRatio;
    }

    getSystemStatusBarHeight() {
        return this.getSystemInfo().statusBarHeight;
    }

    getSDKVersion() {
        let res = this.getSystemInfo();
        res.SDKVersion = res.SDKVersion || '';
        let sdkVerArr = res.SDKVersion.match(/\d/g) || [];
        let sdkVer = 0;
        for (let i = 0; i < sdkVerArr.length; i++) {
            sdkVer += parseInt(sdkVerArr[i]) * Math.pow(10, sdkVerArr.length - i);
        }
        Log.l('baidu sdkVer', sdkVer);
        if (sdkVer > 10000)
            sdkVer /= 10;
        return sdkVer;
    }

    login(object) {
        object && swan.login({fail: object.fail, success: object.success});
    }

    // {success:f, fail:f, withCredentials:bool}
    getUserInfo(object = {}) {
        this.createUserInfoButton(object);
    }

    // {adsVideoId:adUnitId, appSid:appSid, loadSuccessFunc:f, success:f, fail:f, close:f}
    showRewardedVideoAd(obj = {}) {
        if (this._bLoadingVideoAds) return;
        if (undefined == obj.adsVideoId)
            obj.adsVideoId = this._opt.baidu_cfg.adsVideoId;
        if (undefined == obj.appSid)
            obj.appSid = this._opt.baidu_cfg.appSid;
        if (!!obj.adsVideoId && !!obj.appSid) {
            let pVideoAd = swan.createRewardedVideoAd(obj.adsVideoId, obj.appSid);
            let bBannerShow = this._bBannerShow;
            Log.l('baidu showRewardedVideoAd bBannerShow', bBannerShow, this._bBannerShow);
            pVideoAd.load();
            this._bLoadingVideoAds = true;
            pVideoAd.onLoad(() => {
                obj.loadSuccessFunc && 'function' == typeof object.loadSuccessFunc && obj.loadSuccessFunc(() => {
                    this._bLoadingVideoAds = false;
                    this.hideBannerAds();
                    pVideoAd.show();
                });
            });
            pVideoAd.onError((err) => {
                this._bLoadingVideoAds = false;
                Log.w('baidu showRewardedVideoAd err', err);
                this.showToast('视频加载错误');
                obj.fail && 'function' == typeof object.fail && obj.fail(err);
            });
            pVideoAd.onClose((res) => {
                Log.l("baidu onClose");
                this._bLoadingVideoAds = false;
                if (obj.isEnded) {
                    obj.success && 'function' == typeof object.success && obj.success();
                } else {
                    obj.close && 'function' == typeof object.close && obj.close();
                }
                Log.l('baidu showRewardedVideoAd onClose bBannerShow', bBannerShow, this._bBannerShow);
                if (bBannerShow) {
                    this._bBannerShow = bBannerShow;
                    this.showBannerAds();
                }
            });
        } else {
            this.showToast('视频不可用');
        }
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
        this._settings = this._settings || {};
        if (!bForceRefresh) {
            func && 'function' == typeof func && func(this._settings);
        } else {
            swan.getSetting({
                success: (res) => {
                    this._settings = res.authSetting;
                    Log.l('baidu getSetting', res);
                    func && 'function' == typeof func && func(res.authSetting);
                }
            });
        }
    }

    // {success:f, fail:f}
    openSetting(object = {}) {
        swan.openSetting({
            success: (res) => {
                this._settings = res.authSetting;
                object.success && 'function' == typeof object.success && object.success(this._settings);
            },
            fail: (res) => {
                Log.l('fail', res);
                object.fail && 'function' == typeof object.fail && object.fail(res.errMsg);
            },
        });
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
        swan.showShareMenu({withShareTicket: true});
        swan.onShareAppMessage(function () {
            callFuc && callFuc();
            return {
                title: title || '快来和我一起玩吧',
                imageUrl: imageUrl || '',
                query: query
            };
        });
    }

    shareAppMessage(title, imageUrl, query) {
        swan.shareAppMessage({
            title: title || '快来和我一起玩吧',
            imageUrl: imageUrl || '',
            query: query,
        });
    }

    showToast(str) {
        if (undefined != str && 0 < str.length)
            swan.showToast({title: str, icon: 'none', duration: 2000});
    }

    showModal(object = {}) {
        swan.showModal(object);
    }

    createImage(sprite, url) {
        let image = swan.createImage();
        image.onload = function () {
            let texture = new cc.Texture2D();
            texture.initWithElement(image);
            texture.handleLoadedTexture();
            sprite.spriteFrame = new cc.SpriteFrame(texture);
        };
        image.src = url;
    }

    navigateToMiniProgram(appId, path, imageUrl) {
        Log.l('navigateToMiniProgram appId, path, imageUrl', appId, path, imageUrl);
    }

    // {success:f, fail:f, withCredentials:bool}
    createUserInfoButton(object = {}) {
        let infoButton = swan.createUserInfoButton({
            type: 'text',
            text: '',
            withCredentials: object.withCredentials,
            lang: 'zh_CN',
            style: {
                left: 0,
                top: 0,
                width: this.getSystemScreenSize().width,
                height: this.getSystemScreenSize().height,
                lineHeight: 40,
                backgroundColor: '#00000000',
                color: '#00000000',
                textAlign: 'center',
                fontSize: 16,
                borderRadius: 4
            }
        });

        infoButton.onTap((res) => {
            res.errMsg = res.errMsg || '';
            Log.l('baidu createUserInfoButton onTap ', res);
            // iOS 和 Android 对于拒绝授权的回调 errMsg 没有统一，需要做一下兼容处理
            if (res.errMsg.indexOf('user deny') > -1 || res.errMsg.indexOf('auth deny') > -1 || res.errMsg.indexOf('auth denied') > -1) {
                // 处理用户拒绝授权的情况
                this._settings['scope.userInfo'] = false;
                object.fail && 'function' == typeof object.fail && object.fail(res.errMsg);
            } else {
                this._settings['scope.userInfo'] = true;
                object.success && 'function' == typeof object.success && object.success(res);
            }
            infoButton.destroy();
        });
    }

    createRewardedVideoAd(adUnitId, appSid) {
        return swan.createRewardedVideoAd({adUnitId: adUnitId, appSid: appSid});
    }
}