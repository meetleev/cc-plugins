class PlatformUtils {

    static isWeiXin() {
        return cc.sys.platform == cc.sys.WECHAT_GAME;
    }

    static isQQ() {
        return cc.sys.platform == cc.sys.QQ_PLAY;
    }

    static isFB() {
        return "undefined" != typeof FBInstant;
    }

    static isIOS() {
        return cc.sys.os == cc.sys.OS_IOS;
    }

    static isDesktop() {
        return cc.sys.platform == cc.sys.DESKTOP_BROWSER;
    }

    static isWeb() {
        return cc.sys.isBrowser && "undefined" == typeof FBInstant;
    }

    static is3DTouchCompat() {
        return cc.sys.os === cc.sys.OS_IOS;
    }
}
// export default PlatformUtils;
SDK_NAME.PlatformUtils = PlatformUtils;
