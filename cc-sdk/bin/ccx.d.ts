declare module ccx {
    export const resMgr: __private._lib_sdk_ResMgr__ResMgr;
    export class Log {
        static l(...args: any[]): void;
        static i(...args: any[]): void;
        static w(...args: any[]): void;
        static e(...args: any[]): void;
        static setDebug(debug: any): void;
    }
    export class EventManager {
        /**
         * Listen on the given `event` with `fn`.
         *
         * @param {Object} target
         * @param {Function} fn
         * @param {String} event
         * @api public
         */
        on(target: object, fn: Function, event: string): void;
        /**
         * Emit `event` with the given args.
         *
         * @param {String} event
         * @param args
         */
        emit(event: string, ...args: any[]): void;
        /**
         * Remove the given callback for `eventName` or all
         * registered callbacks.
         * @param {Object} target
         * @param {String} event
         * @api public
         */
        off(target: object, event: string): void;
        /**
         * Remove the given callback for all
         * registered callbacks.
         *
         * @param {Object} target
         * @api public
         */
        removeAll(target: object): void;
    }
    export const eventManager: EventManager;
    export class AudioMgr {
        get musicEnabled(): boolean;
        set musicEnabled(value: boolean);
        get effectEnabled(): boolean;
        set effectEnabled(value: boolean);
        get adPlaying(): boolean;
        set adPlaying(value: boolean);
        static get Instance(): AudioMgr;
        playBGMusic(audioClip: string | cc.AudioClip, loop?: boolean, volume?: number): void;
        playMusic(audioClip: string | cc.AudioClip, loop?: boolean, volume?: number): void;
        playEffect(audioClip: string | cc.AudioClip, volume?: number): void;
        pauseAllMusic(): void;
        pauseMusic(audioClip: string, bFadeOut?: boolean): void;
        resumeBGMusic(): void;
        resumeAllMusic(): void;
        destroyMusic(audioClip: string): void;
        destroyMusicExceptBg(): void;
    }
    export type UIType = number;
    export class UIMgr {
        static get Instance(): UIMgr;
        uiRoot?: cc.Node;
        canvas?: cc.Node;
        getCanvas(): cc.Scene | null;
        get winSize(): cc.math.Size;
        show(uiType: UIType, uiResFilePath?: string | cc.Node): Promise<cc.Node>;
        hide(uiType: UIType): Promise<cc.Node>;
    }
    export type ObjectType = number;
    export class ObjectPoolsMgr {
        static get Instance(): ObjectPoolsMgr;
        getObjectFromPool(objectType: ObjectType): cc.Node | null | undefined;
        initObjectToPool(objectType: ObjectType, obj: cc.Node | cc.Prefab, count: number): void;
        putObjectToPool(objectType: ObjectType, obj: cc.Node): void;
        clearObjectPool(objectType: ObjectType): void;
    }
    export class ScreenUtils {
        get viewSize(): cc.math.Size;
        static get Instance(): ScreenUtils;
        init(): void;
        isQuanMian(): boolean;
        isLiuHai(): boolean;
        isPuTong(): boolean;
        isFBNavBarOverlay(): boolean;
        getOffset(): 0 | 96;
        toLeftByPer(pNode: cc.Node, per?: number): void;
        toLeftByPx(pNode: cc.Node, px?: number, bRelativeOffset?: boolean): void;
        toRightByPer(pNode: cc.Node, per?: number): void;
        toRightByPx(pNode: cc.Node, px?: number, bRelativeOffset?: boolean): void;
        toTopByPer(pNode: cc.Node, per?: number): void;
        toTopByPx(pNode: cc.Node, px?: number, bRelativeOffset?: boolean): void;
        updateWidget(pNode: cc.Node): void;
        toFixTopByPx(pNode: cc.Node, px?: number): void;
        toBottomByPx(pNode: cc.Node, px?: number, bRelativeOffset?: boolean): void;
        toBottomByPer(pNode: cc.Node, per?: number): void;
        toTopWithOffset(pNode: cc.Node, per?: number, px?: number): void;
    }
    export class PlatformUtils {
        static isWeiXin(): boolean;
        static isFB(): boolean;
        static isIOS(): boolean;
        static isDesktop(): boolean;
        static isWeb(): boolean;
        static is3DTouchCompat(): boolean;
    }
    export namespace __private {
        export class _lib_sdk_ResMgr__ResMgr {
            constructor();
            /**
             * Load the tiledMapAsset asset within this bundle by the path which is relative to bundle's path
             *
             * @param {String} paths
             * @param {String} topDir
             * @api public
             * @example
             * // load the tiledMapAsset (${project}/assets/resources/tiledMaps/map.tmx) from resources
             * ccx.resMgr.loadTiledMap('map').then( (texture) => console.log(texture) ).catch( (err) => console.log(err) );
             */
            loadTiledMap(paths: string, topDir?: string): Promise<cc.TiledMapAsset>;
            /**
             * Load the audioClip asset within this bundle by the path which is relative to bundle's path
             *
             * @param {String} paths
             * @param {String} topDir
             * @api public
             * @example
             * // load the audioClip (${project}/assets/resources/audios/audio.mp3) from resources
             * ccx.resMgr.loadAudio('audio').then( (audioClip) => console.log(audioClip) ).catch( (err) => console.log(err) );
             */
            loadAudio(paths: string, topDir?: string): Promise<cc.AudioClip>;
            /**
             * Load the prefab asset within this bundle by the path which is relative to bundle's path
             *
             * @param {String} paths
             * @param {String} topDir
             * @api public
             * @example
             * // load the prefab (${project}/assets/resources/prefabs/ui.prefab) from resources
             * ccx.resMgr.loadPrefab('ui').then( (prefab) => console.log(prefab) ).catch( (err) => console.log(err) );
             */
            loadPrefab(paths: string, topDir?: string): Promise<cc.Prefab>;
            /**
             * Load the texture2D asset within this bundle by the path which is relative to bundle's path
             *
             * @param {String} paths
             * @param {String} topDir
             * @api public
             * @example
             * // load the texture2D (${project}/assets/resources/textures/bg.png) from resources
             * ccx.resMgr.loadTexture('bg').then( (texture2D) => console.log(texture2D) ).catch( (err) => console.log(err) );
             */
            loadTexture(paths: string, topDir?: string): Promise<cc.Texture2D>;
            /**
             * Load the spriteFrame asset within this bundle by the path which is relative to bundle's path
             *
             * @param {String} paths
             * @param {String} topDir
             * @api public
             * @example
             * // load the spriteFrame (${project}/assets/resources/textures/bg.png) from resources
             * ccx.resMgr.loadSpriteFrame('bg').then( (spriteFrame) => console.log(spriteFrame) ).catch( (err) => console.log(err) );
             */
            loadSpriteFrame(paths: string, topDir?: string): Promise<cc.SpriteFrame>;
            /**
             * Load the material asset within this bundle by the path which is relative to bundle's path
             *
             * @param {String} paths
             * @param {String} topDir
             * @api public
             * @example
             * // load the material (${project}/assets/resources/materials/bg.mat) from resources
             * ccx.resMgr.loadMaterial('bg').then( (material) => console.log(material) ).catch( (err) => console.log(err) );
             */
            loadMaterial(paths: string, topDir?: string): Promise<cc.Material>;
            /**
             * Load the spine asset within this bundle by the path which is relative to bundle's path
             *
             * @param {String} paths
             * @param {String} topDir
             * @api public
             * @example
             * // load the spine (${project}/assets/resources/spines/bg.json) from resources
             * ccx.resMgr.loadSkeletonData('bg').then( (spine) => console.log(spine) ).catch( (err) => console.log(err) );
             */
            loadSkeletonData(paths: string, topDir?: string): Promise<cc.sp.SkeletonData>;
            /**
             * Load the asset within this bundle by the path which is relative to bundle's path
             *
             * @param {Asset} type
             * @param {String} paths
             * @param {boolean} bLogError
             * @api public
             * @example
             * // load the material (${project}/assets/resources/texture2D/bg.png) from resources
             * ccx.resMgr.load(Texture2D, 'texture2D/bg').then( (texture) => console.log(texture) ).catch( (err) => console.log(err) );
             */
            load<T extends cc.Asset>(type: {
                new (...args: any[]): T;
            }, paths: string, bLogError?: boolean): Promise<T>;
        }
    }
    export {};
}
