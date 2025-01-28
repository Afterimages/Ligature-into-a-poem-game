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
      },
      {
        id: 3,
        title: '春晓',
        author: '孟浩然',
        content: '春眠不觉晓，处处闻啼鸟。'
      },
      {
        id: 4,
        title: '咏柳',
        author: '贺知章',
        content: '碧玉妆成一树高，万条垂下绿丝绦。'
      },
      {
        id: 5,
        title: '悯农',
        author: '李绅',
        content: '锄禾日当午，汗滴禾下土。'
      },
      {
        id: 6,
        title: '江雪',
        author: '柳宗元',
        content: '千山鸟飞绝，万径人踪灭。'
      },
      {
        id: 7,
        title: '望庐山瀑布',
        author: '李白',
        content: '日照香炉生紫烟，遥看瀑布挂前川。'
      },
      {
        id: 8,
        title: '鹿柴',
        author: '王维',
        content: '空山不见人，但闻人语响。'
      }
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

    // 根据字数动态计算网格大小
    const minSize = Math.ceil(Math.sqrt(totalChars * 1.5)); // 增加50%的空间
    this.cols = Math.max(10, minSize);  // 最小10列
    this.rows = Math.max(12, minSize + 2);  // 最小12行，比列数多2行
  }

  initGridData() {
    try {
      // 初始化空网格，全部填充空格
      this.grid = new Array(this.rows * this.cols).fill(' ');
      
      // 记录所有已放置的位置
      const usedPositions = new Set();
      let retryCount = 0;
      const maxRetries = 50;

      while (retryCount < maxRetries) {
        // 清空网格重新开始
        this.grid = new Array(this.rows * this.cols).fill(' ');
        usedPositions.clear();
        let allPoemsPlaced = true;

        // 尝试放置所有诗句
        for (const poem of this.poems) {
          const chars = poem.content.split('').filter(char => !/[，。、？！；：]/.test(char));
          const halfLength = Math.floor(chars.length / 2);
          const firstHalf = chars.slice(0, halfLength);
          const secondHalf = chars.slice(halfLength);

          let placed = false;
          let attempts = 0;
          const maxAttempts = 100;

          while (!placed && attempts < maxAttempts) {
            attempts++;
            const startRow = Math.floor(Math.random() * (this.rows - 3));
            const startCol = Math.floor(Math.random() * (this.cols - 3));

            if (this.canPlaceHalf(firstHalf, startRow, startCol)) {
              const firstHalfPositions = this.placeHalf(firstHalf, startRow, startCol);
              const lastPos = firstHalfPositions[firstHalfPositions.length - 1];
              
              const secondStartPositions = this.getAdjacentPositions(lastPos.row, lastPos.col);
              
              for (const pos of secondStartPositions) {
                if (this.canPlaceHalf(secondHalf, pos.row, pos.col)) {
                  this.placeHalf(secondHalf, pos.row, pos.col);
                  placed = true;
                  firstHalfPositions.forEach(pos => 
                    usedPositions.add(`${pos.row},${pos.col}`)
                  );
                  break;
                }
              }
            }
          }

          if (!placed) {
            allPoemsPlaced = false;
            break;
          }
        }

        if (allPoemsPlaced) {
          // 所有诗句都放置成功，退出循环
          break;
        }

        retryCount++;
        if (retryCount === maxRetries) {
          console.error('无法放置所有诗句，请调整网格大小或减少诗句数量');
        }
      }
    } catch (error) {
      console.error('初始化网格出错:', error);
    }
  }

  canPlaceHalf(chars, startRow, startCol) {
    let positions = [];
    let currentRow = startRow;
    let currentCol = startCol;

    // 检查第一个位置
    if (this.grid[currentRow * this.cols + currentCol] !== ' ') {
      return false;
    }
    positions.push({row: currentRow, col: currentCol});

    // 检查剩余字符
    for (let i = 1; i < chars.length; i++) {
      const adjacentPositions = this.getAdjacentPositions(currentRow, currentCol)
        .filter(pos => !positions.some(p => p.row === pos.row && p.col === pos.col));

      if (adjacentPositions.length === 0) {
        return false;
      }

      const nextPos = adjacentPositions[Math.floor(Math.random() * adjacentPositions.length)];
      currentRow = nextPos.row;
      currentCol = nextPos.col;
      positions.push({row: currentRow, col: currentCol});

      if (this.grid[currentRow * this.cols + currentCol] !== ' ') {
        return false;
      }
    }

    return true;
  }

  placeHalf(chars, startRow, startCol) {
    let positions = [];
    let currentRow = startRow;
    let currentCol = startCol;

    // 放置第一个字符
    this.grid[currentRow * this.cols + currentCol] = chars[0];
    positions.push({row: currentRow, col: currentCol});

    // 放置剩余字符
    for (let i = 1; i < chars.length; i++) {
      const adjacentPositions = this.getAdjacentPositions(currentRow, currentCol)
        .filter(pos => !positions.some(p => p.row === pos.row && p.col === pos.col));

      if (adjacentPositions.length === 0) {
        return positions; // 如果没有可用位置，返回已放置的位置
      }

      const nextPos = adjacentPositions[Math.floor(Math.random() * adjacentPositions.length)];
      currentRow = nextPos.row;
      currentCol = nextPos.col;
      
      this.grid[currentRow * this.cols + currentCol] = chars[i];
      positions.push({row: currentRow, col: currentCol});
    }

    return positions;
  }

  getAdjacentPositions(row, col) {
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]; // 上下左右
    return directions
      .map(([dRow, dCol]) => ({
        row: row + dRow,
        col: col + dCol
      }))
      .filter(pos => 
        pos.row >= 0 && pos.row < this.rows &&
        pos.col >= 0 && pos.col < this.cols &&
        this.grid[pos.row * this.cols + pos.col] === ' '
      );
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