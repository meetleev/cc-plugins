import {Node, AudioSource, AudioClip, director, sys, Director, AudioSourceComponent} from 'cc';
import {TimeSchedule} from "./components";
import {resMgr} from "./ResMgr";

const MusicEnabled: string = 'ccx@MusicEnabled';
const EffectEnabled: string = 'ccx@EffectEnabled';

enum AudioType {
    BGMusic,
    Music,
    Effect
}

export class AudioMgr {
    private static instance?: AudioMgr;
    private commonAudioSources: AudioSource[] = [];

    private musicAudioSourceMap: Map<string, AudioSource> = new Map<string, AudioSource>();
    private readonly bgAudioSource: AudioSource;
    private maxCommonAudioNums = 10;
    private _musicEnabled: boolean = false;

    get musicEnabled(): boolean {
        return this._musicEnabled;
    }

    set musicEnabled(value: boolean) {
        if (this._musicEnabled != value) {
            this._musicEnabled = value;
            if (value) {
                this.resumeAllMusic();
            } else {
                this.pauseAllMusic();
            }
            sys.localStorage.setItem(MusicEnabled, this._musicEnabled ? '1' : '0');
        }
    }

    private _effectEnabled: boolean = false;

    get effectEnabled(): boolean {
        return this._effectEnabled;
    }

    set effectEnabled(value: boolean) {
        if (this._effectEnabled != value) {
            this._effectEnabled = value;
            sys.localStorage.setItem(EffectEnabled, this._effectEnabled ? '1' : '0');
        }
    }

    private _adPlaying: boolean = false;

    get adPlaying(): boolean {
        return this._adPlaying;
    }

    set adPlaying(value: boolean) {
        if (this._adPlaying != value) {
            this._adPlaying = value;
            this._adPlaying ? this.pauseAllMusic() : this.resumeAllMusic();
        }
    }

    private readonly _audioNodeRoot: Node;

    private _timeSchedule: TimeSchedule;

    static get Instance() {
        if (null == AudioMgr.instance)
            AudioMgr.instance = new AudioMgr();
        return AudioMgr.instance;
    }

    private constructor() {
        director.on(Director.EVENT_BEFORE_SCENE_LAUNCH, () => {
            delete AudioMgr.instance;
            AudioMgr.instance = undefined;
        });
        this._audioNodeRoot = new Node('audio');
        director.getScene()?.addChild(this._audioNodeRoot);

        this._timeSchedule = this._audioNodeRoot.addComponent(TimeSchedule);

        for (let i = 0; i < this.maxCommonAudioNums; i++) {
            this.commonAudioSources.push(this.createAudio());
        }

        this.bgAudioSource = this.createAudio(true);

        let enabled = sys.localStorage.getItem(MusicEnabled);
        this._musicEnabled = '0' != enabled;
        enabled = sys.localStorage.getItem(EffectEnabled);
        this._effectEnabled = '0' != enabled;
    }

    playBGMusic(audioClip: string | AudioClip, loop: boolean = true, volume: number = 1) {
        if (audioClip instanceof AudioClip) {
            this.play(AudioType.BGMusic, audioClip, volume, loop);
        } else {
            AudioMgr.loadAudio(audioClip).then((clip: AudioClip) => {
                this.play(AudioType.BGMusic, clip, volume, loop);
            });
        }
    }

    playMusic(audioClip: string | AudioClip, loop: boolean = true, volume: number = 1) {
        if (audioClip instanceof AudioClip) {
            this.play(AudioType.Music, audioClip, volume, loop);
        } else {
            AudioMgr.loadAudio(audioClip).then((clip: AudioClip) => {
                this.play(AudioType.Music, clip, volume, loop);
            });
        }
    }

    playEffect(audioClip: string | AudioClip, volume: number = 1) {
        if (audioClip instanceof AudioClip) {
            this.play(AudioType.Effect, audioClip, volume);
        } else {
            AudioMgr.loadAudio(audioClip).then((clip: AudioClip) => {
                this.play(AudioType.Effect, clip, volume);
            });
        }
    }

    pauseAllMusic() {
        this.bgAudioSource?.stop();
        let audioSources = Array.from(this.musicAudioSourceMap.values());
        audioSources.forEach((o) => o.stop());
    }

