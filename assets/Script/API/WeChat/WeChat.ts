import { _decorator, Component, Node, director, TweenSystem } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('WeChat')
export class WeChat extends Component {

    @property(Node)
    afterLogin!: Node;

    code: string = ''
    public isWechat = () => {
        return String(navigator.userAgent.toLowerCase().match(/MicroMessenger/i)) === "micromessenger";
    }
    onLoad () {
        director.preloadScene("main", function () {
            console.log('Next scene preloaded');
        });

    }

    start () {
        this.afterLogin.active = false
        this.getWechatCode()
    }


    getWxCode () {
        fetch(`https://online-market.cella.fun/wechat/userinfo?code=${this.code}`, { method: 'get', })
            .then(e => e.json())
            .then((data) => {
                if (data !== undefined) {
                    if (data.openid === 'ojDt9s_x7A0gps8WrLZQYXQbEz9c' ||
                        data.openid === 'ojDt9s5g9n2lcyrWSm8Grb09NbtU' ||
                        data.openid === 'ojDt9s1OR-a60ZZlEL2dFqwT4AUc' ||
                        data.openid === 'ojDt9s7Wgg7Y2k_V-d4x-e2Er_W0' ||
                        data.openid === 'ojDt9s9GllSuEHyYn1e82frG3oxU' ||
                        data.openid === 'ojDt9s32f1FvD2LXfFhfKq7w_NnM' ||
                        data.openid === 'ojDt9s8YkJbSMazB147eR_ANxvVA' ||
                        data.nickname == '老徐') {
                        data.nickname = '摊主:' + data.nickname
                    }
                    localStorage.setItem('Code', JSON.stringify(data))
                    director.loadScene('Main')
                }
            }).catch(e => console.log("Oops, error", e))

    }
    getUrlCode (): any {
        // 截取url中的code方法
        var url = location.search;
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            var strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = strs[i].split("=")[1];
            }
        }
        console.log(theRequest);
        return theRequest;
    }

    getWechatCode () {
        if (this.isWechat) {
            let appid = "wx8b0affba0db491bc&response_type=code"; //微信APPid
            let code = this.getUrlCode().code; //是否存在code
            let local = window.location.href;
            if (code == null || code === "") {
                //不存在就打开上面的地址进行授权
                window.location.href =
                    "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
                    appid +
                    "&redirect_uri=" +
                    encodeURIComponent(local) +
                    "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
            } else {
                this.afterLogin.active = true
                this.code = code;
                this.getWxCode()
            }
        }
    }

    onDestroy () {

    }
}

