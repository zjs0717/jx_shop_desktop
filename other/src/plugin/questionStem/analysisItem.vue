<template>
	<div class="analysisItem" :class="{'disabledResponse': !disabledResponse}">
		<div class="result analysis">
		    
			<slot name="analysis" :question="questionDetails">

				<div class="name" v-if="parentType < 6">
					<rich-text stem="解析："></rich-text>
				</div>
				<div class="name" v-else>
					<rich-text :stem="`第${orderNum}小题解析：`"></rich-text>
				</div>
			</slot>
			
			<div class="value" v-if="!questionDetails.quesAnalyze || !JSON.parse(questionDetails.quesAnalyze).length">
				<rich-text stem="暂无解析"></rich-text>
			</div>
			<div v-else class="analysis_info"> 
				  <div 
					v-for="(item, inx) in JSON.parse(questionDetails.quesAnalyze)" 
					:key="inx"
					class="value" >
					<span v-if="item.analyzeKey">
						<rich-text :stem="item.analyzeKey"></rich-text>
					</span>
					
					
					<rich-text :stem="item.analyzeValue"></rich-text>
				  </div>
			  
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'cm-analysis-item',
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
				
			}
		},
		created() {
			
		},
		mounted() {
			
		},
		methods: {
			
		}
	}
</script>

<style lang="less" scoped>
	.analysisItem {
		
		/*答案 解析*/
		.result{
			padding: calc(22 * 0.5px) calc(24 * 0.5px) 0;
			display: flex;
			.value{
				flex: 1;
			}
			
			.analysis_info {
				flex: 1;
				.value {
					display: flex;
					span:first-child {
						margin-right: calc(20 * 0.5px);
					}
					span:last-child {
						flex: 1;
					}
				}
			}
		}
	}
	
</style>