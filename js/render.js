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

// 获取系统信息
const systemInfo = wx.getSystemInfoSync();
const screenWidth = systemInfo.windowWidth;
const screenHeight = systemInfo.windowHeight;

// 创建canvas并导出
export const canvas = wx.createCanvas();

// 设置canvas尺寸
canvas.width = screenWidth;
canvas.height = screenHeight;

export const SCREEN_WIDTH = screenWidth;
export const SCREEN_HEIGHT = screenHeight;