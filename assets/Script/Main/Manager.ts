import { Player } from './../Player/Player';
import { PlayerName } from '../PlayerName/PlayerName';
import { Camera, Color, Component, EditBox, instantiate, Label, Node, Prefab, Quat, RichText, tween, TweenSystem, Vec2, _decorator, EventTouch, math, director, Collider, ICollisionEvent, ITriggerEvent, WebView, Vec3 } from 'cc';
import { RoomUserState, UserInfo, ResJoinRoom } from './type/type'
import { Joystick } from '../Joystick/Joystick'
import { FollowCamera } from '../Components/FollowCamera'
import { RoomData, PlayerAniState } from './type/type';
import { uuid } from '../Model/uuid';
import { goToHouse } from '../Components/goToHouse';
import { index } from '../API/AgoraRTC';
const { ccclass, property } = _decorator;
const q4_1 = new Quat;
const v2_1 = new Vec2;


export interface RoomSceneParams {
    serverUrl: string,
    nickname?: string,
    roomId: string,
}

@ccclass('Manager')
export class Manager extends Component {

    socket: Socket = null
    params!: RoomSceneParams;
    selfPlayer?: Player
    currentUser!: UserInfo;
    roomData!: RoomData;
    PlayerAniState: PlayerAniState
    OtherList = []
    throttle: any


    @property(Joystick)
    joyStick!: Joystick;
    @property(Node)
    Muted: Node
    @property(Node)
    Muted2: Node
    @property(Node)
    players!: Node;
    @property(FollowCamera)
    followCamera!: FollowCamera;
    @property(Node)
    playerNames!: Node;
    @property(Prefab)
    prefabPlayerName!: Prefab;

    //boysplayer
    @property(Prefab)
    prefabPlayerBoy1!: Prefab
    @property(Prefab)
    prefabPlayerBoy2!: Prefab
    @property(Prefab)
    prefabPlayerBoy3!: Prefab
    @property(Prefab)
    prefabPlayerBoy4!: Prefab
    @property(Prefab)
    prefabPlayerBoy5!: Prefab
    @property(Prefab)
    prefabPlayerBoy6!: Prefab

    //girlplayer
    @property(Prefab)
    prefabPlayerGirl1!: Prefab
    @property(Prefab)
    prefabPlayerGirl2!: Prefab
    @property(Prefab)
    prefabPlayerGirl3!: Prefab
    @property(Prefab)
    prefabPlayerGirl4!: Prefab
    @property(Prefab)
    prefabPlayerGirl5!: Prefab
    @property(Prefab)
    prefabPlayerGirl6!: Prefab




    onLoad () {
        //定时向服务器上报状态
        let throttleTimer;
        this.throttle = (obj: any, callback: { apply: (arg0: any, arg1: any[]) => void; }, time: number, a: string, b: any) => {
            if (throttleTimer) return;
            throttleTimer = true;
            // const that = this;
            setTimeout(() => {
                callback.apply(obj, [a, b]);
                throttleTimer = false;
            }, time);
        }
        //init
        this.socket = io.connect('wss://online-market.cella.fun/', {
            transports: ['websocket']
        })
        this._initSocket()

        this.Muted.active = false
        this.joyStick.options = {
            onOperate: v => {
                if (!this.selfPlayer) {
                    return;
                }
                this.selfPlayer.aniState = 'walking';
                this.selfPlayer.node.position = this.selfPlayer.node.position.add3f(v.x * 0.18, 0, -v.y * 0.18);
                this.selfPlayer.node.rotation = Quat.rotateY(q4_1, Quat.IDENTITY, Vec2.UNIT_X.signAngle(v2_1.set(v.x, v.y)) + Math.PI * 0.5)
                let userState = JSON.parse(localStorage.getItem('Self'))
                if (!this.selfPlayer) {
                    return
                }
                userState.pos = this.selfPlayer.node.position,
                    userState.aniState = this.selfPlayer.aniState,
                    userState.rotation = this.selfPlayer.node.rotation
                this.throttle(this.socket, this.socket.emit, 200, "online", userState)
            },
            onOperateEnd: () => {
                if (!this.selfPlayer) {
                    return;
                }
                this.selfPlayer.aniState = '';
            },
            alwaysActive: true
        }

    }

    //socket 连接
    private _initSocket () {
        let uid = uuid.uuid(16, 16)
        let code = JSON.parse(localStorage.getItem('Code'))
        const userState = {
            uid: uid,
            name: 'code.nickname',
            pos: {
                x: 0,
                y: 0,
                z: 0
            },
            rotation: {
                x: 0,
                y: 0,
                z: 0,
                w: 0
            },
            aniState: this.PlayerAniState
        }
        this.socket.on('connect', () => {
            this._updateUserState(userState)
            this.socket.emit('online', userState)
        })
        localStorage.setItem('Self', JSON.stringify(userState))
        //同步数据
        let currentUser = JSON.parse(localStorage.getItem('Self'))
        this.socket.on('online', data => {
            if (data.uid === currentUser.uid) {
                return
            }
            this._updateUserState(data)
        })

        //下线销毁
        this.socket.on('offline', (data) => {
            let userList = JSON.parse(localStorage.getItem('OtherList'))
            for (let user of userList) {
                if (user.uid === data) {
                    this.playerNames.getChildByName(data)?.removeFromParent();
                    this.players.getChildByName(data)?.removeFromParent();
                    let users = userList.splice(userList.indexOf(user), 1)
                    localStorage.setItem('OtherList', JSON.stringify(users))
                }
            }
        })
    }

