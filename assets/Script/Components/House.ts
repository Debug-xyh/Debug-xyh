import { _decorator, Component, Node, MeshRenderer, RenderTexture, Camera, Material } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('House')
export class House extends Component {
    @property(MeshRenderer)
    target: MeshRenderer = null
    start () {
        const renderTex = new RenderTexture();
        renderTex.reset({
            width: 256,
            height: 256,
        });
        const cameraComp = this.getComponent(Camera);
        cameraComp.targetTexture = renderTex;
        const pass = this.target.material.passes[0];
        // 设置 'SAMPLE_FROM_RT' 宏为 'true' 的目的是为了使 RenderTexture 在各个平台能正确显示
        const defines = { SAMPLE_FROM_RT: true, ...pass.defines };
        const renderMat = new Material();
        renderMat.initialize({
            effectAsset: this.target.material.effectAsset,
            defines,
        });
        this.target.setMaterial(renderMat, 0);
        renderMat.setProperty('mainTexture', renderTex, 0);
    }

    update (deltaTime: number) {

    }
}

