import { Transform } from "./transform";
import { Ball } from "./ball";
import { Paddle } from "./paddle";
import { GameState, InputState, Position, Resolution } from "./types";
import { centerPositionInRange } from "./utils";
import { Player, PlayerID } from "./player";
import { IPhysicsObject } from "./interfaces";

export class Pong
{
    private static readonly PADDLE_MARGIN: number = 25;
    private static readonly MATCH_POINT: number = 3;
    private static readonly ReferenceResolution: Resolution = { width: 640, height: 480 };
    private gameOver: boolean = false;
    private winner: PlayerID = PlayerID.NONE;
    private leftPlayer: Player = new Player(PlayerID.LEFT_PLAYER);
    private rightPlayer: Player = new Player(PlayerID.RIGHT_PLAYER);
    private ball: Ball = Pong.initBall();
    private leftPaddle: Paddle = Pong.initPaddle({
      x: Pong.PADDLE_MARGIN,
      y: centerPositionInRange(0, Pong.ReferenceResolution.height)
    });
    private rightPaddle: Paddle = Pong.initPaddle({
      x: Pong.ReferenceResolution.width - Pong.PADDLE_MARGIN,
      y: centerPositionInRange(0, Pong.ReferenceResolution.height)
    });
    private gameState: GameState;
  
    constructor()
    {
      this.gameState = this.initGameState();
    }

    private static initBall(): Ball
    {
        let position: Position = {
          x: centerPositionInRange(0, Pong.ReferenceResolution.width),
          y: centerPositionInRange(0, Pong.ReferenceResolution.height)
        }
        let transform: Transform = new Transform(position);
        let color = "white";
        let speed = 1;
        let radius = 10;
        return new Ball(transform, color, speed, radius, { SetCollider: true });
    }

    private static initPaddle(position: Position): Paddle
    {
        let transform: Transform = new Transform(position);
        let color = "black";
        let width = 10;
        let height = 100;
        let speed = 0.75;
        return new Paddle(transform, color, width, height, speed, Pong.ReferenceResolution, { SetCollider: true });
    }

    private initGameState(): GameState
    {
      let gameState: GameState = {
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
        gameOver: false,
        winner: PlayerID.NONE,
        referenceWidth: Pong.ReferenceResolution.width,
        referenceHeight: Pong.ReferenceResolution.height
      }
      return gameState;
    }
    
    private physicsUpdate()
    {
      // Update paddle positions based on input
      this.leftPaddle.move(Pong.ReferenceResolution);
      this.rightPaddle.move(Pong.ReferenceResolution);
  
      // Update ball position and handle collisions
      this.ball.move(Pong.ReferenceResolution, [ this.leftPaddle, this.rightPaddle ]);
    }

    private async scoreUpdate()
    {
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
          this.ball.resetBall(Pong.ReferenceResolution);
          if (scorer.Score === Pong.MATCH_POINT)
          {
            this.gameOver = true;
            this.winner = scorer.ID;
          }
        }
      }
    }
    
    private gameStateUpdate()
    {
      if (!this.gameState.gameOver)
      {
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
        this.gameState.winner = this.winner;
        this.gameState.referenceWidth = Pong.ReferenceResolution.width;
        this.gameState.referenceHeight = Pong.ReferenceResolution.height;
      }
    }

    private whoScored(): Player | null
    {
        let scorer: Player | null = null;
        let ballBoundingBox = this.ball.BoundingBoxPosition;
        if (ballBoundingBox.left < 0)
            scorer = this.rightPlayer;
        else if (ballBoundingBox.right > Pong.ReferenceResolution.width)
            scorer = this.leftPlayer;
        return scorer;
    }
    
    public applyRemoteInputs(leftInputs: InputState, rightInputs: InputState)
    {
      console.log("Applied inputs");
      this.leftPaddle.VelocityVectorY += leftInputs.paddleVelocityVectorY;
      this.rightPaddle.VelocityVectorY += rightInputs.paddleVelocityVectorY;
    }

    public getGameState(): GameState
    {     
      return this.gameState;
    }

    public setGameState()
    {
      this.physicsUpdate();
      this.scoreUpdate();
      this.gameStateUpdate();
    }

  }
  