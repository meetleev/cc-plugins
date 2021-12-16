// import HttpMsgCenter from './HttpMsgCenter';
const LOCAL_TIMESTAMP = 'SDK_NAME@LOCAL_TIMESTAMP';
// const SDK_USER_PLAY_TIME = 'SDK_NAME@USER_PLAY_TIME';
const sVersion = '0.2.0';
/*
const LoginStatus = {
    None: -2,
    Fail: -1,
    Logining: 0,
    Success: 1
};*/

// 获取邀请玩家列表
/*function CheckNewInvitedUser(fromUid, pHttpMsgCenter) {
    let isNewUser = cc.sys.localStorage.getItem('HaveAccount');
    if (undefined == isNewUser) {
        cc.sys.localStorage.setItem("HaveAccount", true);
        // 检测是否通过分享进入
        // let shareTicket = launchOptions.shareTicket;
        //用户从分享卡片进入
        if (fromUid && fromUid) {
            pHttpMsgCenter.sdkCommonShare(fromUid, (data) => {
                Log.l('邀请进入', data);
            });
        }
    }
}

function ShowUserInfoAuthorize(pSDK) {
    let fShowModal = function (callFunc) {
        if (2070 <= pSDK._pSysFunc.getSDKVersion()) //{
            callFunc = function () {
                pSDK.loginWithAuthorize();
            };
        pSDK._pSysFunc.showModal({
            title: cc.sys.platform === cc.sys.WECHAT_GAME ? '微信授权' : '百度授权',
            content: '同意获取个人信息, 我们不会泄露用户个人信息，请放心使用',
            showCancel: false,
            confirmText: '确认',
            success: callFunc,
        });
    };
    let callFunc = () => {
        pSDK._pSysFunc.openSetting({
            success: (authSetting) => {
                if (authSetting['scope.userInfo'] === true) {
                    pSDK.loginWithAuthorize();
                } else if (authSetting['scope.userInfo'] === false) {
                    fShowModal(callFunc);
                }
            }
        });
    };
    pSDK._pSysFunc.getSetting((authSetting) => {
        if (authSetting['scope.userInfo'] !== true) {
            fShowModal(callFunc);
        }
    });
}


function ServerMyPlayerTransformToObj(player, data) {
    if (undefined == player)
        player = new MyPlayer();
    player.setUid(data.uid);
    player.setSessionKey(data.sk);
    player.setToken(data.signatureToken);
    player.setLoginId(data.loginId);
    player.setLevel(data.level);
    player.setEnergy(data.energy);
    player.setServerTime(data.stime);
    player.setCoin(data.coin);
    player.setIngot(data.ingot);
    player.setPic(data.pic);
    player.setPickUrl(data.picUrl);
    player.setSex(data.sex);
    player.setName(!!data.name ? data.name : data.uid);
    player.setRegisterTime(data.rolectime);
    return player;
}

const Sex = {Man: 1, Woman: 0};

function UploadUserInfoToServer(res, player, pHttpMsgCenter) {
    let sessionkey = player.getSessionKey();
    let sex = (1 == res.userInfo.gender) ? Sex.Man : Sex.Woman;
    if (!!res.userInfo.nickName)
        player.setName(res.userInfo.nickName);
    player.setSex(sex);
    player.setPickUrl(res.userInfo.avatarUrl);
    player.setCity(res.userInfo.city);
    let uuid = null;
    if (res.encryptedData && res.iv && sessionkey) {
        let key = CryptoJS.enc.Base64.parse(sessionkey);
        let iv = CryptoJS.enc.Base64.parse(res.iv);
        let decrypt = CryptoJS.AES.decrypt(res.encryptedData, key, {iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7});
        let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
        let obj = JSON.parse(decryptedStr || '{}');
        uuid = obj.unionId;
        player.setOpenId(obj.openId);
    }
    pHttpMsgCenter.sdkUploadUserInfo(player, (data) => {
        Log.l('个人信息上传结果', data);
    });
    return player;
}
*/

