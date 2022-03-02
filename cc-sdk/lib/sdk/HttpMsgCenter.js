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
}


// export default HttpMsgCenter;