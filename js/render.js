/**
 * 渲染系统初始化
 * 
 * 功能说明：
 * 1. 创建和初始化游戏画布(Canvas)
 * 2. 获取并设置屏幕尺寸
 * 3. 提供：
 *    - 格子矩阵渲染
 *    - 诗句片段显示
 *    - 选中路径绘制
 */

GameGlobal.canvas = wx.createCanvas();

const windowInfo = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();

canvas.width = windowInfo.screenWidth;
canvas.height = windowInfo.screenHeight;

export const SCREEN_WIDTH = windowInfo.screenWidth;
export const SCREEN_HEIGHT = windowInfo.screenHeight;