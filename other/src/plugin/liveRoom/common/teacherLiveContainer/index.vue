<template>
    <div class="teacherLiveContainer">
        <slot name="liveBarSlot"></slot>
        <div class="teacherLiveContainer-content" v-show="liveBarShow">
            <commonRoomControllerFeature :share="share"></commonRoomControllerFeature>
            <div class="teacherLiveContainer-head">
                <headPanel
                    :roomInfo="thisParent.liveRoomParams.USER_INFO"
                    :mikeState="mikeState"
                    :cameraState="cameraState"
                    :isHasOnlineStudent="isHasOnlineStudent"
                    @search="searchNameChange"
                    @deviceChange="headPanelDeviceChange"
                >
                </headPanel>
            </div>
            <div class="teacherLiveContainer-body">
                <div class="teacherLiveContainer-body-video" v-if="allStuStreamList.length">
                    <!-- v-if="onlineStuStreamList.length" -->
                    <border-item v-if="onlineStuStreamList.length" :offBorder="true" :style="{'height': 'auto'}">
                        <template>
                            <!-- <span style="color: #fff">{{ onlineStuStreamList }}</span> -->
                            <!-- onlineStuStreamList -->
                            <on-line-student 
                                :streamList="onlineStuStreamList" 
                                :converseState="true"
                                :openDialogUserID="openDialogUserID"
                                :searchName="searchName"
                                @teacherDealLine="teacherHandle"
                                @setPopupUserId="setPopupUserId"
                                @changeFullScreen="changeFullScreen"
                                >
                                
                                
                                <template #onlineShareStream="scope">
                                    <!-- <slot name="teacherContainerShareStream"  :slot-scope="scope"></slot> -->
                                    <slot name="teacherContainerShareStream"  :slot-scope="{...scope.slotScope, platformType: stuNameTemp[scope.slotScope.uid] && stuNameTemp[scope.slotScope.uid].platformType || ''}"></slot>
                                </template>
                                
                                <template #studentPopupSidebar>
                                    <slot name="studentPopupSidebar"></slot>
                                </template>
                            </on-line-student>
                        </template>
                    </border-item>
                    <!-- v-if="supervisionStuStreamList.length" -->
                     
                    <border-item
                         :style="{'flex': 1}"
                        v-if="supervisionStuStreamList.length"
                        borderColor="rgba(255, 210, 0, 0.5)" 
                        cornerColor="#FFD200">
                        <template>
                        <!-- <span style="color: #fff">{{ supervisionStuStreamList}}</span> -->
    
                            <on-line-student 
                                :streamList="supervisionStuStreamList" 
                                :converseState="false"
                                :openDialogUserID="openDialogUserID"
                                :searchName="searchName"
                                @teacherDealLine="teacherHandle"
                                @setPopupUserId="setPopupUserId"
                                @changeFullScreen="changeFullScreen"
                                >
                                
                                <template #studentPopupSidebar>
                                    <slot name="studentPopupSidebar"></slot>
                                </template>
                                
                                <template #onlineShareStream="scope">
                                    <slot name="teacherContainerShareStream"  :slot-scope="{...scope.slotScope, platformType: stuNameTemp[scope.slotScope.uid] && stuNameTemp[scope.slotScope.uid].platformType || ''}"></slot>

                                </template>
                            </on-line-student>
                        </template>
                    </border-item>
                </div>
                <div class="teacherLiveContainer-body-video noUser" v-else>
                    <!-- <div class="nouserImg"></div> -->
                    <img class="nouserImg" src="https://all-static-resource.oss-cn-beijing.aliyuncs.com/omp/liveNoUser.png" alt="">
                    <div class="tipTxt tipTxt1">等待学生进入直播间...</div>
                    <div class="tipTxt tipTxt2">督导师请提前检查麦克风、摄像头等设备，并保持开启状态~</div>
                </div>
     
    
                <div class="teacherLiveContainer-body-side">
                    <div class="teacherLiveContainer-body-side-video">
                        <border-item 
                            borderColor="#042F8B" 
                            cornerColor="#08F9FF">
                            <template>
                                <video-stream v-if="teacherStream && isShowTeacherStream" :identityType="'teacher'" :stream="teacherStream" width="2.9rem"></video-stream>
                                <div v-else style="width:2.9rem; height: 1.63rem;background: #474747;"></div>
                            </template>
                        </border-item>
                    </div>
                    <div class="teacherLiveContainer-body-side-record">
    
                        <border-item 
                            borderColor="#042F8B" 
                            cornerColor="#08F9FF">
                            <template>
                                <call-log :callLogData="callLogData" @callLineStu="callLineStu"></call-log>
                            </template>
                        </border-item>
    
                    </div>
                </div>
            </div>
          
            <!-- 学生列表 -->
            <student-list-popup 
                v-if="stuPopupDialogVisible" 
                @close="stuPopupDialogVisible = false"
                @lineMoreStu="lineMoreStu"
            ></student-list-popup>
        </div>

        <div v-if="!liveBarShow" class="teacherLiveContainer_liveBody">
            <slot name="liveBody"></slot>
        </div>
        
    </div>
</template>

