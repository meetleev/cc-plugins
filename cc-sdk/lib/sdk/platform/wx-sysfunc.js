class WeChatSysFunc extends SysFunc {
    constructor(opt) {
        super(opt);
        if (undefined == this._opt.wechat_cfg)
            this._opt.wechat_cfg = {}
        this._settings = {};
        this._systemInfo = wx.getSystemInfoSync();
        this.getSetting(null, true);
    }

    onShow(callFunc) {
        wx.onShow(callFunc);
    }

    onHide(callFunc) {
        wx.onHide(callFunc);
    }

    getLaunchOptionsSync() {
        return wx.getLaunchOptionsSync();
    }

    previewImage(current, urls) {
        Log.l('previewImage current urls', current, urls);
        if (current) {
            if (undefined == urls)
                urls = [current];
            wx.previewImage({
                current: current, urls: urls,
                fail: (res) => {
                    Log.l('previewImage fail', res)
                },
                success: (res) => {
                    Log.l('previewImage success', res)
                },
            });
        }
    }

    getSystemInfo() {
        if (!this._systemInfo)
            this._systemInfo = wx.getSystemInfoSync();
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
        Log.l('sdkVer', sdkVer);
        if (sdkVer > 10000)
            sdkVer /= 10;
        return sdkVer;
    }

    login(object) {
        object && wx.login({fail: object.fail, success: object.success});
    }

    // {success:f, fail:f, withCredentials:bool}
    getUserInfo(object = {}) {
        let f = () => {
            wx.getUserInfo({
                withCredentials: object.withCredentials,
                lang: 'zh_CN',
                fail: (res) => {
                    Log.l('getUserInfo fail', res);
                    this._settings['scope.userInfo'] = false;
                    object.fail && 'function' == typeof object.fail && object.fail(res.errMsg);
                },
                success: (res) => {
                    this._settings['scope.userInfo'] = true;
                    Log.l('getUserInfo success', res.userInfo);
                    object.success && 'function' == typeof object.success && object.success(res);
                },
            });
        };
        this.getSetting((authSetting) => {
            if (authSetting['scope.userInfo'] !== true) {
                if (2010 <= this.getSDKVersion())
                    this.createUserInfoButton(object);
                else f();
            } else f();
        });
    }

    // {adsVideoId:adsVideoId, loadSuccessFunc:f, success:f, fail:f, close:f}
    showRewardedVideoAd(obj = {}) {
    }

    // {adsInterstitialId:adsInterstitialId, success:f, fail:f, closeFunc:f}
    showInterstitialAd(obj = {}) {
    }

    // {bForceNew:false, adsBannerId:'',failedFunc:f}
    showBannerAds(obj) {
    }

    destroyBannerAds() {
        Log.l('WeChat BannerAds: destroy!');
    }

    hideBannerAds() {
        Log.l('WeChat BannerAds: hide!');
    }

    isBannerAdsShow() {
        return this._bBannerShow;
    }

    getSetting(func, bForceRefresh = false) {
        this._settings = this._settings || {};
        if (!bForceRefresh) {
            func && 'function' == typeof func && func(this._settings);
        } else {
            wx.getSetting({
                success: (res) => {
                    this._settings = res.authSetting;
                    Log.l('WeChat getSetting', res);
                    func && 'function' == typeof func && func(res.authSetting);
                }
            });
        }
    }

    // {success:f, fail:f}
    openSetting(object = {}) {
        wx.openSetting({
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
        wx.getLocation({
            fail: (res) => {
                Log.l('fail', res);
                this._settings['scope.userLocation'] = false;
                object.fail && 'function' == typeof object.fail && object.fail(res.errMsg);
            },
            success: (res) => {
                this._settings['scope.userLocation'] = true;
                Log.l('success', res);
                object.success && 'function' == typeof object.success && object.success(res.longitude, res.latitude);
            },
        });
    }

    // {title:string, bMask:bool, timeout:number, success:f, fail:f}
    showLoading(object) {
        if (object) {
            wx.showLoading({
                title: object.title,
                mask: object.bMask,
                success: object.success,
                fail: object.fail,
            });

            setTimeout(function () {
                wx.hideLoading()
            }, object.timeout || 2000)
        }
    }

    hideLoading() {
        wx.hideLoading();
    }

    showOpenAds(url) {
        if (undefined != url)
            this.previewImage(url);
    }

    showShareMenu(desc, shareLink, query, callFuc) {
    }

    shareAppMessage(desc, shareLink, query) {
    }

    showToast(str) {
        if (undefined != str && 0 < str.length)
            wx.showToast({title: str, icon: 'none', duration: 2000});
    }

    showModal(object = {}) {
        wx.showModal(object);
    }

    createImage(sprite, url) {
        let image = wx.createImage();
        image.onload = function () {
            let texture = new cc.Texture2D();
            texture.initWithElement(image);
            texture.handleLoadedTexture();
            sprite.spriteFrame = new cc.SpriteFrame(texture);
        };
        image.src = url;
    }

    navigateToMiniProgram(appId, path, imageUrl) {
    }

    createBannerAd(adUnitId, style) {
        let sdkVer = this.getSDKVersion();
        const lowVer = 2040;
        if (lowVer <= sdkVer) {
            return wx.createBannerAd({
                adUnitId: adUnitId,
                style: style
            });
        }
        return null;
    }

    createRewardedVideoAd(adUnitId) {
        let sdkVer = this.getSDKVersion();
        const lowVer = 2040;
        if (lowVer <= sdkVer) {
            return wx.createRewardedVideoAd({
                adUnitId: adUnitId,
            });
        }
        return null;
    }

    // {success:f, fail:f, withCredentials:bool}
    createUserInfoButton(object = {}) {
        let wechatInfoButton = wx.createUserInfoButton({
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

        wechatInfoButton.onTap((res) => {
            res.errMsg = res.errMsg || '';
            Log.l('wx getUserInfo ', res.userInfo);
            // iOS 和 Android 对于拒绝授权的回调 errMsg 没有统一，需要做一下兼容处理
            if (res.errMsg.indexOf('auth deny') > -1 || res.errMsg.indexOf('auth denied') > -1) {
                // 处理用户拒绝授权的情况
                this._settings['scope.userInfo'] = false;
                object.fail && 'function' == typeof object.fail && object.fail(res.errMsg);
            } else {
                this._settings['scope.userInfo'] = true;
                object.success && 'function' == typeof object.success && object.success(res);
            }
            wechatInfoButton.destroy();
        });
    }

    createOpenSettingButton(callFunc) {
        let openSettingButton = wx.createOpenSettingButton({
            type: 'text',
            text: '',
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

        openSettingButton.onTap(() => {
            openSettingButton.destroy();
            this.getSetting((authSetting) => {
                if (callFunc)
                    callFunc(authSetting);
            }, true);
        });
    }
}