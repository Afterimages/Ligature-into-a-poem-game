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

import './render'; // 初始化Canvas
import Player from './player/index'; // 导入玩家类
import Enemy from './npc/enemy'; // 导入敌机类
import BackGround from './runtime/background'; // 导入背景类
import GameInfo from './runtime/gameinfo'; // 导入游戏UI类
import Music from './runtime/music'; // 导入音乐类
import DataBus from './databus'; // 导入数据类，用于管理游戏状态和数据
import Grid from './runtime/grid';

const ENEMY_GENERATE_INTERVAL = 30;
const ctx = canvas.getContext('2d'); // 获取canvas的2D绘图上下文;

GameGlobal.databus = new DataBus(); // 全局数据管理，用于管理游戏状态和数据
GameGlobal.musicManager = new Music(); // 全局音乐管理实例

/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    this.aniId = 0;
    this.bindEvents();
    this.init();
  }

  init() {
    GameGlobal.databus = new DataBus();
    GameGlobal.musicManager = new Music();
    
    this.grid = new Grid();
    this.gameinfo = new GameInfo();
    
    this.start();
  }

  bindEvents() {
    wx.onTouchStart(this.onTouchStart.bind(this));
    wx.onTouchMove(this.onTouchMove.bind(this));
    wx.onTouchEnd(this.onTouchEnd.bind(this));
  }

  onTouchStart(e) {
    const cell = this.grid.getCellByTouch(e.touches[0]);
    if (cell && cell.text) {  // 只有有文字的格子才能被选中
      GameGlobal.databus.addToPath(cell);
      this.grid.updateSelection(GameGlobal.databus.currentPath);
      GameGlobal.musicManager.playSelect();
    }
  }

  onTouchMove(e) {
    const cell = this.grid.getCellByTouch(e.touches[0]);
    if (cell && !GameGlobal.databus.currentPath.includes(cell)) {
      const lastCell = GameGlobal.databus.currentPath[GameGlobal.databus.currentPath.length - 1];
      if (this.isAdjacent(lastCell, cell)) {
        GameGlobal.databus.addToPath(cell);
        this.grid.updateSelection(GameGlobal.databus.currentPath);
        GameGlobal.musicManager.playSelect();
      }
    }
  }

  isAdjacent(cell1, cell2) {
    if (!cell1 || !cell2) return false;
    const rowDiff = Math.abs(cell1.row - cell2.row);
    const colDiff = Math.abs(cell1.col - cell2.col);
    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
  }

  onTouchEnd() {
    if (GameGlobal.databus.checkPathMatch()) {
      this.grid.markMatched(GameGlobal.databus.currentPath);
      GameGlobal.musicManager.playSuccess();
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
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.grid.render(ctx);
    this.gameinfo.render(ctx);
  }

  loop() {
    this.render();
    this.aniId = requestAnimationFrame(this.loop.bind(this));
  }

  start() {
    this.loop();
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
