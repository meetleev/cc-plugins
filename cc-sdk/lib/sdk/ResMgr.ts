import {
    Asset,
    AudioClip,
    ImageAsset,
    Material,
    Prefab,
    resources,
    sp,
    SpriteFrame,
    Texture2D,
    TiledMapAsset
} from "cc";

class ResMgr {
    // tiledMapAssetHash = {};
    // resLoadState = {};
    private resHash: Map<string, Asset> = new Map<string, Asset>();

    constructor() {
        // this.tiledMapAssetHash = {};
        // this.resLoadState = {};
        this.resHash.clear();
    }

    /*preloadTiledMaps() {
        this.tiledMapAssetHash = {};
        cc.resources.loadDir('maps', cc.TiledMapAsset, (err, assets) => {
            if (!err) {
                for (let t of assets)
                    this.tiledMapAssetHash[t.name] = t;
                // cc.log('this.tiledMapAssetHash', this.tiledMapAssetHash);
            } else cc.log('preloadTiledMaps err', err);
        });
    }*/
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
    loadTiledMap(paths: string, topDir?: string): Promise<TiledMapAsset> {
        topDir ??= 'tiledMaps';
        return this.load(TiledMapAsset, `${topDir}/${paths}`);
    }

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
    loadAudio(paths: string, topDir?: string): Promise<AudioClip> {
        topDir ??= 'audios';
        return this.load(AudioClip, `${topDir}/${paths}`);
    }

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
    loadPrefab(paths: string, topDir?: string): Promise<Prefab> {
        topDir ??= 'prefabs';
        return this.load(Prefab, `${topDir}/${paths}`);
    }

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
    loadTexture(paths: string, topDir?: string): Promise<Texture2D> {
        topDir ??= 'textures';
        return this.load(Texture2D, `${topDir}/${paths}/texture`);
    }

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
    loadSpriteFrame(paths: string, topDir?: string): Promise<SpriteFrame> {
        topDir ??= 'textures';
        return new Promise((resolve, reject) => {
            this.load(SpriteFrame, `${topDir}/${paths}/spriteFrame`, true).then((sp: SpriteFrame) => resolve(sp)).catch(
                () => {
                    this.loadTexture(paths).then((texture: Texture2D) => resolve(SpriteFrame.createWithImage(texture.image as ImageAsset))).catch((err: Error) => reject(err));
                });
        });
    }

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
    loadMaterial(paths: string, topDir?: string): Promise<Material> {
        topDir ??= 'materials';
        return this.load(Material, `${topDir}/${paths}`);
    }

    /*loadMaterials(paths: string, cb: Function) {
        resources.loadDir(`materials/${paths}`, Material, (err, assets) => {
            if (!err) {
                // log('loadMaterials',assets);
                cb && cb(null, assets);
            } else {
                console.log(err);
                cb(err)
            }
        });
        // this.load(Material, `materials/${paths}`, callBack);
    }*/

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
    loadSkeletonData(paths: string, topDir?: string): Promise<sp.SkeletonData> {
        return new Promise((resolve, reject) => {
            topDir ??= 'spines';
            resources.load(`${topDir}/${paths}`, sp.SkeletonData, (err, skeleton: sp.SkeletonData) => {
                err && console.log('loadSpine err ', err, `spines/${paths}`);
                if (err) reject(err); else resolve(skeleton);
            });
        });
    }

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
    load<T extends Asset>(type: { new(...args: any[]): T }, paths: string, bLogError: boolean = false): Promise<T> {
        return new Promise((resolve, reject) => {
            let res = this.resHash.get(paths);
            // if (this.resLoadState[filePath]) return;
            // null == res && (this.resLoadState[filePath] = true);
            undefined !== res ? resolve(res as T) : resources.load(paths, type, (err: Error | null, assets: T) => {
                if (!err) {
                    this.resHash.set(assets.name, assets);
                    resolve(assets);
                } else {
                    !bLogError && console.log('load err ', err, `type = ${type} paths = ${paths}`);
                    reject(err);
                }
                // delete this.resLoadState[filePath];
            });
        });
    }

    /*loadDir<T extends Asset>(type: { new(...args: any[]): T }, paths: string, callBack: Function, bLogError: boolean = false) {
         this.resHash = this.resHash || {};
         let res = this.resHash[fileName];
         // if (this.resLoadState[fileName]) return;
         // null == res && (this.resLoadState[fileName] = true);
         undefined !== res ? callBack && callBack(res) : resources.loadDir(paths, type, (err, assets) => {
             err && !bLogError && console.log('loadDir err ', err, `type = ${type} paths = ${paths}`);
             if (!err)
                 this.resHash[assets.name] = assets;
             callBack && callBack(err, assets);
             // delete this.resLoadState[fileName];
         });
     }*/
}

export const resMgr: ResMgr = new ResMgr();