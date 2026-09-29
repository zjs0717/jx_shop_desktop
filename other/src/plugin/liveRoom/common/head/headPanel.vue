<template>
    <div class="headPanel">
        <div class="headPanel-left">
            <div class="headPanel-date" v-if="roomInfo.date">
                <span>{{roomInfo.date.day}}</span>
                <span>{{roomInfo.date.time}}</span>
            </div>
            <div class="headPanel-search">
                <el-input 
                    prefix-icon="el-icon-search" 
                    v-model="search.name" 
                    @blur="$emit('search', search.name)"
                    @keyup.enter.native="$emit('search', search.name)"
                    placeholder="请输入学生姓名" 
                    clearable
                ></el-input>
            </div>
        </div>
        <div class="headPanel-right">
            <div class="headPanel-panel">
                <div class="headPanel-panel-num">
                    <span>学生人数:</span>
                    <span class="headPanel-panel-num-onLine">{{onLineNum}}</span>
                    <span class="headPanel-panel-num-total">{{`/${roomInfo.total}`}}</span>

                </div>
                <div class="headPanel-panel-handle">
                    <border-item 
                        width="auto" 
                        borderColor="RGBA(0, 46, 144, 1)" 
                        cornerColor="#08F9FF">
                        <template>
                            <div class="headPanel-panel-handle-item" :class="{'deviceOpen': mikeState}" @click="deviceChangeClick('mic')">
                                <svg class="iconfont" aria-hidden="true">
                                    <use :xlink:href="mikeState ? '#iconmaikefeng' : '#iconguanbimaikefeng'"></use>
                                </svg>
                                <span>麦克风</span>
                            </div>
                        </template>
                    </border-item>
                    
                    <border-item 
                        width="auto" 
                        borderColor="RGBA(0, 46, 144, 1)" 
                        cornerColor="#08F9FF">
                        <template>
                            <!-- <span style="color: #FFF;">{{ cameraState }}</span> -->
                            <div class="headPanel-panel-handle-item"  :class="{'deviceOpen': cameraState}"  @click="deviceChangeClick('camera')">
                                <svg class="iconfont" aria-hidden="true">
                                    <use :xlink:href="cameraState ? '#iconshipintonghua' : '#iconguanbishipintonghua'"></use>
                                </svg>
                                <span>摄像头</span>
                            </div>
                        </template>
                    </border-item>
                    <!--      -->
                    <border-item 
                        v-if="!isHasOnlineStudent"
                        width="auto" 
                        borderColor="RGBA(0, 46, 144, 1)" 
                        cornerColor="#08F9FF">
                        <template>
                            <div 
                                class="headPanel-panel-handle-onOff headPanel-panel-handle-item"
                                :class="{'head-panel-handle-onOffNo': !onLineNum}"
                                @click="deviceChangeClick('on')"

                            >
                                <svg class="iconfont" aria-hidden="true">
                                    <use xlink:href="#iconicon_conf_video_fill"></use>
                                </svg>
                                <span>连接学生</span>
                            </div>
                        </template>
                    </border-item>
                    <border-item 
                        v-else
                        width="auto" 
                        borderColor="#FF3B30" 
                        :showOtherCorner="true"
                        cornerColor="#FFFFFF">
                        <template>
                            <div 
                                class="headPanel-panel-handle-onOff headPanel-panel-handle-item"
                                :class="{'head-panel-handle-onOffNo': !onLineNum}"
                                @click="deviceChangeClick('off')"

                            >
                                <svg class="iconfont"  style="fill:#FF3B30" aria-hidden="true">
                                    <use xlink:href="#iconguaduan"></use>
                                </svg>
                                <span style="color:#FF3B30">全部挂断</span>
                            </div>
                        </template>
                    </border-item>
                </div>
            </div>
            <div class="headPanel-onLineTime">
                <span>{{cmFormatSeconds(panel.onLineTime)}}</span>
            </div>
            <div class="headPanel-close" @click="closeEnd">
                <svg class="ixonfont" aria-hidden="true">
                    <use xlink:href="#icontuichu"></use>
                </svg>
                <span>结束</span>
            </div>
        </div>
    </div>
</template>

