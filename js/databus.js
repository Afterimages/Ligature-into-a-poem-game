let instance;

export default class DataBus {
  constructor() {
    if (instance) return instance;
    instance = this;

    this.reset();
  }

  reset() {
    this.poems = []; // 所有诗句数据
    this.grid = []; // 格子矩阵
    this.currentPath = []; // 当前选择路径
    this.completedPoems = []; // 已完成的诗句
    this.score = 0; // 当前分数
    this.isGameOver = false;
    this.cols = 6; // 列数
    this.rows = 6; // 行数

    this.initPoems(); // 初始化诗句数据
  }

  initPoems() {
    this.poems = [
      {
        id: 1,
        title: '静夜思',
        author: '李白',
        content: '床前明月光，疑是地上霜。'
      }
      // 可以添加更多诗句
    ];

    this.initGridData();
  }

  initGridData() {
    // 初始化空网格
    this.grid = new Array(this.rows * this.cols).fill(null);
    
    // 处理每首诗
    this.poems.forEach(poem => {
      // 去除标点，分割成字符数组
      const chars = poem.content.split('').filter(char => !/[，。、？！；：]/.test(char));
      
      // 尝试放置整首诗
      let placed = false;
      let attempts = 0;
      const maxAttempts = 100;

      while (!placed && attempts < maxAttempts) {
        attempts++;
        const startRow = Math.floor(Math.random() * (this.rows - 2));
        const startCol = Math.floor(Math.random() * (this.cols - 2));

        if (this.canPlaceFullPoem(chars, startRow, startCol)) {
          this.placeFullPoem(chars, startRow, startCol);
          placed = true;
        }
      }
    });

    // 使用更智能的方式填充剩余空格
    this.fillRemainingSpaces();
  }

  fillRemainingSpaces() {
    // 定义可用的填充字符
    const additionalChars = [
      '山', '水', '风', '云', '雨', '日', '月', '星',
      '天', '地', '春', '夏', '秋', '冬', '花', '草',
      '木', '竹', '松', '梅', '兰', '菊', '雪', '霜'
    ];

    // 统计已使用的字符
    const charCount = new Map();
    for (let i = 0; i < this.grid.length; i++) {
      const char = this.grid[i];
      if (char) {
        charCount.set(char, (charCount.get(char) || 0) + 1);
      }
    }

    // 填充剩余空格
    for (let i = 0; i < this.grid.length; i++) {
      if (this.grid[i] === null) {
        // 过滤掉使用次数过多的字符
        const availableChars = additionalChars.filter(char => 
          !charCount.has(char) || charCount.get(char) < 2
        );

        // 如果没有可用字符，使用完整列表
        const charPool = availableChars.length > 0 ? availableChars : additionalChars;
        
        // 随机选择一个字符
        const char = charPool[Math.floor(Math.random() * charPool.length)];
        this.grid[i] = char;
        
        // 更新计数
        charCount.set(char, (charCount.get(char) || 0) + 1);
      }
    }
  }

