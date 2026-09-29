
import App from './App.vue';
import './utils/rem';
import '../static/css/reset.css';
import '../static/css/index.scss';
// import "cmelement/dist/css/main.css";
import router from './router/index';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// import  '../static/iconfont/iconfont';
Vue.use(ElementUI);
// import '../dist/css/main.css'
// import cmelement from '../dist/cmelement.js'


// import cmelement from '../cmelement/cmelement.js';

import cmelement from './plugin/index';
// import '../cmelement/css/main.css'
// import cmelement from '../static/js/cmelement/cmelement.js'
// import * as cmelementModule from '../cmelement/cmelement.js';


Vue.use(cmelement);

window.$vue = new Vue({
    router,
    render: h => h(App),
}).$mount('#app');