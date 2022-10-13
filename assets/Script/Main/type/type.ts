export interface RoomUserState {
    uid: string,
    name: string,
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

export type PlayerAniState = 'idle' | 'walking' | 'wave' | 'punch' | 'dance' | '';

