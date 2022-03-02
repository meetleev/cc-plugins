class LinkedListNode<T> {
    value: T = null;
    next: LinkedListNode<T> = null;

    constructor(value: T, next?: LinkedListNode<T>) {
        this.value = value;
        this.next = next;
    }
}

export class LinkedList<T> {
    private _head: LinkedListNode<T> = null;
    private _size: number = 0;

    get size(): number {
        return this._size;
    }

    constructor() {
    }

    push(value: T): void {
        if (null == this._head) {
            this._head = new LinkedListNode<T>(value);
        } else {
            let cur = this._head;
            while (null != cur.next) {
                cur = cur.next;
            }
            cur.next = new LinkedListNode<T>(value);
        }
        this._size++;
    }

    remove(value: T): void {
        if (null != this._head) {
            if (value == this._head.value) {
                this._head = this._head.next;
                this._size--;
            } else {
                let cur = this._head;
                while (null != cur.next) {
                    if (value == cur.next.value) {
                        cur.next = cur.next.next;
                        this._size--;
                        break;
                    }
                    cur = cur.next;
                }
            }
        }
    }

    insertAt(position: number, value: T): void {
        if (0 > position || this._size < position)
            throw new Error('.insertAt expects a position num <= linked list size');
        if (0 == position) return this.push(value);
        let counter = 1;
        let pre = this._head;
        while (counter < position) {
            counter++;
            pre = pre.next;
        }
        pre.next = new LinkedListNode<T>(value, pre.next);
        this._size++;
    }

    removeAt(position: number): LinkedListNode<T> | null {
        if (0 > position || this._size <= position) return null;
        if (0 == position) {
            this._head = this._head.next;
            this._size--;
            return this._head;
        }

        let counter = 1;
        let pre = this._head;
        while (counter < position) {
            counter++;
            pre = pre.next;
        }
        const removed = pre.next;
        pre.next = pre.next.next;
        this._size--;
        return removed;
    }

    find(value: T) {
        if (null != this._head) {
            let cur = this._head;
            let idx = 0;
            while (null != cur.next) {
                if (value == cur.next.value)
                    break;
                cur = cur.next;
                idx++;
            }
            return idx;
        }
        return -1;
    }
}

// https://blog.csdn.net/qq_28387069/article/details/111051337
// https://github.com/datastructures-js/linked-list/