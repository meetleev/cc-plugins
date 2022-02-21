import {Node, Size, view, Widget} from 'cc';
import {Log} from "../../Log";
import {PlatformUtils} from "./PlatformUtils";

const FB_NAV_HEIGHT = 96;


export class ScreenUtils {
    private static instance: ScreenUtils;
    private _mScreenRatio: number = 0;
    private _viewSize: Size = Size.ZERO;

    get viewSize(): Size {
        return this._viewSize;
    }

    static get Instance() {
        if (null == ScreenUtils.instance)
            ScreenUtils.instance = new ScreenUtils();
        return ScreenUtils.instance;
    }

    private constructor() {
        this.init();
    }

    init() {
        this._viewSize = view.getVisibleSize();
        this._mScreenRatio = this._viewSize.height / this._viewSize.width;
        if (PlatformUtils.isFB() && !PlatformUtils.isDesktop() && window.screen && window.screen.height && window.screen.width) {
            this._mScreenRatio = window.screen.height / window.screen.width;
        }

        if (this.isFBNavBarOverlay()) {
            this._viewSize.set(this._viewSize.width, this._viewSize.height - FB_NAV_HEIGHT);
            Log.w("[ScreenUtils] Navigation bar is overlay");
        }
    }


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
        if (!PlatformUtils.isFB())
            return false;
        let a = Math.floor(this.viewSize.width / window.screen.width * window.screen.height - this.viewSize.height);
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

    toLeftByPer(pNode: Node, per: number = 0) {
        if (null == pNode)
            return Log.w('[ScreenUtils] toLeftByPer pNode error');

        let pNodeWidget = pNode.getComponent(Widget) || pNode.addComponent(Widget);
        pNodeWidget.isAlignLeft = true;
        pNodeWidget.left = per * this.viewSize.width / 100;
    }

    toLeftByPx(pNode: Node, px: number = 0, bRelativeOffset: boolean = true) {
        if (null == pNode)
            return Log.w('[ScreenUtils] toLeftByPx pNode error');
        let pNodeWidget = pNode.getComponent(Widget);
        if (!pNodeWidget) {
            pNodeWidget = pNode.addComponent(Widget);
            bRelativeOffset && Log.w('[ScreenUtils] toLeftByPx do not effect on relative, please you add widget on editor');
        }
        pNodeWidget.isAlignLeft = true;
        if (bRelativeOffset)
            pNodeWidget.left += px;
        else
            pNodeWidget.left = px;
    }

    toRightByPer(pNode: Node, per: number = 0) {
        if (null == pNode)
            return Log.w('[ScreenUtils] toRightByPer pNode error');
        let pNodeWidget = pNode.getComponent(Widget) || pNode.addComponent(Widget);
        pNodeWidget.isAlignRight = true;
        pNodeWidget.right = per * this.viewSize.width / 100;
    }

    toRightByPx(pNode: Node, px: number = 0, bRelativeOffset: boolean = true) {
        if (null == pNode)
            return Log.w('[ScreenUtils] toRightByPx pNode error');

        let pNodeWidget = pNode.getComponent(Widget);
        if (!pNodeWidget) {
            pNodeWidget = pNode.addComponent(Widget);
            bRelativeOffset && Log.w('[ScreenUtils] toRightByPx do not effect on relative, please you add widget on editor');
        }
        pNodeWidget.isAlignRight = true;
        if (bRelativeOffset)
            pNodeWidget.right += px;
        else
            pNodeWidget.right = px;
    }

    toTopByPer(pNode: Node, per: number = 0) {
        if (null == pNode)
            return Log.w('[ScreenUtils] toTopByPer pNode error');

        let pNodeWidget = pNode.getComponent(Widget) || pNode.addComponent(Widget);
        pNodeWidget.isAlignTop = true;
        pNodeWidget.top = per * this.viewSize.height / 100;
    }

    toTopByPx(pNode: Node, px: number = 0, bRelativeOffset: boolean = true) {
        if (null == pNode)
            return Log.w('[ScreenUtils] toTopByPx pNode error');

        let pNodeWidget = pNode.getComponent(Widget);
        if (!pNodeWidget) {
            pNodeWidget = pNode.addComponent(Widget);
            bRelativeOffset && Log.w('[ScreenUtils] toTopByPx do not effect on relative, please you add widget on editor');
        }
        pNodeWidget.isAlignTop = true;
        if (bRelativeOffset)
            pNodeWidget.top += px;
        else
            pNodeWidget.top = px;
    }

    updateWidget(pNode: Node) {
        if (null == pNode)
            return Log.w('[ScreenUtils] updateWidget pNode error');

        let pNodeWidget = pNode.getComponent(Widget);
        if (!pNodeWidget) return;
        pNodeWidget.updateAlignment();
    }

    toFixTopByPx(pNode: Node, px: number = 0) {
        if (null == pNode)
            return Log.w('[ScreenUtils] toFixTopByPx pNode error');

        let pNodeWidget = pNode.getComponent(Widget) || pNode.addComponent(Widget);
        pNodeWidget.isAlignTop = true;
        pNodeWidget.top = this.getOffset() + px;
    }

    toBottomByPx(pNode: Node, px: number = 0, bRelativeOffset: boolean = true) {
        if (null == pNode)
            return Log.w('[ScreenUtils] toBottomByPx pNode error');

        let pNodeWidget = pNode.getComponent(Widget);
        if (!pNodeWidget) {
            pNodeWidget = pNode.addComponent(Widget);
            bRelativeOffset && Log.w('[ScreenUtils] toBottomByPx do not effect on relative, please you add widget on editor');
        }
        pNodeWidget.isAlignBottom = true;
        if (bRelativeOffset)
            pNodeWidget.bottom += px;
        else
            pNodeWidget.bottom = px;
    }

    toBottomByPer(pNode: Node, per: number = 0) {
        if (null == pNode)
            return Log.w('[ScreenUtils] toBottomByPer pNode error');

        let pNodeWidget = pNode.getComponent(Widget) || pNode.addComponent(Widget);
        pNodeWidget.isAlignBottom = true;
        pNodeWidget.bottom = per * this.viewSize.height / 100;
    }


    toTopWithOffset(pNode: Node, per: number = 0, px: number = 0) {
        if (null == pNode)
            return Log.w('[ScreenUtils] toTopWithOffset pNode error');
        let pNodeWidget = pNode.getComponent(Widget) || pNode.addComponent(Widget);
        pNodeWidget.isAlignTop = true;
        pNodeWidget.top = per * this.viewSize.height / 100 + px;
    }
}