let instance;

export default class DataBus {
  constructor() {
    if (instance) return instance;
    instance = this;
    this.reset();
  }

  reset() {
    this.allPoems = this.initAllPoems();  // 存储所有诗句
    this.level = 1;  // 当前关卡
    this.poems = [];  // 当前关卡的诗句
    this.grid = [];
    this.currentPath = [];
    this.completedPoems = [];
    this.score = 0;  // 总分
    this.currentLevelScore = 0;  // 当前关卡得分
    this.isGameOver = false;
    this.usedPoemIds = new Set();  // 记录已使用过的诗句ID
    this.initLevel();  // 初始化当前关卡
  }

  initAllPoems() {
    return [
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

  calculateGridSize() {
    // 计算所有诗句的总字数
    const totalChars = this.poems.reduce((sum, poem) => {
      const chars = poem.content.split('').filter(char => !/[，。、？！；：]/.test(char));
      return sum + chars.length;
    }, 0);

    // 获取屏幕信息
    const systemInfo = wx.getSystemInfoSync();
    // 假设每个格子大小为32px，再加上间距4px
    const cellSize = 36;  // 32 + 4
    // 计算屏幕能容纳的最大列数（留出左右边距）
    const maxCols = Math.floor((systemInfo.windowWidth - 20) / cellSize);  // 20是左右各10px的边距

    // 根据字数和屏幕宽度计算网格大小
    const minRows = Math.ceil(totalChars / maxCols);  // 最少需要的行数
    
    // 设置网格大小
    this.cols = Math.min(maxCols, 10);  // 限制最大列数为10
    this.rows = Math.max(minRows, 12);  // 最小12行，确保有足够空间
    
    console.log(`屏幕宽度: ${systemInfo.windowWidth}px`);
    console.log(`计算得到网格大小: ${this.rows}行 x ${this.cols}列`);
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

  initGridData() {
    try {
      console.log(`开始初始化第 ${this.level} 关的网格数据`);
      // 确保完全清空网格和位置记录
      this.grid = new Array(this.rows * this.cols).fill(' ');
      this.poemPlacements = new Map();
      
      this.printGrid('初始化时的空网格');
      
      let retryCount = 0;
      const maxRetries = 50;

      while (retryCount < maxRetries) {
        console.log(`第 ${retryCount + 1} 次尝试放置诗句`);
        // 每次尝试前都要完全重置网格
        this.grid = new Array(this.rows * this.cols).fill(' ');
        const shuffledPoems = [...this.poems].sort(() => Math.random() - 0.5);
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
          if (this.validateGrid()) {
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

  validateGrid() {
    try {
      console.log('开始验证网格排列');
      this.printGrid('开始验证时的网格');
      
      // 重置诗句位置记录
      if (!this.poemPlacements) {
        console.error('未找到诗句位置记录');
        return false;
      }

      // 验证每个诗句
      for (const poem of this.poems) {
        const chars = poem.content.split('').filter(char => !/[，。、？！；：]/.test(char));
        const poemKey = chars.join('');
        console.log(`验证诗句: ${poemKey}`);

        // 获取放置时记录的位置
        const positions = this.poemPlacements.get(poemKey);
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
        if (!this.validatePoemPositions(positions)) {
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

  findPoemPositions(chars, startRow, startCol) {
    try {
      console.log(`开始查找诗句位置: ${chars.join('')}, 起始位置: (${startRow}, ${startCol})`);
      
      const positions = [{row: startRow, col: startCol}];
      const used = new Set([`${startRow},${startCol}`]);
      
      for (let i = 1; i < chars.length; i++) {
        const lastPos = positions[positions.length - 1];
        let found = false;
        
        // 检查四个方向
        const directions = [
          {row: -1, col: 0},  // 上
          {row: 1, col: 0},   // 下
          {row: 0, col: -1},  // 左
          {row: 0, col: 1}    // 右
        ];
        
        console.log(`查找字符 ${chars[i]} 的位置`);
        
        for (const dir of directions) {
          const newRow = lastPos.row + dir.row;
          const newCol = lastPos.col + dir.col;
          
          if (newRow >= 0 && newRow < this.rows &&
              newCol >= 0 && newCol < this.cols) {
            const nextChar = this.grid[newRow * this.cols + newCol];
            console.log(`检查位置 (${newRow}, ${newCol}): ${nextChar}`);
            
            if (nextChar === chars[i] && !used.has(`${newRow},${newCol}`)) {
              positions.push({row: newRow, col: newCol});
              used.add(`${newRow},${newCol}`);
              found = true;
              console.log(`找到字符 ${chars[i]} 在位置 (${newRow}, ${newCol})`);
              break;
            }
          }
        }
        
        if (!found) {
          console.log(`未找到字符 ${chars[i]} 的有效位置`);
          return [];
        }
      }
      
      console.log(`成功找到完整路径: ${positions.map(p => `(${p.row},${p.col})`).join(' -> ')}`);
      return positions;
      
    } catch (error) {
      console.error('findPoemPositions 出错:', error);
      return [];
    }
  }

  validatePoemPositions(positions) {
    if (positions.length < 2) return true;
    
    // 验证每对相邻位置是否只相差一步（上下左右）
    for (let i = 1; i < positions.length; i++) {
      const prev = positions[i - 1];
      const curr = positions[i];
      
      const rowDiff = Math.abs(curr.row - prev.row);
      const colDiff = Math.abs(curr.col - prev.col);
      
      // 确保只有一个方向有变化，且变化量为1
      if (rowDiff + colDiff !== 1) {
        console.log(`验证失败：位置 ${i-1} 和 ${i} 之间的连接不合法`);
        return false;
      }
    }
    
    return true;
  }

  tryPlacePoem(chars, startRow, startCol, pattern) {
    const path = [{row: startRow, col: startCol}];
    const usedPositions = new Set([`${startRow},${startCol}`]);
    
    // 记录每个字符的实际放置位置
    this.poemPlacements = this.poemPlacements || new Map();
    const poemKey = chars.join('');
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
          nextPos = this.getSnakeNextPosition(lastPos, segmentLength, currentDirection);
          break;
        case 'spiral':
          nextPos = this.getSpiralNextPosition(lastPos, path.length, currentDirection);
          break;
        case 'zigzag':
          nextPos = this.getZigzagNextPosition(lastPos, segmentLength, currentDirection);
          break;
      }

      // 如果预定位置不可用，尝试其他方向
      if (!nextPos || !this.isValidPosition(nextPos, usedPositions)) {
        const alternatives = this.getAlternativePositions(lastPos, currentDirection);
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
      positions.push(nextPos);  // 记录每个字符的位置
      usedPositions.add(`${nextPos.row},${nextPos.col}`);
      this.grid[nextPos.row * this.cols + nextPos.col] = chars[i];
      segmentLength++;

      // 根据模式更新方向
      if (pattern === 'snake' && segmentLength >= 3) {
        currentDirection = this.getNextSnakeDirection(currentDirection);
        segmentLength = 0;
      } else if (pattern === 'spiral' && segmentLength >= 2) {
        currentDirection = this.getNextSpiralDirection(currentDirection);
        segmentLength = 0;
      } else if (pattern === 'zigzag' && segmentLength >= 2) {
        currentDirection = this.getNextZigzagDirection(currentDirection);
        segmentLength = 0;
      }
    }

    // 保存这个诗句的字符位置信息
    this.poemPlacements.set(poemKey, positions);
    return true;
  }

  getSnakeNextPosition(lastPos, segmentLength, direction) {
    // 蛇形：每3个字符转向，形成"回"字形
    switch (direction) {
      case 'right': return {row: lastPos.row, col: lastPos.col + 1};
      case 'down': return {row: lastPos.row + 1, col: lastPos.col};
      case 'left': return {row: lastPos.row, col: lastPos.col - 1};
      case 'up': return {row: lastPos.row - 1, col: lastPos.col};
    }
  }

  getSpiralNextPosition(lastPos, pathLength, direction) {
    // 螺旋形：顺时针旋转
    switch (direction) {
      case 'right': return {row: lastPos.row, col: lastPos.col + 1};
      case 'down': return {row: lastPos.row + 1, col: lastPos.col};
      case 'left': return {row: lastPos.row, col: lastPos.col - 1};
      case 'up': return {row: lastPos.row - 1, col: lastPos.col};
    }
  }

  getZigzagNextPosition(lastPos, segmentLength, direction) {
    // Z字形：每2个字符转向，形成之字形
    switch (direction) {
      case 'right': return {row: lastPos.row, col: lastPos.col + 1};
      case 'down': return {row: lastPos.row + 1, col: lastPos.col};
      case 'left': return {row: lastPos.row, col: lastPos.col - 1};
    }
  }

  getNextSnakeDirection(currentDirection) {
    // 蛇形方向变化：右->下->左->上
    const sequence = ['right', 'down', 'left', 'up'];
    const currentIndex = sequence.indexOf(currentDirection);
    return sequence[(currentIndex + 1) % sequence.length];
  }

  getNextSpiralDirection(currentDirection) {
    // 螺旋方向变化：右->下->左->上
    const sequence = ['right', 'down', 'left', 'up'];
    const currentIndex = sequence.indexOf(currentDirection);
    return sequence[(currentIndex + 1) % sequence.length];
  }

  getNextZigzagDirection(currentDirection) {
    // Z字形方向变化：右->下->左->下->右
    if (currentDirection === 'right') return 'down';
    if (currentDirection === 'down') return 'left';
    return 'right';
  }

  getAlternativePositions(lastPos, currentDirection) {
    // 当前方向不可用时，提供其他可能的方向
    const allDirections = [
      {dir: 'right', pos: {row: lastPos.row, col: lastPos.col + 1}},
      {dir: 'down', pos: {row: lastPos.row + 1, col: lastPos.col}},
      {dir: 'left', pos: {row: lastPos.row, col: lastPos.col - 1}},
      {dir: 'up', pos: {row: lastPos.row - 1, col: lastPos.col}}
    ];
    
    // 将当前方向排除，并根据优先级排序其他方向
    return allDirections.filter(d => d.dir !== currentDirection);
  }

  isValidPosition(pos, usedPositions) {
    return pos.row >= 0 && 
           pos.row < this.rows && 
           pos.col >= 0 && 
           pos.col < this.cols && 
           this.grid[pos.row * this.cols + pos.col] === ' ' && 
           !usedPositions.has(`${pos.row},${pos.col}`);
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
      .filter(text => text !== ' ')
      .join('');

    // 遍历所有未完成的诗句
    for (const poem of this.poems) {
      if (this.completedPoems.includes(poem.id)) {
        continue;
      }

      const poemContent = poem.content
        .split('')
        .filter(char => !/[，。、？！；：]/.test(char))
        .join('');

      if (selectedContent === poemContent) {
        // 先更新分数和完成状态
        this.completedPoems.push(poem.id);
        const levelBonus = this.level;
        const points = 2 + levelBonus;
        this.score += points;
        this.currentLevelScore += points;

        // 显示得分提示
        wx.showToast({
          title: `+${points}分`,
          icon: 'none',
          duration: 1000
        });

        // 检查是否完成所有诗句
        if (this.completedPoems.length === this.poems.length) {
          // 显示过关提示
          wx.showToast({
            title: `第${this.level}关完成！`,
            icon: 'success',
            duration: 1500
          });

          if (this.level < 5) {
            this.printGrid('过关前的最后网格状态');
            
            // 确保同步清空两个网格
            this.grid = new Array(this.rows * this.cols).fill(' ');
            if (GameGlobal.grid) {
              GameGlobal.grid.data = [...this.grid];
              GameGlobal.grid.initGrid();
            }
            
            this.printGrid('清空后的网格状态');

            setTimeout(() => {
              this.level++;
              // 确保新关卡初始化时两个网格同步
              this.initLevel();
              
              wx.showToast({
                title: `第${this.level}关开始！`,
                icon: 'success',
                duration: 1500
              });
            }, 1000);
          } else {
            this.isGameOver = true;
          }
        }
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