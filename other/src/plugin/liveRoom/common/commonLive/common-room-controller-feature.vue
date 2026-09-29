<!--
 * @Description: 底部工具栏（创建白板、文件、成员列表和设备管理等）
-->
<template>
  <div class="common-room-controller-feature">

  </div>
</template>

<script>
import { getUserMedia } from '../../../js/room/utils/browser'
import { debounce } from '../../../js/room/utils/tool'

import zegoClient from '../../../js/room/zego/zegoClient/index'



const smallClassControlBtnList = [
  {
    name: 'camera',
    cnName: '摄像头',
    imgSrc: {
      default: require('../../../static/img/roomIcon/camera_open.svg').default,
      open: require('../../../static/img/roomIcon/camera_open.svg').default,
      close: require('../../../static/img/roomIcon/camera_close.svg').default,
      warn: require('../../../static/img/roomIcon/camera_warning.svg').default
    },
    canSpread: true,
    noAuth: true
  },
  {
    name: 'mic',
    cnName: '麦克风',
    imgSrc: {
      default: require('../../../static/img/roomIcon/microphone_open.svg').default,
      open: require('../../../static/img/roomIcon/microphone_open.svg').default,
      close: require('../../../static/img/roomIcon/microphone_close.svg').default,
      warn: require('../../../static/img/roomIcon/microphone_warning.svg').default
    },
    canSpread: true,
    noAuth: true
  },
  {
    name: 'speaker',
    cnName: '扬声器',
    imgSrc: {
      default: require('../../../static/img/roomIcon/sound_open.svg').default,
      open: require('../../../static/img/roomIcon/sound_open.svg').default,
      close: require('../../../static/img/roomIcon/sound_close.svg').default
    },
    canSpread: false,
    isOpen: true
  },
  {
    name: 'share',
    cnName: '共享',
    imgSrc: {
      default: require('../../../static/img/roomIcon/share.svg').default
    }
  },
  // {
  //   name: 'invite',
  //   cnName: '邀请',
  //   imgSrc: {
  //     default: require('../../../static/img/roomIcon/invite.svg').default
  //   }
  // },
  {
    name: 'member',
    cnName: '成员',
    imgSrc: {
      default: require('../../../static/img/roomIcon/member.svg').default
    }
  }
]

const largeClassControlBtnList = [
  {
    name: 'speaker',
    cnName: '扬声器',
    imgSrc: {
      default: require('../../../static/img/roomIcon/sound_open.svg').default,
      open: require('../../../static/img/roomIcon/sound_open.svg').default,
      close: require('../../../static/img/roomIcon/sound_close.svg').default
    },
    canSpread: false,
    isOpen: true
  },
  // {
  //   name: 'invite',
  //   cnName: '邀请',
  //   imgSrc: {
  //     default: require('../../../static/img/roomIcon/invite.svg').default
  //   }
  // },
  {
    name: 'member',
    cnName: '成员',
    imgSrc: {
      default: require('../../../static/img/roomIcon/member.svg').default
    }
  }
]

