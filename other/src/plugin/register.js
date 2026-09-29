/**
把「动态 import()」封装成「Vue 组件注册器」
用法：reg('xxx', () => import('./xxx.vue'))  返回一个函数 (Vue)=>Promise
*/
export default function reg(tagName, loader) {
    return (Vue) =>
        loader().then((raw) => {
            const cmp = raw.default || raw;
            // 使用传入的标签名注册，而不是组件内部的name
            Vue.component(tagName, cmp);
        }).catch(error => {
            console.error(`[cmelement] 组件 ${tagName} 加载失败:`, error);
        });
}
    