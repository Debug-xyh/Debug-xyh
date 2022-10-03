import { Component, EventTouch, macro, Node, Vec2, Vec3, _decorator } from 'cc';
import { MathUtil } from '../Model/MathUtil';
const { ccclass, property } = _decorator;

const v3_1 = new Vec3;
export interface JoystickOptions {
    onOperate: (output: JoystickOutput) => void,
    onOperateEnd: () => void,
    alwaysActive?: boolean
}

export interface JoystickOutput {
    // 0 ~ 1
    x: number,
    // 0 ~ 1
    y: number
}

@ccclass('Joystick')
export class Joystick extends Component {

    @property
    radius: number = 128;

    @property(Node)
    disk: Node = null as any;

    @property(Node)
    stick: Node = null as any;

    private _diskInitPos!: Vec3;
    private _options!: JoystickOptions;
    public get options (): JoystickOptions {
        return this._options;
    }
    public set options (v: JoystickOptions) {
        this._options = v;
        this._diskInitPos = this.disk.position.clone();
        if (v.alwaysActive) {
            this.node.active = true;
        }
    }

    onLoad () {
        // this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this)
        this.node.on(Node.EventType.TOUCH_START, this.onTouch, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouch, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }
    //多点触碰
    // onTouchMove (event: EventTouch) {
    //     const touch = event.touch!;
    //     const touches = event.getAllTouches();
    //     const changedTouches = event.getTouches();
    //     if (macro.ENABLE_MULTI_TOUCH && touches.length > 1) {
    //         let touch1: Touch = null!;
    //         let touch2: Touch = null!;
    //         const delta2 = new Vec2();
    //         if (changedTouches.length > 1) {
    //             touch1 = touches[0];
    //             touch2 = touches[1];
    //             touch2.getDelta(delta2);

    //         } else {
    //             touch1 = touch;
    //             const diffID = touch1.getID();
    //             let str = '';
    //             for (let i = 0; i < touches.length; i++) {
    //                 const element = touches[i];
    //                 str += `${element.getID()} - `;
    //                 if (element.getID() !== diffID) {
    //                     touch2 = element;
    //                     break;
    //                 }
    //             }
    //         }
    //     }
    // }

    private _touchStartPos?: Vec2;
    private _value = new Vec2;
    onTouch (e: EventTouch) {
        if (!e.touch) {
            return;
        }

        this.disk.active = true;
        let loc = e.touch.getUILocation();

        if (!this._touchStartPos) {
            this._touchStartPos = loc.clone();
            this.disk.setPosition(loc.x, loc.y, 0);
        }

        let diskPos = this.disk.position;

        let stickPos: Vec3 = v3_1.set(loc.x - diskPos.x, loc.y - diskPos.y, 0);
        let length = stickPos.length();
        if (length === 0) {
            this.stick.setPosition(0, 0, 0);
            return;
        }
        let newLength = MathUtil.limit(length, 0, this.radius);
        stickPos.multiplyScalar(newLength / length);

        // if (length > newLength) {
        //     let newDiskPos = this.disk.position.clone().add(stickPos);
        //     this.disk.setPosition(newDiskPos);
        // }
        this.stick.setPosition(stickPos);

        stickPos.normalize();
        this._value.set(stickPos.x || 0, stickPos.y || 0);
    }

    update () {
        if (this._touchStartPos && this._value.x !== 0 && this._value.y !== 0) {
            this.options.onOperate({ x: this._value.x, y: this._value.y });
        }
    }

    onTouchEnd () {
        if (!this._touchStartPos) {
            return;
        }

        if (!this._options.alwaysActive) {
            this.disk.active = false;
        }
        else {
            this.disk.position = this._diskInitPos;
            this.disk.getChildByName('stick')!.setPosition(0, 0, 1);
        }
        this._touchStartPos = undefined;
        this._value.set(0, 0);
        this.options?.onOperateEnd();
    }

}

