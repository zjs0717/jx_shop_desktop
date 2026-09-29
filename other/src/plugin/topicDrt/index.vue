<template>
    <div class="topicDrt" :class="{'disabledResponse': !disabledResponse}" >
        
        <div  @click="topicBtn" class="topicDrt-content" :class="{'topicDrt-compound': type > 5}">
            <span v-if="orderNum">
                <rich-text :stem="topicSmall ? `（${orderNum}）` : `${orderNum}.&nbsp;&nbsp;`"></rich-text>
            </span>
            <div class="content_body" :class="{'content_body_type': showType || showLowerType}">

                <span class="topicDrt_type" v-if="showType || showLowerType">
                    <!-- <rich-text :stem="questionType(type)"></rich-text> -->
                    
                    <span>{{questionType(type)}}</span>
                </span>
                <rich-text :showType="showType" :showLowerType="showLowerType" :stem="stem"></rich-text>
            </div>
        </div>
        <div v-if="blankStemShowTip" class="blankStemShowTip">&nbsp;&nbsp;【本题如含拼音考查，请先在纸上作答，确认无误后再录入系统】</div>
    </div>
</template>

<script>
import richText from '../questionStem/richText.vue';
export default {
    name: 'cm-topic-drt',
    components: {
        richText
    },
    props: {
        /**
         * 题干数据
         */
        stem: {
            type: String,
            default: ''
        },
        /**
         * 题序号
         */
        orderNum: {
            type: String | Number,
            default: 1
        },
        /**
         * 是否是小题
         */
        topicSmall: {
            type: Boolean,
            default: false
        },
        /**
         * 题型
         */
        type: {
            type: String | Number,
            default: "",
        },
        /**
         * 是否展示题型
         */
        showType: {
            type: Boolean,
            default: false
        },
        
        // 试卷状态，0 预览  1 做答中 2 作答完成 3 缓存作答
        paperState: {
            type: Number | String,
            default: 0,
        },
        /**
         * 是否展示复合小题题型
         */
        showLowerType: {
            type: Boolean,
            default: false
        },
        
        // 是否禁用响应式 true == 禁用 false == 响应式
        disabledResponse: {
            type: Boolean,
            default: false,
        },
        blankStemShowTip: {
            type: Boolean,
            default: false,
        }
    },
    data() {
        return {
            url: null,
            errorNum: 3,
            targetimgdata: false,
            dataSet: {
                width: '100%', // 图片容器高
                height: '100%', // 图片容器宽
                urlList: [
                    { // 图片路径
                        url: null,
                    }
                ],
                wheel: true, // 是否允许滚轮缩放大小
                automatic: null, // 是否允许自动切换, 自动切换时间
                preNext: false, // 是否展示上一张和下一张按钮
                operate: false, // 是否展示放大缩小旋转重置按钮
                move: true, // 是否允许拖动
            }
        }
    },
    watch: {
        stem(val) {
        }
    },
    mounted() {
        // window.errorImg = this.errorImg

    },
	methods: {
        // 点击题干打开图片
        topicBtn (event) {
            if (this.paperState == 3){
                this.$emit('imgBtn', event.target.src)
            };
            // let targetimg = event.target.src,
            //     targetdata = event.target.nodeName
            //     // this.targetimgdata = true
            //     // this.dataSet.urlList[0].url = 'http://iwrong-static.xinguoren.cn/resources_v3/csb20456_csb20555.files/image102.png'
            // if (targetdata.toLowerCase() == 'img') {
            //     this.targetimgdata = true;
            //     this.dataSet.urlList[0].url = targetimg

            // }
        },
        // 图片加载失败回调
        errorImg (err) {
            if (this.errorNum<0) {
                // document.removeEventListener('error',this.handel)
                return
            } else {
                err.src = err.src
                this.errorNum--
            }
        },
        // 图片加载失败回调
        handel (err) {
            this.errorImg(err)
        },
    }
}
</script>

<style lang="scss" scoped>


.topicDrt {
    white-space: pre-wrap;
    word-break: break-word;
    color: #3C3C3C;
    display: flex;
    flex-direction: column;
    font-size: 14px ;
    line-height: 24px;
    padding: 0px 24px 0;
    box-sizing: border-box;
    .topicDrt-content {
        display: flex;
        align-items: baseline;
        .content_body {
            position: relative;
            display: flex;
            flex: 1;
            width: 0;
            .topicDrt_type {
                padding: 0 5px;
                position: absolute;
                display: inline-block;
                background: var(--color9);
                border-radius: 4px; 
                color: var(--color8);
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 14px;
                display: inline-block;
                line-height: initial;
                white-space: pre-wrap;
                word-break: break-word;
                font-size: 14px;
            }
        }
        .content_body_type {
            .richTextContainer {

                text-indent: 3em;
            }
        }
    }
    .topicDrt-compound {
        margin-bottom: 10px;
    }
    .blankStemShowTip {
        font-size: var(--fontSize);
        color: #ff6158;
        // font-weight: bold;
    }
}

@media screen and (max-width: 1024px) {
    .topicDrt.disabledResponse {
        font-size: 15px;
        line-height: 20px;
        padding: 7.5px 12px 0;
    }
}
@media screen and (min-width: 760px) and (max-width: 850px) {
    .topicDrt.disabledResponse {
        padding: 20px 12px 0;
        font-size: 24px;
        line-height: 40px ;
    }
}
@media screen and (min-width: 850px) and (max-width: 1280px) {
    .topicDrt.disabledResponse {
        padding: 20px 12px 0;
        font-size: 19px;
        line-height: 40px ;
    }
}
</style>
