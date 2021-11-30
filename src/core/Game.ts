import { SquareGroup } from "./SquareGroup";
import { createTetris } from "./Tetris";
import { GameStatus } from "./types";


export class Game {

  // 游戏状态
  gameStatus: GameStatus = GameStatus.init;

  //当前玩家操作的方块
  curTetris?: SquareGroup;

  // 下一个方块
  nextTetris: SquareGroup = createTetris({ x: 0, y: 0 });

  // 计时器
  timer?: number;
  
  // 游戏开始
  start() {
    if (this.gameStatus === GameStatus.playing) {
      return;
    }
    this.gameStatus = GameStatus.playing;

    if (!this.curTetris) {
      // 初始化当前操作的方块
      this.switchTetris();
    }
    this.autoDrop();

  }

  // 方块自由下落
  private autoDrop() {

  }

  // 切换方块
  private switchTetris() {
    this.curTetris = this.nextTetris;
    this.nextTetris = createTetris({ x: 0, y: 0 });
  }





}

