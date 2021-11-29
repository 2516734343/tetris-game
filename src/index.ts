import { Square } from "./core/Square";
import { IViewer, MoveDirection } from "./core/types";
import { SquarPageViewer } from "./core/viewer/SquarPageViewer";
import $ from "jquery";
import { SquareGroup } from "./core/SquareGroup";
import { XLineShape, LShape, createTetris } from "./core/Tetris";
import { TetrisRule } from "./core/TetrisRule";


const group = createTetris( { x: 3, y: 2 });

group.squares.forEach(sq => {
  sq.viewer = new SquarPageViewer(sq, $('#root'));
})


$('#add').click(function () {
  // 更改中心点的目标
  const targetPoint = {
    x: group.centerPoint.x,
    y: group.centerPoint.y + 1,
  }

  // TetrisRule.move(group, MoveDirection.down);
  TetrisRule.moveDirectly(group, MoveDirection.down);
 
})