    //更新状态
    private _updateUserState (state: RoomUserState) {
        let node = this.players.getChildByName(state.uid);
        let currentUser = JSON.parse(localStorage.getItem('Self'))
        let sex = Math.floor(Math.random() * 2)
        // Create Player
        if (!node) {
            // Player
            //性别
            if (sex === 0) {
                let color = Math.floor(Math.random() * 6)
                if (color === 0) {
                    node = instantiate(this.prefabPlayerBoy1);
                }
                if (color === 1) {
                    node = instantiate(this.prefabPlayerBoy2);
                }
                if (color === 2) {
                    node = instantiate(this.prefabPlayerBoy3);
                }
                if (color === 3) {
                    node = instantiate(this.prefabPlayerBoy4);
                }
                if (color === 4) {
                    node = instantiate(this.prefabPlayerBoy5);
                }
                if (color === 5) {
                    node = instantiate(this.prefabPlayerBoy6);
                }
            }
            if (sex === 1) {
                let color = Math.floor(Math.random() * 6)
                if (color === 0) {
                    node = instantiate(this.prefabPlayerGirl1);
                }
                if (color === 1) {
                    node = instantiate(this.prefabPlayerGirl2);
                }
                if (color === 2) {
                    node = instantiate(this.prefabPlayerGirl3);
                }
                if (color === 3) {
                    node = instantiate(this.prefabPlayerGirl4);
                }
                if (color === 4) {
                    node = instantiate(this.prefabPlayerGirl5);
                }
                if (color === 5) {
                    node = instantiate(this.prefabPlayerGirl6);
                }
            }
            node.name = state.uid;
            this.players.addChild(node);
            this.node.getComponent(goToHouse)
            node.setPosition(state.pos.x, state.pos.y, state.pos.z);
            node.setRotation(state.rotation.x, state.rotation.y, state.rotation.z, state.rotation.w);
            const player = node.getComponent(Player)!;
            player.aniState = state.aniState;

            // PlayerName
            let nodeName = instantiate(this.prefabPlayerName);
            nodeName.name = state.uid;
            this.playerNames.addChild(nodeName);
            nodeName.getComponent(PlayerName)!.options = {
                namePosNode: node.getChildByName('namePos')!,
                camera3D: this.followCamera.getComponent(Camera)!,
                nickname: state.name
            };
            // Set selfPlayer
            if (state.uid === currentUser.uid) {
                this.selfPlayer = player;
                this.followCamera.focusTarget = node.getChildByName('focusTarget')!;
            }
            this.OtherList.push(state)
            localStorage.setItem('OtherList', JSON.stringify(this.OtherList))
            return;
        }

        // 插值其它 Player 的状态
        node.getComponent(Player)!.aniState = state.aniState;
        TweenSystem.instance.ActionManager.removeAllActionsFromTarget(node.position as any);
        const startRot = node!.rotation.clone();
        tween(node.position).to(0.1, state.pos, {
            onUpdate: (v, ratio) => {
                node!.position = node!.position;
                node!.rotation = Quat.slerp(node!.rotation, startRot, state.rotation, ratio!)
            }
        }).tag(99).start();
    }

    ;

    start () {
        setTimeout(() => {
            let currentUser = JSON.parse(localStorage.getItem('Self'))
            let playername = this.selfPlayer.name.slice(0, 16)
            if (currentUser.uid == playername) {
                let collider = this.selfPlayer.getComponent(Collider)
                collider.on('onTriggerEnter', this.onTriggerStage, this)
                collider.on('onTriggerEnter', this.JoinRoom, this)
                collider.on('onTriggerExit', this.leaveRoom, this)
            }
        }, 2000)
        //碰撞监测
    }
    //舞台跳转
    onTriggerStage (event: ITriggerEvent): void {
        if (event.otherCollider.node.name == 'stage') {
            let con = confirm('你即将离开当前场景前往舞台直播间')
            if (con) {
                //window.location.href = ''
            }
        }
    }

    //声音房间判断
    JoinRoom (event: ITriggerEvent) {
        let Agora = this.node.getComponent(index)
        if (event.otherCollider.node.name == '1') {
            Agora.toSound('1')

        }
        if (event.otherCollider.node.name == '2') {
            Agora.toSound('2')

        }
        if (event.otherCollider.node.name == '3') {
            Agora.toSound('3')

        }
        if (event.otherCollider.node.name == '4') {
            Agora.toSound('4')

        }
        if (event.otherCollider.node.name == '5') {
            Agora.toSound('5')

        }
        if (event.otherCollider.node.name == '6') {
            Agora.toSound('6')

        }
        if (event.otherCollider.node.name == '7') {
            Agora.toSound('7')
        }

    }
    //离开摊位,断开声网连接
    leaveRoom (event: ITriggerEvent) {
        let Agora = this.node.getComponent(index)
        const roomid = ['1', '2', '3', '4', '5', '6', '7']
        for (let id of roomid) {
            if (event.otherCollider.node.name == id) {
                Agora.leave()
                this.Muted.active = false
                this.Muted2.active = false
            }
        }

    }
    //销毁缓动 
    onDestroy () {
        TweenSystem.instance.ActionManager.removeAllActionsByTag(99);
    }

    update (deltaTime: number) {

    }
}


