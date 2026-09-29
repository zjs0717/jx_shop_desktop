<template>
    <div class="doPaper taskBody">
        <div class="doPaper-content" :style="{ '--fontSize': fontSizeNum + 'px' }">
            <cm-all-stem 
                ref="allStem" 
                :disabledResponse="true"
                :paperDetails="paperDetails"
                :paperState="0"
                :recordTime="cacheData ? cacheData.recordTime : 0"
                :readTime="cacheData ? cacheData.readTime : 0"
                @fontSizeChange="fontSizeChange"
			    @updataAnswer="updataAnswerHandler"
                @start="startHandler"
                @goBack="goBackHandler"
                @slideChangeEnd="slideChangeEndHandler"
                @submit="submitHandler">
            </cm-all-stem>
        </div>
    </div>
</template>

<script>
// import $http from "@/service/customPlan.js";
// import { submitTask } from '../static/js/publicMethod.js'; // 公共方法
export default {
    name: 'doPaper',
    data() {
        return {
            paperDetails: {}, // 试题信息
            paperState: 0, // 作答状态
            userInfo: null, // 用户信息
			submitCon: {}, //提交内容
			cacheData: null, // 作答记录
            planNode: {}, // 方案节点信息
            fontSizeNum: 14, // 字体大小
        }
    },
    computed: {
    },
    watch: {
        // '$store.state.planDataDetails': {
        //     handler(val) {
        //         if (!this.planNode || !this.planNode.nodeType) {
        //             this.planNode = val;
        //             if(!this.paperDetails.bigQuestions && (this.planNode.currNodeType || this.planNode.nodeType))this.init();
        //         }
                
        //     },
        //     immediate: true,
        //     deep: true
        // },
        // sharedData(val){
        //     if(val){
        //         //处理事件
        //         this.eventMap15&&this.eventMap15[val.event]&&this.eventMap15[val.event](val.params)
        //     }
        // }
    },
    created() {
        // if(this.$route.query.type =='preview'){
        //     this.paperState = 0;
        // }else if(this.$route.query.type =='startAnswer'){
            this.paperState = 1;
            this.paperHadler()
        // }
        //事件映射
        // this.eventMap15={
        //     switchQuestion:(params)=>{
        //         const { eventId, num } = params;
        //         if(this.planNode.eventId == eventId){
        //             this.$refs.allStem&&this.$refs.allStem.mySwiper.slideTo(num, 500, false)
        //         }
        //     },
        //     openPaper:(params)=>{
        //         const { type , eventId} = params;
        //         if(eventId == this.planNode.eventId){
        //             if(type == 'answer'){
        //                 this.paperState = 1;
        //             }
        //         }
        //     },
        // }
    },
    mounted() {
    },
    beforeDestroy() {
        
    },
    methods: {

        async init() {
            // this.userInfo = this.localData.get("web");

			// this.getCache();
        },

        /**
         * 处理试题数据，缓存回显
         */
        async paperHadler() {
            let paperInfo = {
    "httpCode": 200,
    "code": "000000",
    "message": "成功",
    "runTime": null,
    "paperId": "0c05eb93466d4bb1b3f76bc379a297df",
    "paperName": "一年级数学 上学期“认识立体图形”模块测评卷（人教版）",
    "gradeCode": "11",
    "subjectCode": "2",
    "totalScore": 100.0,
    "standardScore": 60.0,
    "standardTime": 15,
    "bookCode": null,
    "createName": null,
    "createDate": null,
    "updateName": null,
    "updateDate": null,
    "difficultyCode": 1,
    "productId": "3b881f4878694e8b81a0399db794cf5e",
    "releaseStatus": 1,
    "releaseDate": null,
    "releaseName": null,
    "bookTypeCode": "170a286029b24ed78626c5203fc1c816",
    "bookTypeName": "人教新课标版",
    "applyScene": "1,6",
    "usageScene": "8a2a746856a0fb1d0156c1b5d6c831cd",
    "paperTypeCode": "p_000",
    "paperTypeName": "单元/模块试卷",
    "areaCode": null,
    "areaName": null,
    "printUrl": null,
    "printName": null,
    "questionNum": 10,
    "bigQuestions": [
        {
            "bigId": "a00ec10e80704c6b902bef942f993064",
            "bigTitle": "单选题",
            "bigScore": 100.0,
            "bigSort": 1,
            "bigType": "1",
            "paperId": "daa9dd18e58f446681a3ab0ff12aa46f",
            "createName": null,
            "createDate": null,
            "updateName": null,
            "updateDate": null,
            "smallQuestions": [
                {
                    "smallId": "785e5ff12afd47b58d45401ff5390da8",
                    "smallScore": 10.0,
                    "smallSort": 1,
                    "smallType": "1",
                    "bigId": null,
                    "subjectCode": "2",
                    "questionCode": "2e0ae3823d4a41878be0e0acbd89be2e",
                    "createName": null,
                    "createDate": null,
                    "updateName": null,
                    "updateDate": null,
                    "halfScore": 0.0,
                    "id": "2e0ae3823d4a41878be0e0acbd89be2e",
                    "title": null,
                    "stem": "&nbsp;http://iwrong-static.xinguoren.cn/resources_v3/xsa21355_xsa21366.files/image002.png数一数左图有（&nbsp;&nbsp;&nbsp;）块积木。",
                    "quesOption": "[{\"optionKey\":\"A\",\"optionValue\":\"9\"},{\"optionKey\":\"B\",\"optionValue\":\"&nbsp;10\"},{\"optionKey\":\"C\",\"optionValue\":\"11\"}]",
                    "quesAnalyze": "[{\"analyzeKey\":\"\",\"analyzeValue\":\"图中积木一共有三层，最上面一层有1块积木，中间层有1块积木，下面一层有8块积木，其中有1块被挡住了，所以一共有1+1+8=10（块）积木\"}]",
                    "answer": "B",
                    "type": "1",
                    "stageCode": null,
                    "subjectFlag": null,
                    "subjectName": null,
                    "gradeCode": null,
                    "score": 2.0,
                    "costTime": null,
                    "productionCode": null,
                    "enlargeId": "402881c5529ab64101529b4b3ea2002a",
                    "productId": null,
                    "productType": null,
                    "videoPath": null,
                    "difficultyCode": null,
                    "graph": null,
                    "ability": null,
                    "answerKeys": null,
                    "questionChildType": null,
                    "streamMedias": [],
                    "questionAnalyzeType": 0,
                    "baseKnowledgeModels": [
                        {
                            "baseProductionCode": "0009000400010002",
                            "baseProductType": "fangfayunyonglei",
                            "baseProductionName": "数小正方体个数",
                            "baseKnowledgeCode": "000900040001",
                            "baseKnowledgeName": "观察多个小正方体",
                            "bookProductionCode": "6657000011000001000002",
                            "bookProductionName": "数小正方体个数",
                            "bookKnowledgeCode": "6657000011000001",
                            "bookKnowledgeName": "认识立体图形",
                            "questionId": "2e0ae3823d4a41878be0e0acbd89be2e",
                            "baseProductionIndex": null,
                            "score": 10.0,
                            "isTrue": true
                        }
                    ],
                    "componentQuestionModels": []
                },
                {
                    "smallId": "226d37ff4f7b4e82b3070f3a405ca677",
                    "smallScore": 10.0,
                    "smallSort": 2,
                    "smallType": "1",
                    "bigId": null,
                    "subjectCode": "2",
                    "questionCode": "493ee74358e2404096788ac78b4a1561",
                    "createName": null,
                    "createDate": null,
                    "updateName": null,
                    "updateDate": null,
                    "halfScore": 0.0,
                    "id": "493ee74358e2404096788ac78b4a1561",
                    "title": null,
                    "stem": "下图中有（ &nbsp; &nbsp; &nbsp;）个长方体。<br>http://iwrong-static.xinguoren.cn/2019227/15512501231510322.png",
                    "quesOption": "[{\"optionKey\":\"A\",\"optionValue\":\"2\"},{\"optionKey\":\"B\",\"optionValue\":\"3\"},{\"optionKey\":\"C\",\"optionValue\":\"4\"}]",
                    "quesAnalyze": "[{\"analyzeKey\":\"\",\"analyzeValue\":\"类似于http://iwrong-static.xinguoren.cn/2017117/15100434362327540.png形状的叫做长方体，通过观察和计数，发现图中有3个长方体，分别是http://iwrong-static.xinguoren.cn/2017117/15100434854154033.png、http://iwrong-static.xinguoren.cn/2017117/15100434943854235.png、http://iwrong-static.xinguoren.cn/2017117/15100435430476217.png。\"}]",
                    "answer": "B",
                    "type": "1",
                    "stageCode": null,
                    "subjectFlag": null,
                    "subjectName": null,
                    "gradeCode": null,
                    "score": 2.0,
                    "costTime": null,
                    "productionCode": null,
                    "enlargeId": "402881c5529ab64101529b4b3ea2002a",
                    "productId": null,
                    "productType": null,
                    "videoPath": null,
                    "difficultyCode": null,
                    "graph": null,
                    "ability": null,
                    "answerKeys": null,
                    "questionChildType": null,
                    "streamMedias": [],
                    "questionAnalyzeType": 0,
                    "baseKnowledgeModels": [
                        {
                            "baseProductionCode": "0009000100010002",
                            "baseProductType": "fangfayunyonglei",
                            "baseProductionName": "区分立体图形",
                            "baseKnowledgeCode": "000900010001",
                            "baseKnowledgeName": "区分图形",
                            "bookProductionCode": "6657000011000001000001",
                            "bookProductionName": "区分立体图形",
                            "bookKnowledgeCode": "6657000011000001",
                            "bookKnowledgeName": "认识立体图形",
                            "questionId": "493ee74358e2404096788ac78b4a1561",
                            "baseProductionIndex": null,
                            "score": 10.0,
                            "isTrue": true
                        }
                    ],
                    "componentQuestionModels": []
                },
                {
                    "smallId": "d7fee5cbf8834fb49e982dd80cff6675",
                    "smallScore": 10.0,
                    "smallSort": 3,
                    "smallType": "1",
                    "bigId": null,
                    "subjectCode": "2",
                    "questionCode": "ff8080815f70531c015f958bea58076f",
                    "createName": null,
                    "createDate": null,
                    "updateName": null,
                    "updateDate": null,
                    "halfScore": 0.0,
                    "id": "ff8080815f70531c015f958bea58076f",
                    "title": null,
                    "stem": "数一数，填一填。\nhttp://iwrong-static.xinguoren.cn/2017117/15100423633851945.png\n（ &nbsp; &nbsp; &nbsp;）个",
                    "quesOption": "[{\"optionKey\":\"A\",\"optionValue\":\"4\"},{\"optionKey\":\"B\",\"optionValue\":\"5\"},{\"optionKey\":\"C\",\"optionValue\":\"6\"}]",
                    "quesAnalyze": "[{\"analyzeKey\":\"\",\"analyzeValue\":\"给出一些小正方体，要数一数有多少个，一层一层数（注意被挡住的个数），先数最上面的一行，有1个小正方体，即为1；再数中间的小正方体，个数是1个，即为2；最后数最下面一层正方体，个数为3，依次为3、4、5，所以这个立体图形是由5个小正方体组成的，用数字5表示。\"}]",
                    "answer": "B",
                    "type": "1",
                    "stageCode": null,
                    "subjectFlag": null,
                    "subjectName": null,
                    "gradeCode": null,
                    "score": 2.0,
                    "costTime": null,
                    "productionCode": null,
                    "enlargeId": "402881c5529ab64101529b4b3ea2002a",
                    "productId": null,
                    "productType": null,
                    "videoPath": null,
                    "difficultyCode": null,
                    "graph": null,
                    "ability": null,
                    "answerKeys": null,
                    "questionChildType": null,
                    "streamMedias": [],
                    "questionAnalyzeType": 0,
                    "baseKnowledgeModels": [
                        {
                            "baseProductionCode": "0009000400010002",
                            "baseProductType": "fangfayunyonglei",
                            "baseProductionName": "数小正方体个数",
                            "baseKnowledgeCode": "000900040001",
                            "baseKnowledgeName": "观察多个小正方体",
                            "bookProductionCode": "6657000011000001000002",
                            "bookProductionName": "数小正方体个数",
                            "bookKnowledgeCode": "6657000011000001",
                            "bookKnowledgeName": "认识立体图形",
                            "questionId": "ff8080815f70531c015f958bea58076f",
                            "baseProductionIndex": null,
                            "score": 10.0,
                            "isTrue": true
                        }
                    ],
                    "componentQuestionModels": []
                },
                {
                    "smallId": "6f662db8401d49a9bc68b0e6785e1d47",
                    "smallScore": 10.0,
                    "smallSort": 4,
                    "smallType": "1",
                    "bigId": null,
                    "subjectCode": "2",
                    "questionCode": "ff8080815f70531c015f958ee3450780",
                    "createName": null,
                    "createDate": null,
                    "updateName": null,
                    "updateDate": null,
                    "halfScore": 0.0,
                    "id": "ff8080815f70531c015f958ee3450780",
                    "title": null,
                    "stem": "数一数，填一填。\nhttp://iwrong-static.xinguoren.cn/2017117/15100425419937589.png\n（ &nbsp; &nbsp; &nbsp;）个",
                    "quesOption": "[{\"optionKey\":\"A\",\"optionValue\":\"6\"},{\"optionKey\":\"B\",\"optionValue\":\"7\"},{\"optionKey\":\"C\",\"optionValue\":\"8\"}]",
                    "quesAnalyze": "[{\"analyzeKey\":\"\",\"analyzeValue\":\"给出一些小正方体，要数一数有多少个，一层一层数（注意被挡住的个数），先数最上面的一层正方体，个数是1，即为1；再数中间一层的正方体，个数是2个，依次即为2、3，最后数最下面的那层正方体，有4个，依次即为4、5、6、7，那么这个正方体是由7个小正方体组成的，用数字7表示。\"}]",
                    "answer": "B",
                    "type": "1",
                    "stageCode": null,
                    "subjectFlag": null,
                    "subjectName": null,
                    "gradeCode": null,
                    "score": 2.0,
                    "costTime": null,
                    "productionCode": null,
                    "enlargeId": "402881c5529ab64101529b4b3ea2002a",
                    "productId": null,
                    "productType": null,
                    "videoPath": null,
                    "difficultyCode": null,
                    "graph": null,
                    "ability": null,
                    "answerKeys": null,
                    "questionChildType": null,
                    "streamMedias": [],
                    "questionAnalyzeType": 0,
                    "baseKnowledgeModels": [
                        {
                            "baseProductionCode": "0009000400010002",
                            "baseProductType": "fangfayunyonglei",
                            "baseProductionName": "数小正方体个数",
                            "baseKnowledgeCode": "000900040001",
                            "baseKnowledgeName": "观察多个小正方体",
                            "bookProductionCode": "6657000011000001000002",
                            "bookProductionName": "数小正方体个数",
                            "bookKnowledgeCode": "6657000011000001",
                            "bookKnowledgeName": "认识立体图形",
                            "questionId": "ff8080815f70531c015f958ee3450780",
                            "baseProductionIndex": null,
                            "score": 10.0,
                            "isTrue": true
                        }
                    ],
                    "componentQuestionModels": []
                },
                {
                    "smallId": "a49ed68f29b442ac8d0d05bfbc00a6ca",
                    "smallScore": 10.0,
                    "smallSort": 5,
                    "smallType": "1",
                    "bigId": null,
                    "subjectCode": "2",
                    "questionCode": "ff8080815f70531c015f959857910792",
                    "createName": null,
                    "createDate": null,
                    "updateName": null,
                    "updateDate": null,
                    "halfScore": 0.0,
                    "id": "ff8080815f70531c015f959857910792",
                    "title": null,
                    "stem": "下图中有（ &nbsp; &nbsp; &nbsp;）个圆柱体。<br>http://iwrong-static.xinguoren.cn/2017117/15100431987823382.png",
                    "quesOption": "[{\"optionKey\":\"A\",\"optionValue\":\"2\"},{\"optionKey\":\"B\",\"optionValue\":\"3\"},{\"optionKey\":\"C\",\"optionValue\":\"4\"}]",
                    "quesAnalyze": "[{\"analyzeKey\":\"\",\"analyzeValue\":\"类似于http://iwrong-static.xinguoren.cn/2017117/15100432420936650.png形状的叫做圆柱，通过观察和计数，发现图中有3个圆柱体，即http://iwrong-static.xinguoren.cn/2017117/15100432807866210.png、http://iwrong-static.xinguoren.cn/2017117/15100432894005100.png、http://iwrong-static.xinguoren.cn/2017117/15100433057798006.png。\"}]",
                    "answer": "B",
                    "type": "1",
                    "stageCode": null,
                    "subjectFlag": null,
                    "subjectName": null,
                    "gradeCode": null,
                    "score": 2.0,
                    "costTime": null,
                    "productionCode": null,
                    "enlargeId": "402881c5529ab64101529b4b3ea2002a",
                    "productId": null,
                    "productType": null,
                    "videoPath": null,
                    "difficultyCode": null,
                    "graph": null,
                    "ability": null,
                    "answerKeys": "[]",
                    "questionChildType": null,
                    "streamMedias": [],
                    "questionAnalyzeType": 0,
                    "baseKnowledgeModels": [
                        {
                            "baseProductionCode": "0009000100010002",
                            "baseProductType": "fangfayunyonglei",
                            "baseProductionName": "区分立体图形",
                            "baseKnowledgeCode": "000900010001",
                            "baseKnowledgeName": "区分图形",
                            "bookProductionCode": "6657000011000001000001",
                            "bookProductionName": "区分立体图形",
                            "bookKnowledgeCode": "6657000011000001",
                            "bookKnowledgeName": "认识立体图形",
                            "questionId": "ff8080815f70531c015f959857910792",
                            "baseProductionIndex": null,
                            "score": 10.0,
                            "isTrue": true
                        }
                    ],
                    "componentQuestionModels": []
                },
                {
                    "smallId": "f4b4f73ad81e44168a803028838b0d5a",
                    "smallScore": 10.0,
                    "smallSort": 6,
                    "smallType": "1",
                    "bigId": null,
                    "subjectCode": "2",
                    "questionCode": "015c5b1f4b0a460a94b95f96cfde551b",
                    "createName": null,
                    "createDate": null,
                    "updateName": null,
                    "updateDate": null,
                    "halfScore": 0.0,
                    "id": "015c5b1f4b0a460a94b95f96cfde551b",
                    "title": null,
                    "stem": "http://iwrong-static.xinguoren.cn/resources_v3/xsa40601_xsa40700.files/image006.jpg\n看图&nbsp;，数一数&nbsp;，有(&nbsp;&nbsp;&nbsp;&nbsp;)个球体。",
                    "quesOption": "[{\"optionKey\":\"A\",\"optionValue\":\"5\"},{\"optionKey\":\"B\",\"optionValue\":\"6\"},{\"optionKey\":\"C\",\"optionValue\":\"7\"}]",
                    "quesAnalyze": "[{\"analyzeKey\":\"A\",\"analyzeValue\":\"一共有6个球体，此选项错误。&nbsp;\"},{\"analyzeKey\":\"B\",\"analyzeValue\":\"http://iwrong-static.xinguoren.cn/resources_v3/xsa40601_xsa40700.files/image010.jpg如图，数一数&nbsp;，一共有6个球体，此选项正确。&nbsp;\"},{\"analyzeKey\":\"C\",\"analyzeValue\":\"一共有6个球体，此选项错误。\"}]",
                    "answer": "B",
                    "type": "1",
                    "stageCode": null,
                    "subjectFlag": null,
                    "subjectName": null,
                    "gradeCode": null,
                    "score": 2.0,
                    "costTime": null,
                    "productionCode": null,
                    "enlargeId": "402881c5529ab64101529b4b3ea2002a",
                    "productId": null,
                    "productType": null,
                    "videoPath": null,
                    "difficultyCode": null,
                    "graph": null,
                    "ability": null,
                    "answerKeys": null,
                    "questionChildType": null,
                    "streamMedias": [],
                    "questionAnalyzeType": 0,
                    "baseKnowledgeModels": [
                        {
                            "baseProductionCode": "0009000100010002",
                            "baseProductType": "fangfayunyonglei",
                            "baseProductionName": "区分立体图形",
                            "baseKnowledgeCode": "000900010001",
                            "baseKnowledgeName": "区分图形",
                            "bookProductionCode": "6657000011000001000001",
                            "bookProductionName": "区分立体图形",
                            "bookKnowledgeCode": "6657000011000001",
                            "bookKnowledgeName": "认识立体图形",
                            "questionId": "015c5b1f4b0a460a94b95f96cfde551b",
                            "baseProductionIndex": null,
                            "score": 10.0,
                            "isTrue": true
                        }
                    ],
                    "componentQuestionModels": []
                },
                {
                    "smallId": "1be44cc5d68b4b73b322c7fec3ee405b",
                    "smallScore": 10.0,
                    "smallSort": 7,
                    "smallType": "1",
                    "bigId": null,
                    "subjectCode": "2",
                    "questionCode": "2134dc91a1b04da4b8c6b8e2daf735cc",
                    "createName": null,
                    "createDate": null,
                    "updateName": null,
                    "updateDate": null,
                    "halfScore": 0.0,
                    "id": "2134dc91a1b04da4b8c6b8e2daf735cc",
                    "title": null,
                    "stem": "看图，数一数，图中的正方体有(&nbsp;&nbsp;&nbsp;&nbsp;)个。http://iwrong-static.xinguoren.cn/resources_v3/xsa40001_xsa40100_2.files/image069.png",
                    "quesOption": "[{\"optionKey\":\"A\",\"optionValue\":\"2\"},{\"optionKey\":\"B\",\"optionValue\":\"4\"},{\"optionKey\":\"C\",\"optionValue\":\"5\"}]",
                    "quesAnalyze": "[{\"analyzeKey\":\"A\",\"analyzeValue\":\"如图，数一数，图中有2个正方体，此选项正确。&nbsp;http://iwrong-static.xinguoren.cn/resources_v3/xsa40001_xsa40100_2.files/image071.png\"},{\"analyzeKey\":\"B\",\"analyzeValue\":\"图中有2个正方体，此选项错误。&nbsp;\"},{\"analyzeKey\":\"C\",\"analyzeValue\":\"图中有2个正方体，此选项错误。\"}]",
                    "answer": "A",
                    "type": "1",
                    "stageCode": null,
                    "subjectFlag": null,
                    "subjectName": null,
                    "gradeCode": null,
                    "score": 2.0,
                    "costTime": null,
                    "productionCode": null,
                    "enlargeId": "402881c5529ab64101529b4b3ea2002a",
                    "productId": null,
                    "productType": null,
                    "videoPath": null,
                    "difficultyCode": null,
                    "graph": null,
                    "ability": null,
                    "answerKeys": null,
                    "questionChildType": null,
                    "streamMedias": [],
                    "questionAnalyzeType": 0,
                    "baseKnowledgeModels": [
                        {
                            "baseProductionCode": "0009000100010002",
                            "baseProductType": "fangfayunyonglei",
                            "baseProductionName": "区分立体图形",
                            "baseKnowledgeCode": "000900010001",
                            "baseKnowledgeName": "区分图形",
                            "bookProductionCode": "6657000011000001000001",
                            "bookProductionName": "区分立体图形",
                            "bookKnowledgeCode": "6657000011000001",
                            "bookKnowledgeName": "认识立体图形",
                            "questionId": "2134dc91a1b04da4b8c6b8e2daf735cc",
                            "baseProductionIndex": null,
                            "score": 10.0,
                            "isTrue": true
                        }
                    ],
                    "componentQuestionModels": []
                },
                {
                    "smallId": "ea8059dd06244ab3890f3bb7e33c71e2",
                    "smallScore": 10.0,
                    "smallSort": 8,
                    "smallType": "1",
                    "bigId": null,
                    "subjectCode": "2",
                    "questionCode": "498919ec18ff4374b6de8245ca984574",
                    "createName": null,
                    "createDate": null,
                    "updateName": null,
                    "updateDate": null,
                    "halfScore": 0.0,
                    "id": "498919ec18ff4374b6de8245ca984574",
                    "title": null,
                    "stem": "http://iwrong-static.xinguoren.cn/resources_v3/xsa40501_xsa40600.files/image101.jpg\n看图&nbsp;，数一数，有(&nbsp;&nbsp;&nbsp;&nbsp;)个球体。",
                    "quesOption": "[{\"optionKey\":\"A\",\"optionValue\":\"2\"},{\"optionKey\":\"B\",\"optionValue\":\"3\"},{\"optionKey\":\"C\",\"optionValue\":\"4\"}]",
                    "quesAnalyze": "[{\"analyzeKey\":\"A\",\"analyzeValue\":\"http://iwrong-static.xinguoren.cn/resources_v3/xsa40501_xsa40600.files/image102.jpg\\n如图，数一数&nbsp;，一共有2个球体，此选项正确。&nbsp;\"},{\"analyzeKey\":\"B\",\"analyzeValue\":\"一共有2个球体，此选项错误。&nbsp;\"},{\"analyzeKey\":\"C\",\"analyzeValue\":\"一共有2个球体，此选项错误。\"}]",
                    "answer": "A",
                    "type": "1",
                    "stageCode": null,
                    "subjectFlag": null,
                    "subjectName": null,
                    "gradeCode": null,
                    "score": 2.0,
                    "costTime": null,
                    "productionCode": null,
                    "enlargeId": "402881c5529ab64101529b4b3ea2002a",
                    "productId": null,
                    "productType": null,
                    "videoPath": null,
                    "difficultyCode": null,
                    "graph": null,
                    "ability": null,
                    "answerKeys": null,
                    "questionChildType": null,
                    "streamMedias": [],
                    "questionAnalyzeType": 0,
                    "baseKnowledgeModels": [
                        {
                            "baseProductionCode": "0009000100010002",
                            "baseProductType": "fangfayunyonglei",
                            "baseProductionName": "区分立体图形",
                            "baseKnowledgeCode": "000900010001",
                            "baseKnowledgeName": "区分图形",
                            "bookProductionCode": "6657000011000001000001",
                            "bookProductionName": "区分立体图形",
                            "bookKnowledgeCode": "6657000011000001",
                            "bookKnowledgeName": "认识立体图形",
                            "questionId": "498919ec18ff4374b6de8245ca984574",
                            "baseProductionIndex": null,
                            "score": 10.0,
                            "isTrue": true
                        }
                    ],
                    "componentQuestionModels": []
                },
                {
                    "smallId": "a55d7ade0ef3406d823ba4a628b3c7d8",
                    "smallScore": 10.0,
                    "smallSort": 9,
                    "smallType": "1",
                    "bigId": null,
                    "subjectCode": "2",
                    "questionCode": "ee17132e4432429ba5ecbac50bf66a28",
                    "createName": null,
                    "createDate": null,
                    "updateName": null,
                    "updateDate": null,
                    "halfScore": 0.0,
                    "id": "ee17132e4432429ba5ecbac50bf66a28",
                    "title": null,
                    "stem": "看图，正方体的编号是(&nbsp;&nbsp;&nbsp;)。\nhttp://iwrong-static.xinguoren.cn/2017823/15034736366792206.png",
                    "quesOption": "[{\"optionKey\":\"A\",\"optionValue\":\"②&nbsp;④&nbsp;⑧\"},{\"optionKey\":\"B\",\"optionValue\":\"②&nbsp;⑧\"},{\"optionKey\":\"C\",\"optionValue\":\"②&nbsp;④\"}]",
                    "quesAnalyze": "[{\"analyzeKey\":\"\",\"analyzeValue\":\"如图，正方体的编号是②、④、⑧。\\nhttp://iwrong-static.xinguoren.cn/2017823/15034737340287137.png\"}]",
                    "answer": "A",
                    "type": "1",
                    "stageCode": null,
                    "subjectFlag": null,
                    "subjectName": null,
                    "gradeCode": null,
                    "score": 2.0,
                    "costTime": null,
                    "productionCode": null,
                    "enlargeId": "402881c5529ab64101529b4b3ea2002a",
                    "productId": null,
                    "productType": null,
                    "videoPath": null,
                    "difficultyCode": null,
                    "graph": null,
                    "ability": null,
                    "answerKeys": null,
                    "questionChildType": null,
                    "streamMedias": [],
                    "questionAnalyzeType": 0,
                    "baseKnowledgeModels": [
                        {
                            "baseProductionCode": "0009000100010002",
                            "baseProductType": "fangfayunyonglei",
                            "baseProductionName": "区分立体图形",
                            "baseKnowledgeCode": "000900010001",
                            "baseKnowledgeName": "区分图形",
                            "bookProductionCode": "6657000011000001000001",
                            "bookProductionName": "区分立体图形",
                            "bookKnowledgeCode": "6657000011000001",
                            "bookKnowledgeName": "认识立体图形",
                            "questionId": "ee17132e4432429ba5ecbac50bf66a28",
                            "baseProductionIndex": null,
                            "score": 10.0,
                            "isTrue": true
                        }
                    ],
                    "componentQuestionModels": []
                },
                {
                    "smallId": "45f23b54662342459d3a8ccb77266167",
                    "smallScore": 10.0,
                    "smallSort": 10,
                    "smallType": "1",
                    "bigId": null,
                    "subjectCode": "2",
                    "questionCode": "ff5501e6638a4b1199bed9ebf4e6d351",
                    "createName": null,
                    "createDate": null,
                    "updateName": null,
                    "updateDate": null,
                    "halfScore": 0.0,
                    "id": "ff5501e6638a4b1199bed9ebf4e6d351",
                    "title": null,
                    "stem": "http://iwrong-static.xinguoren.cn/resources_v3/xsa40401_xsa40500.files/image047.jpg\n看图&nbsp;，想一想&nbsp;，括号中应该是(&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;)。",
                    "quesOption": "[{\"optionKey\":\"A\",\"optionValue\":\"http://iwrong-static.xinguoren.cn/resources_v3/xsa40401_xsa40500.files/image048.jpg\"},{\"optionKey\":\"B\",\"optionValue\":\"&nbsp;http://iwrong-static.xinguoren.cn/resources_v3/xsa40401_xsa40500.files/image049.jpg\"},{\"optionKey\":\"C\",\"optionValue\":\"http://iwrong-static.xinguoren.cn/resources_v3/xsa40401_xsa40500.files/image050.jpg\"}]",
                    "quesAnalyze": "[{\"analyzeKey\":\"A\",\"analyzeValue\":\"观察题中的图形&nbsp;，只有http://iwrong-static.xinguoren.cn/resources_v3/xsa40401_xsa40500.files/image051.jpg、http://iwrong-static.xinguoren.cn/resources_v3/xsa40401_xsa40500.files/image048.jpg、http://iwrong-static.xinguoren.cn/resources_v3/xsa40401_xsa40500.files/image052.jpg&nbsp;，而且三个图形是挨着排列的&nbsp;，http://iwrong-static.xinguoren.cn/resources_v3/xsa40401_xsa40500.files/image051.jpg和http://iwrong-static.xinguoren.cn/resources_v3/xsa40401_xsa40500.files/image052.jpg之间是http://iwrong-static.xinguoren.cn/resources_v3/xsa40401_xsa40500.files/image048.jpg&nbsp;，所以括号中应该是http://iwrong-static.xinguoren.cn/resources_v3/xsa40401_xsa40500.files/image053.jpg&nbsp;，此选项正确。&nbsp;\"},{\"analyzeKey\":\"B\",\"analyzeValue\":\"括号中应该是http://iwrong-static.xinguoren.cn/resources_v3/xsa40401_xsa40500.files/image053.jpg&nbsp;，此选项错误。&nbsp;\"},{\"analyzeKey\":\"C\",\"analyzeValue\":\"括号中应该是http://iwrong-static.xinguoren.cn/resources_v3/xsa40401_xsa40500.files/image054.jpg&nbsp;，此选项错误。\"}]",
                    "answer": "A",
                    "type": "1",
                    "stageCode": null,
                    "subjectFlag": null,
                    "subjectName": null,
                    "gradeCode": null,
                    "score": 2.0,
                    "costTime": null,
                    "productionCode": null,
                    "enlargeId": "402881c5529ab64101529b4b3ea2002a",
                    "productId": null,
                    "productType": null,
                    "videoPath": null,
                    "difficultyCode": null,
                    "graph": null,
                    "ability": null,
                    "answerKeys": null,
                    "questionChildType": null,
                    "streamMedias": [],
                    "questionAnalyzeType": 0,
                    "baseKnowledgeModels": [
                        {
                            "baseProductionCode": "0009000100010002",
                            "baseProductType": "fangfayunyonglei",
                            "baseProductionName": "区分立体图形",
                            "baseKnowledgeCode": "000900010001",
                            "baseKnowledgeName": "区分图形",
                            "bookProductionCode": "6657000011000001000001",
                            "bookProductionName": "区分立体图形",
                            "bookKnowledgeCode": "6657000011000001",
                            "bookKnowledgeName": "认识立体图形",
                            "questionId": "ff5501e6638a4b1199bed9ebf4e6d351",
                            "baseProductionIndex": null,
                            "score": 10.0,
                            "isTrue": true
                        }
                    ],
                    "componentQuestionModels": []
                }
            ]
        }
    ],
    "version": "20250807095025"
}
            
            const cacheQuestionList = this.cacheData && this.cacheData.questionList ? this.cacheData.questionList : []
            paperInfo.bigQuestions.forEach(item => {
                
                item.smallQuestions.forEach(ele => {
                    if (ele.type < 6) {
                        const questionCache = cacheQuestionList.find(ca => ca.smallId == ele.smallId);
                        ele.userAnswer = questionCache && questionCache.userAnswer ? questionCache.userAnswer : ele.userAnswer;
                    }
                    delete ele.baseKnowledgeModels;
                    delete ele.quesAnalyze;
                    delete ele.answer;
                    ele.componentQuestionModels = ele.componentQuestionModels || ele.componentQuestions;
                    
                    ele.componentQuestionModels.forEach(y => {
                        
                        const questionCache = cacheQuestionList.find(ca => ca.smallId == y.componentId);
                        y.userAnswer = questionCache && questionCache.userAnswer ? questionCache.userAnswer : y.userAnswer;
                        delete y.baseKnowledgeModels;
                        delete y.quesAnalyze;
                        delete y.answer;
                    })
                })
            })
            console.log(paperInfo,'paperInfopaperInfopaperInfo')
            this.paperDetails = paperInfo;
        },

        /**
         * 点击开始作答触发
         */
        startHandler() {
            this.paperState = 1;
            // this.signalingExpress&&this.signalingExpress('sendCustomCommand', JSON.stringify({
            //     "event": "openPaper",
            //     "name": "打开试卷",
            //     "platformType": "web", // web == 网页端   applet== 小程序  android == pad端
            //     "params": {
            //         "type":'answer', // preview == 预览试卷  answer == 作答
            //         "eventId": this.planNode.eventId,
            //         "planId":this.$store.state.planData.planId,
            //     }
            // }))
        },

        /**
         * 点击结束作答
         */
        goBackHandler() {
            this.$router.go(-1)
        },

        
		/**
		 * 提交作答
		 */
		async submitHandler(item) {
            if(this.submitFlag){
                this.$message.warning('请勿重复提交')
                return
            }
            this.submitFlag =true
			this.submitCon = item;
			this.submitCon.productCode = null;
			this.submitCon.productName = null;
			this.submitCon.productType = null;
			this.submitCon.projectCode = "testing";
            this.submitCon.userId = this.userInfo.userId; //用户id
            this.submitCon.userName = this.userInfo.student.realname; //用户name
            this.submitCon.mobile = this.userInfo.mobile; //用户手机号

            
			
            // 开始作答后，获取唯一字符串，提交作答时，提交该字符串，解决重复提交问题   9.17无需调用
			// const getvalidKey = await this.generateValidKey();
			// if (getvalidKey.code == "000000") {
			// 	this.submitCon.validKey = getvalidKey.validKey;
			// }
            const  { currTaskId } = this.planNode
            let userProductCode = currTaskId?currTaskId.split('-').join(""):"";
            const params = {
                data: {
                    ...this.submitCon,
                    userProductCode: userProductCode
                },
                config: {
					showLoading: true,
					text: '提交中...'
                }
            }
			const answerInfo = await $http.submitSchemeAnswertsheet(params);
			
			if (answerInfo.code == "000000") {
                
                const taskParams = {
                    planInstId: this.planNode.id || null,
                    taskId: this.planNode.currTaskId || null,
                    submitData: {
                        result: answerInfo.evaluationRecordCode,
                    }
                }
                const res = await submitTask(taskParams);
                this.submitFlag = false;
                if (res.code == "000000") {
                    if(this.planNode.scene == '2'){
                        await this.getReportCache()
                    }
                    setTimeout(() => {
                        this.$router.go(-1);
                    }, 10);
                    this.removeCache();
                }
			} else {
                this.$confirm('提交失败，请联系客服人员。客服电话010-82279600', '提示', {
                    confirmButtonText: '确定',
                    type: 'warning'
                })
            }
		},

		
		// 获取validKey,用于阻止试卷重复提交参数
		// async generateValidKey() {
		// 	let data = {
		// 		data: {
        //             timeoutMinutes: this.paperDetails.standardTime,
        //             userId: this.userInfo.userId,
        //             projectCode: "testing",
        //             serviceCode: "submitSheet",
        //         },
        //         config: {
		// 			showLoading: true,
		// 			text: '提交中...'
        //         }
		// 	};
        //     const isShareIframe = sessionStorage.getItem('isShareIframe')
        //     if(isShareIframe){
        //         data.data.userId = this.$store.state.userId
        //     }
		// 	return await $http.generateValidKey(data);
		// },
        
		/**
		 * 获取缓存数据
		 */
		async getCache() {
            if(this.getCacheLoading)return
            this.getCacheLoading = true
            const paperid = this.planNode.currInputs&&this.planNode.currInputs.id || this.$route.query.paperid;
            let userId = this.userInfo.userId;
            const isShareIframe = sessionStorage.getItem('isShareIframe')
            if(isShareIframe){
                userId = this.$store.state.userId
            }
			const ckey = `user_${userId}:study:paperId_${paperid}:planId_${this.planNode.id}`
			const params = {
				data: {
					ckey,
				},
				config: {
					showLoading: true,
					text: '加载中...'
				}
			};
			
			const res = await $http.getCache(params);
			
			if (res.code == '000000') {
				let temp = res.result || null;
				if (temp) {
					const mapInfo = new Map(Object.entries(temp));
                    const arr =  Array.from(mapInfo.values());
					this.cacheData =  arr[0] ? arr[0] : null;
                    console.log(this.cacheData,'this.cacheData')
				}
                
                this.paperHadler();
				
			}
            this.getCacheLoading = false
		},
        
        //总结报告  提交后判断提示
        async getReportCache() {
            let userId = this.userInfo.userId;
            const isShareIframe = sessionStorage.getItem('isShareIframe')
            if(isShareIframe){
                userId = this.$store.state.userId
            }
			const ckey = `user_${userId}_plan_${ this.planNode.id }_schemeReport_tip`
			const params = {
				data: {
					ckey,
				},
				config: {
					showLoading: true,
					text: '加载中...'
				}
			};
			
			const res = await $http.getCache(params);
			
			if (res.code == '000000' && res.result) {
                const data = res.result[ckey];
				if((data && (!data.paper || data.paper<1 ))|| !data){
                    this.$store.commit('setSummaryReportIsUpdate', true)
                    $http.setCache({
                        ckey:ckey,
                        cvalue:{
                            paper:1,
                            knowledge:(data&&data.knowledge )|| 0
                        }
                    })
                }
			}
		},
		/**
		 * 删除缓存数据
		 */
		async removeCache() {
            let userId = this.userInfo.userId;
            const isShareIframe = sessionStorage.getItem('isShareIframe')
            if(isShareIframe){
                userId = this.$store.state.userId
            }
            const paperid = this.planNode.currInputs&&this.planNode.currInputs.id || this.$route.query.paperid;
			const params = {
				ckey: `user_${userId}:study:paperId_${paperid}:planId_${this.planNode.id}`,
			};
			
			await $http.removeCache(params);
			
		},
		
		/**
		 * 用户更新答案，做缓存
		 */
		updataAnswerHandler(item) {
			
			// 过滤已经作答的试题
			const temp = item.questionList.filter(item => {
				let hasAnswer = false;
				if (item.questionType == 4 && item.userAnswer) {
					const answer = typeof(item.userAnswer) == 'object' ? item.userAnswer : JSON.parse(item.userAnswer);
					hasAnswer = answer.some(ele => !!ele)
				} else if (item.userAnswer) {
					hasAnswer = !!item.userAnswer
				}
				return hasAnswer
			});
			if (item.question.questionType == 4 && !item.blurState) {
				this.throttle(this, () => this.submitCache(temp, item) , 5000)
			} else {
				this.submitCache(temp, item)
			}
			
			
		},
		
		/**
		 * 提交答案缓存
		 */
		async submitCache(temp, item) {
			const questionList = temp.reduce((pre, cur) => {
				const temp = {
					smallId: cur.questionCode, // 试题id
					parentId:  cur.type && cur.type > 5 ?  cur.complexQuestionCode : null, // 复合题id
					userAnswer:  cur.userAnswer, // 用户作答结果
				};
				pre.push(temp);
				return pre;
			}, [])
			
			let userId = this.userInfo.userId;
            const isShareIframe = sessionStorage.getItem('isShareIframe')
            if(isShareIframe){
                userId = this.$store.state.userId
            }
			const params = {
				
				ckey: `user_${userId}:study:paperId_${this.$route.query.paperid}:planId_${this.planNode.id}`,
				cvalue: {
					questionList: questionList, // 试题集合
					recordTime: item.recordTime, // 作答时间单位秒
					readTime: item.readTime, // 预览时间单位秒
					paperId: this.$route.query.paperid, // 试卷ID
					userId: userId, // 用户ID
				}
			};
			await $http.setCache(params);
		},

        /**
         * 修改字体大小
         */
        fontSizeChange() {
            this.fontSizeNum = this.fontSizeNum == 14 ? 18 : 14;
        },
        //监听上一题下一题z 
        slideChangeEndHandler(swiper){
            if(swiper){
                const { realIndex } = swiper
                this.signalingExpress&&this.signalingExpress('sendCustomCommand', JSON.stringify({
                    "event": "switchQuestion",
                    "name": "切换试题",
                    "platformType": "web", // web == 网页端   applet== 小程序  android == pad端
                    "params": {
                        "num":realIndex,
                        "eventId": this.planNode.eventId,
                        "planId":this.$store.state.planData.planId,
                    }
                }))
            }
        }
    }

}
</script>