<script>
import { debounce } from '../../../js/room/utils/tool'
// import zegoClient from '../../../js/room/zego/zegoClient/index'
import borderItem from '../borderItem/index.vue' // 边框
export default {
    name: 'headPanel',
    components: {
        borderItem
    //   borderItem: () => import('../borderItem/index.vue'), // 边框  
    },
    inject: ['thisParent', 'zegoLiveRoom', 'commonVideoRoomThis'],
    props: {
        // 直播间信息
        // roomInfo: {
        //     type: Object,
        //     default: () => {
        //         return {
        //             date: {
        //             day: '2月28[周五] ', // 在线督导日期
        //             time: '15：00-17：00' // 在线督导时间
        //         },
        //         total: 10, // 预约学生人数
        //         startTime: 1748399111081, // 课程开始时间
        //         }
        //     }
        // },
        cameraState: { // 摄像头状态 1:关闭 2:开启
            type: Boolean,
            default: false,
        },
        mikeState: { // 麦克风状态  1:关闭 2:开启
            type: Boolean,
            default: false,
        },
        isHasOnlineStudent: {
            type: Boolean,
            default: false,
        } // 是否有连线学生

    },
    computed: {
		onLineNum() {
            let memberList = this.commonVideoRoomThis.memberList || [];
            let stuList = memberList.filter(item => item.role == 2);
			return stuList.length;
		},
        roomInfo() {
            let info = this.thisParent.roomInfo;
            if(this.timeObj){
                clearInterval(this.timeObj);
                this.timeObj = null;
            }
            if(info && info.startTime){
                let time = Date.now() - info.startTime;
                if(time >= 0){
                    this.isStartCountTime = true;
                    this.panel.onLineTime = time / 1000; // 在线时间
                    this.startTimer();

                }else {
                    this.panel.onLineTime = 0; // 在线时间
                    this.isStartCountTime = false;
                    if(this.timer){
                        cliearTimeout(this.timer)
                        this.timer = null;
                    }
                    this.timer = setTimeout(()=> {
                        this.isStartCountTime = true;
                        this.startTimer();
                        cliearTimeout(this.timer)
                        this.timer = null;
                    },Math.abs(time))
                }
	
            }
            return info
        }
	},
    watch: {
        // cameraState(newVal, oldVal) { // 摄像头状态
        //     this.panel.handle.cameraState = newVal;
        // },
        // mikeState(newVal, oldVal) { // 麦克风状态
        //     this.panel.handle.mikeState = newVal;
        // },
    },
    data() {
        return {
            search: { // 搜索信息
                name: '',
            },
            panel: { // 面板信息
                // handle: { // 面板操作属性
                //     mikeState: false, // 麦克风状态
                //     cameraState: false, // 摄像头状态
                // },
                onLineTime: 0, // 在线时间
            },
            isStartCountTime: true, // 是否开始计时
            timer: null, // 计时器

            // isHasOnlineStudent: false, // 是否有连线学生

        }
    },
    created() {
        // 页面隐藏或者重新进入页面时，重新计算在线时间
        document.addEventListener('visibilitychange', this.visibleChange);
        this.init();
    },
    mounted() {
        // this.deviceChangeClick = debounce(this.deviceChange, 500, true)

        BUS.$on('openDeviceHandele', this.openDeviceHandele)
    },
    beforeDestroy() {
        BUS.$off('openDeviceHandele', this.openDeviceHandele);
        if(this.timer){
            cliearTimeout(this.timer)
            this.timer = null;	
        }
        if(this.timeObj){
            clearInterval(this.timeObj);
            this.timeObj = null;
        }
    },
    methods: {
        // 页面隐藏或者重新进入页面时，重新计算在线时间
        visibleChange(){
            if(this.timeObj){
                    clearInterval(this.timeObj);
                    this.timeObj = null;
                }
            let info = this.thisParent.roomInfo;
            if(info && info.startTime){
                let time = Date.now() - info.startTime;
                if(time >= 0){
                    this.isStartCountTime = true;
                    this.panel.onLineTime = time / 1000; // 在线时间
                    this.startTimer();
                }else {
                    this.panel.onLineTime = 0; // 在线时间
                    this.isStartCountTime = false;
                    if(this.timer){
                        cliearTimeout(this.timer)
                        this.timer = null;
                    }
                    this.timer = setTimeout(()=> {
                        this.isStartCountTime = true;
                        this.startTimer();
                        cliearTimeout(this.timer)
                        this.timer = null;
                    },Math.abs(time))
                }
            }
        },
        /**
         * @description 初始化
         */
        init() {
           
        },
        /**
         * @description 计时器
         * @param {Number} time 计时器时间
         * @param {Function} callback 计时器回调函数
         */
         startTimer() {
            this.timeObj = setInterval(() => {
                this.panel.onLineTime++;
            }, 1000);
        },

 
        // 教师接听推流，更改设备状态
        openDeviceHandele(role, cb){
            if(role == 1){
                this.deviceChange('mic', cb);
            }
        },
        // 设备操作节流

        deviceChangeClick(tag){
            this.cmThrottle(this, () => {
                    this.deviceChange(tag)
            }, 500);
        },
        async deviceChange(tag, cb) { // 设备操作
            let user = this.thisParent.liveRoomParams.USER_INFO || {};
            
            if(!user) return;
            if(tag == 'camera' || tag == 'mic'){
                let name = tag == 'camera' ? 'cameraState' : 'mikeState';
                const state = this[name] ? 1 : 2;
                await this.thisParent.$http.setUserInfo({
						target_uid: user.uid || user.userID,
						[tag]: state
					})
                    // this.commonVideoRoomThis.teacherStream.user[tag] = state;
                    BUS.$emit('userHandStateChange', { [user.uid || user.userID]: { [tag]: state } }, true, tag)
                    // if(!cb){
                    // }
                    // // this.panel.handle[name] = state == 2 ? true : false;
                    // if(tag == 'mic' && cb){
                    //     cb();
                    // }
            }
            // if (tag == 'camera') {
            //     this.panel.handle.cameraState = !this.panel.handle.cameraState;
            // }
            // if (tag == 'mic') {
            //     this.panel.handle.mikeState = !this.panel.handle.mikeState;
            // }
            if(tag == 'on' && !this.onLineNum) {
                // this.$message.warning('暂无学生进入');
                return
            };
            this.$emit('deviceChange', tag);

        },
        closeEnd() { // 结束
            
            this.$emit('deviceChange', 'exit');
    
        }

    }
}
</script>

