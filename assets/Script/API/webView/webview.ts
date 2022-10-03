import { _decorator, Component, WebView } from 'cc';
const { ccclass, type } = _decorator;

@ccclass('WebViewCtrl')
export class WebViewCtrl extends Component {
    @type(WebView)
    webview = null;
    public url: string

    start () {

        this.webview.node.on(WebView.EventType.LOADED, this.callback, this);
        this.webview.node.on(WebView.EventType.ERROR, this.error, this);
        this.webview.evaluateJS('Test( )');

    }

    callback (webview) {
        // 这里的 webview 是一个 WebView 组件对象

        // 对 webview 进行你想要的操作
        // 另外，需要注意的是通过这种方式注册的事件，无法传递 customEventData
        this.webview.url = 'http://127.0.0.1:3000'
    }
    error (webview) {
        alert('加载失败' + webview.error)
    }
    Text () {

    }
}