// const BeginShareTimestamp = 'BeginShareTimestamp';
class SDKMgr {
    constructor() {
        this._bSdkInit = false;
        // this._iLoginStatus = LoginStatus.None;
        /*this._iShareSuccessCount = 0;
        if (this.isNewDay()) {
            cc.sys.localStorage.setItem(SHARE_SUCCESS_COUNTS, 0);
            cc.sys.localStorage.setItem(SHARE_COUNTS, 0);
            this._iShareSuccessCount = 0;
            this._iShareCount = 0;
        } else {
            this._iShareSuccessCount = cc.sys.localStorage.getItem(SHARE_SUCCESS_COUNTS);
            this._iShareCount = cc.sys.localStorage.getItem(SHARE_COUNTS);
        }
        this._lUserPlayTime = -1;
        this.lGameShowTimestamp = new Date().getTime();
        let lUserPlayTime = cc.sys.localStorage.getItem(SDK_USER_PLAY_TIME);
        if (undefined != lUserPlayTime && '' != lUserPlayTime)
            this._lUserPlayTime = parseInt(lUserPlayTime);*/
        Log.l('sVersion', sVersion);
    }

    isNewDay(keyword = 'DEFAULT') {
        let bNewDay = false;
        let lTmpLocalTimestamp = cc.sys.localStorage.getItem(LOCAL_TIMESTAMP + '_' + keyword);
        let date = new Date();
        let lLocalTimestamp = date.getTime();
        let lNewLocalTimestamp = lLocalTimestamp - date.getHours() * 3600 * 1000 - date.getMinutes() * 60 * 1000 - date.getSeconds() * 1000 - date.getMilliseconds();
        if (undefined == lTmpLocalTimestamp || '' == lTmpLocalTimestamp) {
            lTmpLocalTimestamp = lNewLocalTimestamp;
            bNewDay = true;
            cc.sys.localStorage.setItem(LOCAL_TIMESTAMP + '_' + keyword, lTmpLocalTimestamp);
        } else {
            let newDate = new Date(Number(lTmpLocalTimestamp));
            if (lNewLocalTimestamp == newDate.getTime()) {

            } else {
                lTmpLocalTimestamp = lNewLocalTimestamp;
                bNewDay = true;
                cc.sys.localStorage.setItem(LOCAL_TIMESTAMP + '_' + keyword, lTmpLocalTimestamp);
            }
        }
        return bNewDay;
    }

    /*isUseOutShareCounts() {
        Log.l('isUseOutShareCounts iShareCount', this._iShareSuccessCount);
        if (this._pOnlineParamData && this._pOnlineParamData.isTestMode()) return true;
        if (this._pOnlineParamData)
            return this._iShareSuccessCount >= this._pOnlineParamData.getSDKShareCount();
        return true;
    }*/

    onGameShow(res) {
        Log.l('onGameShow', res);
        /* this.requestSDKHttpParameters();

        this.lGameShowTimestamp = new Date().getTime();
        //
        if (this.isNewDay()) {
            cc.sys.localStorage.setItem(SHARE_SUCCESS_COUNTS, 0);
            cc.sys.localStorage.setItem(SHARE_COUNTS, 0);
            this._iShareSuccessCount = 0;
            this._iShareCount = 0;
            Log.l('isNewDay iShareSuccessCount', this._iShareSuccessCount);
        }

        if (this._pOnlineParamData && !this._pOnlineParamData.isTestMode()) {
            let fShareSecond = 2000;
            if (this._pOnlineParamData)
                fShareSecond = this._pOnlineParamData.getSDKShareTime();
            if (this._pShareCallFuncList) {
                let needTime = fShareSecond; // (fShareSecond + this._iShareCount * 1000);
                if (needTime >= 5000) needTime = 5000;
                if (needTime < new Date().getTime() - this._fBeginShareTimestamp) {
                    this._pShareCallFuncList[0] && 'function' == typeof (this._pShareCallFuncList[0]) && this._pShareCallFuncList[0]();
                    ++this._iShareSuccessCount;
                    cc.sys.localStorage.setItem(SHARE_SUCCESS_COUNTS, this._iShareSuccessCount);
                    ++this._iShareCount;
                    cc.sys.localStorage.setItem(SHARE_COUNTS, this._iShareCount);
                } else {
                    this._pShareCallFuncList[1] && 'function' == typeof (this._pShareCallFuncList[1]) && this._pShareCallFuncList[1]();
                    if (0 == this._iShareCount) {
                        this._pSysFunc.showToast(this._pOnlineParamData.getShareTipsList()[0]);
                    } else {
                        this._pSysFunc.showToast(this._pOnlineParamData.getShareTipsList()[1]);
                    }
                }
                this._pShareCallFuncList = null;
            }
        }*/
        this.emit(cc.game.EVENT_SHOW, res);
    }

