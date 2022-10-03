import { _decorator, Component, Node, Collider, Vec3, RigidBody, ITriggerEvent } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('goToHouse')
export class goToHouse extends Component {
    start () {
        let collider = this.getComponent(Collider)
        collider.on('onTriggerEnter', this.onTriggerEnter, this);
    }
    private onTriggerEnter (event: ITriggerEvent) {

    }
    update (deltaTime: number) {

    }
}

