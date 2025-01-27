/**
 * 音频管理器
 * 
 * 功能说明：
 * 1. 管理游戏所有音频资源
 * 2. 提供音频播放控制
 * 3. 支持：
 *    - 背景音乐（古风）
 *    - 选择音效
 *    - 匹配成功音效
 * 
 * 使用单例模式确保全局只有一个音频管理器实例
 */

let instance;

/**
 * 统一的音效管理器
 */
export default class Music {
  constructor() {
    if (instance) return instance;
    instance = this;
  }

  playBGM() {
    // 暂时不播放音频
  }

  playSelect() {
    // 暂时不播放音频
  }

  playSuccess() {
    // 暂时不播放音频
  }

  stopAll() {
    // 暂时不播放音频
  }
}
