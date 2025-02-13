import PoemManager from './poems';
import GridManager from './grid-manager';
import PathManager from './path-manager';
import ScoreManager from './score-manager';

let instance;

export default class DataBus {
  constructor() {
    if (instance) {
      // 如果是重新创建实例，需要重置所有状态
      instance.reset();
      return instance;
    }
    
    instance = this;
    // 添加调试模式标记
    this.isDebugMode = true;  // 设置为 true 开启调试模式
    
    // 1. 初始化颜色配置
    this.colors = [
        '#45B7D1',  // 蓝色
        '#FF6B6B',  // 红色
        '#FFB800',  // 橙色
        '#4CAF50',  // 绿色
        '#9C27B0',  // 紫色
        '#FF5722',  // 深橙色
        '#2196F3',  // 天蓝色
        '#E91E63'   // 粉色
      ];
    this.completedPoemColors = new Map();
    
    // 2. 初始化各个管理器
    this.pathManager = new PathManager();
    this.poemManager = new PoemManager();
    this.gridManager = new GridManager(this.pathManager);  // 传入 pathManager
    this.scoreManager = new ScoreManager();
    
    // 3. 最后调用 reset
    this.reset();
  }

  static clearInstance() {
    instance = null;
  }

  reset() {
    console.log('DataBus reset 开始');
    // 重置所有状态
    this.poemManager.reset();
    this.gridManager.reset();
    this.pathManager.reset();
    this.scoreManager.reset();
    this.completedPoemColors = new Map();
    
    if (this.scoreManager.isDebugMode) {
        console.log('使用调试模式初始化');
        this.initDebugLevel();
    } else {
        this.initLevel();
    }
    console.log('DataBus reset 完成，isGameOver:', this.scoreManager.isGameOver);
  }

  // 代理方法，使外部调用方式保持不变
  get isGameOver() { return this.scoreManager.isGameOver; }
  get score() { return this.scoreManager.score; }
  get currentLevelScore() { return this.scoreManager.currentLevelScore; }
  get level() { return this.scoreManager.level; }
  get grid() { return this.gridManager.grid; }
  get rows() { return this.gridManager.rows; }
  get cols() { return this.gridManager.cols; }
  get currentPath() { return this.pathManager.currentPath; }
  get poems() { return this.poemManager.poems; }
  get completedPoems() { return this.poemManager.completedPoems; }

  // 其他必要的代理方法
  addToPath(cell) {
    this.pathManager.addToPath(cell);
  }

  clearPath() {
    this.pathManager.clearPath();
  }

  checkPathMatch() {
    if (this.pathManager.currentPath.length === 0) return false;

    const selectedContent = this.pathManager.currentPath
      .map(cell => cell.text)
      .filter(text => text !== ' ')
      .join('');

    // 遍历所有未完成的诗句
    for (const poem of this.poemManager.poems) {
      if (this.poemManager.isCompleted(poem.id)) {
        continue;
      }

      const poemContent = poem.content
        .split('')
        .filter(char => !/[，。、？！；：]/.test(char))
        .join('');

      if (selectedContent === poemContent) {
        // 为完成的诗句分配一个颜色
        const unusedColors = this.colors.filter(color => 
          !Array.from(this.completedPoemColors.values()).includes(color)
        );
        const colorIndex = this.poemManager.completedPoems.length % this.colors.length;
        const color = unusedColors[0] || this.colors[colorIndex];
        
        this.completedPoemColors.set(poem.id, color);
        
        // 记录这个诗句的位置
        const positions = this.pathManager.currentPath.map(cell => ({
          row: cell.row,
          col: cell.col
        }));
        
        this.pathManager.poemPlacements.set(poemContent, positions);

        // 更新完成状态
        this.poemManager.addCompletedPoem(poem.id);
        this.scoreManager.addScore(2);  // 调试模式固定2分

        // 显示得分提示
        wx.showToast({
          title: '+2分',
          icon: 'none',
          duration: 1000
        });

        // 检查是否完成所有诗句
        if (this.poemManager.completedPoems.length === this.poemManager.poems.length) {
          if (this.scoreManager.isDebugMode) {
            wx.showToast({
              title: '游戏完成！',
              icon: 'success',
              duration: 1500
            });
            this.scoreManager.isGameOver = true;
          }else {
            // 原有的多关卡逻辑
            // ... 此处省略原有代码 ...
          }
        }

        // 强制重新渲染网格
        if (GameGlobal.grid) {
            GameGlobal.grid.render();
        }

        return true;
      }
    }
    return false;
  }

