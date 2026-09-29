

// 根据入口文件所在目录动态设置 publicPath，chunk 自动从同目录加载
__webpack_public_path__ = (document.currentScript && document.currentScript.src || '').substring(0, (document.currentScript && document.currentScript.src || '').lastIndexOf('/') + 1);

import { dragDirective } from './directive.js';
import * as vuePrototype from './js/index';

import './js/swiper/index.css'; // swiper样式
import './js/swiper/swiper'; // swiperJS
import './static/css/iconfont/iconfont'
// 1. 定义所有组件的异步导入
const componentMap = {
  // 通用组件
  'cm-video': () => import('./video/video.vue'),
  'cm-img': () => import('./cmImg/index.vue'),
  
  // 题目相关组件
  'cm-answer-panel': () => import('./answerPanel/index.vue'),
  'cm-base-type-stem': () => import('./questionStem/baseTypeStem.vue'),
  'cm-compound-type-stem': () => import('./questionStem/compoundTypeStem.vue'),
  'cm-all-stem': () => import('./questionStem/allStem.vue'),
  'cm-single-question': () => import('./questionStem/singleQuestion.vue'),
  'cm-pop-frame': () => import('./questionStem/popFrame.vue'),
  'cm-question-result': () => import('./questionStem/questionResult.vue'),
  'cm-analysis-item': () => import('./questionStem/analysisItem.vue'),
  'cm-answer-item': () => import('./questionStem/answerItem.vue'),
  
  // 试卷组件
  'all-double-stem': () => import('./questionStem/allDoubleStem.vue'),
  'all-single-stem': () => import('./questionStem/allSingleStem.vue'),
  
  // 其他组件
  'cm-tips-page': () => import('./tipsPage/index.vue'),
  'cm-topic-drt': () => import('./topicDrt/index.vue'),
  'cm-answer-card': () => import('./answerCard/index.vue'),
  'cm-teacher-live': () => import('./liveRoom/teacherLive.vue'),
  'cm-student-live': () => import('./liveRoom/studentLive.vue'),
  // 富文本组件
  "cm-rich-text": () => import('./questionStem/richText.vue'),
};


// 3. 组件注册函数（使用异步组件，添加加载和错误处理）
// 在插件中修改组件注册函数
function installComponents(Vue) {
  Object.keys(componentMap).forEach(componentName => {
    // 注册异步组件，包含加载状态和错误处理
    Vue.component(componentName, () => ({
      // 异步组件
      component: componentMap[componentName]()
        .then(module => {
          console.log(`✅ 组件 ${componentName} 加载成功`);
          return module.default || module;
        })
        .catch(error => {
          console.error(`❌ 组件 ${componentName} 加载失败:`, error);
          console.error('错误详情:', {
            componentName,
            errorMessage: error.message,
            errorStack: error.stack,
            componentPath: `./${componentName.replace('cm-', '')}/index.vue` // 假设路径
          });
          throw error; // 重新抛出错误，让 error 组件显示
        }),
      // 加载中显示的组件
      loading: {
        template: '<div style="padding: 10px; text-align: center; color: #999;">数据加载中...</div>',
        mounted() {
          console.log(`⏳ 组件 ${componentName} 正在加载...`);
        }
      },
      // 加载失败显示的组件
      error: {
        template: '<div style="padding: 20px; text-align: center; color: #f56c6c; border: 1px solid #f56c6c; border-radius: 4px; margin: 10px;">数据加载失败，请刷新重试</div>',
        mounted() {
          console.error(`🚨 组件 ${componentName} 加载失败，进入错误状态`);
        }
      },
      // 延迟显示loading的时间（ms）
      delay: 100,
      // 加载超时时间（ms）
      timeout: 10000
    }));
  });
}

      // require('./static/css/iconfont/iconfont.css');
// 4. 修复样式加载
function loadGlobalStyles() {
  // 使用 require 确保同步加载
  if (typeof require !== 'undefined') {
    try {
      require('./static/css/reset.css');
    } catch (e) {
      console.warn('样式加载失败:', e);
    }
  }
}


