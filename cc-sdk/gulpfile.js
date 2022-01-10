const gulp = require('gulp');
const Concat = require('gulp-concat');
const Babel = require("gulp-babel");
const Wrap = require('gulp-wrap');
const Replace = require('gulp-replace');
const Del = require('del');
const fs = require('fs-extra');
const ps = require('path');
const realFs = require('fs');
const rollup = require("rollup");
const commonjs = require('@rollup/plugin-commonjs');
const rpBabel = require('@rollup/plugin-babel');
const babel_preset_env = require('@babel/preset-env');
const babel_preset_typescript = require('@babel/preset-typescript');
const {nodeResolve} = require('@rollup/plugin-node-resolve');
const babel_plugin_transform_for_of = require('@babel/plugin-transform-for-of');
const rollup_plugin_terser = require("rollup-plugin-terser");

const json = JSON.parse(fs.readFileSync('./package.json'));
const SDK_NAME = json.sdkName;
let dependenciesFiles = [
    'lib/crypto-js/crypto-js-min.js',
];

function buildSDKCryptoDependencies() {
    return gulp.src(dependenciesFiles)
        .pipe(Concat('crypto-js.js'))
        .pipe(gulp.dest('bin/'))
}


let dependenciesConfigFiles = [
    './lib/SDKConfig.js',
];

function buildSDKConfigDependencies() {
    return gulp.src(dependenciesConfigFiles)
        .pipe(Concat('SDKConfig.js'))
        .pipe(Babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(Wrap({src: 'lib/template.txt'}, {variable: 'data'}))
        .pipe(Replace(/SDK_NAME/g, SDK_NAME))
        // .pipe(Uglify({
        //     mangle: {
        //         eval: true, toplevel: false, properties: {regex: /^_/},
        //     },
        //     compress: {
        //         unused: true,
        //         keep_fargs: false,
        //         unsafe: true
        //     },
        //     keep_classnames:true,
        //     output: {
        //         beautify: true,
        //     }
        //
        // }))
        .pipe(gulp.dest('bin/'))
}

async function buildSDKScripts() {
    const engineRoot = ps.resolve(__dirname);
    const realpath = typeof realFs.realpath.native === 'function' ? realFs.realpath.native : realFs.realpath;
    const realPath = (file) => new Promise((resolve, reject) => {
        realpath(file, (err, path) => {
            if (err && err.code !== 'ENOENT') {
                reject(err);
            } else {
                resolve(err ? file : path);
            }
        });
    });
    const bundle = await rollup.rollup({
        input: './lib/index.ts',
        plugins: [
            nodeResolve({
                extensions: ['.ts', '.js'],
                jail: await realPath(engineRoot),
                rootDir: engineRoot,
                modulesOnly: true,
            }),
            commonjs({/*extensions: ['.ts'], exclude: ["lib/!**!/!*.js"]*/}),
            rpBabel.babel({
                extensions: ['.ts', '.js'],
                babelHelpers: 'bundled',
                comments: false,
                exclude: ['node_modules/!**'],
                // include: ["exports/!**!/!*.ts"],
                plugins: [
                    [babel_plugin_transform_for_of.default, {assumeArray: true}],
                ],
                presets: [
                    [babel_preset_env.default, {loose: true,}],
                    [babel_preset_typescript]/*['@cocos/babel-preset-cc']*/]
            }),
            rollup_plugin_terser.terser({
                compress: {
                    reduce_funcs: false,
                    keep_fargs: false,
                    unsafe_Function: true,
                    unsafe_math: true,
                    unsafe_methods: true,
                    passes: 2, // first: remove deadcodes and const objects, second: drop variables
                },
                mangle: {
                    eval: true, toplevel: false, properties: {regex: /^_/},
                },
                keep_fnames: false,
                /*output: {
                    beautify: false,
                },*/
                toplevel: false,
            }),
        ]
    });

    const rollupOutput = await bundle.write({
        file: `./bin/${SDK_NAME}.js`,
        format: 'iife',
        esModule: false,
        sourcemap: false,
        name: SDK_NAME,
    });
    // console.log('rp', rollupOutput)
}

function clean() {
    return Del(['./bin/*']);
}

exports.clean = gulp.series(clean);

async function buildAPI() {
    const outDir = ps.join('bin'/*, '.declarations'*/);
    await fs.emptyDir(outDir);
    return require('./lib/generate-declarations.js').generate({
        engine: __dirname,
        outDir,
        withIndex: true,
        withExports: false,
        withEditorExports: true,
    });
}

exports.buildAPI = gulp.series(buildAPI);
exports.buildSDKSrcs = gulp.series(buildSDKScripts);
exports.default = exports.build = gulp.series(clean, /*buildSDKCryptoDependencies, buildSDKConfigDependencies,*/ buildAPI, buildSDKScripts);