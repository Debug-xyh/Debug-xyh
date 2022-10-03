import { _decorator, Component, Node, RigidBody } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ColliderCDD')
export class ColliderCDD extends Component {
    start () {
        const rigidBody = this.getComponent(RigidBody);
        rigidBody.useCCD = true
    }

    update (deltaTime: number) {

    }
}

