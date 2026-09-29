<template>
	<div v-dragDirective class="videoConnection" id="videoConnectionContaimerId" :class="{
		'videoConnectionSmall': !isFullScreen,
		'videoConnectionFull': isFullScreen,
		'hideScreen': isHideScreen
	}">
		<slot name="connectionTip" :slot-scope="{isFullScreen}"></slot>
		<!-- 获取设备如摄像头、麦克风等设备转台，并获取视频流成员列表等的初始化 -->
		<commonRoomControllerFeature :share="share"></commonRoomControllerFeature>
		<!-- 音频流 -->
		<common-room-audio-item  v-if="connectionStatus == 1 && teacherStream && teacherStream.user  && audioStreamData && audioStreamData[teacherStream.user.uid || teacherStream.user.userID] && audioStreamData[teacherStream.user.uid || teacherStream.user.userID].streamID" :stream="audioStreamData[teacherStream.user.uid || teacherStream.user.userID]" />

		<!-- 视频请求连线 -->
		<div  class="videoConnection_request" v-if="promoter == 'teacher' && connectionStatus == 2">
			<div class="videoConnection_request-title">
				督导师请求连线
			</div>
			<div class="videoConnection_request-title2">{{autoMannedNum}}s后自动接听</div>
			<div class="videoConnection_request-content">
				<!-- 挂断连线 -->
				<div class="videoConnection_request-content-item" @click="requestChange(0)">
					<svg class="iconfont videoConnection_request-content-item-icon" aria-hidden="true">
						<use xlink:href="#iconguaduan"></use>
					</svg>
				</div>
				<!-- 接听连线 -->
				<div class="videoConnection_request-content-item" @click="requestChange(1)">
					<svg class="iconfont videoConnection_request-content-item-icon" aria-hidden="true">
						<use xlink:href="#iconicon_conf_video_fill"></use>
					</svg>
				</div>
			</div>
		</div>

		<!-- 视频头部 -->
		<div class="videoConnection_header">
			<span @click="headerChange(1)" class="screenIcon hideScreenIcon"></span>
			<span v-if="!isFullScreen" @click="headerChange(2)" class="screenIcon bigScreenIcon"></span>
			<span v-if="isFullScreen" @click="headerChange(3)" class="screenIcon smallScreenIcon"></span>
		</div>
		<!-- 视频主体 -->
		<div class="videoConnection_body" id="videoConnectionBodyId">
			<!-- 学生 -->
			<div v-dragDirective="{ parentId: 'videoConnectionBodyId' }"
				class="videoConnection_body-screen videoConnection_body-screen-student"
				:class="{ 'videoConnection_body-smallScreen': isSmallSmallScreen }"
				id="videoConnectionBodySmallScreenStudentId">
				<div 
					class="videoConnection_body-screen-item"
					@mousedown="changeScreenSizeMousedown(false)"
					@mouseup="changeScreenSizeMouseup(false)">
					<common-room-video-item v-if="stuStreamList.length" :stream="stuStreamList[0]" />
					<!-- 学生 -->
					<div v-if="myCameraStatus == 1"
						class="videoConnection_body-screen-item-video" style="background-color: unset;">
						<span class="videoConnection_body-screen-item-videoSpan">摄像头已关闭</span>
					</div>
				</div>
			</div>
			<!-- 教师 -->
			<div v-dragDirective="{ parentId: 'videoConnectionBodyId' }"
				class="videoConnection_body-screen videoConnection_body-screen-teacher"
				:class="{ 'videoConnection_body-smallScreen': !isSmallSmallScreen }"
				id="videoConnectionBodySmallScreenTeacherId">
				<div class="videoConnection_body-screen-item" @mousedown="changeScreenSizeMousedown(true)"
					@mouseup="changeScreenSizeMouseup(true)">

					<common-room-video-item v-if="!teacherLinking && teacherStream && teacherStream.streamID" :stream="teacherStream" />

					<div v-if="teacherLinking" class="videoConnection_body-screen-item-video">
						<span class="videoConnection_body-screen-item-videoSpan">督导师处理问题中...</span>
					</div>
					<!-- 教师共享 -->
					<!-- <common-room-video-item v-if="teacherStream && teacherStream.user && shareListTemp[teacherStream.user.uid]" :stream="shareListTemp[teacherStream.user.uid]" /> -->
					 
					<!-- 连线对方，等待对方接听 -->
					<div v-if="promoter == 'student' && connectionStatus == 2"
						class="videoConnection_body-screen-item-await">
						等待接听
					</div>
					<!-- ，对方未开启摄像头 !otherOpenCamera && !(teacherStream && teacherStream.user && shareListTemp && shareListTemp[teacherStream.user.uid])-->
					<div v-if="!teacherLinking && teacherStream && !teacherStream.isVideoOpen"
						class="videoConnection_body-screen-item-video">
						<span class="videoConnection_body-screen-item-videoSpan">对方未开启摄像头</span>
						<div class="videoConnection_body-screen-item-videoIconBox">
							<svg class="iconfont videoConnection_body-screen-item-videoIcon" aria-hidden="true">
								<use :xlink:href="connectionStatus == 1 && teacherStream && teacherStream.user && teacherStream.user.mic == 2  && audioStreamData && audioStreamData[teacherStream.user.uid || teacherStream.user.userID] && audioStreamData[teacherStream.user.uid || teacherStream.user.userID].streamID ? '#iconmaikefeng' : '#iconguanbimaikefeng'"></use>
							</svg>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import commonRoomVideoItem from '../commonLive/common-room-video-item.vue'
