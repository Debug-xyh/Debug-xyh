import { director } from "cc";

export interface SceneParamsMap {
    MatchScene: {},
    //     RoomScene: RoomSceneParams
}

export class SceneUtil {

    static sceneParams: unknown;
    static loadScene<T extends keyof SceneParamsMap> (scene: T, params: SceneParamsMap[T]) {
        this.sceneParams = params;
        director.loadScene(scene);
    }

}