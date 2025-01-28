

## 排列模式
实现了四种不同的汉字排列方式，总结一下每种方式的逻辑：

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




2025/1/19 修改bug:第三关开始排列顺序放飞自我
过程：
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

