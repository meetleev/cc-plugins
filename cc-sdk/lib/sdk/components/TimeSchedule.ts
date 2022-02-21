import {Component} from "cc";

export interface IUpdateEnd {
    duration: number;
    onEnd: Function;
}

export class TimeSchedule extends Component {
    private _onUpdateEndList: Array<IUpdateEnd> = [];
    private _onUpdateList: Array<Function> = [];

    schedule(o: IUpdateEnd | Function) {
        if ('function' == typeof o)
            this._onUpdateList.push(o);
        else
            this._onUpdateEndList.push(o);
    }

    update(dt) {
        let onUpdateEndList = this._onUpdateEndList;
        for (let i = 0, len = onUpdateEndList.length; i < len;) {
            let o = onUpdateEndList[i];
            if (0 >= o.duration) {
                o.onEnd();
                this._onUpdateEndList.splice(i, 1);
                len--;
                continue;
            }
            i++;
            o.duration -= dt;
        }

        let onUpdateList = this._onUpdateList;
        for (let i = 0, len = onUpdateList.length; i < len;) {
            let f = onUpdateList[i];
            if (f(dt)) {
                this._onUpdateList.splice(i, 1);
                len--;
                continue;
            }
            i++;
        }
    }
}