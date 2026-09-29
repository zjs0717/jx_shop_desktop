<template>
	<div class="answerItem" :class="{'disabledResponse': !disabledResponse}">
		
		<div
			class="result answer"
			
		>
			<!-- {{questionDetailsInfo}} -->
			 <slot name="answer" :question="questionDetailsInfo">
				<span class="name" v-if="parentType < 6">
				<rich-text stem="答案："></rich-text>
				</span>
				<span class="name" v-else>
					<rich-text :stem="`第${orderNum}小题答案：`"></rich-text>
				</span>
			 </slot>
			
			<span class="value" v-if="questionDetailsInfo.type != 4">
				<!-- 单选题、多选题 -->
				<rich-text v-if="questionDetailsInfo.type == 1 || questionDetailsInfo.type == 2" :stem="questionDetailsInfo.answer"></rich-text>
				<!-- 判断题 -->
				<rich-text v-if="questionDetailsInfo.type == 3" :stem="`${questionDetailsInfo.answer == 0 ? '✕' : '✓'}`"></rich-text>
				<!-- 主观题 -->
				<rich-text v-if="questionDetailsInfo.type == 5" :stem="questionDetailsInfo.answer"></rich-text>

			</span>
			<!-- 填空题 -->
			<template v-else>
				
				<div v-if="questionDetailsInfo.answer && questionDetailsInfo.answer.length > 0" style="flex: 1;">
					<p
						class="value value-4"
						v-for="(answeritem, index) in questionDetailsInfo.answer"
						:key="index"
					>
					<span >
						<rich-text :stem="`空${index+1}：`"></rich-text>
					</span>
					<span v-if="answeritem.answerKeys && answeritem.answerKeys.length > 0"  style="flex: 1;display: flex;align-items: center;">
						<span class="value-child" v-for="(a, b) in answeritem.answerKeys" :key="b">
						<!-- <span v-if="answeritem.answerKeys.length > 1">
							<rich-text :stem="`（${b+1}）`"></rich-text>
						</span> -->
							<span v-if="b>0">或</span>
							<div class="value">
								<rich-text :stem="a"></rich-text>
							</div>
						</span>
					</span>
					<span v-else>
						<rich-text stem="略"></rich-text>
					</span>
					</p>
				</div>
				<div class="value" v-else>
					<rich-text stem="略"></rich-text>
				</div>
			</template>
		</div>
	</div>
</template>

<script>

	export default {
		name: 'cm-answer-item',
		components: {
			richText:() => import('../questionStem/richText.vue')
		},
		props: {
			// 试题信息
			questionDetails: {
			    type: Object,
			    default: function() {
			      return {};
			    },
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
			
			// 是否禁用响应式 true == 禁用 false == 响应式
			disabledResponse: {
				type: Boolean,
				default: false,
			}
		},
		data() {
			return {
				questionDetailsInfo: {}, // 试题数据
			}
		},
		watch: {
			
			/**
			* 试题改变时触发处理数据函数
			*/
			questionDetails: {
			    handler(val) {
						if (!val) return
						this.questionDetailsInfo = JSON.parse(JSON.stringify(val));
						this.dataHandler();
			      
			    },
			    immediate: true,
			    deep: true,
			},
		},
		created() {
			
		},
		mounted() {
			
		},
		methods: {
			
			/**
			 * 处理数据
			 */
			dataHandler() {
				if (this.questionDetailsInfo.type == "4") {
					// debugger
					if (this.questionDetailsInfo.answerKeys && typeof this.questionDetailsInfo.answerKeys != "object") {
						if (typeof this.questionDetailsInfo.answer == "object") return;
						var obj = JSON.parse(this.questionDetailsInfo.answerKeys);
						
						this.$set(this.questionDetailsInfo, "answer", obj);
					  
					}else {
						const answer = this.questionDetailsInfo.answer
						if(answer && typeof answer != "object"){
							const obj = JSON.parse(answer)
							if(obj.length > 0){
								for(let o of obj){
									o['answerKeys'] = [o.answerValue]
								}
							}
							this.$set(this.questionDetailsInfo, "answer", obj);
						}
					}
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	.answerItem {
		
		/*答案 解析*/
		.result{
			padding: calc(22 * 0.5px) calc(24 * 0.5px) 0;
			&.answer{
				display: flex;
				align-items: baseline;
				.answer_know {
				flex: 1;
				}
				.value{
				flex: 1;
				color: #1C91FF;
				/deep/ span {
					.value-child {
						display: flex;
						color: #1C91FF;
						margin-right: 10px;
					}
				}
				}
				.value-4 {
					display: flex;
				}
		  	}
		}
		/*填空题答案*/
		.blanks-answer {
		  display: flex;
		}
	}
</style>