  canPlaceFullPoem(chars, startRow, startCol) {
    // 将诗句分为上下句
    const halfLength = Math.floor(chars.length / 2);
    const firstHalf = chars.slice(0, halfLength);
    const secondHalf = chars.slice(halfLength);

    let currentRow = startRow;
    let currentCol = startCol;
    const positions = [];

    // 先检查第一句
    for (let i = 0; i < firstHalf.length; i++) {
      if (this.grid[currentRow * this.cols + currentCol] !== null) {
        return false;
      }
      positions.push({ row: currentRow, col: currentCol });

      if (i < firstHalf.length - 1) {
        // 获取可用的方向
        const directions = this.getValidDirections(currentRow, currentCol, positions);
        if (directions.length === 0) {
          return false;
        }
        // 选择一个随机方向
        const [dRow, dCol] = directions[Math.floor(Math.random() * directions.length)];
        currentRow += dRow;
        currentCol += dCol;
      }
    }

    // 记住第一句最后一个字的位置
    const lastPosFirstHalf = { row: currentRow, col: currentCol };

    // 为第二句找一个相邻的起始位置
    const startSecondHalf = this.getValidDirections(lastPosFirstHalf.row, lastPosFirstHalf.col, positions);
    if (startSecondHalf.length === 0) {
      return false;
    }

    // 选择第二句的起始位置
    const [startDRow, startDCol] = startSecondHalf[Math.floor(Math.random() * startSecondHalf.length)];
    currentRow = lastPosFirstHalf.row + startDRow;
    currentCol = lastPosFirstHalf.col + startDCol;

    // 检查第二句
    for (let i = 0; i < secondHalf.length; i++) {
      if (this.grid[currentRow * this.cols + currentCol] !== null) {
        return false;
      }
      positions.push({ row: currentRow, col: currentCol });

      if (i < secondHalf.length - 1) {
        const directions = this.getValidDirections(currentRow, currentCol, positions);
        if (directions.length === 0) {
          return false;
        }
        const [dRow, dCol] = directions[Math.floor(Math.random() * directions.length)];
        currentRow += dRow;
        currentCol += dCol;
      }
    }

    return true;
  }

  placeFullPoem(chars, startRow, startCol) {
    // 将诗句分为上下句
    const halfLength = Math.floor(chars.length / 2);
    const firstHalf = chars.slice(0, halfLength);
    const secondHalf = chars.slice(halfLength);

    let currentRow = startRow;
    let currentCol = startCol;
    const positions = [];

    // 放置第一句
    for (let i = 0; i < firstHalf.length; i++) {
      this.grid[currentRow * this.cols + currentCol] = firstHalf[i];
      positions.push({ row: currentRow, col: currentCol });

      if (i < firstHalf.length - 1) {
        const directions = this.getValidDirections(currentRow, currentCol, positions);
        const [dRow, dCol] = directions[Math.floor(Math.random() * directions.length)];
        currentRow += dRow;
        currentCol += dCol;
      }
    }

    // 为第二句找相邻位置
    const startSecondHalf = this.getValidDirections(currentRow, currentCol, positions);
    const [startDRow, startDCol] = startSecondHalf[Math.floor(Math.random() * startSecondHalf.length)];
    currentRow += startDRow;
    currentCol += startDCol;

    // 放置第二句
    for (let i = 0; i < secondHalf.length; i++) {
      this.grid[currentRow * this.cols + currentCol] = secondHalf[i];
      positions.push({ row: currentRow, col: currentCol });

      if (i < secondHalf.length - 1) {
        const directions = this.getValidDirections(currentRow, currentCol, positions);
        const [dRow, dCol] = directions[Math.floor(Math.random() * directions.length)];
        currentRow += dRow;
        currentCol += dCol;
      }
    }

    return positions;
  }

  getValidDirections(row, col, usedPositions) {
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]; // 上下左右
    return directions.filter(([dRow, dCol]) => {
      const newRow = row + dRow;
      const newCol = col + dCol;
      return (
        newRow >= 0 && newRow < this.rows &&
        newCol >= 0 && newCol < this.cols &&
        this.grid[newRow * this.cols + newCol] === null &&
        !usedPositions.some(pos => pos.row === newRow && pos.col === newCol)
      );
    });
  }

  addToPath(cell) {
    if (!this.currentPath.includes(cell)) {
      this.currentPath.push(cell);
    }
  }

  clearPath() {
    this.currentPath = [];
  }

  checkPathMatch() {
    const selectedContent = this.currentPath
      .map(cell => cell.text)
      .join('');

    // 遍历所有未完成的诗句
    for (const poem of this.poems) {
      if (this.completedPoems.includes(poem.id)) {
        continue;
      }

      // 过滤掉标点符号后的诗句内容
      const poemContent = poem.content
        .split('')
        .filter(char => !/[，。、？！；：]/.test(char))
        .join('');

      // 检查是否完全匹配
      if (selectedContent === poemContent) {
        this.completedPoems.push(poem.id);
        this.score += 1;
        return true;
      }
    }
    return false;
  }
} 