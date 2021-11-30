import { Square } from "./core/Square";
import { IViewer, MoveDirection } from "./core/types";
import { SquarPageViewer } from "./core/viewer/SquarPageViewer";
import $ from "jquery";
import { SquareGroup } from "./core/SquareGroup";
import { createTetris } from "./core/Tetris";
import { TetrisRule } from "./core/TetrisRule";
import { Game } from "./core/Game";
import { GamePageViewer } from "./core/viewer/GamePageViewer";



let g = new Game(new GamePageViewer());


$('#start').click(function () {
  g.start();
})

$('#pause').click(function () {
  g.pause();
})
$('#down').click(function () {
  g.controlDown();
})
$('#left').click(function () {
  g.controlLeft();
})
$('#right').click(function () {
  g.controlRight();
})
$('#rotate').click(function () {
  g.controlRotate();
})

