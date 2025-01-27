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

    this.bgmAudio = wx.createInnerAudioContext();
    this.selectAudio = wx.createInnerAudioContext();
    this.successAudio = wx.createInnerAudioContext();

    this.bgmAudio.loop = true;
    this.bgmAudio.src = 'audio/bgm.mp3';
    this.selectAudio.src = 'audio/select.mp3';
    this.successAudio.src = 'audio/success.mp3';
  }

  playBGM() {
    this.bgmAudio.play();
  }

  playSelect() {
    this.selectAudio.currentTime = 0;
    this.selectAudio.play();
  }

  playSuccess() {
    this.successAudio.currentTime = 0;
    this.successAudio.play();
  }

  stopAll() {
    this.bgmAudio.stop();
    this.selectAudio.stop();
    this.successAudio.stop();
  }
}
