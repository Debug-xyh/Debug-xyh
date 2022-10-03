import { Player } from '../Player/Player';
import { PlayerName } from '../PlayerName/PlayerName';
import { Camera, Color, Component, EditBox, instantiate, Label, Node, Prefab, Quat, RichText, tween, TweenSystem, Vec2, _decorator, EventTouch, math } from 'cc';
import Presence from '@yomo/presencejs';
import { RoomUserState, UserInfo, ResJoinRoom } from './type/type'
import { Joystick } from '../Joystick/Joystick'
import { FollowCamera } from '../Components/FollowCamera'
import { NetUtil } from '../Model/NetUtil'
import { RoomData } from './type/type';
const { ccclass, property } = _decorator;
const q4_1 = new Quat;
const v2_1 = new Vec2;


export interface RoomSceneParams {
    serverUrl: string,
    nickname?: string,
    roomId: string,
}

@ccclass('index')
export class index extends Component {

    socket: Socket = null
    params!: RoomSceneParams;
    yomo!: Presence
    selfPlayer?: Player
    currentUser!: UserInfo;
    roomData!: RoomData;

    @property(Joystick)
    joyStick!: Joystick;
    @property(Node)
    players!: Node;
    @property(Node)
    chatMsgs!: Node;
    @property(FollowCamera)
    followCamera!: FollowCamera;
    @property(EditBox)
    inputChat!: EditBox;
    @property(Node)
    playerNames!: Node;
    @property(Label)
    labelRoomName!: Label;
    @property(Label)
    labelRoomState!: Label;
    @property(Label)
    labelServerUrl!: Label;

    @property(Prefab)
    prefabPlayer!: Prefab;
    @property(Prefab)
    prefabChatMsgItem!: Prefab;
    @property(Prefab)
    prefabPlayerName!: Prefab;

    onLoad () {
        //init
        this.socket = io.connect('https://online-market.cella.fun/')
        this.socket.on('connect', () => {
            let user = {
                name: Math.random() * 999999, uid: this.uuid, pos: { x: 0, y: 0, z: 0 }, rotation: {
                    x: 0,
                    y: 0,
                    z: 0,
                    w: 0
                },
            }
            const userStates = []
            this.socket.on('online', (data) => {
                if (data.userStates == undefined) {
                    this.socket.emit('online', { userStates })
                }
                let Cuid = data.userStates.map(item => item.id)
                if (Cuid === user.uid) {
                    return
                } else {
                    userStates.push(user)
                    this.socket.emit('online', { userStates })
                    localStorage.setItem('users', JSON.stringify(userStates))
                }
            })
        })

        this._initSocket()

        this.joyStick.options = {
            onOperate: v => {
                if (!this.selfPlayer) {
                    return;
                }
                this.selfPlayer.aniState = 'walking';
                this.selfPlayer.node.position = this.selfPlayer.node.position.add3f(v.x * 0.1, 0, -v.y * 0.1);
                this.selfPlayer.node.rotation = Quat.rotateY(q4_1, Quat.IDENTITY, Vec2.UNIT_X.signAngle(v2_1.set(v.x, v.y)) + Math.PI * 0.5)
            },
            onOperateEnd: () => {
                if (!this.selfPlayer) {
                    return;
                }
                this.selfPlayer.aniState = 'idle';
            },
            alwaysActive: true
        }
        // 开始连接
        this._ensureConnected();

        // 定时向服务器上报状态
        this.schedule(() => {
            if (!this.selfPlayer) {
                return;
            }
            this.socket.on('connect', () => {
                this.socket.emit('online', {
                    aniState: this.selfPlayer.aniState,
                    pos: this.selfPlayer.node.position,
                    rotation: this.selfPlayer.node.rotation
                })
            })
        }, 0.1)

        //test

    }

