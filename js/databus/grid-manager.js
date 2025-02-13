// 网格管理相关方法
export default class GridManager {
  constructor(pathManager) {
    this.grid = [];
    this.rows = 0;
    this.cols = 0;
    this.pathManager = pathManager;  // 保存 PathManager 实例的引用
  }

  calculateGridSize(poems) {
    // 计算所有诗句的总字数
    const totalChars = poems.reduce((sum, poem) => {
        const chars = poem.content.split('').filter(char => !/[，。、？！；：]/.test(char));
        return sum + chars.length;
      }, 0);
    // 获取屏幕信息
    const systemInfo = wx.getSystemInfoSync();
    // 假设每个格子大小为32px，再加上间距4px
    const cellSize = 36;  // 32 + 4
    // 计算屏幕能容纳的最大列数（留出左右边距）
    const maxCols = Math.floor((systemInfo.windowWidth - 20) / cellSize);

    

    // 根据字数和屏幕宽度计算网格大小
    const minRows = Math.ceil(totalChars / maxCols);
    
    // 设置网格大小
    this.cols = Math.min(maxCols, 10);  // 限制最大列数为10
    this.rows = Math.max(minRows, 12);  // 最小12行，确保有足够空间
    console.log(`屏幕宽度: ${systemInfo.windowWidth}px`);
    console.log(`计算得到网格大小: ${this.rows}行 x ${this.cols}列`);
    
  }

  initGridData(poems) {
    try {
      console.log(`开始初始化网格数据`);
      // 确保完全清空网格和位置记录
      this.grid = new Array(this.rows * this.cols).fill(' ');
      this.pathManager.poemPlacements = new Map();
      
      this.printGrid('初始化时的空网格');
      
      let retryCount = 0;
      const maxRetries = 50;

      while (retryCount < maxRetries) {
        console.log(`第 ${retryCount + 1} 次尝试放置诗句`);
        // 每次尝试前都要完全重置网格
        this.grid = new Array(this.rows * this.cols).fill(' ');
        const shuffledPoems = [...poems].sort(() => Math.random() - 0.5);
        let allPlaced = true;

        // 记录每个诗句使用的模式，确保同一诗句在重试时使用相同的模式
        const poemPatterns = new Map();

        for (const poem of shuffledPoems) {
          console.log(`尝试放置诗句: ${poem.content}`);
          const chars = poem.content.split('').filter(char => !/[，。、？！；：]/.test(char));
          
          if (!poemPatterns.has(poem.id)) {
            const patterns = ['snake', 'spiral', 'zigzag'];
            const selectedPattern = patterns[Math.floor(Math.random() * patterns.length)];
            poemPatterns.set(poem.id, selectedPattern);
            console.log(`为诗句选择的排列模式: ${selectedPattern}`);
          }
          
          let placed = false;
          // 尝试在不同起始位置放置诗句
          for (let row = 0; row < this.rows && !placed; row++) {
            for (let col = 0; col < this.cols && !placed; col++) {
              if (this.grid[row * this.cols + col] === ' ') {
                if (this.tryPlacePoem(chars, row, col, poemPatterns.get(poem.id))) {
                  placed = true;
                  console.log(`成功放置诗句，起始位置: (${row}, ${col})`);
                }
              }
            }
          }

          if (!placed) {
            console.log(`无法放置诗句: ${poem.content}`);
            allPlaced = false;
            break;
          }

          if (placed) {
            this.printGrid(`放置诗句 "${poem.content}" 后`);
          }
        }

        if (allPlaced) {
          console.log('所有诗句放置完成，开始验证');
          this.printGrid('验证前的完整网格');
          // 验证所有诗句的排列是否合法
          if (this.validateGrid(poems)) {
            console.log('验证通过：所有诗句排列合法');
            this.printGrid('验证通过后的最终网格');
            return true;
          } else {
            console.log('验证失败：存在非法排列，重新尝试');
            this.printGrid('验证失败时的网格');
            allPlaced = false;
          }
        }
        retryCount++;
      }

      if (retryCount === maxRetries) {
        console.error(`第 ${this.level} 关：达到最大重试次数`);
        return false;
      }
      return true;
    } catch (error) {
      console.error('初始化网格出错:', error, error.stack);
      return false;
    }
  }

  fillRemainingSpaces() {
    // 将所有未使用的格子设置为空格
    for (let i = 0; i < this.grid.length; i++) {
      if (this.grid[i] === null) {
        this.grid[i] = ' ';
      }
    }
  }

