import {game, instantiate, Layers, Mat4, Node, sp, Texture2D, Tween, tween, env, Vec3} from "cc";
import {JSB} from "cc/env";
import {resMgr} from "./ResMgr";

export interface SpineActParam {
    parent: Node;
    spinePath: string;
    animName?: string; // default first animation
    loop?: boolean;
    timeScale?: number;
    siblingIndex?: number;
    worldPosition?: Vec3;
    position?: Vec3;
    doNotDestroy?: boolean;
    delayTime?: number;
    flippedX?: boolean,
    onLoad?: Function;
    onComplete?: Function;
}

export function PlaySpineAct(spineActParam: SpineActParam) {
    let cb = function (eff: sp.Skeleton) {
        if (eff) {
            eff.node.active = true;
            if (spineActParam.flippedX)
                eff.node.scale = eff.node.scale.multiply3f(-1, 1, 1);
            if (spineActParam.worldPosition)
                eff.node.worldPosition = spineActParam.worldPosition;
            else if (spineActParam.position)
                eff.node.position = spineActParam.position;
            if (spineActParam.siblingIndex)
                eff.node.setSiblingIndex(spineActParam.siblingIndex);
            if (spineActParam.timeScale)
                eff.timeScale = spineActParam.timeScale;
            if (spineActParam.animName)
                eff.setAnimation(0, spineActParam.animName, spineActParam.loop ? spineActParam.loop : false);
            eff.setCompleteListener((trackEntry) => {
                spineActParam.onComplete && spineActParam.onComplete(eff);
                tween(eff.node).call(() => {
                    if (!spineActParam.doNotDestroy) {
                        eff.node.parent = null;
                        eff.node.destroy();
                    }
                }).start();
            });
            spineActParam.onLoad && spineActParam.onLoad(eff);
        }
    };
    resMgr.loadSkeletonData(`${spineActParam.spinePath}`).then((skeletonData: sp.SkeletonData) => {
        let node = new Node();
        node.layer = Layers.Enum.UI_2D;
        node.parent = spineActParam.parent;
        let effSpine = node.addComponent(sp.Skeleton);
        effSpine.skeletonData = skeletonData;
        if (null == spineActParam.animName) {
            let animsEnum = skeletonData.getAnimsEnum();
            let keys = Object.keys(animsEnum ?? {});
            if (1 < keys.length)
                spineActParam.animName = keys[1];
        }
        if (spineActParam.delayTime)
            tween(node).delay(spineActParam.delayTime).call(() => {
                cb(effSpine);
            }).start();
        else cb(effSpine);
    });
}

