import GameConfig from "./GameConfig";
import { Square } from "./Square";
import { SquareGroup } from "./SquareGroup";
import { createTetris } from "./Tetris";
import { TetrisRule } from "./TetrisRule";
import { GameStatus, GameViewer, MoveDirection } from "./types";


export class Game {

  // 游戏状态
  private _gameStatus: GameStatus = GameStatus.init;

  //当前玩家操作的方块
  private _curTetris?: SquareGroup;

  // 下一个方块
  private _nextTetris: SquareGroup = createTetris({ x: 0, y: 0 });

  // 计时器
  private _timer?: any;

  // 自动下落间隔时间
  private _duration?: number = 1000;

  // 已经存在的方块
  private _exists: Square[] = [];

  // 积分
  private _score: number = 0;

  public get score() {
    return this._score;
  }
  public set score(val) {
    this._score = val;
    this._viewer.showScore(val);
  }

  constructor(private _viewer: GameViewer) {
    this.createNext();
    this._viewer.init(this);
    
  }

  private createNext() {
    this._nextTetris = createTetris({ x: 0, y: 0 });
    this.resetCenterPoints(GameConfig.nextSize.width, this._nextTetris);
    this._viewer.showNext(this._nextTetris);
  }

  // 初始化
  private init() {
    this._exists.forEach(sq => sq.viewer?.remove());
    this._exists = [];
    this.createNext();
    this._curTetris = undefined;
    this.score = 0;
  }
  
  // 游戏开始
  start() {
    if (this._gameStatus === GameStatus.playing) {
      return;
    }
    // 从游戏结束到开始
    if (this._gameStatus === GameStatus.over) {
      this.init();
    }
    this._gameStatus = GameStatus.playing;

    if (!this._curTetris) {
      // 初始化当前操作的方块
      this.switchTetris();
    }
    this.autoDrop();

  }
  pause() {
    if (this._gameStatus === GameStatus.playing) {
      this._gameStatus = GameStatus.pause;
      clearInterval(this._timer);
      this._timer = undefined;
    }
  }

  controlLeft() {
    if (this._curTetris && this._gameStatus === GameStatus.playing) {
      TetrisRule.move(this._curTetris, MoveDirection.left, this._exists);
    }
  }
  controlRight() {
    if (this._curTetris && this._gameStatus === GameStatus.playing) {
      TetrisRule.move(this._curTetris, MoveDirection.right, this._exists);
    }
  }
  controlDown() {
    if (this._curTetris && this._gameStatus === GameStatus.playing) {
      TetrisRule.moveDirectly(this._curTetris, MoveDirection.down, this._exists);
      // 触底
      this.hitBottom();
    }
  }

  controlRotate() {
    if (this._curTetris && this._gameStatus === GameStatus.playing) {
      TetrisRule.rotate(this._curTetris, this._exists);
    }
  }

  // 方块自由下落
  private autoDrop() {
    if (this._timer || this._gameStatus !== GameStatus.playing) {
      return;
    }
    this._timer = setInterval(() => {
      if (this._curTetris) {
        if (!TetrisRule.move(this._curTetris, MoveDirection.down, this._exists)) {
            // 触底
          this.hitBottom();
          }
      }

    }, this._duration);

  }

  // 切换方块
  private switchTetris() {
    this._curTetris = this._nextTetris;
    this._curTetris.squares.forEach(sq => sq.viewer?.remove())
    this.resetCenterPoints(GameConfig.panelSize.width, this._curTetris);
    // 有可能出问题，当前防窥一出现时，就和已经存在的方块重叠了，
    if (!TetrisRule.canIMove(this._curTetris.shape, this._curTetris.centerPoint, this._exists)) {
      // 游戏结束
      this._gameStatus = GameStatus.over;
      clearInterval(this._timer);
      this._timer = undefined;

      return;
    };
    this.createNext();
    this._viewer.switch(this._curTetris);
  }

  /**
   * 设置方块的中心点，让方块出现在面板的中上方
   * @param width 
   * @param tetris 
   */
  private resetCenterPoints(width: number, tetris: SquareGroup) {
    const x = Math.ceil(width / 2) - 1;
    const y = 0;
    tetris.centerPoint = { x, y };
    while (tetris.squares.some(it => it.point.y < 0)) {
      tetris.centerPoint = {
        x: tetris.centerPoint.x,
        y: tetris.centerPoint.y + 1,
      }
      // TetrisRule.move(tetris, MoveDirection.down);
    }

  }

  /**
   * 触底之后的操作
   */
  private hitBottom() {
    // 将当前的方块包含的小方块加入到已经存在的方块数组中，
    this._exists.push(...this._curTetris!.squares);
    // 处理移除
    const num = TetrisRule.deleteSquares(this._exists);
    // 增加积分
    this.addScore(num);
    // 切换方块
    this.switchTetris();

  }

  private addScore(num: number) {
    if (num === 0) {
      return;
    } else if (num === 1) {
      this.score += 10;
    } else if (num === 2) {
      this.score += 25;
    } else if (num === 3) {
      this.score += 30;
    } else {
      this.score += 50;
    }

  }





}

