import { FrontConfig } from './FrontConfig';

/** 网络请求相关 */
// create an instance.
export class NetUtil {
    public socket: Socket = io.connect(FrontConfig.matchServer)
}

(window as any).NetUtil = NetUtil;