    onGameHide() {
        Log.l('onGameHide');
        /*let lTime = new Date().getTime() - this.lGameShowTimestamp;
        if (lTime > 10 * 1000) {
            this._lUserPlayTime += Math.abs(lTime / 1000);
            cc.sys.localStorage.setItem(SDK_USER_PLAY_TIME, this._lUserPlayTime);
        }*/
        this.emit(cc.game.EVENT_HIDE);
    }

    init() {
        if (this._bSdkInit) return;
        SDK_NAME.screenUtil.init();
        this.initSdkConfig(SDK_NAME.sdkConfig);
    }

    initSdkConfig(config = {}) {
        if (this._bSdkInit) return;
        this._pSdkConfig = config;
        // if (undefined == this._pHttpMsgCenter)
        //     this._pHttpMsgCenter = new HttpMsgCenter(config);
        if (undefined == this._pSysFunc)
            this._pSysFunc = new SysFuncCommon(config);
        this._bSdkInit = true;
        this._pSysFunc.onShow(this.onGameShow.bind(this));
        this._pSysFunc.onHide(this.onGameHide.bind(this));
        // this._pMyPlayer = PlayerMgr.getInstance().getMyPlayer();
        // this.requestSDKHttpParameters();
        /*if (this._pSdkConfig.share_opts_cfg) {
            this._pSysFunc.showShareMenu(this._pSdkConfig.share_opts_cfg.title, this._pSdkConfig.share_opts_cfg.imageUrl, null, () => {
                this._pOnShareAppMessage && this._pOnShareAppMessage();
            });
        }
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            this._pSdkConfig.wechat_cfg = this._pSdkConfig.wechat_cfg || {};
            let mta_cfg = this._pSdkConfig.wechat_cfg.mta_cfg || {};
            let mta_appid = mta_cfg.appID;
            let mta_eventID = mta_cfg.eventID;
            if (mta_appid && mta_eventID && 0 < mta_appid.length && 0 < mta_appid.length) {
                Log.i('mta init appID eventID', mta_appid, mta_eventID);
                MTA.App.init({
                    "appID": mta_appid,
                    "eventID": mta_eventID,
                });
                MTA.Page.stat();
                this._bMtaSdkInit = true;
            }
        }

        if (undefined == this._pSdkPersistRootNode) {
            this._pSdkPersistRootNode = new SdkPersistRootNode;
            this._pSdkPersistRootNode.setContentSize(cc.winSize);
            this._pSdkPersistRootNode.parent = cc.director.getScene();
            this._pSdkPersistRootNode.onUpdateFunc(this.onUpdate.bind(this));
            cc.game.addPersistRootNode(this._pSdkPersistRootNode);
        }*/
    }

    /*onUpdate(dt) {
        if (undefined != this._pHttpMsgCenter) {
            this._pHttpMsgCenter.onTransmitCenter();
        }
        /*if (undefined == this._pOnlineParamData) {
            return;
        }
        if (this._pSysFunc && this._pSysFunc.isBannerAdsShow()) {
            let curTime = new Date().getTime();
            if (undefined == this._fLastRefreshAds) {
                this._fLastRefreshAds = curTime;
            } else {
                let fRefreshSecond = this._pOnlineParamData.getBannerRefreshSecond();
                if (0 < fRefreshSecond && fRefreshSecond * 1000 < curTime - this._fLastRefreshAds) {
                    this._fLastRefreshAds = curTime;
                    Log.l('Refresh BannerAds');
                    this.showBannerAds(true);
                }
            }
        }*/
    //}