<script>
const CLEAR_TIMER = 3000; // 清除定时器时间 超时或者挂断的
import headPanel from '../head/headPanel.vue'
import onLineStudent from '../onLine/index.vue'
import videoStream from '../videoStream/index.vue'
import borderItem from '../borderItem/index.vue'
import callLog from '../callLog/index.vue'
import commonRoomControllerFeature from '../commonLive/common-room-controller-feature.vue'
import studentListPopup from '../studentListPopup/index.vue'
export default {
    name: 'teacherLiveContainer',
    components: {
        headPanel,
        onLineStudent,
        videoStream,
        borderItem,
        callLog,
        commonRoomControllerFeature,
        studentListPopup
        // // 直播间头部面板
        // headPanel: () => import('../head/headPanel.vue'),
        // // 在线学生列表
        // onLineStudent: () => import('../onLine/index.vue'),
        // // 视频流
        // videoStream: () => import('../videoStream/index.vue'),
        // // 边框
        // borderItem: () => import('../borderItem/index.vue'),
        // // 通话日志
        // callLog: () => import('../callLog/index.vue'),
        // // 通用直播间组件复用 检测设备摄像头、麦克风等状态 开始获取流等
        // commonRoomControllerFeature: () => import('../commonLive/common-room-controller-feature.vue'),
        // // 学生列表面板
        // studentListPopup: () => import('../studentListPopup/index.vue'),
    },
    
    props: {
        // 是否显示直播间
        liveBarShow: {
            type: Boolean,
            default: true,
        },
    },
    inject: {
        
        // tabbar插槽内容
        liveBarSlot: {
            default: null
        },
        thisParent: {
            default: () => ({})
        },
        zegoLiveRoom: {
            default: () => ({})
        }
    },
	provide() {
		return {
			commonVideoRoomThis: this,
		}
	},
  
    data() {
        return {
            mikeState: false, // 麦克风状态
            cameraState: false, // 摄像头状态


            share: false, // 是否开启共享， share => false,非共享，=> true 共享
			streamID: '', // 共享流ID


			memberList : [],    // 成员列表
            memberListTemp: {}, // 成员列表对象，日志连线时查询学生是否在线

			teacherStream : null,  // 老师流, 老师默认占一个麦位，创建一条默认无数据流
			allStuStreamList : [],  // 学生流列表
            onlineStuStreamList: [], // 在线学生流列表
            supervisionStuStreamList: [], // 督导学生流列表 //要包含视频流和共享流

            stuCallLine: {
                isShow: false,
                isMasker: false,
            },

            stuPopupDialogVisible: false, // 学生列表面板显示隐藏

            isShowTeacherStream: true, // 单个学生放大时显示弹时，老师流显示隐藏,

            // popupVisible: false, // 单个学生面板显示隐藏 包含断开连线面板

            callLogData: [], // 通话日志列表
            // 通话日志临时数据 用于存储学生的呼叫信息，包括呼叫类型、呼叫状态、呼叫时间、呼叫时长等信息。 
            // 用于在连线结束后，将通话日志添加到列表中。
            // 存储每个学生的通话信息， 结束后将其添加到callLogList中。
            callLogTemp: {},  // 通话日志临时数据
            callTimer: null, // 通话定时器 长时间未处理自动处理
            timeOut: 30 * 1000, // 超时时间，可根据实际需求调整

            isHasOnlineStudent: false, // 是否有连线学生
            openDialogUserID: '', // 当前放大弹框的的学生ID
            searchName: '', // 搜索学生姓名
            stuNameTemp: {}, // 学生姓名临时数据
            timerTemp: {}, // 定时器临时数据, 清除超时或者挂断的 
            startLineIdentity: 'student', // 发起连线身份 默认学生
            onLineStuUserTemp: {}, // 在线学生, 用于学生列表面板显示// 其他显示掉线

            delAddStuStatus: {}, // 学生刷新或者直接关闭窗口时， 学生状态
        }
    },
    computed: {
		streamList() {
			return this.zegoLiveRoom.streamList
		},
		/**
		 * 获取IM接收到的消息数据
		 *
		 * @returns 返回当前直播间IM接收到的消息数据
		 */
		IMRecvData() {
			return this.zegoLiveRoom.IMRecvInfo;
		},
	},
	watch: {
		streamList: function(newList) {

			const memberList = this.memberList.slice()
			this.makeTeacherStream(newList, memberList)
			this.makeStuStreamList(newList, memberList, true)
		},
		memberList: function(newList) {
            // alert(99)   
			const streamList = this.streamList.slice()
			this.makeTeacherStream(streamList, newList)
			this.makeStuStreamList(streamList, newList, false)
		},
		/**
		 * 监听IM接收到的消息数据
		 *
		 * @returns 返回当前直播间IM接收到的消息数据
         */
		IMRecvData: function(newData) {
            if(newData){
                const {toUser, command, fromUser } = newData;
                let {userID, userName} = fromUser || {};
                // console.warn('----------------监听IM接收到的消息数据', userID);    
                if(!userID) return;
                this.$emit('teacherIMRecvData', newData);
                let callLogTemp = this.callLogTemp[userID] && {... this.callLogTemp[userID]} || null;
                let NOW_TIME = Date.now();
                let $callData = null;    
               
                if(toUser.role == 1 && userID){
                    // 发给老师的信令
                    let { callType, status, myMicStatus, platformType } = command || {};
    
                    if(!callType) return;
                    if(this.stuNameTemp[userID]){
                        this.$set(this.stuNameTemp[userID], 'platformType', command.platformType || '');
                    }else {
                        this.$set(this.stuNameTemp, userID, {...fromUser, platformType: command.platformType || ''});
                    }
                    if(callType == 8){
                        console.warn('老师收到姓名信令---newData', newData);
                        if(!this.stuNameTemp[userID]){
                            
                            // 学生发送登录用户名的信息
                      
                            
                            let memberList = this.memberList;
                            memberList.forEach(item => {
                                if(item.role == 2){
                                    if(this.stuNameTemp[item.uid]){
                                        item.userName =  item.nick_name;
                                        item.platformType = this.stuNameTemp[item.uid].platformType || item.platformType || '';
                                    }
                                }
                            })
                            this.$set(this, 'memberList', memberList)
                        }else {
                        //    this.$set(this.stuNameTemp, userID, {...this.stuNameTemp[userID], platformType: command.platformType || ''})
                   
                            // const arr = ['allStuStreamList', 'supervisionStuStreamList', 'onlineStuStreamList']
                            // arr.forEach(item => {
                            //     const inx = this[item].findIndex(it => it.user.uid == userID);
                            //     if(inx > -1) {
                            //         this.$set(this[item][inx], 'platformType',  command.platformType || '')
                            //     }
                            // })  
                           this.$forceUpdate();
                        }
                        return
                    }
                    // 老师连麦学生，学生反馈发送的信令
              
        
                    if(callType == 7){
                        // 不用了
                        // console.warn('999999-------callLogTemp', callLogTemp)
                    //     if(callLogTemp){
                    //     callLogTemp.micStatus = myMicStatus;
                    //     this.$set(this.callLogTemp, userID, callLogTemp);
                    // }
                        // 麦克风操作
                        return;
                    }
                   
                    if(callType == 5){
                        // 学生刷新时，发送询问的信令
                        if(status == 9){
                        
                            // 学生刷新时，发送询问的信令,教师将学生这边的状态传回学生
                            this.toStudentCommand({callType: 6, status: callLogTemp && (callLogTemp.status || callLogTemp.status == 0) ? callLogTemp.status : -1}, [userID]);
                        }
                    	return
                    }
                    // if(callType == 6){
                    //     // 教师刷新时，发送学生信令后，学生回复的信令
                    //     return
                    // }
                    if(callType == 2 || callType == 1){
                        let tagName = 'callTimer_'+ userID;
                        if(this[tagName]){
                            clearTimeout(this[tagName]);
                            this[tagName] = null;
                        }
                    }
                    if(callType == 2){
                        // 老师连麦学生，学生反馈发送的信令,老师连麦学生并且学生接通
                        if(status == 1){
                            
                            let _callData = {
                                ...callLogTemp,
                                status: 1, // 0、呼叫中 1接听、2、连麦中挂断 3、超时 4、等待连线时挂断
                                callState: 1,// 1 已接通 ，2  未接通
                                // callType: 2, // 呼叫类型 1: 拨入 2: 拨出
                                // startTime: NOW_TIME, // 呼叫开始时间
                                onLineStartTime: NOW_TIME, // 连麦开始时间
                                // duration: 0, // 连麦通话时长
                                callFlag: true, // 通话标识，用于判断是否已经处理过该呼叫
                            }

                            console.warn('老师连麦学生，学生反馈发送的信令,老师连麦学生并且学生接通', callLogTemp)
                            // callType 20 == 教师广播，告知学生教师正在连线中

                            this.$set(this.callLogTemp, userID, _callData);
                            // this.zegoLiveRoom.createAudioPushStream()
                            this.setDeviceHandele()
                            // this.$message.success('对方已接听');
                        }else if(status == 2){
                            // 对方挂断
                            let _callData = {
                                    ...callLogTemp,
                                    status: 2, // 0、呼叫中 1接听、2、连麦中挂断 3、超时 4、等待连线时挂断
                                    callState: 1,// 1 已接通 ，2  未接通
                                    // callType: 2, // 呼叫类型 1: 拨入 2: 拨出
                                    // startTime: NOW_TIME, // 呼叫开始时间
                                    // onLineStartTime: NOW_TIME, // 连麦开始时间
                                    duration: NOW_TIME - callLogTemp.onLineStartTime , // 连麦通话时长
                                    callFlag: true, // 通话标识，用于判断是否已经处理过该呼叫
                            }
                            if(!callLogTemp.onLineStartTime){
                                _callData.callState = 2;
                                _callData.duration = 0;
                            }
                            this.$set(this.callLogTemp, userID, _callData);
                            this.setLogData(_callData);
                            // this.zegoLiveRoom.stopAudioPublishingStream(this.zegoLiveRoom.publishAudioStreamId); //---------
                            // this.$message.success('对方连线挂断');
                        }else if(status == 4){
                            let _callData = {
                                    ...callLogTemp,
                                    status: 4, // 0、呼叫中 1接听、2、连麦中挂断 3、超时 4、等待连线时挂断
                                    callState: 2,// 1 已接通 ，2  未接通
                                    // callType: 2, // 呼叫类型 1: 拨入 2: 拨出
                                    // startTime: NOW_TIME, // 呼叫开始时间
                                    // onLineStartTime: NOW_TIME, // 连麦开始时间
                                    // duration: 0 , // 连麦通话时长
                                    callFlag: true, // 通话标识，用于判断是否已经处理过该呼叫
                            }
                            this.$set(this.callLogTemp, userID, _callData);
                            this.setLogData(_callData);
                            // this.$message.success('对方已拒接');
                        }
                    }else{
                        // callType == 1 || 3
                        if(callType == 1 && status == 0){
                            this.startLineIdentity = 'student';
                            this.stuPopupDialogVisible = false;
                            localStorage.setItem('startLineIdentity', this.startLineIdentity);
                        }
                        let _callData = {
                                status: status, // 0、呼叫中 1接听、2、连麦中挂断 3、超时 4、等待连线时挂断
                                callType: callType, // 呼叫类型 1: 拨入 2: 拨出
                                startTime: status == 0 ? NOW_TIME : (callLogTemp && callLogTemp.startTime || NOW_TIME), // 呼叫开始时间
                                onLineStartTime: 0, // 连麦开始时间
                                duration: 0, // 连麦通话时长
                                callFlag: false, // 通话标识，用于判断是否已经处理过该呼叫
                                userName: userName,
                                userID: userID,
                                micStatus: myMicStatus || 2, // 学生麦克风状态
                        }
                        
                        if(status == 0){
                            // 学生呼叫中
                                   // 判断教师是否在连线中
                            // const temps = []
                            // for(let key in this.callLogTemp){
                            //     let temp = this.callLogTemp[key];
                            //     if(temp && temp.status == 1){
                            //         temps.push(temp)
                            //     }
                            // }
                            if(this.isHasOnlineStudent){
                                // 教师在连线中，自动向学生发送信令我在忙
                                $callData = {
                                    ..._callData,
                                    status: 5,
                                    callState: 2, // 1 已接通 ，2  未接通
                                }
                                this.$set(this.callLogTemp, userID, null);
                                this.setLogData($callData);
                                this.toStudentCommand({callType: 3, status: 5}, [userID]);
                                return;
                            }else {
                                     //  学生连麦老师，发送的信令
                                if(callLogTemp){
                                    this.$set(this.callLogTemp, userID, null);
                                }
                                $callData = {
                                    ..._callData,
                                    callState: 2, // 1 已接通 ，2  未接通
                                }
                                // 学生可以发来连麦请求，callLogTemp 设置为空

                                if(callType == 1){
                                    this.openDialogUserID = '';
                                    this.$set(this, 'callLogTemp', {});
                                }
                                // 超时自动处理
                                this.setLongTimeDeal($callData, [userID])
                            }
                            // this.$set(this.callLogTemp, userID, $callData);
                        }else if(status == 2){
                            console.warn('老师连麦学生，学生反馈发送的信令,老师连麦学生并且学生挂断', callLogTemp)
                            
                            // 学生连麦中挂断
                            $callData = {
                                ..._callData,
                                callState: 1, // 1 已接通 ，2  未接通
                                onLineStartTime: callLogTemp.onLineStartTime, // 连麦开始时间
                                duration: NOW_TIME - callLogTemp.onLineStartTime, // 连麦通话时长
                                callFlag: true, // 通话标识，用于判断是否已经处理过该呼叫
                            
                            }
                            if(platformType =='applet' && callLogTemp.status == 0){
                                // 兼容小程序 在等待请求连线中挂断 status传错值的问题（应该传4）
                                $callData.callState = 2;
                                $callData.duration = 0; 
                            }
                            // this.zegoLiveRoom.stopAudioPublishingStream(this.zegoLiveRoom.publishAudioStreamId); //------

                        }else if(status == 3){
                            // 学生超时未接 发回的信令
                            $callData = {
                                ..._callData,
                                callState: 2, // 1 已接通 ，2  未接通
                                callFlag: true, // 通话标识，用于判断是否已经处理过该呼叫
                            }

                        }else if(status == 4){
                            // 学生在等待连线时未接听直接挂断
                            $callData = {
                                ..._callData,
                                callState: 2, // 1 已接通 ，2  未接通
                                callFlag: true, // 通话标识，用于判断是否已经处理过该呼叫
                            }
                        }
                        let $stuCallLine = {
                            isShow: status == 0 ? true : false,
                            isMasker: status == 0 ? true : false,
                            userID: status == 0 ? userID : null,
                        }
                        this.$set(this, 'stuCallLine', $stuCallLine);
                        localStorage.setItem('stuCallLine', JSON.stringify($stuCallLine));

                        status != 0 && this.setLogData($callData);
                        // status == 0 ? $callData : null
                        this.$set(this.callLogTemp, userID, $callData);
                    }

              
                   
                }else if(toUser.role == 2 && userID){ 
                    // 本人发的信令
                }
            }
            
		},
        callLogTemp: {
            handler(newVal, oldVal){
                localStorage.setItem('callLogTempDataStorage', JSON.stringify(newVal));
                this.allStuStreamList.forEach((stream, y) => {
                    let callLogTemp = newVal[stream.user.uid] || {};
                    let status = callLogTemp.status ;
                    let timer = this.timerTemp[stream.user.uid] || null;
                    if(status == 3 || status == 4){
       
                        if(!timer){
                            let _timer = setTimeout(() => {
                                clearTimeout(_timer);
                                _timer = null;
                                this.teacherHandle(5, stream)
                      
                            }, CLEAR_TIMER); 
                            this.$set(this.timerTemp, stream.user.uid, _timer);
                        }
                        
                    }else {
                        if(timer){
                            clearTimeout(this.timerTemp[stream.user.uid]);
                            this.$set(this.timerTemp, stream.user.uid, null);
                        }
                    }
                    if(status == 0 || status == 1 || status == 3 || status == 4){
                        // 判断是否已经存在
                        const onlineindex = this.onlineStuStreamList.findIndex(item => item.user.uid == stream.user.uid);
                        if(onlineindex == -1){
                            
                            this.onlineStuStreamList.push(stream);
                        }
                        
                        // 在督导学生列表中删除以连线的学生
                        const index = this.supervisionStuStreamList.findIndex(item => item.user.uid == stream.user.uid);
                        if(index != -1){
                            this.supervisionStuStreamList.splice(index, 1);
                        }
                    }else{

                        // 找出 B 中最后一个 uid 同时也存在于 A 中的对象
                        function lastCommon(A, B) {
                            // 1. 把 A 的 uid 收集到 Map，方便 O(1) 查询
                            const uidMap = new Map(A.map(item => [item.user.uid, item]));
                            
                            // 倒序遍历 B，找到第一个存在于 setA 的元素即可
                            for (let i = B.length - 1; i >= 0; i--) {
                                
                                if (uidMap.has(B[i].user.uid)) return i;
                            }

                            // 没有共同元素
                            return undefined;
                        }
                        // 判断是否已经存在
                        const supervisionIndex = this.supervisionStuStreamList.findIndex(item => item.user.uid == stream.user.uid);
                        if(supervisionIndex == -1){
                            // 将断开连线的学生插入到督导学生列表中，并且保持原有位置不变
                            const lastIndex = lastCommon(this.supervisionStuStreamList, this.allStuStreamList.slice(0, y));
                            this.supervisionStuStreamList.splice(lastIndex + 1, 0, stream);
                        }

                        // 在连线学生列表中删除以断开连线的学生
                        const index = this.onlineStuStreamList.findIndex(item => item.user.uid == stream.user.uid);
                        if(index != -1){
                            this.onlineStuStreamList.splice(index, 1);
                        }
                    }

                })
                
                // 是否有连线学生
                let temps = [];
                let lineTemps = [];
                 for(let key in newVal){
                    if(newVal[key] && (newVal[key].status == 0 || newVal[key].status == 1)){
                        temps.push(newVal[key]);
                        if(newVal[key].status == 1){
                            lineTemps.push(newVal[key]);
                        }
                    }
                 }
                 if(!lineTemps.length){
                    // 没有学生在连线中停止推流
                    this.zegoLiveRoom.stopAudioPublishingStream(this.zegoLiveRoom.publishAudioStreamId);
                 }
                 this.isHasOnlineStudent = temps.length > 0 ? true : false;
     
                const tempIds1 = this.supervisionStuStreamList.map(item => item.user.uid);
                const tempIds2 = this.onlineStuStreamList.map(item => item.user.uid);
                // 教师广播，告知未连线的用户学生教师正在连线中， 已连线的用户更新通知状态
                if(tempIds1.length){
                    this.toStudentCommand({callType: 20, status:  this.isHasOnlineStudent ? 1 : 0}, tempIds1);
                }
                if(tempIds2.length){
                    this.toStudentCommand({callType: 20, status: 0}, tempIds2);
                }
                //  this.$forceUpdate();
            },
            deep: true
        }
         
	},
    created() {
		this.timeOut = this.thisParent.liveRoomParams.TIME_OUT;
        // 初始化为空
        this.$set(this, 'onLineStuUserTemp', {});

        // 初始化 本地存储数据
        let logTemp = localStorage.getItem('callLogTempDataStorage') || null;
        let logData = localStorage.getItem('callLogData') || null;
        let stuCallLine = localStorage.getItem('stuCallLine') || null;
        // 学生来电遮罩层状态
        let _stuCallLine = stuCallLine && JSON.parse(stuCallLine) || {isShow: false, isMasker: false};
        this.callLogTemp = logTemp && JSON.parse(logTemp) || {};

        for(let key in this.callLogTemp){
            let temp = this.callLogTemp[key];
            if(temp){
                if(temp.status == 0 && temp.startTime && temp.callType == 2){
                    let t = this.timeOut - (Date.now() -temp.startTime);
                    this.setLongTimeDeal(temp, [temp.userID], t > 0 ? t : 10)
                } else if(temp.status == 1){
                    // 给每个在连线中或者已经连线状态的学生发送询问信令
                    this.toStudentCommand({callType: 5, status: temp.status, oldCallType: temp.callType}, [temp.userID]); // 学生接听
                }else{
                    // 已经处理过的删除
                    if(temp.callFlag){
                        this.$set(this.callLogTemp, key, null);
                    }

                }
            }
        }

        // console.warn('--------stuCallLine', _stuCallLine , this.callLogTemp);
        // console.warn('-------- _stuCallLine.userID, this.callLogTemp[_stuCallLine.userID]', _stuCallLine.userID, this.callLogTemp[_stuCallLine.userID]);
        if(_stuCallLine && _stuCallLine.isMasker && _stuCallLine.userID){
            // 刷新的时候，处理学生连线教师状态状态
            let stuCallLineTemp = this.callLogTemp[_stuCallLine.userID];
     
            if(!stuCallLineTemp ){
                _stuCallLine = {isShow: false, isMasker: false, userID: null};
                this.stuCallLine = _stuCallLine;
                localStorage.setItem('stuCallLine', JSON.stringify(_stuCallLine));
            }else{
                // 正在请求连线中
                if(stuCallLineTemp.status == 0 && stuCallLineTemp.callType == 1 && stuCallLineTemp.startTime){
                    let t = this.timeOut - (Date.now() - stuCallLineTemp.startTime);
                    if(t <=0){
                        // 如果超时默认挂断
                        this.teacherHandle(2, {user: {userID: _stuCallLine.userID}})
                        // this.setLongTimeDeal(temp, [temp.userID], 10)
                    }else {
                        this.stuCallLine = _stuCallLine;
                        localStorage.setItem('stuCallLine', JSON.stringify(_stuCallLine));
                    }
                }
            }
            
      
        }else {
            this.stuCallLine = _stuCallLine;
            localStorage.setItem('stuCallLine', JSON.stringify(_stuCallLine));
        }


        this.callLogData = logData && JSON.parse(logData) || [];
       
	},
    mounted() {

        const { roomId, userID, userName, role } = this.thisParent.liveRoomParams.USER_INFO;
		this.zegoLiveRoom.$http.init({ roomId, uid: userID, name: userName, role }); // 初始化,监听房间人数等信息变化
		this.teacherStream = { 
			streamID: '', 
			user: { 
				role: this.thisParent.liveRoomParams.ROLE_TEACHER
			} 
		}
		// 监听教师端开始共享
		BUS.$on('startShare', this.pullVideo);

		BUS.$on('roomAttendeesChange', this.onRoomAttendeesChange)
        // 麦克风/摄像头状态改变
		BUS.$on('changeUserInfo', this.onChangeUserInfo)
    	// BUS.$on('userStateChange', this.onUserStateChange)
        // 房间人数变化 增加或者减少
		BUS.$on('userOnlineRoomChange', this.userOnlineRoomChange)

        
        
    },

    methods: {
        // 房间成员减少，主要检测学生是否退出房间 刷新也会执行
        userOnlineRoomChange(updateType, userList, role){
            if(role == 1){
                if(updateType == 'DELETE'){
                    // 学生刷新（还会走ADD）或者直接关闭窗口时走这里， 添加定时器
                	this.$set(this.onLineStuUserTemp, userList[0].userID, null);

                    if(this.delAddStuStatus[userList[0].userID] && this.delAddStuStatus[userList[0].userID].timer){
                    	clearTimeout(this.delAddStuStatus[userList[0].userID].timer);
                        this.$set(this.delAddStuStatus, userList[0].userID, null);
                    }
                    // 设置个定时器 3秒后处理， 如果是刷新，在ADD里会将定时器清除掉，否则可能是用户退出房间或者直接关闭浏览器，3秒后清理掉
                    let timer = setTimeout(() => {
                        clearTimeout(timer);
                        timer = null;
                        let temp = this.callLogTemp[userList[0].userID];
                        if(temp){
                            if(temp.status == 1){
                                this.teacherHandle(3, {user: userList[0]})
                            }else if(temp.status == 0){
                                this.teacherHandle(temp.callType == 2 ? 3 : 1, {user: userList[0]})
                            }
                        }
                    }, 3000);
                    this.$set(this.delAddStuStatus, userList[0].userID, {status: 1, userID: userList[0].userID, timer: timer} )
                }else if(updateType == 'ADD') {
                    if(!this.thisParent.isRefresh){
                        // 第一次以及刷新的时候，处理学生连线教师状态状态
                        let onLineStuUserTemp = {};
                        let callLogTemp = {};
                        userList.forEach((item) => {
                            // 存储在线学生的userID，用于判断学生是否在房间内
    
                            onLineStuUserTemp[item.userID] = item;
                            
                            // 更新已在线用户的callLogTemp状态
                            if(this.callLogTemp[item.userID]){
                                callLogTemp[item.userID] = this.callLogTemp[item.userID];
                            }
                     
    
                            // 清除刷新DELETE里定义的定时器
                            if(this.delAddStuStatus[item.userID] && this.delAddStuStatus[item.userID].timer){
                                clearTimeout(this.delAddStuStatus[item.userID].timer);
                                this.$set(this.delAddStuStatus, item.userID, null);
                            }
    
    
                        })
                        this.$set(this, 'callLogTemp', callLogTemp);
                        this.$set(this, 'onLineStuUserTemp', onLineStuUserTemp);
                    }else {
                        let addUserId = userList[0].userID;
                        // 学生进入
                        // 清除学生刷新DELETE里定义的定时器
                        if(this.delAddStuStatus[addUserId] && this.delAddStuStatus[addUserId].timer){
                            clearTimeout(this.delAddStuStatus[addUserId].timer);
                            this.$set(this.delAddStuStatus, addUserId, null);
                        }
                        // 影响刷新
                        // if(this.callLogTemp[addUserId]){
                        //     this.$set(this.callLogTemp, addUserId, null);
                        // }
                        this.$set(this.onLineStuUserTemp, addUserId, userList[0]);
                    }
                }
            }
            if(!this.thisParent.isRefresh){
                this.thisParent.isRefresh = true;
            }
        },
        // 接听推流，更改设备状态
        setDeviceHandele(){
            // if(this.flagNum == 2) return;
            // this.flagNum = 2;
                //  let lineTemps = [];
                //  for(let key in this.callLogTemp){
                //     if(this.callLogTemp[key] && (this.callLogTemp[key].status == 1)){
                //         lineTemps.push(this.callLogTemp[key]);
                //     }
                //  }
                //  if(lineTemps.length) return;
            const fn = () => {
                this.zegoLiveRoom.handleDeviceStateChange('audio', false, true);
            }
            console.warn('老师连麦学生，学生反馈发送的信令,老师连麦学生并且学生接通-this.mikeState', this.mikeState)
            if(this.mikeState){
                fn()
            }else {
                BUS.$emit('openDeviceHandele', 1, fn);
            }
        },
        // 搜索学生姓名
        searchNameChange(val) {
            this.searchName = val;
        },
        // 设置弹窗的学生id
        setPopupUserId(id){
            this.openDialogUserID = id;
            this.isShowTeacherStream = true;
        },
        // 全屏/取消全屏教师视频流显示隐藏
        changeFullScreen(type){
            
            // this.isShowTeacherStream = type;
        },
        // 连线学生
        // 向学生发送信令
        async toStudentCommand(data, ids = []){

                // 3 回复学生 5 我在忙
            await this.zegoLiveRoom.client.express('sendCustomCommand', JSON.stringify(data), ids)
            
        },

        // 存储连线日志
        setLogData(data){
            if(!data.userID) return;
            if(data.onLineStartTime && data.onLineStartTime == data.duration) return;
            data.userName = this.stuNameTemp && this.stuNameTemp[data.userID] && this.stuNameTemp[data.userID].userName || data.userName;
            this.$set(this,'callLogData', [{...data}, ...this.callLogData])
            localStorage.setItem('callLogData', JSON.stringify(this.callLogData)); 
        },
        /**
		 * 教师接收/挂断
		 */
        async teacherHandle(type, stream) {
            // type 1 接听 2 挂断  4发起连线
            let {userID, uid} = stream.user || {};
            let USERID = userID || uid;
            let tagName = 'callTimer_'+ USERID;
            if(this[tagName]){
                clearTimeout(this[tagName]);
                this[tagName] = null;
            }
            if(type == 4){
                // 发起连线 放大弹窗内和小屏幕内
                this.callLineStu(stream);
                return;
            }
            let callLogTemp = this.callLogTemp[USERID] || {};
            let NOW_TIME = Date.now();
            if(type == 1){
                // 学生发起 教师接听
                let $callTemp = {
                    ...callLogTemp,
                    status: 1, // 0、呼叫中 1接听、2、连麦中挂断 3、超时 4、等待连线时挂断
                    callState: 1, // 1 已接通 ，2  未接通
                    onLineStartTime: NOW_TIME, // 连麦开始时间
                    callFlag: true, // 通话标识，用于判断是否已经处理过该呼叫
                } 
               
                this.$set(this.callLogTemp, USERID, $callTemp);
                this.toStudentCommand({callType: 3, status: 6}, [USERID]); 
                // this.$message.success('接听成功');
                // this.zegoLiveRoom.createAudioPushStream()
                

                this.setDeviceHandele()
            }else if(type == 2){
                // 学生发起 教师挂断
                let $callTemp = {
                    ...callLogTemp,
                    status: 4, // 0、呼叫中 1接听、2、连麦中挂断 3、超时 4、等待连线时挂断
                    callState: 2, // 1 已接通 ，2  未接通
                    // onLineStartTime: 0, // 连麦开始时间
                    callFlag: true, // 通话标识，用于判断是否已经处理过该呼叫
                } 
// console.warn('0000000000000000000callLogTemp', callLogTemp);
                this.setLogData($callTemp);
                this.$set(this.callLogTemp, USERID, null);
                this.toStudentCommand({callType: 3, status: 7}, [USERID]); 
            }else if(type == 3){
                // 连线中 教师挂断
                let $callTemp = {
                    ...callLogTemp,
                    status: 2, // 0、呼叫中 1接听、2、连麦中挂断 3、超时 4、等待连线时挂断
                    callState: 1, // 1 已接通 ，2  未接通
                    // onLineStartTime: 0, // 连麦开始时间
                    duration: NOW_TIME - callLogTemp.onLineStartTime, // 连麦通话时长
                    callFlag: true, // 通话标识，用于判断是否已经处理过该呼叫
                } 
                if(callLogTemp.callType == 2 && callLogTemp.status == 0){
                    // 教师发起连线后对方未接听挂断
                    $callTemp.callState = 2; // 未接通

                    $callTemp.status = 4;
                }
                this.setLogData($callTemp);
                this.$set(this.callLogTemp, USERID, null);
                this.toStudentCommand({callType: 3, status: 8}, [USERID]); // 学生接听
                this.zegoLiveRoom.stopAudioPublishingStream(this.zegoLiveRoom.publishAudioStreamId);

            }else if(type == 5){
                if(this.timerTemp[USERID]){
                    clearTimeout(this.timerTemp[USERID]);
                    this.$set(this.timerTemp, USERID, null);
                }
                // 不在连接
                this.$set(this.callLogTemp, USERID, null);
            }

            let $stuCallLine = {
                isShow: type == 1 ? this.stuCallLine.isShow : false,
                isMasker: false,
                userID: type == 1 && this.stuCallLine.isShow ? USERID : null,
            }
            this.$set(this, 'stuCallLine', $stuCallLine);
            localStorage.setItem('stuCallLine', JSON.stringify($stuCallLine));
 
        },
        // 连线学生
        async callLineStu(item, val){
            const _this = this;
            const {code, message} = await _this.liveHandleUserMedia(false, true);
            if(code !== '000000'){
                _this.showToast(message ,3000, 'error')
                return;
            }
            // // 如果是连线状态 return掉
            // let userID = item.uid || item.userID;
            let { userID, uid, userName, nick_name } = item.user || {};
            let USERID = userID || uid;
            let NOW_TIME = Date.now();
            if(!USERID)return;
            // 不在成员列表（点击日志）或者不在线
            if(!_this.memberListTemp[USERID] || !_this.onLineStuUserTemp[USERID]){
                _this.showToast('当前学生不在线', 3000, 'error');
                return
            }
            // 如果这个用户有链接超时或者挂断后添加的定时器，清除定时器
            if(_this.timerTemp[USERID]){
                    clearTimeout(_this.timerTemp[USERID]);
                    _this.$set(_this.timerTemp, USERID, null);
                }

            // 判断是否已经在连线中，return掉
            let callLogTemp = _this.callLogTemp[USERID];
            if(callLogTemp && (callLogTemp.status == 0 || callLogTemp.status == 1)) {
                // _this.$message.warning('当前学生正在连线中，无法再次连线');
                return;
            }; // 如果已经在连线中，return掉
            // if(_this.isHasOnlineStudent && !val){
            //     // 教师在连线中，提示
            //     _this.$message.warning('正在占线中，无法再次连线');
            //     return;
            // }else {
            //     // 连线学生缓存身份

            //     _this.startLineIdentity = 'teacher';
            //     localStorage.setItem('startLineIdentity', _this.startLineIdentity);
            // }
                _this.startLineIdentity = 'teacher';
                localStorage.setItem('startLineIdentity', _this.startLineIdentity);

            let _callData = {
                    status: 0, // 0、呼叫中 1接听、2、连麦中挂断 3、超时 4、等待连线时挂断
                    callState: 0,
                    callType: 2, // 呼叫类型 1: 拨入 2: 拨出
                    startTime: NOW_TIME, // 呼叫开始时间
                    onLineStartTime: 0, // 连麦开始时间
                    duration: 0, // 连麦通话时长
                    callFlag: false, // 通话标识，用于判断是否已经处理过该呼叫
                    userName: userName || nick_name,
                    userID: USERID,
                    micStatus: 2, // 学生麦克风状态
            }
            _this.$set(_this.callLogTemp, USERID, _callData);
            _this.toStudentCommand({callType: 2, status: 0}, [USERID]); // 学生接听
            _this.setLongTimeDeal(_callData, [USERID]);
        },
		// 连线超时
		setLongTimeDeal(callLogTemp, ids, time){
            
            if(!(callLogTemp && callLogTemp.userID)) return;
            
            let tagName = 'callTimer_'+ callLogTemp.userID;
   
			if(this[tagName]){
                clearTimeout(this[tagName]);
                this[tagName] = null;
            }

            this[tagName] = setTimeout( () => {
                // 超时还在连线中自动挂断
                let _callData = {
                    ...callLogTemp,
                    status: 3, // 0、呼叫中 1接听、2、连麦中挂断 3、超时 4、等待连线时挂断
                    callState: 2,
                    callFlag: true, // 通话标识，用于判断是否已经处理过该呼叫
                    
                }
                this.setLogData(_callData);
                this.$set(this.callLogTemp, callLogTemp.userID, _callData);
                this.toStudentCommand({callType: 2, status: 3}, ids); // 学生接听
                
                // 超时自动设置学生单线连老师的来电显示关闭
                this.stuCallLine = {isShow: false, isMasker: false, userID: null};
                localStorage.setItem('stuCallLine', JSON.stringify(this.stuCallLine));
            }, time || this.timeOut)
		},
        // 头部操作
        headPanelDeviceChange(tag, state){
            // if(tag == 'mic' && !this.isHasOnlineStudent){
            //     this.$message.warning('当前没有学生连线，无法操作麦克风');
            //     return
            // }
            if(tag == 'on'){
                this.stuPopupDialogVisible = true;
            }else if(tag == 'off'){
               let callLogTemp = this.callLogTemp;
                if(this.onlineStuStreamList.length){
                    this.onlineStuStreamList.forEach((item) => {
                        this.teacherHandle(callLogTemp[item.user.uid || item.user.userID].status== 0 ? 2 : 3, item);
                    })
                }
                this.zegoLiveRoom.stopAudioPublishingStream(this.zegoLiveRoom.publishAudioStreamId);
                // onlineStuStreamList
            }else if(tag == 'camera' || tag == 'mic'){
                // let name = tag == 'camera'? 'cameraState' :'mikeState';
                // this[name] = !this[name];
                // if(tag == 'mic'){
                //     // 通知学生我的麦克风状态
                //     let memberList = this.memberList;
                //     memberList.forEach((item) => {
                //         console.warn(87654, item)
                //         if(item.role == 2 && (item.uid || item.userID)){
                //             this.toStudentCommand({callType: 9, status: -1, teacherMikeState: this.mikeState}, [item.uid || item.userID]); 
                //         }
                //     })
                   
                // }
            }else if(tag == 'exit'){
                // 退出连线，关闭房间,给每个用户挂断通话

         
            this.$confirm('确认离开房间么？', '提示', {
                confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
            }).then(async () => {

                let callLogTemp = this.callLogTemp;
                if(this.onlineStuStreamList.length){
                    this.onlineStuStreamList.forEach((item) => {
                        this.teacherHandle(callLogTemp[item.user.uid || item.user.userID].status== 0 ? 2 : 3, item);
                    })
                }
                
                this.zegoLiveRoom.stopAudioPublishingStream(this.zegoLiveRoom.publishAudioStreamId);
                this.zegoLiveRoom.stopAudioPublishingStream(this.zegoLiveRoom.publishStreamId);
                let timer = setTimeout(() => {
                    this.$emit('exitRoom');
                    window.open(' ','_self');
                    window.close();
                    clearTimeout(timer)
                    timer = null;
                }, 300)
                // if(this.allStuStreamList.length){
                //     this.allStuStreamList.forEach((item) => {
                //         this.toStudentCommand({callType: 7, status: -1}, [item.user.uid || item.user.userID]); // 学生接听
                //         // this.teacherHandle(callLogTemp[item.user.uid || item.user.userID].status== 0 ? 2 : 3, item);
                //     })
                // }
                // this.openDialogUserID = '';
                // this.$set(this, 'callLogTemp', {});
                // this.zegoLiveRoom.stopAudioPublishingStream(this.zegoLiveRoom.publishAudioStreamId);
                // this.zegoLiveRoom.isquit = true;
                //     let timer = setTimeout(async () => {
                //         await this.thisParent.$http.leaveRoom()
                //         await this.thisParent.$http.endTeaching()
                //         localStorage.removeItem('callLogData');
                //         localStorage.removeItem('callLogTempDataStorage');
                //         localStorage.removeItem('stuCallLine');
                //         localStorage.removeItem('deviceStatus');
                //         this.$emit('exitRoom');
                //         clearTimeout(timer);
                //         timer = null;

                //     }, 300)

				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消'
					});          
				});
                // 退出督导，关闭房间
            }
        },

        async lineMoreStu(data){
            const _this = this;
            const {code, message} = await _this.liveHandleUserMedia(false, true);
            if(code !== '000000'){
                _this.showToast(message ,3000, 'error')
                return;
            }
            _this.stuPopupDialogVisible = false;
            if(data && data.length){
                data.forEach(item => {
                    _this.callLineStu({user: item}, true);
                })
            }
        },






        /**
		 * 拉流监听
		 */
		playerStateUpdate() {
			const _this = this;
			// 监听开始共享
			this.zegoLiveRoom.shareClient.on('playerStateUpdate', (result) => {
				console.log(result, '拉流状态回调')
				if (result.state == 'NO_PLAY') {
				_this.share = false;
				} else {
				_this.share = true;
				}
				
				
			});
			// 监听开始共享
			this.zegoLiveRoom.shareClient.on('playQualityUpdate', (streamID, stats) => {
				console.log(streamID, stats, '拉流质量回调')
				_this.share = true;
				
			});

			// 监听停止共享
			this.zegoLiveRoom.shareClient.on('screenSharingEnded', (res) => {
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
        // 切换麦克风/摄像头状态改变
        onChangeUserInfo(data, tag){
            let flag = data[tag] == 2 ? true : false;
            if(tag == 'mic'){
                this.mikeState = flag; // 麦克风状态改变
            }else if(tag =='camera'){
                this.cameraState = flag; // 摄像头状态改变
            }
            
            
        },
		/***********************************************************/
  		/**
		 * @desc 房间成员列表变化监听
		 */    
		onRoomAttendeesChange(res, teacherUser) {
            if(res && res.length){
                const memberListTemp = {};
                let list = res;
                let callLogTemp = {};
                let close = true;
                list.forEach(item => {
                    if(item.role == 2){
                        if(this.stuNameTemp[item.uid]){
                            this.stuNameTemp[item.uid].userName = item.nick_name;
                            item.userName = item.nick_name;
                            item.platformType = this.stuNameTemp[item.uid].platformType || item.platformType || '';
                        }else {
                            this.stuNameTemp[item.uid] = {
                                userName: item.nick_name,
                                platformType: item.platformType || ''
                            };
                            // 如果没有缓存询问学生一下
                            this.toStudentCommand({callType: 8, status: -1}, [item.uid]);
                        }
                        // 将不在房间的用户状态更新掉
                        callLogTemp[item.uid] = this.callLogTemp[item.uid] || null;
                        // 
                        if(this.openDialogUserID == item.uid){
                            close = false;
                        }
                    }
                    memberListTemp[item.uid] = item;
                })

                if(close){
                	this.openDialogUserID = '';
                }
            
                this.$set(this, 'callLogTemp', callLogTemp);
                let _list = (res || []);
                this.$set(this, 'memberList', _list);
                this.$set(this,'memberListTemp', memberListTemp);
                let id = this.thisParent.liveRoomParams.USER_INFO.userID;
                let deviceStatus = localStorage.getItem('deviceStatus') && JSON.parse(localStorage.getItem('deviceStatus')) || null;
                let { mic, camera } = teacherUser || deviceStatus && deviceStatus[id] || {};
                if (mic) {
                    this.mikeState = mic == 2 ? true : false;
                }
                if (camera) {
                    this.cameraState = camera == 2 ? true : false;
                }
            }
			// BUS.$emit('roomAttendeesChange', res)
        // console.warn(98765432, this.cameraState,this.mikeState, this.thisParent.liveRoomParams.USER_INFO.userID);
		},
		/**
		 * @desc 成员 摄像头/麦克风/共享权限 状态变化监听
		 */
		// onUserStateChange(users, local) {
		// 	if (!local) {
		// 		this.memberList.forEach(v => Object.assign(v, users[v.uid]))
		// 		this.memberList = [...this.memberList]
		// 	}
		// },

		/**
		 * @desc  获取老师流
		 * @param {streamList} 音视频sdk原始成员流
		 * @param {memberList} 后台返回房间成员列表
		 */
		makeTeacherStream(streamList, memberList) {
            let USER_INFO = this.thisParent.liveRoomParams.USER_INFO;
            let teacUser = memberList.find(v => v.role == USER_INFO.role)

			if (!teacUser) return
			if (!teacUser.uid || !streamList.length) {
				const teacherStream = this.teacherStream
				teacherStream.user = teacUser
				teacherStream.isVideoOpen = false
				teacherStream.isAudioOpen = false
				teacherStream.streamID = '';
                teacherStream.user.userName = USER_INFO.userName;
                teacherStream.user.nick_name = USER_INFO.userName;
                // this.mikeState = false; // 麦克风状态
                // this.cameraState = false; // 摄像头状态
				this.$set(this, 'teacherStream', teacherStream)
				return
			}
			const id = teacUser.uid
			// const joing = teacUser.joing
			const stream = streamList.find(v => (v.user.uid == id || v.user.userID == id))
			if (!stream) {
				const teacherStream = this.teacherStream
				teacherStream.user = teacUser
				teacherStream.isVideoOpen = false
				teacherStream.isAudioOpen = false
				teacherStream.streamID = ''
                teacherStream.user.userName = USER_INFO.userName;
                teacherStream.user.nick_name = USER_INFO.userName;
                // this.mikeState = false; // 麦克风状态
                // this.cameraState = false; // 摄像头状态
				this.$emit('setUserStrem', stream, 'teacherStrem');
				return
			}
			stream.user = { ...stream.user, ...this.teacherStream.user, ...teacUser };
            stream.user.userName = USER_INFO.userName;
            stream.user.nick_name = USER_INFO.userName;
            // this.mikeState = stream.user.mic == 2 ? true : false; // 麦克风状态
            // this.cameraState =  stream.user.camera == 2 ? true : false;; // 摄像头状态

			this.$set(this, 'teacherStream', stream)
		},
		/**
         * @desc 生成学生流列表（Vue2，三列表全部增量更新，无可选链）
         * @param {Array} streamList  音视频 SDK 原始成员流
         * @param {Array} memberList  后台成员列表（下标 0 通常为老师，跳过）
         */
        makeStuStreamList: function (streamList, memberList, tag) {
            /* ---------- 1. 公共准备 ---------- */
            streamList = streamList || [];
            memberList = memberList || [];
            
    
            // 1-1 建立 uid -> stream 映射，方便 O(1) 查询
            var streamMap = {};
            for (var i = 0; i < streamList.length; i++) {
                var s = streamList[i];
                var uid = (s.user && (s.user.uid || s.user.userID)) || '';
                if (uid) streamMap[uid] = s;
            }
            
            if(tag){
                // 流变化
                var userList = [
                    { name: 'onlineStuStreamList' },
                    { name: 'supervisionStuStreamList'},
                    { name: 'allStuStreamList'}
                ];
                userList.forEach(v => {
                    var streamTempList = this[v.name] || [];         // 当前数组
                    streamTempList.forEach( s => {
                        var uid = (s.user && (s.user.uid || s.user.userID)) || '';
                        s.streamID = streamMap[uid] ? streamMap[uid].streamID : '';
                    })
                });
                return
            }
            // 1-2 仅处理学生成员（跳过首位老师）
            var stuMembers = memberList.slice(1);

            /* ---------- 2. 工具函数：判断成员是否在线 ---------- */
            function isOnline(member) {
                var log = member && member.uid ? this.callLogTemp[member.uid] : null;
                return !!(log && (log.status === 0 || log.callState === 1));
            }

            /* ---------- 3. 三列表统一增量更新 ---------- */
            var lists = [
                { name: 'onlineStuStreamList', filter: isOnline },
                { name: 'supervisionStuStreamList', filter: function (m) { return !isOnline.call(this, m); } },
                { name: 'allStuStreamList', filter: function () { return true; } }
            ];

            for (var k = 0; k < lists.length; k++) {
                var cfg = lists[k];
                var arr = this[cfg.name];         // 当前数组
                var filterFn = cfg.filter;        // 判断是否应该出现在本列表

                /* 3-1 收集期望的 uid 集合 */
                var expectUidSet = {};
                for (var j = 0; j < stuMembers.length; j++) {
                    var m = stuMembers[j];
                    if (filterFn.call(this, m)) expectUidSet[m.uid] = true;
                }

                /* 3-2 删除差异：倒序遍历并 splice */
                for (var idx = arr.length - 1; idx >= 0; idx--) {
                    var uidInArr = arr[idx] && arr[idx].user && arr[idx].user.uid;
                    if (!expectUidSet[uidInArr]) {
                        arr.splice(idx, 1);  // 响应式删除
                    }
                }

                /* 3-3 增量追加：顺序遍历，跳过已存在项 */
                var existUidSet = {};
                for (var e = 0; e < arr.length; e++) {
                    var eUid = arr[e] && arr[e].user && arr[e].user.uid;
                    if (eUid) existUidSet[eUid] = true;
                }

                for (var s = 0; s < stuMembers.length; s++) {
                    var member = stuMembers[s];
                    var uid = member.uid;
                    if (!expectUidSet[uid] || existUidSet[uid]) continue;

                    var sdkStream = streamMap[uid];
                    var mergedStream;
                    if (sdkStream) {
                        mergedStream = {};
                        for (var key in sdkStream) mergedStream[key] = sdkStream[key];
                        mergedStream.user = {};
                        for (var uKey in sdkStream.user) mergedStream.user[uKey] = sdkStream.user[uKey];
                        for (var mKey in member) mergedStream.user[mKey] = member[mKey];
                    } else {
                        mergedStream = { streamID: '', user: member };
                    }

                    arr.push(mergedStream);  // 响应式追加
                }
            }
        }

    },
    beforeDestroy() {
        // 清除所有的定时器
        // let tagName = 'callTimer_'+ USERID;
        //     if(this[tagName]){
        //         clearTimeout(this[tagName]);
        //         this[tagName] = null;
        //     }
        // if(this.callTimer) { // 如果之前有定时器，先清除
        //     clearTimeout(this.callTimer);
        //     this.callTimer = null;
        // }
       
        // let callLogTemp = this.callLogTemp[userID];
        // this.callLogTemp[userID] = {
        //         ...callLogTemp,
        //         status: 5, // 0、呼叫中 1接听、2、连麦中挂断 3、超时 4、等待连线时挂断 5、已中断
        //         callState: 1, // 1 已接通 ，2  未接通
        //         onLineEndTime: Date.now(), // 连麦结束时间
        //         duration: Date.now() - callLogTemp.onLineStartTime, // 连麦通话时长
        //         callFlag: true, // 通话标识，用于判断是否已经处理过该呼叫
             
        //     }
        // this.callLogData = [...this.callLogData,this.callLogTemp[userID]];
        // localStorage.setItem('callLogData', JSON.stringify(this.callLogData)); 
        // this.callLogTemp[userID] = null; // 清除临时数据
        BUS.$off('roomAttendeesChange', this.onRoomAttendeesChange)
        // 麦克风/摄像头状态变化监听
		BUS.$off('changeUserInfo', this.onChangeUserInfo)
        // 房间人员变化监听
		BUS.$off('userOnlineRoomChange', this.userOnlineRoomChange)

    	// BUS.$off('userStateChange', this.onUserStateChange)
    },
}
</script>

<style lang="less" scoped>
.teacherLiveContainer {
    background: rgba(5, 14, 48, 1);
    height: 100%;
    width: 100%;
    position: relative;
    line-height: 1;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    .teacherLiveContainer_liveBody {
        height: 100%;
        width: 100%;
        flex: 1;
        height: 0;
    }
    .teacherLiveContainer-content {
        height: 100%;
        width: 100%;
        position: relative;
        line-height: 1;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
    }
    .teacherLiveContainer-head {
        // margin-bottom: 0.11rem;
    }
    .teacherLiveContainer-body {
        position: relative;
        display: flex;
        // flex-direction: column;
        padding: 0.04rem 0.1rem 0;
        flex: 1;
        height: 0;
        gap: 0.1rem;
        box-sizing: border-box;
        .teacherLiveContainer-body-video {
            flex: 1;
            width: 0;
            display: flex;
            flex-direction: column;
        }
        .noUser {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            .nouserImg {
                width: 2.22rem;
                height: 1.64rem;
                margin-bottom: 0.28rem;
            }
            .tipTxt {
                font-size: 0.16rem;
                color: #97ABF7;
                line-height: 0.28rem;
            }
        }
        .teacherLiveContainer-body-side {
            width: 2.9rem;
            height: 100%;
            display: flex;
            flex-direction: column;
            gap: 0.1rem;
            .teacherLiveContainer-body-side-record {
                flex: 1;
                height: 0;
                overflow-y: hidden;
            }
        }
    }
    .stuPostLineBox {
        position: fixed;
        right: 0.4rem;
        bottom: 0.4rem;
        width: 3.22rem;
        height: 1.94rem;
        background: #474747;
        border: 0.06rem solid #FFFFFF;
        background-color: #FFFFFF;
        z-index: 9;
				cursor: pointer;
        .stuPostLineBox-item {
            width: 100%;
            height: 100%;
            .stuPostLineBox-item-masker {
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
                    align-items: center;
                    height: 0.8rem;
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    width: 100%;
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
}
</style>