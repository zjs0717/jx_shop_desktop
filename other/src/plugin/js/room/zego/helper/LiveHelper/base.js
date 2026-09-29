

export class LiveHelper {
  _client = null
  constructor({ context, client }) {
    
    // this.context = context
    this._client = client
    this.room_id = null
    this.roomUserList = []
    this.localStream = null
    this.localAudioStream = null

    this.stream_publish_state = 'NO_PUBLISH' // NO_PUBLISH-未推流状态｜PUBLISH_REQUESTING-正在请求推流状态｜PUBLISHING-正在推流状态
    this.isCreatingStream = false
    this.isCreatingAudioStream = false
    // this.proxy()
  }

  /**
   * 监听事件
   */
  on(eventName, callback) {
    this._client && this._client.on(eventName, callback)
  }

  getProxyFunc() {
    return [
      'createStream',
      'createAudioStream',
      'startPreview',
      'startAudioPreview',
      'startPublishingStream',
      'startAudioPublishingStream',
      'startPlayingStream',
      'startPlayingAudioStream',
      'mutePublishStreamAudio',
      'mutePublishStreamVideo',
      'loginRoom',
      'logoutRoom',
      'enumDevices',
      'useVideoDevice',
      'useAudioDevice',
      'stopPlayingStream',
      'stopPublishingStream',
      'stopAudioPublishingStream',
      'setRoomExtraInfo',
      'sendBroadcastMessage',
      'sendCustomCommand',
      'removeElementAudio'

    ]
  }

  /**
   * 通用调底层方法, 抹平请求接口差异
   * @param {方法名称} methodName
   * @param {参数} args
   * @returns {*}
   */
  express(methodName = '', ...args) {
    const proxyFunc = this.getProxyFunc()
    if (proxyFunc.some(func => func === methodName)) {
      return this[methodName](...args)
    } else {
      console.warn('不存在该方法, methodName=', methodName)
    }
  }

  async loginRoom(roomID = '', config = {}) {
// debugger
    const { token1 } = window.zg_ZegoClient.state.tokenInfo
    config = { userUpdate: true, maxMemberCount: window.zg_ZegoClient.Config.maxMemberCount, ...config }
    const { userID, userName } = window.zg_ZegoClient.state.user
   
    let res
    try {
      const args = [roomID, token1, { userID, userName }, config]
      res = await this._client.loginRoom(...args);
     
      if (res) {
        this.afterLoginRoom(roomID)
      }
      res = {
        error: false
      }
      // window.zg_ZegoClient.setState({ tokenInfo: {} })
    } catch (e) {
      console.log('login error', { e })
      // window.zg_ZegoClient.setState({ tokenInfo: {} })
      res = {
        error: true,
        msg: e.msg,
        code: e.code
      }
    }
    return res
  }

  async logoutRoom(roomID = '', config = {}) {

    const { token1 } = window.zg_ZegoClient.state.tokenInfo
    config = { userUpdate: true, maxMemberCount: window.zg_ZegoClient.Config.maxMemberCount, ...config }
    const { userID, userName } = window.zg_ZegoClient.state.user
   
    let res
    try {
      const args = [roomID, token1, { userID, userName }, config]
      res = await this._client.logoutRoom(...args);
     
      // if (res) {
      //   // console.warn('loginRoom is success!!')
      //   // this.afterLoginRoom(roomID)
      // }
      res = {
        error: false
      }
      // window.zg_ZegoClient.setState({ tokenInfo: {} })
    } catch (e) {
      console.log('login error', { e })
      // window.zg_ZegoClient.setState({ tokenInfo: {} })
      res = {
        error: true,
        msg: e.msg,
        code: e.code
      }
    }
    return res
  }

  afterLoginRoom(roomId) {
    this.room_id = roomId
    this.roomUserList.push(window.zg_ZegoClient.state.user)
    window.zg_ZegoClient.setState({
      isLogin: true,
      room_id: roomId
    })
  }

  async createStream(option) {
    if (this.isCreatingStream) return;
    this.isCreatingStream = true;
    this.localStream = await this._client.createStream(option);
    return this.localStream;
  }
  
  async createAudioStream(option) {
    // debugger
    
    if (this.isCreatingAudioStream) return;
    this.isCreatingAudioStream = true;

    this.localAudioStream = await this._client.createStream(option);
    return this.localAudioStream;
  }
  
  
  startPublishingStream(streamID, publishOption) {
    if (!this.localStream) {
      console.warn('this.localStream is not exist！!')
      return
    }
    return this._client.startPublishingStream(streamID, this.localStream, publishOption)
  }

  startAudioPublishingStream(streamID, publishOption) {
    if (!this.localAudioStream) {
      console.warn('this.localAudioStream is not exist！!')
      return
    }
    return this._client.startPublishingStream(streamID, this.localAudioStream, publishOption)
  }

  // 检测浏览器是否支持共享
  async checkAnRun(checkScreen) {
    try {
        const result = await this._client.checkSystemRequirements();
        if (!result.webRTC) {
            alert('浏览器不支持webRTC协议传输流!!');
            return false;
        } else if (!result.videoCodec.H264 && !result.videoCodec.VP8) {
            alert('浏览器不支持的 H264 和 VP8 视频编码格式');
            return false;
        } else if (result.videoCodec.H264 && checkScreen && !result.screenSharing) {
          alert('浏览器不支持共享屏幕');
            return false;
        }
        return true;
    } catch (err) {
        return false;
    }


  }

