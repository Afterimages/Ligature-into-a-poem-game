let instance;

export default class DataBus {
  constructor() {
    if (instance) return instance;
    instance = this;
    this.reset();
  }

  reset() {
    this.poems = [];
    this.grid = [];
    this.currentPath = [];
    this.completedPoems = [];
    this.score = 0;
    this.isGameOver = false;
    this.initPoems();
  }

  initPoems() {
    this.poems = [
      {
        id: 1,
        title: '静夜思',
        author: '李白',
        content: '床前明月光，疑是地上霜。'
      },
      {
        id: 2,
        title: '登鹳雀楼',
        author: '王之涣',
        content: '白日依山尽，黄河入海流。'
      }
      // 可以根据需要添加更多诗句
    ];

    // 计算所需的网格大小
    this.calculateGridSize();
    this.initGridData();
  }

  calculateGridSize() {
    // 计算所有诗句的总字数
    const totalChars = this.poems.reduce((sum, poem) => {
      const chars = poem.content.split('').filter(char => !/[，。、？！；：]/.test(char));
      return sum + chars.length;
    }, 0);

    // 计算合适的网格大小，稍微增加一些空间
    const size = Math.ceil(Math.sqrt(totalChars * 1.5));  // 增加50%的空间
    this.rows = size;
    this.cols = size;
  }

  initGridData() {
    try {
      // 初始化空网格，使用空格填充
      this.grid = new Array(this.rows * this.cols).fill(' ');
      
      // 记录已使用的位置
      const usedPositions = new Set();
      
      // 处理每首诗
      for (const poem of this.poems) {
        const chars = poem.content.split('').filter(char => !/[，。、？！；：]/.test(char));
        let placed = false;
        let attempts = 0;
        const maxAttempts = 100;

        while (!placed && attempts < maxAttempts) {
          attempts++;
          let startRow = Math.floor(Math.random() * (this.rows - 2));
          let startCol = Math.floor(Math.random() * (this.cols - 2));

          if (this.canPlaceFullPoem(chars, startRow, startCol, usedPositions)) {
            const newPositions = this.placeFullPoem(chars, startRow, startCol);
            newPositions.forEach(pos => {
              usedPositions.add(`${pos.row},${pos.col}`);
            });
            placed = true;
          }
        }

        if (!placed) {
          console.log('增加网格大小并重试');
          this.rows += 1;
          this.cols += 1;
          return this.initGridData();
        }
      }
    } catch (error) {
      console.error('初始化网格出错:', error);
      // 设置一个基本的网格大小
      this.rows = 6;
      this.cols = 6;
      this.grid = new Array(this.rows * this.cols).fill(' ');
    }
  }

  isPositionUsed(row, col, usedPositions) {
    return usedPositions.has(`${row},${col}`);
  }

  canPlaceFullPoem(chars, startRow, startCol, usedPositions) {
    // 检查起始位置
    if (this.isPositionUsed(startRow, startCol, usedPositions)) {
      return false;
    }

    let currentRow = startRow;
    let currentCol = startCol;
    const positions = [];

    // 检查是否可以放置所有字符
    for (let i = 0; i < chars.length; i++) {
      if (this.isPositionUsed(currentRow, currentCol, usedPositions)) {
        return false;
      }
      positions.push({ row: currentRow, col: currentCol });

      if (i < chars.length - 1) {
        const directions = this.getValidDirections(currentRow, currentCol, positions);
        if (directions.length === 0) {
          return false;
        }
        const direction = directions[Math.floor(Math.random() * directions.length)];
        currentRow += direction[0];
        currentCol += direction[1];
      }
    }

    return true;
  }

  placeFullPoem(chars, startRow, startCol) {
    let currentRow = startRow;
    let currentCol = startCol;
    const positions = [];

    for (let i = 0; i < chars.length; i++) {
      this.grid[currentRow * this.cols + currentCol] = chars[i];
      positions.push({ row: currentRow, col: currentCol });

      if (i < chars.length - 1) {
        const directions = this.getValidDirections(currentRow, currentCol, positions);
        const direction = directions[Math.floor(Math.random() * directions.length)];
        currentRow += direction[0];
        currentCol += direction[1];
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
        this.grid[newRow * this.cols + newCol] === ' ' &&  // 修改这里，检查空格而不是null
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
    if (this.currentPath.length === 0) return false;

    const selectedContent = this.currentPath
      .map(cell => cell.text)
      .filter(text => text !== ' ')  // 过滤掉空格
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
} 