import commonRoomAudioItem from '../commonLive/common-room-audio-item.vue';
import commonRoomControllerFeature from '../commonLive/common-room-controller-feature.vue'
export default {
	name: 'videoConnection',
	components: { commonRoomVideoItem, commonRoomAudioItem, commonRoomControllerFeature },
	props: {
		// 是否隐藏屏幕  true：隐藏 false：显示
		isHideScreen: {
			type: Boolean,
			default: false
		},
		// 连线状态 0：未连线 1：连线中 2：连线请求中  
		connectionStatus: {
			type: Number | String,
			default: 0
		},
		// 连线发起者  student：学生 teacher：教师 默认是student
		promoter: {
			type: String,
			default: 'student'
		},
		// 对方是否开启摄像头  false：未开启 true：开启   默认是true
		otherOpenCamera: {
			type: Boolean,
			default: true
		},
		myMicStatus: { // 我的麦克风状态 1：关闭 2：开启
			type: Number,
			default: 2
		},
		myCameraStatus: { // 我的麦克风状态 1：关闭 2：开启
			type: Number,
			default: 2
		},
	},
	inject: ['thisParent', 'zegoLiveRoom'],
	provide() {
		return {
			commonVideoRoomThis: this,
		}
	},
	data() {
		return {
			isFullScreen: false, // 是否全屏
			isSmallSmallScreen: false, // 是否是小小小屏
			clickDownUpTime: 0, // 点击按下和抬起的时间间隔，300ms内为点击，否则为拖拽
			eleContainerLeft: 0, // 容器左边位置缓存
			eleContainerTop: 0, // 容器顶部位置缓存

			sudentVideoStatus: true, // 学生摄像头  false：未开启 true：开启   
			teacherVideoStatus: true, // 教师摄像头  false：未开启 true：开启 
		
			share: false, // 是否开启共享， share => false,非共享，=> true 共享
			user: null,
			streamID: '', // 共享流ID


			memberList    : [],    // 连麦成员列表
			teacherStream : {},  // 老师流, 老师默认占一个麦位，创建一条默认无数据流
			stuStreamList : [],  // 学生流列表
			classScene: this.thisParent.liveRoomParams.classScene || 1, 
			teacherMikeState: false, // 教师麦克风状态
			autoMannedTimer: null, // 定时器
			autoMannedNum: 6,
			teacherLinking: false, // 教师正在连线其他同学 false => 未连线 true => 已经连线
		};
	},
	computed: {
		streamList() {
			return this.zegoLiveRoom.streamList
		},

		shareListTemp() {
            return this.zegoLiveRoom.shareList ? JSON.parse(JSON.stringify(this.zegoLiveRoom.shareList)) : null
        },
		audioStreamData() {
			
            return this.zegoLiveRoom.audioStreamData? JSON.parse(JSON.stringify(this.zegoLiveRoom.audioStreamData)) : null 
        },
		IMRecvData() {
			return this.zegoLiveRoom.IMRecvInfo;
		}
	},
	watch: {
		share(val){
			this.$emit('shareChange', val)
		},
		streamList: function(newList) {
			const memberList = this.memberList.slice()
			this.makeTeacherStream(newList, memberList)
			this.makeStuStreamList(newList, memberList)
		},
		memberList: function(newList) {
			const streamList = this.streamList.slice()
			this.makeTeacherStream(streamList, newList)
			this.makeStuStreamList(streamList, newList)
		},
		connectionStatus(val) {
			if(this.promoter == 'teacher' && val == 2){
				this.autoMannedNum = 6;
				this.autoMannedhandle();
			}else {
				if(this.autoMannedTimer){
					clearTimeout(this.autoMannedTimer);
					this.autoMannedTimer = null;
				}
			}
		},
		IMRecvData: function(newData) {
			if (newData) {
				const {toUser, command, fromUser, startTime } = newData;
				let { callType, teacherMikeState, status } = command || {};
				if(callType == 9 && toUser.role == 2){
					//教师端麦克风状态变化消息

					// console.warn('teacherMikeState', teacherMikeState);
					this.teacherMikeState = teacherMikeState;
				} else if(callType == 20){
					
					//教师端 连线其他学生通知
					this.teacherLinking = status == 1 ? true : false;
				}
			}
            
		} 
	},
	created() {
	},
	mounted(){
		
		const { roomId, userID, userName, role } = this.thisParent.liveRoomParams.USER_INFO;

		this.zegoLiveRoom.$http.init({ roomId, uid: userID, name: userName, role }); // 初始化,监听房间人数等信息变化
		this.teacherStream = { 
			streamID: '', 
			user: { 
				role: this.thisParent.liveRoomParams.ROLE_TEACHER
			} 
		}
		// this.handleCreateStream();
		// 监听教师端开始共享
		BUS.$on('startShare', this.pullVideo);

		BUS.$on('roomAttendeesChange', this.onRoomAttendeesChange)
    	BUS.$on('userStateChange', this.onUserStateChange)
		BUS.$on('screenShareEnded', this.screenShareEnded)
	},

	methods: {
		autoMannedhandle(){
			if(this.autoMannedTimer){
				clearTimeout(this.autoMannedTimer);
				this.autoMannedTimer = null;
			}
			if(this.autoMannedNum > 0){

				this.autoMannedTimer = setTimeout(() => {
					this.autoMannedNum--;
					if(this.autoMannedNum <= 0){
						this.autoMannedNum = 0;
						this.requestChange(1);
					}
					clearTimeout(this.autoMannedTimer);
					this.autoMannedTimer = null;
					this.autoMannedhandle();
				}, 1000);
			}
		},
		// 共享中断
		screenShareEnded() {
			this.share = false;
		},
		/**
		 * 根据传入的布尔值切换屏幕尺寸标记 仅点击小小屏幕切换
		 */
		changeScreenSize(val) {
			let eleStudent = document.getElementById('videoConnectionBodySmallScreenStudentId');
			let eleTeacher = document.getElementById('videoConnectionBodySmallScreenTeacherId');
			if (val && !this.isSmallSmallScreen) {
				this.isSmallSmallScreen = true;
				// 保证切换时学生和老师的小小屏位置一致
				eleStudent.style.left = eleTeacher.style.left;
				eleStudent.style.top = eleTeacher.style.top;
			} else if (!val && this.isSmallSmallScreen) {
				this.isSmallSmallScreen = false;
				// 保证切换时老师和学生的小小屏位置一致
				eleTeacher.style.left = eleStudent.style.left;
				eleTeacher.style.top = eleStudent.style.top;
			}
		},
		/**
		 * 鼠标按下的事件，用于判断是点击还是拖拽切换小小屏大小
		 */
		changeScreenSizeMousedown(val) {
			this.clickDownUpTime = new Date().getTime();
		},
		/**
		 * 鼠标抬起的事件，用于判断是点击还是拖拽切换小小屏大小
		 */
		changeScreenSizeMouseup(val) {
			let time = new Date().getTime();
			if (time - this.clickDownUpTime < 300) {
				this.clickDownUpTime = 0;
				this.changeScreenSize(val);
			}

		},
		/**
		 * 视频头部的操作事件，用于切换屏幕大小和全屏、隐藏
		 */
		headerChange(type) {
			if (type === 1) {
				// 隐藏
				this.$emit('hideScreen');
			} else if (type === 2) {
				// 全屏
				// console.log(888, this.isFullScreen);

				this.isFullScreen = true;
				// 全屏时，记录一下整个盒子位置
				// let eleContainer = document.getElementById('videoConnectionContaimerId');
				// this.eleContainerLeft = eleContainer.style.left;
				// this.eleContainerTop = eleContainer.style.top;

				// 全屏时，重置小小屏的位置
				if (this.isSmallSmallScreen) {
					let eleStudent = document.getElementById('videoConnectionBodySmallScreenStudentId');
					eleStudent.style.right = '0.15rem';
					eleStudent.style.top = '0.1rem';
				} else {
					let eleTeacher = document.getElementById('videoConnectionBodySmallScreenTeacherId');
					eleTeacher.style.right = '0.15rem';
					eleTeacher.style.top = '0.1rem';
				}

			} else if (type === 3) {
				// console.log(999, this.isFullScreen);
				
				// 退出全屏
				this.isFullScreen = false;
				// 退出全屏时，保证小小屏的位置正确，不会超出父级盒子
				if (this.isSmallSmallScreen) {
					let eleStudent = document.getElementById('videoConnectionBodySmallScreenStudentId');
					eleStudent.style.top = '0.15rem';
					eleStudent.style.left = '2.96rem';
				} else {
					let eleTeacher = document.getElementById('videoConnectionBodySmallScreenTeacherId');
					eleTeacher.style.top = '0.15rem';
					eleTeacher.style.left = '2.96rem';
				}
				// 退出全屏时，重置位置，恢复到原来的位置（此处用的是固定值）
				let eleContainer = document.getElementById('videoConnectionContaimerId');
				eleContainer.style.left = 'calc(100% - 5.69rem)';
				eleContainer.style.top = 'calc(100% - 3.34rem)';
				// 可使用记录的位置，恢复到原来的位置
				// eleContainer.style.left = this.eleContainerLeft;
				// eleContainer.style.top = this.eleContainerTop;
			}
		},
		/**
		 * 连线请求0：挂断、1：接通
		 */
		async requestChange(val) {
			if(this.autoMannedTimer){
				clearTimeout(this.autoMannedTimer);
				this.autoMannedTimer = null;
			}
			this.$emit('requestChange', val);
			// let userList = this.zegoLiveRoom.userList;
			// 	let temp = userList.find(item => !item.isMe);
			let teacherUid = localStorage.getItem('teacherUid') || null;
			if(!teacherUid) return;

				// 向教师发送信令 开始连线 （突然退出房间 也是挂断）
				// 	command: {
				// 	callType: 2,  // 2: 学生接收，教师发起
				// 	status: 1,  // 1、接听 2、挂断
				// }

				if(val == 1){
					// let {role, userID} = this.thisParent.liveRoomParams.USER_INFO;
					// this.zegoLiveRoom.handleDeviceStateChange('audio', false, this.myMicStatus == 1 ? false : true);	
					const fn = () => {
						this.zegoLiveRoom.handleDeviceStateChange('audio', false, true);
					}
					if(this.myMicStatus == 2){
						fn()
					}else {
						BUS.$emit('openDeviceHandele', 2, fn);
					}
				}else if(val == 0){
					this.zegoLiveRoom.stopAudioPublishingStream(this.zegoLiveRoom.publishAudioStreamId)
				}
				const userInfo =  this.thisParent.liveRoomParams.USER_INFO || {}	
				await this.zegoLiveRoom.client.express('sendCustomCommand', JSON.stringify({callType: 2, status: val == 1 ? 1 : 4 , myMicStatus: this.myMicStatus, platformType: userInfo.platformType || ''}), [teacherUid])
		},

		/***********************************************************/
		/**
		 * 拉流监听
		 */
		playerStateUpdate() {
			const _this = this;
			// 监听开始共享
			this.zegoLiveRoom.shareClient.on('playerStateUpdate', (result) => {
				// console.log(result, '拉流状态回调')
				if (result.state == 'NO_PLAY') {
				_this.share = false;
				} else {
				_this.share = true;
				}
				
				
			});
			// 监听开始共享
			this.zegoLiveRoom.shareClient.on('playQualityUpdate', (streamID, stats) => {
				// console.log(streamID, stats, '拉流质量回调')
				_this.share = true;
				
			});

			// 监听停止共享
			this.zegoLiveRoom.shareClient.on('screenSharingEnded', (res) => {
				alert(1)
			// console.log(res, '监听停止共享监听停止共享监听停止共享')
			_this.zegoLiveRoom.shareClient.stopPublishingStream(_this.streamID);
			_this.zegoLiveRoom.shareClient.stopPlayingStream(_this.streamID);
			const dom = document.querySelector('.main-mid');
			_this.zegoLiveRoom.shareClient.removeElementVideo(dom);
			_this.share = false;
			_this.streamID = '';

			
			// 结束共享屏幕时，开始白板录制
			// _this.zegoWhiteboardArea.shareWhiteboard();

		});
		},

		/**
		 * 停止拉流
		 */
		screenSharingEndedHandler() {
			const _this = this;
			if (!_this.streamID) return;
			_this.zegoLiveRoom.shareClient.stopPublishingStream(_this.streamID);
			_this.zegoLiveRoom.shareClient.stopPlayingStream(_this.streamID);
			const dom = document.querySelector('.main-mid');
			_this.zegoLiveRoom.shareClient.removeElementVideo(dom);
			_this.share = false;
		},
		
		
		/**
		 * @desc 教师端本地展示共享页面
		 * @returns {Promise<void>}
		 */
		async pullVideo(streamID) {
			// tip:如果是本端拉自己的流则直接预览即可，如果是要拉对端的流则使用startPlayingStream播放流
			const dom = document.querySelector('.main-mid');
			this.streamID = streamID;
			this.zegoLiveRoom.shareClient.startPreview(streamID, dom);
			this.share = true;

			// 监听停止共享
			this.playerStateUpdate(); 
		},

		/**
		 * 学生端通过流ID获取远端流
		 */
		async shareHandler(item) {
			this.streamID = item.streamID;
			const dom = document.querySelector('.main-mid');
			if (!dom) {
				setTimeout(() => {
				this.shareHandler(item)
				}, 200);
				return
			}
			await this.zegoLiveRoom.shareClient.startPlayingStream(this.streamID, {}, dom);
			// 拉流监听
			this.playerStateUpdate();
		},

		/***********************************************************/
  		/**
		 * @desc 房间成员列表变化监听
		 */    
		onRoomAttendeesChange(res) {
			// BUS.$emit('roomAttendeesChange', res)
			this.$set(this, 'memberList', res);
			this.$emit('setStuDevice');
		},
		/**
		 * @desc 成员 摄像头/麦克风/共享权限 状态变化监听
		 */
		onUserStateChange(users, local) {
			if (!local) {
				this.memberList.forEach(v => Object.assign(v, users[v.uid]))
				this.memberList = [...this.memberList]
			}
		},

		/**
		 * @desc  获取老师流
		 * @param {streamList} 音视频sdk原始成员流
		 * @param {memberList} 后台返回房间成员列表
		 */
		makeTeacherStream(streamList, memberList) {
			if (!memberList.length) return;
			let teacherUser = memberList.find(v => v.role == 1) || null;
			let UID = teacherUser && teacherUser.uid || null; 
			let stream = streamList.find(v => v.user && (v.user.uid == UID || v.user.userID == UID)) || null;

			const teacherStream = this.teacherStream
			if (!UID || !stream) {
				teacherStream.user = memberList[0]
				teacherStream.isVideoOpen = false
				teacherStream.isAudioOpen = false
				teacherStream.streamID = ''
				this.$set(this, 'teacherStream', teacherStream);
				this.$emit('setUserStrem', stream, 'teacherStrem');
				return
			}

			stream.user = { ...stream.user, ...teacherStream.user, ...teacherUser };

			this.$emit('setUserStrem', stream, 'teacherStrem');
			this.$set(this, 'teacherStream', stream)
		},
		/**
		 * @desc  获取学生流列表
		 * @param {streamList} 音视频sdk原始成员流
		 * @param {memberList} 后台返回成员成员列表
		 */
		makeStuStreamList(streamList, memberList) {
			let arr = []
			let stream =  streamList.find(v => v.user && v.user.isMe) || {};
			let userID = stream.user && (stream.user.userID || stream.user.uid) || '';
			let user = memberList.find(v => v.uid == userID) || {};
			if (stream) {
				stream.user = { ...(stream.user || {}), ...user }
				arr.push(stream)
			} else {
				arr.push({ streamID: '', user: user })
			}
			this.$emit('setUserStrem', arr[0], 'stuStrem');
			this.$set(this, 'stuStreamList', arr);
			arr = null
		},

		async handleCreateStream() {
			// 已经再共享屏幕直接退出
			if (this.share) return;
			await this.zegoLiveRoom.shareClient.destroyStream();
			this.createStream = null;
			const option = {
				screen: {
				//@ts-ignore
				audio: false,
				videoQuality: 4,
				bitrate: 2000,
				frameRate: 10,
				width: 1920,
				height: 1080
				}
			}
			// 检测浏览器是否支持共享
			const isShare  = await this.zegoLiveRoom.shareClient.checkAnRun(true);
			if (!isShare) return;
			this.createStream = await this.zegoLiveRoom.shareClient.express('createStream', option);
			if (this.createStream) {
				this.share = true;
				const { user } = zegoClient.getState('user')
				const streamID = `share_${user.userID}_${Date.parse(new Date())}`;

				await this.zegoLiveRoom.shareClient.express('startPublishingStream', streamID, {})
				
				// BUS.$emit('startShare', streamID)
				this.pullVideo(streamID)


			} else {
				this.share = false;
			}
			
			},

	},
	destroyed() {
		BUS.$off('roomAttendeesChange', this.onRoomAttendeesChange)
    	BUS.$off('userStateChange', this.onUserStateChange)
		BUS.$off('screenShareEnded', this.screenShareEnded)

	}
};
</script>

