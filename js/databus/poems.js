// 存储所有诗句数据和相关方法
export default class PoemManager {
  constructor() {
    this.allPoems = this.initAllPoems();
    this.usedPoemIds = new Set();
    this.completedPoems = [];
    this.poems = [];
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

  getRandomPoems(count) {
    let availablePoems = this.allPoems.filter(poem => !this.usedPoemIds.has(poem.id));
    if (availablePoems.length < count) {
      this.usedPoemIds.clear();
      availablePoems = [...this.allPoems];
    }
    
    const shuffled = [...availablePoems].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, count);
    selected.forEach(poem => this.usedPoemIds.add(poem.id));
    this.poems = selected;
    return selected;
  }

  isCompleted(poemId) {
    return this.completedPoems.includes(poemId);
  }

  addCompletedPoem(poemId) {
    if (!this.isCompleted(poemId)) {
      this.completedPoems.push(poemId);
    }
  }

  reset() {
    this.completedPoems = [];
    this.poems = [];
  }
} 