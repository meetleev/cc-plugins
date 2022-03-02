class VivoSysFunc extends SysFunc {
    constructor(opt = {}) {
        super(opt);
        this._opt = opt;
        if (undefined == this._opt.vivo_cfg)
            this._opt.vivo_cfg = {}
        this._systemInfo = qg.getSystemInfoSync();
        Log.l('vivo system info', JSON.stringify(this._systemInfo));
    }

    onShow(callFunc) {
        qg.onShow(callFunc);
    }

    onHide(callFunc) {
        qg.onHide(callFunc);
    }

    getSystemInfo() {
        if (!this._systemInfo)
            this._systemInfo = qg.getSystemInfoSync();
        return this._systemInfo;
    }

    getSystemScreenSize() {
        let res = this.getSystemInfo();
        return {width: res.screenWidth, height: res.screenHeight};
    }

    login(object) {
        object && qg.authorize({
            type: 'token',
            success: (obj) => {
                qg.getProfile({
                    token: obj.accessToken,
                    success: (res) => {
                        res.code = res.openid || res.id;
                        this._pLoginRes = res;
                        Log.l('vivo login info', JSON.stringify(res));
                        object.success(res);
                    },
                    fail: object.fail
                });
            },
            fail: object.fail
        });
    }

    // {success:f, fail:f, withCredentials:bool}
    getUserInfo(object = {}) {
        if (this._pLoginRes)
            object.success && 'function' == typeof object.success && object.success({
                userInfo: {
                    gender: 0,
                    uid: this._pLoginRes.id,
                    nickName: this._pLoginRes.nickname,
                    avatarUrl: this._pLoginRes.avatar,
                }
            });
        else
            object.fail && 'function' == typeof object.fail && object.fail();
    }

    // {adsVideoId:adsVideoId, loadSuccessFunc:f, success:f, fail:f, close:f}
    showRewardedVideoAd(obj = {}) {
        // obj.adsInterstitialId = obj.adsVideoId;
        // this.showInterstitialAd(obj);
    }

    // {adsInterstitialId:adsInterstitialId, success:f, fail:f, closeFunc:f}
    showInterstitialAd(obj = {}) {
        if (this._bLoadingInterstitialAds) return;
        if (undefined == obj.adsInterstitialId)
            obj.adsInterstitialId = this._opt.vivo_cfg.adsInterstitialId;
        if (obj.adsInterstitialId) {
            let pInterstitialAd = qg.createInterstitialAd({
                posId: obj.adsInterstitialId
            });
            pInterstitialAd.load();
            this._bLoadingInterstitialAds = true;
            pInterstitialAd.onLoad(() => {
                this._bLoadingInterstitialAds = false;
                pInterstitialAd.show();
            });
            pInterstitialAd.onError((err) => {
                this._bLoadingInterstitialAds = false;
                Log.w('vivo showInterstitialAd err', JSON.stringify(err));
                obj.fail && obj.fail(err);
            });
            pInterstitialAd.onClose(() => {
                this._bLoadingInterstitialAds = false;
                Log.l("vivo showInterstitialAd onShow");
                obj.success && obj.success();
            });
        }
    }

    // {bForceNew:false, adsBannerId:'',failedFunc:f}
    showBannerAds(obj) {
        if (undefined == this._iBannerFailCounts)
            this._iBannerFailCounts = 0;
        if (undefined == obj.adsBannerId)
            obj.adsBannerId = this._opt.vivo_cfg.adsBannerId;
        if (obj.bForceNew)
            this.destroyBannerAds();
        if (!this._pBannerAds && obj.adsBannerId) {
            let screenSize = this.getSystemScreenSize();
            this._pBannerAds = qg.createBannerAd({
                posId: obj.adsBannerId,
                style: {}
            });
            if (this._pBannerAds) {
                this._pBannerAds.onError && this._pBannerAds.onError((res) => {
                    this.destroyBannerAds();
                    Log.l('vivo BannerAds errMsg iBannerFailCounts', JSON.stringify(res), this._iBannerFailCounts);
                    this._iBannerFailCounts++;
                    setTimeout(() => {
                        if (3 > this._iBannerFailCounts) {
                            this.showBannerAds(obj);
                        } else
                            obj.failedFunc && obj.failedFunc(res)
                    }, 3000 * this._iBannerFailCounts);
                });
                this._pBannerAds.onLoad(() => {
                    this._iBannerFailCounts = 0;
                });
                this._pBannerAds.onClose((res) => {
                    if (this._bBannerShow) {
                        this._bBannerShow = false;
                        this._pBannerAds = null;
                        Log.l('vivo BannerAds: destroy hide !');
                    }
                });
            } else {
                this._bBannerShow = false;
                obj.failedFunc && obj.failedFunc({errMsg: 'vivo version is too low'});
                Log.l('vivo BannerAds: sdk version is too low!');
            }
        }
        if (this._pBannerAds && !this._bBannerShow) {
            Log.l('vivo BannerAds: show!');
            this._pBannerAds.show();
            this._bBannerShow = true;
        }
    }

    isBannerAdsShow() {
        return this._bBannerShow;
    }

    destroyBannerAds() {
        Log.l('vivo BannerAds: destroy!');
        this.hideBannerAds();
    }

    hideBannerAds() {
        Log.l('vivo BannerAds: hide!');
        this._bBannerShow = false;
        if (this._pBannerAds)
            this._pBannerAds.hide();
    }

    isBannerAdsShow() {
        return this._bBannerShow;
    }

    showToast(str) {
        qg.showToast({
            message: str
        });
    }
}