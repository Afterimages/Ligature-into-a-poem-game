// 得分和游戏状态管理
export default class ScoreManager {
  constructor() {
    this.score = 0;
    this.currentLevelScore = 0;
    this.level = 1;
    this.isGameOver = false;
    this.isDebugMode = true;
  }

  addScore(points) {
    this.score += points;
    this.currentLevelScore += points;
  }

  reset() {
    this.score = 0;
    this.currentLevelScore = 0;
    this.level = 1;
    this.isGameOver = false;
  }
} 