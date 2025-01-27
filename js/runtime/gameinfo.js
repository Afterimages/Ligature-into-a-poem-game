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

import Emitter from '../libs/tinyemitter';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../render';

const atlas = wx.createImage();
atlas.src = 'images/Common.png';

export default class GameInfo extends Emitter {
  constructor() {
    super();

    this.btnArea = {
      startX: SCREEN_WIDTH / 2 - 40,
      startY: SCREEN_HEIGHT / 2 - 100 + 180,
      endX: SCREEN_WIDTH / 2 + 50,
      endY: SCREEN_HEIGHT / 2 - 100 + 255,
    };

    // 绑定触摸事件
    wx.onTouchStart(this.touchEventHandler.bind(this))
  }

  setFont(ctx) {
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px Arial';
  }

  render(ctx) {
    // 显示当前分数
    this.renderScore(ctx);
    
    // 显示已完成的诗句
    this.renderCompletedPoems(ctx);
    
    // 显示匹配成功提示
    if (this.showMatchSuccess) {
      this.renderMatchSuccess(ctx);
    }

    // 游戏结束时停止帧循环并显示游戏结束画面
    if (GameGlobal.databus.isGameOver) {
      this.renderGameOver(ctx, GameGlobal.databus.score); // 绘制游戏结束画面
    }
  }

  renderScore(ctx) {
    this.setFont(ctx);
    ctx.fillText(GameGlobal.databus.score, 10, 30);
  }

  renderCompletedPoems(ctx) {
    const poems = GameGlobal.databus.completedPoems.map(id => 
      GameGlobal.databus.poems.find(p => p.id === id)
    );

    ctx.fillStyle = '#000000';
    ctx.font = '16px Arial';
    poems.forEach((poem, index) => {
      ctx.fillText(
        `${poem.title}：${poem.content}`,
        10,
        SCREEN_HEIGHT - 20 - (index * 25)
      );
    });
  }

  showMatchSuccessMessage() {
    this.showMatchSuccess = true;
    setTimeout(() => {
      this.showMatchSuccess = false;
    }, 1500);
  }

  renderMatchSuccess(ctx) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, SCREEN_HEIGHT / 2 - 50, SCREEN_WIDTH, 100);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('诗句匹配成功！', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2);
  }

  renderGameOver(ctx, score) {
    this.drawGameOverImage(ctx);
    this.drawGameOverText(ctx, score);
    this.drawRestartButton(ctx);
  }

  drawGameOverImage(ctx) {
    ctx.drawImage(
      atlas,
      0,
      0,
      119,
      108,
      SCREEN_WIDTH / 2 - 150,
      SCREEN_HEIGHT / 2 - 100,
      300,
      300
    );
  }

  drawGameOverText(ctx, score) {
    this.setFont(ctx);
    ctx.fillText(
      '游戏结束',
      SCREEN_WIDTH / 2 - 40,
      SCREEN_HEIGHT / 2 - 100 + 50
    );
    ctx.fillText(
      `得分: ${score}`,
      SCREEN_WIDTH / 2 - 40,
      SCREEN_HEIGHT / 2 - 100 + 130
    );
  }

  drawRestartButton(ctx) {
    ctx.drawImage(
      atlas,
      120,
      6,
      39,
      24,
      SCREEN_WIDTH / 2 - 60,
      SCREEN_HEIGHT / 2 - 100 + 180,
      120,
      40
    );
    ctx.fillText(
      '重新开始',
      SCREEN_WIDTH / 2 - 40,
      SCREEN_HEIGHT / 2 - 100 + 205
    );
  }

  touchEventHandler(event) {
    const { clientX, clientY } = event.touches[0]; // 获取触摸点的坐标

    // 当前只有游戏结束时展示了UI，所以只处理游戏结束时的状态
    if (GameGlobal.databus.isGameOver) {
      // 检查触摸是否在按钮区域内
      if (
        clientX >= this.btnArea.startX &&
        clientX <= this.btnArea.endX &&
        clientY >= this.btnArea.startY &&
        clientY <= this.btnArea.endY
      ) {
        // 调用重启游戏的回调函数
        this.emit('restart');
      }
    }
  }
}
