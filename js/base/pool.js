/**
 * 对象池管理类
 * 
 * 功能说明：
 * 1. 对象的存储和重复使用管理
 * 2. 减少对象创建和销毁的性能开销
 * 3. 优化内存使用，减少垃圾回收
 * 
 * 使用方法：
 * 1. getPoolBySign(): 获取特定标识的对象池
 * 2. getItemByClass(): 从对象池获取对象实例
 * 3. recover(): 回收对象到对象池
 */

const __ = {
  poolDic: Symbol('poolDic'),
};

/**
 * 简易的对象池实现
 * 用于对象的存贮和重复使用
 * 可以有效减少对象创建开销和避免频繁的垃圾回收
 * 提高游戏性能
 */
export default class Pool {
  constructor() {
    this[__.poolDic] = {};
  }

  /**
   * 根据对象标识符
   * 获取对应的对象池
   */
  getPoolBySign(name) {
    return this[__.poolDic][name] || (this[__.poolDic][name] = []);
  }

  /**
   * 根据传入的对象标识符，查询对象池
   * 对象池为空创建新的类，否则从对象池中取
   */
  getItemByClass(name, className) {
    const pool = this.getPoolBySign(name);

    const result = pool.length ? pool.shift() : new className();

    return result;
  }

  /**
   * 将对象回收到对象池
   * 方便后续继续使用
   */
  recover(name, instance) {
    this.getPoolBySign(name).push(instance);
  }
}
