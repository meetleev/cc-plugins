'use strict';
const Path = require('fire-path');
const Fs = require('fire-fs');
const WECHAT = 'wechatgame';

function onBuildFinish(dest) {
    let subpackagesPath = Path.join(dest, 'res/raw-assets/game.js');
    Fs.ensureFile(subpackagesPath);

    let jsonPath = Path.join(dest, 'game.json');
    let contents = Fs.readFileSync(jsonPath, 'utf8');
    contents = contents.replace(/\"deviceOrientation\"/, ' \"subpackages\":[{\"name\":\"raw-assets\",\"root\":\"res/raw-assets\"}],\n    \"deviceOrientation\"');
    Fs.writeFileSync(jsonPath, contents);


    let jsPath = Path.join(dest, 'game.js');
    let jsContent = Fs.readFileSync(jsPath, 'utf8');
    jsContent = jsContent.replace(/window\.boot\(\)/, 'if (wx.loadSubpackage) \n    wx.loadSubpackage({ name: \'raw-assets\', success(res) {window.boot();}, fail(res) {} });\nelse \n    window.boot()');
    Fs.writeFileSync(jsPath, jsContent);
}

module.exports = {
    load() {
        // execute when package loaded
    },

    unload() {
        // execute when package unloaded
    },

    // register your ipc messages here
    messages: {
        'open'() {
            // open entry panel registered in package.json
            Editor.Panel.open('cc-wx-subpackages');
        },
        'clicked'() {
            Editor.log('Button clicked!');
        }, 'editor:build-finished'(e, options) {
            // Editor.log('editor:build-finished ~~~~~~~~~', options);
            if (WECHAT == options.platform)
                onBuildFinish(options.dest);
        }
    },
};