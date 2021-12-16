class NetBuffer {
    constructor(XYID, msgBuffer, showLoadingEnabled, repeatEnabled, responseFunc) {
        this.setXYID(XYID);
        this.setMsgBuffer(msgBuffer);
        this.setShowLoadingEnabled(showLoadingEnabled);
        this.setRepeatEnabled(repeatEnabled);
        this.setResponseCallBack(responseFunc);
    };

    setXYID(XYID) {
        this._XYID = XYID;
    }

    getXYID() {
        return this._XYID;
    }

    setMsgBuffer(msgBuffer) {
        this._msgBuffer = msgBuffer;
    }

    getMsgBuffer() {
        return this._msgBuffer;
    }

    setResponseCallBack(responseFunc) {
        this._pResponseCallBack = responseFunc;
    }

    getResponseCallBack() {
        return this._pResponseCallBack;
    }

    setShowLoadingEnabled(showLoadingEnabled) {
        this._showLoadingEnabled = showLoadingEnabled;
    }

    getShowLoadingEnabled() {
        return this._showLoadingEnabled;
    }

    setRepeatEnabled(repeatEnabled) {
        this._repeatEnabled = repeatEnabled;
    }

    getRepeatEnabled() {
        return this._repeatEnabled;
    }
}

class NetBufferCache {
    constructor() {
        this._requestCache = this._requestCache || [];
    }

    push(pNetBuffer) {
        if (pNetBuffer && pNetBuffer instanceof NetBuffer) {
            if (!pNetBuffer.getRepeatEnabled())
                this.remove(pNetBuffer.getXYID());
            this._requestCache.push(pNetBuffer);
        }
    }

    unshift(pNetBuffer){
        if (pNetBuffer && pNetBuffer instanceof NetBuffer) {
            if (!pNetBuffer.getRepeatEnabled())
                this.remove(pNetBuffer.getXYID());
            this._requestCache.unshift(pNetBuffer);
        }
    }

    remove(xyid) {
        this._requestCache = this._requestCache || [];
        for (let i = 0; i < this._requestCache.length; i++) {
            let pNetBuffer = this._requestCache[i];
            if (pNetBuffer.getXYID() == xyid) {
                this._requestCache.splice(i, 1);
                break;
            }
        }
    }

    clear() {
        this._requestCache = [];
    }

    front() {
        if (0 < this._requestCache.length) {
            return this._requestCache[0];
        }
        return null;
    }

    back() {
        if (0 < this._requestCache.length) {
            return this._requestCache[this._requestCache.length - 1];
        }
        return null;
    }

    pop_front() {
        if (0 < this._requestCache.length)
            this._requestCache.splice(0, 1);
    }

    pop_back() {
        if (0 < this._requestCache.length)
            this._requestCache.splice(this._requestCache.length - 1, 1);
    }
}