function loadKatex() {
  if (typeof window.katex !== 'undefined') {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    // 加载 CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://all-static-resource.oss-cn-beijing.aliyuncs.com/katex/katex.min.css';
    document.head.appendChild(link);

    // 加载 JS
    const script = document.createElement('script');
    script.src = 'https://all-static-resource.oss-cn-beijing.aliyuncs.com/katex/katex.min.js';
    script.onload = () => {
      resolve();
    };
    script.onerror = () => reject(new Error('KaTeX 加载失败'));
    document.head.appendChild(script);
  });
}

// 6. 创建插件对象
const cmelementPlugin = {
  // 主安装方法
  install(Vue, options = {}) {
    console.log('📦 cmelement 插件开始安装...');
    
    // 1. 注册指令
    Vue.directive('dragDirective', dragDirective);
    
    // 2. 添加原型方法 & 挂载到 window
    Object.keys(vuePrototype).forEach(key => {
      Vue.prototype[key] = vuePrototype[key];
      window[key] = vuePrototype[key];
    });
    
    // 3. 创建事件总线
    if (!Vue.prototype.$bus) {
      Vue.prototype.$bus = new Vue();
      window.BUS = Vue.prototype.$bus;
    }
    
    // 4. 添加消息方法
    Vue.prototype.showToast = function(msg = '', duration = 3000, type = 'info') {
      if (this.$message) {
        this.$message.closeAll();
        this.$message({
          message: msg,
          type,
          duration,
          dangerouslyUseHTMLString: true,
          customClass: 'common-toast',
        });
      }
    };
    
    // 5. 安装所有组件（默认全部安装）
    installComponents(Vue);
    
    // 6. 加载 latex
    loadKatex();
    
    // 7. 加载全局样式（如果需要）
    if (options.loadGlobalStyles !== false) {
      loadGlobalStyles();
    }
    
  },
  
  // 辅助方法：单独安装组件
  installComponent(Vue, componentName) {
    if (componentMap[componentName]) {
      Vue.component(componentName, componentMap[componentName]);
      return true;
    }
    console.warn(`⚠️ 组件 ${componentName} 不存在`);
    return false;
  },
  
  // 辅助方法：批量安装组件
  installComponents(Vue, componentNames) {
    if (Array.isArray(componentNames)) {
      componentNames.forEach(name => this.installComponent(Vue, name));
    }
  }
};

// 7. 导出插件
export default cmelementPlugin;

// 8. 导出组件映射（方便按需引入）
export { componentMap };

// 9. 导出单个组件（按需引入用）
export const CmVideo = componentMap['cm-video'];
export const CmImg = componentMap['cm-img'];
export const CmAnswerPanel = componentMap['cm-answer-panel'];
export const CmBaseTypeStem = componentMap['cm-base-type-stem'];
export const CmCompoundTypeStem = componentMap['cm-compound-type-stem'];
export const CmAllStem = componentMap['cm-all-stem'];
export const CmSingleQuestion = componentMap['cm-single-question'];
export const CmPopFrame = componentMap['cm-pop-frame'];
export const CmQuestionResult = componentMap['cm-question-result'];
export const CmAnalysisItem = componentMap['cm-analysis-item'];
export const CmAnswerItem = componentMap['cm-answer-item'];
export const AllDoubleStem = componentMap['all-double-stem'];
export const AllSingleStem = componentMap['all-single-stem'];
export const CmTipsPage = componentMap['cm-tips-page'];
export const CmTopicDrt = componentMap['cm-topic-drt'];
export const CmAnswerCard = componentMap['cm-answer-card'];
export const CmTeacherLive = componentMap['cm-teacher-live'];
export const CmStudentLive = componentMap['cm-student-live'];

// 10. 自动安装（当在浏览器环境中且Vue可用时）
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(cmelementPlugin);
}

// 11. 为 script 标签引入提供全局变量
if (typeof window !== 'undefined') {
  window.cmelement = cmelementPlugin;
  window.Cmelement = cmelementPlugin;
}