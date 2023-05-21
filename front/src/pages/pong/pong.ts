import { getGameCanvas, getGameRenderingContext, initGameCanvas, fetchColorConstants } from "./init";
import { Position, Resolution, ScaleFactors } from "./types";
import { IDrawable } from "./interfaces";
import { centerPositionInRange, centerPositionInRangeX, centerPositionInRangeY, showError } from "./utils";
import { Transform } from "./transform";
import { Alignment, HorizontalAnchor, VerticalAnchor } from "./alignment";
import { Text } from "./text";
import { Paddle } from "./paddle";
import { Ball } from "./ball";
import { Score } from "./score";
import { VerticalDashedLine } from "./net";
import { onKeyDown, onKeyUp } from "./input.handlers";



let canvasBackgroundColor: string;

export async function main() {
    try
    {
        await loadFont('10pt "press_start_2p"');
        const canvasElement: HTMLElement | null = document.getElementById('pong');
        const canvas = getGameCanvas(canvasElement);
        const ctx = getGameRenderingContext(canvas);
        const referenceResolution: Resolution = { width: 640, height: 480 };
        const colorConstants = await fetchColorConstants();
        canvasBackgroundColor = colorConstants.canvasBackgroundColor;
        initGameCanvas(canvas, ctx, referenceResolution, canvasBackgroundColor);
        const pong = new Pong(canvas, ctx, referenceResolution, canvasBackgroundColor);
    }
    catch (err: any)
    {
        showError(err.message);
    }
}

async function loadFont(font: string) {
    await document.fonts.load(font);
}

class Pong
{
    private static PADDLE_MARGIN: number = 25;
    private static MATCH_POINT: number = 3;
    // Esto se pillará por API REST con credenciales del usuario
    private leftPlayerNick: string = "pongFu";
    // Esto se pillará por API REST con credenciales de1 usuario
    private rightPlayerNick: string = "pongAmo"
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private referenceResolution: Resolution;
    private backgroundColor: string;
    private net: VerticalDashedLine;
    private leftPaddle: Paddle;
    private rightPaddle: Paddle;
    private ball: Ball;
    private leftScore: Score;
    private rightScore: Score;
    private gameOverText: Text;
    private drawables: IDrawable[];

    constructor(
        canvas: HTMLCanvasElement,
        context: CanvasRenderingContext2D,
        referenceResolution: Resolution,
        backgroundColor: string)
    {
        // Canvas Info
        this.canvas = canvas;
        this.ctx = context;
        this.referenceResolution = referenceResolution;
        this.backgroundColor = backgroundColor;

        // Game Object Instantiation
        this.net = this.initNet();
        this.ball = this.initBall();
        this.leftScore = this.initScore(HorizontalAnchor.LEFT, VerticalAnchor.TOP, this.leftPlayerNick);
        this.rightScore = this.initScore(HorizontalAnchor.RIGHT, VerticalAnchor.TOP, this.rightPlayerNick);
        this.leftPaddle = this.initPaddle({
            x: Pong.PADDLE_MARGIN,
            y: centerPositionInRange(0, this.canvas.height)
        });
        this.rightPaddle = this.initPaddle({
            x: this.canvas.width - Pong.PADDLE_MARGIN,
            y: centerPositionInRange(0, this.canvas.height)
        })
        this.gameOverText = this.initGameOverText(HorizontalAnchor.MIDDLE, VerticalAnchor.MIDDLE);

        //Input Logic (Estos escucharán por el websocket)
        document.addEventListener("keydown", (event) => {
            onKeyDown(event, this.leftPaddle, this.rightPaddle);
        })
        document.addEventListener("keyup", (event) => {
            onKeyUp(event, this.leftPaddle, this.rightPaddle);
        })
        
        // Render Logic
        // Leftmost objects are rendered first
        this.drawables = [ this.gameOverText, this.net, this.leftPaddle, this.rightPaddle, this.ball, this.leftScore, this.rightScore ];
        this.renderFrame = this.renderFrame.bind(this);
        this.renderGameOverFrame = this.renderGameOverFrame.bind(this);
        this.resizeCanvas(window.innerWidth, window.innerHeight);
        window.addEventListener('resize', () => {
            this.resizeCanvas(window.innerWidth, window.innerHeight);
        });

        //Game Loop
        requestAnimationFrame(this.renderFrame);
    }

