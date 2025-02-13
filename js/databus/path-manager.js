// 路径生成和验证相关方法
export default class PathManager {
  constructor() {
    this.currentPath = [];
    this.poemPlacements = new Map();
  }

  getNextPosition(lastPos, pattern, direction, segmentLength) {
    switch (pattern) {
      case 'snake': return this.getSnakeNextPosition(lastPos, segmentLength, direction);
      case 'spiral': return this.getSpiralNextPosition(lastPos, segmentLength, direction);
      case 'zigzag': return this.getZigzagNextPosition(lastPos, segmentLength, direction);
      default: return null;
    }
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

  isPartOfCompletedPoem(cell, poemId) {
    const poem = this.poems.find(p => p.id === poemId);
    if (!poem) return false;

    const chars = poem.content.split('').filter(char => !/[，。、？！；：]/.test(char));
    const poemKey = chars.join('');
    const positions = this.poemPlacements.get(poemKey);

    return positions && positions.some(pos => 
      pos.row === cell.row && 
      pos.col === cell.col
    );
  }

  // ... 其他路径相关方法
  
  reset() {
    this.currentPath = [];
    this.poemPlacements = new Map();
  }
  

  addToPath(cell) {
    if (!this.currentPath.includes(cell)) {
      this.currentPath.push(cell);
    }
  }

  clearPath() {
    this.currentPath = [];
  }
} 