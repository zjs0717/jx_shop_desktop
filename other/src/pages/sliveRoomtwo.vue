<template>
    <div class="liveRoom">
        <cm-student-live v-if="isLiveRoomExit" :isControlLogin="false" :constants="params.data" :request="params.axios"
            @stuExitLive="stuExitLive" @enterClick="enterClick" @setLoginStatus="setLoginStatus"></cm-student-live>

        <el-dialog title="提示" :show-close="false" :visible.sync="dialogVisible" :close-on-click-modal="false"
            :close-on-press-escape="false" width="30%">
            <span>服务时间已超出15分钟，直播间即将关闭</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="closeLive">确 定 {{ dialogNum }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import constants from './constants2'; // 直播间常量参数
import $http from '../utils/http';
const countdown = 15; // 倒计时时间

export default {
    data() {
        return {
            params: constants,
            request: $http,
            isLiveRoomExit: false, // 退出

            params: null,
            diffTime: 15 * 60 * 1000, //弹窗延迟时间
            enterAddTime: 5 * 60 * 1000, // 提前几分钟进直播间

            dialogVisible: false, // 弹窗是否显示
            dialogNum: countdown,// 倒计时
            intervalTmer: null, // 倒计时
            exitLiveFn: null, // 退出直播间的回调

            liveUrls: [], // 直播间信息

        }
    },
    created() {
        this.setLiveRoom();
    },
    methods: {
        setLiveRoom() {
            this.clearTimer();

            let result = [
                {
                    "liveBroadcastRoomUrl": "1131919734183378944",
                    "orderDate": 1749830400000,
                    "studentName": "纪2",
                    "startTime": "00:00",
                    "endTime": "23:44:00",
                },

                // {
                //     "liveBroadcastRoomUrl": "1130873086279704576",
                //     "orderDate": 1749830400000,
                //     "studentName": "纪",
                //     "startTime": "15:44:00",
                //     "endTime": "15:44:30",
                // },
            ];
            let list = result || [];
            let liveUrls = [];
            // let nowLiveUrl = [];
            if (list.length) {
                let nowTime = new Date().getTime();
                let nowDate = '2025-08-30 ';
                list.forEach(item => {
                    let orderDate = '2025-08-30 ';
                    if (item.liveBroadcastRoomUrl && (orderDate == nowDate)) {

                        let startTime = orderDate + item.startTime;
                        let endTime = orderDate + item.endTime;

                        let obj = {
                            roomId: item.liveBroadcastRoomUrl, // 房间id
                            startTime: new Date(startTime).getTime(), // 开始时间
                            endTime: new Date(endTime).getTime(), // 结束时间
                            // startTimeStr: time,
                            studentName: item.studentName, // 学生姓名
                            delayTime:  new Date(endTime).getTime() + this.diffTime,

                        }
                        liveUrls.push(obj);

                    }
                })
                liveUrls = this.dealLiveUrl(liveUrls)
                this.liveUrls = liveUrls;
                // alert(JSON.stringify(liveUrls))
                console.log('liveUrls----------', liveUrls);

                let isTest = true;
                let serverHome = !isTest ? "wss://webliveroom4057099555-api.zego.im/ws" : "wss://webliveroom-test.zego.im/ws"
                let hostMap = (isTest ? 'https://tjservicetest.xinguoren.cn' : 'https://tjservice.xinguoren.cn') + "/api/liveroom/zego/";


                // let hostMap = "http://tjdev.xinguoren.cn/g/liveroom/zego/";
                // return
                // const {userID, userName, roomId, role} = this.$route.query;
                const query = {
                    APPID: {
                        home: 4057099555,
                        overseas: 4057099555

                    },
                    SERVER: { //构建即构示例服务器地址参数
                        home: "wss://webliveroom4057099555-api.zego.im/ws",  // serverHome,
                        overseas: "wss://webliveroom-alpha.zego.im/ws"
                    },
                    serverSecret: "d9ecd57052284ebcc997cadd323824ca", // 用于后台服务请求接口的鉴权校验
                    ENVTYPE: true, // 是否是测试环境, => true 测试环境 => 正式环境
                    getTokenUrl: 'http://omptest.xinguoren.cn/api/liveroom/zego/' + "thirdToken", // 登录房间token请求地址
                    USER_INFO: { // 用户信息
                        userID: "e26f0dd2-d6ac-40c3-bd19-0e760e1c3bb1", // 用户id
                        userName: liveUrls.length ? (liveUrls[0].studentName || userInfo.student.realname || userInfo.nickname || userInfo.realname || userInfo.mobile) : '', // 用户姓名
                        roomId: liveUrls.length &&  liveUrls[0].roomId, // 房间idliveUrls[0].roomId
                        role: 2, // 进入直播间的角色 1 => 教师 2 => 学生
                        isMe: true, // 本身标识
                        identity: 'student', // 用户身份标识 student => 学生 teacher => 教师
                    },
                    AREA_ENV: "home",  // home => 国内环境  overseas => 海外环境
                    maxMemberCount: 20, // 房间最大连接数
                    hostMap: 'http://omptest.xinguoren.cn/api/liveroom/zego/', // 用户管理服务接口
                    classScene: 1,  // 1 => 小班课 2 => 大班课

                }
                this.params = {
                    data: query,
                    axios: $http
                }
                this.isLiveRoomExit = true;
                // }
            }

        },
        // 处理直播预约数组

        dealLiveUrl(liveUrls = []) {


            let tempList = liveUrls.sort((a, b) => a.startTime - b.startTime);
            let obj = null;
            let objList = [];
            // 将时间按段落分开
            tempList.forEach((item) => {
                if (!obj) {
                    obj = { ...item };
                } else {
                    // if(roomId)
                    if (obj.roomId == item.roomId) {
                        if (obj.endTime == item.startTime) {
                            // 更新结束时间
                            obj = {
                                ...obj,
                                endTime: item.endTime
                            };
                        } else {
                            objList.push(obj);
                            obj = { ...item };
                        }
                    } else {
                        objList.push(obj);
                        obj = { ...item };
                    }
                }
            })
            if (obj) {
                objList.push(obj);
            }
            obj = null;
            return objList;
        },

        // 退出直播间入口，重新刷新预约列表，获取最新直播间
        stuExitLive() {
            this.setLiveRoom();
        },
        // 弹框确定
        closeLive() {
            this.clearTimer();
            this.dialogVisible = false;
            this.exitLiveFn && this.exitLiveFn();
        },
        // 点击进入直播间
        enterClick(fn, exitFn, val) {
            this.exitLiveFn = exitFn || null;

            this.clearTimer();
            // debugger
            this.dialogNum = countdown;

            let objList = this.liveUrls || [];
            let nowTime = new Date().getTime();
            // 排序
            let appointList = objList.length && objList.filter(item => {
                return nowTime < item.endTime
            })
            if (val == 'refresh') {
                // appointList =  objList.length && objList.filter(item => {
                //     if (objList.length > 1 && objList[0].roomId != objList[1].roomId && objList[0].endTime == objList[1].startTime) {
                //         return nowTime < item.endTime
                //     } else {
                //         return nowTime < item.delayTime
                //     }
                // })
                appointList = objList.length && objList.filter(item => {
                    return nowTime < item.delayTime
                })
            }
            if (!(appointList && appointList.length) || (nowTime + this.enterAddTime) < (appointList[0].startTime)) {
                fn && fn('noLogin');
                if (val !== 'refresh') {
                    this.showToast('未到服务开始时间，暂时无法进入', 3000, 'error');
                }
                return
            }

            //  this.liveRoomParams = {
            // 	 ...this.liveRoomParams,
            // 	 USER_INFO: {
            // 		 ...this.liveRoomParams.USER_INFO,
            // 		 roomId: appointList[0].roomId,
            // 	 }
            //  }
            // let query = {
            //     ...this.params.data,
            //     USER_INFO: {
            //         ...this.params.data.USER_INFO,
            //         roomId: appointList[0].roomId,
            //     }
            // }
            // this.$set(this.params, 'data', query)
            let timeNum = Number(appointList[0].endTime) + this.diffTime - nowTime;
            timeNum = timeNum <= 0 ? 0 : timeNum;
            // if(appointList.length == 1){
            //     console.warn('只有一个房间')
			// 	 // 设置超时十五分钟后弹窗自动退出直播间
			// 	 this.timeOutFn(timeNum, null, exitFn);
			//  }else {
			// 	 //  下一次预约和当前判断
			// 	 if(appointList[0].roomId == appointList[1].roomId){
            //             console.warn('大于1，同一个房间， 15分钟后自动退出直播间')
			// 			 // 同一个房间， 15分钟后自动退出直播间
			// 			 this.timeOutFn(timeNum, null, exitFn);
			// 	 }else {
			// 		 // 不同房间
			// 		 if(appointList[0].endTime == appointList[1].startTime){
            //              // 有衔接时间
			// 			 let time = (timeNum - this.diffTime) > 0 ? (timeNum - this.diffTime) : 0;
            //              console.warn('有衔接时间，不同房间')
			// 			 this.timeOutFn(time, true, exitFn)
			// 		 }else{
			// 			 // 无衔接预约时间， 15分钟后自动退出直播间
            //              console.warn('无衔接预约时间，不同房间')
			// 			this.timeOutFn(timeNum, null, exitFn);
			// 		 }
			// 	 }
			//  }
            this.timeOutFn(timeNum, null, exitFn);
            fn && fn(appointList[0].roomId);
        },
        // 定时
        timeOutFn(time, flag, exitFn) {

            this.loginOutTime = setTimeout(() => {
                // if (isLogin) {
                    if (!flag) {
                        this.dialogVisible = true;
                        this.dialogNum = countdown;
                        this.intervalTmer = setInterval(() => {
                            this.dialogNum--;
                            if (this.dialogNum <= 0) {
                                this.dialogVisible = false;
                                exitFn && exitFn();
                                this.clearTimer();
                            }
                        }, 1000)
                    } else {
                        console.warn('有衔接时间,直接退出', exitFn)
                        exitFn && exitFn();
                        this.clearTimer();
                    }
                // }
                // this.clearTimer();
            }, time);
        },
        // 登录接口抛出登录状态
        setLoginStatus(val){
            if(!val){
                this.clearTimer();
            }
        },
        //  清除定时器
        clearTimer() {
            if (this.intervalTmer) {
                clearInterval(this.intervalTmer);
                this.intervalTmer = null;
            }
            if (this.loginOutTime) {
                clearTimeout(this.loginOutTime);
                this.loginOutTime = null;
            }
        },
    }
}
</script>

<style lang="less" scoped>
.liveRoom {
    height: 100%;
    width: 100%;
}
</style>