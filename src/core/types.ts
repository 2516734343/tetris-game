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

