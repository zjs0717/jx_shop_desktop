<template>
	<!--简单题型组件-->
	<div 
    class="baseTypeStem" 
    :class="{
      'baseTypeStem_voice': questionDetailsInfo.type == 5,
      'disabledResponse': !disabledResponse  
    }" 
    :style="{paddingBottom:  paperState != 1 ? '36px' : '2px'}">

    <div 
      class="baseTypeStem_box"  
      :class="{
        'rightShowDisable_baseTypeStem_box': questionDetailsInfo.isRightShowDisable,
        'baseTypeStem_box_flexLR': !parentType && questionDetailsInfo.type == 4 && paperState == 1,
      }"
    >
    <!-- <div>{{ parentType }}大题题型</div> -->
      <!-- 题干 blankStemShowTip 填空题显示提示-->
      <topic-drt 
        class="baseTypeStem_box_topicDrt"
        :disabledResponse="disabledResponse" 
        :topicSmall="topicSmall" 
        :orderNum="orderNum" 
        :stem="questionDetailsInfo.stem" 
        :showLowerType="showLowerType" 
        :showType="showType" 
        :type="questionDetailsInfo.type"
        :blankStemShowTip="blankStemShowTip || propsBlankStemShowTip" 
        v-if="isShowBlock('1')">
      </topic-drt>
      <!-- isRightShowDisable 定制方案 做错题DoATopic节点 复合题 正确的小题禁止再次作答， 提交答案时一起提交上去 -->
      <div v-if="isShowBlock('2')" class="baseTypeStem_key" :class="{'baseTypeStem_key_written': questionDetailsInfo.type == 5 || paperState != 1}">
        <!-- 选择题 -->
        <div v-if="questionDetailsInfo.type == 1 || questionDetailsInfo.type == 2">
          <div class="options">
  
            <div>
              <div
                v-for="(optionitem, index) in questionDetailsInfo.quesOption"
                :key="index"
                class="op"
                >
                
                <div 
                    class="op-item" 
                    :class="setClass(optionitem)"
                    @click="paperState == 1 ? onceChoice(questionDetailsInfo, index) : null">
                  
                  <span class="key">
                    
                    <rich-text :stem="optionitem.optionKey"></rich-text>
                  </span>
                  <span class="line"></span>
                  <div class="value_wrap" :class="{preview:paperState == 0}">
                    <span
                      class="value value_img"
                      >
                      <rich-text :stem="optionitem.optionValue"></rich-text>
                    </span>
                  </div>
  
  
                </div>
                <slot name="op">
                   <slot name="optionitem" v-bind:optionitem="{...questionDetailsInfo,index}">
                  </slot>
                </slot>
              </div>
            </div>
            
          </div>
        </div>
  
        <!--填空-->
        <div v-if="questionDetailsInfo.type == 4">
  
          <!-- 作答状态 -->
          <div v-if="paperState == 1" :class="{'rightShowDisable': questionDetailsInfo.isRightShowDisable}">
            <div
              
              class="blanks"
              v-for="(answertem, index) in questionDetailsInfo.answer"
              :key="index"
            >
              <div class="blank" :class="{'compound-blank': !questionDetailsInfo.componentId, 'textareaFocusBlankClassName': textareaFocus && textareaFocusInx == index}">
                <span class="index">
                  <rich-text :stem="`空${index + 1}`"></rich-text>
                </span>
                <span class="line"></span>
                <div class="cont">
                  <textarea
                  style="max-height: 300px;overflow-y: auto;"
                  maxlength="500"
                  type="textarea"
                  rows="1"
                  placeholder="请输入答案"
                  @input="onceChoice(questionDetailsInfo, answertem, $event)"
                  v-model="answertem.userValue"
                  @blur="onceChoice(questionDetailsInfo, answertem, $event,true)"
                  @focus="focusHandle(index)"
                  >
                  </textarea>
                </div>
              </div>
            </div>
  
          </div>
          
          <!-- 作答完毕 -->
          <div v-if="paperState == 2">
            <div
              class="blanks"
              v-for="(answertem, index) in questionDetailsInfo.userAnswer"
              :key="index"
            >
              
              <div :class="['blank', answertem]">
                <span class="index">
                  <rich-text :stem="`空${index + 1}`"></rich-text>
                </span>
                <span class="line"></span>
                <div 
                  class="cont" 
                  :class="!!questionDetailsInfo.blankMarkResult&&questionDetailsInfo.blankMarkResult[index] === true ? 'ok' : !!questionDetailsInfo.blankMarkResult&&questionDetailsInfo.blankMarkResult[index] === false ? 'err' : ''">
                  
                  <rich-text :stem="`${answertem || '未作答'}`"></rich-text>
                  <!-- <textarea
                  type="textarea"
                  readonly
                  :placeholder="answertem"
                  v-model="answertem.answerValue"
                  ></textarea> -->
                </div>
              </div>
            </div>
  
          </div>
        </div>
  
        <!--判断题-->
        <div v-if="questionDetailsInfo.type == 3">
          
          <!-- 预览状态 -->
          <div class="judge" v-if="paperState == 0">
            <div class="right">
              <rich-text stem="正确"></rich-text>
            </div>
            <div class="wrong">
              <rich-text stem="错误"></rich-text>
            </div>
          </div>
          
          <!-- 作答状态 -->
          <div class="judge" v-if="paperState == 1">
            <div
              @click="paperState == 1 ? onceChoice(questionDetailsInfo, '1') : null"
              :class="{ active: questionDetailsInfo.userAnswer == 1,  'rightShowDisableActive': questionDetailsInfo.isRightShowDisable }"
              >
             
              <rich-text stem="✔"></rich-text>
            </div>
            <div
              @click="onceChoice(questionDetailsInfo, '0')"
              :class="{ active: (questionDetailsInfo.userAnswer + '') === '0' }"
              >
              
              
              <rich-text stem="✘"></rich-text>
            </div>
          </div>
          
          <!-- 作答完毕 -->
          <div class="judge" v-if="paperState == 2">
              <div
              :class="
                questionDetailsInfo.userAnswer == 1
                ? questionDetailsInfo.answer == 1
                  ? 'ok'
                  : 'err'
                : ''
              "
              >
              <rich-text stem="✔"></rich-text>
              </div>
              <div
              :class="
                (questionDetailsInfo.userAnswer + '') === '0'
                ? (questionDetailsInfo.answer + '') === '0'
                  ? 'ok'
                  : 'err'
                : ''
              "
              >
              <rich-text stem="✘"></rich-text>
              </div>
            <slot name="optionitem" v-bind:optionitem="{...questionDetailsInfo,index:0}">
            </slot>
          </div>
        </div>
  
  
        <!--书面表达-->
        <div class="written" v-if="questionDetailsInfo.type == 5">
            
          <slot name="answerSheet" :scope="questionDetailsInfo">
            <div v-if="paperState == 1"  :class="{'rightShowDisable': questionDetailsInfo.isRightShowDisable}">
              <answer-sheet
                :questionType="5"
                :paperState="paperState"
                :questionDetails="questionDetailsInfo"
                @onceChoice="onceChoice"
              ></answer-sheet>
  
            </div>
          </slot>
          <div
            v-if="paperState == 2&& isShowBlock('6')"
            class="answer-wrap"
          >
            
            <rich-text stem="我的作答："></rich-text>
            <span
            :class="Number(questionDetailsInfo.isRight) === 1 ? 'ok' : 'err'"
            >
              <rich-text :stem="questionDetailsInfo.userAnswer"></rich-text>
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="baseTypeStem_kgAnswerAnalysis">

      <!-- 产生式 -->
      <slot name="knowledgePoint" :question="questionDetailsInfo">
        <div v-if="paperState == 2 && isShowBlock('5') && showKnowledgePoint">
          <div class="result answer">
            <span class="name baseKnowledgeModels">{{knowledgeString ? knowledgeString:"产生式："}}</span>
            <span class="value" v-if="questionDetailsInfo.baseKnowledgeModels && questionDetailsInfo.baseKnowledgeModels.length > 0">
              <span v-for="(know, k) in questionDetailsInfo.baseKnowledgeModels" :key="k">
                <rich-text :stem="know.baseProductionName"></rich-text>
                <span v-if="k != questionDetailsInfo.baseKnowledgeModels.length -1">
                  <rich-text stem="、"></rich-text>
                </span>
              </span>
            </span>
          </div>
        </div>
      </slot>
      
    
      <!--答案与解析 -->
      <div class="baseTypeStem_answerAnalysis" v-if="isShowBlock('3') || isShowBlock('4')">
        <question-result :orderNum="orderNum" :showBlock="showBlock" :questions="questionDetailsInfo" :parentType="parentType"></question-result>
      </div>
    </div>
		<slot name="custom" v-bind:question="questionDetailsInfo"></slot>
	</div>