<style lang="less" scoped>
.headPanel {
    // height: 0.6rem;
    background: #09153D;
    // margin-bottom: 0.11rem;
    padding: 0.05rem;
    display: flex;
    justify-content: space-between;
    align-content: center;
    box-sizing: border-box;
    
    .headPanel-left {
        display: flex;
        align-items: center;
        gap: 0.2rem;
        .headPanel-date {
            color: #fff;
            font-size: 0.14rem;
        }
        .headPanel-search {
            width: 2.6rem;
            border-radius: 0.04rem;
            /deep/ .el-input {
                border-radius: 0.04rem;
                font-size: 0.14rem;
                .el-input__inner {
                    height: 0.32rem;
                    border: 1px solid #0D1D55;
                    background: rgba(9, 21, 61, 1);
                    color: #ffffff;
                    font-size: 0.14rem;
                }
            }
            
            /deep/ .el-input__prefix, .el-input__suffix {
                .el-input__icon {
                    line-height: 1;
                    width: 0.25rem;
                }
            }
            /deep/ .el-input--prefix .el-input__inner {
                padding-left: 0.3rem;
            }
            
            /deep/ .el-input--suffix .el-input__inner {
                padding-right: 0.3rem;
            }
            /deep/ .el-input__prefix {
                left: 0.05rem;
                .el-input__inner {
                    padding-left: 0.3rem;
                }
            }
        }
    }
    .headPanel-right {
        display: flex;
        align-items: center;
        gap: 0.8rem;
        user-select: none;
        .headPanel-panel {
            display: flex;
            align-items: center;
            gap: 0.56rem;
            .headPanel-panel-num {
                color: #fff;
                font-size: 0.14rem;
                display: flex;
                align-items: center;
                gap: 0.06rem;
                .headPanel-panel-num-onLine {
                    font-size: 0.18rem;
                    color: #FFFFFF;
                }
            }
            .headPanel-panel-handle {
                display: flex;
                align-items: center;
                gap: 0.2rem;
                .headPanel-panel-handle-item {
                    height: 0.4rem;
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    gap: 0.1rem;
                    padding: 0 0.16rem;
                    span {
                        font-size: 0.14rem;
                        color:RGBA(0, 46, 144, 1);
                    }
                    .iconfont {
                        height: 0.24rem;
                        width: 0.24rem;
                        fill: RGBA(0, 46, 144, 1);
                    }
                }
                .deviceOpen {
                    span {
                        color: #419AFF;
                    }
                    .iconfont {
                        fill: #419AFF;
                    }
                }
                .headPanel-panel-handle-onOff {
                    span {
                        color: #f8c70b;
                    }
                    .iconfont {
                        fill: rgba(248, 199, 11, 1);
                    }
                }
                .head-panel-handle-onOffNo {
                    
                    span {
                        color: rgba(85, 67, 0, 1);
                    }
                    .iconfont {
                        fill: rgba(85, 67, 0, 1);
                    }
                }
            }
        }
        
        .headPanel-onLineTime {
            display: flex;
            align-items: center;
            margin: 0 0.66rem 0 0.8rem;
            span {
                color: #fff;
                font-size: 0.14rem;
            }
        }
        .headPanel-close {
            width: 1rem;
            height: 0.4rem;
            background: rgba(4, 13, 46, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            gap: 0.06rem;
            .ixonfont {
                
                height: 0.24rem;
                width: 0.24rem;
                fill: rgba(243, 52, 52, 1);
            }
            span {
                font-size: 0.14rem;
                color: rgba(243, 52, 52, 1);
            }
        }
    }
}
</style>