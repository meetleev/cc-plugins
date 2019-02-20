'use strict';
const TIMEOUT = -1;
const DEBUG_WORKER = false;

function _runWorker(url, message, opts) {
    let buildWorker;
    Editor.App.spawnWorker(url, (worker) => {
        buildWorker = worker;
        buildWorker.send(message, opts, (err) => {
            if (err) {
                Editor.error(err);
            }
            if (buildWorker) {
                buildWorker.close();
            }
            buildWorker = null;
        }, TIMEOUT);
    }, DEBUG_WORKER);
}

function _build_image_compress(opt) {
    let workerUrl = 'packages://ccc-pngquant/core/BuildWorker';
    _runWorker(workerUrl, 'ccc-pngquant:run-build-worker', opt);
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
        // 'open'() {
        //     // open entry panel registered in package.json
        //     Editor.Panel.open('ccc-pngquant');
        // },
        // 'say-hello'() {
        //     Editor.log('Hello World!');
        //     // send ipc message to panel
        //     Editor.Ipc.sendToPanel('ccc-pngquant', 'ccc-pngquant:hello');
        // },
        'clicked'() {
            Editor.log('Button clicked!');
        },
        'editor:build-finished'(e, options) {
            // Editor.log('editor:build-finished ~~~~~~~~~', options);
            _build_image_compress(options);
        }, 'ccc-pngquant:state-changed'(e, info, progress) {
            // Editor.log('editor:state-changed ~~~~~~~~~',info);
        }, 'ccc-pngquant:state-finished'(e) {
            Editor.log('ccc-pngquant:state-finished ~~~~~~~~~');
        },
    },
};