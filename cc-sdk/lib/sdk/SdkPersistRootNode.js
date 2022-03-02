
class SdkPersistRootNode extends cc.Node {
    constructor() {
        super('SdkPersistRootNode');
        this.pBaseComponent = this.addComponent(cc.Component);
        this.pBaseComponent.update = (dt) => {
            this.onUpdate(dt);
        };
        this.pBaseComponent.onDestroy = () => {
            Log.l('SdkPersistRootNode BaseComponent onDestroy');
            this.pOnDestroy && this.pOnDestroy();
        };
    }
    onExitFunc (callFunc){
        this.pOnDestroy = callFunc;
    }
    onUpdateFunc (callFunc){
        this.pOnUpdateFunc = callFunc;
    }
    onUpdate(dt) {
        this.pOnUpdateFunc && this.pOnUpdateFunc(dt);
    }
}