export default {
  name: 'CommonRoomControllerFeature',
  components: {
  },
  data() {
    return {
      controlBtnList:[],
      deviceInfo: {
        camera: [],
        mic: [],
        speaker: []
      },
      activeDeviceIds: {
        camera: '',
        mic: '',
        speaker: ''
      },
      memberListDialogShow: false, // 成员列表弹窗标识
      shareDialogShow: false, // 邀请弹窗标识
      quitDialogShow: false, // 退出课堂弹窗标识
      roomUserList: [], // 房间成员列表
      roomAuth: this.zegoLiveRoom.$http.auth, // 房间权限
      classScene: 1, // 当前课堂场景
      role: 1, // 当前用户角色
      liveRoomParams: null, // 直播间参数
      createStream: null, // 共享屏幕对象
    }
  },
  inject: ['zegoLiveRoom', 'thisParent', 'commonVideoRoomThis'],
  computed: {


  },
  created() {

    this.liveRoomParams = this.thisParent.liveRoomParams;
    this.role = this.thisParent.liveRoomParams.USER_INFO.role;
    this.classScene = this.thisParent.liveRoomParams.classScene;
  },
  mounted() {
    // console.warn(90909876,this.role, this.classScene)
    // 业务逻辑：如果是学生进入大班课场景，底部工具栏控制显示并且不启用设备推流
    // if(this.role === 2 && this.classScene === 2){
    //   this.controlBtnList = largeClassControlBtnList
    // } else {
      this.controlBtnList = smallClassControlBtnList;
  
    // debugger;
      this.initDevices()
   
      this.tryJionLive()
      // BUS.$on('userStateChange', this.tryJionLive)
    // }
    BUS.$on('roomAttendeesChange', this.onRoomAttendeesChange);
    BUS.$on('userHandStateChange', this.userHandStateChange);
    // BUS.$on('startShareGreen', this.handleCreateStream)
    // if(this.role == 2){
    //   this.handleCreateStream();
    // }
    this.handleMainBtnClick_ = debounce(this.handleMainBtnClick, 500, true);
  },
  destroyed() {
    BUS.$off('roomAttendeesChange', this.onRoomAttendeesChange)
    BUS.$off('userStateChange', this.tryJionLive)
    BUS.$off('userHandStateChange', this.userHandStateChange)
    // BUS.$off('startShareGreen', this.handleCreateStream)
  },
  methods: {
    

    /**
     * @desc: 监听房间成员变化
     */
    onRoomAttendeesChange(res) {
      this.roomUserList = res;
    },
    /**
     * @desc: 用户进入房间尝试开启摄像头和麦克风
     * @param {users}
     * @return {noSetUser}
     */
    async tryJionLive(users, noSetUser) {
     
      let deviceStatus = localStorage.getItem('deviceStatus') && JSON.parse(localStorage.getItem('deviceStatus')) || null;
      let cameraOpen = 2;
      let micOpen = 2;
      let USERID = this.zegoLiveRoom.$http.uid || this.liveRoomParams.USER_INFO.userID;
      let { mic, camera } = deviceStatus && deviceStatus[USERID] || {};
      if (mic) {
        micOpen = mic;
      }
      if (camera) {
        cameraOpen = camera;
      }
      let state = (users && users[USERID]) || { camera: 2, mic: 2 };
      state.camera = cameraOpen || state.camera;
      state.mic = micOpen || state.mic;

      this.roomAuth.mic = state.mic;
      this.roomAuth.camera = state.camera;

      // Object.assign(this.roomAuth, state)
      if (this.zegoLiveRoom.$http.role == this.liveRoomParams.ROLE_TEACHER) {
        if (state.camera == this.liveRoomParams.STATE_OPEN) {
          this.getUserMediaAuth(null, 0, false, async () => {
            await this.toggleDeviceOpen('video', this.controlBtnList[0], noSetUser)
          })
        } else {
          await this.toggleDeviceOpen('video', this.controlBtnList[0], noSetUser)
        }
        // if(this.thisParent.isHasOnlineStudent){
          if (state.mic == this.liveRoomParams.STATE_OPEN) {
            this.getUserMediaAuth(null, 1, false, async () => {
              await this.toggleDeviceOpen('audio', this.controlBtnList[1], noSetUser)
            })
          } else {
            await this.toggleDeviceOpen('audio', this.controlBtnList[1], noSetUser)
          }
        // }
      } else {
        if (state.camera == this.liveRoomParams.STATE_OPEN) {
          this.getUserMediaAuth(null, 0, false, () => {
            this.toggleDeviceOpen('video', this.controlBtnList[0], noSetUser)
          })
        }
        
        if (state.camera == this.liveRoomParams.STATE_CLOSE) {
          this.getUserMediaAuth(null, 0, false, () => {
            this.toggleDeviceOpen('video', this.controlBtnList[0], noSetUser)
          })
        }

        // if(this.thisParent.connecStatus === 1){

          if (state.mic == this.liveRoomParams.STATE_OPEN) {
            this.getUserMediaAuth(null, 1, false, () => {
              this.toggleDeviceOpen('audio', this.controlBtnList[1], noSetUser)
            })
          }
          if (state.mic == this.liveRoomParams.STATE_CLOSE) {
            this.getUserMediaAuth(null, 1, false, () => {
              this.toggleDeviceOpen('audio', this.controlBtnList[1], noSetUser)
            })
          }
        // }
      }
    },
    /**
     * @desc: 初始化 摄像头/麦克风/扬声器
     */
    async initDevices() {
      const devices = await this.zegoLiveRoom.getDevices()
      // console.warn(1111,'----devices', devices)
      const deviceInfo = {
        camera: devices.cameras,
        mic: devices.microphones,
        speaker: devices.speakers
      }
      this.$set(this, 'deviceInfo', deviceInfo)
   
      this.activeDeviceIds.camera = devices.cameras[0] && devices.cameras[0].deviceID
      this.activeDeviceIds.mic = devices.microphones[0] && devices.microphones[0].deviceID
      this.activeDeviceIds.speaker = devices.speakers[0] && devices.speakers[0].deviceID
      this.zegoLiveRoom.setActiveDevice(this.activeDeviceIds)
    },
    /**
     * @desc: 获取设备权限
     * @param {num} 0video 1audio undefined return
     * @param {showErrorToast} 展示错误提示，默认true
     * @param {cb} 回调方法
     */
    getUserMediaAuth(item, num, showErrorToast = false, cb) {
  //  this.showToast(num)
      const _this = this;
      if (num > 1) {
        // if (!_this.roomAuth.share && item.name == 'share') {
        //   _this.showToast('老师还未允许你使用共享功能')
        // }
        return
      }
      const option = {
        video: num == 0,
        audio: num == 1
      }
      /**
       * @desc: 获取设备权限
       * @param {option} 需要获取权限的设备
       * @param {success} 成功时执行的回调方法
       * @param {error} 失败时执行的回调方法
       */
       let USERID = this.zegoLiveRoom.$http.uid || this.liveRoomParams.USER_INFO.userID;

       let _deviceStatus = localStorage.getItem('deviceStatus');
       let deviceStatus = _deviceStatus && JSON.parse(_deviceStatus) || {};
       let STATE_CLOSE = _this.liveRoomParams.STATE_CLOSE;
      getUserMedia(
        option,
        stream => {
          _this.controlBtnList[num].noAuth = false
       
          // console.warn('图标权限----',_this.controlBtnList[num])
          if (num === 0) {
            stream.getVideoTracks().forEach(track => track.stop())
          } else if (num === 1) {
            stream.getAudioTracks().forEach(track => track.stop())
          }
          // this.initDevices()
          cb && cb()
        },
        error => {
          
          
          if (num === 0) {
            _this.roomAuth.camera = STATE_CLOSE
            if(deviceStatus[USERID]){
              deviceStatus[USERID]['camera'] =  STATE_CLOSE;
            }else {
              deviceStatus[USERID] = {
                camera: STATE_CLOSE 
              }
            }
            this.zegoLiveRoom.$http.setUserInfo({
              target_uid: USERID,
              camera: STATE_CLOSE
            })
          } else if (num === 1) {
            _this.roomAuth.mic = STATE_CLOSE
            if(deviceStatus[USERID]){

              deviceStatus[USERID]['mic'] = STATE_CLOSE;
            }else {
              deviceStatus[USERID] = {
                mic: STATE_CLOSE 
              }
            }
            this.zegoLiveRoom.$http.setUserInfo({
              target_uid: USERID,
              mic: STATE_CLOSE
            })
          }
          localStorage.setItem('deviceStatus', JSON.stringify(deviceStatus));
          console.warn('摄像头麦克风权限获取错误', error)
          if (showErrorToast) _this.showToast(`请检查${_this.controlBtnList[num].cnName}设备或者${_this.controlBtnList[num].cnName}权限是否开启`,3000, 'error')
       
        }
      )
    },

    handleMainBtnClick(item) {
      if (item.noAuth) return
      switch (item.name) {
        case 'camera':
          
          this.toggleDeviceOpen('video', item, false, true)
          break
        case 'mic':
          this.toggleDeviceOpen('audio', item, false, true)
          break
        case 'speaker':
          if (item) {
            this.zegoLiveRoom.muteSpeaker(!item.isOpen)
            let idx = this.controlBtnList.findIndex(v => v.name === item.name)
            item = { ...item, isOpen: !item.isOpen }
            idx !== -1 && this.$set(this.controlBtnList, idx, item)
          }
          break
        case 'member':
          this.memberListDialogShow = true
          break
        case 'invite':
          this.shareDialogShow = true
          break
        case 'quit':
          // this.quitClass();
          this.quitDialogShow = true
          break
        default:
          break
      }
    },
    
    /**
     * 离开直播间
     */
    async quitClass() {
      this.zegoLiveRoom.isquit = true;
      await zegoClient._client.logoutRoom(this.zegoLiveRoom.$http.roomId);
      // await this.zegoLiveRoom.$http.leaveRoom()
      window.open(' ','_self');
      window.close();
    },
    // 手动操作摄像头/麦克风
    userHandStateChange(users, noSetUser, tag) {
      let deviceStatus = localStorage.getItem('deviceStatus') && JSON.parse(localStorage.getItem('deviceStatus')) || null;
      let cameraOpen = 0;
      let micOpen = 0;
      let USERID = this.zegoLiveRoom.$http.uid || this.liveRoomParams.USER_INFO.userID;
      let { mic, camera } = deviceStatus && deviceStatus[USERID] || {};
      if (mic) {
        this.$set(this.roomAuth, 'mic', mic);
        micOpen = mic;
      }
      if (camera) {
        this.$set(this.roomAuth,'camera', camera);
        cameraOpen = camera;
      }
      let state = (users && users[USERID])
      state.camera = cameraOpen || state.camera;
      state.mic = micOpen || state.mic;
      Object.assign(this.roomAuth, state)
        this.getUserMediaAuth(null, tag == 'mic' ? 1 : 0, true, () => {
          // await this.toggleDeviceOpen('video', this.controlBtnList[0], noSetUser)
          this.toggleDeviceOpen(tag == 'mic' ? 'audio' : 'video', this.controlBtnList[tag == 'mic' ? 1 : 0], noSetUser);
        })
    },
    
    /**
     * @desc: 设备状态管理
     * @param {flag} 设备类型
     * @param {item} 点击该按钮信息
     * @param {noSetUser} 更新用户相关信息
     * @param {reverse}
     */
    async toggleDeviceOpen(flag, item, noSetUser, reverse) {
      console.warn('this.liveRoomParams.USER_INFO', flag, item, noSetUser, reverse)

      // if(!this.commonVideoRoomThis.isHasOnlineStudent && flag === 'audio') return
      // if (this.isCreateStream) return;
      if (!item.noAuth && !reverse) {
         await this.getUserMediaAuth(item, flag == 'audio' ? 1 : 0)

      }

// console.warn(8888888888888888888, 'toggleDeviceOpen', flag, this.roomAuth, noSetUser, reverse)
      if (!noSetUser) {
        const key = flag == 'video' ? 'camera' : 'mic'
        const val = this.roomAuth[key]
        const params = {
          target_uid: this.zegoLiveRoom.$http.uid,
          [key]:  reverse ? (val == this.liveRoomParams.STATE_OPEN ? this.liveRoomParams.STATE_CLOSE : this.liveRoomParams.STATE_OPEN) : val
        }
        await this.zegoLiveRoom.$http.setUserInfo(params)
        this.roomAuth[key] = params[key]
      }

      let role = this.liveRoomParams.USER_INFO.role;

      if(flag == 'video'){
        this.zegoLiveRoom.handleDeviceStateChange(
          flag,
          this.roomAuth.camera == this.liveRoomParams.STATE_OPEN,
          this.roomAuth.mic == this.liveRoomParams.STATE_OPEN
        )
      }
      if(flag == 'audio'){
        if(role == 1 && this.commonVideoRoomThis.isHasOnlineStudent || role == 2 && this.thisParent.connecStatus == 1){
          this.zegoLiveRoom.handleDeviceStateChange(
            flag,
            this.roomAuth.camera == this.liveRoomParams.STATE_OPEN,
            this.roomAuth.mic == this.liveRoomParams.STATE_OPEN
          )
        }
      }
      this.zegoLiveRoom.$http.getJoinLiveList()
    },

    /**
     * @desc: 获取设备状态图标
     * @param {item} 对应设备item
     * @return {imgSrc.state} 设备状态图标路径
     */
    getItemIcon(item) {
      // if (item.noAuth) return
      // 返回除了摄像头/麦克风/扬声器 的默认图标
      if (!item.canSpread && item.name !== 'speaker') return item.imgSrc.default
      if (item.noAuth) return item.imgSrc.warn
      if (item.isOpen || this.roomAuth[item.name] == this.liveRoomParams.STATE_OPEN) return item.imgSrc.open
      return item.imgSrc.close
    },

    /**
     * @desc: 麦克风/摄像头设备切换
     * @param {设备id} value 
     * @param {设备类型 'camera'|'mic'} type
     */    
    handleChangeDevice(value, type){
      this.zegoLiveRoom.selectDevice(value, type)
      if(type ==='camera') this.activeDeviceIds.camera = value
      if(type ==='mic') this.activeDeviceIds.mic = value
      this.handleAnalogTriggerClick()
    },
    /**
     * @desc: 点击创建白板之后关闭改按钮显示
     */
    handleAnalogTriggerClick() {
      const analogTrigger = this.$refs.analogTrigger
      if (analogTrigger) analogTrigger.click()
    },
    changeActiveDevice(){
      this.zegoLiveRoom.setActiveDevice(this.activeDeviceIds)
    },
    

    /**
     * 创建屏幕共享
     * 
     */
    async handleCreateStream() {
      if(this.role != 2) return;

      // 已经再共享屏幕直接退出
      if (this.commonVideoRoomThis.share) {
        this.showToast('已经在共享屏幕了')
        return;
      };
      await this.zegoLiveRoom.shareClient.destroyStream();
      this.createStream = null;
      const option = {
        screen: {
          //@ts-ignore
          audio: false, 
          videoQuality: 4,
          bitrate: 2000,
          frameRate: 10,
          width: 1920,
          height: 1080
        }
      }
      // 检测浏览器是否支持共享
      const isShare  = await this.zegoLiveRoom.shareClient.checkAnRun(true);
      if (!isShare) return;
      this.createStream = await this.zegoLiveRoom.shareClient.express('createStream', option);
      if (this.createStream) {
        this.commonVideoRoomThis.share = true;
        const { user } = zegoClient.getState('user')
        const identity = this.thisParent.liveRoomParams.USER_INFO.identity || '';
        const streamID = `${identity}${identity ? '_' : ''}share_${user.userID}_${Date.parse(new Date())}`;
        // 抛出共享流信息
        BUS.$emit('setShareStrem', this.createStream, streamID)
        
        await this.zegoLiveRoom.shareClient.express('startPublishingStream', streamID, {});
        // 设置共享流ID
        this.zegoLiveRoom.setStuStreamID(streamID)
        // BUS.$emit('startShare', streamID)

      } else {
          this.commonVideoRoomThis.share = false;
      }
      
    },

      
  }
}
</script>
<style lang="scss" scoped>

