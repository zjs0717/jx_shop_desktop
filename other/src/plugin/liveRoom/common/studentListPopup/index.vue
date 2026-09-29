<template>
  <div class="studentListPopup">
	<div class="studentListPopup-container">
		<div class="studentListPopup-header">
			<span class="studentListPopup-header-left">选择人数：{{checkStu.length}}/{{ studentList.length }}</span>
			<div class="studentListPopup-header-right">
				<el-input class="seartInput" prefix-icon="el-icon-search" v-model="searchName" placeholder="请输入学生姓名" clearable></el-input>
				<svg class="iconfont studentListPopup-icon" aria-hidden="true" @click="$emit('close')">
					<use xlink:href="#iconcuohao"></use>
				</svg>
			</div>

		</div>
		<div class="studentListPopup-content">
			<div 
				class="studentListPopup-content-item"
				:class="{ 'studentListPopup-content-item-active': item.isChecked }" 
				v-for="(item, index) in studentList" 
				:key="index"
				v-if="!searchName || searchName && (item.userName || item.nick_name).indexOf(searchName) !== -1"
			>
			<!-- 不在线的禁止选中连麦 -->
				<el-checkbox 
					v-model="item.isChecked" 
					@change="changeHandle($event, item, true)"
					:disabled="!onLineStuUserTemp[item.userID || item.uid]"
				>
					{{ item.userName || item.nick_name || ''}}{{ !onLineStuUserTemp[item.userID || item.uid] ? '(离线)' : '' }}
				</el-checkbox>
			</div>
		</div>
		<div class="studentListPopup-footer">
			<el-checkbox v-model="allChecked" @change="changeHandle($event, null, false)">全选</el-checkbox>
			<!-- <span class="studentListPopup-footer-tip">备注：未选择时，学生带白色边框，选择后，白框消失</span> -->
			<div class="studentListPopup-footer-send" @click="lineMoreStu">发送</div>
		</div>
	</div>


  </div>


</template>

<script>
export default {
	name: 'cmStudentList',
	inject: ['thisParent', 'zegoLiveRoom', 'commonVideoRoomThis'],
	data () {
		return {
			searchName: '', // 搜索学生姓名
			allChecked: false, // 是否全选
			studentList: [], // 学生列表
			checkStu: [], // 已选择的学生列表

		}
	},
	computed: {
		allStuStreamList() {
			return this.commonVideoRoomThis.allStuStreamList
		},
		// 当前在线学生
		onLineStuUserTemp() {
            return this.commonVideoRoomThis.onLineStuUserTemp
        }
	},
	watch: {
		allStuStreamList: {
			handler(newVal, oldVal) {
				let temp = []
				if(newVal){
					// const callLogTemp = this.commonVideoRoomThis.callLogTemp;
					newVal.forEach(item => {
						temp.push({
							isChecked: false,
							...(item.user || {})
						})
					})
				}
				this.studentList = temp
			},
			deep: true,
			immediate: true,
		},
	},
	created(){

	},
	methods: {
		changeHandle(e, item, isSingle) {
			let checkList = this.studentList.filter(item => item.isChecked);
			this.checkStu = checkList;
			if(isSingle) {
				let canCheckList = this.studentList.filter(item => this.onLineStuUserTemp[item.userID || item.uid]);
				this.allChecked = canCheckList.length > 0 && checkList.length === canCheckList.length ? true : false;
			} else {
				this.studentList.forEach(item => {
					if(this.onLineStuUserTemp[item.userID || item.uid]){
						item.isChecked = e
					}
				})
			}
		},
		// 连线更多学生
		lineMoreStu(){
			let list = this.studentList.filter(item => item.isChecked) || [];
			if(!list.length){
				this.$message.warning('请选择学生')
				return
			}
			this.$emit('lineMoreStu', list)
		},
		// 关闭弹窗
		closeHandle() {
			this.$emit('close')
		},
	}
}
</script>

<style lang="less" scoped>
.studentListPopup {	
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, .3);
  z-index: 113;
  display: flex;
  align-items: center;
  justify-content: center;
  .studentListPopup-container {
	display: flex;
	flex-direction: column;
    width: 12rem;
	height: 5.98rem;
	background: #FFFFFF;
	box-shadow: 0rem 0rem 0rem 0rem rgba(0,0,0,0.15);
	border-radius: 0.04rem;
	.studentListPopup-header {
		width: 100%;
		height: 0.56rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 0.5rem;
		box-sizing: border-box;
		.studentListPopup-header-left {
			font-size: 0.14rem;
			color: #000000;
		}
		.studentListPopup-header-right {
			display: flex;
    		align-items: center;
			.studentListPopup-icon {
				width: 0.24rem;
				height: 0.24rem;
				fill: #5E5E5E;
				margin-left: 0.38rem;
				cursor: pointer;
			}
			/deep/ .el-input {
                border-radius: 0.04rem;
                font-size: 0.14rem;
                .el-input__inner {
					width: 2.4rem;
                    height: 0.32rem;
                    // border: 1px solid #0D1D55;
                    background: #F4F5F8;
                    color: #000;
                    font-size: 0.14rem;
                }
            }
            
            /deep/ .el-input__prefix, .el-input__suffix {
                .el-input__icon {
                    line-height: 1;
                    width: 0.25rem;
                }
            }
            /deep/ .el-input--prefix .el-input__inner {
                padding-left: 0.3rem;
            }
            
            /deep/ .el-input--suffix .el-input__inner {
                padding-right: 0.3rem;
            }
            /deep/ .el-input__prefix {
                left: 0.05rem;
                .el-input__inner {
                    padding-left: 0.3rem;
                }
            }
		}
	}
	.studentListPopup-content {
		width: 100%;
		flex: 1;
		height: 0;
		overflow-y: auto;
		background: #F6F6F7;
		white-space: pre-wrap;
		padding: 0.26rem 0rem;
		box-sizing: border-box;
		.studentListPopup-content-item {
			display: inline-block;
			background: #FFFFFF;
			border-radius: 0.04rem;
			margin-right: 0.18rem;
			margin-left: 0.18rem;
			margin-bottom: 0.1rem;
			
		}
		.studentListPopup-content-item:nth-child(6n) {
			// margin-right: 0;
		}
		.studentListPopup-content-item-active {
			background: unset;
		}
	}
	.studentListPopup-footer {
		width: 100%;
		height: 0.68rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 0.5rem 0 0.34rem;
		box-sizing: border-box;
		.studentListPopup-footer-tip {
			font-size: 0.14rem;
			color: #FF3B30;
		}
		.studentListPopup-footer-send {
			width: 2.6rem;
			height: 0.4rem;
			line-height: 0.4rem;
			background: #396CFF;
			border-radius: 0.04rem;
			font-size: 0.16rem;
			color: #FFFFFF;
			text-align: center;
			cursor: pointer;
		}
	}
	/deep/ .el-checkbox {
		display: flex;
		align-items: center;
		box-sizing: border-box;
		padding-left: 0.16rem;
		width: 1.6rem;
		height: 0.38rem;
		.el-checkbox__label {
			color: #101010;
			font-size: 0.14rem;
		}
	}
	/deep/ .el-checkbox.is-checked  {
		.el-checkbox__inner {
			background-color: #396CFF;
			border-color: #396CFF;
		}
		.el-checkbox__label {
			
			color: #396CFF;
		
		}
	}
  }
}

</style>