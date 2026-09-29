<template>
	<div class="questionResult" v-if="isShowBlock('3') || isShowBlock('4') || isShowBlock('6')">
		<div class="questionResult_cell" v-if="isShowBlock('3')">
			<div class="questionResult_cell_title"></div>
			<div class="questionResult_cell_content">
				<answer-item :questionDetails="questions" :parentType="parentType" :orderNum="orderNum"></answer-item>
			</div>
		</div>
		<div class="questionResult_cell" v-if="isShowBlock('4')">
			<div class="questionResult_cell_title questionResult_cell_analysis" :orderNum="orderNum"></div>
			<div class="questionResult_cell_content">
				<analysis-item
					:questionDetails="questions" 
					:orderNum="orderNum"
					:parentType="parentType">
				</analysis-item>	
			</div>
		</div>
	</div>
</template>

<script>
	import analysisItem from './analysisItem.vue'; // 试题解析组件
	import answerItem from './answerItem.vue'; // 试题答案组件
	export default {
		name: 'cm-question-result',
		components: {
			analysisItem,
			answerItem
		},
		options: { styleIsolation: 'shared' },
		props: {
			
			// 试卷状态，0 预览  1 做答中 2 作答完成
			paperState: {
				type: String | Number,
				default: 0,
			},
			// 试题信息
			questions: {
				type: Object,
				default: () => null
			},
			
			// 大题题型
			parentType: {
				type: String | Number,
				default: ''
			},
			/**
			 * 试题序号
			 */
			orderNum: {
			  type: String | Number,
			  default: ''
			},
			/**
			 * 区分展示题干/选项/答案/解析
			 * 为空 => 全部展示
			 * 3 => 答案
			 * 4 => 解析
			 * 6 => 用户作答结果
			 */
			showBlock: {
				type: String,
				default: ''
			},
		},
		data() {
			return {
			}
		},
		computed: {
			
			
			/**
			 * 区分展示题干/作答/答案/解析
			 * 为空 => 全部展示
			 * 3 => 答案
			 * 4 => 解析
			 * 6 => 用户作答结果
			 */
			isShowBlock() {
			  return function(val) {
				let temp = true;
				if (this.showBlock.indexOf(val) > -1 || !this.showBlock) {
					temp = true;
				} else {
					temp = false;
				}
				return temp;
			  }
			},
		},
		watch: {
			
		},
		created() {
			
		}
	}
</script>

<style lang="less">
	.questionResult {
		
		margin: 10px calc(30 * 0.5px);
		border-radius: 8px;
		// border: 1px solid #000C30;
		background: #FFFFFF;
		border-radius: calc(8 * 0.5px);
		padding: 0 0 20px 0;
		box-sizing: border-box;
		.questionResult_cell {
			margin-bottom: calc(20 * 0.5px);
			&:last-child {
				margin-bottom: calc(0 * 0.5px);
			}
			.questionResult_cell_title {
				height: calc(36 * 0.5px);
				width: calc(120 * 0.5px);
				display: none;
			}
			.questionResult_cell_analysis {
				background-position: -calc(35 * 0.5px) -calc(621 * 0.5px);
			}
			.questionResult_cell_content {
				box-sizing: border-box;
				
				font-size: 16px;
				color: #000C30;
				/deep/ .answerItem, .analysisItem {
					.result, .analysis {
						padding: 0;
						.name {
							display: none;
						}
						.value {
							font-size: 32px;
							color: #000C30;
						}
					}
					.mpHtmlBox {
						color: #000C30 !important;
						text, div {
							color: #000C30 !important;
						}
					}
				}
				
			}
			
		}
	}
</style>