<template>
    <div class="liveRoom">
        <!-- <cm-live-room :constants="params" :request="request" :endTime="endTime"></cm-live-room> -->
        <cm-teacher-live :constants="params" :request="request"  :roomInfo="roomInfo" :studentList.sync="studentList">
            <!-- <template v-slot:liveBarSlot>
               <div class="" style="height: 100px;"></div>
            </template> -->
            <template #roomShareStream="{ slotScope }"> 
                <div v-if="slotScope.platformType == 'applet'" style="position: relative; width: 100%;height: 100%;display: flex; align-items: center;justify-content: center;overflow: hidden;">
                    <div style="position:absolute; width: 100%;height: 100%;top: 0; left: 0;z-index: 1;"></div>
                    <div style="width: 3.9rem;" :style="{height: slotScope.popup ? '100%' : '8rem',transform: `scale(${slotScope.popup ? 1 : 0.2})`}"> 
                        <iframe style="width: 100%; height: 100%; border: none;" :id="'iframe_'+ slotScope.uid" :src="`https://tjtest.xinguoren.cn/miniAppScheme/schemeChat?isMgr=true&shareIframe=applet&userId=${slotScope.uid}`"></iframe>
                    </div>
                </div>
                <div v-if="slotScope.platformType == 'web'" style="width: 100%;height: 100%;position: relative; overflow: hidden;"> 
                    <div style="position:absolute; width: 100%;height: 100%;top: 0; left: 0;z-index: 1;"></div>
                    <div v-if="!slotScope.popup" style="min-width: 19.2rem; height: 10.5rem;position: absolute;left: 50%;top: 50%" :style="{transform: `translate(-50%, -50%) scale(${slotScope.popup ? 0.48 : 0.15})`}">
                        <iframe style="width: 100%; height: 100%; border: none;" :id="'iframe_'+ slotScope.uid" :src="`https://tjtest.xinguoren.cn/customPlan?isMgr=true&shareIframe=web&userId=${slotScope.uid}`"></iframe>
                    </div>
                    <div v-else style="width: 100%;height: 100%;">
                        <iframe style="width: 100%; height: 100%; border: none;" :id="'iframe_'+ slotScope.uid" :src="`https://tjtest.xinguoren.cn/customPlan?isMgr=true&shareIframe=web&userId=${slotScope.uid}`"></iframe>
                    </div>
                </div>

            </template>
            
            <template #studentPopupSidebar>
                <div class="liveContent">这里是学生弹窗内容</div>
            </template>
            
        </cm-teacher-live>
        <!-- <div @click="capHandler">{{!screenCap ? '捕获' : '停止'}}</div> -->
    </div>
</template>

<script>
import constants from './constants'; // 直播间常量参数
import $http from '../utils/http'; 
export default {
    data() {
        return {
            params: constants,
            request: window.$axios,
            screenCap: null,
            endTime: { // 延长上课时间配置
                endLiveTime: "1767196800000", // 课程预定截止时间
                spaceTipsTime: 30, // 延长上课时长
            },
            studentList: [], // 学生在线列表
            roomInfo: {
                date: {
                    day: '2月28[周五] ', // 在线督导日期
                    time: '15：00-17：00' // 在线督导时间
                },
                total: 10, // 预约学生人数
                startTime: 1748589600000, // 课程开始时间
            },
        }
    },
    created() {
    },

    mounted() {
    },

    methods: {
        // 采集屏幕
        async capHandler() {
            const _this = this;
            if (!this.screenCap) {
                this.screenCap = new window.screenCap(this.request, this.params);
                await this.screenCap.startCap();
                this.screenCap.shareClient.on('screenSharingEnded', () => {
                    _this.screenCap.endCap()
                    _this.screenCap = null;
                });;

            } else {
                this.screenCap.endCap()
                this.screenCap = null;
            }
            
        }
    }
}
</script>

<style lang="less" scoped>
.liveRoom {
    height: 100%;
    width: 100%;
}
.liveContent {
    height: 100%;
    width: 100%;
    background-color: aliceblue;
}
</style>