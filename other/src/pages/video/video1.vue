<template>
    <div class="videoPage" :style="{height: height, width: width}">
        <div class="cm-video" :class="classId">
            <img v-if="watermark" :src="watermark" class="video-logo" :style="{
                'pointer-events': 'none',
                'opacity': 1,
                'width': watermarkWidth,
                'top': watermarkTop,
                'right': watermarkRight
            }"/>
        </div>
    </div>
</template>

<script>
import Player from 'xgplayer';
import 'xgplayer/dist/index.min.css';
import HlsPlugin from 'xgplayer-hls'; // 引入HLS插件
export default {
    name: 'cm-video',
    props: {
        preload: {
            type: String,
            default: 'metadata',
            validator: (value) => ['auto', 'metadata', 'none'].includes(value)
        },
        poster: {
            type: String,
            default: ''
        },
        autoplay: {
            type: Boolean,
            default: false
        },
        loop: {
            type: Boolean,
            default: false
        },
        muted: {
            type: Boolean,
            default: false
        },
        src: {
            type: String,
            default: '',
            required: true
        },
        height: {
            type: String,
            default: 'auto'
        },
        width: {
            type: String,
            default: '100%'
        },
        watermark: {
            type: String,
            default: 'https://downloadfile.e-eduspace.com/waterMarkImg.png'
        },
        // 水印宽度
        watermarkWidth: {
            type: String,
            default: '100px'
        },

        // 水印距离顶不位置
        watermarkTop: {
            type: String,
            default: '10px'
        },
        // 水印距离右侧位置
        watermarkRight: {
            type: String,
            default: '40px'
        },
        speedList: {
            type: Array,
            default: () => [0.5, 1.0, 1.25, 1.5, 2.0]
        },
        curTime: {
            type: [String, Number],
            default: 0
        },
        
    },
    data() {
        return {
            classId: `cm-video-${Date.now()}`,
            videoInfo: null,
        }
    },
    
    watch: {
        // 监听 src 变化，重新初始化播放器
        src(newSrc) {
            if (newSrc) {
                this.$nextTick(() => {
                    this.destroyPlayer();
                    this.initPlayer();
                });
            }
        },
        // 监听播放时间变化
        curTime(newTime) {
            if (this.videoInfo && newTime) {
                this.videoInfo.currentTime = Number(newTime);
            }
        }
    },
    
    mounted() {
        this.$nextTick(() => {
            this.initPlayer();
        });
    },
    
    beforeDestroy() {
        this.destroyPlayer();
    },

    methods: {
        /**
         * 初始化播放器
         */
        initPlayer() {
            if (!this.src) {
                console.warn('Video source is empty');
                return;
            }

            try {
                const playerConfig = {
                    el: document.querySelector(`.${this.classId}`), // 指定容器
                    url: this.src, //   视频地址
                    volume: 0.6, // 默认音量
                    poster: this.poster, // 视频封面
                    type: 'hls', // 强制指定为 HLS 流
                    autoplay: this.autoplay, // 自动播放
                    loop: this.loop, // 循环播放
                    // videoInit: true, // 初始化显示视频首帧,与autoplay配置项不可同时设置为true
                    lastPlayTime: this.curTime, // 视频起播时间（单位：秒）
                    playbackRate: this.speedList, // 倍速
                    // 设置初始播放时间
                    lastPlayTime: Number(this.curTime) || 0,
                    lang: 'zh-cn', // 设置语言
                    controls: true,
                    definitionActive: 'click',   // 也可设为 'click'
                    ignores: ['cssfullscreen'],
                };
                
                const isHls = this.isHlsStream(this.src); // 判断是否是HLS流
                
                if (isHls) {
                    playerConfig.plugins = [HlsPlugin]; // 使用HLS插件
                }
                this.videoInfo = new Player(playerConfig);
                // 添加事件监听
                this.setupPlayerEvents();
                
            } catch (error) {
                console.error('Failed to initialize video player:', error);
            }
        },
           /**
         * 检查是否为HLS流
         */
         isHlsStream(url) {
            return url && (url.includes('.m3u8') || url.includes('application/vnd.apple.mpegurl'));
        },

        /**
         * 获取HLS清晰度列表
         */
        getHlsLevels() {
            const hls = this.videoInfo.plugins.hls.hls;
            console.log(hls)
            return hls ? hls.streams : [];
        },

        /**
         * 设置播放器事件监听
         */
        setupPlayerEvents() {
            if (!this.videoInfo) return;

      
            
            // 音视频元数据
            this.videoInfo.on('loadedmetadata', () => {

                const isHls = this.isHlsStream(this.src); // 判断是否是HLS流
                if (!isHls) return
                function mapBitrate2Name(bps) {
                    if (bps >= 15000000) return '4K';
                    if (bps >= 6000000)  return '2K';
                    if (bps >= 3000000)  return '超清';
                    if (bps >= 1500000)  return '高清';
                    if (bps >= 900000)   return '标清';
                    if (bps >= 700000)   return '流畅';
                    return '流畅';
                }
                const b2p = b =>
                    b >= 15000000 ? '4K' :
                    b >= 6000000  ? '1440P' :
                    b >= 3000000  ? '1080P' :
                    b >= 1500000  ? '720P' :
                    b >= 900000    ? '540P' :
                    b >= 700000    ? '480P' :
                    b >= 400000    ? '360P' : '360P';
                let levels = this.getHlsLevels();
                // 清晰度 → 排序权重
                const levelWeight = {
                    '360P': 7,
                    '480P': 6,
                    '540P': 5,
                    '720P': 4,
                    '1080P': 3,
                    '1440P': 2,
                    '4K': 1
                };
                
                const bitrateArr = levels.map(i => i.bitrate);
                const min = Math.min(...bitrateArr);
                const max = Math.max(...bitrateArr);
                const filtered = levels.filter(i => i.bitrate === min || i.bitrate === max);
                const newList = filtered.map(item => {
                    const isLow = (item.url || '').includes('.low');
                    return {
                        definition: isLow ? 'SD' : 'HD',// 清晰度
                        url: item.url,
                        // text: {
                        //     zh: mapBitrate2Name(item.bitrate),
                        //     en: mapBitrate2Name(item.bitrate)
                        // }
                        // text: {
                        //     zh: item.bitrate === max ? '高清' : '标清',
                        //     en: item.bitrate === max ? '高清' : '标清'
                        // }
                        text: { zh: isLow ? '标清' : '高清', en: isLow ? '标清' : '高清' }
                    };
                }).sort((a, b) => a.definition === 'SD' ? -1 : 1);
                // .sort((a, b) => levelWeight[a.definition] - levelWeight[b.definition]);
                this.videoInfo.emit('resourceReady', newList);
                
            });
            

            // 播放事件
            this.videoInfo.on('play', () => {
                this.$emit('play', this.videoInfo);
            });

            // 暂停事件
            this.videoInfo.on('pause', () => {
                this.$emit('pause', this.videoInfo);
            });

            // 结束事件
            this.videoInfo.on('ended', () => {
                this.$emit('ended', this.videoInfo);
            });

            // 错误事件
            this.videoInfo.on('error', (error) => {
                this.$emit('error', error);
            });

            // 时间更新事件
            this.videoInfo.on('timeupdate', (currentTime) => {
                this.$emit('timeupdate', currentTime);
            });
        },

        /**
         * 销毁播放器
         */
        destroyPlayer() {
            if (this.videoInfo) {
                this.videoInfo.destroy();
                this.videoInfo = null;
            }
        },

        /**
         * 播放视频
         */
        play() {
            if (this.videoInfo) {
                this.videoInfo.play();
            }
        },

        /**
         * 暂停视频
         */
        pause() {
            if (this.videoInfo) {
                this.videoInfo.pause();
            }
        },

        /**
         * 跳转到指定时间
         */
        seek(time) {
            if (this.videoInfo) {
                this.videoInfo.currentTime = Number(time);
            }
        }
    }
}
</script>

<style lang="less" scoped>
.videoPage {
    height: 100%;
    width: 100%;
    z-index: 9999;
    .cm-video {
        height: 100% !important;
        width: 100% !important;
        position: relative;
        
        // 确保播放器响应式
        ::v-deep .xgplayer {
            width: 100% !important;
            height: 100% !important;
        }
        .video-logo {
            position: absolute;
            top: 10px;
            right: 10px;
            width: 50px;   // 可以调整大小
            z-index: 9999;
            height: auto;
        }
    }
}
</style>