@import '../../../static/css/room/_mixin.scss';
.common-room-controller-feature {
  display: inline-flex;
  @include wh(0px, 0px);
  margin: 0 auto;
  background-color: #ffffff;
  .control-btn-list {
    display: inline-flex;
    align-items: center;
    height: 100%;
    margin: 0 auto;
    li:hover {
      .can-spread {
        background: #f4f5f8;
        & + span {
          .el-popover__reference {
            border-radius: 0 4px 4px 0;
          }
        }
      }
      .el-popover__reference {
        background-color: #e4e5eb;
      }
    }
  }

  .control-btn-item {
    display: flex;
    align-items: center;
    color: #585c62;
    cursor: pointer;
    // background-color: #f4f5f8;
    .el-popover__reference {
      // border-radius: 0 4px 4px 0;
      .btn-name {
        @include sc(12px, #585c62);
        margin-top: 2px;
        font-family: Microsoft YaHei, Avenir, Helvetica, Arial, sans-serif;
        font-weight: normal;
      }
      .btn-name:hover {
        color: #18191a;
      }
    }
    & + .control-btn-item {
      margin-left: 16px;
    }

    &.no-auth {
      .sub-btn {
        /deep/ {
          .hover-stroke {
            stroke: #b9bac1;
          }
          .hover-fill {
            fill: #b9bac1;
          }
        }
      }

      .main-btn {
        position: relative;

        &:hover {
          .no-auth-tip {
            display: block;
          }
        }
      }
    }

    /deep/ {
      .el-button {
        padding: 0;
        border: 0;
      }
      .memberNum {
        @include wh(22px, 13px);
        @include sc(10px, #fff);
        @include abs-pos(19px, auto, auto, 19px);
        font-weight: 400;
        line-height: 13px;
        background-color: rgb(70, 74, 77);
        z-index: 2;
        border-radius: 4px;
      }
    }

    .main-btn {
      @include wh(54px, 54px);
      box-sizing: border-box;
      position: relative;
      padding-top: 2px;
      text-align: center;
      font-size: 12px;
      border-radius: 4px;
      background: #fff;
      &.can-spread {
        border-radius: 4px 0 0 4px;
      }

      &:hover {
        background: rgba(244, 245, 248, 1);
      }

      &.active {
        color: #0044ff;
      }

      &:not(.active):hover {
        color: #18191a;
        /deep/ {
          .hover-stroke {
            stroke: #18191a;
          }
          .hover-fill {
            fill: #18191a;
          }
        }
      }

      .main-icon {
        @include wh(32px, 32px);
        margin: 0 auto;
      }

      .no-auth-tip {
        @include sc(12px, #fff);
        @include abs-pos(auto, auto, 105%, 50%);
        display: none;
        height: 32px;
        line-height: 32px;
        padding: 0 9px;
        white-space: nowrap;
        border-radius: 4px;
        background: rgba(0, 0, 0, 0.7);
        transform: translate(-50%, 0);
      }
    }

    .el-sub-btn {
      &.el-button:focus,
      &.el-button:hover {
        background: rgba(228, 229, 235, 1);
        border-radius: 0 4px 4px 0;
      }

      &.el-button:focus {
        .sub-btn {
          .arrow-btn {
            transform: rotate(180deg);
            transition: transform 0.3s ease;
          }
        }
      }

      .sub-btn {
        height: 54px;
        line-height: 54px;

        .arrow-btn {
          width: 14px;
          transform-origin: center;
          transform: rotate(0deg);
          transition: transform 0.3s ease;
        }
      }
    }

  }

  .quit-button {
    display: inline-flex;
    align-items: center;
    height: 100%;
    margin-right: 10px;
    z-index: 10;
    .quit-button-item {
      display: inline-flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      @include wh(76px, 36px);
      @include sc(12px, #18191a);
      border: 1px solid #edeff3;
      border-radius: 6px;
      background-color: #fff;
      cursor: pointer;
      // line-height: 36px;
      outline: 0;
      &:hover {
        /deep/ {
          .hover-stroke {
            stroke: #585c62;
          }
        }
        border-color: #b1b4bc;
        color: #18191a;
      }
      &:active {
        color: #0044ff;
        border-color: #0044ff;
        background-color: #f0f4ff;
        /deep/ {
          .hover-stroke {
            stroke: #0044ff;
          }
        }
      }
      .button-icon {
        display: inline-block;
        @include wh(20px, 20px);
        margin-right: 6px;
      }
    }
  }
}


.control-btn-share-popper {
  padding: 0 !important;
  .share-list-popper {
    padding: 14px 20px;
    display: flex;
    justify-content: space-between;
    border-radius: 6px;
    .share-item {
      @include wh(54px, 58px);
      text-align: center;

      &:hover {
        cursor: pointer;
        background: rgba(244, 245, 248, 1);
        color: #18191a;
        border-radius: 4px;

        .hover-stroke {
          stroke: #18191a;
        }
      }
    }
    .si-icon {
      @include wh(30px, 30px);
      margin: 6px auto 4px;
    }
    .si-name {
      font-size: 12px;
    }
  }
}
</style>
