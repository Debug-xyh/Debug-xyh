import { Component, EventTouch, macro, Node, Quat, Vec2, Vec3, _decorator } from 'cc';
import { FollowCamera } from '../Components/FollowCamera';
import { MathUtil } from '../Model/MathUtil';
const { ccclass, property } = _decorator;

const v3_1 = new Vec3;
const q4_1 = new Quat;
const v2_1 = new Vec2;
const _temp_delta = new Vec2();

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

    @property(Node)
    public target: Node = null!;

    @property(FollowCamera)
    followCamera!: FollowCamera;

    @property(Node)
    camera: Node

    @property(Node)
    players!: Node;

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
        //多点触摸
        this.node.on(Node.EventType.TOUCH_START, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this)
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    private _touchStartPos?: Vec2;
    private _value = new Vec2;

    onTouchMove (event: EventTouch) {
        if (!event.touch) {
            return;
        }
        const touch = event.touch!;
        const touches = event.getAllTouches();
        const changedTouches = event.getTouches();
        macro.ENABLE_MULTI_TOUCH = true
        //多点
        if (macro.ENABLE_MULTI_TOUCH && touches.length > 1) {
            let touch1 = null!;
            let touch2 = null!;
            const delta2 = new Vec2();
            touch2 = touches[0];

            if (changedTouches.length > 1) {
                touch1 = touches[0];
                touch2 = touches[1];
                touch2.getDelta(delta2);

            } else {
                touch1 = touch;
                const diffID = touch1.getID();
                let str = '';
                for (let i = 0; i < touches.length; i++) {
                    const element = touches[i];
                    str += `${element.getID()} - `;
                    if (element.getID() !== diffID) {
                        touch2 = element;
                        break;
                    }
                }
            }
            let self = JSON.parse(localStorage.getItem('Self'))
            let node = this.players.getChildByName(self.uid)

            let speed = 0.5
            const delta1 = touch2.getDelta(_temp_delta);
            //向左
            if (delta1.x < 0) {
                let angles = this.camera.eulerAngles
                let anglesY = angles.y + speed
                this.camera.eulerAngles = new Vec3(angles.x, anglesY, angles.z)
            }
            //向右
            else if (delta1.x > 0) {
                let angles = this.camera.eulerAngles
                let anglesY = angles.y - speed
                this.camera.eulerAngles = new Vec3(angles.x, anglesY, angles.z)
            }
            //向上
            if (delta1.y > 0) {
                let angles = this.camera.eulerAngles
                let anglesX = angles.x + speed
                if (anglesX > 10) {
                    anglesX = 10
                }
                this.camera.eulerAngles = new Vec3(anglesX, angles.y, angles.z)
            }
            //向下
            else if (delta1.y < 0) {
                let angles = this.camera.eulerAngles
                let anglesX = angles.x - speed
                if (anglesX < 0) {
                    anglesX = 0
                }
                this.camera.eulerAngles = new Vec3(anglesX, angles.y, angles.z)
            }
        } else {
            //单点
            this.disk.active = true;
            let loc = event.touch.getUILocation();

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
        this.camera.eulerAngles = new Vec3(-7, 0, 0)
    }
}

