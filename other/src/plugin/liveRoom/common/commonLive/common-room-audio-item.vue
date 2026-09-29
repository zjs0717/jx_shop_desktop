<!--
 * @Description: 坐席区组件
-->
<template>
  <div class="common-room-audio-item"></div>
</template>

<script>
import { isFirefox } from '../../../js/room/utils/browser'

export default {
  name: 'CommonRoomAudioItem',
  props: ['stream'],
  components: {
    // RoomControllerVideo
  },
  data() {
    return {
      interaction   : false,    // 是否已交互
      isMuted       : false,     // 默认不静音
      ROLE_TEACHER: '',
      STATE_OPEN: '',
    }
  },
  inject: ['thisParent', 'zegoLiveRoom'],
  computed: {
    // 该用户麦克风是否打开
    isAudioOpen() {
      return this.stream.user.mic == this.STATE_OPEN
    },
    // 该用户是否加入连麦
    isJoing() {
      return this.stream.user.joing
    },
    // 该用户是否老师
    isTeacher() {
      return this.stream.user.role == this.ROLE_TEACHER
    },
    // 老师是否退出当前房间
    isTeacherQuit() {
      return this.isTeacher && !this.stream.user.uid
    },
    // 当前房间是否销毁
    isDestroy() {
      return !this.isAudioOpen || !this.isJoing
    }
  },
  watch: {
    /**
     * @desc: 销毁之前需要停止播放流
     */    
    isDestroy(newVal) {
      if (newVal) {
        this.stream.streamID && this.zegoLiveRoom.stopPlayingStream(this.stream.streamID)
        this.deleteVideoTag()
      }
    },
    isTeacherQuit(newVal) {
      if (newVal) {
        this.zegoLiveRoom.stopPlayingStream(this.stream.streamID)
        this.deleteVideoTag()
      }
    },
    /**
     * @desc: 监听摄像头状态
     * @param {newVal} 摄像头是否开启
     */    
     isAudioOpen(newVal) {
      if (newVal) {
        const $video = document.getElementById(this.stream.streamID)
        if ($video) {
          // tip:本端播放自己流的video muted属性设置都是为true，播放其他流的video的muted属性则根据扬声器状态来设置
          $video.muted = false;
          $video.play()
        }
      }
    },
    
    /**
     * @desc: 监听流id变化
     * @param {value} 新的流
     * @return {oldValue} 旧的流
     */    
    'stream.streamID': {
      handler(value, oldValue) {
      // tip:重新拉流之前需把旧的流停止拉取，不然会重复拉流
          if (!value) {
            this.zegoLiveRoom.stopPlayingStream(oldValue)
          } else {
            this.zegoLiveRoom.stopPlayingStream(value)
          }
          this.$nextTick().then(() => this.pullVideo(value))
      },
      immediate: true
    }
  },
  
  created() {
    this.ROLE_TEACHER = this.thisParent.liveRoomParams.ROLE_TEACHER;
    this.STATE_OPEN = this.thisParent.liveRoomParams.STATE_OPEN;
  },
  mounted() {
    this.pullVideo(this.stream.streamID)
    this.onMuteSpeaker()
  },
  beforeDestroy() {
    // tip:electron集成相关操作，web集成可不管
    if (this.$video && this.$video.nodeName === 'CANVAS') {
      if (this.isMe) {
        this.zegoLiveRoom.stopPreview()
      } else {
        this.zegoLiveRoom.stopPlayingStream(this.stream.streamID)
      }
      this.zegoLiveRoom.loseCanvasContext({ canvas: this.$video }, () => {
        this.$video = null
      })
      return
    }
    this.stream.streamID && this.zegoLiveRoom.stopPlayingStream(this.stream.streamID)
    this.$video = null
  },
  methods: {
    /**
     * @desc 扬声器监听
     */
    onMuteSpeaker() {
      this.zegoLiveRoom.onMuteSpeaker(isOpen => {
        this.isMuted = !isOpen // 设置静音
        const $video = document.getElementById(this.stream.streamID)
        if (!$video) return
        if ($video && $video.nodeName == 'CANVAS') {
          // tip:electron集成相关操作，web集成可不管
          this.zegoLiveRoom.enableSpeaker({ enable: isOpen })
        } else if ($video && $video.nodeName == 'VIDEO') {
          // tip:本端播放自己流的video muted属性设置都是为true，播放其他流的video的muted属性则根据扬声器状态来设置
          $video.muted = false;

        }
      })
    },
    /**
     * @desc 拉流
     * @returns {Promise<void>}
     */
    async pullVideo(streamID) {
      if (!streamID) {
        this.deleteVideoTag()
        return
      }
      const className = 'audio' + (this.stream.type === 'push' ? ' pull-stream' : '')
      // tip:如果是本端拉自己的流则直接预览即可，如果是要拉对端的流则使用startPlayingStream播放流
      await this.zegoLiveRoom.startPlayingAudioStream(streamID, {audio: true, video: false}, this.$el)

      
      this.$video = document.getElementById(streamID);
      this.$video.setAttribute('class', className)
      // tip:本端播放自己流的video muted属性设置都是为true，播放其他流的video的muted属性则根据扬声器状态来设置
      this.$video.muted = false
      // tip:electron集成相关操作，web集成可不管
      if (this.$video.nodeName === 'CANVAS') return
      this.autoPlay()
    },
    
    /**
     * @desc: 渲染的video自动播放音视频流
     */    
    autoPlay() {
      if (isFirefox) {
        this.tryFirefoxPlay(this.$video)
        return
      }
      const canplayHandle = $ele => {
        if ($ele) {
          $ele.muted = false

          $ele.play()
        }
      }
      if (this.interaction) {
        this.$video.addEventListener('canplay', () => {
          canplayHandle(this.$video)
        })
      } else {
        const $app = document.getElementById('app')
        const mousedownHandle = () => {
          console.warn('模拟交互 自动播放')
          canplayHandle(this.$video)
          this.interaction = true
          $app.removeEventListener('mousedown', mousedownHandle)
        }
        this.$video.click()
        $app.addEventListener('mousedown', mousedownHandle)
      }
    },
    /**
     * @desc 浏览器兼容性处理
     */    
    tryFirefoxPlay($video) {
      if (!$video) return
      $video
        .play()
        .then(() => {
          console.warn('firefox', '播放成功')
          clearTimeout($video.tryPlaytimer)
          $video.muted = false;
        })
        .catch(e => {
          console.warn('firefox', '播放失败', e)
          $video.tryPlaytimer = setTimeout(() => {
            this.tryFirefoxPlay($video)
          }, 200)
        })
    },

    /**
     * @desc: 每次停止拉流，生成的video标签需要开发者自行销毁
     */    
    deleteVideoTag() {
      if (this.$el && this.$el.removeChild) {
        let $videos = this.$el.getElementsByTagName('video')
        if ($videos.length) {
          for (let i = 0; i < $videos.length; i++) {
            this.$el.removeChild($videos[i])
          }
        }
        $videos = null
      }
    }
  }
}
</script>

<style lang="scss">
.common-room-audio-item {
  width: 0;
  height: 0;
  video {
  width: 0;
  height: 0;
}

}
</style>
