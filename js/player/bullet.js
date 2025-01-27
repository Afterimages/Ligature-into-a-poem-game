/**
 * 子弹类
 * 
 * 功能说明：
 * 1. 处理玩家射击的子弹逻辑
 * 2. 实现：
 *    - 子弹移动
 *    - 出界检测
 *    - 对象回收
 * 3. 使用对象池管理子弹实例
 */

import Sprite from '../base/sprite';

const BULLET_IMG_SRC = 'images/bullet.png';
const BULLET_WIDTH = 16;
const BULLET_HEIGHT = 30;

export default class Bullet extends Sprite {
  constructor() {
    super(BULLET_IMG_SRC, BULLET_WIDTH, BULLET_HEIGHT);
  }

  init(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.isActive = true;
    this.visible = true;
  }

  // 每一帧更新子弹位置
  update() {
    if (GameGlobal.databus.isGameOver) {
      return;
    }
  
    this.y -= this.speed;

    // 超出屏幕外销毁
    if (this.y < -this.height) {
      this.destroy();
    }
  }

  destroy() {
    this.isActive = false;
    // 子弹没有销毁动画，直接移除
    this.remove();
  }

  remove() {
    this.isActive = false;
    this.visible = false;
    // 回收子弹对象
    GameGlobal.databus.removeBullets(this);
  }
}
