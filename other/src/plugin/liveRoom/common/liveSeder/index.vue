<template>
  	<div class="liveSeder">
			<div class="liveSeder-content">
				<div class="trapezoid_box">
					<trapezoid 
						color="#040D2E"
						rightWidth="0.24"
						height="1.18"
					>
					<template>
						<div class="trapezoid_box-content" @click="closeRight">
							<span class="trapezoid_box-content-text">收起</span>
						</div>
					</template>
				</trapezoid>
				</div>
				<!-- 督导中 麦克风 摄像头 连线督导 -->
				<div class="seder_panel">
					<div 
						class="seder_panel-content" 
						v-for="item in sederPanelList" 
						:key="item.id" 
						@click="deviceChangeClick(item)"
					>
						<border-item
							width="auto" 
							:borderColor="colors[item.type].borderColor" 
							:cornerColor="colors[item.type].cornerColor"
							:backgroundColor="colors[item.type].backgroundColor"
							:showOtherCorner="true"
							:cornerWidth="'0.03rem'"
							:cornerHeight="'0.03rem'"
						>
						<template>
							<div class="seder_panel-content-item">
								<!-- <span style="color: #FFF">{{ myCameraStatus }}</span> -->
								<!-- 可根据摄像头状态、麦克风状态、连线状态监听动态改变 type值-->
								<svg 
									class="iconfont seder_panel-content-item-icon" aria-hidden="true" 
									:style="{ 'fill': colors[item.id == 4 && connectionStatus != 0 ? 'c3' : item.type].iconColor}"
								>
									<!-- 督导中/弹出窗口 -->
									<use v-if="item.id == 1" xlink:href="#icondudao"></use>
									<!-- 麦克风 -->
									<use v-if="item.id == 2" :xlink:href="myMicStatus == 1 ? '#iconguanbimaikefeng' : '#iconmaikefeng'"></use>
									<!-- 摄像头 -->
									<use v-if="item.id == 3" :xlink:href=" myCameraStatus == 1 ? '#iconguanbishipintonghua' : '#iconshipintonghua'"></use>
									<!-- 连线/挂断 -->
									<use v-if="item.id == 4" :xlink:href="connectionStatus == 0 ? '#iconicon_conf_video_fill' : '#iconguaduan'"></use>
									<!-- 共享屏幕 -->
									<use v-if="item.id == 5" xlink:href="#icon-s-gongxiangpingmu"></use>
								</svg>
								<span v-if="item.id == 1" class="seder_panel-content-item-title" :style="{ color: colors[ item.type].textColor }">{{ !isHideScreen ? '督导中' : '弹出窗口' }}</span>
								<span v-if="item.id == 2" class="seder_panel-content-item-title" :style="{ color: myMicStatus == 2 ? colors[ item.type].textColor : '#005895' }">{{ myMicStatus == 2 ? '麦克风' : '已关闭' }}</span>
								<span v-if="item.id == 3" class="seder_panel-content-item-title" :style="{ color:  myCameraStatus == 2 ? colors[ item.type].textColor : '#005895' }">{{ myCameraStatus == 2 ? '摄像头' : '已关闭' }}</span>
								<span v-if="item.id == 4" class="seder_panel-content-item-title" :style="{ color: colors[connectionStatus != 0 ? 'c3' : item.type].textColor }">{{connectionStatus != 0 ? '挂断' : '连线'}}</span>
								<span v-if="item.id == 5" class="seder_panel-content-item-title" :style="{ color: colors[ item.type].textColor }">{{isShare ? '共享中' : '共享屏幕'}}</span>

							</div>
						</template>
						</border-item>
					</div>
				</div>
				<!-- 退出 -->
				<div class="seder_exit" @click="exitLive">
					<div class="seder_panel-content">
						<border-item
							width="auto" 
							borderColor="rgba(4, 13, 46, 0)" 
							cornerColor="rgba(4, 13, 46, 0)"
							backgroundColor="rgba(4, 13, 46, 0.5)"
							:cornerWidth="'0.03rem'"
							:cornerHeight="'0.03rem'"
						>
						<template>
							<div class="seder_panel-content-item">
								<svg 
								class="iconfont seder_panel-content-item-icon" 
								aria-hidden="true" 
								style="fill: #F33434 ">
									<use xlink:href="#icontuichu"></use>
								</svg>
								<span 
									class="seder_panel-content-item-title" 
									style=" color: #F33434 "
								>退出督导</span>
							</div>
						</template>
						</border-item>
					</div>
				</div>

			</div>

		</div>
