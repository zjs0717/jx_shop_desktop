<template>
    <div class="teacherLive">
        <common-zego-live-room v-if="isLogin && liveRoomParams" @zegoLiveRoomVmClientExample="zegoLiveRoomVmClientExample">
            <teacher-live-container @exitRoom="exitRoom" @teacherIMRecvData="teacherIMRecvData"  v-bind="$attrs" >
                <template #liveBarSlot>
                    <slot name="liveBarSlot"></slot>
                </template>
                <template #liveBody>
                    <slot name="liveBody"></slot>
                </template>
                <template #teacherContainerShareStream="scope" >

                    <slot name="roomShareStream" :slot-scope="{...scope.slotScope
                    }"></slot>
                </template>
                <template #studentPopupSidebar>
                    <slot name="studentPopupSidebar"></slot>
                </template>
            </teacher-live-container>
        </common-zego-live-room>
        <div v-else>
            <span>{{enterHtml}}</span>
        </div>
    </div>
</template>

<script>
// import { create } from 'js-md5';
import $HTTP from '../js/room/service/index'; // 请求实例
import defaultParams from '../js/room/utils/constants'; // 直播间默认配置参数
import commonZegoLiveRoom from './common/commonLive/common-zego-live-room.vue';
import teacherLiveContainer from './common/teacherLiveContainer/index.vue';
export default {
    name: 'cmTeacherLive',
    props: {
        // 直播间请求
        request: {
            type: Function,
            default: () => ({}) // 默认空对象
        },
        // 直播间常量参数
        constants: {
            type: Object,
            default: () => ({}) // 默认空对象
        },

        // 直播间信息, 在headPanel文件中使用
        roomInfo: {
            type: Object,
            default: () => ({}) // 默认空对象
        },

        // 学生列表
        studentList: {
            type: Array,
            default: () => ([])
        }
    },
    components: {
        // 通用直播组件 实例化初始化
        commonZegoLiveRoom,
        teacherLiveContainer
		// commonZegoLiveRoom: () => import('./common/commonLive/common-zego-live-room.vue'),
        // teacherLiveContainer: () => import('./common/teacherLiveContainer/index.vue'),
    },
    provide() {
        return {
            thisParent: this,
            liveBarSlot: this.$scopedSlots.liveBarSlot, // tabbarSlot

        }
    },

    data() {
        return {
            liveRoomParams: this.constants ? {...defaultParams, ...this.constants} : defaultParams, // 直播间参数
            isLogin: false, // 登陆状态
            enterHtml: '正在进入直播间...', // 等待进入文案
            $http: null, // 请求实例
            isRefresh: false, // 是否刷新
        }
    },
    created() {
        this.isRefresh = false;
        this.init();
    },

    mounted() {
    },

    beforeDestroy() {

    },
    methods: {

        /**
         * @description 初始化
         */
        init() {
            // 请求实例
            this.$http = new $HTTP(this.request, this.liveRoomParams);
            // // 登录进入直播间
            this.loginRoomBiz()
            BUS.$on('roomAttendeesChange', this.roomAttendeesChange);
            
        },

         /**
         * @desc: 后台业务 - 登录房间
         */
         async loginRoomBiz() {
           
            
            const { roomId, userID, userName, role } = this.liveRoomParams.USER_INFO || {};
            // 判断新旧直播间是否一致
            const liveRoomIdOrTime = localStorage.getItem('liveRoomIdOrTime');
            const newLiveRoomIdOrTime = `${roomId}-${this.$route.query.startTime || ''}`;
            if(liveRoomIdOrTime !== newLiveRoomIdOrTime){
                localStorage.setItem('liveRoomIdOrTime', newLiveRoomIdOrTime);
                localStorage.removeItem('callLogData');
            }
            const loginParams = {
                // uid: Number(userID),
                uid: userID,
                room_id: roomId,
                nick_name: userName,
                role: role || 2,
                room_type: this.liveRoomParams.classScene || 1
            }
            const login = await this.$http.loginRoom(loginParams);
            
            if (login.ret.code === 0) {
                this.isLogin = true;
            } else {
                this.showToast(login.ret.message, 3000, 'error');
                this.enterHtml = login.ret.message;
            }
        },
        async exitRoom(){
            // await this.$http.logoutRoom(this.$http.roomId)
            // await this.$http.leaveRoom()
            // localStorage.removeItem('callLogData');
            // localStorage.removeItem('callLogTempDataStorage');
            // localStorage.removeItem('stuCallLine');
            // localStorage.removeItem('deviceStatus');
            this.$emit('teacherEndExitRoom');
        },
        // 监听IM消息事件 抛出
        teacherIMRecvData(data){
            this.$emit('teacherIMRecvData', data);
        },

        /**
         * 监听房间人数变化
         */
        roomAttendeesChange(list, teacherUser) {
            const studentList = list.filter(item => item.role == 2);
            this.$emit('update:studentList', studentList);
        },
        /**
		 * @desc: 教师端实例抛出，项目中使用
		 */
		zegoLiveRoomVmClientExample(client){  
			this.$emit('zegoLiveRoomVmClientExample', client);
		},
    }
}
</script>

<style lang="less" scoped>
.teacherLive {
    background: rgba(5, 14, 48, 1);
    height: 100%;
    width: 100%;
}
</style>