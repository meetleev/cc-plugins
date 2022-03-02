import {Canvas, Director, director, instantiate, Node, Prefab, Size, UITransform, view} from "cc";
import {resMgr} from "./ResMgr";

export type UIType = number;

export class UIMgr {
    private uiTypeNodeMap: Map<UIType, Node> = new Map<UIType, Node>();
    private uiTypes: Set<UIType> = new Set<UIType>();
    private static instance: UIMgr;

    static get Instance() {
        if (null == UIMgr.instance)
            UIMgr.instance = new UIMgr();
        return UIMgr.instance;
    }

    private constructor() {
        director.on(Director.EVENT_BEFORE_SCENE_LAUNCH, () => {
            this.uiRoot = undefined;
            this.canvas = undefined;
            this.uiTypes.clear();
            this.uiTypeNodeMap.clear();
        });
    }

    uiRoot?: Node;


    canvas?: Node;

    getCanvas() {
        let scene = director.getScene();
        if (scene) {
            let children = scene.children;
            for (let i = 0, len = children.length; i < len; i++) {
                let child = children[i];
                let canvas = child.getComponent(Canvas);
                if (canvas) {
                    this.canvas = canvas.node;
                    return child;
                }
            }
        }
        return null;
    }

    private _winSize: Size = Size.ZERO;

    get winSize() {
        if (this._winSize.equals(Size.ZERO))
            this._winSize = view.getVisibleSize();
        return this._winSize;
    }

    private createUI(uiType: UIType, uiResFilePath: string): Promise<Node> {
        return new Promise((resolve, reject) => {
            resMgr.loadPrefab(`ui/${uiResFilePath}`).then((prefab: Prefab) => {
                let pNode = instantiate(prefab);
                let parent = null != this.uiRoot ? this.uiRoot : this.getCanvas();
                (null != parent ? parent : director.getScene())?.addChild(pNode);
                if (null == pNode._uiProps.uiTransformComp)
                    pNode._uiProps.uiTransformComp = pNode.addComponent(UITransform);
                pNode._uiProps.uiTransformComp.contentSize = view.getVisibleSize();
                this.uiTypeNodeMap.set(uiType, pNode);
                resolve(pNode);

            }).catch((err: Error) => {
                reject(err);
            });
        });
    }

    private getNode(uiType: UIType): Promise<Node> {
        return new Promise((resolve, reject) => {
            if (this.uiTypeNodeMap.has(uiType)) {
                resolve(this.uiTypeNodeMap.get(uiType) as Node);
            } else {
                reject('no uiNode or uiNode loading!');
            }
        });
    }

    show(uiType: UIType, uiResFilePath?: string | Node) {
        if (!this.uiTypes.has(uiType)) {
            this.uiTypes.add(uiType);
            if (undefined != uiResFilePath) {
                if ('string' == typeof uiResFilePath)
                    return this.createUI(uiType, uiResFilePath);
                else {
                    this.uiTypeNodeMap.set(uiType, uiResFilePath);
                    return this.getNode(uiType);
                }
            }
        }
        return this.getNode(uiType);
    }

    hide(uiType: UIType): Promise<Node> {
        return new Promise((resolve, reject) => {
            if (this.uiTypes.has(uiType)) {
                if (this.uiTypeNodeMap.has(uiType)) {
                    resolve(this.uiTypeNodeMap.get(uiType) as Node);
                } else {
                    reject('no uiNode or uiNode loading!');
                }
            } else reject('no uiType...');
        });
    }
}