class OppoSysFunc extends SysFunc {
    constructor(opt = {}) {
        super(opt);
        this._opt = opt;
        if (undefined == this._opt.oppo_cfg)
            this._opt.oppo_cfg = {}
        qg.getSystemInfo({
            success: (res) => {
                Log.l('oppo system info', JSON.stringify(res));
                this._systemInfo = res;
            }
        })
        this.initAdService();
    }

    onShow(callFunc) {
        qg.onShow((callFunc) => {
            this._pVideoAdsSuccess && 'function' == typeof this._pVideoAdsSuccess && this._pVideoAdsSuccess();
            this._pVideoAdsSuccess = null;
            callFunc && 'function' == typeof callFunc && callFunc();
        });
    }

    onHide(callFunc) {
        qg.onHide(callFunc);
    }

    getLaunchOptionsSync() {
        return {query: {}};
        // return qg.getLaunchOptionsSync();
    }

    login(object) {
        object && qg.login({
            pkgName: this._opt.oppo_cfg.pkgName, fail: object.fail, success: (res) => {
                res.code = res.code || res.uid;
                this._pLoginRes = res;
                Log.l('oppo login info', JSON.stringify(res));
                object.success(res);
            }
        });
    }

    // {success:f, fail:f, withCredentials:bool}
    getUserInfo(object = {}) {
        if (this._pLoginRes)
            object.success && 'function' == typeof object.success && object.success({
                userInfo: {
                    gender: 'M' == this._pLoginRes.sex ? 1 : 0,
                    uid: this._pLoginRes.uid,
                    nickName: this._pLoginRes.nickName,
                    avatarUrl: this._pLoginRes.avatar,
                    city: this._pLoginRes.location
                }
            });
        else
            object.fail && 'function' == typeof object.fail && object.fail();
    }

    preRewardedVideoAd(obj = {}) {
        if (this._bLoadingVideoAds) return;
        if (undefined == obj.adsVideoId)
            obj.adsVideoId = this._opt.oppo_cfg.adsVideoId;
        let pVideoAd = qg.createRewardedVideoAd({
            posId: obj.adsVideoId
        });
        pVideoAd.load();
        this._bLoadingVideoAds = true;
        pVideoAd.onLoad(() => {
            this._bLoadingVideoAds = false;
            this.pVideoAd = pVideoAd;
        });
        pVideoAd.onError((err) => {
            this.pVideoAd = null;
            this._bLoadingVideoAds = false;
            Log.w('oppo showRewardedVideoAd err', JSON.stringify(err));
            obj.fail && obj.fail(err);
        });
    }

    // {adsVideoId:adsVideoId, loadSuccessFunc:f, success:f, fail:f, close:f}
    showRewardedVideoAd(obj = {}) {
        if (this._bLoadingVideoAds) return;
        if (undefined == obj.adsVideoId)
            obj.adsVideoId = this._opt.oppo_cfg.adsVideoId;
        if (obj.adsVideoId) {
            if (this.pVideoAd) {
                // this._bLoadingVideoAds = true;
                this.pVideoAd.show();
                this.pVideoAd.onRewarded(() => {
                    this._bLoadingVideoAds = false;
                    this.pVideoAd = null;
                    Log.l("oppo rewarded");
                    this._pVideoAdsSuccess = obj.success;
                    this.preRewardedVideoAd(obj);
                });
            } else {
                this.preRewardedVideoAd(obj);
            }
        }
    }

    // {adsInterstitialId:adsInterstitialId, success:f, fail:f, closeFunc:f}
    showInterstitialAd(obj = {}) {
        if (this._bLoadingInterstitialAds) return;
        if (undefined == obj.adsInterstitialId)
            obj.adsInterstitialId = this._opt.oppo_cfg.adsInterstitialId;
        if (obj.adsInterstitialId) {
            let pInterstitialAd = qg.createInsertAd({
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
                Log.w('oppo showInterstitialAd err', JSON.stringify(err));
                obj.fail && obj.fail(err);
            });
            pInterstitialAd.onShow(() => {
                this._bLoadingInterstitialAds = false;
                Log.l("oppo showInterstitialAd onShow");
                obj.success && obj.success();
            });
        }
    }

    // {bForceNew:false, adsBannerId:'',failedFunc:f}
    showBannerAds(obj = {}) {
        if (undefined == this._iBannerFailCounts)
            this._iBannerFailCounts = 0;
        if (undefined == obj.adsBannerId)
            obj.adsBannerId = this._opt.oppo_cfg.adsBannerId;
        if (obj.bForceNew)
            this.destroyBannerAds();
        if (!this._pBannerAds && obj.adsBannerId) {
            let screenSize = this.getSystemScreenSize();
            this._pBannerAds = qg.createBannerAd({
                posId: obj.adsBannerId
            });
            if (this._pBannerAds) {
                this._pBannerAds.onError && this._pBannerAds.onError((res) => {
                    this.destroyBannerAds();
                    Log.l('oppo BannerAds errMsg iBannerFailCounts', JSON.stringify(res), this._iBannerFailCounts);
                    this._iBannerFailCounts++;
                    setTimeout(() => {
                        if (3 > this._iBannerFailCounts) {
                            this.showBannerAds(obj);
                        } else
                            obj.failedFunc && obj.failedFunc(res)
                    }, 3000 * this._iBannerFailCounts);
                });
                this._pBannerAds.onShow(() => {
                    this._iBannerFailCounts = 0;
                });
                this._pBannerAds.onHide((res) => {
                    if (this._bBannerShow) {
                        this._bBannerShow = false;
                        this._pBannerAds = null;
                        Log.l('oppo BannerAds: destroy hide !');
                    }
                });
            } else {
                this._bBannerShow = false;
                obj.failedFunc && obj.failedFunc({errMsg: 'oppo version is too low'});
                Log.l('oppo BannerAds: sdk version is too low!');
            }
        }
        if (this._pBannerAds && !this._bBannerShow) {
            Log.l('oppo BannerAds: show!');
            this._pBannerAds.show();
            this._bBannerShow = true;
        }
    }

    isBannerAdsShow() {
        return this._bBannerShow;
    }

    destroyBannerAds() {
        Log.l('oppo BannerAds: destroy!');
        this.hideBannerAds();
    }

    hideBannerAds() {
        Log.l('oppo BannerAds: hide!');
        this._bBannerShow = false;
        if (this._pBannerAds)
            this._pBannerAds.hide();
    }

    isBannerAdsShow() {
        return this._bBannerShow;
    }

    initAdService(callBack) {
        if (this._opt.oppo_cfg.app_key) {
            qg.initAdService({
                appId: this._opt.oppo_cfg.app_key,
                isDebug: false,
                success: (res) => {
                    this._bAsService = true;
                    callBack && callBack(this._bAsService);
                    this.preRewardedVideoAd();
                    Log.l("success");
                },
                fail: (res) => {
                    this._bAsService = false;
                    callBack && callBack(this._bAsService);
                    Log.l("fail:" + res.code + res.msg);
                }
            });
        } else {
            Log.l("oppo initAdService fail, appId is null");
        }
    }

}