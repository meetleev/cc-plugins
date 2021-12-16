const FB_NAV_HEIGHT = 96;

class ScreenUtil {
    init () {
        this._mMobileFb = false;
        this._mWinHeight = cc.winSize.height;
        this._mWinWidth = cc.winSize.width;
        this._mScreenRatio = this._mWinHeight / this._mWinWidth;
        if (PlatformUtils.isFB() && !PlatformUtils.isDesktop() && window.screen && window.screen.height && window.screen.width) {
            this._mScreenRatio = window.screen.height / window.screen.width;
        }
        if (this._mMobileFb && PlatformUtils.isDesktop()) {
            this._mScreenRatio = 1.06 * this._mScreenRatio;
        }
        if (this.isFBNavBarOverlay()) {
            this._mWinHeight -= FB_NAV_HEIGHT;
            Log.w("[ScreenUtil] Navagation bar is overlay");
        }
    }

    // static getInstance() {
    //     if (null == this.instance)
    //         this.instance = new ScreenUtil();
    //     return this.instance;
    // }

    isQuanMian() {
        return 1.789 < this._mScreenRatio && this._mScreenRatio < 19 / 9;
    }

    isLiuHai() {
        return this._mScreenRatio >= 19 / 9;
    }

    isPuTong() {
        return this._mScreenRatio <= 1.789;
    }

    isFBNavBarOverlay() {
        if (!PlatformUtils.isFB()) {
            return false;
        }
        let a = Math.floor(this._mWinWidth / window.screen.width * window.screen.height - this._mWinHeight);
        if (this.isQuanMian() || this.isPuTong()) {
            return 0 == a;
        }
        return a < FB_NAV_HEIGHT;
    }

    getOffset() {
        if (this.isFBNavBarOverlay()) {
            return FB_NAV_HEIGHT;
        }
        return 0;
    }

    toLeftByPercent(pNode, per = 0) {
        if (!pNode || (pNode && !(pNode instanceof cc.Node))) {
            Log.w('[ScreenUtil] toLeftByPercent pNode error');
            return;
        }
        let pNodeWidget = pNode.getComponent(cc.Widget) || pNode.addComponent(cc.Widget);
        pNodeWidget.isAlignLeft = true;
        pNodeWidget.left = per * this._mWinWidth / 100;
    }

    toLeftByPx(pNode, px = 0, bRelativeOffset = true) {
        if (!pNode || (pNode && !(pNode instanceof cc.Node))) {
            Log.w('[ScreenUtil] toLeftByPx pNode error');
            return;
        }
        let pNodeWidget = pNode.getComponent(cc.Widget);
        if (!pNodeWidget) {
            pNodeWidget = pNode.addComponent(cc.Widget);
            bRelativeOffset && Log.w('[ScreenUtil] toLeftByPx do not effect on relative, please you add widegt on editor');
        }
        pNodeWidget.isAlignLeft = true;
        if (bRelativeOffset)
            pNodeWidget.left += px;
        else
            pNodeWidget.left = px;
    }

    toRightByPercent(pNode, per = 0) {
        if (!pNode || (pNode && !(pNode instanceof cc.Node))) {
            Log.w('[ScreenUtil] toRightByPercent pNode error');
            return;
        }
        let pNodeWidget = pNode.getComponent(cc.Widget) || pNode.addComponent(cc.Widget);
        pNodeWidget.isAlignRight = true;
        pNodeWidget.right = per * this._mWinWidth / 100;
    }

    toRightByPx(pNode, px = 0, bRelativeOffset = true) {
        if (!pNode || (pNode && !(pNode instanceof cc.Node))) {
            Log.w('[ScreenUtil] toRightByPx pNode error')
            return;
        }
        let pNodeWidget = pNode.getComponent(cc.Widget);
        if (!pNodeWidget) {
            pNodeWidget = pNode.addComponent(cc.Widget);
            bRelativeOffset && Log.w('[ScreenUtil] toRightByPx do not effect on relative, please you add widegt on editor');
        }
        pNodeWidget.isAlignRight = true;
        if (bRelativeOffset)
            pNodeWidget.right += px;
        else
            pNodeWidget.right = px;
    }