<style lang="less" scoped>
.doPaper {
    height: 100%;
    padding-bottom: 20px;
    box-sizing: border-box;
    margin: auto;
    .doPaper-content {
        width: 100%;
        margin: auto;
        height: 100%;
        box-sizing: border-box;
        background: #fff;
        padding: 0 20px 0px 20px;
        /deep/ .cm-allStem {
            padding-bottom: 0;
            .cm-allStem-tips .allStem-tips-body {
                font-size: 16px;
                font-size: clamp(14px, 0.16rem, 22px); /* 现代浏览器使用 */
            }
            .cm-allStem-head {
                .cm-allStem-head-r {
                    .cm-allStem-head-start {
                        background: #3B80FF;
                        color: #FFFFFF;
                    }
                }
                .head-time-icon{
                    display: none;
                }
                .cm-allStem-head-title{
                    text-align: left;
                }
            }
            .swiper-container {
                width: 100%;
            }
            .answerSheet_comp .answerSheet .answerSheet-content .bottom-gestalt {
                height: 100% !important;
            }
            .compoundTypeStem.disabledResponse {
                height: 100% !important;
            }
            .richTextContainer {
                    
                font-size: var(--fontSize);
                span {
                    font-size: var(--fontSize);
                }
                p {
                    font-size: var(--fontSize);
                }
                
            }
            .cm-allStem-footer{
                .cm-allStem-footer-item{
                    width:1.4rem;
                    height: 0.4rem;
                    border-radius: 0.2rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    &:last-child{
                        background-color: #2A6BF8;
                        border: none;
                        color: #FFF;
                    }
                }
            }
            .el-dialog__wrapper .el-dialog__body .popFrame_body .cm-allStem-tips{
                height: fit-content !important;
                .allStem-tips-body{
                    color: #222222;
                    height: fit-content !important;
                    margin: 20px 0;
                }
                .allStem-tips-btn{
                    .btn-cell{
                        width: 120px;
                    }
                }
            }
        }
        /deep/ .paper.disabledResponse .swiper-container .swiper-slide .swiper-slideAnswer {
            padding-top: 0px !important;
            .baseTypeStem_box { 
                padding-bottom: .2rem;
            }
        }
    }
}
</style>