let pBoxData = [];

function checkDirectJump(wxJumpAppIdList, wxId) {
    if (undefined == wxId || wxId == '') return false;
    let list = wxJumpAppIdList || [];
    for (let p of list) {
        if (p == wxId)
            return true;
    }
    return false;
}

function SdkBoxData(pSdkConfig, f) {
    if (0 < pBoxData.length) {
        return f(pBoxData);
    }
    GetWeChatBoxHttpCfg(null, pSdkConfig.wechat_cfg.app_key, -1, res => {
        if (res.code == ONLINE_PARAMETERS_ERROR_CODE.Success) {
            let list = res.adverts || [];
            let jumpList = [];
            for (let p of list) {
                let condition1 = checkDirectJump(pSdkConfig.wxJumpAppIdList, p.wechatGameid);
                let condition2 = (undefined != p.qrcodelink && '' != p.qrcodelink);
                if (condition1 || condition2)
                    jumpList.push(p);
            }
            f(jumpList);
        }
    });
}

class GameItemTemplate extends cc.Component {
    onLoad() {
        this.gameNameLab = cc.find('name', this.node).getComponent(cc.Label);
        this.iconSp = cc.find('mask/sp', this.node).getComponent(cc.Sprite);
        this.iconSp.node.on(cc.Node.EventType.TOUCH_END, (event) => {
            this.onBtnClickFunc(event);
        }, this.iconSp.node);
    }

    updateItem(data, itemId) {
        this.itemID = itemId;
        this.gameNameLab && (this.gameNameLab.string = data.gameName || '');
        if (data && data.link && !cc.sys.isBrowser) {
            this.iconSp && cc.loader.load(data.link, (err, texture) => {
                if (!err)
                    this.iconSp.spriteFrame = new cc.SpriteFrame(texture, cc.Rect(0, 0, this.iconSp.node.width, this.iconSp.node.height));
                else
                    console.log('err', err);
            });
        }
    }

    onBtnClickFunc() {
        if (this._clickCallBack)
            this._clickCallBack(this.itemID);
    }

    setBtnClickCallback(func) {
        this._clickCallBack = func;
    }
}

class MoreGameComponent extends cc.Component {
    onLoad() {
        this.items = [];
        this.spacing = 10;
        this.isTouched = false;
        this.pMoreGameSprites = [cc.find('moreGameBtnL', this.node).getComponent(cc.Sprite), cc.find('moreGameBtnR', this.node).getComponent(cc.Sprite)];
        this.gameListScrollView = cc.find('bg/gameListScrollView', this.node).getComponent(cc.ScrollView);
        this.gameListScrollView.scrollEvents[0] = (event) => {
            this.scrollEvent(event);
        };

        let eventNames = ['scroll-to-top', 'scroll-to-bottom', 'scroll-to-left', 'scroll-to-right', 'scrolling', 'bounce-bottom', 'bounce-top', 'bounce-left', 'bounce-right', 'scroll-ended', 'touch-up', 'scroll-began'];
        for (let e of eventNames)
            this.gameListScrollView.node.on(e, this.scrollEvent, this);

        this.itemTemplate = cc.find('gameListItem', this.node);
        this.content = this.gameListScrollView.content;
        this._boxList = [];
        let len = this._boxList.length;
        this.contentSize = this.gameListScrollView.node.getContentSize();
        this.spacing = (this.contentSize.width - this.itemTemplate.width * 5) / 6;
        this.content.width = len * (this.itemTemplate.width + this.spacing) + this.spacing;

        for (let p of this.pMoreGameSprites) {
            let pMoreGame = p.node;
            pMoreGame.on(cc.Node.EventType.TOUCH_END, (event) => {
                Log.l('customData', event.target.customData);
                this.pMoreGameClickEvent && this.pMoreGameClickEvent(event.target.customData, true);
            }, pMoreGame);
            p.node.active = true;
            let rot1 = cc.rotateBy(0.15, 10);
            let rot2 = cc.rotateBy(0.15, -10);
            p.node.stopAllActions();
            p.node.runAction(cc.sequence(rot1, rot1.reverse(), rot2, rot2.reverse(), rot1, rot1.reverse(), rot2, rot2.reverse(), cc.delayTime(0.3)).repeatForever());
        }
    }

