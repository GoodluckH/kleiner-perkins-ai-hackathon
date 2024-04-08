import hull from "hull.js";
import { ToastStatus } from "../types/general";
import { translatePoint } from "../utils/translate";
import { convertToNumber, formatNumber } from "../utils/numbers";

export class GameScene extends Phaser.Scene {
  private dots: { text: Phaser.GameObjects.Text; x: number; y: number }[];
  private scoreText: Phaser.GameObjects.Text | undefined;
  private graphics: Phaser.GameObjects.Graphics | undefined;
  private polygon: Phaser.Geom.Polygon | undefined;
  private userText: Phaser.GameObjects.Text | undefined;
  private countdownText: Phaser.GameObjects.Text | undefined;
  private countdownEvent: Phaser.Time.TimerEvent | undefined;
  private startTime: number | undefined;
  private gameTime: number = 60_000; // 1 minute in milliseconds
  private gameStarted: boolean = false;
  private restartButton: Phaser.GameObjects.Text | undefined;
  private startButton: Phaser.GameObjects.Text | undefined;
  private globalBestScore: Phaser.GameObjects.Text | undefined;

  constructor() {
    super({
      key: "GameScene",
    });
    this.dots = [];
  }

  preload(): void {}
  init(): void {
    this.registry.set("score", 0);
    this.registry.set(
      "globalScore",
      convertToNumber(localStorage.getItem("globalScore") ?? "0")
    );
  }

  create = () => {
    this.polygon = new Phaser.Geom.Polygon();
    this.userText = this.add.text(150, window.innerHeight * 1.7, "", {
      color: "#000",
      fontSize: 20 * window.devicePixelRatio,
      backgroundColor: "#fff",
      padding: { x: 10, y: 5 },
    });
    this.userText.visible = false;

    this.globalBestScore = this.add.text(
      this.game.canvas.width / 2 - 100,
      this.game.canvas.height / 2 + 100,
      "Global Best: " + formatNumber(this.registry.values.globalScore),
      {
        color: "#fff",
        fontSize: 40 * window.devicePixelRatio,
      }
    );

    this.globalBestScore.visible = true;
    this.scoreText = this.add.text(
      window.innerWidth * 1.7,
      10,
      "Score: " + this.registry.get("score"),
      {
        color: "#fff",
        fontSize: 20 * window.devicePixelRatio,
        align: "right",
      }
    );

    this.graphics = this.add.graphics();

    this.input.keyboard!.on("keydown", (e: KeyboardEvent) => {
      if (this.gameStarted) {
        this.handleTextInput(e);
      }
    });

    // Start button
    this.startButton = this.add.text(
      window.innerWidth,
      window.innerHeight - 40,
      "Start",
      {
        color: "#fff",
        backgroundColor: "#e3007c",
        fontSize: 20 * window.devicePixelRatio,
      }
    );
    this.startButton.setInteractive();
    this.startButton.on("pointerover", () => {
      // change cursor to pointer
      this.input.setDefaultCursor("pointer");
      this.startButton!.setAlpha(0.5);
    });
    this.startButton.on("pointerout", () => {
      // change cursor back to default
      this.input.setDefaultCursor("default");
      this.startButton!.setAlpha(1);
    });
    this.startButton.on("pointerdown", () => this.startGame());
    this.startButton.visible = true;

    // Restart button
    this.restartButton = this.add.text(
      window.innerWidth * 1.7,
      window.innerHeight * 1.8,
      "Restart",
      {
        color: "#fff",
        fontSize: 20 * window.devicePixelRatio,
      }
    );
    this.restartButton.setInteractive();
    this.restartButton.on("pointerdown", () => this.restartGame());
    this.restartButton.visible = false; // Initially hide the restart button

    console.log(this.game.canvas.width, this.game.canvas.height);
  };

  startGame() {
    this.restartGame();
    this.gameStarted = true;
    this.startTime = Date.now();
    this.countdownText = this.add.text(window.innerWidth, 10, "1:00", {
      color: "#fff",
      fontSize: 40 * window.devicePixelRatio,
    });
    this.countdownEvent = this.time.addEvent({
      delay: 1000,
      callback: this.updateCountdown,
      callbackScope: this,
      loop: true,
    });
    if (this.restartButton) this.restartButton.visible = true;
    if (this.startButton) this.startButton.visible = false;
    if (this.userText) this.userText.visible = true;
    if (this.globalBestScore) this.globalBestScore.visible = false;
  }

  endGame() {
    this.gameStarted = false;
    if (this.countdownEvent) {
      this.countdownEvent.destroy();
    }
    if (this.countdownText) {
      this.countdownText.destroy();
    }
    if (this.restartButton) this.restartButton.visible = false;
    if (this.startButton) this.startButton.visible = true;
    if (this.userText) {
      this.userText.setText("");
      this.userText.visible = false;
    }
    if (this.registry.values.score > this.registry.values.globalScore) {
      console.log(
        "Endgame new record",
        this.registry.values.score,
        this.registry.values.globalScore
      );

      this.registry.set("globalScore", this.registry.values.score);
      localStorage.setItem(
        "globalScore",
        formatNumber(this.registry.values.score) || "0"
      );
      this.globalBestScore!.setText(
        "Global Best: " + formatNumber(this.registry.values.score)
      );
    }
    if (this.globalBestScore) this.globalBestScore.visible = true;
  }