  startPreview(streamID, element) {
    let $video = document.getElementById(streamID)
    this.removeElementVideo(element)
    if (!$video) {
      $video = document.createElement('video')
      $video.style.width = '100%'
      $video.style.height = '100%'
      $video.disablePictureInPicture = true; // 禁止画中画

      $video.setAttribute('autoplay', true)
      // $video.setAttribute('controls ', false)
      $video.setAttribute('muted', true)
      $video.setAttribute('id', streamID)
      element.appendChild($video)
    }
    $video.srcObject = this.localStream
  }


  

  // 重写startPlayingStream
  async startPlayingStream(streamID, playOption = {}, element) {
    const stream = await this._client.startPlayingStream(streamID, playOption)
    let $video = document.getElementById(streamID)
    this.removeElementVideo(element)
    if (!$video) {
      $video = document.createElement('video')
      
      $video.style.width = '100%'
      $video.style.height = '100%'
      $video.setAttribute('autoplay', true)
      $video.disablePictureInPicture = true; // 禁止画中画

      $video.setAttribute('muted', true)
      $video.setAttribute('id', streamID)
      $video.style.position = 'absolute'
      $video.style.left = 0
      $video.style.top = 0
      element.appendChild($video)
    }
    $video.srcObject = stream
  }

  removeElementVideo(element) {
    if (element.removeChild) {
      let $videos = element.getElementsByTagName('video')
      if ($videos.length) {
        for (let i = 0; i < $videos.length; i++) {
          element.removeChild($videos[i])
        }
      }
      $videos = null
    }
  }


  startAudioPreview(streamID, element) {
    let $audio = document.getElementById(streamID)
    this.removeElementVideo(element)
    if (!$audio) {
      $audio = document.createElement('video')
      $audio.style.width = '0'
      $audio.style.height = '0'
      $audio.setAttribute('autoplay', true)
      // $audio.setAttribute('controls ', false)
      $audio.setAttribute('muted', false)
      $audio.setAttribute('id', streamID)
      element.appendChild($audio)
    }
    $audio.srcObject = this.localAudioStream
  }

  async startPlayingAudioStream(streamID, playOption = {}, element) {
    // audio 播放音频流 需要 手动点击触发

    const stream = await this._client.startPlayingStream(streamID, playOption)
    let $audio = document.getElementById(streamID)
    this.removeElementAudio(element)
    if (!$audio) {
      $audio = document.createElement('video')
      
      $audio.style.width = '0'
      $audio.style.height = '0'
      $audio.setAttribute('autoplay', true)
      // $audio.setAttribute('controls ', false)
      $audio.setAttribute('muted', false)
      $audio.setAttribute('id', streamID)
      $audio.style.position = 'absolute'
      $audio.style.left = 0
      $audio.style.top = 0
      element.appendChild($audio)
    }
    $audio.srcObject = stream
  }
  
  removeElementAudio(element) {
    if (element.removeChild) {
      let $audios = element.getElementsByTagName('audio')
      if ($audios.length) {
        for (let i = 0; i < $audios.length; i++) {
          element.removeChild($audios[i])
        }
      }
      $audios = null
    }
  }


  mutePublishStreamAudio(mute) {
    return this._client.mutePublishStreamAudio(this.localAudioStream, mute)
  }

  mutePublishStreamVideo(mute) {
    return this._client.mutePublishStreamVideo(this.localStream, mute)
  }

  async enumDevices() {
    return await this._client.enumDevices()
  }

  async useVideoDevice(value) {
    return await this._client.useVideoDevice(this.localStream, value)
  }

  async useAudioDevice(value) {
    return await this._client.useAudioDevice(this.localAudioStream, value)
  }
  
  
  stopPlayingStream(streamID) {
    this._client.stopPlayingStream(streamID)
  }

  stopPublishingStream(streamID) {
    this._client.stopPublishingStream(streamID)
    this.destroyStream()
    return Promise.resolve(true)
  }

  stopAudioPublishingStream(streamID){
    this._client.stopPublishingStream(streamID)
    this.destroyStream(true)
    return Promise.resolve(true)
  }

  destroyStream(val) {
    
    if(val){
      this._client.destroyStream(this.localAudioStream)
      this.localAudioStream = null;
      this.isCreatingAudioStream = false
    }else {      
      this._client.destroyStream(this.localStream)
      this.localStream = null
      this.isCreatingStream = false
    }
  }

  setRoomExtraInfo(key, value) {
    this._client.setRoomExtraInfo(this.room_id, key, value)
  }

  async sendBroadcastMessage(message) {
    return await this._client.sendBroadcastMessage(this.room_id, message)
  }
  // 发送自定义信令（消息可靠）
  // toUserIDList 目标用户uerId 数组。传入空数组则表示是发送给房间内所有用户。
  async sendCustomCommand(message, toUserIDList) {
    
    return await this._client.sendCustomCommand(this.room_id, message, toUserIDList)
  }
}
