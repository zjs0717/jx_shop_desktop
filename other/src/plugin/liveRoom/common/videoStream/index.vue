<template>
    <div 
    class="videoStreamBox" 
    id="videoStreamBoxId" 
    :style="{'--width': width ? width : '308px'}"
    :class="{'videoPopupVisible': popupVisible}"
    >

    <!-- <span>{{ (curStudentLineStatus && curStudentLineStatus.status == 0) }}</span> -->
        <!-- 音频流 -->
        <common-room-audio-item  v-if="isHasOnlineStudent && stream && stream.user  && audioStreamData && audioStreamData[stream.user.uid || stream.user.userID] && audioStreamData[stream.user.uid || stream.user.userID].streamID" :stream="audioStreamData[stream.user.uid || stream.user.userID]" />

        <div 
            class="videoStream" 
            id="videoStreamId" 
            :class="{
                'videoStream_fixed': !popupVisible && curStudentLineStatus.status == 0 && (stuCallLine && stuCallLine.isShow && (stuCallLine.userID == stream.user.uid))  && identityType == 'student', 
                'videoStream_hover': !popupVisible && identityType == 'student',
                'videoStream_popup': popupVisible,
                }" 
            :style="{'--width': width ? width : '308px'}"
        >
    
          <div class="videoStream-name" v-if="!popupVisible">
            <svg v-if="converseState" class="iconfont" aria-hidden="true">
                
              <use v-if="isHasOnlineStudent && stream && stream.user && stream.user.mic == 2  && audioStreamData && audioStreamData[stream.user.uid || stream.user.userID] && audioStreamData[stream.user.uid || stream.user.userID].streamID" xlink:href="#iconmaikefeng"></use>
              <use v-else xlink:href="#iconguanbimaikefeng"></use>
            </svg>
            <span>{{stream.user && (stream.user.userName || stream.user.nick_name)}}</span>
            <span class="fullScreenIcon" @click.stop="openCurPopup"  v-if="identityType == 'student'">
                <svg class="iconfont fullIcon" aria-hidden="true">
                    <use xlink:href="#iconfangda"></use>
                </svg>
            </span>
          </div>
          <template v-if="identityType == 'teacher'">
        
            <common-room-video-item v-if="stream && stream.streamID" :stream="stream" />
            <div class="noVideoScreen" v-else>
                <span>摄像头已关闭</span>
            </div>
          </template>
          <template v-if="identityType == 'student'">
              <!-- 学生共享页面流 -->
              <div class="videoStream-student-share" :class="{'changeScreenActive': isChangeShareAndVideo}" >
                    <div v-if="isChangeShareAndVideo" class="videoStream-student-masker"  @click="changeStreamScreen"></div>
                    <!-- 使用注入的插槽 -->
                     <template v-if="stuNameTemp && stuNameTemp[stream.user.uid || stream.user.userID] && stuNameTemp[stream.user.uid || stream.user.userID].platformType">
                         <slot :slot-scope="stream.user" name="videoStreamShare">
                        </slot>
                    </template>
                    <template v-else>
                         <common-room-video-item v-if="stream  && shareListTemp && shareListTemp[stream.user.uid || stream.user.userID] && shareListTemp[stream.user.uid || stream.user.userID].streamID" :stream="shareListTemp[stream.user.uid || stream.user.userID]" />
     
                         <div class="noVideoScreen" v-if="!videoStreamStatus[shareListTemp && shareListTemp[stream.user.uid || stream.user.userID] && shareListTemp[stream.user.uid || stream.user.userID].streamID] || !(stream  && shareListTemp && shareListTemp[stream.user.uid || stream.user.userID] && shareListTemp[stream.user.uid || stream.user.userID].streamID)">
                             <span>共享未开启</span>
                         </div>
                     </template>
                    
                </div>
                <!-- 学生视频流 -->
                <div class="videoStream-student" :class="{'changeScreenActive': !isChangeShareAndVideo}" >
                    <div v-if="!isChangeShareAndVideo" class="videoStream-student-masker"  @click="changeStreamScreen"></div>
                    
                    <common-room-video-item v-if="isShowTeacherStream && stream && stream.streamID" :stream="stream" />
                    <div class="noVideoScreen noVideoScreen1" style="flex-direction: column;" v-if="!(isShowTeacherStream  && stream && stream.streamID) ? !(isShowTeacherStream  && stream && stream.streamID) : !videoStreamStatus[stream.streamID]">
                        <span>对方未开启</span>
                        <span>摄像头</span>

                    </div>
         
                </div>
                <!-- 鼠标移入ICON   || !converseState || (converseState && connectState == 2)-->
                <!-- v-if="!(stuCallLine && stuCallLine.isMasker)" -->
               <template v-if="!(stuCallLine && stuCallLine.isMasker && (stuCallLine.userID == stream.user.uid) ) && !(curStudentLineStatus && curStudentLineStatus.status == 0)">
                   <div 
                       class="videoStream-converse"
                       :class="{'videoStream-converseIng': curStudentLineStatus && (curStudentLineStatus.status == 0 || curStudentLineStatus.status == 1)}"
                       >
                       <svg class="iconfont" aria-hidden="true" @click="teacherDealLine(3)" v-if="curStudentLineStatus && (curStudentLineStatus.status == 0 || curStudentLineStatus.status == 1)">
                           <use xlink:href="#iconguaduan"></use>
                       </svg>
                       <svg class="iconfont" aria-hidden="true" v-else @click="teacherDealLine(4)">
                           <use xlink:href="#iconicon_conf_video_fill"></use>
                       </svg>
                   </div>
               </template>
               
               <div class="videoStream-connectState" v-if="!onLineStuUserTemp[stream.user.uid || stream.user.userID]">
                <div class="connectState-tip">
                    <span>已掉线</span>
                </div>
               </div>
                <!-- 连线学生等待及超时状态 -->
                <div class="videoStream-connectState"  v-if="converseState && ! (stuCallLine && stuCallLine.isShow && (stuCallLine.userID == stream.user.uid)) && curStudentLineStatus && curStudentLineStatus.status != 1 && (curStudentLineStatus.status || curStudentLineStatus.status == 0)">
        
                    <div class="connectState-tip">
                        <span v-if="curStudentLineStatus.status == 0">等待接听...</span>
                        <span v-if="curStudentLineStatus.status == 3">已超时</span>
                        <span v-if="curStudentLineStatus.status == 2 || curStudentLineStatus.status == 4">未接听/对方挂断</span>
                    </div>
        
                    <div class="connectState-wait" v-if="curStudentLineStatus.status == 0" @click="teacherDealLine(3)">
                        <svg class="iconfont" aria-hidden="true">
                            <use xlink:href="#iconguaduan"></use>
                        </svg>
                    </div>
        
                    <div class="connectState-timeOut" v-else>
                        <div class="videoStream-timeOut-result-item"  @click="teacherDealLine(4)">
                            <svg class="iconfont" aria-hidden="true">
                                <use xlink:href="#iconicon_conf_video_fill"></use>
                            </svg>
                            <span>重新连接</span>
                        </div>
                        <div class="videoStream-timeOut-result-item" @click="teacherDealLine(5)">
                            <svg class="iconfont" aria-hidden="true">
                                <use xlink:href="#iconguaduan"></use>
                            </svg>
                            <span>不再连接</span>
                        </div>
                    </div>
        
                </div>
            </template>
            <!-- 学生来电 -->
            <div class="stuPostLineBox-item-masker" v-if=" (stuCallLine && stuCallLine.isMasker && (stuCallLine.userID == stream.user.uid)) ">
                <div class="stuPostLineBox-item-masker-title">{{stream.user && (stream.user.userName || stream.user.nick_name)}}请求连线</div>
                <div class="stuPostLineBox-item-iconBox">
                    <div tip="挂断连线" class="stuPostLineBox-item-iconContainer"  @click="teacherDealLine(2)">
                        <svg class="iconfont stuPostLineBox-item-iconContainer-icon" aria-hidden="true">
                            <use xlink:href="#iconguaduan"></use>
                        </svg>
                    </div>
                    <div tip="接听连线" class="stuPostLineBox-item-iconContainer" @click="teacherDealLine(1)">
                        <svg class="iconfont stuPostLineBox-item-iconContainer-icon" aria-hidden="true">
                            <use xlink:href="#iconicon_conf_video_fill"></use>
                        </svg>
                    </div>
                </div>
            </div>
            <!-- 全屏时教师流也显示在此， 暂时不加有问题 -->
            <!-- v-dragDirective="{ parentId: 'studentSinglePopupContentId' }" -->
            <div  
					 v-if="!isShowTeacherStream && identityType == 'student'"
					class="studentSinglePopup-content-streamBox" 
					id="studentSinglePopupContentStreamBoxId"
					:class="{'studentSinglePopup-content-active': !isShowTeacherStream && identityType == 'student'}"
				>
					<!-- <div class="studentSinglePopup-content-closeCarame" v-if="!isShowCarame">
						<span class="tip">对方已关闭摄像头</span>
						<svg class="iconfont micIcon" aria-hidden="true">
							<use xlink:href="#iconmaikefeng"></use>
						</svg>
					</div> -->
					<!-- 学生视频流 -->
					<common-room-video-item v-if="stream" :stream="stream" />
					 <div v-if="!isShowTeacherStream && identityType == 'student'" class="studentSinglePopup-content-teacherStream">
						<!-- 教师视频流 -->
						<common-room-video-item v-if="teacherStream" :stream="teacherStream" />
					 </div>
				</div>
        </div>
    </div>
