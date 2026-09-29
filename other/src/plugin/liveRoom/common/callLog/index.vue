<template>
    <div class="callLog">
        <div class="callLog-head">
            <div 
                v-for="item in tabList"
                :key="item.value"
                :class="{'callLog-head-itemActive': item.value == activeTab}"
                class="callLog-head-item"
                @click="changeTab(item.value)">
                <span>{{item.name}}</span>
            </div>
        </div>
        <div class="callLog-body">
            
            <template v-if="tabLogList.length" >
                <div v-for="(item, inx) in tabLogList" :key="inx">
                    <div 
                        class="callLog-body-item" 
                        :key="inx">
                        <div class="callLog-body-item-name">
                            <svg class="iconfont" aria-hidden="true">
                                <use :xlink:href="item.callType == 1 ? '#iconboru' : ''"></use>
                            </svg>
                            <el-tooltip 
                                class="item" 
                                effect="dark" 
                                :content="item.userName" 
                                placement="top-start"
                                :disabled="!item.showTip">
                                <span ref="userName" :id="`${item.userID}userName`" class="callLog-body-item-name-span">{{item.userName}}</span>
                            </el-tooltip>

                            
                            <span v-if="item.totalCount > 1">{{`(${item.totalCount})`}}</span>
                        </div>
                        <div class="callLog-body-item-time callLog-body-item-cell">
                            
                            <div class="item-time-cell">
                                <!-- {{cmFormatSeconds(item.duration, 's分钟')}} -->
                                <span v-if="item.callState == 1" class="time-cell-duration">{{ cmFormatSeconds(item.duration/1000, ((item.duration/1000) >= 3600 ? 'h时m分s秒' : 'm分s秒')) }}</span>
                                <span v-else class="time-cell-no">{{ callStateStatus[item.status] }}</span>
                            </div>
                            <div  class="item-time-cell">
                                <span>{{item.callTime}}</span>
                                <span>{{item.callType == 1 ? '拨入' : '拨出'}}</span>
                            </div>
                        </div>
                        <div class="callLog-body-item-out  callLog-body-item-cell">
                            <span @click="$emit('callLineStu', {user: item})">连线</span>
                        </div>
                    </div>
                </div>
            </template>
            <div class="noLogData" v-else>
                <span>暂无通话列表</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'callLog',
    props: {
        
    },
    data() {
        return {
            tabList: [ // tab 列表
                {
                    name: '全部',
                    value: 0,
                },
                {
                    name: '已接通',
                    value: 1,
                },
                {
                    name: '未接通',
                    value: 2,
                }

            ],
            activeTab: 0, // 当前选中的 tab
            callLogList: [  // 通话日志列表
                // {
                //     name: '呼入-已接通',
                //     duration: 0, // 通话时长
                //     callType: 1, // 通话类型 1: 呼入 2: 呼出
                //     callState: 1, // 通话状态 1: 已接通 2: 未接通
                //     callTime: '10:00', // 通话时间
                // }
            ],
            tabLogList: [],
            
            callStateStatus: {
                1: '已接通',
                2: '已挂断',
                3: '超时',
                4: '已挂断',
                5: '占线未接听', 
            },
        }
    },
   props: {
        callLogData: { // 通话日志数据
            type: Array,
            default: () => { return [] },
        },
    },
    
    computed: {
    },
    watch: {
        callLogData: {
            handler(newVal, oldVal) {

                // if(newVal && newVal.length > 0){
                //     newVal.forEach(item => {
                //         let temp = {
                //             ...item,
                //             callTime: this.setDealTime('HH:mm:ss',item.startTime), // 通话时间
                //         }
                //         list.push(temp);
                //     })
                // }
                this.callLogList = newVal;


                if(this.activeTab != 0){
                    const temp = this.callLogList.filter(item => item.callState == this.activeTab);
                    this.mergeByUserIdAndCallType(temp, this.activeTab);
                }else {
                    this.mergeByUserIdAndCallType(this.callLogList);
                }
                
            },
            deep: true,
            immediate: true
        }
    },
    created() {
        
    },
    mounted() {
        
    },
    methods: {
        // format = 'Y-M-D', value = null
        setDealTime(format = 'Y-M-D', value = null) {
            const minTen = (num) => {
                return num > 9 ? num : "0" + num;
            }
            let d = value ? new Date(value) : new Date();
            const dates = {
                Y: d.getFullYear(),
                M: minTen(d.getMonth() + 1),
                D: minTen(d.getDate()),
                h: minTen(d.getHours()),
                m: minTen(d.getMinutes()),
                s: minTen(d.getSeconds())
            };
            dates['YYYY'] = dates.Y;
            dates['MM'] = dates.M;
            dates['DD'] = dates.D;
            dates['HH'] = dates.h;
            dates['mm'] = dates.m;
            dates['ss'] = dates.s;

            return  format.replace(/YYYY|Y|MM|M|DD|D|HH|h|mm|m|ss|s/g, match => dates[match]);

        },
        /** 
         * @description 切换 tab
         * @param {Number} value tab 的值
         * @return {void}
         * @example changeTab(0) 切换到全部
         * @example changeTab(1) 切换到已接通
         * @example changeTab(2) 切换到未接通
         */
        async changeTab(code) {
            this.activeTab = code;
            if(code != 0){
                const temp = this.callLogList.filter(item => item.callState == code);
                this.mergeByUserIdAndCallType(temp, code);
            }else {
                this.mergeByUserIdAndCallType(this.callLogList);
            }
        },

        /**
         * 合并函数
         * @param {Array} list 原始记录
         * @param {Number} callState 通话状态 1: 已接通 2: 未接通
         * @returns {Array} 合并后的记录（每条带 totalCount）
         */
        mergeByUserIdAndCallType(list, callState) {
            if (!list || !list.length) {
                return [];
            }
            // Map 结构：key = userID + '|' + callType
            const map = new Map();
            list.forEach(record => {

                if (callState && record.callState !== callState) {
                    return;
                }

                const key = `${record.userID}|${record.callType}`;
                const prev = map.get(key);

                // 首次出现或时间更新
                if (!prev || record.startTime > prev.latest.startTime) {
                    map.set(key, {
                        latest: {
                            ...record,
                            callTime: this.setDealTime('HH:mm:ss',record.startTime), // 通话时间
                        },
                        totalCount: (prev ? prev.totalCount : 0) + 1
                    });
                } else {
                    // 仅累加条数
                    prev.totalCount += 1;
                }
            });

            // 把 Map 转成数组
            const temp = Array.from(map.values()).map(({ latest, totalCount }) => ({
                ...latest,
                totalCount,
                showTip: false
            }));
            this.tabLogList = temp;
            this.checkOverflow();
        },

        /**
         * 判断文字是否溢出
         */
        checkOverflow () {
           if (this.checkOverflowNum > 10) {
            this.checkOverflowNum = 0;
            return
           }
           
           this.checkOverflowNum++;
            this.tabLogList.forEach(row => {
                const el = document.getElementById(`${row.userID}userName`);
                // debugger
                if (el) {
                    this.checkOverflowNum = 0;
                    row.showTip = el.scrollWidth > el.clientWidth;   // 写回数据
                } else {
                    setTimeout(() => {
                        this.checkOverflow()
                    }, 500);
                }
            });
        }
    }
}
</script>

