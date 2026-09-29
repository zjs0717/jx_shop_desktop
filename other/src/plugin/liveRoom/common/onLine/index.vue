<template>
    <div 
        class="onLineStudent">
        <div class="onLineStudent-head">
            <div 
                class="onLineStudent-head-title"
                :class="{'onLineStudent-head-titleNo': !converseState}">
                <span>{{!converseState ? '当前督导学生列表' : '当前连线学生列表'}}</span>
                <span>{{`共(${onLineList.length}名)`}}</span>
            </div>
            <div class="onLineStudent-head-switch">
                <div 
                    class="onLineStudent-head-switch-icon"
                    :class="{'onLineStudent-head-switch-iconNo': pageNum == 1}"
                    @click="prevPageHandler">
                    <svg class="iconfont" aria-hidden="true">
                        <use xlink:href="#iconarrow-left"></use>
                    </svg>
                </div>
                <div 
                    class="onLineStudent-head-switch-icon"
                    :class="{'onLineStudent-head-switch-iconNo': !onLineList.length || pageNum == Math.ceil(onLineList.length / pageSize)}"
                    @click="nextPageHandler">
                    <svg class="iconfont" aria-hidden="true">
                        <use xlink:href="#iconright"></use>
                    </svg>
                </div>
            </div>
        </div>
        <div class="onLineStudent-box" :class="{'onLineStudent-box-containerPopup': openDialogUserID ? true : false}">
            <div 
                class="video-stream-container" 
                v-for="(item, index) in currentList" :key="item.user.uid || item.user.userID" 
            >
                <div 
                id="studentSinglePopup-box-dragDirective"
                :class="{'studentSinglePopup': openDialogUserID == (item.user.uid || item.user.userID), 'studentSinglePopup-fullScreen': (openDialogUserID == (item.user.uid || item.user.userID)) && isFullScreen}"
               :style="{
                    top: openDialogUserID == (item.user.uid || item.user.userID) ?(studentSinglePopupTop + 'px') : 'unset'
                }"
                >  
                <!-- v-dragDirective="{ 
                    parentId: 'studentSinglePopup-box-dragDirective', 
                }" -->
                <!-- height: `${studentSinglePopupHeight}px`, -->
                <div class="studentSinglePopup-box" :style="{
                    'max-height': openDialogUserID == (item.user.uid || item.user.userID) ? '100%!important' : 'unset',
                    'max-width': openDialogUserID == (item.user.uid || item.user.userID) ? '100%!important' : 'unset',
                     width: openDialogUserID == (item.user.uid || item.user.userID) ? (isFullScreen ? '100%' : containerWidth + 'px') : 'unset',
                     height: openDialogUserID == (item.user.uid || item.user.userID) ? (isFullScreen ? '100%' : containerHeight + 'px') : 'unset',
                }"
              
                >
                    <div class="video-stream-compute" :class="{'studentSinglePopup-container': openDialogUserID == (item.user.uid || item.user.userID)}">
                        <div class="studentSinglePopup-head" v-if="openDialogUserID == (item.user.uid || item.user.userID)">
                            <span class="name">{{ item.user &&( item.user.userName  || item.user.nick_name) ||''}}</span>
                            <div class="studentSinglePopup-head-right">
                                <span v-if="!isFullScreen" @click="changeFullScreen(true)"  class="screenIcon bigScreenIcon"></span>
                                <span v-if="isFullScreen" @click="changeFullScreen(false)"  class="screenIcon smallScreenIcon"></span>
                                <svg @click="closePopup" class="iconfont closeIcon" aria-hidden="true">
                                    <use xlink:href="#iconcuohao"></use>
                                </svg>
                            </div>
                        </div>
                        <div class="video-stream-body">
                            <video-stream 
                                :stream="item"
                                :inx="index"
                                :converseState="converseState"
                                :popupVisible="openDialogUserID == (item.user.uid || item.user.userID) ? true : false"
                                @openCurStreamPopup="openCurStreamPopup"
                                @teacherDealLine="teacherDealLine"
                            >
                              <template #videoStreamShare="scope">
                                        <slot name="onlineShareStream" :slot-scope="{...scope.slotScope, popup: openDialogUserID == (item.user.uid || item.user.userID) ? true : false}"></slot>
                                    </template>
                            </video-stream>
                        </div>
                    </div>
                    <div class="studentSinglePopup-sidebar" v-if="openDialogUserID == (item.user.uid || item.user.userID) ? true : false">
                        <!-- 侧边栏 -->
                        <slot name="studentPopupSidebar" :slot-scope="popupStream" ></slot>
                    </div>
                    <!-- 拖拽 -->
                    <!-- <div 
                    v-if="!isFullScreen && openDialogUserID == (item.user.uid || item.user.userID)"
                        class="resize-handle"
                        @mousedown="startResize"
                    ></div> -->
                </div>
                </div>
                <!-- :callLogTemp="curStudentLineStatus[item.user && item.user.userID]" -->
            </div>
        </div>
    </div>