</template>

<script>
import commonRoomVideoItem from '../commonLive/common-room-video-item.vue'
import commonRoomAudioItem from '../commonLive/common-room-audio-item.vue'
export default {
    name: 'videoStream',
    components: {
      commonRoomVideoItem,
      commonRoomAudioItem
    },
    props: {
        // 视频流宽度
        // 100%: 16:9
        width: {
            type: String,
            default: '3rem',
        },
        // 名称
        name: {
            type: String,
            default: '--',
        },
        /**
         * @description 音频连线状态
         * @default false
         * @type {Boolean}
         * @required
         * @example true 音频连线中
         * @example false 音频未连线
         */
         converseState: {
            type: Boolean,
            default: false,
        },

        /**
         * @description 用户身份
         * @default student
         * @type {String}
         * @required 
         * @example student 学生
         * @example teacher 老师
         */
        identityType: {
            type: String,
            default: 'student',
        },
        /**
         * @description 流信息
         * @default {}
         * @type {Object}
         * @required
         * @example {streamID: '123', user: {userID: '123', userName: '123'}}
         */
        stream: {
            type: Object,
            default: () => { return {} }, 
        },
        // 流索引序号
        inx: {
            type: Number,
            default: -1,
        },
        popupVisible: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            // connectState: '3', // 音频连接状态 1: 连接中 2: 已连接 3: 超时,
            // stuCallLineStatus: {},
            // curStudentLineStatus.status: {}, // 当前学生连线状态
            myMicStatus: 1, // 自己麦克风状态 2: 开麦 1: 关麦 // 无用了
            isChangeShareAndVideo: false, // 是否切换共享和视频

        }
    },
    inject: ['zegoLiveRoom', 'commonVideoRoomThis'],
    inject: {
        // 共享屏幕插槽内容
        roomShareStreamSlot: {
            default: null
        },

        zegoLiveRoom: {
            default: () => {}
        },
        
        commonVideoRoomThis: {
            default: () => {}
        }
    },
    computed: {
        // 共享流列表临时变量
        shareListTemp() {
            return this.zegoLiveRoom.shareList ? JSON.parse(JSON.stringify(this.zegoLiveRoom.shareList)) : null
        },
        audioStreamData() {
            return this.zegoLiveRoom.audioStreamData? JSON.parse(JSON.stringify(this.zegoLiveRoom.audioStreamData)) : null 
        },
        videoStreamStatus() {
            return this.zegoLiveRoom.videoStreamStatus? JSON.parse(JSON.stringify(this.zegoLiveRoom.videoStreamStatus)) : {} 
        },
        // 接收学生连线弹窗挂断、接收
        stuCallLine(){
            return this.commonVideoRoomThis.stuCallLine? JSON.parse(JSON.stringify(this.commonVideoRoomThis.stuCallLine)) : {}
        },
        // 教师流
        teacherStream() {
            return this.commonVideoRoomThis.teacherStream ? JSON.parse(JSON.stringify(this.commonVideoRoomThis.teacherStream)) : {}
        },
        // 外层是否显示老师流，外层隐藏，这里显示
        isShowTeacherStream() {
            return this.commonVideoRoomThis.isShowTeacherStream
        },

        // 所有学生连线状态
        curStudentLineStatus() { 
            let callLogTemp = this.commonVideoRoomThis.callLogTemp? JSON.parse(JSON.stringify(this.commonVideoRoomThis.callLogTemp)) : {};
            
            // console.warn('8888888888888888--callLogTemp', callLogTemp)
            // alert(this.myMicStatus)
            let {user} = this.stream || {};
            let status = user && callLogTemp[user.uid || user.userID || '-1'] || {};
            this.myMicStatus = status && status.micStatus || 2;
            return status;
        },
        isHasOnlineStudent() {
            return  this.commonVideoRoomThis.isHasOnlineStudent
        },
        // 当前在线学生
        onLineStuUserTemp() {
            return this.commonVideoRoomThis.onLineStuUserTemp
        },
        stuNameTemp() {
            return this.commonVideoRoomThis.stuNameTemp
        },
    },
    created() {
    },
    mounted() {

    },
    beforeDestroy() {

  },
  methods: {
    // 打开当前流弹窗
    openCurPopup () {
        this.$emit('openCurStreamPopup', this.stream, this.inx )
    },
    // 老师处理学生连麦
    teacherDealLine (status) { // 老师处理连线
        this.$emit('teacherDealLine', status, this.stream )
    },
    // 切换共享和视频流，仅点击小屏位置
    changeStreamScreen(val){
        this.isChangeShareAndVideo = !this.isChangeShareAndVideo;
    }
  }
}