export function ShuffleArr(a: any[]) {
    for (let i = a.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
    return a;
}

/**
 * @en Returns a floating-point random number between min (inclusive) and max (exclusive).<br/>
 * @zh 返回最小(包含)和最大(不包含)之间的浮点随机数。
 * @method RandomRange
 * @param min
 * @param max
 * @return The random number.
 */
export function RandomRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

/**
 * @en Returns a random integer between min (inclusive) and max (exclusive).<br/>
 * @zh 返回最小(包含)和最大(不包含)之间的随机整数。
 * @method RandomRangeInt
 * @param min
 * @param max
 * @return The random integer.
 */
export function RandomRangeInt(min: number, max: number) {
    return Math.floor(RandomRange(min, max));
}

/**
 * Linear congruential generator using Hull-Dobell Theorem.
 * @method PseudoRandom
 * @param seed The random seed.
 * @return The pseudo random.
 */
export function PseudoRandom(seed: number) {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280.0;
}

/**
 * Returns a floating-point pseudo-random number between min (inclusive) and max (exclusive).
 * @method PseudoRandomRange
 * @param min
 * @param max
 * @return The random number.
 */
export function PseudoRandomRange(min: number, max: number) {
    return PseudoRandom(new Date().getTime()) * (max - min) + min;
}

/**
 * @en Returns a pseudo-random integer between min (inclusive) and max (exclusive).<br/>
 * @zh 返回最小(包含)和最大(不包含)之间的浮点伪随机数。
 * @method PseudoRandomRangeInt
 * @param min
 * @param max
 * @return The random integer.
 */
export function PseudoRandomRangeInt(min: number, max: number) {
    return Math.floor(PseudoRandomRange(min, max));
}

export function DeepCopy<T>(tgt: T): T {
    let cp: T;
    if (tgt === null) {
        cp = tgt;
    } else if (tgt instanceof Date) {
        cp = new Date((tgt as any).getTime()) as any;
    } else if (Array.isArray(tgt)) {
        cp = [] as any;
        (tgt as any[]).forEach((v, i, arr) => {
            (cp as any).push(v);
        });
        cp = (cp as any).map((n: any) => DeepCopy<any>(n));
    } else if ((typeof (tgt) === 'object') && (tgt !== {})) {
        cp = {...(tgt as Object)} as T;
        Object.keys(cp).forEach(k => {
            (cp as any)[k] = DeepCopy<any>((cp as any)[k]);
        });
    } else {
        cp = tgt;
    }
    return cp;
}


export function GenDeviceId() {
    let d = new Date().getTime();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

// 计算虚拟货币 加单位显示
export function CalculateUnit(value: number, nFixed: number = 1) {
    let valueStr: string = '';
    if (0 > value)
        valueStr = '0';
    else if (0 <= value && 1000 > value)
        valueStr = value.toString();
    else if (Math.pow(10, 3) <= value && Math.pow(10, 6) > value) // k
        valueStr = (value / Math.pow(10, 3)).toFixed(nFixed) + 'K';
    else if (Math.pow(10, 6) <= value && Math.pow(10, 9) > value) // M
        valueStr = (value / Math.pow(10, 6)).toFixed(nFixed) + 'M';
    else if (Math.pow(10, 9) <= value && Math.pow(10, 12) > value) // B
        valueStr = (value / Math.pow(10, 9)).toFixed(nFixed) + 'B';
    else if (Math.pow(10, 12) <= value && Math.pow(10, 15) > value) // T
        valueStr = (value / Math.pow(10, 12)).toFixed(nFixed) + 'T';
    else if (Math.pow(10, 15) <= value && Math.pow(10, 18) > value) // E
        valueStr = (value / Math.pow(10, 12)).toFixed(nFixed) + 'E';
    else
        console.log('土豪 ~~~~~');
    return valueStr;
}

let frameRate: number = game.frameRate as number;

export function RecursiveFunc(times: number, func: Function, doneCb?: Function) {
    if (0 >= times) return doneCb && doneCb();
    func && func(times);
    setTimeout(() => {
        RecursiveFunc(--times, func, doneCb);
    }, 1 / frameRate);
}

export interface ICurrencyAniParma {
    prefab: Node;
    parent: Node;
    position: Vec3;
    coinNums: number;
    createTime: number;
    minRandom: number;
    maxRandom: number;
    stayDuration: number;
    targetPos: Vec3;
    speed: number;
    endCallBack?: Function;
}

export function PlayCurrencyAction(currencyAniParma: ICurrencyAniParma) {
    for (let i = 0; i < currencyAniParma.coinNums; i++) {
        let pre = instantiate(currencyAniParma.prefab);
        pre.parent = currencyAniParma.parent;
        pre.position = currencyAniParma.position;
        let randomPosX = Math.floor(Math.random() * (currencyAniParma.maxRandom - currencyAniParma.minRandom + 1) + currencyAniParma.minRandom)
        let randomPosY = Math.floor(Math.random() * (currencyAniParma.maxRandom - currencyAniParma.minRandom + 1) / 1.5 + currencyAniParma.minRandom / 1.5)
        tween(pre).by(currencyAniParma.createTime, {position: new Vec3(randomPosX, randomPosY, 0)}).delay(currencyAniParma.stayDuration).call(() => {
            Tween.stopAllByTarget(pre);
            let playTime = pre.position.clone().subtract(currencyAniParma.targetPos).length() / currencyAniParma.speed;
            tween(pre).to(playTime, {position: currencyAniParma.targetPos}).call(() => {
                if (currencyAniParma.coinNums - 1 == i)
                    currencyAniParma.endCallBack && currencyAniParma.endCallBack();
                pre.destroy();
            }).union().start();
        }).start();
    }
}

export function GetTimestamp00() {
    let date = new Date();
    let lLocalTimestamp = date.getTime();
    return lLocalTimestamp - date.getHours() * 3600 * 1000 - date.getMinutes() * 60 * 1000 - date.getSeconds() * 1000 - date.getMilliseconds();
}

export function IsNewDay(lTmpLocalTimestamp: number) {
    let lNewLocalTimestamp = GetTimestamp00();
    if (undefined == lTmpLocalTimestamp || 0 >= lTmpLocalTimestamp) {
    } else {
        let newDate = new Date(lTmpLocalTimestamp);
        if (lNewLocalTimestamp == newDate.getTime())
            return -1;
    }
    return lNewLocalTimestamp;
}

export function IsNewWeek(lTmpLocalTimestamp: number) {
    let lNewLocalTimestamp = GetTimestamp00();
    if (undefined == lTmpLocalTimestamp || 0 >= lTmpLocalTimestamp) {
    } else {
        let newDate = new Date(lTmpLocalTimestamp);
        if (7 * 24 * 60 * 60 * 1000 > lNewLocalTimestamp - newDate.getTime())
            return -1;
    }
    return lNewLocalTimestamp;
}


function FormatDate(fmt: string, opt: object) {
    let ret;
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret)
            fmt = fmt.replace(ret[1], (ret[1].length === 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")));
    }
    return fmt;
}

export function DateFormat(fmt: string, date: Date) {
    const opt = {
        "Y+": date.getFullYear().toString(),        // 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString()          // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    return FormatDate(fmt, opt);
}

export function DHMSFormat(fmt, timestamp) {
    const ms = 60;
    let days = 0, hours = 0, minutes = 0, second = timestamp / 1000;
    let fDays = second / (ms * ms * 24), fHours = 0, fMinutes = 0;
    if (fmt.match(/d+/)) {
        days = Math.floor(fDays);
        fHours = (fDays - days) * 24;
        hours = Math.floor(fHours);
        fMinutes = (fHours - hours) * ms;
        minutes = Math.floor(fMinutes);
        second = Math.floor((fMinutes - minutes) * ms);
    } else if (fmt.match(/H+/)) {
        fHours = fDays * 24;
        hours = Math.floor(fHours);
        fMinutes = (fHours - hours) * ms;
        minutes = Math.floor(fMinutes);
        second = Math.floor((fMinutes - minutes) * ms);
    } else if (fmt.match(/M+/)) {
        fMinutes = second / ms;
        minutes = Math.floor(fMinutes);
        second = Math.floor((fMinutes - minutes) * ms);
    } else {
        second = Math.floor(second);
    }
    // console.log('days hours', fDays, days, fHours, hours, fMinutes, minutes, second);
    const opt = {
        "d+": days.toString(),            // 日
        "H+": hours.toString(),           // 时
        "M+": minutes.toString(),         // 分
        "S+": second.toString()          // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    return FormatDate(fmt, opt);
}


export function QuickSort<T>(arr: Array<T>, compareFn: (a: T, b: T) => number) {
    if (1 >= arr.length) return arr;
    let pivotIdx = Math.floor(arr.length / 2);
    let pivot = arr.splice(pivotIdx, 1)[0];
    let leftArr: T[] = [], rightArr: T[] = [];
    for (let o of arr) {
        if (0 > compareFn(pivot, o)) leftArr.push(o); else rightArr.push(o);
    }
    return QuickSort(leftArr, compareFn).concat([pivot], QuickSort(rightArr, compareFn));
}

// @ts-ignore
export function ReplaceSpineRegion(spineComp: sp.Skeleton, soltName: string, texture: Texture2D) {
    if (JSB) {
        // @ts-ignore
        let textureIdx = spineComp.skeletonData.recordTexture(texture);
        // @ts-ignore
        let spTex = new middleware.Texture2D();
        spTex.setRealTextureIndex(textureIdx);
        spTex.setPixelsWide(texture.width);
        spTex.setPixelsHigh(texture.height);
        // @ts-ignore
        spineComp._nativeSkeleton.replaceRegion(soltName, spTex);
    } else {
        const solt = spineComp.findSlot(soltName);
        let attachment = solt.getAttachment();
        let skeletonTexture = new sp.SkeletonTexture({
            width: texture.width,
            height: texture.height
        } as ImageBitmap);
        skeletonTexture.setRealTexture(texture);
        let region = attachment.region;
        region.texture = skeletonTexture;
        region.width = texture.width;
        region.height = texture.height;
        region.originalWidth = texture.width;
        region.originalHeight = texture.height;
        region.u = 0;
        region.v = 0;
        region.u2 = 1;
        region.v2 = 1;
        region.renderObject = region;
        // attachment.scaleX = 1;
        // attachment.scaleY = 1;
        attachment.width = texture.width;
        attachment.height = texture.height;

        // @ts-ignore
        if (attachment instanceof sp.spine.MeshAttachment) {
            attachment.updateUVs();
        } else {
            attachment.setRegion(region);
            attachment.updateOffset();
        }
        spineComp.invalidAnimationCache();
    }
}

export function ShakeEffect(node: Node, duration: number, scale: number = 1) {
    Tween.stopAllByTarget(node);
    let orgPosition = node.position.clone();
    tween(node)
        .to(0.02, {position: orgPosition.clone().add3f(5 * scale, 7 * scale, 0)})
        .to(0.02, {position: orgPosition.clone().add3f(-6 * scale, 7 * scale, 0)})
        .to(0.02, {position: orgPosition.clone().add3f(-13 * scale, 3 * scale, 0)})
        .to(0.02, {position: orgPosition.clone().add3f(3 * scale, -6 * scale, 0)})
        .to(0.02, {position: orgPosition.clone().add3f(-5 * scale, 5 * scale, 0)})
        .to(0.02, {position: orgPosition.clone().add3f(2 * scale, -8 * scale, 0)})
        .to(0.02, {position: orgPosition.clone().add3f(-8 * scale, -10 * scale, 0)})
        .to(0.02, {position: orgPosition.clone().add3f(3 * scale, 10 * scale, 0)})
        .to(0.02, {position: orgPosition}).union().repeatForever().start();

    setTimeout(() => {
        Tween.stopAllByTarget(node);
        node.position = orgPosition;
    }, duration * 1000);
}

const _mat4_temp = new Mat4();
const _worldMatrix: Mat4 = new Mat4();

export function ConvertToNodeSpaceAR(parentNode: Node, worldPoint: Vec3) {
    parentNode.getWorldMatrix(_worldMatrix);
    Mat4.invert(_mat4_temp, _worldMatrix);
    let out = new Vec3();
    return Vec3.transformMat4(out, worldPoint, _mat4_temp);
}

export function ConvertToWorldSpaceAR(parentNode: Node, localPos: Vec3): Vec3 {
    parentNode.getWorldMatrix(_worldMatrix);
    let out = new Vec3();
    Vec3.transformMat4(out, localPos, _worldMatrix);
    return out;
}