</template>

<script>
import videoStream from '../videoStream/index.vue';
export default {
    name: 'onLineStudent',
    components: {
        videoStream
        // videoStream: () => import('../videoStream/index.vue'), // 视频流组件
    },
    inject: ['thisParent', 'zegoLiveRoom', 'commonVideoRoomThis'],
    props: {
        /**
         * @description 在线状态
         * @default false
         * @type {Boolean}
         * @required
         * @example true 连线中
         * @example false 未连线
         */
        converseState: {
            type: Boolean,
            default: false,
        },
        // 学生流列表
        streamList: {
            type: Array,
            default: () => [],
        },
        //当前放大屏幕的用户id
        openDialogUserID:{
            type: String,
            default: ''
        },
        // 搜索学生姓名
        searchName: {
            type: String,
            default: '',
        }

    },
    computed: {
        // 当前页码展示的数据
        currentList() {
            // alert(99)
            const start = (this.pageNum - 1) * this.pageSize;
            const end = this.pageNum * this.pageSize;
            return this.onLineList.slice(start, end);
        }
    },
    watch: {
        streamList: {
            handler(newVal, oldVal) {
                // this.pageNum = 1;
                if (newVal.length > 0) {
                    // 过滤出搜索的学生列表
                    // let lsit = newVal.filter(item => this.searchName ? item.isSearch : !item.isSearch);  
                    this.onLineList = newVal;
                } else {
                    this.onLineList = [];
                }
            },
            immediate: true,
            // deep: true
        },
        searchName(newVal, oldVal) { // 搜索学生姓名
            this.pageNum = 1;
            if (newVal) {
                // 过滤出搜索的学生列表
                let lsit = this.streamList.filter(item => (item.user && (item.user.userName ||item.user.nick_name)).includes(newVal));
                this.onLineList = lsit; 
            }else {
                this.onLineList = JSON.parse(JSON.stringify(this.streamList));
            }
        }
    },
    data() {
        return {
            // 在线学生列表
            onLineList: [],
            pageNum: 1, // 当前页码
            pageSize: 10, // 每页显示数量
            popupVisible: false, // 单个学生弹窗显示隐藏
            popupStudentStream: null, // 当前点开的学生信息
            popupCurInx: -1, // 当前点开的学生索引
            isFullScreen: false, // 当前点开的学生是否全屏

            popupStream: null, // 当前点开的学生信息流信息
            studentSinglePopupHeight: 0, // 学生弹窗高度
            studentSinglePopupTop: 0,
            // 弹框大小相关属性
            // 弹窗容器尺寸
            containerWidth: 1920*0.8, // 初始宽度 12rem = 1200px (假设1rem=100px) // 默认1920 80%宽
            containerHeight: 755, // 初始高度 7.55rem = 755px
            
            // 调整大小相关状态
            isResizing: false,
            startX: 0,
            startY: 0,
            startWidth: 0,
            startHeight: 0,
            studentPopupSidebarWidth: 0,

        }
    },
    mounted() {
     
        
    },
    beforeDestroy() {
        // 清除定时器
        if (this.timeObj) {
            clearInterval(this.timeObj);
            this.timeObj = null;
        }
    },
    methods: {
        /**
         * @description 上一页
         */
        prevPageHandler() {
            if (this.pageNum > 1) {
                this.pageNum--;
            }
        },

        /**
         * @description 下一页
         */
        nextPageHandler() {
            this.tempOnLineList = JSON.parse(JSON.stringify(this.onLineList));
            if (this.pageNum < Math.ceil(this.onLineList.length / this.pageSize)) {
                this.pageNum++;
            }
        },
        // 点开单个学生面板

        openCurStreamPopup(item, index) {
            // this.popupCurInx = index;
            // let temp = this.onLineList[index];
            // temp.isShow = false; // 切换当前学生的显示状态
            // this.onLineList[index] =temp;
            // this.$nextTick(() => {
            //     this.popupStudentStream = item;
            //     // this.popupVisible = true;
            // })
            
            // 获取【teacherLiveContainer-body】元素高度
            this.studentSinglePopupHeight = document.querySelector('.teacherLiveContainer-body').clientHeight;
            let h = document.querySelector('.teacherLiveContainer').clientHeight;
            this.studentSinglePopupTop = h  - this.studentSinglePopupHeight;

               // console.log(888888888888, );
                let dw = document.querySelector('.teacherLive').clientWidth;
                this.containerWidth = dw * 0.8; // 80%宽度
                this.containerHeight = 750;
            // this.popupStream = {...item, index: index};
            this.$emit('setPopupUserId', item.user.uid);
        },
        // 老师处理学生连线
        teacherDealLine(statue, stream) { // 老师处理连线
            this.$emit('teacherDealLine', statue, stream);
        },
        
        // 关闭弹窗
        closePopup() {
            // this.popupStudentStream = null;
            // this.popupVisible = false;
            //  this.popupStream = null;
            let dw = document.querySelector('.teacherLive').clientWidth;
            this.containerWidth = dw * 0.8; // 80%宽度
            this.containerHeight = 750;
            this.$emit('setPopupUserId', '');

            // this.$nextTick(() => {
            //     let temp = this.onLineList[this.popupCurInx];
            //     temp.isShow = false; // 切换当前学生的显示状态
            //     this.$set(this.onLineList, this.popupCurInx, temp);
            //     this.popupCurInx = -1;
            // })
        },
        changeFullScreen(flag) { // 切换全屏
            this.isFullScreen = flag;
            this.$emit('changeFullScreen', !flag);
        },
        
        // 开始调整大小
        startResize(e) {

            e.preventDefault();
            e.stopPropagation();
            
            this.isResizing = true;
            this.startX = e.clientX;
            this.startY = e.clientY;
            this.startWidth = this.containerWidth;
            this.startHeight = this.containerHeight;

            
            
            // const El = document.querySelector('.video-stream-compute');
            // const ElRect = El.getBoundingClientRect();
            // this.studentPopupSidebarWidth = this.startWidth - ElRect.width;

            // 添加全局事件监听
            document.addEventListener('mousemove', this.doResize);
            document.addEventListener('mouseup', this.stopResize);
        },
        
        // 执行调整大小
        doResize(e) {
            if (!this.isResizing) return;
            const dx = e.clientX - this.startX;
            const dy = e.clientY - this.startY;
            // 计算新尺寸（限制最小尺寸）
            const minWidth = 500;
            const minHeight = 214;
            console.log('调整大小', dx, dy);
            
            this.containerWidth = Math.max(minWidth, this.startWidth + dx);
            this.containerHeight = Math.max(minHeight, this.startHeight + dy);
        },
        
        // 停止调整大小
        stopResize() {
            this.isResizing = false;
            
            // 移除事件监听
            document.removeEventListener('mousemove', this.doResize);
            document.removeEventListener('mouseup', this.stopResize);
        },
    },

}
</script>