    /* showMoreGameNode(parentNode) {
         if (undefined == this._pMoreGameComponent) {
             CreateMoreGameNode((itemCls) => {
                 this._pMoreGameComponent = itemCls;
                 itemCls.node.setContentSize(cc.winSize);
                 itemCls.node.setPosition(cc.v2(cc.winSize.width * 0.5, cc.winSize.height * 0.5));
                 this._pMoreGameComponent.onExitFunc(() => {
                     this._pMoreGameComponent = null;
                 });
                 this._pMoreGameComponent.initBoxData(this._pSdkConfig);
                 this._pMoreGameComponent.onMoreGameClickEvent((data, bMoreGame) => {
                     console.log('onMoreGameClickEvent', data);
                     let url = "https://gamezyxz.jfydgame.com/apkdownload/apk/xxxxl_dlb_mg.jpg";
                     let wechatgameid = 'wxe675b6aad9612c74';
                     let path = '';
                     let iconlink = null;
                     if (undefined != data) {
                         wechatgameid = data.wechatgameid;
                         if ('' == wechatgameid || undefined == wechatgameid)
                             wechatgameid = data.wechatGameid;
                         iconlink = data.iconlink;
                         url = data.qrcodelink;
                         if ('' == url || undefined == url)
                             url = data.link;
                         path = data.path;
                         if (bMoreGame) {
                             if (cc.sys.os == cc.sys.OS_ANDROID) {
                                 wechatgameid = data.boxId;
                             } else {
                                 wechatgameid = data.wxid;
                             }
                         }
                     }
                     let flag = false;
                     let list = this._pSdkConfig.wxJumpAppIdList;
                     for (let i = 0; i < list.length; i++) {
                         if (list[i] == wechatgameid) {
                             flag = true;
                             break;
                         }
                     }
                     if (!flag)
                         wechatgameid = null;
                     if (!bMoreGame) {
                         iconlink = data.link;
                     }
                     this._pSysFunc.navigateToMiniProgram(wechatgameid, path, url);
                     if (undefined != iconlink) {
                         let gaid = GetGAID(iconlink);
                         this._pHttpMsgCenter.sdkGAClick(bMoreGame ? GAType.MoreGame : GAType.GameList, gaid);
                     }
                 });
                 itemCls.node.parent = (undefined != parentNode) ? parentNode : cc.director.getScene();
                 if (undefined != this._pOnlineParamData) {
                     this._pMoreGameComponent.setOnlineParamData(this._pOnlineParamData);
                 }
             });
         }
     }*/

    getLaunchOptionsSync() {
        if (!this._bSdkInit) {
            Log.l('sdk init fail!');
            return null;
        }
        return this._pSysFunc.getLaunchOptionsSync();
    }

