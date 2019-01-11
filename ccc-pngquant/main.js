'use strict';
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const Path = require('fire-path');
const Globby = require('globby');
// const Fs = require('fire-fs');
// const Del = require('del');
// const Async = require('async');

function imageCompress(dest) {
    dest = dest.replace(/\\/g, '/');
    let pattern = Path.join(dest, '**/*.{jpg,png}');
    let paths = Globby.sync(pattern, {});
    for (let p of paths) {
        let tmpdest = p;
        tmpdest = tmpdest.slice(0, tmpdest.lastIndexOf('/'));
        imagemin([p], tmpdest, {
            plugins: [
                imageminJpegtran(),
                imageminPngquant({quality: '60-80'})
            ]
        }).then(() => {
            Editor.log('Images optimized');
        });
    }
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
            cc.log('editor:build-finished ~~~~~~~~~', options);
            imageCompress(options.dest);
        }
    },
};