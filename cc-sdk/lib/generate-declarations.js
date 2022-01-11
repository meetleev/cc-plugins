const fs = require('fs-extra');
const ts = require('typescript');
const gift = require('tfig');
const ps = require("path");

async function getSourceEntries(engine) {
    const result = {};
    const entryRootDir = ps.join(engine, 'exports');
    const entryFileNames = await fs.readdir(entryRootDir);
    for (const entryFileName of entryFileNames) {
        const entryExtName = ps.extname(entryFileName);
        if (!entryExtName.toLowerCase().endsWith('.ts')) {
            continue;
        }
        const entryBaseNameNoExt = ps.basename(entryFileName, entryExtName);
        const entryName = `ccx.${entryBaseNameNoExt}`;
        result[entryName] = `exports/${entryBaseNameNoExt}`;
    }
    return result;
}

async function generate(options) {
    console.log(`Typescript version: ${ts.version}`);

    const {rootDir, outDir, rootModuleName} = options;
    fs.ensureDirSync(outDir);

    const tsConfigPath = ps.join(rootDir, 'tsconfig.json');

    const unbundledOutFile = ps.join(outDir, `before-rollup.js`);
    const parsedCommandLine = ts.getParsedCommandLineOfConfigFile(
        tsConfigPath, {
            declaration: true,
            noEmit: false,
            emitDeclarationOnly: true,
            outFile: unbundledOutFile,
            outDir: undefined,
        }, {
            onUnRecoverableConfigFileDiagnostic: () => {
            },
            useCaseSensitiveFileNames: ts.sys.useCaseSensitiveFileNames,
            readDirectory: ts.sys.readDirectory,
            getCurrentDirectory: ts.sys.getCurrentDirectory,
            fileExists: ts.sys.fileExists,
            readFile: ts.sys.readFile,
        }
    );

    // console.log('parsedCommandLine', parsedCommandLine);
    const outputJSPath = ps.join(ps.dirname(tsConfigPath), unbundledOutFile);
    console.log('outputJSPath', outputJSPath);

    const extName = ps.extname(outputJSPath);
    if (extName !== '.js') {
        console.error(`Unexpected output extension ${extName}, please check it.`);
        return undefined;
    }
    const dirName = ps.dirname(outputJSPath);
    const baseName = ps.basename(outputJSPath, extName);
    const destExtensions = [
        '.d.ts',
        '.d.ts.map',
    ];
    for (const destExtension of destExtensions) {
        const destFile = ps.join(dirName, baseName + destExtension);
        if (fs.existsSync(destFile)) {
            console.log(`Delete old ${destFile}.`);
            fs.unlinkSync(destFile);
        }
    }

    console.log(`Generating...`);

    const program = ts.createProgram(parsedCommandLine.fileNames, parsedCommandLine.options);
    const emitResult = program.emit(
        undefined, // targetSourceFile
        undefined, // writeFile
        undefined, // cancellationToken,
        true, // emitOnlyDtsFiles
        undefined, // customTransformers
    );

    let allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);
    for (const diagnostic of allDiagnostics) {
        let printer;
        switch (diagnostic.category) {
            case ts.DiagnosticCategory.Error:
                printer = console.error;
                break;
            case ts.DiagnosticCategory.Warning:
                printer = console.warn;
                break;
            case ts.DiagnosticCategory.Message:
            case ts.DiagnosticCategory.Suggestion:
            default:
                printer = console.log;
                break;
        }
        if (!printer) {
            continue;
        }
        if (diagnostic.file) {
            let {line, character} = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
            let message = ts.flattenDiagnosticMessageText(diagnostic.messageText);
            printer(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
        } else {
            printer(`${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`);
        }
    }

    const tscOutputDtsFile = ps.join(dirName, baseName + '.d.ts');
    console.log('tscOutputDtsFile', tscOutputDtsFile)
    if (!fs.existsSync(tscOutputDtsFile)) {
        console.error(`Failed to compile.`);
        return false;
    }

    const types = parsedCommandLine.options.types.map((typeFile) => `${typeFile}.d.ts`);
    console.log('types', types);
    types.forEach((file) => {
        const destPath = ps.join(outDir, ps.isAbsolute(file) ? ps.basename(file) : file);
        fs.ensureDirSync(ps.dirname(destPath));
        fs.copyFileSync(file, destPath);
    });

    const entryMap = await getSourceEntries(rootDir);
    console.log('entryMap', entryMap);
    const entries = Object.keys(entryMap);

    const dtsFile = ps.join(dirName, 'virtual-dts.d.ts');
    await (async () => {
        const ccModules = entries.slice().map((extern) => entryMap[extern]);
        const code = `declare module 'ccx' {\n${ccModules.map((moduleId) => `    export * from "${moduleId}";`).join('\n')}\n}`;
        await fs.writeFile(dtsFile, code, {encoding: 'utf8'});
    })();

    console.log(`Bundling...`);
    let cleanupFiles = [tscOutputDtsFile, dtsFile];
    try {
        const giftInputPath = tscOutputDtsFile;
        const giftOutputPath = ps.join(dirName, `${rootModuleName}.d.ts`);
        const giftResult = gift.bundle({
            input: [giftInputPath, dtsFile],
            /*name: 'cc',
            rootModule: 'index',*/
            entries: {
                'ccx': 'ccx',
            },
            groups: [
                // {test: /^cc\/.*$/, path: path.join(dirName, 'index.d.ts')},
                {test: /^ccx.*$/, path: giftOutputPath},
            ],
        });
        await Promise.all(giftResult.groups.map(async (group) => {
            let code = group.code.replace(/(module\s+)\"(.*)\"(\s+\{)/g, `$1${rootModuleName}$3`)
            await fs.outputFile(group.path, code, {encoding: 'utf8'});
        }));
    } catch (error) {
        console.error(error);
        return false;
    } finally {
        await Promise.all((cleanupFiles.map(async (file) => fs.unlink(file))));
    }
    return true;
}

module.exports = {generate};