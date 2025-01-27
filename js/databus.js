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
    // 将诗句打散成单字
    const characters = this.poems.reduce((acc, poem) => {
      return acc.concat(poem.content.split(''));
    }, []);

    // 随机打乱字符顺序
    for (let i = characters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [characters[i], characters[j]] = [characters[j], characters[i]];
    }

    this.grid = characters;
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
