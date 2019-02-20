/* jslint node: true, sub: true, esversion: 6, browser: true */
/* globals Editor */

"use strict";

const Electron = require('electron');

class WorkerBase {
    constructor(opts) {
        this._progress = 0;
        this._opts = opts;
        // this._debug = opts.debug;
    }


    _updateProgress(step) {
        this._progress += step;
        Editor.Ipc.sendToAll('cc-pngquant:state-changed',
            'progress ' + Math.floor(this._progress * 100) + '%',
            this._progress);
    }
}


function registerWorker(workerClass, runEvent) {
    Electron.ipcRenderer.on('cc-pngquant:' + runEvent, (event, opts) => {
        let worker = new workerClass(opts);
        worker.run(() => {
            event.reply();
        });
    });
}

module.exports.WorkerBase = WorkerBase;
module.exports.registerWorker = registerWorker;

