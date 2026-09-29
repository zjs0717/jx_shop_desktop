<template>
    <div class="videoPage" :style="{height: height, width: width}">
        <div class="cm-video" :class="classId">
            <!-- 水印（仅当有图片时显示） -->
            <img v-if="watermark" :src="watermark" class="video-logo" :style="{
                'pointer-events': 'none',
                'opacity': 1,
                'width': watermarkWidth,
                'top': watermarkTop,
                'right': watermarkRight
            }"/>
            <!-- 降级提示浮层 -->
            <div v-if="isFallbackMode" class="fallback-tip">
                <span v-if="fallbackType === 'mp4'">已切换至兼容模式（MP4）</span>
                <span v-else-if="fallbackType === 'hls-soft'">已切换至软件解码模式</span>
            </div>
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
        // 备用 MP4 地址（用于一级降级）
        fallbackSrc: {
            type: String,
            default: ''
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
            // 降级相关状态
            fallbackAttempts: 0,
            isFallbackMode: false,
            fallbackType: '', // 'mp4' 或 'hls-soft'
            isFirstInit: 1,
        }
    },

    watch: {
        // 监听 src 变化，重新初始化播放器
        src(newSrc) {
            if (newSrc) {
                this.$nextTick(() => {
                    this.destroyPlayer();
                    // 重置降级状态
                    this.fallbackAttempts = 0;
                    this.isFallbackMode = false;
                    this.fallbackType = '';
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
         * @param {boolean} forceSoftDecode - 强制使用 HLS 软解（二级降级）
         * @param {boolean} useMp4Fallback - 是否使用 MP4 备用源（一级降级）
         */
        initPlayer(forceSoftDecode = false, useMp4Fallback = false) {
            if (!this.src) {
                console.warn('Video source is empty');
                return;
            }

            // 超过最大重试次数，彻底放弃
            if (this.fallbackAttempts > 2) {
                this.$emit('error', {errorMessage: '超过最大重试次数,视频播放彻底失败，请检查网络或更换设备', type: 'initPlayer' }, 3);
                return;
            }

            try {
                //  测试错误
                //   if(this.isFirstInit == 1){
                //     this.isFirstInit = 2;
                //     a = b
                //     }
                //     if(this.isFirstInit == 2){
                //     this.isFirstInit = 3;
                //     a = b
                //     }
                // 决定最终使用的 URL
                let finalUrl = this.src;
                if (useMp4Fallback && this.fallbackSrc) {
                    finalUrl = this.fallbackSrc;
                }

                const isHls = this.isHlsStream(finalUrl);
                const playerConfig = {
                    el: document.querySelector(`.${this.classId}`),
                    url: finalUrl,
                    volume: 0.6,
                    poster: this.poster,
                    autoplay: this.autoplay,
                    loop: this.loop,
                    lastPlayTime: Number(this.curTime) || 0,
                    playbackRate: this.speedList,
                    lang: 'zh-cn', // 设置语言
                    controls: true,
                    definitionActive: 'click',   // 也可设为 'click'
                    ignores: ['cssfullscreen'],
                };

                // ---------- 配置 HLS 或 MP4 ----------
                if (isHls) {
                    playerConfig.type = 'hls';
                    playerConfig.plugins = [HlsPlugin];
                    
                    // HLS 配置：默认高性能 vs 软解降级
                    const defaultHlsConfig = {
                        enableWorker: true,
                        lowLatencyMode: true,
                        maxBufferLength: 30,
                        maxMaxBufferLength: 60,
                        xhrSetup: (xhr) => { xhr.withCredentials = false; },
                        manifestLoadingMaxRetry: 3,
                        fragLoadingMaxRetry: 3,
                    };
                    const softDecodeConfig = {
                        enableWorker: false,               // 关闭多线程，避免 WASM 崩溃
                        enableSoftwareDecoding: true,      // 强制软解
                        lowLatencyMode: false,
                        maxBufferLength: 10,
                        maxMaxBufferLength: 20,
                        appendErrorMaxRetry: 3,
                        // 增加超时阈值，防止主线程卡死
                        fragLoadingTimeOut: 6000,
                        manifestLoadingTimeOut: 6000,
                        xhrSetup: (xhr) => { xhr.withCredentials = false; },
                        manifestLoadingMaxRetry: 2,
                        fragLoadingMaxRetry: 2,
                    };
                    playerConfig.hlsConfig = forceSoftDecode ? softDecodeConfig : defaultHlsConfig;
                } else {
                    // MP4 播放（原生 video）
                    playerConfig.type = 'video';
                }

                this.videoInfo = new Player(playerConfig);
                // 添加事件监听
                this.setupPlayerEvents();
                // 更新降级状态标记
                if (useMp4Fallback) {
                    this.isFallbackMode = true;
                    this.fallbackType = 'mp4';
                    console.warn('⚠️ 已切换至 MP4 备用源播放');
                } else if (forceSoftDecode) {
                    this.isFallbackMode = true;
                    this.fallbackType = 'hls-soft';
                    console.warn('⚠️ 已切换至 HLS 软件解码模式');
                } else {
                    this.isFallbackMode = false;
                    this.fallbackType = '';
                }
            } catch (error) {
                console.error('Failed to initialize video player:', error);
                this.$emit('error', {errorMessage: 'Failed to initialize video player: 初始化播放器异常', type: 'initPlayer' }, 4);

                // 初始化异常也触发降级
                this.attemptFallback();
            }
        },

        /**
         * 检查是否为HLS流
         */
        isHlsStream(url) {
            return url && (
                url.includes('.m3u8') ||
                url.includes('application/vnd.apple.mpegurl') ||
                url.includes('application/x-mpegURL')
            );
        },

        /**
         * 获取HLS清晰度列表
         */
        getHlsLevels() {
            try {
                const hls = this.videoInfo.plugins.hls.hls;
                console.log(hls)
                return hls ? hls.streams : [];
            } catch (error) {
                return [];
            }
        },

        /**
         * 设置播放器事件监听
         */
        setupPlayerEvents() {
            if (!this.videoInfo) return;
            // 音视频元数据
            this.videoInfo.on('loadedmetadata', () => {
                const isHls = this.isHlsStream(this.src); // 判断是否是HLS流
                if (isHls) {
                    let levels = this.getHlsLevels();
                    if(levels && levels.length > 0){
                        const bitrateArr = levels.map(i => i.bitrate);
                        const min = Math.min(...bitrateArr);
                        const max = Math.max(...bitrateArr);
                        const filtered = levels.filter(i => i.bitrate === min || i.bitrate === max);
                        const newList = filtered.map(item => {
                            const isLow = (item.url || '').includes('.low');
                            return {
                                definition: isLow ? 'SD' : 'HD',// 清晰度
                                url: item.url,
                                text: { zh: isLow ? '标清' : '高清', en: isLow ? '标清' : '高清' }
                            };
                        }).sort((a, b) => a.definition === 'SD' ? -1 : 1);
                        this.videoInfo.emit('resourceReady', newList);
                    }
                }

                // ---------- 软解模式强制切换到最低码率 ----------
                if (this.fallbackType === 'hls-soft') {
                    try {
                        const hls = this.videoInfo && this.videoInfo.plugins && this.videoInfo.plugins.hls && this.videoInfo.plugins.hls.hls;
                        if (hls && hls.levels && hls.levels.length > 0) {
                            // 假设 levels 数组按码率从低到高排序，若未排序则自行查找最低
                            let lowestLevel = 0;
                            let minBitrate = hls.levels[0].bitrate;
                            for (let i = 1; i < hls.levels.length; i++) {
                                if (hls.levels[i].bitrate < minBitrate) {
                                    minBitrate = hls.levels[i].bitrate;
                                    lowestLevel = i;
                                }
                            }
                            hls.currentLevel = lowestLevel;
                            console.warn('软解模式：已强制切换到最低码率流 (bitrate: ' + minBitrate + ')');
                        }
                    } catch (e) {
                        console.warn('切换最低码率失败', e);
                    }
                }

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
            this.videoInfo.on('timeupdate', (currentTime) => {
                this.$emit('timeupdate', currentTime);
            });

            // ---------- 错误处理与降级触发 ----------
            // 1. 外层 error（适用于 MP4 或 HLS 兜底）
            this.videoInfo.on('error', (error) => {
                let errorType = !this.isFallbackMode || this.fallbackType === 'mp4' ? 1 : 2;

                let errorTemp = this.normalizeError(error);
                this.$emit('error', errorTemp, errorType);
                // 如果尚未降级，或者当前降级类型是 mp4（MP4失败后继续尝试），则触发降级
                if (!this.isFallbackMode || this.fallbackType === 'mp4') {
                    this.attemptFallback();
                } else {
                    // 已经是 hls-soft 还报错，彻底失败
                }
            });

            // 2. HLS 内部错误（更精细）
            try {
                const hls = this.videoInfo && this.videoInfo.plugins && this.videoInfo.plugins.hls && this.videoInfo.plugins.hls.hls;
                if (hls) {
                    hls.on('error', (event, data) => {
                        console.error('🔥 HLS底层错误:', data.type, data.details, data);
                        this.$emit('error', {errorMessage: data.details, type: data.type, fatal: data.fatal}, 6);
                        // 判断是否为致命解码/加载错误
                        const isFatal = 
                            data.type === 'mediaError' ||
                            data.details === 'manifestParsingError' ||
                            data.details === 'bufferAppendError' ||
                            data.details === 'bufferStalledError' ||
                            data.details === 'fragLoadError' ||
                            (data.type === 'networkError' && data.details === 'manifestLoadError');

                        if (isFatal) {
                            if (!this.isFallbackMode || this.fallbackType === 'mp4') {
                                this.attemptFallback();
                            } else {
                                // 软解后依然报错，彻底失败
                                this.$emit('error', {errorMessage: data.details, type: data.type, fatal: data.fatal}, 7);
                            }
                        }
                    });
                }
            } catch (e) {
                // 忽略无 HLS 实例的情况
            }

            // ---------- 软解模式卡顿监控 ----------
            if (this.fallbackType === 'hls-soft') {
                let stallCount = 0;
                let stallTimer = null;

                const handleStallExceed = () => {
                    this.videoInfo.pause();
                    this.$emit('error', {errorMessage: '设备性能不足，请下载后观看', type: 'stallExceed'}, 5);
                    this.destroyPlayer();
                    this.isFallbackMode = false;
                };

                const resetStallCount = () => {
                    stallCount = 0;
                    if (stallTimer) {
                        clearTimeout(stallTimer);
                        stallTimer = null;
                    }
                };

                this.videoInfo.on('waiting', () => {
                    stallCount++;
                    console.warn(`⚠️ 软解卡顿第 ${stallCount} 次`);
                    if (stallCount >= 3) {
                        handleStallExceed();
                        return;
                    }
                    if (stallTimer) clearTimeout(stallTimer);
                    stallTimer = setTimeout(resetStallCount, 10000);
                });

                this.videoInfo.on('playing', resetStallCount);
                this.videoInfo.on('seeked', resetStallCount);
                this.videoInfo.on('ended', resetStallCount);
            }
        },
        // 统一错误格式
        normalizeError(error) {
            // 统一格式
            const defaultResult = {
                category: 'unknown',
                code: '',
                message: '',
                fatal: false,
                details: null,
                original: null,
            };

            try {
                if (!error) return { ...defaultResult, message: '未知错误' };

                // ----- 1. HLS.js 错误（有 type 和 details） -----
                if (typeof error === 'object' && error.type && error.details) {
                    return {
                        category: 'hls',
                        code: error.details,                     // 如 'manifestLoadError'
                        message: error.error &&error.error.message || error.message || error.details || '',
                        fatal: !!error.fatal,
                        details: error.details,
                        original: error,
                    };
                }

                // ----- 2. 原生 MediaError（error.target.error） -----
                if (error.target && error.target.error instanceof MediaError) {
                    const mediaErr = error.target.error;
                    const codeMap = {
                        1: 'MEDIA_ERR_ABORTED',
                        2: 'MEDIA_ERR_NETWORK',
                        3: 'MEDIA_ERR_DECODE',
                        4: 'MEDIA_ERR_SRC_NOT_SUPPORTED',
                    };
                    return {
                        category: 'native',
                        code: codeMap[mediaErr.code] || `code_${mediaErr.code}`,
                        message: mediaErr.message || `播放器错误 (${mediaErr.code})`,
                        fatal: true, // 原生错误通常致命
                        details: mediaErr,
                        original: error,
                    };
                }

                // ----- 3. 其他 Error 对象（如 new Error()） -----
                if (error instanceof Error) {
                    return {
                        category: 'js',
                        code: error.name || 'Error',
                        message: error.message,
                        fatal: true,
                        details: error.stack,
                        original: error,
                    };
                }

                // ----- 4. 字符串或其它 -----
                if (typeof error === 'string') {
                    return {
                        ...defaultResult,
                        message: error,
                    };
                }

                // ----- 5. 兜底：尽量提取有用字段 -----
                return {
                    ...defaultResult,
                    code: error.code || '',
                    message: error.message || JSON.stringify(error),
                    original: error,
                };
            } catch (e) {
                // 解析失败时返回安全对象
                return {
                    ...defaultResult,
                    message: 'Error parsing error object',
                    original: error,
                };
            }
        },
        /**
         * 执行降级方案：一级 -> MP4，二级 -> HLS 软解
         */
        attemptFallback() {
            // 如果已经是 HLS 软解模式，不再降级
            if (this.fallbackType === 'hls-soft') return;
            if (this.fallbackAttempts > 2) return;

            this.fallbackAttempts++;
            this.destroyPlayer();

            this.$nextTick(() => {
                this.$emit('fallback', { attempts: this.fallbackAttempts });
                // 降级策略
                if (this.fallbackAttempts === 1 && this.fallbackSrc) {
                    this.initPlayer(false, true); // 一级：MP4
                } else if (this.fallbackAttempts === 2) {
                    this.initPlayer(true, false); // 二级：HLS软解
                } else if (this.fallbackAttempts === 3) {
                    this.initPlayer(true, false); // 兜底重试
                }
            });
        },

        /**
         * 销毁播放器
         */
        destroyPlayer() {
            if (this.videoInfo) {
                try {
                    // 移除所有事件监听（如果播放器支持 off）
                    if (this.videoInfo.off) {
                        this.videoInfo.off();
                    }
                    this.videoInfo.destroy();
                } catch (e) {
                    // 忽略销毁异常
                }
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
};
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
            pointer-events: none;
            opacity: 1;
        }
        .fallback-tip {
            position: absolute;
            top: 50%;
            left: 50%;
            // transform: translate(-50%, -50%);
            // background: rgba(0, 0, 0, 0.65);
            color: #000;
            padding: 8px 18px;
            border-radius: 30px;
            font-size: 13px;
            z-index: -9998;
            opacity: 0;
            pointer-events: none;
            white-space: nowrap;
            // backdrop-filter: blur(4px);
            // border: 1px solid rgba(255, 215, 0, 0.3);
        }
    }
}
</style>