import { Transform } from "./transform";
import { Ball } from "./ball";
import { Paddle } from "./paddle";
import { Position, Resolution } from "./types";
import { centerPositionInRange } from "./utils";
import { Player } from "./player";
import { IPhysicsObject } from "./interfaces";

class Pong
{
    private static PADDLE_MARGIN: number = 25;
    private static MATCH_POINT: number = 3;
    private referenceResolution: Resolution;
  
    private gameState: {
      ball: Ball,
      leftPaddle: Paddle,
      rightPaddle: Paddle,
      leftPlayer: Player,
      rightPlayer: Player,
      gameOver: boolean,
      winner: Player | null,
      referenceResolution: Resolution,
      collidables: IPhysicsObject[]
    };
  
    constructor() {
      this.gameState = {
        ball: this.initBall(),
        leftPaddle: this.initPaddle({ x: Pong.PADDLE_MARGIN, y: 0 }),
        rightPaddle: this.initPaddle({ x: 1 - Pong.PADDLE_MARGIN, y: 0 }),
        leftPlayer: new Player(),
        rightPlayer: new Player(),
        gameOver: false,
        winner: null,
        referenceResolution: { width: 640, height: 480 },
        collidables: [ this.gameState.leftPaddle, this.gameState.rightPaddle, this.gameState.ball ]
      };
    }
  
    // Initialize ball and paddles as before, but without any rendering context
  
    getGameState() {
      return this.gameState;
    }
  
    updateGameState() {
      // Update paddle positions based on input
      this.gameState.leftPaddle.move(this.gameState.referenceResolution);
      this.gameState.rightPaddle.move(this.gameState.referenceResolution);
  
      // Update ball position and handle collisions
      this.gameState.ball.move(this.gameState.referenceResolution, this.gameState.collidables);
  
      // Handle scoring
      const scorer = this.whoScored();
      if (scorer)
      {
        scorer.Score += 1;
        if (scorer.Score === Pong.MATCH_POINT)
        {
          this.gameState.gameOver = true;
          this.gameState.winner = scorer;
        }
      }
    }
  
    private initBall(): Ball
    {
        let position: Position = {
            x: centerPositionInRange(0, this.gameState.referenceResolution.width),
            y: centerPositionInRange(0, this.gameState.referenceResolution.height)
        }
        let transform: Transform = new Transform(position);
        let color = "white";
        let speed = 1;
        let radius = 10;
        return new Ball(transform, color, speed, radius, { SetCollider: true });
    }

    private initPaddle(position: Position): Paddle
    {
        let transform: Transform = new Transform(position);
        let color = "black";
        let width = 10;
        let height = 100;
        let speed = 0.75;
        return new Paddle(transform, color, width, height, speed, this.referenceResolution, { SetCollider: true });
    }

    private whoScored(): Player | null
    {
        let scorer: Player | null = null;
        let ballBoundingBox = this.gameState.ball.BoundingBoxPosition;
        if (ballBoundingBox.left < 0)
            scorer = this.gameState.rightPlayer;
        else if (ballBoundingBox.right > this.gameState.referenceResolution.width)
            scorer = this.gameState.leftPlayer;
        return scorer;
    }
  }
  