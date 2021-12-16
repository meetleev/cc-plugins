// import {PostHttpDataCommon, GetWeChatHttpCfg, ONLINE_PARAMETERS_ERROR_CODE, ONLINE_PARAMETERS_XYID} from './HttpFunc';
// import OnlineParamData from "./OnlineParamData";
// const LoginUrl = '';
const InfoUrl = 'https://info.jfydgame.com/user/';
const HttpUrlType = {
    GetOpenId: 'https://wxsessionkey.jfydgame.com/user/121',
    Login: 'https://login.jfydgame.com/user/1003',
    CommonShare: 1332,
    InviteList: 1334,
    GetUserInfoList: 1333,
    UploadUserInfo: 1801,//上传用户信息
    GAClick: 2201,
    GAVideo: 2202,
    GetAdsList: 'https://wxhz.jfydgame.com/jfyd_advert_wechat/wxbox',
};

class HttpMsgCenter {
    constructor(sdkConfig) {
        this._pSdkConfig = sdkConfig;
        this._requestCache = new NetBufferCache();
    }

    sdkLogin(launchOptions, lPlayTime, code, cb) {
        let data = {};
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            if (!this._pSdkConfig.wechat_cfg)
                return Log.w('wechat_cfg err');
            data = {
                Channel: "weixin",
                ext3: code,
                selfid: this._pSdkConfig.wechat_cfg.app_key,
                onlineTime: lPlayTime,
            };
        } else {
            data = {
                Channel: 'jfyd',
                ext1: code,
                selfid: 'test'
            };
        }
        // let appid = null;
        // if (launchOptions.referrerInfo) {
        //     appid = launchOptions.referrerInfo.appId;
        //     data.srcid = appid;
        // }
        // let sceneId = launchOptions.scene;
        // if (sceneId == 1007 || sceneId == 1008 || sceneId == 1044 || sceneId == 1096) {
        //     data.srcid = "share";
        // }
        // if (sceneId == 1005 || sceneId == 1006 || sceneId == 1027 || sceneId == 1042 || sceneId == 1053) {
        //     data.srcid = "search";
        // }
        //
        // // 参数的query字段中可以获取到gdt_vid、weixinadinfo、channel等参数值
        // let query = launchOptions.query;
        // if (undefined == query)  query = {};
        // // let gdt_vid = query.gdt_vid;
        // let weixinadinfo = query.weixinadinfo;
        // // 获取⼴告id
        // let aid = 0;
        // if (weixinadinfo) {
        //     let weixinadinfoArr = weixinadinfo.split(".");
        //     aid = weixinadinfoArr[0];
        //     data.srcid = "weixinad_" + aid;
        // }
        // let shareImage = query.shareImage;
        // if (shareImage && shareImage != "") {
        //     data.srcid = "share_" + shareImage;
        // }
        //
        // let fromUid = query.fromUid;
        // if (fromUid && fromUid != "") {
        //     data.rinviteUid = fromUid;
        // }
        this.sendGetData(HttpUrlType.Login, data, (data) => {
            if (data.state == 3) {
                let privateKey = '5d3a51c7898c812c6a154e92eea9b42f';
                if (cc.sys.platform == cc.sys.WECHAT_GAME)
                    privateKey = this._pSdkConfig.wechat_cfg.privateKey;
                data.signatureToken = GenerateToken(data.loginToken, privateKey);
                this._sSignatureToken = data.signatureToken;
            }
            cb && 'function' == typeof cb && cb(data);
        });
    }

    sdkGAVideo(type) {
        let data = {type: type};
        // if (cc.sys.platform == cc.sys.WECHAT_GAME)
        //     this.pushRequestCaches(HttpUrlType.GAVideo, data, true);
    }

    sdkGAClick(type, picId) {
        let data = {
            type: type,
            picId: picId
        };
        // if (cc.sys.platform == cc.sys.WECHAT_GAME)
        //     this.pushRequestCaches(HttpUrlType.GAClick, data, true);
    }

    sdkUploadUserInfo(player, cb) {
        let data = {
            name: player.getName(),
            sex: player.getSex(),
            level: player.getLevel(),
            energy: player.getEnergy(),
            coin: player.getCoin(),
            ingot: player.getIngot(),
            mapId: -1,
            pic: player.getPic(),
            picUrl: player.getPickUrl(),
        };
        this.pushRequestCaches(HttpUrlType.UploadUserInfo, data, false, cb);
    }

    sdkCommonShare(shareUid, callFunc) {
        let app_key = '';
        if (cc.sys.platform == cc.sys.WECHAT_GAME && this._pSdkConfig.wechat_cfg)
            app_key = this._pSdkConfig.wechat_cfg.app_key;
        let data = {
            shareUid: Number(shareUid),
            rinviteGameid: app_key, // ??
            rinvitePos: 1,
            isNew: true,// 新邀请玩家统计
        };
        // this.pushRequestCaches(HttpUrlType.CommonShare, data, true, callFunc);
    }

    sendGetData(url, data, callFunc) {
        GetHttpDataCommon(url, data, this._sSignatureToken, callFunc);
    }

    transmitData() {
        let pHead = this._requestCache.front();
        if (pHead) {
            this._requestCache.pop_front();
            // if (pHead.getShowLoadingEnabled())
            //     this.noticeShowNetLoading(pHead.getXYID());
            this.sendGetData(InfoUrl + pHead.getXYID(), pHead.getMsgBuffer(), pHead.getResponseCallBack());
        }
    }

    onTransmitCenter() {
        if (undefined != this._sSignatureToken) {
            let curTime = new Date().getTime();
            if (undefined == this._fLastRequestTimestamp) {
                this._fLastRequestTimestamp = curTime;
                this.transmitData();
            } else {
                if (1000 < curTime - this._fLastRequestTimestamp) {
                    this._fLastRequestTimestamp = curTime;
                    this.transmitData();
                }
            }
        } else {
            // Log.i('sdk not login');
        }
    }

    pushRequestCaches(xyid, data, bRepeat, callFunc) {
        this._requestCache.push(new NetBuffer(xyid, data, false, bRepeat, callFunc));
    }

    /*sdkAppOnlineParameters(callFunc, pOnlineParamData) {
        Log.l('sdkAppOnlineParameters');
        let now = new Date().getTime();
        if (undefined == this.bLastReqOnlineParametersTimestamp || 5000 < now - this.bLastReqOnlineParametersTimestamp) {
            this.bLastReqOnlineParametersTimestamp = now;
            GetWeChatHttpCfg(this._pSdkConfig.wechat_cfg.app_key, this._pSdkConfig.appId, this._pSdkConfig.version, [ONLINE_PARAMETERS_XYID.All], (obj = {}) => {
                if (obj && ONLINE_PARAMETERS_ERROR_CODE.Success == obj.code) {
                    if (undefined == pOnlineParamData)
                        pOnlineParamData = new OnlineParamData();
                    let values = obj.value || {};
                    let toppath = obj.toppath || 'https://gamezyxz.jfydgame.com/';
                    let pWeChatParamObj = values[ONLINE_PARAMETERS_XYID.WeChatParam + ''];
                    if (pWeChatParamObj && ONLINE_PARAMETERS_ERROR_CODE.Success == pWeChatParamObj.code) {
                        pOnlineParamData.setOnlineParamData(pWeChatParamObj.value);
                        let pInGameAdvertObj = values[ONLINE_PARAMETERS_XYID.InGameAdvert + ''];
                        if (pInGameAdvertObj && ONLINE_PARAMETERS_ERROR_CODE.Success == pInGameAdvertObj.code) {
                            let arr = pInGameAdvertObj.adverts;
                            if (arr && arr instanceof Array) {
                                let len = arr.length;
                                for (let i = 0; i < len; i++) {
                                    let p = arr[i];
                                    if (p.wechatgameid == this._pSdkConfig.wechat_cfg.app_key) {
                                        arr.slice(i, 1);
                                        break;
                                    }
                                }
                                len = arr.length;
                                let sUrl = 'https://gamezyxz.jfydgame.com/apkdownload/apk/input1.jpg';
                                if (1 < len) {
                                    let idx = parseInt(Math.random() * (len - 1));
                                    sUrl = toppath + arr[idx].link;
                                } else if (1 == len) {
                                    sUrl = toppath + arr[0].link;
                                }
                                Log.l('getWXInGameAdvertParameters sUrl', sUrl);
                                pOnlineParamData.setWXInGameAdvertUrl(sUrl);
                            }
                        }

                    }
                    let pMoreGameObj = values[ONLINE_PARAMETERS_XYID.MoreGame + ''];
                    if (pMoreGameObj && ONLINE_PARAMETERS_ERROR_CODE.Success == pMoreGameObj.code) {
                        let arr = pMoreGameObj.adverts;
                        if (arr && arr instanceof Array) {
                            let len = arr.length;
                            for (let i = 0; i < len; i++) {
                                let p = arr[i];
                                if (p.wxid == this._pSdkConfig.wechat_cfg.app_key || p.boxId == this._pSdkConfig.wechat_cfg.app_key) {
                                    arr.slice(i, 1);
                                    break;
                                }
                            }
                            let arrL = [];
                            let arrR = [];
                            // let configList = this._pSdkConfig.wxJumpAppIdList;
                            for (let p of arr) {
                                p.link && (p.link = toppath + p.link);
                                p.iconlink && (p.iconlink = toppath + p.iconlink);
                                if (p.bannerLink) {
                                    p.bannerLink = toppath + p.bannerLink;
                                } else {
                                    p.bannerLink = 'https://pfugame.cn/wechatmoregame/defaultappId/e73d4b2dc5c042fa38130505af647bc.jpg';
                                }
                                let condition1 = false;
                                if (cc.sys.os == cc.sys.OS_IOS) {
                                    condition1 = this.checkDirectJump(p.wxid);
                                } else {
                                    condition1 = this.checkDirectJump(p.boxId);
                                }
                                let condition2 = (p.link && '' != p.link);
                                if (condition1 || condition2) {
                                    if (0 == p.position) {
                                        arrL.push(p);
                                    } else {
                                        arrR.push(p);
                                    }
                                }
                            }
                            let array = [arrL, arrR];
                            pOnlineParamData.setMoreGameData(array);
                        }
                    }
                    let pOfficialAccountObj = values[ONLINE_PARAMETERS_XYID.OfficialAccount + ''];
                    if (pOfficialAccountObj && ONLINE_PARAMETERS_ERROR_CODE.Success == pOfficialAccountObj.code) {
                        let arr = pOfficialAccountObj.adverts;
                        if (arr && arr instanceof Array) {
                            for (let p of arr)
                                p.link && (p.link = toppath + p.link);
                            pOnlineParamData.setWXOfficialAccountData(arr);
                        }
                    }
                    let pWeChatShareObj = values[ONLINE_PARAMETERS_XYID.WeChatShare + ''];
                    if (pWeChatShareObj && ONLINE_PARAMETERS_ERROR_CODE.Success == pWeChatShareObj.code) {
                        let arr = pWeChatShareObj.value;
                        if (arr && arr instanceof Array) {
                            for (let p of arr)
                                p.shareLink && (p.shareLink = toppath + p.shareLink);
                            pOnlineParamData.setWXShareData(arr);
                        }
                        let idx = pOnlineParamData.getWXShareDataIdx();
                        if (null == idx || '' === idx)
                            idx = 0;
                        else
                            idx += 1;
                        pOnlineParamData.setWXShareDataIdx(idx);
                    }

                    let pWeChatAdsObj = values[ONLINE_PARAMETERS_XYID.WeChatID + ''];
                    if (pWeChatAdsObj && ONLINE_PARAMETERS_ERROR_CODE.Success == pWeChatAdsObj.code) {
                        let obj = pWeChatAdsObj.value;
                        if (obj && obj instanceof Object) {
                            pOnlineParamData.setbanner(obj.banner);
                            pOnlineParamData.setvideo(obj.video);
                        }
                    }
                    callFunc && callFunc(pOnlineParamData);
                } else {
                    callFunc && callFunc(null, obj.code);
                }
            });
        } else {
            if (pOnlineParamData) {
                let idx = pOnlineParamData.getWXShareDataIdx();
                if (null == idx || '' === idx)
                    idx = 0;
                else
                    idx += 1;
                pOnlineParamData.setWXShareDataIdx(idx);
            }
        }
    }

    checkDirectJump(wxId) {
        if (undefined == wxId || wxId == '') return false;
        let list = this._pSdkConfig.wxJumpAppIdList;
        for (let p of list) {
            if (p == wxId)
                return true;
        }
        return false;
    }*/
}


// export default HttpMsgCenter;