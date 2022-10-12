
import AgoraRTC from 'agora-rtc-sdk-ng';
import { _decorator, Component, Node, math, TERRAIN_DATA_VERSION, resources, SpriteFrame, Sprite, Button } from 'cc';
const { ccclass, property } = _decorator;
import { uuid } from '../../Model/uuid';

@ccclass('index')
export class index extends Component {

    @property(Node)
    Show: Node
    @property(Node)
    Hide: Node

    mute: boolean = false

    client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    options = {
        appid: '5aa8b667000c4682b9b57eeefde4e22e',
        channel: null,
        uid: uuid.uuid(16, 16),
        token: null
    };
    localTracks = {
        audioTrack: null
    };
    remoteUsers = {};

    start () {
        this.toSound()
        this.Hide.active = false
        this.Show.active = false
    }
    toSound (data: string = null) {
        if (!data) {
            return
        }
        if (this.options.channel === data) {
            return
        }
        this.options.channel = data
        join(this)
        this.Show.active = true
        // Agora client options
        async function join (data) {
            let self = data
            self.options.token = await getToken(self);
            // add event listener to play remote tracks when remote user publishs.
            self.client.on("user-published", (user, mediaType) => handleUserPublished(user, mediaType, self));
            self.client.on("user-unpublished", (user) => handleUserUnpublished(user, self));

            // join a channel and create local tracks, we can use Promise.all to run them concurrently
            [self.options.uid, self.localTracks.audioTrack] = await Promise.all([
                // join the channel
                self.client.join(self.options.appid, self.options.channel, self.options.token || null, self.options.uid),
                // create local tracks, using microphone and camera
                AgoraRTC.createMicrophoneAudioTrack(),
            ]);
            console.log(self.options.uid);

            // publish local tracks to channel
            await self.client.publish(Object.values(self.localTracks));
            console.log("publish success");
        }

        async function getToken (self): Promise<string> {
            const key = `token-${self.options.channel}`;
            const rtcToken = sessionStorage.getItem(key);
            if (rtcToken) {
                return rtcToken;
            }

            const res = await fetch('https://ws-bazaar.cella.fun/rtc/token', {
                method: 'POST',
                body: JSON.stringify({
                    "name": self.options.uid,
                    "channel": self.options.channel,
                    "role": 1
                })

            })
            const { token } = await res.json()
            sessionStorage.setItem(key, token);
            return token;
        }

        async function subscribe (user, mediaType, self) {
            const uid = user.uid;
            // subscribe to a remote user
            await self.client.subscribe(user, mediaType);
            if (mediaType === 'audio') {
                user.audioTrack.play();
            }
        }

        function handleUserPublished (user, mediaType, self) {
            const id = user.uid;
            self.remoteUsers[id] = user;
            subscribe(user, mediaType, self);
        }

        function handleUserUnpublished (user, self) {
            const id = user.uid;
            delete self.remoteUsers[id];
        }
    }
    leave () {
        for (const trackName in this.localTracks) {
            var track = this.localTracks[trackName];
            if (track) {
                track.stop();
                track.close();
                this.localTracks[trackName] = undefined;
            }
            this.Hide.active = false
            this.Show.active = false
        }
        // leave the channel
        this.client.leave();
        this.options.channel = null
    }

    Muted () {
        this.mute = !this.mute
        if (this.mute) {
            this.Show.active = false
            this.Hide.active = true
        }
        if (!this.mute) {
            this.Hide.active = false
            this.Show.active = true
        }
        if (this.localTracks.audioTrack) {
            this.localTracks.audioTrack.setMuted(this.mute)
        }
    }

    update (deltaTime: number) {

    }
}