<style lang="less" scoped>
.callLog {
    height: 100%;
    width: 100%;
    overflow: hidden;
    background-color: #050E30;
    display: flex;
    flex-direction: column;
    .callLog-head {
        height: 0.4rem;
        width: 100%;
        background: #041646;
        display: flex;
        .callLog-head-item {
            flex: 1;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            span {
                height: 100%;
                display: flex;
                align-items: center;
                font-size: 0.14rem;
                color: #858585;
                position: relative;
               
            }
        }
        
        .callLog-head-itemActive {
            span {
                font-weight: bold;
                font-size: 0.16rem;
                color: #FFFFFF;
                &::after {
                    content: '';
                    position: absolute;
                    width: 100%;
                    height: 0.02rem;
                    background: #FFFFFF;
                    bottom: 0;
                    left: 0;
                }        
            }
                
        }
    }

    .callLog-body {
        flex: 1;
        height: 0;
        overflow-y: auto;
        user-select: none;
        .callLog-body-item {
            height: 0.6rem;
            display: flex;
            border: 1px solid #0D1C55;
            &:last-child {
                border: none;
            }
            .callLog-body-item-name {
                flex: 1.5;
                height: 100%;
                display: flex;
                align-items: center;
                gap: 0.04rem;
                padding-left: 0.1rem;
                box-sizing: border-box;
                overflow: hidden;
                span {
                    font-size: 0.14rem;
                    color: #FFFFFF;
                }
                .callLog-body-item-name-span {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: inline-block;
                    position: relative;      /* 为可选的气泡定位做准备 */
                }
                .iconfont {
                    width: 0.14rem;
                    flex: 0 0 0.14rem;
                    height: 0.14rem;
                    fill: #0794FF;
                }
            }
            .callLog-body-item-cell {
                flex: 1;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                gap: 0.04rem;
                .item-time-cell {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    .time-cell-duration {
                        font-size: 0.14rem;
                        color: #FFFFFF;
                    }
                    .time-cell-no {
                        font-size: 0.14rem;
                        color: #F33434;
                    }
                    &:last-child {
                        font-size: 0.12rem;
                        color: #999999;
                    }
                }
                &:last-child {
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    cursor: pointer;
                    span {
                        font-size: 0.14rem;
                        color: #F8C70B;
                        text-decoration: underline;
                        text-underline-offset: 0.04rem;
                    }
                }
            }
        }
    }
    .noLogData {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        span {
            font-size: 0.14rem;
            color: #858585;
        }
    }
}
</style>