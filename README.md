2025/1/28 设计：增加关卡 累积积分

2025/1/28 设计：排列模式
过程：
1）实现了四种不同的汉字排列方式，每种方式的逻辑：
square: 尝试形成方形或长方形图案
cross: 形成十字形图案
zigzag: 增强的之字形，更有规律的转折
random: 随机但紧凑的排列

1. `square`（方形排列）：
```javascript
// 计算大致的边长，比如10个字，边长就是 Math.ceil(√10) = 4
const sideLength = Math.ceil(Math.sqrt(totalLength));
// 根据当前字的索引确定在哪一条边
const currentSide = Math.floor(index / (sideLength - 1));

// 按照右→下→左→上的顺序排列
if (currentSide === 0) {      // 第一条边：向右
  candidates = [{row: lastPos.row, col: lastPos.col + 1}];
} else if (currentSide === 1) // 第二条边：向下
  candidates = [{row: lastPos.row + 1, col: lastPos.col}];
} else if (currentSide === 2) // 第三条边：向左
  candidates = [{row: lastPos.row, col: lastPos.col - 1}];
} else {                      // 第四条边：向上
  candidates = [{row: lastPos.row - 1, col: lastPos.col}];
}
```

2. `cross`（十字形排列）：
```javascript
// 以诗句长度的一半为分界点
const center = Math.floor(totalLength / 2);

if (index <= center) {
  // 前半部分优先尝试垂直方向（上下）
  directions = [上, 下, 左, 右];
} else {
  // 后半部分优先尝试水平方向（左右）
  directions = [左, 右, 上, 下];
}
```

3. `zigzag`（之字形排列）：
```javascript
// 每3个字为一组
const segment = Math.floor(index / 3);
const posInSegment = index % 3;

if (segment % 2 === 0) {
  // 偶数组：向右2步，向下1步
  candidates = posInSegment === 2 ? 
    [向下] : [向右];
} else {
  // 奇数组：向左2步，向下1步
  candidates = posInSegment === 2 ? 
    [向下] : [向左];
}
```

4. `random`（随机排列）：
```javascript
// 定义四个方向的候选位置
const directions = [右, 下, 左, 上];
// 随机打乱方向顺序
return directions.sort(() => Math.random() - 0.5);
```

共同特点：
1. 所有排列方式都只允许上下左右四个方向移动
2. 每种方式都有主选方向和备选方向
3. 当主选方向不可用时（如已被占用或超出边界），会尝试其他方向
4. 通过`findValidPosition`函数确保选择的位置合法：
   - 在网格范围内
   - 位置为空
   - 未被使用过

2） 修改为3种模式：
提供三种有趣的排列模式：
snake: 蛇形排列，类似"回"字形
spiral: 螺旋形排列，向内旋转
zigzag: Z字形排列，之字形

每种模式都有其特定的规律：
蛇形：每3个字符转向一次
螺旋：每2个字符转向一次
Z字形：每2个字符转向一次

严格保证只使用上下左右四个方向，不会出现斜向连接
当预期位置不可用时，会智能选择替代方向，保持排列的连续性



2025/1/19 修改bug:第三关开始排列顺序放飞自我</br>
过程：</br>
1）打印验证过程，验证全部通过，怀疑同步问题。
2）打印用于验证的网格，与实际网格对比，确实不一致，确诊同步问题。
3）GameGlobal.grid.initGrid() 和 this.grid 可能不同步，initLevel() 中添加同步代码。
```javascript
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
```
checkPathMatch() 添加同步
```javascript
            if (GameGlobal.grid) {
              GameGlobal.grid.data = [...this.grid];
              GameGlobal.grid.initGrid();
            }
            
            this.printGrid('清空后的网格状态');

```

2025/1/29 修复bug：网格右边跃出屏幕</br>
过程：</br>
1）使用 wx.getSystemInfoSync() 获取屏幕信息，根据每个格子的实际大小（包括间距）计算屏幕能容纳的最大列数，限制最大列数为10，确保不会超出屏幕。根据总字数和列数计算所需的最小行数，保持最小行数为12。
```javascript
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

```


2025/1/29 设计：每句诗词连接显示不同颜色
过程：
1）添加一个颜色数组，包含多个不同的颜色。为每个完成的诗句分配一个唯一的颜色。在诗句匹配成功时，将路径上的所有字符设置为对应的颜色，在切换关卡时重置颜色映射。
2）在grid.js中添加渲染：修改 drawCell 方法，添加 color 参数来支持不同颜色的文字。在 render 方法中，为每个格子检查是否属于已完成的诗句，如果是则使用对应的颜色。使用 GameGlobal.databus.completedPoemColors 和 poemPlacements 来确定每个格子应该使用的颜色
3）方案没有显示效果，添加日志追踪颜色设置和使用过程
4）日志中颜色进行了分配，但实际屏幕上没有分配效果。怀疑颜色被覆盖，修改颜色优先级：选中状态 > 完成诗句颜色 > 默认颜色。但无效。
5）怀疑有其他文件设置了颜色，全局搜索#字符，发现runtime目录下还有一个grid文件，确认绿色#90ee90在这里被设置。