  validateGrid(poems) {
    try {
      console.log('开始验证网格排列');
      this.printGrid('开始验证时的网格');
      
      // 重置诗句位置记录
      if (!this.pathManager.poemPlacements) {
        console.error('未找到诗句位置记录');
        return false;
      }

      // 验证每个诗句
      for (const poem of poems) {
        const chars = poem.content.split('').filter(char => !/[，。、？！；：]/.test(char));
        const poemKey = chars.join('');
        console.log(`验证诗句: ${poemKey}`);

        // 获取放置时记录的位置
        const positions = this.pathManager.poemPlacements.get(poemKey);
        if (!positions) {
          console.error(`未找到诗句 "${poemKey}" 的位置记录`);
          return false;
        }

        console.log(`诗句 "${poemKey}" 的记录位置:`, 
          positions.map(p => `(${p.row},${p.col}:${this.grid[p.row * this.cols + p.col]})`).join(' -> '));

        // 验证每个位置的字符是否正确
        for (let i = 0; i < chars.length; i++) {
          const pos = positions[i];
          const gridChar = this.grid[pos.row * this.cols + pos.col];
          
          if (gridChar !== chars[i]) {
            console.error(`位置 (${pos.row}, ${pos.col}) 的字符不匹配: 期望 "${chars[i]}", 实际 "${gridChar}"`);
            return false;
          }
        }

        // 验证相邻字符的位置是否合法
        if (!this.pathManager.validatePoemPositions(positions)) {
          console.error(`诗句 "${poemKey}" 的字符排列不合法`);
          return false;
        }
      }

      console.log('所有诗句验证通过');
      return true;
    } catch (error) {
      console.error('validateGrid 出错:', error);
      return false;
    }
  }

  // 添加一个辅助方法来打印网格
  printGrid(message = '') {
    console.log(`=== 打印网格 ${message} ===`);
    console.log(`网格大小: ${this.rows}行 x ${this.cols}列`);
    
    // 打印列号
    let colHeader = '   ';  // 为行号预留空间
    for (let col = 0; col < this.cols; col++) {
      colHeader += col.toString().padStart(2) + ' ';
    }
    console.log(colHeader);

    // 打印分隔线
    console.log('   ' + '-'.repeat(this.cols * 3));

    // 打印网格内容（带行号）
    for (let row = 0; row < this.rows; row++) {
      let rowStr = row.toString().padStart(2) + '|';  // 行号
      for (let col = 0; col < this.cols; col++) {
        const char = this.grid[row * this.cols + col];
        // 使用中文空格字符'　'来表示空格，这样更容易看出位置
        rowStr += (char === ' ' ? '　' : char) + ' ';
      }
      console.log(rowStr);
    }
    
    console.log('   ' + '-'.repeat(this.cols * 3));
    console.log('===================');
  }

  tryPlacePoem(chars, startRow, startCol, pattern) {
    const path = [{row: startRow, col: startCol}];
    const usedPositions = new Set([`${startRow},${startCol}`]);
    
    // 记录每个字符的实际放置位置
    this.pathManager.poemPlacements = this.pathManager.poemPlacements || new Map();
    const positions = [];
    
    let currentDirection = 'right';
    let segmentLength = 0;
    
    for (let i = 0; i < chars.length; i++) {
      if (i === 0) {
        if (this.grid[startRow * this.cols + startCol] !== ' ') {
          return false;
        }
        this.grid[startRow * this.cols + startCol] = chars[i];
        positions.push({row: startRow, col: startCol});
        continue;
      }

      const lastPos = path[path.length - 1];
      let nextPos = null;

      switch (pattern) {
        case 'snake':
          nextPos = this.pathManager.getSnakeNextPosition(lastPos, segmentLength, currentDirection);
          break;
        case 'spiral':
          nextPos = this.pathManager.getSpiralNextPosition(lastPos, path.length, currentDirection);
          break;
        case 'zigzag':
          nextPos = this.pathManager.getZigzagNextPosition(lastPos, segmentLength, currentDirection);
          break;
      }

      // 如果预定位置不可用，尝试其他方向
      if (!nextPos || !this.isValidPosition(nextPos, usedPositions)) {
        const alternatives = this.pathManager.getAlternativePositions(lastPos, currentDirection);
        for (const alt of alternatives) {
          if (this.isValidPosition(alt.pos, usedPositions)) {
            nextPos = alt.pos;
            currentDirection = alt.dir;
            segmentLength = 0;
            break;
          }
        }
      }

      if (!nextPos || !this.isValidPosition(nextPos, usedPositions)) {
        path.forEach(pos => {
          this.grid[pos.row * this.cols + pos.col] = ' ';
        });
        return false;
      }

      path.push(nextPos);
      positions.push(nextPos); // 记录每个字符的位置
      usedPositions.add(`${nextPos.row},${nextPos.col}`);
      this.grid[nextPos.row * this.cols + nextPos.col] = chars[i];
      segmentLength++;

      // 根据模式更新方向
      if (pattern === 'snake' && segmentLength >= 3) {
        currentDirection = this.pathManager.getNextSnakeDirection(currentDirection);
        segmentLength = 0;
      } else if (pattern === 'spiral' && segmentLength >= 2) {
        currentDirection = this.pathManager.getNextSpiralDirection(currentDirection);
        segmentLength = 0;
      } else if (pattern === 'zigzag' && segmentLength >= 2) {
        currentDirection = this.pathManager.getNextZigzagDirection(currentDirection);
        segmentLength = 0;
      }
    }

    // 保存这个诗句的字符位置信息
    const poemKey = chars.join('');
    this.pathManager.poemPlacements.set(poemKey, positions);
    return true;
  }

  isValidPosition(pos, usedPositions) {
    return pos.row >= 0 && 
           pos.row < this.rows && 
           pos.col >= 0 && 
           pos.col < this.cols && 
           this.grid[pos.row * this.cols + pos.col] === ' ' && 
           !usedPositions.has(`${pos.row},${pos.col}`);
  }

  reset() {
    // 重置网格相关的状态
    this.grid = [];
    this.rows = 0;
    this.cols = 0;
  }
} 