/**
 * 游戏主控制器
 * 
 * 功能说明：
 * 1. 游戏主循环
 * 2. 管理：
 *    - 格子矩阵状态
 *    - 诗句匹配逻辑
 *    - 触摸事件处理
 *    - 得分系统
 * 3. 协调游戏整体流程
 */

import { canvas } from './render';  // 导入canvas
import Player from './player/index'; // 导入玩家类
import Enemy from './npc/enemy'; // 导入敌机类
import BackGround from './runtime/background'; // 导入背景类
import GameInfo from './runtime/gameinfo'; // 导入游戏UI类
import Music from './runtime/music'; // 导入音乐类
import DataBus from './databus'; // 导入数据类，用于管理游戏状态和数据
import Grid from './runtime/grid';

const ENEMY_GENERATE_INTERVAL = 30;
let ctx = null;

GameGlobal.databus = new DataBus(); // 全局数据管理，用于管理游戏状态和数据
GameGlobal.musicManager = new Music(); // 全局音乐管理实例

/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    // 获取canvas上下文
    if (!ctx) {
      try {
        ctx = canvas.getContext('2d');
      } catch (error) {
        console.error('Failed to get canvas context:', error);
        return;
      }
    }
    
    this.aniId = 0;
    this.restart();
  }

  restart() {
    this.bindLoop = this.loop.bind(this);
    
    // 初始化数据总线
    GameGlobal.databus = new DataBus();
    
    // 初始化音乐管理器
    GameGlobal.musicManager = new Music();
    
    // 初始化游戏网格
    this.grid = new Grid();
    
    // 初始化游戏信息
    this.gameinfo = new GameInfo();
    
    // 绑定事件
    this.bindEvents();
    
    // 开始游戏循环
    this.loop();
  }

  bindEvents() {
    try {
      wx.onTouchStart(this.onTouchStart.bind(this));
      wx.onTouchMove(this.onTouchMove.bind(this));
      wx.onTouchEnd(this.onTouchEnd.bind(this));
    } catch (error) {
      console.error('Failed to bind touch events:', error);
    }
  }

  onTouchStart(e) {
    const touch = e.touches[0];
    const cell = this.grid.getCellByTouch(touch);
    if (cell && cell.text) {
      GameGlobal.databus.addToPath(cell);
      this.grid.updateSelection(GameGlobal.databus.currentPath);
    }
  }

  onTouchMove(e) {
    const touch = e.touches[0];
    const cell = this.grid.getCellByTouch(touch);
    if (cell && cell.text && !GameGlobal.databus.currentPath.includes(cell)) {
      const lastCell = GameGlobal.databus.currentPath[GameGlobal.databus.currentPath.length - 1];
      if (this.grid.isAdjacent(lastCell, cell)) {
        GameGlobal.databus.addToPath(cell);
        this.grid.updateSelection(GameGlobal.databus.currentPath);
      }
    }
  }

  onTouchEnd() {
    if (GameGlobal.databus.checkPathMatch()) {
      this.grid.markMatched(GameGlobal.databus.currentPath);
    }
    this.grid.updateSelection([]);
    GameGlobal.databus.clearPath();
  }

  /**
   * 随着帧数变化的敌机生成逻辑
   * 帧数取模定义成生成的频率
   */
  enemyGenerate() {
    // 每30帧生成一个敌机
    if (GameGlobal.databus.frame % ENEMY_GENERATE_INTERVAL === 0) {
      const enemy = GameGlobal.databus.pool.getItemByClass('enemy', Enemy); // 从对象池获取敌机实例
      enemy.init(); // 初始化敌机
      GameGlobal.databus.enemys.push(enemy); // 将敌机添加到敌机数组中
    }
  }

  /**
   * 全局碰撞检测
   */
  collisionDetection() {
    // 检测子弹与敌机的碰撞
    GameGlobal.databus.bullets.forEach((bullet) => {
      for (let i = 0, il = GameGlobal.databus.enemys.length; i < il; i++) {
        const enemy = GameGlobal.databus.enemys[i];

        // 如果敌机存活并且发生了发生碰撞
        if (enemy.isCollideWith(bullet)) {
          enemy.destroy(); // 销毁敌机
          bullet.destroy(); // 销毁子弹
          GameGlobal.databus.score += 1; // 增加分数
          break; // 退出循环
        }
      }
    });

    // 检测玩家与敌机的碰撞
    for (let i = 0, il = GameGlobal.databus.enemys.length; i < il; i++) {
      const enemy = GameGlobal.databus.enemys[i];

      // 如果玩家与敌机发生碰撞
      if (this.player.isCollideWith(enemy)) {
        this.player.destroy(); // 销毁玩家飞机
        GameGlobal.databus.gameOver(); // 游戏结束

        break; // 退出循环
      }
    }
  }

  render() {
    // 游戏结束停止渲染
    if (GameGlobal.databus.isGameOver) {
      this.gameinfo.render(ctx);
      return;
    }

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 渲染网格
    this.grid.render(ctx);

    // 渲染游戏信息（包括得分）
    this.gameinfo.render(ctx);
  }

  loop() {
    try {
      // 清除上一帧的动画
      if (this.aniId) {
        cancelAnimationFrame(this.aniId);
        this.aniId = null;
      }

      this.render();
      this.aniId = window.requestAnimationFrame(this.bindLoop);
    } catch (error) {
      console.error('Game loop error:', error);
      // 发生错误时重启游戏
      this.restart();
    }
  }

  // 游戏逻辑更新主函数
  update() {
    GameGlobal.databus.frame++; // 增加帧数

    if (GameGlobal.databus.isGameOver) {
      return;
    }

    this.bg.update(); // 更新背景
    this.player.update(); // 更新玩家
    // 更新所有子弹
    GameGlobal.databus.bullets.forEach((item) => item.update());
    // 更新所有敌机
    GameGlobal.databus.enemys.forEach((item) => item.update());

    this.enemyGenerate(); // 生成敌机
    this.collisionDetection(); // 检测碰撞
  }
}
