# 基于 Nest 的 KOOK Webhook 模式 机器人 服务端应用

## 功能介绍

- 一套代码部署多个机器人 (基于多环境配置文件)
- kook api 请求频率控制（防止超频）
- 机器人暂停服务
- 指令解析
- 卡片消息按钮点击处理

## 目录介绍

- main.js 服务端入口文件
- app 核心代码目录
  -- app.module.ts 核心模块引入
  -- app.controller.ts 核心控制器 包含 kook 消息解析及调用
- queue api 调用队列模块
- utils
  -- get_kook_instruct_type.ts kook 消息类型解析（可自定义指令解析）
  -- fetch_kook_api.ts kook api 请求封装
  -- to.ts 针对 await promise 的优雅 catch 处理函数

## 如何启动(指定机器人服务)

登录开发者平台 https://developer.kookapp.cn/app/index 获取机器人配置项 然后前往 根目录下的 .config 文件夹下修改对应环境的配置文件

```js
// 安装依赖
yarn
// 启动测试环境1
yarn start:dev1
```

## 如何本地调试

1. 下载一个内网穿透工具 如 花生壳
2. 映射至本地服务端口
3. 在开发者机器人后台 Callback Url 填写映射的地址 + /api/challenge?compress=0 （此处不需要写端口号 应为映射地址包含了端口映射） 如：http://xxx.xxx.com:6001/api/challenge?compress=0

## 个人建议的调试方式

使用 Vscode 编辑器的 SSH Remote 插件 在远程服务器上调试 （至少需要 4G 内存的服务器 否则可能内存吃满后无响应）
在远程服务器开发 需要填写 ip + 端口 + /api/challenge?compress=0
如：http://127.0.0.1:6001/api/challenge?compress=0

## 自定义指令解析

在 src/utils/get_kook_instruct_type.ts 文件内
内置了 三个指令解析 + 卡片按钮点击处理

1. /帮助
2. /个人信息
3. /设置
   所有指令的具体业务逻辑都在 app.service.ts 内（如有需要可拆分模块）

## await promise catch 处理方法（推荐）

https://www.npmjs.com/package/await-to-js
因为 该 npm 包源码过于简单（就一个函数）
所以直接将源码复制到了 src/utils/to.ts 内

## 一个仅 200b 的 functional event emitter / pubsub.

https://www.npmjs.com/package/mitt
也已经复制到了 src/utils/mitt.ts 内

```js
// 示例：请求错误处理

// 1. 传统try catch
try {
  const result = await fetch();
  if (result.code !== 0) {
    // 处理错误
  }
} catch (error) {
  // 处理错误
}

// 2. .then .catch
fetch()
  .then((result) => {
    if (result.code !== 0) {
      // 处理错误
    }
  })
  .catch((error) => {
    // 处理错误
  });

// 2. await to方法
import to from 'src/utils/to';

const [error, result] = await to(fetct());
if (error || result.code !== 0) {
  // 处理错误
}
```

## 如何处理 kook api 请求频率限制

考虑了易用性和的情况下，目前的解决方案是：
在 src/queue/queue.service.ts 内 使用任务调度模块的 Interval 装饰器 限制请求之间的间隔时间（简单好理解）
仅需要像 数组内 push 任务数据即可
然后使用 shift 方法取出任务数据并执行

最优解是（需要学习更多的概念和使用）：参考 nest.js 的队列章节 https://docs.nestjs.com/techniques/queues

1. 使用三方 mq 如 rabbitmq 实现队列
2. 使用 bull + redis 实现队列 控制任务队列消费速率 example: https://github.com/nestjs/nest/tree/master/sample/26-queues
   // example 每 30 秒最多处理 30 个任务
   limiter: {
   max: 30,
   duration: 30 \* 1000
   }

## 为什么在更新 kook 消息处使用 Map 数据结构 而在其他地方使用数组

因为 更新消息时 同一个用户的任务可能会多次触发（如 gpt 机器人 画图机器人），
且前置堆积的任务还未被更新，所以使用 Map 数据结构方便更新任务数据，防止重复排队更新。

## 如何部署

根目录下有对应环境配置的 pm2 配置文件

请建立两个机器人 一个测试环境 一个正式环境 不要混用 注意环境数据隔离

```js
// 单机器人 测试环境 部署
yarn build
yarn pub:dev1
// 多机器人线上集体部署
yarn build
yarn pub:prodall
```
