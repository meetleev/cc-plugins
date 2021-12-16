## Usage
  **creator项目将bin目录下的文件拷贝到自己的目录以插件形式引入**

  * `SDKConfig.js` 为sdk配置文件 (可选), 配置私钥、appkey、version等
  * `crypto-js.js` 第三方加密库
  * `js-pfu.js` sdk核心库 必选
  * `ui` 依赖资源文件夹 必选, 将其下pfu文件夹拷贝到**resources**文件夹下
  ---
  * **sdk 初始化**

    * 初始场景onLoad写入**`pfu.sdkMgr.init();`**

    * SDKConfig.js文件不引入时**`pfu.sdkMgr.initSdkConfig(Object config);`** config内容格式同SDKConfig.js文件的`config`变量

    **参数**

    Object config

      属性 | 类型 | 必填 | 说明
      :-|:-|:-|:-
      version|string|否|游戏参数版本号，用来控制运营后台参数
      appId|number|否|嘉丰永道appId
      wx_app_key|string|是|微信平台小游戏Id, 微信平台必填
      pfuPrivateKey|string|是|嘉丰永道分配给合作方的私钥
      pkgName|string|是|包名，oppo小游戏等
      adsVideoId|string|否|微信视频广告Id
      adsBannerId|string|否|微信Banner广告Id
      wxJumpAppIdList|Array|否|微信可跳转appId列表, 长度10
      mta_cfg|Object|否|腾讯统计分析

    Object mta_cfg

    属性 | 类型 | 必填 | 说明
    :-|:-|:-|:-
    eventID|string|是|腾讯统计分析eventID
    appId|string|是|腾讯统计分析appId

  * **监听前/后台事件**

    `pfu.sdkMgr.on(string event, function fn, Object target)`

    `pfu.sdkMgr.off(string event, function fn, Object target)`

    **参数**

    属性 | 类型 | 必填 | 说明
    :-|:-|:-|:-
    event|string|是|事件 cc.game.EVENT_HIDE / cc.game.EVENT_SHOW
    fn|function|是|回调函数
    target|Object|否|context this

  * **info服HTTP数据请求**

    `pfu.sdkMgr.requestInfoData(Object obj)`

    **参数**

    Object obj

    属性 | 类型 | 必填 | 说明
    :-|:-|:-|:-
    xyid|number|是|协议号
    responseCallBack|function|是|回调函数
    data|Object|是| 请求数据
    bRepeat|Bool|是| 该消息是否允许多次请求

  * ~~**在线参数回调**~~

    `pfu.sdkMgr.onPFUOnlineParametersResponse((pOnlineParamData) => {})`

    pOnlineParamData详见本文下方扩展类`OnlineParamData`

  * **sdk 登录**

    * 强制授权模式，获取用户信息

      `pfu.sdkMgr.loginWithAuthorize((pPlayer) => {})`

    * 非强制授权，若用户之前没给服务器上传过个人信息，其将无法正常获取

    `pfu.sdkMgr.login()`

    pPlayer详见本文下方扩展类`Player`

  * ~~**sdk 分享**~~

    `pfu.sdkMgr.shareAppMessage(Object object)`

    **参数**

    Object object

      属性 | 类型 | 必填 | 说明
      :-|:-|:-|:-
      desc|string|否|转发标题，不传则默认使用在线参数配置。
      shareLink|string|否|图片分享链接，不传则默认使用在线参数配置
      query|string|否|查询字符串，必须是 key1=val1&key2=val2 的格式
      success|function|否|成功回调函数
      fail|function|否|失败回调函数

  * ~~**sdk 激励视频**~~

    `pfu.sdkMgr.showRewardedVideoAd(Object object)`

    **参数**

    Object object

      属性 | 类型 | 必填 | 说明
      :-|:-|:-|:-
      adsVideoId|string|否|激励视频id, 默认在线参数配置
      bForceFilterShare|bool|否|是否强制过滤视频前分享，默认false
      success|function|否|成功回调函数
      fail|function|否|失败回调函数
      close|function|否|视屏播放未结束用户关闭回调函数

  * ~~**sdk banner**~~
    * banner显示、创建

        `pfu.sdkMgr.showBannerAds(Bool bForceNew, function fail)`

        **参数**

        属性 | 类型 | 必填 | 默认值 | 说明
        :-|:-|:-|:-|:-
        bForceNew|Bool|否|false|是否新强制创建banner
        fail|function|否||banner加载失败回调函数

    * banner隐藏

      `pfu.sdkMgr.hideBannerAds()`

    * banner销毁

      `pfu.sdkMgr.destroyBannerAds()`

  * ~~**微信左上角转发**~~

  * ~~**更多游戏**~~

    `pfu.sdkMgr.showMoreGameNode(Node parentNode)`

    **参数**

    属性 | 类型 | 必填 | 说明
    :-|:-|:-|:-
    parentNode|Node|否|其父节点，默认为场景根节点

  * **other**
    * 根据某项属性(keyword)判断是否为新的1天, 可用于签到等, 返回值bool

      `pfu.sdkMgr.isNewDay(keyword)`

    * ~~后台设置的视频前分享次数是否用完,返回值bool~~

      `pfu.sdkMgr.isUseOutShareCounts()`

    * 上传个人信息

      `pfu.sdkMgr.uploadUserInfo(Object obj)`

      **参数**

      属性 | 类型 | 必填 | 说明
      :-|:-|:-|:-
      level|Number|否|等级
      energy|Number|否|体力
      coin|Number|否|辅助货币
      pic|Number|否|玩家头像本地icon 索引
      ingot|Number|否|钻石

  * **扩展**
    * **适配 ScreenUtil类**
        - 是否为全面屏

        `pfu.screenUtil.isQuanMian()`

        - 是否为刘海屏

        `pfu.screenUtil.isLiuHai()`

        - 向左|右|上|下对齐， pNode下面必须下挂Widget组件, px 为像素

        `pfu.screenUtil.to{Left|Right|Top|Bottom}ByPx(Node pNode, Number px = 0, bool bRelativeOffset = true)`

        - 向左|右|上|下对齐， pNode下面必须下挂Widget组件, px 为百分比, bRelativeOffset 是否在原来的偏移量上做增量

        `pfu.screenUtil.to{Left|Right|Top|Bottom}ByPercent(Node pNode, Number per = 0)`

    * ~~**OnlineParamData在线参数类**~~

        API | 说明
        :-|:-
        OnlineParamData.getOrgOnlineParamObject|在线参数, 原始json转换成的obj
        OnlineParamData.getWXOfficialAccountData|公众号

    * **Player玩家类**

        API | 说明
        :-|:-
        Player.getUid|pfu uid
        Player.sessionKey|微信 sessionKey
        Player.getToken|登录其他服鉴权token
        Player.getLevel|等级
        Player.getEnergy|体力
        Player.getCoin|辅助货币
        Player.getIngot|钻石
        Player.getPickUrl|玩家头像url地址
        Player.getSex|性别
        Player.getName|昵称
        Player.getRegisterTime|注册日期
        Player.getServerTime|当前日期
        Player.getPic|玩家头像本地icon 索引

    * **腾讯分析mta组件(可选)**
        - 初始化

          appid等配置到SDKConfig文件即可， sdk初始化时会自动集成

        - 事件统计

          `pfu.sdkMgr.logTencentAnalysisEvent(string eventId, Object query)`

          **参数**

          属性 | 类型 | 必填 | 默认值 | 说明
          :-|:-|:-|:-|:-
          eventId|string|是||事件id
          query|Object|否|{}|query