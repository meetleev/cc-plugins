import {instantiate, Node, NodePool, log, Prefab} from 'cc';

/*class PoolObject {

}*/

export type ObjectType = number;

export class ObjectPoolsMgr {
    private _nodePoolMap: Map<ObjectType, NodePool> = new Map<ObjectType, NodePool>();
    private static instance: ObjectPoolsMgr;

    static get Instance() {
        if (null == ObjectPoolsMgr.instance)
            ObjectPoolsMgr.instance = new ObjectPoolsMgr();
        return ObjectPoolsMgr.instance;
    }

    private constructor() {
    }

    getObjectFromPool(objectType: ObjectType) {
        if (this._nodePoolMap.has(objectType)) {
            let nodePool = this._nodePoolMap.get(objectType);
            if (nodePool) {
                let node = nodePool.get();
                if (0 == nodePool.size()) {
                    log('pool get out', objectType);
                    node && nodePool.put(instantiate(node));
                }
                return node;
            }
            return this._nodePoolMap.get(objectType)?.get();
        }
        return null;
    }

    initObjectToPool(objectType: ObjectType, obj: Node | Prefab, count: number) {
        for (let i = 0; i < count; i++)
            this.putObjectToPool(objectType, instantiate(obj) as Node);
    }

    putObjectToPool(objectType: ObjectType, obj: Node) {
        let nodePool: NodePool;
        if (!this._nodePoolMap.has(objectType)) {
            nodePool = new NodePool();
            this._nodePoolMap.set(objectType, nodePool);
        } else {
            nodePool = this._nodePoolMap.get(objectType) as NodePool;
        }
        obj && nodePool?.put(obj);
    }

    clearObjectPool(objectType: ObjectType) {
        if (this._nodePoolMap.has(objectType))
            this._nodePoolMap.get(objectType)?.clear();
    }
}