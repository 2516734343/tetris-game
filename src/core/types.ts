import { Game } from "./Game";
import { SquareGroup } from "./SquareGroup";

export interface Point{
  readonly x: number;
  readonly y: number;
}

export interface IViewer {
  show(): void; // 显示
  remove(): void; // 移除
}

/**
 * 
 * 形状
 */
export type Shape = Point[]


export enum MoveDirection {
  left,
  right,
  down,
}


export enum GameStatus {
  init,
  playing,
  pause,
  over,
}

export interface GameViewer {
  /**
   * 
   * @param tetris 下一个方块对象
   */
  showNext(tetris: SquareGroup): void;
  /**
   * 
   * @param tetris 切换的方块对象
   */
  switch(tetris: SquareGroup): void;

    // 完成界面的初始化
  init(game: Game): void

  // 显示分数
  showScore(score: number): void;

  // 游戏暂停
  onGamePause(): void;

  // 游戏结束
  onGameOver(): void;
}

