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
    let workerUrl = 'packages://cc-pngquant/core/BuildWorker';
    _runWorker(workerUrl, 'cc-pngquant:run-build-worker', opt);
}

function onBeforeBuildFinish(dest){
    Editor.log('onBeforeBuildFinish exec!', dest);
}

module.exports = {
    load () {
    },

    unload () {
    },
    // register your ipc messages here
    messages: {
        // 'open'() {
        //     // open entry panel registered in package.json
        //     Editor.Panel.open('cc-pngquant');
        // },
        // 'say-hello'() {
        //     Editor.log('Hello World!');
        //     // send ipc message to panel
        //     Editor.Ipc.sendToPanel('cc-pngquant', 'cc-pngquant:hello');
        // },
        'clicked'() {
            Editor.log('Button clicked!');
        },
        'editor:build-finished'(e, options) {
            // Editor.log('editor:build-finished ~~~~~~~~~', options);
            _build_image_compress(options);
        }, 'cc-pngquant:state-changed'(e, info, progress) {
            // Editor.log('editor:state-changed ~~~~~~~~~',info);
        }, 'cc-pngquant:state-finished'(e, options) {
            Editor.log('cc-pngquant:state-finished ~~~~~~~~~');
            onBeforeBuildFinish(options);
        },
    },
};