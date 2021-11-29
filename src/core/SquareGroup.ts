import { Square } from "./Square";
import { Point, Shape } from "./types";

/**
 * 组合方块
 */
export class SquareGroup {

  private _squares: readonly Square[];

  public get squares() {
    return this._squares;
  }
  public get shape() {
    return this._shape;
  }
  // 中心点
  public get centerPoint(): Point {
    return this._centerPoint;
  }
  public set centerPoint(p: Point) {
    this._centerPoint = p;

    // 中心点改变则改变所有小方块坐标
    this._shape.forEach((p, i) => {
      this._squares[i].point = {
        x: this._centerPoint.x + p.x,
        y: this._centerPoint.y + p.y
      }
    })

  }

  constructor(
    private _shape: Shape,
    private _centerPoint: Point,
    private _color: string,
  ) {
    // 设置小方块数组
    const arr: Square[] = [];

    this._shape.forEach(p => {
      const square = new Square({ x: this._centerPoint.x + p.x, y: this._centerPoint.y + p.y }, this._color);
      arr.push(square);
    })

    this._squares = arr;
  }

}