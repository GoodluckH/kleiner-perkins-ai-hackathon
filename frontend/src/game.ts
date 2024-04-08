import "phaser";
import { GameScene } from "./scenes/game-scene";

const graphicsSettings = { best: 1, medium: 0.75, low: 0.5 };
const DPR = window.devicePixelRatio * graphicsSettings.best;
const { innerWidth, innerHeight } = window;

// Set width and height.
const WIDTH = Math.round(Math.max(innerWidth, innerHeight) * DPR);
const HEIGHT = Math.round(Math.min(innerWidth, innerHeight) * DPR);

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.CANVAS,
  width: window.innerWidth,
  height: window.innerHeight,
  parent: "game",
  backgroundColor: "#000",
  scene: [GameScene],
  antialias: true,
  antialiasGL: true,
  input: {
    keyboard: true,
  },
  render: {
    antialias: true,
    antialiasGL: true,
  },
  scale: {
    parent: "game",
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: WIDTH,
    height: HEIGHT,
  },
};

export class Game extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);
  }
}

window.addEventListener("load", () => {
  let game = new Game(config);
});
