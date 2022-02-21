// import SysFunc from './SysFunc';
const UUID = 'SDK_NAME@uuid_game';

function getDeviceId() {
    let uuid = cc.sys.localStorage.getItem(UUID);
    if (!uuid) {
        let d = new Date().getTime();
        uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        cc.sys.localStorage.setItem(UUID, uuid);
    }
    return uuid;
}

function SysFuncCommon(opt) {
    let classSysFunc = SysFunc;
    if (cc.sys.platform === cc.sys.WECHAT_GAME) {
        classSysFunc = WeChatSysFunc;
    } else if (cc.sys.platform === cc.sys.OPPO_GAME) {
        classSysFunc = OppoSysFunc;
    } else if (cc.sys.platform === cc.sys.VIVO_GAME) {
        classSysFunc = VivoSysFunc;
    } else if (cc.sys.platform === cc.sys.BAIDU_GAME) {
        classSysFunc = BaiduSysFunc;
    } else {
        classSysFunc = SysFunc;
    }
    if (undefined == classSysFunc.prototype.getDeviceId)
        classSysFunc.prototype.getDeviceId = getDeviceId;
    // if (undefined == classSysFunc.prototype.getCity)
    //     classSysFunc.prototype.getCity = getCity;
    return new classSysFunc(opt);
}

// export {SysFuncCommon};