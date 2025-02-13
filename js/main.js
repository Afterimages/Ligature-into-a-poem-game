import { canvas } from './render';
import DataBus from './databus/index.js';
import Grid from './runtime/grid';
import GameInfo from './runtime/gameinfo';
import Music from './runtime/music';

let ctx = null;

GameGlobal.databus = new DataBus();
GameGlobal.musicManager = new Music();

export default class Main {
  constructor() {
    if (!ctx) {
      try {
        ctx = canvas.getContext('2d');
      } catch (error) {
        console.error('Failed to get canvas context:', error);
        return;
      }
    }
    
    this.aniId = 0;
    // 绑定事件处理函数到实例
    this.onTouchStartHandler = this.onTouchStart.bind(this);
    this.onTouchMoveHandler = this.onTouchMove.bind(this);
    this.onTouchEndHandler = this.onTouchEnd.bind(this);
    
    this.restart();
  }

  restart() {
    console.log('=== 开始执行重启 ===');
    // 确保清理之前的状态
    if (this.aniId) {
      cancelAnimationFrame(this.aniId);
      this.aniId = null;
    }
    
    // 解绑事件
    this.unbindEvents();

    this.bindLoop = this.loop.bind(this);
    
    // 清除旧的 DataBus 实例
    DataBus.clearInstance();
    
    // 初始化数据总线
    console.log('重新初始化数据总线');
    GameGlobal.databus = new DataBus();
    
    // 初始化音乐管理器
    GameGlobal.musicManager = new Music();
    
    // 初始化游戏网格
    console.log('重新初始化游戏网格');
    this.grid = new Grid();
    GameGlobal.grid = this.grid;
    
    // 初始化游戏信息
    this.gameinfo = new GameInfo();
    
    // 重新绑定事件
    this.bindEvents();
    
    // 开始新的游戏循环
    console.log('=== 重启完成，开始新的游戏循环 ===');
    this.loop();
  }

  bindEvents() {
    try {
      // 先解绑所有事件
      this.unbindEvents();
      
      // 使用保存的处理函数绑定事件
      wx.onTouchStart(this.onTouchStartHandler);
      wx.onTouchMove(this.onTouchMoveHandler);
      wx.onTouchEnd(this.onTouchEndHandler);
      
      console.log('事件绑定完成');
    } catch (error) {
      console.error('Failed to bind touch events:', error);
    }
  }

  unbindEvents() {
    try {
      wx.offTouchStart(this.onTouchStartHandler);
      wx.offTouchMove(this.onTouchMoveHandler);
      wx.offTouchEnd(this.onTouchEndHandler);
      console.log('事件解绑完成');
    } catch (error) {
      console.warn('清理事件监听器失败:', error);
    }
  }

  onTouchStart(e) {
    // 如果游戏结束，点击任意位置重新开始
    if (GameGlobal.databus.isGameOver) {
      console.log('检测到游戏结束状态，准备重启');
      console.log('当前 isGameOver:', GameGlobal.databus.isGameOver);
      this.restart();
      console.log('重启后 isGameOver:', GameGlobal.databus.isGameOver);
      return;
    }
    
    // 正常游戏中的触摸处理
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
      // 不再需要调用 markMatched，因为我们现在使用颜色来标记已完成的诗句
      // this.grid.markMatched(GameGlobal.databus.currentPath);
    }
    this.grid.updateSelection([]);
    GameGlobal.databus.clearPath();
  }

  render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 先渲染游戏网格
    this.grid.render(ctx);
    
    // 再渲染游戏信息（确保在最上层）
    this.gameinfo.render(ctx);
  }

  loop() {
    try {
      // 先取消之前的动画帧
      if (this.aniId) {
        cancelAnimationFrame(this.aniId);
        this.aniId = null;
      }

      // 无论游戏状态如何都要渲染
      this.render();
      
      // 继续请求下一帧
      this.aniId = requestAnimationFrame(this.bindLoop);
      
    } catch (error) {
      console.error('Game loop error:', error);
      // 避免无限重启
      if (!this.isRestarting) {
        this.isRestarting = true;
        setTimeout(() => {
          this.isRestarting = false;
          this.restart();
        }, 1000);
      }
    }
  }

  init() {
    // 添加事件监听器时保存引用
    this.boundHandler = this.handleEvent.bind(this)
    someEmitter.on('event', this.boundHandler)
  }

  destroy() {
    // 在组件销毁时移除事件监听器
    someEmitter.off('event', this.boundHandler)
  }
}
