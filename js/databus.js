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
      },
      {
        id: 9,
        title: '山居秋暝',
        author: '王维',
        content: '空山新雨后，天气晚来秋。'
      },
      {
        id: 10,
        title: '杂诗',
        author: '王维',
        content: '君自故乡来，应知故乡事。'
      },
      {
        id: 11,
        title: '九月九日忆山东兄弟',
        author: '王维',
        content: '独在异乡为异客，每逢佳节倍思亲。'
      },
      {
        id: 12,
        title: '别董大',
        author: '高适',
        content: '莫愁前路无知己，天下谁人不识君。'
      },
      {
        id: 13,
        title: '送杜少府之任蜀州',
        author: '王勃',
        content: '海内存知己，天涯若比邻。'
      },
      {
        id: 14,
        title: '冬夜读书示子聿',
        author: '陆游',
        content: '纸上得来终觉浅，绝知此事要躬行。'
      },
      {
        id: 15,
        title: '游山西村',
        author: '陆游',
        content: '山重水复疑无路，柳暗花明又一村。'
      },
      {
        id: 16,
        title: '晓出净慈寺送林子方',
        author: '杨万里',
        content: '接天莲叶无穷碧，映日荷花别样红。'
      },
      {
        id: 17,
        title: '山行',
        author: '杜牧',
        content: '停车坐爱枫林晚，霜叶红于二月花。'
      },
      {
        id: 18,
        title: '雪梅',
        author: '卢梅坡',
        content: '梅须逊雪三分白，雪却输梅一段香。'
      },
      {
        id: 19,
        title: '题西林壁',
        author: '苏轼',
        content: '不识庐山真面目，只缘身在此山中。'
      },
      {
        id: 20,
        title: '赋得古原草送别',
        author: '白居易',
        content: '野火烧不尽，春风吹又生。'
      },
      {
        id: 21,
        title: '使至塞上',
        author: '王维',
        content: '大漠孤烟直，长河落日圆。'
      },
      {
        id: 22,
        title: '望天门山',
        author: '李白',
        content: '天门中断楚江开，碧水东流至此回。'
      },
      {
        id: 23,
        title: '大林寺桃花',
        author: '白居易',
        content: '人间四月芳菲尽，山寺桃花始盛开。'
      },
      {
        id: 24,
        title: '登高',
        author: '杜甫',
        content: '无边落木萧萧下，不尽长江滚滚来。'
      },
      {
        id: 25,
        title: '饮酒',
        author: '陶渊明',
        content: '采菊东篱下，悠然见南山。'
      },
      {
        id: 26,
        title: '春夜洛城闻笛',
        author: '李白',
        content: '此夜曲中闻折柳，何人不起故园情。'
      },
      {
        id: 27,
        title: '泊船瓜洲',
        author: '王安石',
        content: '春风又绿江南岸，明月何时照我还。'
      },
      {
        id: 28,
        title: '赠汪伦',
        author: '李白',
        content: '桃花潭水深千尺，不及汪伦送我情。'
      },
      {
        id: 29,
        title: '忆江南',
        author: '白居易',
        content: '日出江花红胜火，春来江水绿如蓝。'
      },
      {
        id: 30,
        title: '出塞',
        author: '王昌龄',
        content: '但使龙城飞将在，不教胡马度阴山。'
      },
      {
        id: 31,
        title: '江城子',
        author: '苏轼',
        content: '会挽雕弓如满月，西北望，射天狼。'
      },
      {
        id: 32,
        title: '南陵别儿童入京',
        author: '李白',
        content: '仰天大笑出门去，我辈岂是蓬蒿人。'
      },
      {
        id: 33,
        title: '水调歌头',
        author: '苏轼',
        content: '明月几时有，把酒问青天。'
      },
      {
        id: 34,
        title: '把酒问月',
        author: '李白',
        content: '今人不见古时月，今月曾经照古人。'
      },
      {
        id: 35,
        title: '将进酒',
        author: '李白',
        content: '君不见黄河之水天上来，奔流到海不复回。'
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
      // 初始化空网格
      this.grid = new Array(this.rows * this.cols).fill(' ');
      
      const usedPositions = new Set();
      let retryCount = 0;
      const maxRetries = 200;  // 增加重试次数

      while (retryCount < maxRetries) {
        this.grid = new Array(this.rows * this.cols).fill(' ');
        usedPositions.clear();
        let allPoemsPlaced = true;

        // 随机打乱诗句顺序
        const shuffledPoems = [...this.poems]
          .sort(() => Math.random() - 0.5);

        for (const poem of shuffledPoems) {
          const chars = poem.content.split('').filter(char => !/[，。、？！；：]/.test(char));
          let placed = false;

          // 随机尝试多个起始位置
          const startPositions = this.getRandomStartPositions();
          
          for (const {row, col} of startPositions) {
            if (this.tryPlacePoemInDirection(chars, row, col, [0, 1], [1, 0], usedPositions)) {
              placed = true;
              break;
            }
          }

          if (!placed) {
            allPoemsPlaced = false;
            break;
          }
        }

        if (allPoemsPlaced) break;
        retryCount++;
      }
    } catch (error) {
      console.error('初始化网格出错:', error);
    }
  }

  getRandomStartPositions() {
    const positions = [];
    for (let i = 0; i < this.rows * this.cols; i++) {
      positions.push({
        row: Math.floor(i / this.cols),
        col: i % this.cols
      });
    }
    // 随机打乱位置
    return positions.sort(() => Math.random() - 0.5);
  }

  tryPlacePoemInDirection(chars, startRow, startCol, dir1, dir2, usedPositions) {
    let positions = [];
    let currentRow = startRow;
    let currentCol = startCol;

    // 检查第一个字符位置
    if (this.isPositionUsed(currentRow, currentCol, usedPositions)) {
      return false;
    }

    positions.push({row: currentRow, col: currentCol});

    // 为每个字符选择一个随机的相邻方向
    for (let i = 1; i < chars.length; i++) {
      // 获取所有可能的方向
      const availableDirections = [
        [-1, 0],  // 上
        [1, 0],   // 下
        [0, -1],  // 左
        [0, 1]    // 右
      ].filter(([dRow, dCol]) => {
        const newRow = currentRow + dRow;
        const newCol = currentCol + dCol;
        return this.isValidPosition(newRow, newCol) && 
               !this.isPositionUsed(newRow, newCol, usedPositions) &&
               !positions.some(p => p.row === newRow && p.col === newCol);
      });

      // 如果没有可用方向，放置失败
      if (availableDirections.length === 0) {
        return false;
      }

      // 随机选择一个方向
      const [dRow, dCol] = availableDirections[
        Math.floor(Math.random() * availableDirections.length)
      ];

      currentRow += dRow;
      currentCol += dCol;
      positions.push({row: currentRow, col: currentCol});
    }

    // 检查最后一个字符是否与第一个字符相邻（如果是同一首诗的上下句）
    if (chars.length > 5) {  // 假设超过5个字的是完整诗句
      const halfLength = Math.floor(chars.length / 2);
      const firstHalfEnd = positions[halfLength - 1];
      const secondHalfStart = positions[halfLength];
      
      const isAdjacent = Math.abs(firstHalfEnd.row - secondHalfStart.row) +
                        Math.abs(firstHalfEnd.col - secondHalfStart.col) === 1;
      
      if (!isAdjacent) {
        return false;
      }
    }

    // 如果所有字符都能放置，执行实际放置
    for (let i = 0; i < chars.length; i++) {
      const pos = positions[i];
      this.grid[pos.row * this.cols + pos.col] = chars[i];
      usedPositions.add(`${pos.row},${pos.col}`);
    }

    return true;
  }

  isValidPosition(row, col) {
    return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
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