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
    
    // 随机选择未使用过的诗句
    let availablePoems = this.allPoems.filter(poem => !this.usedPoemIds.has(poem.id));
    if (availablePoems.length < count) {
      this.usedPoemIds.clear();
      availablePoems = [...this.allPoems];
    }
    
    // 随机选择诗句
    const shuffled = [...availablePoems].sort(() => Math.random() - 0.5);
    this.poems = shuffled.slice(0, count);
    
    // 记录使用的诗句
    this.poems.forEach(poem => this.usedPoemIds.add(poem.id));

    // 重新计算网格大小
    this.calculateGridSize();
    
    // 强制重新初始化网格数据
    this.grid = new Array(this.rows * this.cols).fill(' ');
    this.initGridData();

    // 强制重新渲染
    if (GameGlobal.grid) {
      GameGlobal.grid.initGrid();
    }
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
      
      let retryCount = 0;
      const maxRetries = 50;

      while (retryCount < maxRetries) {
        // 每次尝试都重新初始化网格和打乱诗句
        this.grid = new Array(this.rows * this.cols).fill(' ');
        const shuffledPoems = [...this.poems].sort(() => Math.random() - 0.5);
        let allPlaced = true;

        for (const poem of shuffledPoems) {
          const chars = poem.content.split('').filter(char => !/[，。、？！；：]/.test(char));
          
          // 尝试在不同位置放置诗句
          let placed = false;
          for (let row = 0; row < this.rows && !placed; row++) {
            for (let col = 0; col < this.cols && !placed; col++) {
              if (this.grid[row * this.cols + col] === ' ') {
                if (this.tryPlacePoem(chars, row, col)) {
                  placed = true;
                }
              }
            }
          }

          if (!placed) {
            allPlaced = false;
            break;
          }
        }

        if (allPlaced) {
          return;  // 所有诗句都放置成功
        }
        retryCount++;
      }

      if (retryCount === maxRetries) {
        console.error('无法放置所有诗句，重新开始');
        this.initLevel();  // 重新尝试整个关卡
      }
    } catch (error) {
      console.error('初始化网格出错:', error);
    }
  }

  tryPlacePoem(chars, startRow, startCol) {
    // 记录尝试的路径
    const path = [{row: startRow, col: startCol}];
    const usedPositions = new Set([`${startRow},${startCol}`]);
    
    // 尝试放置每个字符
    for (let i = 0; i < chars.length; i++) {
      if (i === 0) {
        this.grid[startRow * this.cols + startCol] = chars[i];
        continue;
      }

      // 获取最后一个放置位置的相邻空格
      const lastPos = path[path.length - 1];
      const neighbors = this.getValidNeighbors(lastPos.row, lastPos.col, usedPositions);
      
      if (neighbors.length === 0) {
        // 无法继续放置，恢复网格状态
        path.forEach(pos => {
          this.grid[pos.row * this.cols + pos.col] = ' ';
        });
        return false;
      }

      // 随机选择一个相邻位置
      const nextPos = neighbors[Math.floor(Math.random() * neighbors.length)];
      path.push(nextPos);
      usedPositions.add(`${nextPos.row},${nextPos.col}`);
      this.grid[nextPos.row * this.cols + nextPos.col] = chars[i];
    }

    return true;
  }

  getValidNeighbors(row, col, usedPositions) {
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];  // 上下左右
    const neighbors = [];

    for (const [dRow, dCol] of directions) {
      const newRow = row + dRow;
      const newCol = col + dCol;
      
      if (newRow >= 0 && newRow < this.rows &&
          newCol >= 0 && newCol < this.cols &&
          this.grid[newRow * this.cols + newCol] === ' ' &&
          !usedPositions.has(`${newRow},${newCol}`)) {
        neighbors.push({row: newRow, col: newCol});
      }
    }

    return neighbors;
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
            // 立即清空当前网格显示
            this.grid = new Array(this.rows * this.cols).fill(' ');
            if (GameGlobal.grid) {
              GameGlobal.grid.initGrid();
            }

            setTimeout(() => {
              this.level++;
              this.initLevel();  // 初始化新关卡
              
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