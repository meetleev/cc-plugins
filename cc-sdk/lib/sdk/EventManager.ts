// @author Lee 事件分发
// ----------------------------------------EventListener-----------------------------
class EventListener {
    private readonly _target: object;
    private _listeners: Map<string, Function> = new Map<string, Function>();

    constructor(target: object, listener: Function, event: string) {
        this._target = target;
        this.addListener(event, listener);
    }

    getTarget(): object {
        return this._target;
    }

    getListener(event) {
        return this._listeners.get('$' + event);
    }

    addListener(event, listener) {
        if (null == this.getListener(event))
            this._listeners.set('$' + event, listener);
    }

    removeListener(event: string) {
        this._listeners.delete('$' + event);
    }
}

//  ---------------------------------------EventManager---------------------------------------
export class EventManager {
    private _listeners?: EventListener[];

    /**
     * Listen on the given `event` with `fn`.
     *
     * @param {Object} target
     * @param {Function} fn
     * @param {String} event
     * @api public
     */
    on(target: object, fn: Function, event: string) {
        this._listeners = this._listeners || [];
        let observer = this.hasEventListener(target);
        if (observer && observer.getListener(event)) return;
        if (!observer) {
            observer = new EventListener(target, fn, event);
            this._listeners.push(observer);
        } else
            observer.addListener(event, fn);
    }

    /**
     * Adds an `event` listener that will be invoked a single
     * time then automatically removed.
     * @param {Object} target
     * @param {Function} fn
     * @param {String} event
     * @api public
     */

    /*once(target: object, fn: Function, event: string) {
        this.on(target, () => {
            this.off(target, event);
            fn.apply(this, arguments);
        }, event);
    }*/

    /**
     * Check if this emitter has `event` handlers.
     *
     * @param {Object} target
     * @return {Function}
     * @api private
     */
    private hasEventListener(target: object) {
        if (!target) return null;
        this._listeners = this._listeners || [];
        for (let observer of this._listeners) {
            if (target === observer.getTarget())
                return observer;
        }
        return null;
    }

    /**
     * Emit `event` with the given args.
     *
     * @param {String} event
     * @param args
     */
    emit(event: string, ...args: any[]) {
        this._listeners = this._listeners || [];
        for (let observer of this._listeners) {
            let listener = observer.getListener(event);
            // let args = [].slice.call(arguments, 1);
            if (listener)
                listener.apply(observer.getTarget() || this, args)
        }
    }

    /**
     * Remove the given callback for `eventName` or all
     * registered callbacks.
     * @param {Object} target
     * @param {String} event
     * @api public
     */
    off(target: object, event: string) {
        if (!target) return;
        let observer = this.hasEventListener(target);
        if (observer)
            observer.removeListener(event);
    }

    /**
     * Remove the given callback for all
     * registered callbacks.
     *
     * @param {Object} target
     * @api public
     */
    removeAll(target: object) {
        if (!target) return;
        this._listeners = this._listeners || [];
        for (let i = 0, len = this._listeners.length; i < this._listeners.length;) {
            let observer = this._listeners[i];
            if (target === observer.getTarget()) {
                this._listeners.splice(i, 1);
                len--;
            } else i++;
        }
    }
}

export const eventManager: EventManager = new EventManager();