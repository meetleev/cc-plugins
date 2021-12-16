/**
 * Get property descriptor in object and all its ancestors.
 */
export function getPropertyDescriptor (object: any, propertyName: string) {
    while (object) {
        const pd = Object.getOwnPropertyDescriptor(object, propertyName);
        if (pd) {
            return pd;
        }
        object = Object.getPrototypeOf(object);
    }
    return null;
}

function _copyprop (name: string, source: any, target: any) {
    const pd = getPropertyDescriptor(source, name);
    if (pd) {
        Object.defineProperty(target, name, pd);
    }
}

/**
 * Copy all properties from arguments[1...n] to object.
 * @return The result object.
 */
export function mixin (object?: any, ...sources: any[]) {
    object = object || {};
    for (const source of sources) {
        if (source) {
            if (typeof source !== 'object') {
                continue;
            }
            for (const name in source) {
                _copyprop(name, source, object);
            }
        }
    }
    return object;
}