<style scoped lang="less">
.videoConnection {
	width: 4.5rem;
	height: 3.04rem;
	position: fixed;
	display: flex;
	flex-direction: column;
	cursor: pointer;
	z-index: 2000;
	background-color: #FFF;
	.videoConnection_request {
		position: absolute;
		top: 0.4rem;
		left: 0;
		width: 100%;
		height: calc(100% - 0.4rem);
		background-color: rgba(0, 0, 0, 0.7);
		z-index: 11;

		.videoConnection_request-title {
			position: absolute;
			top: 0.38rem;
			left: 0.28rem;
			font-size: 0.16rem;
			color: #FFFFFF;
		}

		.videoConnection_request-title2{
			position: absolute;
			width: 100%;
			top: 1rem;
			left: 0;
			font-size: 0.18rem;
			color: #FFFFFF;
			text-align: center;
		}

		.videoConnection_request-content {
			width: 100%;
			height: 100%;
			display: flex;
			justify-content: center;
			align-items: center;

			.videoConnection_request-content-item {
				width: 0.56rem;
				height: 0.56rem;
				display: flex;
				justify-content: center;
				align-items: center;
				background-color: #FF3B30;
				border-radius: 0.28rem;
				cursor: pointer;
				margin-top: 1rem;

				.videoConnection_request-content-item-icon {
					width: 0.36rem;
					height: 0.36rem;
					fill: #FFFFFF;
				}
			}

			.videoConnection_request-content-item:last-child {
				background-color: #396CFF;
				margin-left: 1rem;

			}
		}
	}

	.videoConnection_header {
		width: 100%;
		height: 0.4rem;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		background-color: #09153D;

		.screenIcon {
			display: inline-block;
			margin-right: 0.3rem;
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
	}

	.videoConnection_body {
		width: 100%;
		flex: 1;
		height: 0;
		position: relative;

		.videoConnection_body-screen-student {
			.videoConnection_body-screen-item {
				background-color: #404040;
			}
		}

		.videoConnection_body-screen-teacher {
			.videoConnection_body-screen-item {
				background-color: #272727;
			}
		}

		.videoConnection_body-screen {
			width: 100%;
			height: 100%;
			// background-color: #808080;

			.videoConnection_body-screen-item {
				width: 100%;
				height: 100%;

				.videoConnection_body-screen-item-await {
					width: 100%;
					height: 100%;
					position: absolute;
					top: 0;
					left: 0;
					display: flex;
					justify-content: center;
					align-items: center;
					position: absolute;
					width: 100%;
					height: 100%;
					background-color: rgba(0, 0, 0, 0.7);
					font-size: 0.14rem;
					color: #FFFFFF;
					z-index: 9;
				}

				.videoConnection_body-screen-item-video {
					width: 100%;
					height: 100%;
					position: absolute;
					top: 0;
					left: 0;

					display: flex;
					justify-content: center;
					align-items: center;
					background-color: rgba(39, 39, 39, 1);

					.videoConnection_body-screen-item-videoSpan {
						font-size: 0.12rem;
						color: rgba(255, 255, 255, 0.8);
					}

					.videoConnection_body-screen-item-videoIconBox {
						display: flex;
						justify-content: center;
						align-items: center;
						position: absolute;
						bottom: 0;
						left: 0;
						width: 0.2rem;
						height: 0.2rem;
						background-color: rgba(0, 0, 0, 0.7);
					}

					.videoConnection_body-screen-item-videoIcon {
						width: 0.15rem;
						height: 0.15rem;
						fill: #FFFFFF;
					}
				}
			}
		}

		.videoConnection_body-smallScreen {
			position: absolute;
			top: 0.15rem;
			right: 0.1rem;
			width: 1.44rem;
			height: 0.84rem;
			background-color: #FFFFFF;
			z-index: 9;
		}
	}
}

.videoConnectionSmall {
	// bottom: 0.3rem;
	// right: 1.19rem;
	top: calc(100% - 3.34rem);
	left: calc(100% - 5.69rem);
}

.videoConnectionFull {
	width: 100vw;
	height: 100vh;
	top: 0 !important;
	left: 0 !important;
	z-index: 10086;
	// animation: alternate 0.5s ease-in-out;
}

// @keyframes alternate {
// 	from {
// 		width: 4.5rem;
// 		height: 3.04rem;
// 		top: 100vh !important;
// 		left: 100vw !important;
// 	}

// 	to {
// 		width: 100vw;
// 		height: 100vh;
// 		top: 0 !important;
// 		left: 0 !important;
// 	}
// }

.hideScreen {
	visibility: hidden;
}
</style>