import {Node, Tween, tween, Vec2, Vec3} from "cc";

interface IBezierPoint {
    x: number;
    y: number;
    time: number;
    length: number;
}

class Bezier {
    // 曲线点集合,曲线总长,上一个点,当前时间
    private pointLists: IBezierPoint[] = [];
    private totalLength: number = 0;
    private prevPos: any;
    private currentRunTime: number = 0;
    // 运行时间
    private readonly runTime: number = 0;
    private pointArr: Vec2[] = [];

    constructor(pointArr: Vec2[], duration: number = 2) {
        this.pointArr = pointArr;
        this.runTime = duration;
    }

    resetData() {
        // 点集合
        this.pointLists.length = 0;
        // 线段总长度
        this.totalLength = this.currentRunTime = 0;
        // 初始位置
        this.prevPos = {
            x: this.pointArr[0].x,
            y: this.pointArr[0].y,
            length: 0,
        }
    }

    //阶乘
    factorial(i: number) {
        let n = 1;
        for (let j = 1; j <= i; j++)
            n *= j;
        return n;
    }

    computeBezier(dt: number, runTime: number) {
        // 把时间从 [0,runTime] 映射到 [0,1] 之间
        let t = this.currentRunTime / runTime;

        let x = 0, y = 0;
        //控制点数组
        let n = this.pointArr.length - 1;

        this.pointArr.forEach((item, index) => {
            if (!index) {
                x += item.x * Math.pow((1 - t), n - index) * Math.pow(t, index)
                y += item.y * Math.pow((1 - t), n - index) * Math.pow(t, index)
            } else {
                // factorial为阶乘函数
                x += this.factorial(n) / this.factorial(index) / this.factorial(n - index) * item.x * Math.pow((1 - t), n - index) * Math.pow(t, index)
                y += this.factorial(n) / this.factorial(index) / this.factorial(n - index) * item.y * Math.pow((1 - t), n - index) * Math.pow(t, index)
            }
        })

        //  // 二阶贝塞尔曲线公式 (t => [0,1])
        //  var x = Math.pow(1 - t, 2) * _startPos.x
        //  + 2 * t * (1 - t) * _controlPos.x
        //  + Math.pow(t, 2) * _endPos.x;

        //  var y = Math.pow(1 - t, 2) * _startPos.y
        //  + 2 * t * (1 - t) * _controlPos.y
        //  + Math.pow(t, 2) * _endPos.y;

        // console.log(`x:${x},y:${y}`);
        // 计算两点距离
        let length = Math.sqrt(Math.pow(this.prevPos.x - x, 2) + Math.pow(this.prevPos.y - y, 2));
        let v2: IBezierPoint = {x, y, length, time: 0};
        // 存储当前节点
        this.pointLists.push(v2);
        this.prevPos = v2;
        // 累计长度
        this.totalLength += length;
        // 累计时间
        this.currentRunTime += dt;
    }

    // 切割贝塞尔曲线

    getPoints(count = 200) {
        this.resetData();
        // 分割时间
        let dt = this.runTime / count;
        // 开始分割曲线
        for (let i = 0, len = count + 1; i < len; i++) {
            this.computeBezier(dt, this.runTime);
        }
        return this.pointLists;
    }

    getCurveLength() {
        return this.totalLength;
    }
}

export interface IBezier {
    target: Node | Tween<Node>;
    points: Vec2[];
    duration?: number;
    onComplete?: Function;
}

export function BezierTo(iBezier: IBezier): Tween<Node> {
    let duration = iBezier.duration ?? 2;
    let target = iBezier.target;
    let bezier = new Bezier(iBezier.points, duration);
    let actionLists: IBezierPoint[] = [];
    let points = bezier.getPoints(100);
    let l = bezier.getCurveLength();
    for (let i = 0, len = points.length; i < len; i++) {
        const point = points[i];
        // 计算当前路段需要的时间
        point.time = point.length / l * duration;
        actionLists.push(point);
    }
    let t: Tween<Node>;
    if (target instanceof Node)
        t = tween(target);
    else
        t = target as Tween<Node>;
    let len = actionLists.length;
    actionLists.forEach((data, index) => {
        t = t.to(data.time, {position: new Vec3(data.x, data.y, 0)});
        if (index == len - 1 && iBezier.onComplete)
            t = t.call(iBezier.onComplete);
    });
    return t;
}
