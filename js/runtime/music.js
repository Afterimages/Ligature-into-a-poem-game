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
    this.selectAudio = null;
    this.successAudio = null;
    this.initAudio();

    this.bgmAudio.loop = true;
    this.bgmAudio.src = 'audio/bgm.mp3';
  }

  initAudio() {
    try {
      this.selectAudio = wx.createInnerAudioContext();
      this.successAudio = wx.createInnerAudioContext();

      this.selectAudio.src = 'audio/select.mp3';
      this.successAudio.src = 'audio/success.mp3';
    } catch (error) {
      console.error('Failed to initialize audio:', error);
    }
  }

  playBGM() {
    this.bgmAudio.play();
  }

  playSelect() {
    try {
      if (this.selectAudio) {
        this.selectAudio.stop();
        this.selectAudio.play();
      }
    } catch (error) {
      console.error('Failed to play select sound:', error);
    }
  }

  playSuccess() {
    try {
      if (this.successAudio) {
        this.successAudio.stop();
        this.successAudio.play();
      }
    } catch (error) {
      console.error('Failed to play success sound:', error);
    }
  }

  stopAll() {
    this.bgmAudio.stop();
    this.selectAudio.stop();
    this.successAudio.stop();
  }
}
