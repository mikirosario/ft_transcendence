import { Transform } from "./transform";
import { Ball } from "./ball";
import { Paddle } from "./paddle";
import { GameState, InputState, Position, Resolution } from "./types";
import { centerPositionInRange } from "./utils";
import { Player, PlayerID } from "./player";
import { IPhysicsObject } from "./interfaces";

export class Pong
{
    private static PADDLE_MARGIN: number = 25;
    private static MATCH_POINT: number = 3;
    private referenceResolution: Resolution = { width: 640, height: 480 };
    private collidables: IPhysicsObject[];
    private gameState: GameState;
    private ball: Ball;
    private leftPaddle: Paddle;
    private rightPaddle: Paddle;
    private leftPlayer: Player;
    private rightPlayer: Player;
    private scorer: Player | null = null;
    private reset: boolean = false;
    private gameOver: boolean = false;
    private winner: PlayerID = PlayerID.NONE;
  
    constructor()
    {
      this.ball = this.initBall();
      this.leftPaddle = this.initPaddle({ x: Pong.PADDLE_MARGIN, y: Math.round(this.referenceResolution.height * 0.5) });
      this.rightPaddle = this.initPaddle({ x: this.referenceResolution.width - Pong.PADDLE_MARGIN, y: Math.round(this.referenceResolution.height * 0.5) });
      this.leftPlayer = new Player(PlayerID.LEFT_PLAYER);
      this.rightPlayer = new Player(PlayerID.RIGHT_PLAYER);
      this.gameState = {
        ballPositionX: this.ball.Transform.position.x,
        ballPositionY: this.ball.Transform.position.y,
        leftPaddlePositionX: this.leftPaddle.Transform.position.x,
        leftPaddlePositionY: this.leftPaddle.Transform.position.y,
        rightPaddlePositionX: this.rightPaddle.Transform.position.x,
        rightPaddlePositionY: this.rightPaddle.Transform.position.y,

        leftPlayerScore: this.leftPlayer.Score,
        rightPlayerScore: this.rightPlayer.Score,
        ballReferenceSpeed: this.ball.ReferenceSpeed,
        ballVelocityVectorX: this.ball.VelocityVectorX,
        ballVelocityVectorY: this.ball.VelocityVectorY,
        leftPaddleReferenceSpeed: this.leftPaddle.ReferenceSpeed,
        leftPaddleVelocityVectorY: this.leftPaddle.VelocityVectorY,
        rightPaddleReferenceSpeed: this.rightPaddle.ReferenceSpeed,
        rightPaddleVelocityVectorY: this.rightPaddle.VelocityVectorY,
        reset: false,
        gameOver: false,
        winner: PlayerID.NONE,
        referenceWidth: this.referenceResolution.width,
        referenceHeight: this.referenceResolution.height
      };
    }

    // Initialize ball and paddles as before, but without any rendering context
  
    getGameState(): GameState
    {     
      return this.gameState;
    }

    applyRemoteInputs(leftInputs: InputState, rightInputs: InputState)
    {
      console.log("Applied inputs");
      this.leftPaddle.VelocityVectorY += leftInputs.paddleVelocityVectorY;
      this.rightPaddle.VelocityVectorY += rightInputs.paddleVelocityVectorY;
    }


    async physicsUpdate()
    {
      this.reset = false;
      // Update paddle positions based on input
      this.leftPaddle.move(this.referenceResolution);
      this.rightPaddle.move(this.referenceResolution);
  
      // Update ball position and handle collisions
      this.ball.move(this.referenceResolution, [ this.leftPaddle, this.rightPaddle ]);

      if (this.ball.IsInPlay)
      {
        const scorer = this.whoScored();
        if (scorer)
        {
          scorer.Score += 1;
          this.ball.IsInPlay = false;
          // 1 second pause, to give the ball time to move out of view
          await new Promise(resolve => setTimeout(resolve, 1000));
          this.ball.IsInPlay = true;
          this.ball.resetBall(this.referenceResolution);
          if (scorer.Score === Pong.MATCH_POINT)
          {
            this.gameOver = true;
            this.winner = scorer.ID;
          }
        }
      }
    }

    updateGameState()
    {
      if (!this.gameState.gameOver)
      {
        this.physicsUpdate();
        this.gameState.ballPositionX = this.ball.Transform.position.x,
        this.gameState.ballPositionY = this.ball.Transform.position.y,
        this.gameState.leftPaddlePositionX = this.leftPaddle.Transform.position.x,
        this.gameState.leftPaddlePositionY = this.leftPaddle.Transform.position.y,
        this.gameState.rightPaddlePositionX = this.rightPaddle.Transform.position.x,
        this.gameState.rightPaddlePositionY = this.rightPaddle.Transform.position.y,
        this.gameState.leftPlayerScore = this.leftPlayer.Score;
        this.gameState.rightPlayerScore = this.rightPlayer.Score;
        this.gameState.ballReferenceSpeed = this.ball.ReferenceSpeed;
        this.gameState.ballVelocityVectorX = this.ball.VelocityVectorX;
        this.gameState.ballVelocityVectorY = this.ball.VelocityVectorY;
        this.gameState.leftPaddleReferenceSpeed = this.leftPaddle.ReferenceSpeed;
        this.gameState.leftPaddleVelocityVectorY = this.leftPaddle.VelocityVectorY;
        this.gameState.rightPaddleReferenceSpeed = this.rightPaddle.ReferenceSpeed;
        this.gameState.rightPaddleVelocityVectorY = this.rightPaddle.VelocityVectorY;
        this.gameState.gameOver = this.gameOver;
        this.gameState.reset = this.reset;
        this.gameState.winner = this.winner;
        this.gameState.referenceWidth = this.referenceResolution.width;
        this.gameState.referenceHeight = this.referenceResolution.height;
      }
    }
  
    private initBall(): Ball
    {
        let position: Position = {
          x: centerPositionInRange(0, this.referenceResolution.width),
          y: centerPositionInRange(0, this.referenceResolution.height)
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
        let ballBoundingBox = this.ball.BoundingBoxPosition;
        if (ballBoundingBox.left < 0)
            scorer = this.rightPlayer;
        else if (ballBoundingBox.right > this.referenceResolution.width)
            scorer = this.leftPlayer;
        return scorer;
    }
  }
  