  // 新增调试模式的关卡初始化方法
  initDebugLevel() {
    console.log('初始化调试模式');
    
    // 固定只显示4首诗
    const count = 4;
    
    // 重置状态
    this.gridManager.reset();
    this.pathManager.reset();
    this.poemManager.reset();
    
    // 随机选择诗句
    this.poemManager.getRandomPoems(count);
    
    // 重新计算网格大小
    this.gridManager.calculateGridSize(this.poemManager.poems);
    
    // 初始化网格数据
    if (!this.gridManager.initGridData(this.poemManager.poems)) {
      console.error('网格初始化失败，重试');
      this.initDebugLevel();
    }
    
    console.log('调试模式初始化完成，isGameOver:', this.scoreManager.isGameOver);
  }

  initLevel() {
    console.log(`开始初始化第 ${this.level} 关`);
    
    // 每关显示的诗句数量
    const poemsPerLevel = {
      1: 4,
      2: 5,
      3: 6,
      4: 7,
      5: 8
    };

    // 获取当前关卡应显示的诗句数量
    const count = poemsPerLevel[this.level] || 4;
    
    // 完全重置所有状态
    this.grid = null;  // 先设为null以确保完全清除
    this.currentPath = [];
    this.completedPoems = [];
    this.currentLevelScore = 0;
    this.poems = [];  // 清空当前诗句
    this.poemPlacements = new Map();  // 确保清除旧的位置记录
    
    // 重置颜色映射
    this.completedPoemColors = new Map();
    
    // 随机选择诗句
    let availablePoems = this.allPoems.filter(poem => !this.usedPoemIds.has(poem.id));
    if (availablePoems.length < count) {
      this.usedPoemIds.clear();
      availablePoems = [...this.allPoems];
    }
    
    const shuffled = [...availablePoems].sort(() => Math.random() - 0.5);
    this.poems = shuffled.slice(0, count);
    
    // 记录使用的诗句
    this.poems.forEach(poem => this.usedPoemIds.add(poem.id));

    // 重新计算网格大小
    this.calculateGridSize();
    
    // 初始化网格数据
    this.grid = new Array(this.rows * this.cols).fill(' ');
    
    // 确保在初始化网格数据前更新 GameGlobal.grid
    if (GameGlobal.grid) {
      GameGlobal.grid.rows = this.rows;
      GameGlobal.grid.cols = this.cols;
    }
    
    // 初始化网格数据
    const success = this.initGridData();
    
    if (success) {
      // 确保 GameGlobal.grid 和 this.grid 同步
      if (GameGlobal.grid) {
        GameGlobal.grid.data = [...this.grid];  // 创建一个副本
        GameGlobal.grid.initGrid();
      }
      this.printGrid('关卡初始化完成后的网格');
    } else {
      console.error('网格初始化失败，重试');
      this.initLevel();  // 重试初始化
    }
  }

  isPartOfCompletedPoem(cell, poemId) {
    const poem = this.poemManager.poems.find(p => p.id === poemId);
    if (!poem) return false;

    const chars = poem.content.split('').filter(char => !/[，。、？！；：]/.test(char));
    const poemKey = chars.join('');
    const positions = this.pathManager.poemPlacements.get(poemKey);

    return positions && positions.some(pos => 
      pos.row === cell.row && 
      pos.col === cell.col
    );
  }
} 