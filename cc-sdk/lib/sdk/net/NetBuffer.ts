export interface INetBuffer {
    id: number;
    msg: any;
    showUILoading?: boolean;
    repeat?: boolean;
    onResponse?: Function;
}

export class NetBufferCache {
    private _requestCache: INetBuffer[] = [];

    constructor() {
        this._requestCache.length = 0;
    }

    push(pNetBuffer: INetBuffer) {
        if (pNetBuffer) {
            if (!pNetBuffer.repeat)
                this.remove(pNetBuffer.id);
            this._requestCache.push(pNetBuffer);
        }
    }

    unshift(pNetBuffer: INetBuffer) {
        if (pNetBuffer) {
            if (!pNetBuffer.repeat)
                this.remove(pNetBuffer.id);
            this._requestCache.unshift(pNetBuffer);
        }
    }

    remove(id: number) {
        this._requestCache ??= [];
        for (let i = 0, len = this._requestCache.length; i < len;) {
            let pNetBuffer = this._requestCache[i];
            if (pNetBuffer.id === id) {
                this._requestCache.splice(i, 1);
                len--;
                continue;
            }
            i++;
        }
    }

    clear() {
        this._requestCache.length = 0;
    }

    front() {
        if (0 < this._requestCache.length)
            return this._requestCache[0];
        return null;
    }

    back() {
        if (0 < this._requestCache.length)
            return this._requestCache[this._requestCache.length - 1];
        return null;
    }

    shift() {
        if (0 < this._requestCache.length)
            return this._requestCache.shift();
        return null;
    }

    pop() {
        if (0 < this._requestCache.length)
            return this._requestCache.pop();
        return null;
    }
}