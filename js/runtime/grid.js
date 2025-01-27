/**
 * 格子矩阵类
 * 
 * 功能说明：
 * 1. 管理格子矩阵的显示和状态
 * 2. 处理：
 *    - 格子的创建和布局
 *    - 格子的选中状态
 *    - 格子的渲染
 */

import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../render';

export default class Grid {
  constructor() {
    this.rows = 6;
    this.cols = 5;
    this.cells = [];
    this.cellSize = Math.min(
      (SCREEN_WIDTH / this.cols),
      ((SCREEN_HEIGHT - 150) / this.rows) // 减去150像素留给顶部和底部的空间
    );
    this.initGrid();
  }

  initGrid() {
    const characters = GameGlobal.databus.grid;
    this.cells = [];

    // 计算起始位置，使格子矩阵垂直居中
    const startY = 80; // 顶部留出80像素的空间

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const index = row * this.cols + col;
        this.cells.push({
          row,
          col,
          x: col * this.cellSize + (SCREEN_WIDTH - this.cols * this.cellSize) / 2,
          y: row * this.cellSize + startY,
          text: characters[index],
          selected: false,
          matched: false
        });
      }
    }
  }

  getCellByTouch(touch) {
    const { clientX: x, clientY: y } = touch;
    return this.cells.find(cell => 
      x >= cell.x && 
      x < cell.x + this.cellSize &&
      y >= cell.y && 
      y < cell.y + this.cellSize
    );
  }

  updateSelection(selectedCells) {
    this.cells.forEach(cell => {
      cell.selected = selectedCells.includes(cell);
    });
  }

  markMatched(matchedCells) {
    matchedCells.forEach(cell => {
      const gridCell = this.cells.find(c => 
        c.row === cell.row && c.col === cell.col
      );
      if (gridCell) {
        gridCell.matched = true;
      }
    });
  }

  isAdjacent(cell1, cell2) {
    if (!cell1 || !cell2) return false;
    const rowDiff = Math.abs(cell1.row - cell2.row);
    const colDiff = Math.abs(cell1.col - cell2.col);
    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
  }

  render(ctx) {
    // 确保canvas上下文存在
    if (!ctx) return;

    // 清除画布
    ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    
    // 绘制背景
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    // 绘制每个格子
    this.cells.forEach(cell => {
      // 设置格子背景色
      if (cell.matched) {
        ctx.fillStyle = '#90EE90';
      } else if (cell.selected) {
        ctx.fillStyle = '#e6ccff';
      } else {
        ctx.fillStyle = '#ffffff';
      }
      
      // 绘制格子背景
      ctx.fillRect(cell.x, cell.y, this.cellSize, this.cellSize);
      
      // 绘制格子边框
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
      ctx.strokeRect(cell.x, cell.y, this.cellSize, this.cellSize);
      
      // 绘制文字
      if (cell.text) {
        ctx.fillStyle = cell.matched ? '#006400' : '#000000';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
          cell.text,
          cell.x + this.cellSize / 2,
          cell.y + this.cellSize / 2
        );
      }
    });

    // 绘制选择路径
    const currentPath = GameGlobal.databus.currentPath;
    if (currentPath && currentPath.length > 1) {
      ctx.beginPath();
      ctx.moveTo(
        currentPath[0].x + this.cellSize / 2,
        currentPath[0].y + this.cellSize / 2
      );
      
      for (let i = 1; i < currentPath.length; i++) {
        ctx.lineTo(
          currentPath[i].x + this.cellSize / 2,
          currentPath[i].y + this.cellSize / 2
        );
      }
      
      ctx.strokeStyle = '#4169E1';
      ctx.lineWidth = 3;
      ctx.stroke();
    }
  }
} 