    // {success:f}
    /*login(obj = {}) {
        Log.l('sdk login!');
        if (!this._bSdkInit)
            return Log.l('sdk init fail!');
        if (LoginStatus.Success == this._iLoginStatus)
            return Log.l('sdk already login!');
        if (LoginStatus.Logining == this._iLoginStatus)
            return Log.l('sdk logining!');
        this._iLoginStatus = LoginStatus.Logining;
        this._pSysFunc.login({
            success: (res) => {
                let pLaunchOptions = this.getLaunchOptionsSync();
                this._pHttpMsgCenter.sdkLogin(pLaunchOptions, this._lUserPlayTime, res.code, data => {
                    if (data.state == 3) {
                        ServerMyPlayerTransformToObj(this._pMyPlayer, data);
                        PlayerMgr.getInstance().setMyPlayer(this._pMyPlayer);
                        this._iLoginStatus = LoginStatus.Success;
                        obj.success && 'function' == typeof (obj.success) && obj.success(this._pMyPlayer);
                        // 判断是否是邀请进来的新用户
                        // let fromUid = pLaunchOptions.query.fromUid;
                        // CheckNewInvitedUser(fromUid, this._pHttpMsgCenter);
                    } else {
                        this._iLoginStatus = LoginStatus.Fail;
                    }
                });
            }, fail: () => {
                this._iLoginStatus = LoginStatus.Fail;
            }
        });
    }

    // {success:f}
    loginWithAuthorize(obj = {}) {
        if (!this._bSdkInit)
            return Log.l('sdk init fail!');
        if (!this.isNewDay() && !!this._pMyPlayer.getUid())
            return this.login(obj);
        if (LoginStatus.Success == this._iLoginStatus)
            return Log.l('sdk already login!');
        if (LoginStatus.Logining == this._iLoginStatus)
            return Log.l('sdk logining!');
        this._iLoginStatus = LoginStatus.Logining;
        this._pSysFunc.login({
            success: (res) => {
                let pLaunchOptions = this.getLaunchOptionsSync();
                this._pHttpMsgCenter.sdkLogin(pLaunchOptions, this._lUserPlayTime, res.code, data => {
                    if (data.state == 3) {
                        ServerMyPlayerTransformToObj(this._pMyPlayer, data);
                        PlayerMgr.getInstance().setMyPlayer(this._pMyPlayer);
                        // 判断是否是邀请进来的新用户
                        // let fromUid = pLaunchOptions.query.fromUid;
                        // CheckNewInvitedUser(fromUid, this._pHttpMsgCenter);
                        this._pSysFunc.getUserInfo({
                            success: (res) => {
                                if (cc.sys.platform == cc.sys.WECHAT_GAME || cc.sys.platform == cc.sys.OPPO_GAME || cc.sys.platform == cc.sys.VIVO_GAME || cc.sys.platform == cc.sys.BAIDU_GAME) {
                                    this._pMyPlayer = UploadUserInfoToServer(res, this._pMyPlayer, this._pHttpMsgCenter);
                                    PlayerMgr.getInstance().setMyPlayer(this._pMyPlayer);
                                }
                                this._iLoginStatus = LoginStatus.Success;
                                obj.success && 'function' == typeof (obj.success) && obj.success(this._pMyPlayer);
                            },
                            fail: () => {
                                this._iLoginStatus = LoginStatus.Fail;
                                if (cc.sys.platform == cc.sys.WECHAT_GAME || cc.sys.platform == cc.sys.BAIDU_GAME) {
                                    ShowUserInfoAuthorize(this);
                                }
                            }, withCredentials: true
                        });
                    } else {
                        this._iLoginStatus = LoginStatus.Fail;
                    }
                });
            }, fail: () => {
                this._iLoginStatus = LoginStatus.Fail;
            }
        });
    }*/

    showBannerAds(bForceNew, failFunc) {
        if (!this._bSdkInit)
            return Log.l('sdk init fail!');
        /*if (bForceNew) {
            let curTime = new Date().getTime();
            if (this._pOnlineParamData.getSdkBannerMin() * 1000 < curTime - this._fLastRefreshAds)
                this._fLastRefreshAds = curTime;
        }*/
        this._pSysFunc.showBannerAds({bForceNew: bForceNew, failFunc: failFunc});
    }

    hideBannerAds() {
        if (!this._bSdkInit)
            return Log.l('sdk init fail!');
        this._pSysFunc.hideBannerAds();
    }

    destroyBannerAds() {
        if (!this._bSdkInit)
            return Log.l('sdk init fail!');
        this._pSysFunc.destroyBannerAds();
    }

