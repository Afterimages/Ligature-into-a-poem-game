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
      if (this.aniId) {
        cancelAnimationFrame(this.aniId);
        this.aniId = null;
      }

      this.render();
      this.aniId = window.requestAnimationFrame(this.bindLoop);
    } catch (error) {
      console.error('Game loop error:', error);
      this.restart();
    }
  }
}
