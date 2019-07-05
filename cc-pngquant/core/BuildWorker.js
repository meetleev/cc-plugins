/* jslint node: true, sub: true, esversion: 6, browser: true */
/* globals Editor */

"use strict";
// const Fs = require('fire-fs');
// const Del = require('del')

const {WorkerBase, registerWorker} = require('./WorkerBase');

const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const Path = require('fire-path');
const Globby = require('globby');

class BuildWorker extends WorkerBase {
    run(callback) {
        Editor.Ipc.sendToAll('cc-pngquant:state-changed', 'start', 0);
        this._callback = callback;
        this.imageCompress(this._opts.dest);
    }

    imageCompress(dest) {
        dest = dest.replace(/\\/g, '/');
        let pattern = Path.join(dest, '**/*.{jpg,png}');
        let paths = Globby.sync(pattern, {});
        let filesCounts = paths.length;
        let idx = 0;
        let newPaths = [];
        for (let p of paths) {
            let tmpdest = p;
            tmpdest = tmpdest.slice(0, tmpdest.lastIndexOf('/'));
            let last2Dir = tmpdest.slice(tmpdest.lastIndexOf('/') + 1, tmpdest.length);
            if (last2Dir.match(/\.bundle/g)) {
            } else {
                newPaths.push(p);
            }
        }
        filesCounts = newPaths.length;
        for (let p of newPaths) {
            let tmpdest = p;
            tmpdest = tmpdest.slice(0, tmpdest.lastIndexOf('/'));
            imagemin([p], tmpdest, {
                plugins: [
                    imageminJpegtran(),
                    imageminPngquant({quality: '60-80'})
                ]
            }).then(() => {
                this._updateProgress(1 / filesCounts);
                idx++;
                if (idx == filesCounts) {
                    this._callback && this._callback();
                    Editor.Ipc.sendToAll('cc-pngquant:state-finished', this._opts);
                }
            });
        }
    }
}

registerWorker(BuildWorker, 'run-build-worker');