<style lang="less" scoped>
.onLineStudent {
    line-height: 1;
    box-sizing: border-box;
    padding: 0.1rem;
    flex: 1;
    .onLineStudent-head {
        height: 0.4rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .onLineStudent-head-title {
            font-size: 0.16rem;
            color: #E2E7FF;
            display: flex;
            align-items: center;
            gap: 0.06rem;
        }
        .onLineStudent-head-titleNo {
            color: #F8C70B;
        }
        .onLineStudent-head-switch {
            display: flex;
            align-items: center;
            height: 100%;
            .onLineStudent-head-switch-icon {
                
                cursor: pointer;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                .iconfont {
                    height: 0.24rem;
                    width: 1rem;
                    fill: #08F9FF;
                }
            }
            .onLineStudent-head-switch-iconNo {
                cursor: not-allowed;
                .iconfont {
                    fill: rgba(8, 249, 255, 0.5);
                }
            }
        }
    }
    .onLineStudent-box {
        display: flex;
        gap: 0.1rem 0.17rem;
        flex-wrap: wrap;
        .video-stream-container {
            width: 3rem;
            height: calc(3rem * 9 / 16); // 根据宽度计算高度;
            background: #474747;
            cursor: pointer;
            position: relative;
            .studentSinglePopup {
                position: fixed;
                width: 100vw;
                left: 0;
                // top: 0;
                right: 0;
                bottom: 0;
                top: calc(50% - 7.55rem / 2);
                // display: flex;
                // align-items: center;
                // justify-content: center;
                z-index: 111;
                background-color: rgba(16,16,16,0.7);
                .studentSinglePopup-box {
                    width: 80%;
                    height: 7.55rem;
                    display: flex;
                    position: absolute;
                    top: calc(50% - 7.55rem / 2);
                    // left: calc(50% - 12rem / 2);
                    left: 1.92rem;
                    // transform: translateX(-50%);
                    .studentSinglePopup-container {
                         flex: 1;
                        width: 0;
                        display: flex;
                        flex-direction: column;
                        position: relative;
                        background: #474747;
                        .studentSinglePopup-head {
                            width: 100%;
                            height: 0.4rem;
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            background: #09153D;
                            padding: 0 0.24rem;
                            box-sizing: border-box;
                            .name {
                                font-size: 0.14rem;
                                color: #FFFFFF;
                            }
                            .studentSinglePopup-head-right {
                                display: flex;
                                align-items: center;
                                .screenIcon {
                                    display: inline-block;
                                    margin-right: 0.3rem;
                                    cursor: pointer;
                                }
    
                                .hideScreenIcon {
                                    position: relative;
                                    width: 0.16rem;
                                    height: 0.16rem;
    
                                }
    
                                .hideScreenIcon::after {
                                    content: "";
                                    position: absolute;
                                    left: 0;
                                    top: 50%;
                                    transform: translateY(-50%);
                                    width: 0.16rem;
                                    height: 0.02rem;
                                    background: #FFFFFF;
                                    z-index: 1;
                                }
    
                                .bigScreenIcon {
                                    width: 0.16rem;
                                    height: 0.16rem;
                                    border: 0.02rem solid #FFFFFF;
                                }
    
                                .smallScreenIcon {
                                    position: relative;
                                    width: 0.16rem;
                                    height: 0.16rem;
                                }
    
                                .smallScreenIcon::before,
                                .smallScreenIcon::after {
                                    content: "";
                                    position: absolute;
                                    width: 0.07rem;
                                    height: 0.07rem;
                                    border: 0.02rem solid #FFFFFF;
                                    z-index: 1;
                                }
    
                                .smallScreenIcon::before {
                                    top: 0rem;
                                    right: 0rem;
                                }
    
                                .smallScreenIcon::after {
                                    bottom: 0rem;
                                    left: 0rem;
                                    background-color: #09153D;
                                    z-index: 2;
                                }
    
                                .closeIcon {
                                    width: 0.2rem;
                                    height: 0.2rem;
                                    fill: #FFFFFF;
                                    cursor: pointer;
                                }
                            }
                        }
                        .video-stream-body{
                            width: 100%;
                            flex: 1;
                            height: 0;
                        }
                    }
                }
            }
      
                .studentSinglePopup-fullScreen {
                    .studentSinglePopup-box {
                        width: 100%!important;
                        height: 100%!important;
                        left: 0!important;
                        top: 0!important;
                        .studentSinglePopup-container {
                            width: 100%;
                            height: 100%;
                        }

                    }
                }
            }
        }
        .onLineStudent-box-containerPopup {
            overflow: hidden;
        }
              /* 添加调整大小手柄样式 */
               .resize-handle {
                   position: absolute;
                   right: 0;
                   bottom: 0;
                   width: 12px;
                   height: 12px;
                   // background-color: #08F9FF;
                   border: 1px solid transparent;
                   
                   // border-top: 1px solid #08F9FF;
                   // border-left: 1px solid #08F9FF;
                   cursor: nwse-resize; /* 对角线调整光标 */
                   z-index: 10000;
                   overflow: hidden;
                   
                   /* 添加手柄视觉指示器 */
                   &::before {
                       content: '';
                       position: absolute;
                       width: 2px;
                       height: 200%;    
                       left: 15%;
                       transform: translateX(-50%) skewX(-45deg);
                       background: #09153D;
                   }
                   &::after {
                       content: '';
                       position: absolute;
                       width: 2px;
                       height: 200%;
                       left: 60%;
                       transform: translateX(-50%) skewX(-45deg);
                       background: #09153D;
                   }
               }

               /* 添加调整大小时的样式 */
               &.resizing {
                   /* 添加半透明边框指示调整状态 */
                   border: 2px dashed rgba(8, 249, 255, 0.5);
               }
}

</style>    
