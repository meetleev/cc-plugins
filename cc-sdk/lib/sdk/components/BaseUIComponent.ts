import {_decorator, Component, Node} from 'cc';

const {ccclass, property} = _decorator;

@ccclass('BaseUIComponent')
export class BaseUIComponent extends Component {

    protected __preload?(): void;

    protected onLoad?(): void;

    protected onEnable?(): void;

    protected start?(): void;

    protected update?(dt: number): void;

    protected lateUpdate?(dt: number): void;

    protected onDisable?(): void;

    protected onDestroy?(): void;

    // editor
    public onFocusInEditor?(): void;

    public onLostFocusInEditor?(): void;

    public resetInEditor?(): void;

    protected onRestore?(): void;

    popIn?(): void;

    popOut?(): void;
}