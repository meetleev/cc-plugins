const EFFECT_ENABLED = 'SDK_NAME@EFFECT_ENABLED';
const MUSIC_ENABLED = 'SDK_NAME@MUSIC_ENABLED';

class AudioMgr {
    static getInstance() {
        if (null == this.instance)
            this.instance = new AudioMgr();
        return this.instance;
    }

    constructor() {
        let sMusicEnabled = cc.sys.localStorage.getItem(MUSIC_ENABLED);
        let sEffectEnabled = cc.sys.localStorage.getItem(EFFECT_ENABLED);
        this._bEffectEnabled = 0 !== sEffectEnabled;
        this._bMusicEnabled = 0 !== sMusicEnabled;
    }

    playMusicByFilePath(filePath, loop = true, volume = 1.0) {
        this.loadAudio(filePath, (clip) => {
            this.playMusicByClip(clip, loop, volume);
        });
    }

    playMusicByClip(pAudioClip, loop = true, volume = 1.0) {
        if (!this._bMusicEnabled || !pAudioClip)
            return;
        this.stopMusic();
        this._cBGAudioid = cc.audioEngine.play(pAudioClip, loop, volume);
    }

    stopMusic() {
        cc.audioEngine.stop(this._cBGAudioid);
    }

    resumeMusic() {
        cc.audioEngine.resume(this._cBGAudioid);
    }

    pauseMusic() {
        cc.audioEngine.pause(this._cBGAudioid);
    }

    setEffectEnabled(bEffectEnabled) {
        if (bEffectEnabled != this._bEffectEnabled) {
            this._bEffectEnabled = bEffectEnabled;
            cc.sys.localStorage.setItem(EFFECT_ENABLED, bEffectEnabled ? 1 : 0);
        }
    }

    getEffectEnabled() {
        return this._bEffectEnabled;
    }

    setMusicEnabled(bMusicEnabled) {
        if (bMusicEnabled != this._bMusicEnabled) {
            this._bMusicEnabled = bMusicEnabled;
            cc.sys.localStorage.setItem(MUSIC_ENABLED, bMusicEnabled ? 1 : 0);
        }
    }

    getMusicEnabled() {
        return this._bMusicEnabled;
    }

    playEffectByFilePath(filePath, loop = false, volume = 1.0) {
        this.loadAudio(filePath, (clip) => {
            this.playEffectByClip(clip, loop, volume);
        });
    }

    playEffectByClip(pAudioClip, loop = false, volume = 1.0) {
        if (!this._bEffectEnabled || !pAudioClip)
            return 0;
        return cc.audioEngine.play(pAudioClip, loop, volume);
    }

    stop(id) {
        cc.audioEngine.stop(id);
    }

    resumeAll() {
        cc.audioEngine.resumeAll();
    }

    pauseAll() {
        cc.audioEngine.pauseAll();
    }

    stopAll() {
        cc.audioEngine.stopAll();
    }

    loadAudio(fileName, callBack) {
        this.audioHash = this.audioHash || {};
        let res = this.audioHash[fileName];
        undefined !== res ? callBack && callBack(res) : cc.resources.load(`${fileName}`, cc.AudioClip, (err, assets) => {
            err && cc.log('load err ', err, ` fileName = ${fileName}`);
            !err && (this.audioHash[assets.name] = assets) && callBack && callBack(assets);
        });
    }
}

SDK_NAME.AudioMgr = AudioMgr;
