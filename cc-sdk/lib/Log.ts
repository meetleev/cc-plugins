let bDebug = true;

export class Log {
    static l(...args:any[]) {
        if ('object' === typeof console && console.log) {
            // let args = [].slice.call(arguments);
            args.unshift('[SDK_NAME debug]-> ');
            if (bDebug)
                console.log.apply(console, args);
        }
    }

    static i(...args:any[]) {
        if ('object' === typeof console && console.info) {
            // let args = [].slice.call(arguments);
            args.unshift('[SDK_NAME info]-> ');
            if (bDebug)
                console.info.apply(console, args);
        }
    }

    static w(...args:any[]) {
        if ('object' === typeof console && console.warn) {
            // let args = [].slice.call(arguments);
            args.unshift('[SDK_NAME warning]-> ');
            if (bDebug)
                console.warn.apply(console, args);
        }
    }

    static e(...args:any[]) {
        if ('object' === typeof console && console.error) {
            // let args = [].slice.call(arguments);
            args.unshift('[SDK_NAME error]-> ');
            if (bDebug)
                console.error.apply(console, args);
        }
    }

    static setDebug(debug) {
        bDebug = debug;
    }
}