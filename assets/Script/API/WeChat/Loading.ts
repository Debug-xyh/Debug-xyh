import { xxx } from './../../Main/type/type';
import { _decorator, Component, Node, Vec3, Vec4, Quat, quat } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('loading')
export class lo_ding extends Component {
    start () {

    }

    update (deltaTime: number) {
        let rot: Vec3 = this.node.eulerAngles
        rot.z += (-90 * deltaTime)
        this.node.setRotationFromEuler(rot)
    }
}

