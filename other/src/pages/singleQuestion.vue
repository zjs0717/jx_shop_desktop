<template>
    <div id="allStem">
            <cm-single-question
                ref="allStem" 
                :userInfo="userInfo" 
                :headerShow="false"
                :paperDetails="{questionList: paperDetails.questionList}" 
                :showKnowledgePoint="true" 
                :paperState.sync="paperState" 
                :needSweiper="true"
                @slideChangeEnd="slideChangeEndHnadler" 
                @submit="submitHandler" 
                :showNum="true"
                @goBack="goBackHandler">
                <template v-slot:custom="{question}">
                    <cm-answer-item :questionDetails="question" :parentType="question.type" :orderNum="question.orderNum">
                        <template v-slot:answer>
                            <div class="wrongTopics-content_type">
                                <span>正确答案</span>
                            </div>
                        </template>
                    </cm-answer-item>
                    <cm-analysis-item :questionDetails="question" :parentType="question.type">
                        <template v-slot:analysis>
                            <div class="wrongTopics-content_type">
                                <span>解析</span>
                            </div>
                        </template>
                    </cm-analysis-item>
                </template>
            </cm-single-question>

    </div>
</template>

<script>
import $http from '@/servers/index';
export default {
    name: 'allStem',
    data() {
        return {
            paperState: 2,
            paperDetails: {}, // 试题信息
            userInfo: {"httpCode":200,"code":"000000","message":"成功","runTime":null,"userId":"0d30e94c-e3a4-4e83-9afe-a307e3b6a61c","realname":"","mobile":"15313178813","createDate":1733456863000,"loginDate":1742434129000,"relationType":null,"source":56,"portrait":null,"tutorialCode":"","tutorialName":"","inviteCode":"a1tpje","referrer":null,"referrerMobile":null,"student":{"userId":"4e8bfd8126744660875b45b68fe4dfdb","realname":"刘大","sex":1,"provinceId":null,"cityId":null,"countyId":null,"schoolCode":null,"schoolName":null,"seowonCode":"001007","seowonName":"AI学习家自习室（德胜门店）-测试","gradeCode":31,"isSingle":0,"artType":null,"createDate":1733456863000,"loginDate":1733456863000,"parentId":"0d30e94c-e3a4-4e83-9afe-a307e3b6a61c","parentMobile":"15313178813","recordCode":"b1447b61a60b440a80d675fc4d2876d7","userCode":"0d30e94c-e3a4-4e83-9afe-a307e3b6a61c","term":1,"updateNum":null,"lastSelect":1,"applyNum":1,"serviceLength":5475,"gradeName":"高一(上)"},"academyId":"001007","academyCode":136,"academyName":"AI学习家自习室（德胜门店）-测试","agencyAccount":null,"project":null,"oauth2Relations":null,"assessToken":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIwIiwiYXVkIjoiMGQzMGU5NGMtZTNhNC00ZTgzLTlhZmUtYTMwN2UzYjZhNjFjIiwibmJmIjoxNzQyNDQ2Nzg4LCJwcm9maWxlIjoidGVzdCIsImlzcyI6IjAiLCJlZGl0aW9uIjowLCJleHAiOjE3NDI0NTM5ODgsImlhdCI6MTc0MjQ0Njc4OH0.OUwQxZnisewbwtJg9HUFooZOdK7XUB9bQYyVTYBVU1A","nickname":null,"thirdOpenId":null,"headImgUrl":null,"unionId":null,"sessionKey":null,"scope":null,"jumpAppId":null}
        }
    },
    mounted() {
        this.getTaskQuestionsByTaskCode();
    },
    methods: {
        /**
         * 获取试题
         */
        async getTaskQuestionsByTaskCode() {
            const params = {"evaluationRecordCode":"80afb35160364d7cb7bd76a020067abf","oauth2Type":0};
            // debugger
            const paperInfo = await $http.distributePaper(params);
            if (paperInfo.httpCode == '200') {

                this.dataHandler(paperInfo);
               
            }
        },
        dataHandler(paperInfo) {
            const questionList = paperInfo.bigQuestions.reduce((pre, cur) => {
                pre = [...pre, ...cur.smallQuestions];
                return pre
            }, [])
            const info = {
                paperName: '全题型试卷',
                totalScore: '30',
                questionList: questionList,
            }
            // debugger
            this.paperDetails = info;
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
            
            this.$refs.allStem.answerCardOpen = false;

            this.$refs.allStem.mySwiper.slideTo(0, 500, false);

            
            // const info = {
            //         paperName: '全题型试卷',
            //         totalScore: '30',
            //         questionList: item,
            //     }
            // this.paperDetails = info;
            setTimeout(() => {
                this.paperState = 2;
            }, 1000);
            
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