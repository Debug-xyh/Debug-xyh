
import { Camera, Color, Component, Node, SkeletalAnimation, SkinnedMeshRenderer, Vec3, view, _decorator, Collider, ICollisionEvent, ITriggerEvent, instantiate, Prefab, tween } from 'cc';
import { MathUtil } from '../Model/MathUtil';
import { PlayerAniState } from '../Main/type/type';
import { index } from '../API/AgoraRTC';
import { PlayerName } from '../PlayerName/PlayerName';
import { FollowCamera } from '../Components/FollowCamera';
import { uuid } from '../Model/uuid';
const { ccclass, property } = _decorator;

const v3_1 = new Vec3;

@ccclass('npcCotrl')
export class npcCotrl extends Component {

    @property(SkeletalAnimation)
    ani!: SkeletalAnimation;
    @property(Node)
    namePos!: Node;
    selfPlayer: any;
    @property(Node)
    playerNames!: Node;
    @property(Prefab)
    prefabPlayerName!: Prefab;
    @property(FollowCamera)
    followCamera!: FollowCamera;

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
        this.createNpc()
        let collider = this.node.getComponent(Collider)
        collider.on('onCollisionEnter', this.Welcome, this)
    }
    //NPC 名字
    createNpc () {
        let nodeName = instantiate(this.prefabPlayerName);
        nodeName.name = 'npc';
        this.playerNames.addChild(nodeName);
        nodeName.getComponent(PlayerName)!.options = {
            namePosNode: this.node.getChildByName('namePos')!,
            camera3D: this.followCamera.getComponent(Camera)!,
            nickname: '摊主'
        };

    }
    Welcome () {
        let playerName = this.playerNames.getChildByName('npc')?.getComponent(PlayerName);
        if (playerName) {
            playerName.showChatMsg('欢迎光临');
        }
    }
    // play () {
    //     let tweenDuration: number = 1.0;
    //     let pos: Vec3 = this.node.getWorldPosition()
    //     tween(this.node.worldPosition)
    //         .to(tweenDuration, new Vec3(pos.z + 50), {
    //             onUpdate: (target: Vec3, ratio: number) => {
    //                 this.node.setWorldPosition(target);
    //             }
    //         })
    //         .to(tweenDuration, new Vec3(pos.z - 50), {
    //             onUpdate: (target: Vec3, ratio: number) => {
    //                 console.log(
    //                     111
    //                 );
    //                 this.node.setWorldPosition(target);
    //             }
    //         })
    //         .start()
    //         .repeat(10)
    // }
    // update (dt: number) {
    //     let pos: Vec3 = this.node.getWorldPosition()
    //     let step = 10 * dt
    //     pos.z += step
    //     this.node.setWorldPosition(pos)
    // }
}