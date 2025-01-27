import Pool from './base/pool';

let instance;

/**
 * 全局数据总线
 * 
 * 功能说明：
 * 1. 管理游戏全局状态
 * 2. 存储：
 *    - 诗句数据
 *    - 格子状态
 *    - 当前选择路径
 *    - 已完成诗句
 * 3. 使用单例模式确保全局唯一
 */
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

    this.initPoems(); // 初始化诗句数据
  }

  initPoems() {
    // 扩展诗句数据库
    this.poems = [
      {
        id: 1,
        content: '床前明月光，疑是地上霜',
        author: '李白',
        title: '静夜思'
      },
      {
        id: 2,
        content: '举头望明月，低头思故乡',
        author: '李白',
        title: '静夜思'
      },
      {
        id: 3,
        content: '千山鸟飞绝，万径人踪灭',
        author: '柳宗元',
        title: '江雪'
      },
      {
        id: 4,
        content: '孤舟蓑笠翁，独钓寒江雪',
        author: '柳宗元',
        title: '江雪'
      }
    ];

    // 初始化格子数据
    this.initGridData();
  }

  initGridData() {
    // 将诗句打散成单字，并过滤掉标点符号
    const poems = this.poems.map(poem => ({
      ...poem,
      chars: poem.content.split('').filter(char => !/[，。、？！；：]/.test(char))
    }));

    // 初始化空网格
    this.grid = new Array(6 * 5).fill(null);
    
    // 为每首诗找到合适的位置
    poems.forEach(poem => {
      let maxAttempts = 100; // 添加最大尝试次数限制
      let placed = false;
      
      while (!placed && maxAttempts > 0) {
        maxAttempts--;
        // 随机选择起始位置
        const startRow = Math.floor(Math.random() * 6);
        const startCol = Math.floor(Math.random() * 5);
        
        if (this.canPlacePoem(poem.chars, startRow, startCol)) {
          this.placePoem(poem.chars, startRow, startCol);
          placed = true;
        }
      }

      // 如果超过最大尝试次数仍未放置成功，使用简单的线性放置
      if (!placed) {
        this.placeLinear(poem.chars);
      }
    });

    // 填充剩余空格
    for (let i = 0; i < this.grid.length; i++) {
      if (this.grid[i] === null) {
        const additionalChars = '天地人山水风云雨日月星';
        this.grid[i] = additionalChars[Math.floor(Math.random() * additionalChars.length)];
      }
    }
  }

  // 添加线性放置方法作为后备方案
  placeLinear(chars) {
    // 找到第一个空位
    let startIndex = this.grid.findIndex(cell => cell === null);
    if (startIndex === -1) return false;

    // 计算起始位置的行列
    const startRow = Math.floor(startIndex / 5);
    const startCol = startIndex % 5;

    // 确保有足够的空间放置整个诗句
    if (startCol + chars.length <= 5) {
      // 水平放置
      chars.forEach((char, i) => {
        this.grid[startIndex + i] = char;
      });
    } else {
      // 垂直放置
      chars.forEach((char, i) => {
        if (startRow + i < 6) {
          this.grid[startIndex + (i * 5)] = char;
        }
      });
    }
    return true;
  }

  canPlacePoem(chars, startRow, startCol) {
    if (this.grid[startRow * 5 + startCol] !== null) {
      return false;
    }

    // 检查是否有足够的相邻空格
    let availableSpots = this.getAvailableAdjacent(startRow, startCol, []);
    return availableSpots.length >= chars.length - 1;
  }

  getAvailableAdjacent(row, col, usedPositions) {
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    const available = [];

    directions.forEach(([dRow, dCol]) => {
      const newRow = row + dRow;
      const newCol = col + dCol;
      
      if (newRow >= 0 && newRow < 6 && 
          newCol >= 0 && newCol < 5 && 
          this.grid[newRow * 5 + newCol] === null &&
          !usedPositions.some(([r, c]) => r === newRow && c === newCol)) {
        available.push([newRow, newCol]);
      }
    });

    return available;
  }

  placePoem(chars, startRow, startCol) {
    let currentRow = startRow;
    let currentCol = startCol;
    let usedPositions = [[startRow, startCol]];
    
    this.grid[startRow * 5 + startCol] = chars[0];

    for (let i = 1; i < chars.length; i++) {
      const available = this.getAvailableAdjacent(currentRow, currentCol, usedPositions);
      if (available.length === 0) break;

      const [nextRow, nextCol] = available[Math.floor(Math.random() * available.length)];
      this.grid[nextRow * 5 + nextCol] = chars[i];
      usedPositions.push([nextRow, nextCol]);
      currentRow = nextRow;
      currentCol = nextCol;
    }
  }

  // 检查是否完成所有诗句
  checkGameComplete() {
    if (this.completedPoems.length === this.poems.length) {
      this.gameOver();
    }
  }

  // 添加当前选择的格子到路径
  addToPath(cell) {
    this.currentPath.push(cell);
  }

  // 清空当前选择路径
  clearPath() {
    this.currentPath = [];
  }

  // 检查当前路径是否匹配某个诗句
  checkPathMatch() {
    const content = this.currentPath
      .map(cell => cell.text)
      .join('');

    const matchedPoem = this.poems.find(poem => 
      !this.completedPoems.includes(poem.id) && 
      poem.content === content
    );

    if (matchedPoem) {
      this.completedPoems.push(matchedPoem.id);
      this.score += 100;
      this.checkGameComplete();
      return true;
    }
    return false;
  }

  gameOver() {
    this.isGameOver = true;
  }
}
