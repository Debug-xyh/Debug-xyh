
import { Camera, Color, Component, Node, SkeletalAnimation, SkinnedMeshRenderer, Vec3, view, _decorator, Collider, ICollisionEvent, ITriggerEvent } from 'cc';
import { MathUtil } from '../Model/MathUtil';
import { PlayerAniState } from '../Main/type/type';
import { index } from '../API/AgoraRTC';
const { ccclass, property } = _decorator;

const v3_1 = new Vec3;

@ccclass('Player')
export class Player extends Component {

    @property(SkeletalAnimation)
    ani!: SkeletalAnimation;
    @property(SkinnedMeshRenderer)
    mesh!: SkinnedMeshRenderer;
    @property(Node)
    namePos!: Node;
    @property(Node)
    muted!: Node;
    selfPlayer: any;
    onLoad () {

    }
    private _aniState: PlayerAniState = 'idle';
    public get aniState (): PlayerAniState {
        return this._aniState;
    }
    public set aniState (v: PlayerAniState) {
        if (this._aniState === v) {
            return;
        }
        this._aniState = v;

        this.unscheduleAllCallbacks();
        this.ani.crossFade(v, 0.5);

        if (v === 'wave') {
            this.scheduleOnce(() => {
                this.aniState = 'idle';
            }, 4.73)
        }

        if (v === 'punch') {
            this.scheduleOnce(() => {
                this.aniState = 'idle';
            }, 2.27)
        }

        if (v === 'dance') {
            this.scheduleOnce(() => {
                this.aniState = 'idle';
            }, 12.37)
        }
    }

    start () {
        let currentUser = JSON.parse(localStorage.getItem('Self'))
        if (currentUser.uid == this.node.name) {
            let collider = this.node.getComponent(Collider)
            collider.on('onTriggerEnter', this.onCollisionEnter, this);
            // collider.on('onTriggerExit', this.onCollisionLeave, this);
        }
        //碰撞监测
    }
    //摊位跳转
    onCollisionEnter (event: ITriggerEvent): void {
        if (event.otherCollider.node.name == 'shopping') {
            let con = confirm('是否进入 ONE 物杂货铺')
            if (con) {
                window.location.href = 'weixin://dl/business/?t=RHQ7mSwqXPm'
            }
        }
        if (event.otherCollider.node.name == "Ireland") {
            let con = confirm('是否进入展厅观看爱尔兰文化展?')
            if (con) {
                this.node.setWorldPosition(new Vec3(971.01, 9.99, -18));
            }
        }
        if (event.otherCollider.node.name == "backMain") {
            let con = confirm('是否返回主会场?')
            if (con) {
                this.node.setWorldPosition(new Vec3(-60, 0, -270));
            }
        }
    }

    public get color (): Color {
        return this.mesh.material!.getProperty('mainColor') as Color;
    }
    public set color (v: Color) {
        this.mesh.material!.setProperty('mainColor', v);
    }
}