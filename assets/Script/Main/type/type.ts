export interface ReqJoinRoom extends BaseRequest {
    nickname: string,
    roomId: string
}

export interface ResJoinRoom extends BaseResponse {
    currentUser: UserInfo,
    // roomData: RoomData
}

export const conf: BaseConf = {

}

export interface RoomData {
    id: string,
    name: string,
    /** 房间可容纳的最大人数 */
    maxUser: number,
    /** 房间内的用户 */
    users: (UserInfo & { color: { r: 191, g: 209, b: 178 } })[],
    /** 历史消息（只保留最近的 N 条） */
    messages: {
        user: UserInfo,
        time: Date,
        content: string
    }[],
}

export interface UserInfo {
    id: string,
    nickname: string
}

export interface RoomUserState {
    uid: string,
    pos: {
        x: number,
        y: number,
        z: number
    },
    rotation: {
        x: number,
        y: number,
        z: number,
        w: number
    },
    aniState: PlayerAniState
}

export interface UserInfo {
    id: string,
    nickname: string
}

export const xxx = () => {
    return Math.floor(Math.random() * 255 + 1)
}




export type PlayerAniState = 'idle' | 'walking' | 'wave' | 'punch' | 'dance';


export interface BaseRequest {

}

export interface BaseResponse {

}

export interface BaseConf {

}

export interface BaseMessage {

}