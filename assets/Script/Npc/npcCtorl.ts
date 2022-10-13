import { Camera, Component, Node, Vec3, _decorator, Collider, instantiate, Prefab } from 'cc';
import { PlayerAniState } from '../Main/type/type';
import { PlayerName } from '../PlayerName/PlayerName';
import { FollowCamera } from '../Components/FollowCamera';
import { npcList } from './npcList';
const { ccclass, property } = _decorator;

const v3_1 = new Vec3;

@ccclass('npcCotrl')
export class npcCotrl extends Component {

    PlayerAniState: PlayerAniState

    selfPlayer: any;
    @property(Node)
    playerNames!: Node;
    @property(Prefab)
    prefabPlayerName!: Prefab;
    @property(FollowCamera)
    followCamera!: FollowCamera;
    @property(Node)
    NPC!: Node;
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

    }

    start () {
        this.createNpc(npcList)
        let collider1 = this.NPC.getChildByName('1').getComponent(Collider)
        collider1.on('onCollisionEnter', this.Welcome1, this)

        let collider2 = this.NPC.getChildByName('2').getComponent(Collider)
        collider2.on('onCollisionEnter', this.Welcome2, this)

        let collider3 = this.NPC.getChildByName('3').getComponent(Collider)
        collider3.on('onCollisionEnter', this.Welcome3, this)

        let collider4 = this.NPC.getChildByName('4').getComponent(Collider)
        collider4.on('onCollisionEnter', this.Welcome4, this)

        let collider5 = this.NPC.getChildByName('5').getComponent(Collider)
        collider5.on('onCollisionEnter', this.Welcome5, this)

        let collider6 = this.NPC.getChildByName('6').getComponent(Collider)
        collider6.on('onCollisionEnter', this.Welcome6, this)

        let collider7 = this.NPC.getChildByName('7').getComponent(Collider)
        collider7.on('onCollisionEnter', this.Welcome7, this)

        let collider8 = this.NPC.getChildByName('8').getComponent(Collider)
        collider8.on('onCollisionEnter', this.Welcome8, this)
    }
    //NPC 名字
    createNpc (state) {
        for (let npc of state) {
            let node = this.NPC.getChildByName(npc.id);
            // Create Player
            if (!node) {
                // Player
                //性别
                let sex = Math.floor(Math.random() * 2)
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
                node.name = npc.id;
                this.NPC.addChild(node);
                node.setPosition(npc.pos.x, npc.pos.y, npc.pos.z);
                node.setRotation(npc.rotation.x, npc.rotation.y, npc.rotation.z, npc.rotation.w);

                //npc name
                let nodeName = instantiate(this.prefabPlayerName);
                nodeName.name = npc.id;;
                this.playerNames.addChild(nodeName);
                nodeName.getComponent(PlayerName)!.options = {
                    namePosNode: node.getChildByName('namePos')!,
                    camera3D: this.followCamera.getComponent(Camera)!,
                    nickname: npc.name
                };
            }
            if (this.NPC.children.length === 8) {
                return
            }
        }
    }
    Welcome1 () {
        let playerName = this.playerNames.getChildByName('1')?.getComponent(PlayerName);
        if (playerName) {
            playerName.showChatMsg('叫我彦祖就好');
        }
    }
    Welcome2 () {
        let playerName = this.playerNames.getChildByName('2')?.getComponent(PlayerName);
        if (playerName) {
            playerName.showChatMsg('这届话事人我当定了');
        }
    }
    Welcome3 () {
        let playerName = this.playerNames.getChildByName('3')?.getComponent(PlayerName);
        if (playerName) {
            playerName.showChatMsg('段坤我吃定了,耶稣也留不住我说的');
        }
    }
    Welcome4 () {
        let playerName = this.playerNames.getChildByName('4')?.getComponent(PlayerName);
        if (playerName) {
            playerName.showChatMsg('图司令,你的部队现在在哪里啊');
        }
    }
    Welcome5 () {
        let playerName = this.playerNames.getChildByName('5')?.getComponent(PlayerName);
        if (playerName) {
            playerName.showChatMsg('我记得你,良友冰室');
        }
    }
    Welcome6 () {
        let playerName = this.playerNames.getChildByName('6')?.getComponent(PlayerName);
        if (playerName) {
            playerName.showChatMsg('我话讲完,谁赞成谁反对?');
        }
    }
    Welcome7 () {
        let playerName = this.playerNames.getChildByName('7')?.getComponent(PlayerName);
        if (playerName) {
            playerName.showChatMsg('我赚够三千万就收手');
        }
    }
    Welcome8 () {
        let playerName = this.playerNames.getChildByName('8')?.getComponent(PlayerName);
        if (playerName) {
            playerName.showChatMsg('贵宾一位,里面请');
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