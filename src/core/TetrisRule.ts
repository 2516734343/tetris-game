import GameConfig from "./GameConfig";
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
  static canIMove(shape: Shape, targetPoint: Point): boolean {
    // 假设，中心点已经移动到了目标位置，算出每个小方块的坐标
    const targetSquarePoint: Point[] = shape.map(it => {
      return {
        x: it.x + targetPoint.x,
        y: it.y + targetPoint.y,
      }
    })
    // 边界判断
    const flag = targetSquarePoint.some(p => {
         // 是否超出了边界
      return p.x < 0 || p.x > GameConfig.panelSize.width - 1 || p.y < 0 || p.y > GameConfig.panelSize.height - 1;
    })
    return !flag;

  }
  static move(tetris: SquareGroup, targetPoint: Point): boolean
  static move(tetris: SquareGroup, targetDirection: MoveDirection): boolean

  /**
   * 移动
   * @param tetris 
   * @param targetPointOrDirection 
   * @returns 
   */
  static move(tetris: SquareGroup, targetPointOrDirection: Point | MoveDirection): boolean {
    if (isPoint(targetPointOrDirection)) {
      if (TetrisRule.canIMove(tetris.shape, targetPointOrDirection)) {
        tetris.centerPoint = {
          x: tetris.centerPoint.x,
          y: tetris.centerPoint.y + 1,
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
      return this.move(tetris, targetPoint);
    }
  }

  static moveDirectly(tetris: SquareGroup, direction: MoveDirection) {
    while (this.move(tetris, direction)) {
    }
  }




}