    // {adsVideoId:'', success:f, fail:f, close:f,  bForceFilterShare:false}
    showRewardedVideoAd(obj) {
        if (!this._bSdkInit)
            return Log.l('sdk init fail!');
        if (undefined === obj)
            obj = {};
        let failFunc = () => {
            /*if (this._pOnlineParamData && !this._pOnlineParamData.isTestMode()) {
                // if (undefined == obj.fail) {
                this.shareAppMessage({
                    success: () => {
                        obj.success && 'function' == typeof (obj.success) && obj.success();
                    }
                });
                // } else {
                //     obj.fail && 'function' == typeof (obj.fail) && obj.fail();
                // }
            } else */{
                this._pSysFunc.showToast('视频加载失败');
                obj.fail && 'function' == typeof (obj.fail) && obj.fail();
            }
        };
        this._pSysFunc.showRewardedVideoAd({
            adsVideoId: obj.adsVideoId, loadSuccessFunc: (showFunc) => {
                /*if (!obj.bForceFilterShare && this._pOnlineParamData && !this._pOnlineParamData.isTestMode() && this._pOnlineParamData.isOpenShareAfterVideo()) {
                    if (1 == this._pOnlineParamData.getSdkVideoShare()) {
                        this.shareAppMessage({
                            success: showFunc
                        });
                    } else if (2 == this._pOnlineParamData.getSdkVideoShare()) {
                        this.shareAppMessage();
                        showFunc && showFunc();
                    }
                } else */{
                    showFunc && showFunc();
                }
            }, success: () => {
                // this._pHttpMsgCenter.sdkGAVideo(GAType.VideoFinished);
                obj.success && 'function' == typeof (obj.success) && obj.success();
            }, fail: failFunc, closeFunc: obj.close
        });
    }

    // {adsInterstitialId:'', success:f, fail:f, close:f}
    showInterstitialAd(obj) {
        if (!this._bSdkInit)
            return Log.l('sdk init fail!');
        if (undefined == obj)
            obj = {};
        let failFunc = () => {
            this._pSysFunc.showToast('插屏加载失败');
            obj.fail && 'function' == typeof (obj.fail) && obj.fail();
        };
        this._pSysFunc.showInterstitialAd({
            adsInterstitialId: obj.adsInterstitialId, success: obj.success, fail: failFunc, closeFunc: obj.close
        });
    }

    /*requestSDKHttpParameters() {
        Log.l('requestSDKHttpParameters');
        if (!this._bSdkInit)
            return Log.l('sdk init fail!');
        this._pHttpMsgCenter.sdkAppOnlineParameters((data) => {
            Log.l('requestSDKHttpParameters', data);
            if (data) {
                this._pOnlineParamData = data;
                if (undefined != data.getbanner())
                    this._pSdkConfig.adsBannerId = data.getbanner();
                if (undefined != data.getvideo())
                    this._pSdkConfig.adsVideoId = data.getvideo();
                if (data.isShowOpenSDKAds() && !this.bHadShowOpenAds) {
                    this._pSysFunc.showOpenAds(data.getWXInGameAdvertUrl());
                    this.bHadShowOpenAds = true;
                }
                let shareData = data.getRandomWXShareData();
                let uid = this._pMyPlayer.getUid();
                this._pSysFunc.showShareMenu(shareData.desc, shareData.shareLink, 'fromUid=' + uid, () => {
                    this._pOnShareAppMessage && this._pOnShareAppMessage();
                });
                if (undefined != this._pMoreGameComponent)
                    this._pMoreGameComponent.setOnlineParamData(this._pOnlineParamData);
            }
            this._pSDKOnlineParametersResponse && this._pSDKOnlineParametersResponse(data);
        }, this._pOnlineParamData);
    }

    onSDKOnlineParametersResponse(callFunc) {
        this._pSDKOnlineParametersResponse = callFunc;
        if (this._pOnlineParamData) callFunc(this._pOnlineParamData);
    }

    // 微信小圆点分享
    onShareAppMessage(func) {
        this._pOnShareAppMessage = func;
    }
    */