    initBoxData(pSdkConfig) {
        this.pSdkConfig = pSdkConfig;
        if (undefined != this.pSdkConfig) {
            SdkBoxData(pSdkConfig, (data) => {
                this._boxList = data || [];
                let boxLen = this._boxList.length;
                if (boxLen > 5) {
                    //在数组后面补上五个,形成循环播放的假象
                    let arr = this._boxList.slice(0, 5);
                    this._boxList = this._boxList.concat(arr);
                } else {
                    let arr = this._boxList.slice(0, boxLen);
                    this._boxList = this._boxList.concat(arr);
                }
                this.initData();
            });
        }
    }

    initData() {
        if (!cc.isValid(this.node)) {
            return Log.i('MoreGame node has destroy');
        }
        let len = this._boxList.length;
        this.contentSize = this.gameListScrollView.node.getContentSize();
        this.spacing = (this.contentSize.width - this.itemTemplate.width * 5) / 6;
        this.content.width = len * (this.itemTemplate.width + this.spacing) + this.spacing;

        Log.l('间距: ', this.spacing, '----', this.contentSize.width);
        for (let i = 0; i < len; ++i) { // spawn items, we only need to do this once
            let item = cc.instantiate(this.itemTemplate);
            this.content.addChild(item);
            item.setPosition(this.spacing * (i + 1) + item.width * (i + 0.5), 0);
            let pGameItemTemplate = item.addComponent(GameItemTemplate);
            pGameItemTemplate.updateItem(this._boxList[i], i);
            pGameItemTemplate.setBtnClickCallback((itemId) => {
                this.clickCallback(itemId);
            });
            this.items.push(item);
        }
    }

    start() {
        if (SDK_NAME.screenUtil.isLiuHai() || SDK_NAME.screenUtil.isQuanMian()) {
            let offY = 35;
            if (SDK_NAME.screenUtil.isLiuHai())
                offY *= 2;
            SDK_NAME.screenUtil.toBottomByPx(this.gameListScrollView.node.parent, this.gameListScrollView.node.parent.getComponent(cc.Widget).bottom + offY);
        }
    }

    update(dt) {
        this._fTic = this._fTic || 0;
        if (!this.isTouched) {
            this._fTic++;
            this.gameListScrollView.scrollToOffset(cc.v2(this._fTic, 0), 0);
            if (Math.floor(this.content.width) <= -this.gameListScrollView.getScrollOffset().x + this.contentSize.width) {
                this._fTic = 0;
            }
        } else {

        }
        this.onUpdateMoreGame(dt);
    }

    //滑动事件
    scrollEvent(event) {
        if ('scrolling' == event.type) {
            this.isTouched = true;
            this._fTic = -this.gameListScrollView.getScrollOffset().x;
            if (this.content.width <= -this.gameListScrollView.getScrollOffset().x + this.contentSize.width) {
                this._fTic = 0;
                this.gameListScrollView.scrollToOffset(cc.v2(0, 0), 0);
            } else if (0 < this.gameListScrollView.getScrollOffset().x) {
                this._fTic = this.content.width - this.contentSize.width;
                this.gameListScrollView.scrollToOffset(cc.v2(this._fTic, 0), 0);
            }
        } else
            this.isTouched = false;
    }

    clickCallback(itemId) {
        let info = this._boxList[itemId];
        console.log('即将跳转的游戏:', itemId + '---data:' + info);
        if (info)
            this.OnPlay(info);
    }

    onBtnClickFunc(e, customData) {
        let info = this._boxList[customData];
        console.log('即将跳转的游戏:', customData + '---data:' + info);
        if (info)
            this.OnPlay(info);
    }

    OnPlay(info) {
        //跳转
        Log.l('OnPlay info', info);
        this.pMoreGameClickEvent && this.pMoreGameClickEvent(info, false);
    }