    private async _ensureConnected (): Promise<ResJoinRoom> {
        let ret = await this._connect();
        if (!ret.isSucc) {
            // alert(Error);
            this.onBtnBack();
            return new Promise(rs => { });
        }
        return ret.res;
    }
    private async _connect (): Promise<{ isSucc: true, res: ResJoinRoom } | { isSucc: false, errMsg: string }> {
        // socket.on
        let resConnect = await this.socket.on('connect', () => {
            this.socket.emit('online', {});
            if (!resConnect.isSucc) {
                return { isSucc: false, errMsg: '连接到服务器失败: ' + resConnect.errMsg };
            }
        })


        // JoinRoom
        let retJoin = await this.socket.on('connect', () => {
            this.socket.on('online', (data) => {
                // roomId: data.userStates.id
                console.debug(data.userStates.uid)
            });
        })
        if (!retJoin.isSucc) {
            return { isSucc: false, errMsg: '加入失败: ' + retJoin.err };
        }

        this.currentUser = retJoin.res.currentUser;
        console.log(this.currentUser)
        this.roomData = retJoin.res.roomData;

        return { isSucc: true, res: retJoin.res };
    }
    //动作
    onBtnAction (e: any, state: 'wave' | 'punch') {
        if (!this.selfPlayer) {
            return;
        }
        this.joyStick.onTouchEnd();
        this.selfPlayer.aniState = state;
    }

    private _initSocket () {
        this.socket = this.socket.on('connect', () => {
            this.socket.on('online', data => {
                let playerName = this.playerNames.getChildByName(data.id)?.getComponent(PlayerName);
                if (playerName) {
                    playerName.showChatMsg(data.id);
                }
                // console.debug(data)
            })

            this.socket.on('online', data => {
                for (let uid in data.userStates) {
                    this._updateUserState(data.userStates[uid]);
                }
            })


            // this.socket.on('online', v => {
            //     this.roomData.users.push({
            //         ...v.user,
            //         color: v.color
            //     });

            // })
            this.socket.emit('offline', v => {
                this.roomData.users.remove(v1 => v1.id === v.user.id);
                this.playerNames.getChildByName(v.user.id)?.removeFromParent();
                this.players.getChildByName(v.user.id)?.removeFromParent();
            })
        })



        //断线
        this.socket.on('offline', (state: RoomUserState) => {
            if (state.uid) {
                this.socket.emit('offline', '连接断开')
            }

        })
    }
    onBtnBack () {
        this.socket.emit('offline', '');;
        // SceneUtil.loadScene('MatchScene', {});
    }

    private _updateUserState (state: RoomUserState) {
        let node = this.players.getChildByName(state.uid);

        // Create Player
        if (!node) {
            // Player
            node = instantiate(this.prefabPlayer);
            node.name = state.uid;
            this.players.addChild(node);
            node.setPosition(state.pos.x, state.pos.y, state.pos.z);
            node.setRotation(state.rotation.x, state.rotation.y, state.rotation.z, state.rotation.w);
            const player = node.getComponent(Player)!;
            player.aniState = state.aniState;
            // let userInfo = this.roomData.users.find(v => v.id === state.uid);
            // if (userInfo) {
            //     player.mesh.material?.setProperty('mainColor', new Color(userInfo.color.r, userInfo.color.g, userInfo.color.b, 255));
            // }

            // PlayerName
            let nodeName = instantiate(this.prefabPlayerName);
            nodeName.name = state.uid;
            this.playerNames.addChild(nodeName);
            nodeName.getComponent(PlayerName)!.options = {
                namePosNode: node.getChildByName('namePos')!,
                camera3D: this.followCamera.getComponent(Camera)!,
                nickname: 'yomo'
                // userInfo?.nickname || '???'
            };

            // Set selfPlayer
            if (state.uid === this.currentUser.id) {
                this.selfPlayer = player;
                this.followCamera.focusTarget = node.getChildByName('focusTarget')!;
            }

            return;
        }

        // 简单起见：自己以本地状态为主，不从服务端同步
        if (state.uid === this.currentUser.id) {
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

    onDestroy () {
        TweenSystem.instance.ActionManager.removeAllActionsByTag(99);
    }

    start () {

    }



    update (deltaTime: number) {

    }
}

