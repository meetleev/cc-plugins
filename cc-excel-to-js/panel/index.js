// panel/index.js, this filename needs to match the one registered in package.json
const SRC_DIR = 'SRC_DIR';
const DEST_DIR = 'DEST_DIR';
Editor.Panel.extend({
    // css style for panel
    style: `
    :host { margin: 5px; }
    h2 { color: #f90; }
  `,

    // html template for panel
    template: `
    <h2>${Editor.T('cc-excel-to-js.title')}</h2>
    <hr/>
    ${Editor.T('cc-excel-to-js.srcDir')}<div><ui-input id="srcLabel" readonly></ui-input>
    <ui-button id="btnSrcChoice">${Editor.T('cc-excel-to-js.browse')}</ui-button>
    </div>
    <hr/>
    ${Editor.T('cc-excel-to-js.destDir')}<div ><ui-input id="destLabel" readonly></ui-input>
    <ui-button id="btnDestChoice">${Editor.T('cc-excel-to-js.browse')}</ui-button>
    </div>
    <hr/>
    <ui-checkbox id="checkboxRemember">${Editor.T('cc-excel-to-js.rememberSettings')}</ui-checkbox>
    <ui-button id="btnBuild">${Editor.T('cc-excel-to-js.build')}</ui-button>
  `,

    // element and variable binding
    $: {
        btnBuild: '#btnBuild',
        btnSrcChoice: '#btnSrcChoice',
        btnDestChoice: '#btnDestChoice',
        checkboxRemember: '#checkboxRemember',
        srcLabel: '#srcLabel',
        destLabel: '#destLabel',
    },

    // method executed when template and styles are successfully loaded and initialized
    ready() {
        let scrDir = localStorage.getItem(SRC_DIR);
        let destDir = localStorage.getItem(DEST_DIR);
        if (null != scrDir && 0 < scrDir.length)
            this.$srcLabel.value = scrDir;
        if (null != destDir && 0 < destDir.length)
            this.$destLabel.value = destDir;
        this.$checkboxRemember.checked = null != scrDir && 0 < scrDir.length && null != destDir && 0 < destDir.length;
        this.$btnSrcChoice.addEventListener('confirm', () => {
            Editor.Ipc.sendToMain('cc-excel-to-js:choiceSourceDirOrFile');
        });
        this.$btnDestChoice.addEventListener('confirm', () => {
            Editor.Ipc.sendToMain('cc-excel-to-js:choiceOutDir');
        });
        this.$btnBuild.addEventListener('confirm', () => {
            this.checkRememberSettings();
            Editor.Ipc.sendToMain('cc-excel-to-js:excelToJS');
        });
        Editor.Ipc.sendToMain('cc-excel-to-js:excelToJSReady', scrDir, destDir);
        // this.$checkboxRemember.addEventListener('confirm', (e) => {
        //     // Editor.Ipc.sendToMain('cc-excel-to-js:excelToJS');
        //     this.checkRememberSettings();
        // });
    },

    checkRememberSettings() {
        if (this.$checkboxRemember.checked) {
            '' !== this.$srcLabel.value && localStorage.setItem(SRC_DIR, this.$srcLabel.value);
            '' !== this.$destLabel.value && localStorage.setItem(DEST_DIR, this.$destLabel.value);
        } else {
            localStorage.removeItem(SRC_DIR);
            localStorage.removeItem(DEST_DIR);
        }
    },

    // register your ipc messages here
    messages: {
        'cc-excel-to-js:onChoiceSourceDirOrFile'(event, data) {
            // Editor.log('onChoiceSourceDirOrFile', data);
            this.$srcLabel.value = data;
        },
        'cc-excel-to-js:onChoiceOutDir'(event, data) {
            // Editor.log('onChoiceOutDir ', data);
            this.$destLabel.value = data;
        }
    }
});