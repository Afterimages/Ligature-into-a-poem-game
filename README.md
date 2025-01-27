# 示例游戏

示例相关说明查阅[新手教程](https://developers.weixin.qq.com/minigame/dev/guide/develop/start.html)

## 源码目录介绍

```
├── audio                                      // 音频资源
├── images                                     // 图片资源
├── js
│   ├── base
│   │   ├── animatoin.js                       // 帧动画的简易实现
│   │   ├── pool.js                            // 对象池的简易实现
│   │   └── sprite.js                          // 游戏基本元素精灵类
│   ├── libs
│   │   └── tinyemitter.js                     // 事件监听和触发
│   ├── npc
│   │   └── enemy.js                           // 敌机类
│   ├── player
│   │   ├── bullet.js                          // 子弹类
│   │   └── index.js                           // 玩家类
│   ├── runtime
│   │   ├── background.js                      // 背景类
│   │   ├── gameinfo.js                        // 用于展示分数和结算界面
│   │   └── music.js                           // 全局音效管理器
│   ├── databus.js                             // 管控游戏状态
│   ├── main.js                                // 游戏入口主函数
│   └── render.js                              // 基础渲染信息
├── .eslintrc.js                               // 代码规范
├── game.js                                    // 游戏逻辑主入口
├── game.json                                  // 游戏运行时配置
├── project.config.json                        // 项目配置
└── project.private.config.json                // 项目个人配置
```


game.json:
/**
 * 游戏配置文件
 * 
 * 功能说明：
 * 1. 定义游戏基础配置
 * 2. 设置：
 *    - 屏幕方向为竖屏
 *    - 游戏窗口样式
 *    - 基础功能配置
 */

 project.config.json:
 /**
 * 项目配置文件
 * 
 * 功能说明：
 * 1. 定义项目基本信息
 * 2. 配置开发环境
 * 3. 设置编译选项
 */


project.private.config.json:
/**
 * 项目私有配置文件
 * 
 * 功能说明：
 * 1. 存储个人开发配置
 * 2. 覆盖 project.config.json 中的相同字段
 * 3. 用于团队开发时的个性化配置
 */


 game.js
/**
 * 连接诗句游戏入口文件
 * 
 * 功能说明：
 * 1. 作为游戏主入口点
 * 2. 初始化游戏主类 Main
 * 3. 负责：
 *    - 游戏生命周期管理
 *    - 场景初始化
 *    - 资源加载
 */