  updateCountdown() {
    const elapsedTime = Date.now() - this.startTime!;
    const remainingTime = this.gameTime - elapsedTime;
    const seconds = Math.floor(remainingTime / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const countdownText = `${minutes}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
    this.countdownText!.setText(countdownText);
    if (remainingTime <= 0) {
      this.endGame();
    }
  }

  restartGame() {
    this.dots.forEach((dot) => {
      dot.text.destroy();
    });
    this.dots = [];
    this.registry.set("score", 0);
    if (this.scoreText) {
      this.scoreText.setText("Score: 0");
    }
    if (this.graphics) {
      this.graphics.clear();
    }
    if (this.countdownText) {
      this.countdownText.destroy();
    }
    if (this.countdownEvent) {
      this.countdownEvent.destroy();
    }
    this.endGame();
  }

  private async handleTextInput(event: KeyboardEvent) {
    if (!this.userText) return;
    // make sure only english words
    if (event.key.length === 1 && event.key.match(/[a-z]/i)) {
      this.userText.setText(this.userText.text + event.key);
    } else if (event.key === "Backspace") {
      this.userText.setText(this.userText.text.slice(0, -1));
    } else if (event.key === "Enter") {
      // this.drawTemporaryToast("Drawing dot");
      // random x and y

      try {
        const result = await fetch(
          `http://127.0.0.1:8000/word?word=${this.userText.text}`
        );
        const data = await result.json();

        if (data.embedding === null || data.embedding === undefined) {
          this.drawTemporaryToast(
            "Not a word in our dictionary",
            2000,
            ToastStatus.INFO
          );
        } else {
          const { x, y } = translatePoint(
            data.embedding[0],
            data.embedding[1],
            this.game.canvas.width,
            this.game.canvas.height
          );
          this.drawDot(x, y);
        }
      } catch (error) {
        console.error(error);
      }

      this.userText.setText("");
    }
  }

  private drawTemporaryToast(
    message: string,
    duration = 1000,
    status = ToastStatus.INFO,
    x = window.innerWidth,
    y = window.innerHeight
  ) {
    const toast = this.add.text(x, y, message, {
      color: "#000",
      fontSize: 20 * window.devicePixelRatio,
    });

    // make it pretty with background and rounded corners
    toast.setBackgroundColor(
      status === ToastStatus.INFO ? "#fff000" : "#00ff00"
    );
    toast.setPadding(10, 5);

    // set smooth animation
    this.tweens.add({
      targets: toast,
      alpha: 0,
      duration,
      ease: "Linear",
    });

    setTimeout(() => {
      toast.destroy();
    }, 1000);
  }

  private drawDot(x: number, y: number): void {
    this.dots.push({
      text: new Phaser.GameObjects.Text(this, x, y, this.userText?.text ?? "", {
        color: "#fff",
        fontSize: 20 * window.devicePixelRatio,
      }),
      x,
      y,
    });
    this.drawDotsAndConnect(this);
  }

  update(): void {
    // TODO
  }

  private drawDotsAndConnect(scene: GameScene) {
    if (!scene.graphics) return;

    scene.graphics.clear();

    // Draw dots
    scene.dots.forEach((dot) => {
      scene.graphics!.fillStyle(0xe3007c);
      scene.graphics!.fillCircle(dot.x, dot.y, 5 * window.devicePixelRatio);
    });

    // Draw text - make sure always on top of the dots
    scene.dots.forEach((dot) => {
      this.add.existing(dot.text);
    });

    // Connect dots if there are at least three
    if (scene.dots.length >= 3) {
      const hullPoints: any = hull(
        scene.dots.map((dot) => [dot.x, dot.y]) as number[][],
        Infinity
      );

      scene.polygon!.setTo(hullPoints);
      scene.graphics!.fillStyle(0xe3007c, 0.5);
      scene.graphics!.fillPoints(scene.polygon!.points, true);

      const score = scene.polygon!.calculateArea();
      const diff = Math.abs(scene.registry.values.score - Math.round(score));
      const newScore = Math.round(scene.registry.values.score + diff);
      console.log(diff);
      if (newScore > scene.registry.values.globalScore) {
        console.log("New record", newScore);
        scene.registry.set("globalScore", newScore);
        localStorage.setItem("globalScore", formatNumber(newScore) || "0");
        scene.globalBestScore!.setText(
          "Global Best: " + formatNumber(scene.registry.values.globalScore)
        );
      }

      scene.registry.values.score = newScore;
      this.drawTemporaryToast(
        `+${formatNumber(diff)}`,
        1000,
        ToastStatus.SUCCESS,
        window.innerWidth * 1.7,
        50
      );
      scene.scoreText!.setText(
        "Score: " + formatNumber(scene.registry.values.score)
      );
    } else {
      // draw a line between the dots
      this.graphics!.lineStyle(2 * window.devicePixelRatio, 0xe3007c);
      for (let i = 0; i < this.dots.length - 1; i++) {
        this.graphics!.lineBetween(
          this.dots[i].x,
          this.dots[i].y,
          this.dots[i + 1].x,
          this.dots[i + 1].y
        );
      }
    }
  }
}
