const MY_PLAYER_DATA = 'ccx@MY_PLAYER_DATA';
// const MY_FRIENDS_DATA_PLANE = "MY_FRIENDS_DATA_SDK_NAME";

class Player {
    constructor(obj) {
        if (obj) {
            this._uid = obj._uid;
            this._name = obj._name; // 昵称
            this._pic = obj._pic; // 玩家头像本地icon 索引
            this._pickUrl = obj._pickUrl; // 玩家头像url地址
            this._sex = obj._sex; // 性别
            this._level = obj._level; // 等级
            this._sCity = obj._sCity; // 所在地区
            // this._iScore = obj._iScore; // 积分
            // this._iAge = obj._iAge; // 年龄
        }
    }

    setUid(uid) {
        this._uid = uid;
    }

    getUid() {
        return this._uid;
    }

    setLevel(level) {
        this._level = level;
    }

    // getAge() {
    //     return this._iAge;
    // }
    //
    // setAge(iAge) {
    //     this._iAge = iAge;
    // }

    getLevel() {
        if (null == this._level)
            this._level = 1;
        return this._level;
    }

    setPic(pic) {
        this._pic = pic;
    }

    getPic() {
        return this._pic;
    }

    setPickUrl(pickUrl) {
        this._pickUrl = pickUrl;
    }

    getPickUrl() {
        return this._pickUrl;
    }

    setSex(sex) {
        this._sex = sex;
    }

    getSex() {
        return this._sex;
    }

    setName(name) {
        this._name = name;
    }

    // getScore() {
    //     return this._iScore;
    // }
    //
    // setScore(score) {
    //     this._iScore = score;
    // }

    getName() {
        return this._name;
    }

    getCity() {
        return this._sCity;
    }

    setCity(sCity) {
        this._sCity = sCity;
    }

    toString() {
        return JSON.stringify(this);
    }
}

class MyPlayer extends Player {
    constructor(obj) {
        super(obj);
        this._iIngot = obj._iIngot; // 钻石
        this._iCoin = obj._iCoin; // 辅助货币
        this._registerTime = obj._registerTime;//注册日期
        this._serverTime = obj._serverTime;//当前日期
        this._openId = obj._openId; // wx
        this._sessionkey = obj._sessionkey;
        this._loginId = obj._loginId; // 登录id,,充值的时候返回
        this._sToken = obj._sToken; // 登录token
        this._iEnergy = obj._iEnergy; // 体力
    }

    setEnergy(iEnergy) {
        this._openId = iEnergy;
    }

    getEnergy() {
        if (undefined == this._iEnergy)
            this._iEnergy = 0;
        return this._iEnergy;
    }

    setToken(sToken) {
        this._sToken = sToken;
    }

    getToken() {
        return this._sToken;
    }

    setLoginId(loginId) {
        this._loginId = loginId;
    }

    getLoginId() {
        return this._loginId;
    }

    setOpenId(openId) {
        this._openId = openId;
    }

    getOpenId() {
        return this._openId;
    }

    setSessionKey(sessionkey) {
        this._sessionkey = sessionkey;
    }

    getSessionKey() {
        return this._sessionkey;
    }

    setIngot(iIngot) {
        this._iIngot = iIngot;
    }

    getIngot() {
        if (undefined == this._iIngot) return 0;
        return this._iIngot;
    }

    setCoin(iCoin) {
        this._iCoin = iCoin;
    }

    getCoin() {
        if (undefined == this._iCoin) return 0;
        return this._iCoin;
    }

    setRegisterTime(iRegisterTime) {
        this._registerTime = iRegisterTime;
    }

    getRegisterTime() {
        return this._registerTime;
    }

    setServerTime(iCurrentTime) {
        this._serverTime = iCurrentTime;
    }

    getServerTime() {
        return this._serverTime;
    }

    clone(){
        return new MyPlayer(JSON.parse(this.toString()));
    }

    deleteLoginId(){
        delete this._loginId;
    }
    deleteServerTime(){
        delete this._serverTime;
    }
    deleteToken(){
        delete this._sToken;
    }
}

class PlayerMgr {
    constructor() {
        // this._friendsData = {};
    }

    setMyPlayer(p) {
        if (p && p instanceof MyPlayer) {
            let uid = p.getUid();
            if (uid) {
                let token = p.getToken();
                p.deleteToken();
                let loginId = p.getLoginId();
                p.deleteLoginId();
                let serverTime = p.getServerTime();
                p.deleteServerTime();
                cc.sys.localStorage.setItem(MY_PLAYER_DATA, p.toString());
                p.setToken(token);
                p.setLoginId(loginId);
                p.setServerTime(serverTime);
            }
            this._pMyPlayer = p;
        }
    }

    static getInstance() {
        if (!this._pPlayerMgr)
            this._pPlayerMgr = new PlayerMgr();
        return this._pPlayerMgr;
    }

    getMyPlayer() {
        if (undefined == this._pMyPlayer) {
            let playerStr = cc.sys.localStorage.getItem(MY_PLAYER_DATA);
            let playerObj = JSON.parse(playerStr || '{}');
            this._pMyPlayer = new MyPlayer(playerObj);
        }
        return this._pMyPlayer;
    }

    // setFriendsData(data) {
    //     this._friendsData = data;
    //     cc.sys.localStorage.setItem(MY_FRIENDS_DATA_PLANE, JSON.stringify(this._friendsData));
    // }
    //
    // addFriends(pPlayer) {
    //     this.getFriendsData();
    //     if (pPlayer && pPlayer instanceof Player) {
    //         this._friendsData[pPlayer.getUid()] = pPlayer;
    //         cc.sys.localStorage.setItem(MY_FRIENDS_DATA_PLANE, JSON.stringify(this._friendsData));
    //     }
    // }
    //
    // updateFriend(pPlayer) {
    //     this.addFriends(pPlayer);
    // }
    //
    // getFriend(uid) {
    //     let friends = this.getFriendsData();
    //     if (friends)
    //         return friends[uid];
    //     return null;
    // }
    //
    // getFriendsData() {
    //     if (!this._friendsData || 0 >= Object.keys(this._friendsData || {}).length) {
    //         let friendsStr = cc.sys.localStorage.getItem(MY_FRIENDS_DATA_PLANE);
    //         if ('' == friendsStr || null == friendsStr) {
    //         } else {
    //             let friendsObj = JSON.parse(friendsStr);
    //             let keys = Object.keys(friendsObj);
    //             for (let k of keys) {
    //                 let pPlayer = new Player(friendsObj[k]);
    //                 this._friendsData[k] = pPlayer;
    //             }
    //         }
    //         cc.sys.localStorage.setItem(MY_FRIENDS_DATA_PLANE, JSON.stringify(this._friendsData));
    //     }
    //     return this._friendsData;
    // }
    //
    // // 好友数组列表
    // getFriendsDataArr() {
    //     let t = [];
    //     let friends = this.getFriendsData();
    //     let keys = Object.keys(friends);
    //     for (let k of keys) {
    //         let v = friends[k];
    //         t.push(v);
    //     }
    //     return t;
    // }
    //
    // isFriends(uid) {
    //     this.getFriendsData();
    //     if (this._friendsData && this._friendsData[uid])
    //         return true;
    //     return false;
    // }
}

// export {Player, PlayerMgr};