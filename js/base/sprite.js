/**
 * 游戏精灵基础类
 * 
 * 功能说明：
 * 1. 提供游戏中所有可视对象的基类
 * 2. 实现基础的渲染功能
 * 3. 提供碰撞检测方法
 * 4. 继承自事件发射器，支持事件机制
 * 
 * 主要属性：
 * - visible: 是否可见
 * - isActive: 是否可碰撞
 * - x, y: 位置坐标
 * - width, height: 尺寸
 */

import Emitter from '../libs/tinyemitter';

/**
 * 游戏基础的精灵类
 */
export default class Sprite extends Emitter {
  visible = true; // 是否可见
  isActive = true; // 是否可碰撞

  constructor(imgSrc = '', width = 0, height = 0, x = 0, y = 0) {
    super();
    
    this.img = wx.createImage();
    this.img.src = imgSrc;

    this.width = width;
    this.height = height;

    this.x = x;
    this.y = y;

    this.visible = true;
  }

  /**
   * 将精灵图绘制在canvas上
   */
  render(ctx) {
    if (!this.visible) return;

    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  /**
   * 简单的碰撞检测定义：
   * 另一个精灵的中心点处于本精灵所在的矩形内即可
   * @param{Sprite} sp: Sptite的实例
   */
  isCollideWith(sp) {
    const spX = sp.x + sp.width / 2;
    const spY = sp.y + sp.height / 2;

    // 不可见则不检测
    if (!this.visible || !sp.visible) return false;
    // 不可碰撞则不检测
    if (!this.isActive || !sp.isActive) return false;

    return !!(
      spX >= this.x &&
      spX <= this.x + this.width &&
      spY >= this.y &&
      spY <= this.y + this.height
    );
  }
}
