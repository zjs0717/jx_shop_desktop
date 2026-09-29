<template>
	<div class="studentLive">
		<room-enter
		   v-if="!isLogin"
			@enterClick="enterClick" 
		></room-enter>
		<div class="trapezoid_box_box"  v-show="enterShow" >
				 <trapezoid 
					 color="#040D2E"
					 rightWidth="0.24"
					 height="1.18"
				 >
				 <template>
					 <div class="trapezoid_box-content" @click="controlHandle(false)">
						 <span class="trapezoid_box-content-text">展开</span>
					 </div>
				 </template>
			 </trapezoid>
		 </div>
		<common-zego-live-room v-if="isLogin" ref="zegoLiveRoom" @zegoLiveRoomVmClientExample="zegoLiveRoomVmClientExample">
			 <live-seder 
				 ref="liveSeder" 
				 v-show="!enterShow"
				 :connectionStatus="connecStatus"
				 :myCameraStatus="myCameraStatus"
				 :myMicStatus="myMicStatus"
				 :mySupervisonStatus="mySupervisonStatus"
				 :isHideScreen="isHideScreen"
				 :isShare="isShare" 
				 @controlHandle="controlHandle"
				 @studentDeviceChange="studentDeviceChange"
				 @exitLive="exitLive"
				 @setStuStatus="setStuStatus"
				 
			 ></live-seder>
			 <video-connection 
				 :isHideScreen="isHideScreen" 
				 :connectionStatus="connecStatus" 
				 :promoter="promoter"
				 :otherOpenCamera="otherOpenCamera"
				 :myMicStatus="myMicStatus"
				 :myCameraStatus="myCameraStatus"
				 @hideScreen="hideScreen"
				 @requestChange="requestChange"
				 @setUserStrem="setUserStrem"
				 @setStuDevice="setStuDevice"
				 @shareChange="shareChange"
				 
			 >
				<template v-slot:connectionTip="{isFullScreen}" v-if="connectionTipInfo">
					 <div 
					 	class="studentLive_connectionTip"
						:class="{
							'studentLive_connectionTip_fullscreen':isFullScreen,
						}">
						<img class="studentLive_connectionTip_img" v-if="connectionTipInfo.type == '1'" src="../static/img/wait.png" alt="">
						<img class="studentLive_connectionTip_img" v-if="connectionTipInfo.type == '2'" src="../static/img/self-study.png" alt="">
						<span class="studentLive_connectionTip_text" v-html="connectionTipInfo.content"></span>
					 </div>
				</template>
			</video-connection>
		 </common-zego-live-room>
	</div>
 </template>
 
 <script>
 import $HTTP from '../js/room/service/index'; // 请求实例
 import defaultParams from '../js/room/utils/constants'; // 直播间默认配置参数
 // import zegoClient from '../js/room/zego/zegoClient/index'
 import roomEnter from './common/roomEnter/index.vue'; // 直播间入口
 import liveSeder from './common/liveSeder/index.vue'; // 右侧控制面板
 import trapezoid from './common/trapezoid/index.vue'; // 梯形
 import videoConnection from './common/videoConnection/index.vue'; // 聊天面板
 import commonZegoLiveRoom from './common/commonLive/common-zego-live-room.vue'; // 通用直播组件 实例化初始化
 export default {
	 name: 'cmStudentLive',
	 props: ['request', 'constants', 'endTime', 'isControlLogin'],
	 provide() {
		 return {
			 thisParent: this
		 }
	 },
	 components: {
		 roomEnter, // 直播间入口
		 liveSeder, // 右侧控制面板
		 trapezoid, // 梯形
		 videoConnection, // 聊天面板
		 commonZegoLiveRoom, // 通用直播组件 实例化初始化
		 // // 直播间入口
		 // roomEnter: () => import('./common/roomEnter/index.vue'),
		 // // 右侧控制面板
		 // liveSeder: () => import('./common/liveSeder/index.vue'),
		 // // 梯形
		 // trapezoid: () => import('./common/trapezoid/index.vue'),
		 // // 聊天面板
		 // videoConnection: () => import('./common/videoConnection/index.vue'),
		 // // 通用直播组件 实例化初始化
		 // commonZegoLiveRoom: () => import('./common/commonLive/common-zego-live-room.vue'),
 
	 },
	 data () {
		 return {
			 STATE_CLOSE: 1, // 关闭 默认  摄像头 麦克风
			 STATE_OPEN: 2, // 开启 默认  摄像头 麦克风
 
			 enterShow: false, // 直播间入口是否显示
			 isHideScreen: false, // 是否隐藏屏幕
			 connecStatus: 0, // 连线状态 0：未连线 1：连线中 2：连线请求中  
			 promoter: 'student', // 发起连线身份标识 student：学生 teacher：督导师
			 otherOpenCamera: false, // 对方是否开启摄像头
 
			 myCameraStatus: 1, // 我的摄像头状态
			 myMicStatus: 1, // 我的麦克风状态
			 mySupervisonStatus: 1, // 我的督导状态
 
			 liveRoomParams: this.constants ? {...defaultParams, ...this.constants} : defaultParams, // 直播间参数
			 isLogin: false, // 登陆状态
			 enterHtml: '正在进入直播间...', // 等待进入文案
			 $http: null, // 请求实例
			 stuStrem: {}, // 学生流信息
			 teacherStrem: {}, // 老师流信息
			 // 本地存储刷新缓存
			 storageStatus: {
				 connecStatus: 0, // 连线状态 0：未连线 1：连线中 2：连线请求中
				 promoter:'student', // 发起连线身份标识 student：学生 teacher：督导师
				 myCameraStatus: 1, // 我的摄像头状态
				 myMicStatus: 1, // 我的麦克风状态
				 stuStrem: {}, // 学生流信息
			 }, // 存储状态信息
			 isShare: false, // 是否分享
			 isRefresh: false, // 是否刷新

			 connectionTipInfo: null, // 连线提示,
		 }
	 },
	 created () {
		 this.isRefresh = false;
		 // 初始化
		 let storageStatus = localStorage.getItem('storageStatus') || null;
		 if(storageStatus){
			 let _storageStatus = JSON.parse(storageStatus);
			 this.storageStatus = {
				 ..._storageStatus
			 }
			 this.connecStatus = _storageStatus.connecStatus; // 连线状态 0：未连线 1：连线中 2：连线请求中
			 this.promoter = _storageStatus.promoter; // 发起连线身份标识 student：学生 teacher：督导师
			 this.myCameraStatus = _storageStatus.myCameraStatus; // 我的摄像头状态
			 this.myMicStatus = _storageStatus.myMicStatus; // 我的麦克风状态
			 this.stuStrem = _storageStatus.stuStrem; // 学生流信息
		 }
		 this.STATE_CLOSE = this.liveRoomParams.STATE_CLOSE;
		 this.STATE_OPEN = this.liveRoomParams.STATE_OPEN;
		 this.$http = new $HTTP(this.request, this.liveRoomParams);
 
		 // 缓存的一些状态，刷新时恢复
 
	 },
	 mounted () {
		 this.enterShow = localStorage.getItem('enterShow') == 'true' ? true : false;
		 this.isLogin = localStorage.getItem('liveRoomIsLogin') == 'true'? true : false;
		 let isHideScreen = localStorage.getItem('isHideScreen') || '';
		 this.isHideScreen = (isHideScreen == 'true') ? true : false;
		 // 可控制是否直接登录房间
		 if(this.isControlLogin || this.isLogin){
			 this.enterClick('refresh');
		 }
		 BUS.$on('openDeviceHandele', this.openDeviceHandele);
		 BUS.$on('changeUserInfo', this.onChangeUserInfo)
		 // 模拟对方发起连线请求中
		 // setTimeout(()=>{
		 // 	this.promoter = 'teacher';
		 // 	this.connecStatus = 2;
		 // },3000)
 
	 },
	 methods: {
		 // 共享状态改变
 
		 shareChange(val){
			 this.isShare = val;
		 },

		 /**
		  * @description 点击直播间入口登录
		  */
		 enterClick (val) {
			 const fn = (val) => {
				// 未到服务开始时间，暂时无法进入,设置false
				if(val == 'noLogin') {
					this.isLogin = false;
					return
				}
				
				// 房间id更新
				this.liveRoomParams = {
					...this.liveRoomParams,
					USER_INFO: {
						...this.liveRoomParams.USER_INFO,
						roomId: val,
					}
				}
				 if(val != 'refresh'){
					 // 正常点击触发
					 // this.enterShow = false;
					 localStorage.removeItem('isHideScreen');
					 this.isHideScreen = false;
					 localStorage.removeItem('enterShow');
					 this.enterShow = false;
				 }
				 this.loginRoomBiz();
			 };
			 const exitFn = () => {
				 this.$refs.liveSeder._exitLive();
			 }
			 this.$emit('enterClick', fn, exitFn, val);
		 },
		 /**
		  * 右侧面板控制显示隐藏
		  */
		 controlHandle (val) {
			 this.enterShow = !this.enterShow;	
			 localStorage.setItem('enterShow', this.enterShow);
 
		 },
		 // 学生接听推流，更改设备状态
		 openDeviceHandele(role, cb){
			 if(role == 2){
				 this.studentDeviceChange({ id: 2,  label: 'myMicStatus', name: 'mic' } , null, cb);
			 }
		 },
		 /**
		  * 打开视频屏幕面板
		  */
		 async studentDeviceChange(item, status, cb){
			 
			 if(!this.isLogin) return;
			 if(item.id == 1){
				 // 隐藏视频屏幕面板 督导中/弹出窗口
				 this.isHideScreen = !this.isHideScreen;
				 localStorage.setItem('isHideScreen', this.isHideScreen);
				 
			 }else if(item.id == 2 || item.id == 3){
				 // if(item.id == 2 && this.connecStatus == 0){
				 // 	this.$message({
				 // 		type: 'warning',
				 // 		message: '当前没有连线，无法操作麦克风'
				 // 	});
				 // 	return
				 // }
				 // 打开/关闭摄像头/麦克风
				 let user = this.liveRoomParams.USER_INFO || {};
				 if (user.role == 2) {
					 const state = this[item.label] == this.STATE_CLOSE ? this.STATE_OPEN : this.STATE_CLOSE ;
					 const name = item.name;
					 await this.$http.setUserInfo({
						 target_uid: user.uid || user.userID,
						 [name]: state
					 })
					 
					 this.stuStrem.user[name] = state;
					 this[item.label] = state;
					 BUS.$emit('userHandStateChange', { [user.uid || user.userID]: { [name]: state } }, true, name)
					 // if(!cb){
					 // }
 
					 // if(item.id == 2 && cb){
					 // 	 cb();	
					 // }
				 }
 
			 }else if(item.id == 4){
				if (item.connectionTip) {
					// 连线提示信息,当type为2或1时，表示需要弹窗提示，type为2时，不需要更新信息
					this.connectionTipInfo = item.connectionTip;
					setTimeout(() => {
						this.connectionTipInfo = null;
					}, 5000);
				}
				if (item.connectionTip && item.connectionTip.type == 2)return
				 this.promoter = 'student';
				 this.connecStatus = status;
				 const connectionNum = this.storageStatus.connectionNum || 0;
				 this.storageStatus = {
					 ...this.storageStatus,
					 promoter: this.promoter, 
					 connecStatus: this.connecStatus, 
					 connectionNum: status != 0 ? connectionNum + 1 : connectionNum, // 学生发起通话，接通次数+1；在学生发起通话时使用该字段
				 }
				 localStorage.setItem('storageStatus', JSON.stringify(this.storageStatus));
		 
			 }
		 },
		 // 切换麦克风/摄像头状态改变
		 onChangeUserInfo(data, tag){
			 if(tag == 'mic'){
				 this.myMicStatus = data[tag]; // 麦克风状态改变
			 }else if(tag =='camera'){
				 this.myCameraStatus = data[tag]; // 摄像头状态改变
			 }
			 
		 },
		 /**
		  * 隐藏视频屏幕面板
		  */
		 hideScreen(){
			 this.isHideScreen = true;
		 },
		 /**
		  * 连线状态改变 0 挂断 1接通
		  */
		 requestChange(val){
			 this.connecStatus = val;
			 
			 this.storageStatus = {
				 ...this.storageStatus,
				 connecStatus: this.connecStatus, 
			 }
			 localStorage.setItem('storageStatus', JSON.stringify(this.storageStatus));
		 },
		 // 设置学生设备摄像头/麦克风状态
		 setStuDevice(){
			 let id = this.liveRoomParams.USER_INFO.userID;
			 let deviceStatus = localStorage.getItem('deviceStatus') && JSON.parse(localStorage.getItem('deviceStatus')) || null;
			 let { mic, camera } = deviceStatus && deviceStatus[id] || {};
			 if (mic) {
				 this.myMicStatus = mic;
			 }
			 if (camera) {
				 this.myCameraStatus = camera;
			 }
			 this.storageStatus = {
				 ...this.storageStatus,
				 myMicStatus: this.myMicStatus, 
				 myCameraStatus: this.myCameraStatus, // 我的摄像头状态
			 }
			 localStorage.setItem('storageStatus', JSON.stringify(this.storageStatus));
		 },
		 /**
		  * 学生本地流信息/教师流 tag: stuStrem / teacherStrem
		  */
		 setUserStrem(val, tag){
			 this[tag] = val;
			 if(tag == 'stuStrem' && val.user &&  val.user.isMe){
				 this.myCameraStatus = val.user.camera;
				 this.myMicStatus = val.user.mic;
 
 
				 this.storageStatus = {
					 ...this.storageStatus,
					 myMicStatus: this.myMicStatus, 
					 myCameraStatus: this.myCameraStatus, // 我的摄像头状态
				 }
				 localStorage.setItem('storageStatus', JSON.stringify(this.storageStatus));
			 }else if(tag =='teacherStrem'){
				 // // 对方是否开启摄像头
				 // this.otherOpenCamera = val  && val.user &&  val.user.camera == this.STATE_OPEN ? true : false;
			 }
		 },
		 async exitLive(){
			 this.isLogin = false;
			 localStorage.setItem('liveRoomIsLogin', this.isLogin);
			 this.$emit('stuExitLive');
			 localStorage.removeItem('enterShow');
			 localStorage.removeItem('teacherUid');
			 localStorage.removeItem('isHideScreen');
		 },
		 // 接收教师端信令
		 setStuStatus(status, val){
			 // status  // 教师信令状态 0: 发起连线  1：接听 2、挂断 3、超时  4、已取消 
			 //connecStatus 连线状态 0：未连线 1：连线中 2：连线请求中  
			 if(val){
				 this.promoter = 'teacher';
			 }
			 // status: connecStatus
			 const statusTemp = { 0: 2, 1: 1, 2: 0, 3: 0 }
			 this.connecStatus = statusTemp[status];
 
			 // if(status == 0){
			 // 	this.connecStatus = 2;
			 // }else if(status == 1){
			 // 	this.connecStatus = 1;
			 // }else if(status == 2){
			 // 	this.connecStatus = 0;
			 // }else if(status == 3){
			 // 	this.connecStatus = 0;
			 // }
			 if(status == 0){
				this.enterShow = false;	
			 	localStorage.setItem('enterShow', this.enterShow);
				this.isHideScreen = false;
				 localStorage.setItem('isHideScreen', this.isHideScreen);
			 }
			 
			 this.storageStatus = {
				 ...this.storageStatus,
				 promoter: this.promoter, 
				 connecStatus: this.connecStatus, 
			 }
			 localStorage.setItem('storageStatus', JSON.stringify(this.storageStatus));
		 },
		 
		 /**
		  * @desc: 后台业务 - 登录房间
		  */
		  async loginRoomBiz() {
			 const { roomId, userID, userName, role } = this.liveRoomParams.USER_INFO;
			 this.roomId = roomId
			 this.userName = userName
			 this.isRefresh = false;
			 const loginParams = {
				 // uid: Number(userID),
				 uid: userID,
				 room_id: roomId,
				 nick_name: userName,
				 role: role || 2,
				 room_type: this.liveRoomParams.classScen || 1
			 }
			 const login = await this.$http.loginRoom(loginParams);
			 if (login.ret.code === 0) {
				 // this.$http.setUserInfo({
				 // 		target_uid: userID,
				 // 		uid: userID,
				 // 		nick_name: userName,
				 // 		room_id: roomId,
				 // 		role: role || 2,
				 // 	})
				 this.isLogin = true;
			 } else {
				 this.isLogin = false;
				 // this.enterHtml = login.ret.message;
				 this.showToast(login.ret.message, 3000, 'error');
				 localStorage.removeItem('enterShow');
				 localStorage.removeItem('teacherUid');
			 }
			 localStorage.setItem('liveRoomIsLogin', this.isLogin);
		 
			 localStorage.setItem('storageStatus', JSON.stringify(this.storageStatus));
			 this.$emit('setLoginStatus', this.isLogin)
		 },


		 /**
		  * 获取ZegoClient实例
		  */
		getZegoClient () {
			return this.$refs.zegoLiveRoom ? this.$refs.zegoLiveRoom.client : null;
		},

		/**
		 * 获取教师teacherUid
		 */
		getTeacherUid () {
			return localStorage.getItem('teacherUid') || '';
		},
		/**
		 * @desc: 学生端实例抛出，项目中使用
		 */
		zegoLiveRoomVmClientExample(client){
			this.$emit('zegoLiveRoomVmClientExample', client);
		},
	 },
	 beforeDestroy () {
		 BUS.$off('openDeviceHandele', this.openDeviceHandele);
		 BUS.$off('changeUserInfo', this.onChangeUserInfo);
		 localStorage.removeItem('enterShow');
		 localStorage.removeItem('teacherUid');
		 localStorage.removeItem('isHideScreen');
	 }
	 
 }
 </script>
 
 <style lang="less" scoped>
 .studentLive {
	 // height: 100%;
	 //display: inline-block;
	 .blank {
		 width: 4.5rem;
		 height: 3.04rem;
		 position: fixed;
		 display: flex;
		 cursor: pointer;
		 z-index: 10002;
		 background-color: #FFF;
		 top: calc(100% - 3.34rem);
		 left: calc(100% - 5.69rem);
		 align-items: center;
		 justify-content: center;
		 span {
			 font-size: 0.16rem;
			 color: #333;
		 }
	 }
	 .trapezoid_box_box {
			 position: fixed;
			 top: 50%;
			 right: -0.03rem;
			 transform: translateY(-50%);
			 .trapezoid_box-content {
				 width: 100%;
				 height: 100%;
				 display: flex;
				 align-items: center;
				 justify-content: center;
				 cursor: pointer;
				 .trapezoid_box-content-text {
					 font-size: 0.14rem;
					 color: #AFC1FF;
					 writing-mode: vertical-rl;
					 letter-spacing: 0.02rem;
 
				 }				
			 }
		 }
	.studentLive_connectionTip {
		background: rgba(0, 19, 84, 0.9);
		border-radius: 0.04rem;
		padding: 0.1rem 0.25rem;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		gap: 0.14rem;
		.studentLive_connectionTip_img {
			height: 0.4rem;
			width: auto;
		}
		.studentLive_connectionTip_text {
			font-size: 0.14rem;
			color: #FFFFFF;
			line-height: 0.2rem;
		}
	}
	.studentLive_connectionTip_fullscreen {
		.studentLive_connectionTip_img {
			height: 0.16rem;
		}
	}
 }
 </style>