<template>
    <div id="allStem">
        <cm-all-stem 
            ref="allStem" 
            :userInfo="userInfo" 
            :disabledResponse="false"
            :paperDetails="paperDetails" 
            :showKnowledgePoint="true" 
            :paperState.sync="paperState"  
            :needSweiper="true"
            @imgBtn="imgBtn"
            :showType="true"
            @slideChangeEnd="slideChangeEndHnadler" 
            @submit="submitHandler"
            :showSmallJudgeSelf="true"
            @goBack="goBackHandler" 
			@updataAnswer="updataAnswerHandler"
            @start="startHandler">
            
        </cm-all-stem>
        

        <!-- <div @click="getAnswer">作答卡</div> -->

        <!-- <cm-answer-card></cm-answer-card> -->
        <!-- <div @click="submit">提交</div> -->

    </div>
</template>

<script>
import $http from '@/servers/index';
export default {
    name: 'allStem',
    data() {
        return {
            latex: '\dfrac{2}{4} = 0.5 \qquad \dfrac{2}{c + \dfrac{2}{d + \dfrac{2}{4}}} = a',
            paperState: 0,
            paperDetails: {}, // 试题信息
            userInfo: {"httpCode":200,"code":"000000","message":"成功","runTime":null,"userId":"0d30e94c-e3a4-4e83-9afe-a307e3b6a61c","realname":"","mobile":"15313178813","createDate":1733456863000,"loginDate":1742434129000,"relationType":null,"source":56,"portrait":null,"tutorialCode":"","tutorialName":"","inviteCode":"a1tpje","referrer":null,"referrerMobile":null,"student":{"userId":"4e8bfd8126744660875b45b68fe4dfdb","realname":"刘大","sex":1,"provinceId":null,"cityId":null,"countyId":null,"schoolCode":null,"schoolName":null,"seowonCode":"001007","seowonName":"AI学习家自习室（德胜门店）-测试","gradeCode":31,"isSingle":0,"artType":null,"createDate":1733456863000,"loginDate":1733456863000,"parentId":"0d30e94c-e3a4-4e83-9afe-a307e3b6a61c","parentMobile":"15313178813","recordCode":"b1447b61a60b440a80d675fc4d2876d7","userCode":"0d30e94c-e3a4-4e83-9afe-a307e3b6a61c","term":1,"updateNum":null,"lastSelect":1,"applyNum":1,"serviceLength":5475,"gradeName":"高一(上)"},"academyId":"001007","academyCode":136,"academyName":"AI学习家自习室（德胜门店）-测试","agencyAccount":null,"project":null,"oauth2Relations":null,"assessToken":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIwIiwiYXVkIjoiMGQzMGU5NGMtZTNhNC00ZTgzLTlhZmUtYTMwN2UzYjZhNjFjIiwibmJmIjoxNzQyNDQ2Nzg4LCJwcm9maWxlIjoidGVzdCIsImlzcyI6IjAiLCJlZGl0aW9uIjowLCJleHAiOjE3NDI0NTM5ODgsImlhdCI6MTc0MjQ0Njc4OH0.OUwQxZnisewbwtJg9HUFooZOdK7XUB9bQYyVTYBVU1A","nickname":null,"thirdOpenId":null,"headImgUrl":null,"unionId":null,"sessionKey":null,"scope":null,"jumpAppId":null},
            cacheQuestionList: [
                {
                    "answerQuestionsTime": 9,
                    "isComplexQuestion": "0",
                    "smallId": "3c3445826bd84f368f3f69aaf1950fea",
                    "questionScore": 2,
                    "questionSn": 1,
                    "questionType": "1",
                    "readingQuestionsTime": 0,
                    "rightAnswer": "A",
                    "userAnswer": "A"
                },
                {
                    "answerQuestionsTime": 11,
                    "isComplexQuestion": "0",
                    "smallId": "41b114b9f91942588fd74a098a49c4de",
                    "questionScore": 2,
                    "questionSn": 2,
                    "questionType": "1",
                    "readingQuestionsTime": 0,
                    "rightAnswer": "D",
                    "userAnswer": "B"
                },
                {
                    "answerQuestionsTime": 0,
                    "complexQuestionCode": "dbe62803e8d84354bd1d10b196249876",
                    "isComplexQuestion": "1",
                    "type": "6",
                    "smallId": "05674516855641118bd814bad5cb0fd8",
                    "questionScore": 3,
                    "questionSn": 2,
                    "questionType": "1",
                    "readingQuestionsTime": 1,
                    "rightAnswer": "B",
                    "userAnswer": "A"
                },
                {
                    "answerQuestionsTime": 0,
                    "isComplexQuestion": "0",
                    "smallId": "d7e86df4b4994bafba82cee1276dbb35",
                    "questionScore": 4,
                    "questionSn": 1,
                    "questionType": "4",
                    "readingQuestionsTime": 0,
                    "rightAnswer": "[{\"answerValue\":\"惑而不从师\",\"score\":1.0},{\"answerValue\":\"秦人不暇自哀\",\"score\":1.0},{\"answerValue\":\"亦使后人而复哀后人也\",\"score\":1.0},{\"answerValue\":\"齐彭殇为妄作\",\"score\":1.0}]",
                    "userAnswer": "[\"33\",\"\",\"\",\"55\"]"
                }
            ]
        }
    },
    mounted() {
        this.gerPaper();
    },
    methods: {
        imgBtn (val) {
            console.log('val111111111111111111', val)
        },
        /**
         * 获取试题
         */
        async gerPaper() {
            const params = {
                // appKey: "string",
                // paperId: "26f72e414cfd4dea81bfb2739bb166e4",
                
                // evaluationRecordCode: "80afb35160364d7cb7bd76a020067abf"
                // paperId: "b47de561713347d9be4ce5a63d707cd4"
                paperId: "8b43716f8396401e9def5eb1afa336d6",
                // token: "string"
                // paperId: "b47de561713347d9be4ce5a63d707cd4",
                // token: "string",
                paperId: "dd4c6ec41f2a45d1bc94eada5c87016f"
            };
            const paperInfo = await $http.distributePaper(params);
            if (paperInfo.code == '000000') {
                
				paperInfo.bigQuestions.forEach(item => {
                    console.log('[ item ] >', item)
					item.smallQuestions.forEach(ele => {
                        // ele.stem = '<span class="latex">\\dfrac{2}{4} = 0.5 \\qquad \\dfrac{2}{c + \\dfrac{2}{d + \\dfrac{2}{4}}} = a</span>'
						if (ele.type < 6) {
							const questionCache = this.cacheQuestionList.find(ca => ca.smallId == ele.smallId);
							ele.userAnswer = questionCache && questionCache.userAnswer ? questionCache.userAnswer : ele.userAnswer;
                        }

						// delete ele.baseKnowledgeModels;
						// delete ele.quesAnalyze;
						// delete ele.answer;
						ele.componentQuestionModels = ele.componentQuestionModels || [];
						ele.componentQuestionModels.forEach(y => {
							// if(y.type == 4){
                            //     y.stem = y.stem + 'yǎng wàng';
                            // }
							const questionCache = this.cacheQuestionList.find(ca => ca.smallId == y.componentId);
							y.userAnswer = questionCache && questionCache.userAnswer ? questionCache.userAnswer : y.userAnswer;
							// delete y.baseKnowledgeModels;
							// delete y.quesAnalyze;
							// delete y.answer;
						})
					})
				})
                
                this.paperDetails = paperInfo;
            }
        },
        
        /**
         * 点击开始作答
         */
        startHandler() {
            this.paperState = 1;;
        },
        /**
         * 滑动结束后返回swiper
         */
        slideChangeEndHnadler(item) {
        },
        
        /**
         * 获取作答情况
         */
        getAnswer() {
           console.log(this.$refs.allStem.getAnswerSituation());
        },
        /**
         * 提交作答
         */
        submitHandler(item) {
        },

        /**
         * 提交作答
         */
        submit() {
            const jj = this.$refs.allStem.getSubmitCon();
        },
        /**
         * 点击回退
         */
        goBackHandler() {
            
        },

        /**
         * 用户答案更新
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
            console.log(temp, 'updataAnswerHandler')
			// if (item.question.questionType == 4 && !item.blurState) {
			// 	this.throttle(this, () => this.submitCache(temp, item) , 5000)
			// } else {
			// 	this.submitCache(temp, item)
			// }
        }
    }
}
</script>

<style lang="less" scoped>
#allStem {
    height: 100%;
}
:root {
  --color1: coral;
}
</style>