</script>

<style lang="less" scoped>
.videoStreamBox {
    width: var(--width);
    height: calc(var(--width) * 9 / 16); // 根据宽度计算高度;
    background: #474747;
    cursor: pointer;
    position: relative;
    user-select: none;
    .stuPostLineBox-item-masker {
        display: none;
    }
    .videoStream {
        width: var(--width);
        height: calc(var(--width) * 9 / 16); // 根据宽度计算高度;
        background: #474747;
        cursor: pointer;
        position: relative;
        user-select: none;
        .videoStream-student-masker {
            position: absolute;
            top: 0;
            right: 0;
            width: 100%;
            height: 100%;
            z-index: 100;
        }
        .videoStream-student-share {
            position: absolute;
            top: 0;
            right: 0;
            width: 100%;
            height: 100%;
            background: #474747;
        }
 
        .videoStream-student{
            position: absolute;
            top: 0;
            right: 0;
            width: 100%;
            height: 100%;
            background-color: #404040;
        }
        .changeScreenActive {
            top: 0.06rem;
            right: 0.03rem;
            width: 0.85rem;
            height: 0.5rem;
            z-index: 99;
            cursor: pointer;
            
        }
        .videoStream-name {
            position: absolute;
            bottom: 0;
            left: 0;
            min-width: 0.72rem;
            height: 0.24rem;
            background: rgba(16,16,16, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0.06rem;
            box-sizing: border-box;
            z-index: 3;
            .iconfont {
                width: 0.14rem;
                height: 0.14rem;
                fill: #fff;
            }
            span {
                color: #fff;
                font-size: 0.14rem;
            }
            .fullScreenIcon{
                position: absolute;
                right: -0.3rem;
                display: inline-block;
                width: 0.24rem;
                height: 0.24rem;
                display: flex;
                justify-content: center;
                align-items: center;
                background: rgba(16,16,16, 0.7);
                .fullIcon {
                    width: 0.22rem;
                    height: 0.22rem;
                    fill: #fff;
                }
            }
        }
        .noVideoScreen {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.12rem;
            color: rgba(255, 255, 255, 0.8);
            // background-color: #272727;
        }
        .noVideoScreen1 {
            background-color: #272727;
        }
        .videoStream-converse {
            position: absolute;
            bottom: 0.02rem;
            right: 0.12rem;
            width: 0.4rem;
            height: 0.4rem;
            box-shadow: 0px 0px 0.09rem 0px rgba(4,13,46,0.31);
            border: 1px solid rgba(255, 210, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #040D2E;
            opacity: 0;
            transform: scale(0);
            transition: all 0.2s ease;
            z-index: 9;
            &::before, &::after {
                content: '';
                position: absolute;
                width: 0.04rem;
                height: 0.04rem;
                border: 1px solid #FFD200;  /* 高亮颜色与原图边框一致 */
            }
    
            &::before {
                top: -1px;
                left: -1px;
                border-right: none;
                border-bottom: none;
            }
            &::after {
                bottom: -1px;
                right: -1px;
                border-left: none;
                border-top: none;
            }
            .iconfont {
                width: 0.24rem;
                height: 0.24rem;
                fill: #FFD200;
            }
        }
        .videoStream-converseIng {
            background: #FF3B30;
            border: none;
            &::before, &::after {
               display: none;
            }
            .iconfont {
                fill: #FFFFFF;
            }
        }
        .videoStream-connectState {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background-color: rgba(0, 0, 0, 0.7);
            z-index: 100;
            cursor: initial;
            .connectState-tip {
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                span {
                    color: #fff;
                    font-size: 0.14rem;
                }
            }
            .connectState-wait {
                position: absolute;
                bottom: 0.1rem;
                right: 0.1rem;
                width: 0.4rem;
                height: 0.4rem;
                display: flex;
                justify-content: center;
                align-items: center;
                background: #FF3B30;
                cursor: pointer;
                .iconfont {
                    width: 0.24rem;
                    height: 0.24rem;
                    fill: #fff;
                }
            }
    
            .connectState-timeOut {
                display: flex;
                align-items: center;
                justify-content: space-evenly;
                transform: translateY(80%);
                width: 100%;
                height: 20%;
                .videoStream-timeOut-result-item {
                    height: 100%;
                    cursor: pointer;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 0.06rem;
                    .iconfont {
                        fill: #F8C70B;
                        width: 0.14rem;
                        height: 0.14rem;
                    }
                    span {
                        color: #F8C70B;
                        font-size: 0.14rem;
                    }
                    &:last-child {
                        .iconfont {
                            fill: #FF3B30;
                        }
                        span {
                            color: #FF3B30;
                        } 
                    }
                }
            }
        }
    }
    .videoStream_hover {
        &:hover {
            z-index: 999;
            transform: scale(1.06);
            transition: all 0.3s ease;
            box-shadow: 0 0 0.1rem #435381;
            .videoStream-converse {
                transform: scale(1);
                opacity: 1;
            }
        }
    }

    .videoStream_fixed {
        position: fixed;
        bottom: 0.4rem;
        right: 0.44rem; 
        z-index: 111;
        border: 0.06rem solid #FFFFFF;
    }
   .videoStream_fixed,.videoStream_popup {
       
        .stuPostLineBox-item-masker {
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);

            .stuPostLineBox-item-masker-title {
                padding: 0.24rem 0 0 0.24rem;
                box-sizing: border-box;
                font-weight: bold;
                font-size: 0.16rem;
                color: #FFFFFF;
            }
            .stuPostLineBox-item-iconBox {
                display: flex;
                justify-content: flex-end;
                // align-items: center;
                height: 0.8rem;
                position: absolute;
                bottom: 0;
                right: 0;
                width: 100%;
                z-index: 99;
                .stuPostLineBox-item-iconContainer {
                    width: 0.56rem;
                    height: 0.56rem;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background-color: #FF3B30;
                    border-radius: 0.28rem;
                    margin-right: 0.36rem;
                    cursor: pointer;

                    .stuPostLineBox-item-iconContainer-icon {
                        width: 0.36rem;
                        height: 0.36rem;
                        fill: #FFFFFF;
                    }
                }
                .stuPostLineBox-item-iconContainer:last-child {
                    background-color: #396CFF;

                }
            }
        }
   }
}
.videoPopupVisible {
    width: 100%!important;
    height: 100%!important;
    .videoStream {
        width: 100%!important;
        height: 100%!important;
    }
    // .videoStream-student{
    //     top: 0.14rem!important;
    //     right: 0.14rem!important;
    //     width: 2.5rem!important;
    //     height: 1.47rem!important;
    // }

    // .videoStream-student-share {
    //         top: 0;
    //         right: 0;
    //         width: 100%;
    //         height: 100%;
    //     }
 
    //     .videoStream-student{
    //         top: 0;
    //         right: 0;
    //         width: 100%;
    //         height: 100%;
    //     }
        .changeScreenActive {
            top: 0.14rem!important;
            right: 0.14rem!important;
            width: 2.5rem!important;
            height: 1.47rem!important;
            z-index: 99;
            cursor: pointer;
            
        }
    .videoStream_popup {
        &:hover {
            z-index: 999;
            // z-index: 999;
            // transform: scale(1.06);
            // transition: all 0.3s ease;
            // box-shadow: 0 0 0.1rem #435381;
            .videoStream-converse {
                transform: scale(1);
                opacity: 1;
                right: 0.2rem;
                bottom: 0.2rem;
            }
        }
        .stuPostLineBox-item-masker {
            display: block;
        }
    }
    .studentSinglePopup-content-streamBox {
        position: absolute;
        top: 0.14rem;
        right: 0.14rem;
        width: 2.5rem;
        height: 1.47rem;
        z-index: 1;
        cursor: pointer;
        background: #000;
        .studentSinglePopup-content-teacherStream {
            position: absolute;
            width: 1.44rem;
            height: 0.84rem;
            top: 0.14rem;
            right: 0.1rem;
            background-color: #FFFFFF;
            z-index: 1;
        }
    }
    .studentSinglePopup-content-active {
        // top: unset;
        width: 4.5rem;
        height: 2.64rem;
        background: #272727;
        // bottom: 1.08rem;
    }
    .studentSinglePopup-content-closeCarame {
        position: absolute;
        width: 100%;
        height: 100%;
        background: #272727;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        .tip {
            font-size: 0.16rem;
            color: #FFFFFF;
        }
        .micIcon {
            position: absolute;
            left: 0;
            bottom: 0;
            width: 0.16rem;
            height: 0.16rem;
            padding: 0.04rem;
            box-sizing: border-box;
            background: rgba(0, 0, 0, 0.7);
            fill: #FFF;
        }


    }

}
</style>