    onUpdateMoreGame(dt) {
        if (undefined == this.pOnlineParamData) return;
        let curTime = new Date().getTime();
        if (undefined == this._iMoreGameLeftUrlIdx)
            this._iMoreGameLeftUrlIdx = 0;
        if (undefined == this._iMoreGameRightUrlIdx)
            this._iMoreGameRightUrlIdx = 0;
        if (undefined == this._fLastRefreshMoreGameIconTimestamp) {
            this._fLastRefreshMoreGameIconTimestamp = curTime;
            this.refreshMoreGameIcon([this._iMoreGameLeftUrlIdx, this._iMoreGameRightUrlIdx]);
        } else {
            if (10 * 1000 < curTime - this._fLastRefreshMoreGameIconTimestamp) {
                this._iMoreGameLeftUrlIdx++;
                this._fLastRefreshMoreGameIconTimestamp = curTime;
                let moreGameData = this.pOnlineParamData.getMoreGameData();
                if (this._iMoreGameLeftUrlIdx >= moreGameData[0].length)
                    this._iMoreGameLeftUrlIdx = 0;

                this._iMoreGameRightUrlIdx++;
                if (this._iMoreGameRightUrlIdx >= moreGameData[1].length)
                    this._iMoreGameRightUrlIdx = 0;
                this.refreshMoreGameIcon([this._iMoreGameLeftUrlIdx, this._iMoreGameRightUrlIdx]);
            }
        }
    }

    refreshMoreGameIcon(idxs = []) {
        if (undefined == this.pOnlineParamData) return;
        let moreGameData = this.pOnlineParamData.getMoreGameData();
        for (let i = 0, len = idxs.length; i < len; i++) {
            if (undefined == this.pMoreGameSprites[i] || !this.pMoreGameSprites[i].node.active) continue;
            let id = idxs[i];
            let gameData = moreGameData[i][id];
            Log.l('刷新更多游戏i gameData:', i, gameData);
            if (gameData && !cc.sys.isBrowser) {
                let url = gameData.iconlink;
                cc.isValid(this.pMoreGameSprites[i].node) && (this.pMoreGameSprites[i].node.customData = gameData);
                cc.loader.load(url, (err, texture) => {
                    if (!err)
                        cc.isValid(this.pMoreGameSprites[i].node) && (this.pMoreGameSprites[i].spriteFrame = new cc.SpriteFrame(texture, cc.Rect(0, 0, texture.width, texture.height)));
                });
            }
        }
    }

    setOnlineParamData(data) {
        if (undefined != data) {
            this.pOnlineParamData = data;
            this.node.active = (1 == this.pOnlineParamData.getOpenBoxGamesScrollPromotion());
        }
    }

    onMoreGameClickEvent(callFunc) {
        this.pMoreGameClickEvent = callFunc;
    }

    onExitFunc(callFunc) {
        this.pOnDestroy = callFunc;
    }

    // [left  right] ===> [{size:cc.size(), widget:{left:0, top:0, bottom:0, right:0}}, {size:cc.size(), widget:{left:0, top:0, bottom:0, right:0}}]
    /*updateMoreGameNodeProperty(properties = []) {
        for (let i = 0; i < 2; i++) {
            let property = properties[i];
            if (undefined == property) continue;
            if (undefined != property.size)
                this.pMoreGameSprites[i].node.setContentSize(property.size);
            if (undefined != property.widget) {
                let pWidget = this.pMoreGameSprites[i].node.getComponent(cc.Widget);
                if (undefined != property.widget.top) {
                    pWidget.top = property.widget.top;
                    pWidget.isAlignTop = true;
                }
                if (undefined != property.widget.bottom) {
                    pWidget.bottom = property.widget.bottom;
                    pWidget.isAlignBottom = true;
                }
                if (undefined != property.widget.left) {
                    pWidget.left = property.widget.left;
                    pWidget.isAlignLeft = true;
                }
                if (undefined != property.widget.right) {
                    pWidget.right = property.widget.right;
                    pWidget.isAlignRight = true;
                }
            }
        }
    }*/

    onDestroy() {
        this.pOnDestroy && this.pOnDestroy();
    }
}

let pMoreGamesPrefab = null;

function CreateMoreGameNode(f) {
    if (pMoreGamesPrefab) {
        let pMoreGames = cc.instantiate(pMoreGamesPrefab);
        let itemCls = pMoreGames.addComponent(MoreGameComponent);
        return f(itemCls);
    }
    cc.loader.loadRes('/sdk/MoreGamesLayer', cc.Prefab, (error, prefab) => {
        if (!error) {
            let item = cc.instantiate(prefab);
            let itemCls = item.addComponent(MoreGameComponent);
            f(itemCls);
        } else {
            console.error(error);
        }
    });
}