    private initNet(): VerticalDashedLine
    {
        let position: Position = { x: 0, y: 0};
        centerPositionInRangeX(position, 0, this.canvas.width);
        centerPositionInRangeY(position, 0, this.canvas.height);
        let transform: Transform = new Transform(position);
        let color = "black";
        let width = 5;
        let height = this.canvas.height;
        let dashHeight = 10;
        return new VerticalDashedLine(transform, color, width, height, dashHeight, this.referenceResolution);
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

    private initBall(): Ball
    {
        let position: Position = {
            x: centerPositionInRange(0, this.canvas.width),
            y: centerPositionInRange(0, this.canvas.height)
        }
        let transform: Transform = new Transform(position);
        let color = "white";
        let speed = 1;
        let radius = 10;
        return new Ball(transform, color, speed, radius, { SetCollider: true });
    }

    private initScore(horizontalAnchor: HorizontalAnchor, verticalAnchor: VerticalAnchor, playerNick: string)
    {
        let alignment: Alignment = new Alignment(horizontalAnchor, verticalAnchor);
        let color = "white";
        let fontSize = 20;
        return new Score(alignment, playerNick, color, fontSize);
    }

    private initGameOverText(horizontalAnchor: HorizontalAnchor, verticalAnchor: VerticalAnchor)
    {
        let alignment: Alignment = new Alignment(horizontalAnchor, verticalAnchor);
        let color = "white";
        let fontSize = 40;
        return new Text(alignment, "", color, fontSize, { SetActive: false });
    }

    private isGameOver(): boolean
    {
        // Additional game over logic here, such as by timeout
        return this.leftScore.Score == Pong.MATCH_POINT || this.rightScore.Score == Pong.MATCH_POINT;
    }
    
    private whoScored(): Score | null
    {
        let scoreRef: Score | null = null;
        let ballBoundingBox = this.ball.BoundingBoxPosition;
        if (ballBoundingBox.left < 0)
        scoreRef = this.rightScore;
        else if (ballBoundingBox.right > this.canvas.width)
        scoreRef = this.leftScore;
        return scoreRef;
    }

    private whoWon(): Score | undefined
    {
        let winner: Score | undefined = undefined;
        if (this.leftScore.Score == Pong.MATCH_POINT)
            winner = this.leftScore;
        else if (this.rightScore.Score == Pong.MATCH_POINT)
            winner = this.rightScore;
        return winner;
    }

    private clearScreen()
    {
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    private onGameOver()
    {
        let winner: Score | undefined = this.whoWon();            
        this.gameOverText.Text = `${ winner ? winner.PlayerName : "Nobody" } WINS`;
        this.gameOverText.IsActive = true;
        this.drawables.splice(1, this.drawables.length);
    }
    
    private physicsUpdate()
    {
        this.ball.move(this.canvas, [ this.leftPaddle, this.rightPaddle ]);
        this.leftPaddle.move(this.canvas);
        this.rightPaddle.move(this.canvas);
    }
    
    private async scoreUpdate()
    {
        if (this.ball.IsInPlay)
        {
            let player = this.whoScored();
            if (player)
            {
                player.Score += 1;
                this.ball.IsInPlay = false;
                // 1 second pause, to give the ball time to move out of view
                await new Promise(resolve => setTimeout(resolve, 1000));
                this.ball.IsInPlay = true;
                let currentResolution = {
                    width: this.canvas.width,
                    height: this.canvas.height
                }
                let scaleFactors = this.getScaleFactors(currentResolution, this.referenceResolution);
                this.ball.updateSpeed(scaleFactors, this.ball.ReferenceSpeed + 1);
                this.ball.resetBall(this.canvas);
            }
        }
    }

    private getScaleFactors(currentCanvasResolution: Resolution, referenceCanvasResolution: Resolution): ScaleFactors
    {
        return {
            scaleX: currentCanvasResolution.width / referenceCanvasResolution.width,
            scaleY: currentCanvasResolution.height / referenceCanvasResolution.height
        }
    }

    private resizeCanvas(newWindowWidth: number, newWindowHeight: number): void
    {
        // Calculate new canvas resolution, applying layout constraints
        const verticalMargin = 200;
        const availableHeight = newWindowHeight - verticalMargin;
        let newCanvasWidth = newWindowWidth * 0.7;
        let newCanvasHeight = newCanvasWidth / (this.referenceResolution.width / this.referenceResolution.height);
        if (newCanvasHeight > availableHeight)
        {
            newCanvasHeight = availableHeight;
            newCanvasWidth = newCanvasHeight * (this.referenceResolution.width / this.referenceResolution.height);
        }
        const newCanvasResolution = {
            width: Math.round(newCanvasWidth),
            height: Math.round(newCanvasHeight)
        }

        // Save previous canvas resolution
        const prevCanvasResolution: Resolution = {
            width: this.canvas.width,
            height: this.canvas.height
        };

        // Calculate scale factors
        const scaleFactors: ScaleFactors = this.getScaleFactors(newCanvasResolution, this.referenceResolution);

        // Apply new canvas resolution
        this.canvas.width = newCanvasResolution.width;
        this.canvas.height = newCanvasResolution.height;

        // Rescale all drawables on canvas
        this.drawables.forEach((drawable) => {
            drawable.onResizeCanvas(scaleFactors, newCanvasResolution, prevCanvasResolution);
        })
    }

    private renderFrame()
    {
        if (!this.isGameOver())
        {
            // Physics update will probably need to be behind a sync check once websocket implemented
            this.physicsUpdate();
            this.scoreUpdate();
            this.clearScreen();
            this.drawables.forEach((drawable) => {
                drawable.draw(this.ctx);
            })
            requestAnimationFrame(this.renderFrame);
        }
        else
        {
            this.onGameOver();
            requestAnimationFrame(this.renderGameOverFrame);
        }
    }

    private renderGameOverFrame()
    {
        this.clearScreen();
        this.drawables.forEach((drawable) => {
            drawable.draw(this.ctx);
        })
        requestAnimationFrame(this.renderGameOverFrame);
    }
}

export default Pong;
