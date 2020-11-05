'use strict';
const Path = require('fire-path');
const Fs = require('fire-fs');
const {exec} = require('child_process');
let sourceDir = '';
let destDir = '';
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
            Editor.Panel.open('cc-excel-to-js');
        },
        'choiceSourceDirOrFile'() {
            let res = Editor.Dialog.openFile({
                title: "选择Excel存放目录或者文件",
                defaultPath: '' !== sourceDir ? sourceDir : Path.join(Editor.Project.path, "assets"),
                properties: ['openDirectory'],
            });
            if (res !== -1) {
                let dir = res[0];
                if (dir !== sourceDir) {
                    sourceDir = dir;
                    Editor.Ipc.sendToPanel('cc-excel-to-js', 'cc-excel-to-js:onChoiceSourceDirOrFile', sourceDir);
                }
            }
        },
        'choiceOutDir'() {
            let res = Editor.Dialog.openFile({
                title: "选择Excel存放目录或者文件",
                defaultPath: '' !== destDir ? destDir : Path.join(Editor.Project.path, "assets"),
                properties: ['openDirectory'],
            });
            if (res !== -1) {
                let dir = res[0];
                if (dir !== destDir) {
                    destDir = dir;
                    Editor.Ipc.sendToPanel('cc-excel-to-js', 'cc-excel-to-js:onChoiceOutDir', destDir);
                }
            }
        },
        'excelToJSReady'(e, src, dest) {
            sourceDir = src;
            destDir = dest;
            // Editor.log('excelToJSReady: ', src, dest);
        },
        'excelToJS'() {
            if (Fs.existsSync(sourceDir) && Fs.existsSync(destDir)) {
                let cmd = Path.join(Editor.Package.packagePath('cc-excel-to-js'), "process/ExcelToJS.exe")
                let workerProcess = exec(`${cmd} -s ${sourceDir} -d ${destDir}`);

                // 打印正常的后台可执行程序输出
                workerProcess.stdout.on('data', function (data) {
                    // Editor.log('stdout: ' + data);
                });

                // 打印错误的后台可执行程序输出
                workerProcess.stderr.on('data', function (data) {
                    Editor.log('stderr: ' + data);
                });

                // 退出之后的输出
                workerProcess.on('close', function (code) {
                    // Editor.log('out code：' + code);
                    Editor.assetdb.refresh(Editor.assetdb.fspathToUrl(destDir))
                    Editor.Panel.close('cc-excel-to-js');
                    Editor.Dialog.messageBox({message: `${Editor.T('cc-excel-to-js.success')}`});
                });
            } else {
                Editor.Dialog.messageBox({message: `${Editor.T('cc-excel-to-js.dirError')}`});
            }
        }
    },
};