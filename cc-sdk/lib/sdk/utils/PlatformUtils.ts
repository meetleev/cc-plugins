import {sys} from "cc";

export class PlatformUtils {

    static isWeiXin() {
        return sys.platform === sys.Platform.WECHAT_GAME;
    }

    static isFB() {
        return "undefined" != typeof FBInstant;
    }

    static isIOS() {
        return sys.os === sys.OS.IOS;
    }

    static isDesktop() {
        return sys.platform === sys.Platform.DESKTOP_BROWSER;
    }

    static isWeb() {
        return sys.isBrowser && "undefined" == typeof FBInstant;
    }

    static is3DTouchCompat() {
        return PlatformUtils.isIOS();
    }
}
