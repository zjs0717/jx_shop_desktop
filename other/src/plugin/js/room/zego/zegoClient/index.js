import { ZegoClient } from './base'

import { ZegoExpressEngine } from 'zego-express-whiteboard-web';
import { ZegoExpressDocs } from 'zego-express-docsview-web';


class WebZegoClient extends ZegoClient {
  /**
   * @desc: 初始化web端sdk
   * @param {user} 用户信息
   */
  async initSDK(user) {
    
    if (this._client) return
    const { userID } = user
    const { env = 'home' } = this.state
    const { appID, logURL, server, isTestEnv, docsviewAppID } = await this.Config.getParams(env)
    const zg = new ZegoExpressEngine(appID, server)
    const zgDocsClient = new ZegoExpressDocs({
      appID: docsviewAppID,
      token: this.state.tokenInfo.token2,
      userID,
      isTestEnv
    })

    this._client = zg;
    const config = {
      logLevel: "error",
      remoteLogLevel: 'error'
    }
    logURL && (config.logURL = logURL)
    this.setState({ user })
    zg.setLogConfig(config)
    // 测试环境中关闭调试模式，否则任何sdk错误均会alert弹出
    zg.setDebugVerbose(false)

    this._docsClient = zgDocsClient

  }
}

export default new WebZegoClient()
