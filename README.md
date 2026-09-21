# 乐享桌面端

基于 [jj_shop](../jj_shop) 业务迁移的 **Electron + Vue 3 + TypeScript + Pinia** 桌面客户端。

## 技术栈

- Electron 39 + electron-vite 5
- Vue 3 + Vue Router + Pinia
- TypeScript
- ECharts（数据大屏）

## 开发

需要 Node.js 18+（本机若默认是 Node 14，先执行 `nvm use 24`）。后端默认代理到 `http://127.0.0.1:8017`，可与网页端共用同一套接口。

```bash
npm install
npm run dev
```

自定义后端地址：

```bash
set JJ_API_ORIGIN=http://127.0.0.1:8017
npm run dev
```

## 打包

```bash
npm run build:win
```

安装包输出到 `dist/`。

## 桌面端差异

- 无边框窗口 + 自定义标题栏
- 登录态、购物车、订单、关注列表由 Pinia 管理并本地持久化
- 生产环境通过本地静态服务转发 `/api` 与 `/uploads`