</template>

<script>
import trapezoid from '../trapezoid/index.vue'
import borderItem from '../borderItem/index.vue'
export default {
	components: {
		trapezoid,
		borderItem
		// // 梯形
		// trapezoid: () => import('../trapezoid/index.vue'),
		// // 边框
        // borderItem: () => import('../borderItem/index.vue'),

	},
	props: {
		mySupervisonStatus: { // 我的督导状态 0：关闭 1：开启
			type: Number,
			default: 0,
		},
		myMicStatus: { // 我的麦克风状态 1：关闭 2：开启
			type: Number,
			default: 0,
		},
		myCameraStatus: { // 我的摄像头状态 1：关闭 2：开启
			type: Number,
			default: 0,
		},
		connectionStatus: { // 连线状态 0：未连线 1：连线中 2：连线请求中
			type: Number,
			default: 0,
		},
		// 是否隐藏屏幕  true：隐藏 false：显示
		isHideScreen: {
			type: Boolean,
			default: false
		},
		// 是否共享
		isShare:{
			type: Boolean,
			default: false
		}
	},
	inject: ['thisParent', 'zegoLiveRoom'],
	data () {
		return {
			sederPanelList: [
				{ id: 1, type: 'c1', label: 'mySupervisonStatus' },
				{ id: 2, type: 'c1', label: 'myMicStatus', name: 'mic' },
				{ id: 3, type: 'c1', label: 'myCameraStatus', name: 'camera' },
				// { id: 5, type: 'c1', label: 'share' },
				{ id: 4, type: 'c2', label: 'connectionStatus' },
			],
			// 颜色配置信息
			colors: {
				c1: {
					borderColor: '#002E90',// 边框颜色
					cornerColor: '#08F9FF',// 边框圆角颜色
					backgroundColor: 'rgba(4, 13, 46, 0.5)',// 背景颜色
					textColor: '#419AFF',// 文字颜色
					iconColor: '#0794FF'// 图标颜色
				},
				c2: {
					borderColor: '#3E3B23',
					cornerColor: '#FFFFFF',
					backgroundColor: 'rgba(4, 13, 46, 0.5)',
					textColor: '#F8C70B',
					iconColor: '#F8C70B'
				},
				c3: {
					borderColor: '#FF3B30',
					cornerColor: '#FF3B30',
					backgroundColor: 'rgba(255, 59, 48, 0.5)',
					textColor: '#FF3B30',
					iconColor: '#FF3B30'
				}
			},
			timeOut: 30 * 1000, // 连线超时时间
			callTimer: null, // 计时器
			callType: 1, // 呼叫类型 1：学生发起， 2：教师发起
			teacherUid: '', // 教师uid
			shareStream: null, // 共享流
			shareStreamId: null,
			isStartShare: false, // 是否开始共享
			isTeacherOnline: false, // 教师是否在线
			teacherLeaveTimer: null, // 教师离开计时器, 监听是否刷新， 否则挂断
		}
	},
	computed: {
		IMRecvData() {
			return this.zegoLiveRoom.IMRecvInfo;
		}
	},
	watch: {
		IMRecvData(newVal) {
			// this.isTeacherOnline = true;
			// debugger
			if (newVal) {
				const {toUser, command, fromUser, startTime } = newVal;
				this.callType = 1; // 呼叫类型 1：学生发起， 2：教师发起， 20：教师广播
				if(toUser.role == 2){
					if(fromUser && fromUser.userID){
						this.isTeacherOnline = true;
					}
					// status, // // 呼叫 连接状态 1、已接通（时长）2、挂断  3、超时  4、已取消 5、对方占线中
					let { callType, status, oldCallType } = command || {};
					this.callType = callType;
					if(!callType)return;
					if(callType == 1){
				
						// if(status == 1){
						// 	// this.connectionStatus = 1; // 已接通
						// 	this.$emit('studentDeviceChange', {id: 4}, 1)
	
						// }else {
						// 	// this.connectionStatus = 0; // 未连线
						// 	this.$emit('studentDeviceChange', {id: 4}, 0)
	
						// }

					}else if(callType == 2){
						// 教师发起
						if(status == 0){
							// 教师连麦请求
							// this.$message.info('教师来发起连线了');
							localStorage.setItem('callOutTime', new Date().getTime());
						}
						this.$emit('setStuStatus', status, true)
					}else if(callType == 3){
						// 我方发起 对方返回信令通知状态
						if(this.callTimer){
							clearTimeout(this.callTimer);
							this.callTimer = null;
						}
						if(status == 5){
							// this.connectionStatus = 0; // 未连线
							this.$emit('studentDeviceChange', {id: 4}, 0);
							this.$message.error('对方占线中');
						}else if(status == 6){ // 对方接通
							this.$emit('studentDeviceChange', {id: 4}, 1);
							// 对方遮罩层接听
							// this.$message.success('对方已接听');
							// this.zegoLiveRoom.createAudioPushStream()	
							// this.zegoLiveRoom.handleDeviceStateChange('audio', false, this.myMicStatus == 1 ? true : false, this.myCameraStatus == 1 ? false: true);	
							const fn = () => {
								this.zegoLiveRoom.handleDeviceStateChange('audio', false, true);
							}
							if(this.myMicStatus == 2){
								fn()
							}else {
								BUS.$emit('openDeviceHandele', 2, fn);
							}
						
						}else if(status == 7){ // 未接通挂断
							this.$emit('studentDeviceChange', {id: 4}, 0);
							// 对方遮罩层挂断
							// this.$message.success('对方已挂断');
						}else if(status == 8){ //
							// 连线中对方挂断，需要清理推送的音频流
							// this.$message.success('对方挂断连线');
							this.zegoLiveRoom.stopAudioPublishingStream(this.zegoLiveRoom.publishAudioStreamId)
							this.$emit('studentDeviceChange', {id: 4}, 0);	
						}
					}else if(callType == 5){
						// 教师刷新 接收的询问信令
						if(status == 0){
							// 重启连线中
							this.$emit('setStuStatus', status)
						}else if(status == 1){
							// 教师那边学生还是处于连线中，询问学生这边是否还在连线中
							if(this.connectionStatus != 1){
								// this.$message.info('学生已挂断');
								// 学生不在线，发送挂断信令
								this.zegoLiveRoom.client.express('sendCustomCommand', JSON.stringify({callType: oldCallType || 2, status: 2, myMicStatus: this.myMicStatus, ...this.setPlatformType()}), [fromUser.userID])
							}else {
								// 学生这边还在连线中，教师这边也在连线中 不处理
							}
						
						}
						
					}else if(callType == 6){
						// 学生刷新 发送询问信令后，教师回复的信令
						if(status == -1){
							// 学生在教师端显示不在线
							this.$emit('studentDeviceChange', {id: 4}, 0);
							this.zegoLiveRoom.stopAudioPublishingStream(this.zegoLiveRoom.publishAudioStreamId)
						}else{
							this.$emit('setStuStatus', status)
							if(status == 2 || status == 3){
								this.zegoLiveRoom.stopAudioPublishingStream(this.zegoLiveRoom.publishAudioStreamId)
							}else if(status == 1){
								// if(this.myMicStatus == 2){

								// 	this.zegoLiveRoom.handleDeviceStateChange('audio', false, true);
								// }
							}
						}
					}else if(callType == 7){
						// 教师端结束直播间,学生自动挂断并退出
						// this.$emit('studentDeviceChange', {id: 4}, 0);
						// this.$message.error('老师已结束直播间');
						// this._exitLive();
					}else if(callType == 8){
						// platformType 平台类型

						// 教师询问学生进入直播间的姓名
						this.zegoLiveRoom.client.express('sendCustomCommand', JSON.stringify({callType: 8, status: -1,  myMicStatus: this.myMicStatus, ...this.setPlatformType()}), [this.teacherUid])

					}
				}
			}
		},
		// 监听教师id
		teacherUid: {
			handler(value) {
				if(value){
					this.zegoLiveRoom.client.express('sendCustomCommand', JSON.stringify({callType: 8, status: -1,  myMicStatus: this.myMicStatus, ...this.setPlatformType()}), [this.teacherUid])
				}
			},
			immediate: true
		}
	},
	created () {
		this.timeOut = this.thisParent.liveRoomParams.TIME_OUT;
		// this.deviceChangeClick = debounce(this.deviceChange, 500, true);
		let teacherUid = localStorage.getItem('teacherUid') || null;
		this.teacherUid = teacherUid;
		if(teacherUid){
			if(this.connectionStatus == 2){
				let callOutTime = localStorage.getItem('callOutTime') || null;
				if(callOutTime){
					let nowTime = new Date().getTime();
					// let time = (nowTime - callOutTime) >= this.timeOut ? 10 : (nowTime - callOutTime);
					if((nowTime - callOutTime) >= this.timeOut){
						this.setLongTimeDeal([teacherUid], 10)
					}
				}
			}
			//刷新时询问教师自己的状态
			this.zegoLiveRoom.client.express('sendCustomCommand', JSON.stringify({callType: 5, status: 9, ...this.setPlatformType()}), [this.teacherUid])

			//发给教师一个信令
			this.zegoLiveRoom.client.express('sendCustomCommand', JSON.stringify({callType: 8, status: -1,  myMicStatus: this.myMicStatus, ...this.setPlatformType()}), [this.teacherUid])
		}
		BUS.$on('roomAttendeesChange', this.onRoomAttendeesChange);
		BUS.$on('setShareStrem', this.onSetShareStrem);
		// 房间成员减少，学生端主要检测老师是否退出房间
		BUS.$on('userOnlineRoomChange', this.userOnlineRoomChange)
		
	},
	mounted () {
		// let userList = this.zegoLiveRoom.userList;

	},
	methods: {

		setPlatformType() {
			const userInfo =  this.thisParent.liveRoomParams.USER_INFO || {}	
			return {platformType: userInfo.platformType || ''}
		}, 


		// 房间成员减少，学生端主要检测老师是否退出房间 刷新也会执行
		userOnlineRoomChange(updateType, userList, role){
			// isTeacherOnline
			let teacherUid = localStorage.getItem('teacherUid') || null;
			if(role == 2){
				if(updateType == 'ADD'){
					if(!this.thisParent.isRefresh){
						let teacher = userList.find(item => item.userID == teacherUid)
						if(teacher && (teacher.userID == teacherUid)){
							this.isTeacherOnline = true;
							if(this.teacherLeaveTimer){
								clearTimeout(this.teacherLeaveTimer);
								this.teacherLeaveTimer = null;
							}
						}else {
							this.isTeacherOnline = false;
						}
					}else {
						if(teacherUid == userList[0].userID){
							this.isTeacherOnline = true;
							if(this.teacherLeaveTimer){
								clearTimeout(this.teacherLeaveTimer);
								this.teacherLeaveTimer = null;
							}
						}
					}

				}else if(updateType == 'DELETE'){
					if(teacherUid == userList[0].userID){
						this.isTeacherOnline = false;
						// 检测教师离开房间， 如果在连线中 三秒内未挂断自动挂断
						if(this.connectionStatus != 0){
							this.teacherLeaveTimer = setTimeout(() => {
								this.deviceChange({ id: 4, type: 'c2', label: 'connectionStatus' });
								clearTimeout(this.teacherLeaveTimer);
								this.teacherLeaveTimer = null;
							}, 3000);
						}
					}
				}
			}
			if(!this.thisParent.isRefresh){
                this.thisParent.isRefresh = true;
            }
		},
		// 成员变化设置 // liveroom/zego/get_attendee_list
		onRoomAttendeesChange(res, teacherUser) {
			if(teacherUser && (teacherUser.userID || teacherUser.uid)){
				this.teacherUid = teacherUser.userID || teacherUser.uid;
			}else {
				this.teacherUid = '';
			}
		},
		// 分享流
		onSetShareStrem(shareStream, shareStreamId) {
			this.shareStream = shareStream;
			this.shareStreamId = shareStreamId;
		},

		/**
		 * 关闭右侧面板
		 */
		closeRight () {
			this.$emit('controlHandle', true)	
		},
		// 设备操作节流

		async deviceChangeClick(item){
			const _this = this;
			if(this.connectionStatus == 0 && (item.id == 2 || item.id == 4)){
				const {code, message} = await _this.liveHandleUserMedia(false, true);
				if(code !== '000000'){
					_this.showToast(message ,3000, 'error')
					return;
				}
			}
            _this.cmThrottle(_this, () => {
				_this.deviceChange(item)
            }, 500);
        },
		/**
		 * 打开视频屏幕面板
		 */
		async deviceChange(item){
			let connectionStatus = this.connectionStatus;
			// debugger
			let ids = this.teacherUid && [this.teacherUid] || [];
			if(item.id == 4){
				
				if(this.teacherLeaveTimer){
					clearTimeout(this.teacherLeaveTimer);
					this.teacherLeaveTimer = null;
				}

				if(this.callTimer){
					clearTimeout(this.callTimer);
					this.callTimer = null;
				}
			
				// 向教师发送信令 开始连线 （突然退出房间 也是挂断）
				// 	command: {
				// 	callType: 1,  // 1: 学生发起，教师接收为呼入
				// 	status: 0,  // 0、呼叫中 1接听、2、连麦中挂断 3、超时 4、等待连线时挂断
				// }
				// connectionStatus 0：未连线 1：连线中 2：连线请求中
				let status = -1;
				if(this.connectionStatus == 0){ 
					// 老师不在线
					if(!this.teacherUid || !this.isTeacherOnline){
						// this.$message.info('暂无老师在线，请稍后再连！');
						this.$emit('studentDeviceChange', {
							id: 4,
							connectionTip: {
								type: 1,
								content: '亲爱的同学，您的督导师正策马扬鞭赶来，<br/>请保持耐心与对知识的渴望，等待督导师的来临～'
							}
						}, 0)
						this.zegoLiveRoom.stopAudioPublishingStream(this.zegoLiveRoom.publishAudioStreamId)
						return;
					}

					// 学生连接老师，次数大于5次
					const storageStatus = this.LocalStorage.get('storageStatus') || {};
					if(storageStatus.connectionNum && storageStatus.connectionNum >= 5) {
						this.$emit('studentDeviceChange', {
							id: 4,
							connectionTip: {
								type: 2,
								content: '建议先自主学习探索哦～若多次尝试仍未解决，再联系老师一起解决！'
							}
						}, 0)
					}

					// 发起连线
					status = 0;
					connectionStatus = 2;

					// 教师接通超时处理
					this.setLongTimeDeal(ids);
				}else if(this.connectionStatus == 1){
					// 连线中 挂断
					status = 2;
					connectionStatus = 0; 
					this.zegoLiveRoom.stopAudioPublishingStream(this.zegoLiveRoom.publishAudioStreamId)
				}else if(this.connectionStatus == 2){
					// 等待连线接通中 挂断
					status = 4;
					connectionStatus = 0; 
					// if(this.callType == 2){
					// 	status = 2;
					// }
				}
				let callType = this.callType == 2 ? 2 : 1;
				await this.zegoLiveRoom.client.express('sendCustomCommand', JSON.stringify({callType: status == 0 ? 1 : callType, status: status,  myMicStatus: this.myMicStatus, exit: true, ...this.setPlatformType()}), ids)
				this.callType = 1;
				
			}else if(item.id == 2){
				// let userList = this.zegoLiveRoom.userList;
				// let temp = userList.find(item => !item.isMe);
				// console.log('status', temp);
				// let ids = temp && [temp.userID || temp.uid];
				// if(!ids.length) return;
				// // 不用了
				// await this.zegoLiveRoom.client.express('sendCustomCommand', JSON.stringify({callType: 7, status: -1,  myMicStatus: this.myMicStatus == 1 ? 2 : 1, , ...this.setPlatformType()}), ids)
			}else if(item.id == 5){
				// 开启共享屏幕
				// this.startShareGreen = true;
				BUS.$emit('startShareGreen');
			}
			this.$emit('studentDeviceChange', item, connectionStatus)
		},
		// 连线超时
		setLongTimeDeal(ids, time){
			if(this.callTimer){
					clearTimeout(this.callTimer);
					this.callTimer = null;
				}
				let outTime = new Date().getTime();
				localStorage.setItem('callOutTime', outTime);
				this.callTimer = setTimeout( () => {
					localStorage.removeItem('callOutTime');
					// 超时还在连线中自动挂断
					if(this.connectionStatus == 2){
						this.$emit('studentDeviceChange', {id: 4}, 0);
						this.zegoLiveRoom.client.express('sendCustomCommand', JSON.stringify({callType: 1, status: 3, myMicStatus: this.myMicStatus, ...this.setPlatformType()}), ids)
					}
				}, time || this.timeOut)
		},
		/**
		 * 退出督导
		 */
		exitLive() {
        	this.$confirm('确认退出房间么？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
				}).then(() => {
					// await this.$http.leaveRoom()
					this._exitLive();
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消'
					});          
				});
	
		},
	// 退出房间处理逻辑
	async _exitLive(){
			this.zegoLiveRoom.isquit = true;
			if(this.shareStreamId){
				// 停止共享流发布
				await this.zegoLiveRoom.shareClient.express('startPublishingStream', this.shareStreamId, {});
			}

			await this.zegoLiveRoom.shareClient.destroyStream();

			if(this.connectionStatus != 0){
				// 退出自动挂断
				await this.zegoLiveRoom.client.express('sendCustomCommand', JSON.stringify({callType: this.callType == 1 ? 1 : 2, status: this.connectionStatus == 1 ? 2 : 4,  myMicStatus: this.myMicStatus, ...this.setPlatformType()}), [this.teacherUid])
			}
			await this.zegoLiveRoom.client.express('stopPublishingStream', this.zegoLiveRoom.publishStreamId);
			this.$emit('studentDeviceChange', {id: 4}, 0);
			const res = await this.zegoLiveRoom.client.express('logoutRoom', this.thisParent.liveRoomParams.USER_INFO.roomId)
			console.warn('退出房间', res);
			if(!res.error){
				await this.thisParent.$http.leaveRoom()
				// BUS.$emit('openDeviceHandele', 1);
				localStorage.removeItem('callOutTime');
				localStorage.removeItem('deviceStatus');
				this.$emit('exitLive');	
			}else {
				this.zegoLiveRoom.isquit = false;
			}
		}
	},
	beforeDestroy () {
		this._exitLive();
		BUS.$off('roomAttendeesChange', this.onRoomAttendeesChange);
		BUS.$off('setShareStrem', this.onSetShareStrem);
		BUS.$off('userOnlineRoomChange', this.userOnlineRoomChange)
	},
	
}
</script>

<style lang="less" scoped>
	.liveSeder {
		height: 100%;
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		width: 0.8rem;
		background: #09153D;
		user-select: none;
		z-index: 188;
		.liveSeder-content {
			height: 100%;
			width: 100%;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
    		align-items: center;
			padding: 0.6rem 0rem 0.3rem;
			box-sizing: border-box;

		}
		.trapezoid_box {
			position: absolute;
			top: 50%;
			left: -0.2rem;
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
		.seder_panel, .seder_exit {
				.seder_panel-content {
					margin-bottom: 0.3rem;
					cursor: pointer;
					.seder_panel-content-item {
						width: 0.6rem;
						height: 0.6rem;
						display: flex;
						align-items: center;
						justify-content: center;
						flex-direction: column;
						.seder_panel-content-item-icon {
							width: 0.22rem;
							height: 0.22rem;
						}
						.seder_panel-content-item-title{
							font-size: 0.12rem;
							color: #419AFF;
							margin-top: 0.04rem;
						}	
					}
				}
				.seder_panel-content:last-child {
					margin-bottom: 0;	
				}
			}
	}
</style>