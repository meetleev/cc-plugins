const MD5Key = '60cff75d0d1e4d548d9f4bca35916b21';
let callFuncList = {};
// let PostHttpData = function (url, data, callFunc) {
//     callFuncList[url] = callFunc;
//     let xhr = new XMLHttpRequest();
//     xhr.tag = url;
//     xhr.open("POST", url);
//     // xhr.setRequestHeader('content-type', 'application/json');
//     xhr.onreadystatechange = function () {
//         if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 207)) {
//             let response = xhr.responseText;
//             let data = CryptoJS.enc.Base64.parse(response).toString(CryptoJS.enc.Utf8);
//             let obj = null;
//             try {
//                 Log.l('Post response url data', xhr.tag, data);
//                 obj = JSON.parse(data || '{}');
//             } catch (e) {
//             }
//             let cf = callFuncList[url];
//             if (cf) {
//                 cf(obj);
//                 delete callFuncList[url];
//             }
//         }
//     };
//     xhr.send(data);
// };
let GetHttpData = function (url, callFunc) {
    callFuncList[url] = callFunc;
    let xhr = new XMLHttpRequest();
    xhr.tag = url;
    xhr.open("GET", url);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 207)) {
            let response = xhr.responseText;
            let data = Base64.decode(response);
            Log.l('Get response url data', xhr.tag, data);
            let obj = JSON.parse(data);
            let cf = callFuncList[url];
            if (cf) {
                cf(obj);
                delete callFuncList[url];
            }
        }
    };
    xhr.send();
};

/*
function GetWeChatOnlineParameters(wechatgameid, uid, appId, version, callFunc) {
    let url = 'https://wxad.jfydgame.com/jfyd_version_manager/wechatparam';
    let content = {wechatgameid: wechatgameid, uid: uid, appId: appId, version: version};
    let base64Content = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(JSON.stringify(content)));
    let md5Sign = CryptoJS.MD5(base64Content + MD5Key);
    PostHttpData(url, 'content=' + base64Content + '&sign=' + md5Sign, callFunc);
}

function GetWeChatMoreGameParameters(uid, appId, callFunc) {
    let url = 'https://wxad.jfydgame.com/jfyd_advert_wechat/moregame';
    let content = {uid: uid, appId: appId,};
    let base64Content = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(JSON.stringify(content)));
    let md5Sign = CryptoJS.MD5(base64Content + MD5Key);
    PostHttpData(url, 'content=' + base64Content + '&sign=' + md5Sign, callFunc);
}

function GetWXOfficialAccount(uid, appId, callFunc) {
    let url = 'https://wxad.jfydgame.com/jfyd_advert_wechat/expand/officialaccount';
    let content = {uid: uid, appId: appId,};
    let base64Content = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(JSON.stringify(content)));
    let md5Sign = CryptoJS.MD5(base64Content + MD5Key);
    PostHttpData(url, 'content=' + base64Content + '&sign=' + md5Sign, callFunc);
}

function GetWXShareParameters(wechatgameid, appId, version, callFunc) {
    let url = 'https://wxad.jfydgame.com/jfyd_version_manager/wechatshare';
    let content = {wechatgameid: wechatgameid, appId: appId, version: version};
    let base64Content = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(JSON.stringify(content)));
    let md5Sign = CryptoJS.MD5(base64Content + MD5Key);
    PostHttpData(url, 'content=' + base64Content + '&sign=' + md5Sign, callFunc);
}

function GetWXInGameAdvertParameters(uid, appId, callFunc) {
    let url = 'https://wxad.jfydgame.com/jfyd_advert_wechat/expand/ingameadvert';
    let content = {uid: uid, appId: appId,};
    let base64Content = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(JSON.stringify(content)));
    let md5Sign = CryptoJS.MD5(base64Content + MD5Key);
    PostHttpData(url, 'content=' + base64Content + '&sign=' + md5Sign, callFunc);
}
*/
function GetWeChatHttpCfg(wechatgameid, appId, version, functions = [0], callFunc) {
    let url = 'https://wxad.jfydgame.com/jfyd_advert_wechat/';
    let content = {wechatgameid: wechatgameid, appId: appId, version: version, functions: functions.join(',')};
    let base64Content = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(JSON.stringify(content)));
    let md5Sign = CryptoJS.MD5(base64Content + MD5Key);
    GetHttpData(url + '?content=' + base64Content + '&sign=' + md5Sign, callFunc);
}

function GetWeChatBoxHttpCfg(uid, boxid, from, callFunc) {
    let url = 'https://wxhz.jfydgame.com/jfyd_advert_wechat/wxbox';
    let content = {wxid: boxid, from: -1};
    let base64Content = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(JSON.stringify(content)));
    let md5Sign = CryptoJS.MD5(base64Content + MD5Key);
    GetHttpData(url + '?content=' + base64Content + '&sign=' + md5Sign, callFunc);
}

function GetHttpDataCommon(url = '', content = {}, sSignatureToken, callFunc) {
    Log.l("Request Data:", content);
    let base64Content = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(JSON.stringify(content)));
    let md5Sign = CryptoJS.MD5(base64Content + MD5Key);

    let result = 'sign=' + md5Sign + '&content=' + base64Content + (sSignatureToken ? `&p=${sSignatureToken}` : '');
    let reqData = url + '?sVersion=1024&pType=2&' + result;
    Log.l("Request:", reqData);
    GetHttpData(reqData, callFunc);
}

function GenerateToken(loginToken, privateKey) {
    if (loginToken && privateKey)
        return CryptoJS.MD5(loginToken + privateKey).toString();
    return null;
}

// function PostHttpDataCommon(url, content, loginToken, privateKey, callFunc) {
//     Log.l("Request Data:", content);
//     let base64Content = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(JSON.stringify(content)));
//     let md5Sign = CryptoJS.MD5(base64Content + MD5Key);
//
//     let result = {};
//     if (loginToken) {
//         let token = CryptoJS.MD5(loginToken + privateKey);
//         result = {sign: md5Sign.toString(), content: base64Content, p: token};
//     } else {
//         result = {sign: md5Sign.toString(), content: base64Content};
//     }
//     let reqUrl = url + '?sVersion=1024&pType=2';
//     Log.l("Request:", reqUrl, JSON.stringify(result));
//     PostHttpData(reqUrl, JSON.stringify(result), callFunc);
// }

let ONLINE_PARAMETERS_XYID = {
    All: 0, // 所有
    InGameAdvert: 1,	//	微信互推广告-开屏广告
    OfficialAccount: 2,	//	微信互推广告-公众号
    MoreGame: 3,	//	更多游戏
    WeChatParam: 4,	//	微信在线参数
    WeChatID: 5,	///	微信游戏参数(广告位)
    WeChatShare: 6	//	微信分享管理
};

let ONLINE_PARAMETERS_ERROR_CODE = {
    Success: 101, // 成功
    SignFailed: 201, // 201:验签失败
    ParamErr: 202, // 202:参数有误
    LIKE_FAIL: 203,// 点赞失败
    TAP_EVENT_FAIL: 204,// 记录点击事件失败
    UID_FAIL: 205,// 获取uid失败
};

// export default {ONLINE_PARAMETERS_XYID, ONLINE_PARAMETERS_ERROR_CODE, GetWeChatHttpCfg, GetWeChatBoxHttpCfg, PostHttpDataCommon};