    pauseMusic(audioClip: string, bFadeOut?: boolean) {
        let audio: AudioSource;
        if (this.bgAudioSource) {
            if (this.bgAudioSource.clip?.name == audioClip) {
                audio = this.bgAudioSource;
            }
        }
        audio = this.musicAudioSourceMap.get(audioClip) as AudioSource;
        if (audio) {
            if (bFadeOut) {
                let orgVolume = audio.volume;
                this._timeSchedule.schedule(
                    (dt: number) => {
                        audio.volume -= dt;
                        if (audio.volume <= 0.1) {
                            audio.stop();
                            audio.volume = orgVolume;
                            return true;
                        }
                        return false;
                    }
                );
            } else audio.stop();
        }
    }

    resumeBGMusic() {
        if (this._musicEnabled)
            this.bgAudioSource?.play();
    }

    resumeAllMusic() {
        if (this._musicEnabled) {
            this.bgAudioSource?.play();
            let audioSources = Array.from(this.musicAudioSourceMap.values());
            audioSources.forEach((o) => o.play());
        }
    }

    destroyMusic(audioClip: string) {
        if (this.bgAudioSource) {
            if (this.bgAudioSource.clip?.name == audioClip) {
                this.bgAudioSource.stop();
                this.bgAudioSource.clip.destroy();
                this.bgAudioSource.clip = null;
            }
        }
        if (this.musicAudioSourceMap.has(audioClip)) {
            let audio = this.musicAudioSourceMap.get(audioClip);
            audio?.stop();
            audio?.destroy();
            this.musicAudioSourceMap.delete(audioClip);
        }
    }

    destroyMusicExceptBg() {
        let audioSources = Array.from(this.musicAudioSourceMap.values());
        audioSources.forEach((o) => o.destroy());
        this.musicAudioSourceMap.clear();
    }

    private play(audioType: AudioType, pAudioClip: AudioClip, volume: number, loop?: boolean) {
        switch (audioType) {
            case AudioType.BGMusic: {
                if (!this.adPlaying && this._musicEnabled) {
                    this.bgAudioSource.stop();
                    this.bgAudioSource.clip = pAudioClip;
                    loop && (this.bgAudioSource.loop = loop);
                    this.bgAudioSource.volume = volume;
                    this.bgAudioSource.playOnAwake = true;
                    this.bgAudioSource.play();
                } else {
                    this.bgAudioSource.clip = pAudioClip;
                    this.bgAudioSource.stop();
                }
                break;
            }
            case AudioType.Music: {
                let musicAudioSource: AudioSource;
                if (!this.musicAudioSourceMap.has(pAudioClip.name)) {
                    musicAudioSource = this.createAudio(loop);
                    musicAudioSource.clip = pAudioClip;
                    this.musicAudioSourceMap.set(pAudioClip.name, musicAudioSource);
                } else musicAudioSource = this.musicAudioSourceMap.get(pAudioClip.name) as AudioSource;
                if (!this.adPlaying && this._musicEnabled) {
                    musicAudioSource.volume = volume;
                    musicAudioSource.playOnAwake = true;
                    musicAudioSource.play();
                } else musicAudioSource?.stop();
                break;
            }
            case AudioType.Effect: {
                if (!this.adPlaying && this._effectEnabled) {
                    let effectAudioSource = this.getFreeCommonAudioSource();
                    effectAudioSource.volume = volume;
                    effectAudioSource.playOneShot(pAudioClip);
                }
                break;
            }
        }
    }

    private getFreeCommonAudioSource() {
        for (let i = 0, len = this.commonAudioSources.length; i < len; i++) {
            let audioSource = this.commonAudioSources[i];
            if (!audioSource.playing)
                return audioSource;
        }
        let audioSource = this.createAudio();
        this.commonAudioSources.push(audioSource);
        return audioSource;
    }

    private createAudio(loop?: boolean) {
        let audioSource = this._audioNodeRoot.addComponent(AudioSourceComponent);
        loop && (audioSource.loop = loop);
        audioSource.volume = 1;
        audioSource.playOnAwake = false;
        return audioSource;
    }

    private static loadAudio(audioPath: string) {
        return resMgr.loadAudio(audioPath);
    }
}