<template>
    <div>
        <div v-for="(item, index) in questionList" :key="index">
            <all-single-stem 
                :questionData="item"  
                :gainBtnShow="true"
                :orderNum="1"
                :isSwider="true"
                :paperState="2"
            >
            </all-single-stem>
        </div>
    </div>
</template>

<script>
    import allSingleStem from '../plugin/questionStem/allSingleStem'
    import $http from '@/servers/index';

    export default {
        components: {
            allSingleStem
        },
        data(){
            return {
                questionList: []
            }
        },
        created() {
            this.getTestQuestion()
        },
        methods: {
            async getTestQuestion(){
                const data = {
                        // "gradeCode":33,
                        // "subjectCode":1,
                        // "knowledgeCodes":[
                        //     "776100200001", "776100200002"
                        // ],
                        // "pageNum":1,
                        // "pageSize":10,
                        // "booktypeCode":"bd9bfc91c6a540c2bbe0866ebc6df1b8",
                        // "difficultStars":null,
                        // "saveLock":false,
                        // "typeId":"6"
//                         classCode: 4514,
                        // taskCode: "9ecfe2012e4f433b86464b867f1a7682"
                        // evaluationRecordCode: "ffe230c5517a4f83b5f7ce0e0e4dc14b"
                        // paperId: "2aa445c21ceb473fb0830c04c33ead7a",
                        // token: "string"
                        "questionId":"368eb5b68cc64733b342f2126bd0def2",
                        "sourceCode":"968d56aa6ad844a490478b9ab24c5073",
                        "userId":"1030457d-7861-404c-9db2-ba2cb45d4255"
                    }

                // const parmas = {"booktypeCode":"b9a8320392c04661bfcee5117ba53260","difficultStar":null,"gradeCode":33,"knowledgeCodes":["88900001","88900002"],"pageNum":1,"pageSize":10,"stem":null,"subjectCode":2}
                // const res = await $http.getTaskQuestionsByTaskCode(data);
                const res = await $http.getWrongSubjectQuestion(data);
                // let arr = []
                // res.bigQuestions.forEach(val => arr.push(...val.smallQuestions))
                // console.log('this.questionList',this.questionList)
                this.questionList = [
    {
        "id": "ce3ecc220287485cbe783d49e32ffbdd",
        "stem": `
        $\\int_0^\\infty e^{-x^2} \, dx = \\frac{\\sqrt{\\pi}}{2}$
        $ \\left \\{ \\begin{array} { l } x + 6 y = 8 , \\textcircled 1 \\\\ 4 x - 3 y = 5 . \\textcircled 2 \\end{array} \\right .$
        $\\angle AOC=50{}^\\circ$
        已知集合$$U=\\left\\{ 1,2,3,4,5 \\right\\}$$，<span class="latex">A=\\left\\{ 1,3 \\right\\}</span>，<span class="latex">B=\\left\\{ 1,2,4 \\right\\}</span>，则<span class="latex">({{\\complement }_{U}}B)\\bigcup A=</span>
A~{1，3，5}B~{1，3}C~{1，2，4}D~{1，2，4，5}
<span class="latex">\\sqrt{3}</span>
这是一个复杂公式：$$\\displaystyle \\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}$$。
解析:<span class="latex">{{\\complement }_{U}}B=\\left\\{ 3,5 \\right\\}</span>，所以<span class="latex">({{\\complement }_{U}}B)\\bigcup A=\\left\\{ 1,3,5 \\right\\}</span>，故选A．<span class="latex">\\dfrac{2}{4} = 0.5 \\qquad \\dfrac{2}{c + \\dfrac{2}{d + \\dfrac{2}{4}}} = a</span>`,
        "quesAnalyze": "[{\"analyzeKey\":\"\",\"analyzeValue\":\"grandfather表意为爷爷、姥爷，&nbsp;所以本选项正确。grandmother表意为奶奶、姥姥，所以本选项错误。grandson表意为孙子、外孙，所以本选项错误。\"}]",
        "answer": "A",
        "answerKeys": null,
        "quesOption": "[{\"optionKey\":\"A\",\"optionValue\":\"&nbsp;grandfather&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\"},{\"optionKey\":\"B\",\"optionValue\":\"&nbsp;grandmother\"},{\"optionKey\":\"C\",\"optionValue\":\"grandson<br/>\"}]",
        "type": "1",
        "mark": "2",
        "score": 1,
        "subjectCode": "3",
        "questionAnalyzeType": null,
        "streamMedias": [],
        "baseProductionModels": [
            {
                "baseProductionCode": "0383000100020213",
                "baseProductType": "lianjiexing",
                "baseProductionName": "grandfather",
                "baseKnowledgeCode": "038300010002",
                "baseKnowledgeName": "普通名词",
                "baseProductionCause": "grandfather",
                "baseProductionResult": "爷爷，姥爷",
                "audioUrl": null,
                "audioText": null,
                "questionId": null,
                "baseProductionIndex": null,
                "score": 0,
                "isTrue": true,
                "feedbackMedias": null
            }
        ],
        "componentQuestions": [],
        "gradeCode": "12,13",
        "title": "XYA00261",
        "difficultStar": 1,
        "enlargeId": "402881b951dd91520151dd9e4cbc0007",
        "gradeRules": "402881ce558fb38801558fe9fcc1003e",
        "markScore": null,
        "userAnswer": null,
        "isRight": null,
        "blankMarkResult": null,
        "feedbackMedias": null
    },
]
                // res.result.forEach(val => {
                //         this.questionList.push( {
                //       'answer':val.rightAnswer,
                //   'stem':val.baseName,
                //   'quesAnalyze':val.questionAnalyze,
                //   'quesOption':val.questionOption,
                //   'isShowBase': true,
                //       isAdd:false,
                //       ...val,
                //   'type':val.questionType,
                //   })
                // })
                console.log('this.questionList',this.questionList)
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>