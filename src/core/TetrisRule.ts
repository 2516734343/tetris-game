import GameConfig from "./GameConfig";
import { Square } from "./Square";
import { SquareGroup } from "./SquareGroup";
import { MoveDirection, Point, Shape } from "./types";


function isPoint(obj: any): obj is Point {
  if (typeof obj.x === "undefined") {
    return false;
  }
  return true;
}

/**
 * 该类中提供一些列的函数，根据游戏规则判断各种情况
 */
export class TetrisRule {
  /**
   * 
   * @param params 判断某个形状的方块是否能够移动到目标位置
   * @returns 
   */
  static canIMove(shape: Shape, targetPoint: Point, exists: Square[]): boolean {
    // 假设，中心点已经移动到了目标位置，算出每个小方块的坐标
    const targetSquarePoint: Point[] = shape.map(it => {
      return {
        x: it.x + targetPoint.x,
        y: it.y + targetPoint.y,
      }
    })

    // 边界判断
    let flag = targetSquarePoint.some(p => {
         // 是否超出了边界
      return p.x < 0 || p.x > GameConfig.panelSize.width - 1 || p.y < 0 || p.y > GameConfig.panelSize.height - 1;
    })
    if (flag) {
      return false;
    }
    
    // 判断是否与已经有的方块重叠
    flag = targetSquarePoint.some(p => exists.some(sq => sq.point.x === p.x && sq.point.y === p.y)
    )
    if (flag) {
      return false;
    } 

    return true;

  }
  static move(tetris: SquareGroup, targetPoint: Point, exists: Square[]): boolean
  static move(tetris: SquareGroup, targetDirection: MoveDirection, exists: Square[]): boolean

  /**
   * 移动
   * @param tetris 
   * @param targetPointOrDirection 
   * @returns 
   */
  static move(tetris: SquareGroup, targetPointOrDirection: Point | MoveDirection, exists: Square[]): boolean {
    if (isPoint(targetPointOrDirection)) {
      if (TetrisRule.canIMove(tetris.shape, targetPointOrDirection, exists)) {
        tetris.centerPoint = {
          x: targetPointOrDirection.x,
          y: targetPointOrDirection.y,
        }
        return true
      }
      return false;
    } else {
      const direction = targetPointOrDirection;
      let targetPoint: Point;
      if (direction === MoveDirection.down) {

        targetPoint = {
          x: tetris.centerPoint.x,
          y: tetris.centerPoint.y + 1,
        }

      } else if (direction === MoveDirection.left) {

        targetPoint = {
          x: tetris.centerPoint.x - 1,
          y: tetris.centerPoint.y,
        }

      } else {
        targetPoint = {
          x: tetris.centerPoint.x + 1,
          y: tetris.centerPoint.y,
        }

      }
      return this.move(tetris, targetPoint, exists);
    }
  }

  static moveDirectly(tetris: SquareGroup, direction: MoveDirection, exists: Square[]) {
    while (this.move(tetris, direction, exists)) {
    }
  }

  static rotate(tetris: SquareGroup, exists: Square[]): boolean {
    const newShape = tetris.afterRotateShape();
    if (this.canIMove(newShape, tetris.centerPoint, exists)) {
      tetris.rotate();
      return true;
    }
    return false;
  }


  /**
   * 从已经存在的方块中消除，并返回消除的行数
   * @param exists 
   */
  static deleteSquares(exists: Square[]): number {
    // 获得y坐标的数组
    const ys = exists.map(sq => sq.point.y);
    // 获取最大和最小的y坐标
    const maxY = Math.max(...ys);
    const minY = Math.min(...ys);
    // 判断每一行是否可以消除
    let num = 0;
    for (let y = minY; y <= maxY; y++) {
      if (this.deleteLine(exists, y)) {
        num++;
      }
    }
    return num;
  }


  private static deleteLine(exists: Square[], y: number): boolean {
    const squers = exists.filter(sq => sq.point.y === y);
    if (squers.length === GameConfig.panelSize.width) {
      // 可以消除
      squers.forEach(sq => {
        // 从界面移除
        if (sq.viewer) {
          sq.viewer.remove()
        }
        const index = exists.indexOf(sq);
        exists.splice(index, 1);

      })
       // 剩下的y>当前y的，加1
       exists.filter(sq => sq.point.y < y).forEach(sq => {
        sq.point = {
          x: sq.point.x,
          y: sq.point.y + 1
        }
      })

      return true;

    }
    return false;
  }




}


