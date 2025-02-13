/**
 * 游戏UI管理类
 * 
 * 功能说明：
 * 1. 管理游戏界面显示
 * 2. 处理：
 *    - 诗句展示
 *    - 得分显示
 *    - 游戏说明
 *    - 完成提示
 * 3. 处理用户交互事件
 * 
 * 继承自事件发射器以支持UI事件
 */

import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../render';

export default class GameInfo {
  constructor() {
    // 移除 btnArea，因为现在整个屏幕都可以点击
    // 移除 touchEventHandler 绑定
  }

  setFont(ctx) {
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px Arial';
  }

  render(ctx) {
    // 游戏结束
    if (GameGlobal.databus.isGameOver) {
      this.renderGameOver(ctx);
      return;
    }

    // 正常游戏中
    this.renderGameScore(ctx);
  }

  renderGameScore(ctx) {
    const gridStartY = GameGlobal.grid ? GameGlobal.grid.startY : 100;

    // 显示关卡和得分信息
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(
      `第${GameGlobal.databus.level}关`,
      SCREEN_WIDTH / 2,
      gridStartY - 40
    );

    ctx.font = 'bold 28px Arial';
    ctx.fillText(
      `总分: ${GameGlobal.databus.score}  本关: ${GameGlobal.databus.currentLevelScore}`,
      SCREEN_WIDTH / 2,
      gridStartY - 10
    );

    // 显示当前需要完成的诗句
    this.renderNextPoem(ctx);
  }

  renderNextPoem(ctx) {
    const nextPoem = GameGlobal.databus.poems.find(poem => 
      !GameGlobal.databus.completedPoems.includes(poem.id)
    );

    if (nextPoem) {
      ctx.font = '20px Arial';
      ctx.textAlign = 'left';
      ctx.fillStyle = '#666666';
      
      // 在底部显示提示
      ctx.fillText(
        `下一句：${nextPoem.content}`,
        10,
        SCREEN_HEIGHT - 20
      );
      ctx.fillText(
        `《${nextPoem.title}》 ${nextPoem.author}`,
        10,
        SCREEN_HEIGHT - 50
      );
    }
  }

  renderGameOver(ctx) {
    // 添加半透明黑色背景
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    ctx.fillStyle = '#ffffff';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';  // 使用文字居中对齐
    
    // 居中显示文本
    ctx.fillText(
      '游戏完成！',
      SCREEN_WIDTH / 2,
      SCREEN_HEIGHT / 2 - 30
    );

    ctx.fillText(
      '最终得分: ' + GameGlobal.databus.score,
      SCREEN_WIDTH / 2,
      SCREEN_HEIGHT / 2 + 30
    );

    ctx.fillText(
      '点击屏幕重新开始',
      SCREEN_WIDTH / 2,
      SCREEN_HEIGHT / 2 + 90
    );
  }
}