</template>
<script>

export default {
  name: "cm-base-type-stem",
  components: {
    answerSheet: () => import('../answerPanel/index'), // 作答面板
    topicDrt: () => import('../topicDrt/index'), // 题干组件
    questionResult: () => import('./questionResult.vue'), // 答案与解析组件
    richText:() => import('../questionStem/richText.vue')
  },
  props: {
    // 试卷状态，0 预览  1 做答中 2 作答完成
    paperState: {
      type: String | Number,
      default: 0,
    },
    // 知识点文案
    knowledgeString: {
      type: String,
      default: '',
    },
    // 试题信息
    questionDetails: {
      type: Object,
      default: function() {
        return {};
      },
    },
    /**
     * 试题序号
     */
    orderNum: {
      type: String | Number,
      default: '1'
    },

    /**
     * 区分展示题干/作答/答案/解析
     * 为空 => 全部展示
     * 1 => 只展示题干
     * 2 => 只展示题干及作答
     * 3 => 只展示答案
     * 4 => 只展示解析
     * 5 => 只展示知识点
     */
    showBlock: {
      type: String,
      default: '1,2'
    },
    // 是否展示产生式
    showKnowledgePoint: {
      type: Boolean,
      default: false
    },
    /**
     * 是否是小题
     */
    topicSmall: {
      type: Boolean,
      default: false
    },
    
    /**
     * 是否展示题型
     */
    showType: {
        type: Boolean,
        default: false
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
    
    // 大题题型
    parentType: {
      type: String | Number,
      default: ''
    },
    // 是否展示空题提示
    propsBlankStemShowTip: {
      type: Boolean,
      default: false,
    },
    // 试题科目
    propsSubjectCode: {
      type: String | Number,
      default: 0
    }
  },
  computed: {
    

    /**
     * 区分展示题干/作答/答案/解析
     * 为空 => 全部展示
     * 1 => 只展示题干
     * 2 => 只展示题干及作答
     * 3 => 只展示答案
     * 4 => 只展示解析
     * 5 => 只展示知识点
     */
    isShowBlock() {
      /**
       * val => 1 题干
       *     => 2 作答
       *     => 3 答案
       *     => 4 解析
       *     => 5 产生式
       */
      return function(val) {
        let temp = true;
        if (!this.showBlock) {
          temp = true;
        } else if (this.showBlock.indexOf(val) > -1) {
          temp = true;
        } else {
          temp = false;
        }
        return temp;
      }
    },

    /**
     * 设置选择题class
     */
    setClass() {
      return function(item) {
        switch(Number(this.paperState)) {
          case 0:
            return 'isBorder';
            break;
          case 1:
            if(this.questionDetailsInfo.isRightShowDisable){
              return item.ok
            }
            return {
              active: item.active == true,
            }
            break;
          case 2:
            return item.ok
            break;
          
        };
      };
    },
    /**
     * 是否展示空题提示
     */
    blankStemShowTip(){
      // 填空题 做答中 this.paperState == 0 || ，预览暂不处理
      try {
        let pathnmaes = ['/customPlan/chat'];     
        if(pathnmaes.indexOf(this.$route.path) > -1){
          return false;
        }
        let tag = this.questionDetailsInfo && this.questionDetailsInfo.type == 4 && (this.paperState == 1) ? true : false;
        if(!tag){
          return false;
        }
        
        // 语文
        let propsSubjectCode = this.questionDetailsInfo.subjectCode || this.propsSubjectCode;
        if(propsSubjectCode != 1){
          return false;
        }

        // 题干包含拼音
        let stem = this.questionDetailsInfo.stem || '';
        tag = /[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/.test(stem);
        return tag
      } catch (error) {
        return false;
      }
    }

  },
  data() {
    return {
      analysis: "", //解析
      judgeActive: null, //判断是否正确
      questionDetailsInfo: {}, // 试题数据
      textareaFocus: false,
      textareaFocusInx: -1,
    };
  },
  watch: {
    /**
     * 复合题-试题改变时触发处理数据函数
     */
    questionDetails: {
      handler(val) {
        
        this.questionDetailsInfo = JSON.parse(JSON.stringify(val));
        this.dataHandler(JSON.parse(JSON.stringify(val)));
      },
      immediate: true,
      deep: true,
    },

    /**
     * 监听状态改变
     */
    paperState() {
      this.dataHandler(this.questionDetailsInfo);
    }
  },
  mounted() {
    // this.dataHandler(this.questionDetailsInfo);
  },
  methods: {
    /**
     * 
     * 
	   * @param {Object} optionitem 试题信息
	   * @param {Object} index 答案信息
	   * @param {Boolean} val 输入框失焦状态
     * @param {Object} e 元素dom信息
     */
    onceChoice: function(optionitem, index, e, val) {
      if(val){
        this.textareaFocus = false;
        this.textareaFocusInx = -1;
      }
      //要传的选中值
      var emitoption = null;

      //作答状态
      if (this.paperState == 1) {
        if (this.questionDetailsInfo.type == 1) { //单选
          for (var i = 0; i < this.questionDetailsInfo.quesOption.length; i++) {
            this.questionDetailsInfo.quesOption[i].active = false;
          }
          this.questionDetailsInfo.quesOption[index].active = true;
          this.questionDetailsInfo.quesOption.splice(index, 1, this.questionDetailsInfo.quesOption[index])

          emitoption = this.questionDetailsInfo.quesOption[index];
        } else if (this.questionDetailsInfo.type == 2) { //多选
         
          //若当前选中状态，点击取消选中
          if (this.questionDetailsInfo.quesOption[index].active == true) {
            this.questionDetailsInfo.quesOption[index].active = false;
          } else {
            this.questionDetailsInfo.quesOption[index].active = true;
          }
          this.questionDetailsInfo.quesOption.splice(index, 1, this.questionDetailsInfo.quesOption[index])
          emitoption = this.questionDetailsInfo.quesOption;
        } else if (this.questionDetailsInfo.type == 4) { //填空
          
          e.target.style.height ="inherit";
          e.target.style.height = `${e.target.scrollHeight}px`;
          emitoption = this.questionDetailsInfo.answer;
        } else if (this.questionDetailsInfo.type == 3) { //判断
          
          // this.judgeActive = index;
          this.$set(optionitem, "userAnswer", index);
          emitoption = index;
        } else if (this.questionDetailsInfo.type == 5) { //主观题
          
          emitoption = index;
        }
        this.$emit("onceChoice", optionitem, emitoption, val);
      }
    },
// 输入框聚焦
    focusHandle(index) {
      this.textareaFocus = true;
      this.textareaFocusInx = index;
    },
    /**
     * 处理数据
     */
    dataHandler(item) {
      
      var _this = this;
      this.questionDetailsInfo.typeName = this.questionType(this.questionDetailsInfo.type);
      if (
        this.questionDetailsInfo.type == "1" ||
        this.questionDetailsInfo.type == "2"
      ) {
        if (typeof this.questionDetailsInfo.quesOption != "object") {
          var obj = JSON.parse(this.questionDetailsInfo.quesOption);
          for (var i = 0; i < obj.length; i++) {
            obj[i].active = false;
            
            let userAnswerStr = _this.questionDetailsInfo.userAnswer || "";
            
            obj[i].ok = "";

            var answerStr = _this.questionDetailsInfo.answer || "";
            
            if (userAnswerStr.indexOf(obj[i].optionKey) != -1) {
              obj[i].active = true;
              if (answerStr.indexOf(obj[i].optionKey) != -1) {
                obj[i].ok = "ok";
              } else {
                obj[i].ok = "err";
              }
            }
          }
          
          this.questionDetailsInfo.quesOption = obj;
        }
      } else if (this.questionDetailsInfo.type == "4") {
        if (this.questionDetailsInfo.answerKeys && typeof this.questionDetailsInfo.answerKeys != "object") {
          if (typeof this.questionDetailsInfo.answer == "object") return;
          if (_this.paperState == 2 || _this.paperState == 1) {
            var obj = JSON.parse(this.questionDetailsInfo.answerKeys
            
          );
        
          if (this.questionDetailsInfo.userAnswer) {
            var userAnswer = typeof(this.questionDetailsInfo.userAnswer) == 'string' ? JSON.parse(this.questionDetailsInfo.userAnswer) : this.questionDetailsInfo.userAnswer;
          }
          for (var i = 0; i < obj.length; i++) {
            if (_this.paperState == 1) {
              // obj[i].userValue = '';
              obj[i].userValue = userAnswer && userAnswer[i] ? userAnswer[i] : '';
            }
          }
          if (_this.paperState == 2) {
            this.$set(this.questionDetailsInfo, "userAnswer", userAnswer);
          }
          this.$set(this.questionDetailsInfo, "answer", obj);
        }
        
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
  },
};
</script>

<style lang="scss" scoped>
/*外层容器*/ 
.baseTypeStem {
    
    height: 100%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    color: #3C3C3C;
    &::-webkit-scrollbar {
      display: none;
    }
    .baseTypeStem_key {
      
      padding-bottom: 0px;
      /*选择*/
      .op {
        display: flex;
        padding: 20px 24px 0;
        .op-item {
          box-sizing: border-box;
          border: 1px solid #cccccc;
          display: flex;
          align-items: center;
          padding: 6px 18px;
          border-radius: 5px;
          max-width: 100%;
          min-width: 30%;
          width: initial;
          min-height: 40px;
          flex: none;
          &:hover {
            cursor: pointer;
          }

          .key, .value {
            &>span {
              img{
                width:100% !important;
                display: block;
              }
            }
          }
          
          .value_img {
            /deep/ img {
              vertical-align: middle;
            }
          }
          .key {
            color: #3C3C3C;
          }
          .line {
            display: inline-block;
            border-right: 1px solid #CCCCCC;
            height: 15px;
            margin: 0 14px 0 12.5px;

          }
          
        }
        .isBorder {
            border: none;
            padding: 0px;
            align-items: flex-start;
            .line {
              height: 19px;
            }
            .key, .line {
              transform: translateY(2px);
            }
        }
        /*点击情况*/
        .active {
          border: 1px solid var(--color);
          background: var(--color2);
          .key, .value_wrap .value {
            color: var(--color);
          }
        }
        /*正确情况*/
        .ok {
          border: 1px solid var(--color3);
          background: var(--color4);
          .key, .value_wrap .value {
            color: var(--color3);
          }
        }
        /*错误情况*/
        .err {
          border: 1px solid var(--color5);
          background: var(--color6);
          .key, .value_wrap .value {
            color: var(--color5);
          }
        }
      }
      /*填空*/
      .blanks{
        .blank{
          border: 1px solid #ccc;
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          
          
          min-height: inherit;
          border-radius: 5px;
          margin: 20px 24px 0;
          /*填空key值*/
          .index{
            color: #3C3C3C;
            display: flex;
            justify-content: center;
            align-items: center;
            padding-left: 18px;
            width: 50px;
            min-width: 50px;
          }
          .line {
            display: inline-block;
            border-right: 1px solid #CCCCCC;
            
            height: 14px;
            margin: 0 16px;
          }
          /*input外层容器*/
          .cont{
            box-sizing: border-box;
            width: 100%;
            z-index: 1;
            line-height: 20px;
            padding: 10px 10px 10px 0;
            textarea {
              font-size: 16px;
              &::-webkit-input-placeholder {
                color: #BBBBBB;
                font-size: 14px;
              }
            }
          }
          
          .ok {
            color: var(--color3);
            // background: var(--color3);
          }
          
          /*错误情况*/
          .err {
            color: var(--color5);
            // background: var(--color6);
          }
          input,textarea{
            outline: none;
            border: none;
            // overflow: hidden;
            display: block;  // 消除 inline-block 基线对齐产生的底部间隙
            padding: 0;      // 去掉浏览器默认 2px 内边距
            line-height: 20px; // 与 .cont 行高保持一致，与「空1」水平对齐
            width: 100%;
            height: 100%;
            font-family: inherit; // textarea 默认 monospace，改为继承页面字体，与「空1」一致
            font-size: 16px;      // 与 richTextContainer（空1）字号一致
            color: #3C3C3C;       // 与 .index（空1）字色一致
            background-color: transparent;
            overflow: hidden;  // 防止换行出现滚动条闪动
            box-sizing: border-box;
            transition: all 0.2s linear;
            resize:none;
            &::-webkit-scrollbar {
              display: none;
            }
            &::-webkit-input-placeholder {
              color: #BBBBBB;
              font-size: 14px;
            }
          }
          
          .compound-blank {
            width: 50%;
            min-width: 264px;
          }
        }
      }

      /*判断题*/
      .judge {
        
        margin: 0 0 0 24px;
        &:hover {
          cursor: pointer;
        }
        &>div {
          border: 1px solid #ccc;
          text-align: left;
          // margin-bottom: 15px;
          padding-left: 20px;
          box-sizing: border-box;
          color: #5E5E5E;
          border-radius: 5px;
          height: 40px;
          line-height: 40px;
          margin-top: 20px;
          padding-left: 20px;
          width: 180px;

          /*点击情况*/
          &.active {
            border: 1px solid var(--color);
            color: var(--color);
            background: var(--color2);
          }
          &.ok {
            border: 1px solid var(--color3);
            color: var(--color3);
            background: var(--color4);
          }
          &.err {
            border: 1px solid var(--color5);
            color: var(--color5);
            background: var(--color6);
          }
        }
        
        .right {
            margin-right: 20px;
            border: none;
            display: inline-block;
            margin-top: 0px;
            width:auto;
        }
        .wrong {
            border: none;
            display: inline-block;
            margin-top: 0px;
            width:auto
        }
      }

      /*完形填空*/
      .gestalt {
        .gestalt-item {
          display: flex;
          justify-content: space-between;
          /*左侧index值*/
          .left-index {
            margin-top: 28px;
          }
          /*右侧选项值*/
          .right-options {
            width: 309px;
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            & >div {
              width: 149px;
              height: 42px;
              line-height: 42px;
              border: 1px solid #cccccc;
              border-radius: 5px;
              margin-top: 12px;
              .key {
                padding-right: 10px;
                padding-left: 15px;
              }
            }
            /*正确情况*/
            .ok {
              color: var(--color3);
              background: var(--color3);
            }
            /*错误情况*/
            .err {
              color: var(--color5);
              background: var(--color6);
            }
          }
        }
      }

      /*书面表达*/
      .written {
        .answer-wrap {
          border: 1px solid #d9d9d9;
          margin: 12px 12px 0;
          padding: 12px;
          border-radius: 4px;
          word-break: break-word;
          line-height: 20px;
          
          margin: 10px 24px 0;
          padding: 10px 20px;
          border-radius: 6px;
        }
        /*正确情况*/
        .ok {
          color: var(--color3);
        }
        /*错误情况*/
        .err {
          color: var(--color5);
        }
      }

    }

    .baseTypeStem_key_written {
      padding-bottom: 0;
    }
    
    /*答案 解析*/
    .result{
      padding: 15px 24px 5px;
      .baseKnowledgeModels {
        padding-top: 10px;
      }
      
      &.analysis{
        
        display: flex;
        .analysis_info {
          flex: 1;
          .value {
            display: flex;
            
            color: #808080;
            span:first-child {
              margin-right: 0px;
            }
            span:last-child {
              flex: 1;
            }
          }
        }
      }
      &.answer{
        display: flex;
        align-items: baseline;
        .answer_know {
          flex: 1;
        }
        .value{
          flex: 1;
          color: #7ac858;
          /deep/ span {
            
            .value-child {
              display: flex;
              color: #7ac858;
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
    .topicDrt {
      
      flex: none;
    }
    
    &::-webkit-scrollbar {
      display: block;
      width: 4px;
    }
    .rightShowDisable_baseTypeStem_box {
      pointer-events: none;
      .rightShowDisable {
        span, div {
          color: var(--color3)!important;
          border-color: var(--color3)!important;
        }
      }
      // 判断题
      .rightShowDisableActive {
        color: var(--color3)!important;
          border-color: var(--color3)!important;
        span, div {
          color: var(--color3)!important;
        }
      }
    }
    .textareaFocusBlankClassName {
      border: 1px solid var(--color)!important;
    }
    .baseTypeStem_box_flexLR {
      display: flex;
      justify-content: space-between;
      height: 100%;
      .baseTypeStem_box_topicDrt {
        flex: 1;
        width: 0;
        height: 100%;
        overflow-y: auto;
        box-sizing: border-box;
      }
      .baseTypeStem_key {
        width: 40%;
        height: 100%;
        overflow-y: auto;
        .blanks:first-child {
          .blank {
            margin-top: 0;
          }
        }
      }
    }
}
.baseTypeStem_voice {
    display: flex;
    flex-direction: column;
    .topicDrt {
      flex: 1;
      overflow-x: hidden;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      &::-webkit-scrollbar {
        display: none;
      }
    }
}

@media screen and (max-width: 1024px) {
  .baseTypeStem.disabledResponse {
    .topicDrt {
      flex: initial;
      /deep/p {
        margin: 0;
      }
    }
    .baseTypeStem_key {
      padding-bottom: 10px;
      
      .written {
        .answer-wrap {    
          margin: 12px 12px 0;
          padding: 12px;
          border-radius: 4px;
        }
      }
      
      .op {
        padding: 15px 15px 0;
        .op-item {
          padding: 13px;
          border-radius: 10px;
          max-width: initial;
          min-width: initial;
          min-height: inherit;
          width: 100%;
          flex: 2;
          &:hover {
            cursor: initial;
          }
          .line {
            
            display: inline-block;
            border-right: 1px solid #CCCCCC;
            margin: 0 14px 0 12.5px;
          }
          .key {
            color: #3C3C3C;
          }

        }
        .isBorder {
          
          align-items: flex-start;
        }
      }
      .judge {
        margin: 13px 12px 0;
        &:hover {
          cursor: initial;
        }
        div {
          border-radius: 10px;
          height: 44px;
          line-height: 44px;
          margin-top: 15px;
          width: 100%;
        }
      }
      
      .blanks {
        .blank {
          border-radius: 10px;
          margin: 16px 12px 0;
          .index {
            
            z-index: 1;
            display: initial;
            padding-left: 13.5px;
            width: 30px;
            min-width: initial;
          }
          .line {
            margin: 0 14px 0 12.5px;
          }
        }
        .compound-blank {
          width: initial;
          min-width: initial;
        }
      }
      
    
      /*答案 解析*/
      .result{
        padding: 11px 12px 0;
        .baseKnowledgeModels {
          padding-top: 0px;
        }
        &.analysis {
          .analysis_info {
            .value {
              span:first-child {
                margin-right: 10px;
              }
            }
          }
        }
      }
    }
  }
}

@media screen and (min-width: 760px) and (max-width: 850px) {
   .baseTypeStem.disabledResponse {
    .baseTypeStem_key {
      .op {
        .isBorder {
            border: none;
            padding: 0px;
            align-items: flex-start;
        }
      }
      .blanks {
        .blank {
          .index {
            width: 60px !important;
          }
          .cont {
            textarea {
              height: 32px !important;
              font-size: 24px !important;
              &::-webkit-input-placeholder {
                font-size: 24px !important;
              }
            }
          }
        }
      }

    }
    
    
                                
    .result {
        padding: 20px 12px 0 !important;
        .value-4 {
            margin-bottom: 10px;
        }
        .analysis_info {
                margin-left: -10px !important;
        }
    }
  } 
}
@media screen and (min-width: 850px) and (max-width: 1280px) {
   .baseTypeStem.disabledResponse {
    height: 95% !important;
    .baseTypeStem_key {
      .op {
        .isBorder {
            border: none;
            padding: 0px;
            align-items: flex-start;
        }
      }
      .blanks {
        .blank {
          .index {
            width: 60px !important;
          }
          .cont {
            textarea {
            height: 32px !important;
              font-size: 19px !important;
              &::-webkit-input-placeholder {
                font-size: 19px !important;
              }
            }
          }
        }
      }

    }
    
                                
    .result {
        padding: 20px 12px 0 !important;
        .value-4 {
            margin-bottom: 10px;
        }
        .analysis_info {
                margin-left: -10px !important;
        }
    }
  } 
}

</style>
