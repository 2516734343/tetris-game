import { SquareGroup } from "../SquareGroup";
import { GameViewer } from "../types";
import { SquarPageViewer } from "./SquarPageViewer";
import $ from "jquery";
import { Game } from "../Game";
import GameConfig from "../GameConfig";
import PageConfig from "./PageConfig";

export class GamePageViewer implements GameViewer {
  onGamePause(): void {
    this.msgDom.html('游戏暂停');
  }
  onGameOver(): void {
    this.msgDom.html('游戏结束');
  }
  showScore(score: number): void {
    this.scoreDom.html(`分数：${score.toString()}`);
  }
  private nextDom = $('#next');
  private panelDom = $('#panel');
  private scoreDom = $('#score');
  private msgDom = $('#msg');

  init(game: Game): void {
    // 设置宽高
    this.panelDom.css({
      width: GameConfig.panelSize.width * PageConfig.SquareSize.width,
      height: GameConfig.panelSize.height * PageConfig.SquareSize.height,
    })
    this.nextDom.css({
      width: GameConfig.nextSize.width * PageConfig.SquareSize.width,
      height: GameConfig.nextSize.height * PageConfig.SquareSize.height,
    })

    // 注册键盘事件

    $(document).keydown((e) => {
      if (e.keyCode === 37) {
        game.controlLeft()
      } else if (e.keyCode === 38) {
        game.controlRotate()
      } else if (e.keyCode === 39) {
        game.controlRight()
      } else if (e.keyCode === 40) {
        game.controlDown()
      }
    })
  }

  showNext(tetris: SquareGroup): void {
    tetris.squares.forEach(sq => {
      sq.viewer = new SquarPageViewer(sq, this.nextDom)
    })
  }

  switch(tetris: SquareGroup): void {
    tetris.squares.forEach(sq => {
      sq.viewer!.remove();
      sq.viewer = new SquarPageViewer(sq, this.panelDom)
    })
  }
  
}