    toTopByPercent(pNode, per = 0) {
        if (!pNode || (pNode && !(pNode instanceof cc.Node))) {
            Log.w('[ScreenUtil] toTopByPercent pNode error');
            return;
        }
        let pNodeWidget = pNode.getComponent(cc.Widget) || pNode.addComponent(cc.Widget);
        pNodeWidget.isAlignTop = true;
        pNodeWidget.top = per * this._mWinHeight / 100;
    }

    toTopByPx(pNode, px = 0, bRelativeOffset = true) {
        if (!pNode || (pNode && !(pNode instanceof cc.Node))) {
            Log.w('[ScreenUtil] toTopByPx pNode error');
            return;
        }
        let pNodeWidget = pNode.getComponent(cc.Widget);
        if (!pNodeWidget) {
            pNodeWidget = pNode.addComponent(cc.Widget);
            bRelativeOffset && Log.w('[ScreenUtil] toTopByPx do not effect on relative, please you add widegt on editor');
        }
        pNodeWidget.isAlignTop = true;
        if (bRelativeOffset)
            pNodeWidget.top += px;
        else
            pNodeWidget.top = px;
    }

    updateWidget(pNode) {
        if (!pNode || (pNode && !(pNode instanceof cc.Node))) {
            Log.w('[ScreenUtil] updateWidget pNode error');
            return;
        }
        let pNodeWidget = pNode.getComponent(cc.Widget);
        if (!pNodeWidget) return;
        pNodeWidget.updateAlignment();
    }

    toFixTopByPx(pNode, px = 0) {
        if (!pNode || (pNode && !(pNode instanceof cc.Node))) {
            Log.w('[ScreenUtil] toFixTopByPx pNode error');
            return;
        }
        let pNodeWidget = pNode.getComponent(cc.Widget) || pNode.addComponent(cc.Widget);
        pNodeWidget.isAlignTop = true;
        pNodeWidget.top = this.getOffset() + px;
    }

    toBottomByPx(pNode, px = 0, bRelativeOffset = true) {
        if (!pNode || (pNode && !(pNode instanceof cc.Node))) {
            Log.w('[ScreenUtil] toBottomByPx pNode error');
            return;
        }
        let pNodeWidget = pNode.getComponent(cc.Widget);
        if (!pNodeWidget) {
            pNodeWidget = pNode.addComponent(cc.Widget);
            bRelativeOffset && Log.w('[ScreenUtil] toBottomByPx do not effect on relative, please you add widegt on editor');
        }
        pNodeWidget.isAlignBottom = true;
        if (bRelativeOffset)
            pNodeWidget.bottom += px;
        else
            pNodeWidget.bottom = px;
    }

    toBottomByPercent(pNode, per = 0) {
        if (!pNode || (pNode && !(pNode instanceof cc.Node))) {
            Log.w('[ScreenUtil] toBottomByPercent pNode error');
            return;
        }
        let pNodeWidget = pNode.getComponent(cc.Widget) || pNode.addComponent(cc.Widget);
        pNodeWidget.isAlignBottom = true;
        pNodeWidget.bottom = per * this._mWinHeight / 100;
    }


    toTopWithOffset(pNode, per = 0, px = 0) {
        if (!pNode || (pNode && !(pNode instanceof cc.Node))) {
            Log.w('[ScreenUtil] toBottomByPercent pNode error');
            return;
        }
        let pNodeWidget = pNode.getComponent(cc.Widget) || pNode.addComponent(cc.Widget);
        pNodeWidget.isAlignTop = true;
        pNodeWidget.top = per * this._mWinHeight / 100 + px;
    }
}
SDK_NAME.screenUtil = new ScreenUtil();