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
    this.rows = GameGlobal.databus.rows;
    this.cols = GameGlobal.databus.cols;
    this.cells = [];
    this.cellSize = 32;
    this.padding = 4;
    
    this.calculateGridDimensions();
    this.initGrid();
  }

  calculateGridDimensions() {
    // 计算合适的格子大小，使网格占屏幕的75%
    const padding = 20;
    const availableWidth = SCREEN_WIDTH - (padding * 2);
    const availableHeight = SCREEN_HEIGHT - (padding * 2);

    // 计算单个格子的大小，确保网格能完整显示
    this.cellSize = Math.min(
      Math.floor(availableWidth / this.cols),
      Math.floor(availableHeight / this.rows)
    );

    // 计算网格总尺寸
    this.gridWidth = this.cellSize * this.cols;
    this.gridHeight = this.cellSize * this.rows;

    // 居中显示网格
    this.startX = Math.floor((SCREEN_WIDTH - this.gridWidth) / 2);
    this.startY = Math.floor((SCREEN_HEIGHT - this.gridHeight) / 2);
  }

  initGrid() {
    const characters = GameGlobal.databus.grid;
    this.cells = [];

    // 创建网格单元格
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const index = row * this.cols + col;
        this.cells.push({
          row,
          col,
          x: this.startX + col * this.cellSize,
          y: this.startY + row * this.cellSize,
          text: characters[index],
          selected: false
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

  isAdjacent(cell1, cell2) {
    if (!cell1 || !cell2) return false;
    const rowDiff = Math.abs(cell1.row - cell2.row);
    const colDiff = Math.abs(cell1.col - cell2.col);
    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
  }

  render(ctx) {
    if (!ctx) return;

    // 绘制背景
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    // 绘制所有格子
    this.cells.forEach(cell => {
      const color = this.getCellColor(cell);
      this.drawCell(ctx, cell, color);
    });

    // 绘制选择路径
    this.drawSelectionPath(ctx);
  }

  getCellColor(cell) {
    // 获取完成诗句的颜色
    for (const [poemId, poemColor] of GameGlobal.databus.completedPoemColors) {
      if (GameGlobal.databus.isPartOfCompletedPoem({
        row: cell.row,
        col: cell.col,
        text: cell.text
      }, poemId)) {
        return poemColor;
      }
    }
    return null;
  }

  drawCell(ctx, cell, color) {
    const x = cell.x;
    const y = cell.y;

    // 绘制背景和边框
    if (cell.selected) {
      ctx.fillStyle = '#E3E3E3';  // 选中状态
    } else if (color) {
      ctx.fillStyle = color + '33';  // 已完成的诗句，33表示20%不透明度
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
    } else {
      ctx.fillStyle = '#FFFFFF';  // 普通状态
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
    }
    
    ctx.fillRect(x, y, this.cellSize, this.cellSize);
    ctx.strokeRect(x, y, this.cellSize, this.cellSize);

    // 绘制文字
    if (cell.text && cell.text !== ' ') {
      ctx.font = `${Math.floor(this.cellSize * 0.6)}px Arial`;
      ctx.fillStyle = (!cell.selected && color) ? color : '#000000';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        cell.text,
        x + this.cellSize / 2,
        y + this.cellSize / 2
      );
    }
  }

  drawSelectionPath(ctx) {
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