    // {title:'', imageUrl:'', query:'', success:f, fail:f}
    shareAppMessage(obj) {
        Log.l('shareAppMessage');
        if (!this._bSdkInit)
            return Log.l('sdk init fail!');
        if (undefined == obj)
            obj = {};
        let shareData = {};
        // if (undefined != this._pOnlineParamData) shareData = this._pOnlineParamData.getRandomWXShareData();

        let title = shareData.title;
        if (undefined != obj.title && 'string' == typeof obj.title && 0 < obj.title.length)
            title = obj.title;
        let share_opts_cfg = this._pSdkConfig.share_opts_cfg;
        if (share_opts_cfg && !!share_opts_cfg.title)
            title = obj.title;

        let imageUrl = shareData.imageUrl;
        if (undefined != obj.imageUrl && 'string' == typeof obj.imageUrl && 0 < obj.imageUrl.length)
            imageUrl = obj.imageUrl;
        if (share_opts_cfg && !!share_opts_cfg.imageUrl)
            imageUrl = obj.imageUrl;

        this._fBeginShareTimestamp = new Date().getTime();

        let successFunc = null;
        if (obj.success && 'function' == typeof (obj.success))
            successFunc = obj.success;
        let failFunc = null;
        if (obj.fail && 'function' == typeof (obj.fail))
            failFunc = obj.fail;
        this._pShareCallFuncList = [successFunc, failFunc];

        let query = obj.query;
        this._pSysFunc.shareAppMessage(title, imageUrl, query);
        // if (this._pOnlineParamData && !this._pOnlineParamData.isTestMode()) {
        //     this._pHttpMsgCenter.sdkGAClick(GAType.ShareNum, gaid);
        // }
    }

    logTencentAnalysisEvent(eventId, query = {}) {
        if (this._bMtaSdkInit && eventId && 0 < eventId.length)
            MTA.Event.stat(eventId, query);
    }

    setDebug(debug) {
        Log.setDebug(debug);
    }

    // {level:0, energy:0, coin:0, pic:0, ingot:0}
    /*uploadUserInfo(obj) {
        if (!this._bSdkInit)
            return Log.l('sdk init fail!');
        if (obj && undefined != this._pMyPlayer) {
            if (obj.level)
                this._pMyPlayer.setLevel(obj.level);
            if (obj.energy)
                this._pMyPlayer.setEnergy(obj.energy);
            if (obj.coin)
                this._pMyPlayer.setCoin(obj.coin);
            // if (obj.mapId)
            // this._pMyPlayer.setCoin(obj.mapId);
            if (obj.pic)
                this._pMyPlayer.setPic(obj.pic);
            if (obj.ingot)
                this._pMyPlayer.setIngot(obj.ingot);
            PlayerMgr.getInstance().setMyPlayer(this._pMyPlayer);
            this._pHttpMsgCenter.sdkUploadUserInfo(this._pMyPlayer, (data) => {
                Log.l('uploadUserInfo 个人信息上传结果', data);
            });
        }
    }*/

    showToast(str) {
        if (!this._bSdkInit) {
            return Log.l('sdk init fail!');
        }
        this._pSysFunc.showToast(str);
    }

    getSystemStatusBarHeight() {
        if (!this._bSdkInit) {
            return Log.l('sdk init fail!');
        }
        return this._pSysFunc.getSystemStatusBarHeight();
    }

    // obj = { xyid:xyid, data:data, responseCallBack:responseCallBack, bRepeat:bRepeat }
    /*requestInfoData(obj) {
        if (!this._bSdkInit)
            return Log.l('sdk init fail!');
        if (obj && obj.xyid && obj.data)
            this._pHttpMsgCenter.pushRequestCaches(obj.xyid, obj.data, obj.bRepeat, obj.responseCallBack)
    }*/

    createImage(sprite, url) {
        if (!this._bSdkInit) {
            return Log.l('sdk init fail!');
        }
        if (url && sprite && sprite instanceof cc.Sprite)
            this._pSysFunc.createImage(sprite, url);
        else
            Log.l('sprite is not cc.Sprite!', sprite);
    }

    getSysPlatformVersion() {
        if (!this._bSdkInit) {
            return Log.l('sdk init fail!');
        }
        return this._pSysFunc.getSDKVersion();
    }

    getSysFunc() {
        if (!this._bSdkInit) {
            return Log.l('sdk init fail!');
        }
        return this._pSysFunc;
    }
}

Emitter(SDKMgr.prototype);
SDK_NAME.sdkMgr = new SDKMgr();