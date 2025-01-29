import { canvas } from './render';
import DataBus from './databus';
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
    this.restart();
  }

  restart() {
    // 确保清理之前的状态
    if (this.aniId) {
      cancelAnimationFrame(this.aniId);
      this.aniId = null;
    }
    
    // 解绑之前的事件处理器
    try {
      wx.offTouchStart();
      wx.offTouchMove();
      wx.offTouchEnd();
    } catch (error) {
      console.warn('清理事件监听器失败:', error);
    }

    this.bindLoop = this.loop.bind(this);
    
    // 初始化数据总线
    GameGlobal.databus = new DataBus();
    
    // 初始化音乐管理器
    GameGlobal.musicManager = new Music();
    
    // 初始化游戏网格
    this.grid = new Grid();
    GameGlobal.grid = this.grid;
    
    // 初始化游戏信息
    this.gameinfo = new GameInfo();
    
    // 重新绑定事件
    this.bindEvents();
    
    // 开始新的游戏循环
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
      // 不再需要调用 markMatched，因为我们现在使用颜色来标记已完成的诗句
      // this.grid.markMatched(GameGlobal.databus.currentPath);
    }
    this.grid.updateSelection([]);
    GameGlobal.databus.clearPath();
  }

  render() {
    if (GameGlobal.databus.isGameOver) {
      this.gameinfo.render(ctx);
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.grid.render(ctx);
    this.gameinfo.render(ctx);
  }

  loop() {
    try {
      // 先取消之前的动画帧
      if (this.aniId) {
        cancelAnimationFrame(this.aniId);
        this.aniId = null;
      }

      // 确保游戏状态正常才继续循环
      if (!GameGlobal.databus.isGameOver) {
        this.render();
        this.aniId = requestAnimationFrame(this.bindLoop);
      } else {
        this.render(); // 渲染最后一帧
      }
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
