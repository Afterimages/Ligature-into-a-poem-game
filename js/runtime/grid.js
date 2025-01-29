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
    this.cellSize = 32;  // 每个格子的大小
    this.padding = 4;    // 格子之间的间距
    this.data = [];      // 网格数据
    this.startX = 10;    // 起始X坐标（左边距）
    this.startY = 60;    // 起始Y坐标（顶部边距，为标题留空间）
    this.currentPath = [];  // 当前选中的路径
    
    // 计算合适的格子大小和位置
    this.calculateGridDimensions();
    this.initGrid();
  }

  calculateGridDimensions() {
    // 设置网格的理想尺寸（整体占屏幕的70-80%）
    const screenRatio = 0.75;
    const padding = 20;  // 边距

    // 计算可用空间
    const availableWidth = SCREEN_WIDTH - (padding * 2);
    const availableHeight = SCREEN_HEIGHT - (padding * 2);

    // 计算单个格子的大小
    this.cellSize = Math.min(
      availableWidth / this.cols,
      availableHeight / this.rows
    );

    // 计算整个网格的尺寸
    this.gridWidth = this.cellSize * this.cols;
    this.gridHeight = this.cellSize * this.rows;

    // 计算网格的起始位置（居中）
    this.startX = (SCREEN_WIDTH - this.gridWidth) / 2;
    this.startY = (SCREEN_HEIGHT - this.gridHeight) / 2;
  }

  initGrid() {
    const characters = GameGlobal.databus.grid;
    this.cells = [];
    this.data = [...characters];  // 保存网格数据的副本

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const index = row * this.cols + col;
        this.cells.push({
          row,
          col,
          x: this.startX + col * this.cellSize,
          y: this.startY + row * this.cellSize,
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

    // 绘制背景
    if (cell.selected) {
      ctx.fillStyle = '#E3E3E3';
    } else if (color) {
      ctx.fillStyle = color + '33';  // 33表示20%不透明度
      // 使用指定的颜色绘制边框
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
    } else {
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
    }
    
    ctx.fillRect(x, y, this.cellSize, this.cellSize);
    ctx.strokeRect(x, y, this.cellSize, this.cellSize);

    // 绘制文字
    if (cell.text && cell.text !== ' ') {
      ctx.font = `${this.cellSize * 0.6}px Arial`;
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