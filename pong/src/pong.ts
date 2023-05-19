import { getGameCanvas, getGameRenderingContext, initGameCanvas, fetchColorConstants } from "./init.js";
import { Position, Resolution } from "./types.js";
import { IDrawable } from "./interfaces.js";
import { centerPositionInRange, centerPositionInRangeX, centerPositionInRangeY, showError } from "./utils.js";
import { Transform } from "./transform.js";
import { Alignment, HorizontalAnchor, VerticalAnchor } from "./alignment.js";
import { Paddle } from "./paddle.js";
import { Ball } from "./ball.js";
import { Score } from "./score.js";
import { VerticalDashedLine } from "./net.js";
import { onKeyDown, onKeyUp } from "./input.handlers.js";

window.onload = function() {
    main();
}

let canvasBackgroundColor: string;

async function main() {
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
        showError(err.message)
    }
}

async function loadFont(font: string) {
    await document.fonts.load(font);
}

class Pong
{
    private static PADDLE_MARGIN: number = 25;
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

        //Input Logic (Estos escucharán por el websocket)
        document.addEventListener("keydown", (event) => {
            onKeyDown(event, this.leftPaddle, this.rightPaddle);
        })
        document.addEventListener("keyup", (event) => {
            onKeyUp(event, this.leftPaddle, this.rightPaddle);
        })
        
        // Render Logic
        // Leftmost objects are rendered first
        this.drawables = [ this.net, this.leftPaddle, this.rightPaddle, this.ball, this.leftScore, this.rightScore ];
        this.renderFrame = this.renderFrame.bind(this);
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
        let speed = 5;
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

    public resizeCanvas(newWindowWidth: number, newWindowHeight: number): void
    {
        const verticalMargin = 200;
        const availableHeight = newWindowHeight - verticalMargin;
        let newCanvasWidth = newWindowWidth * 0.7;
        let newCanvasHeight = newCanvasWidth / (this.referenceResolution.width / this.referenceResolution.height);

        if (newCanvasHeight > availableHeight)
        {
            newCanvasHeight = availableHeight;
            newCanvasWidth = newCanvasHeight * (this.referenceResolution.width / this.referenceResolution.height);
        }

        const scaleX = newCanvasWidth / this.referenceResolution.width;
        const scaleY = newCanvasHeight / this.referenceResolution.height;
        const prevCanvasResolution: Resolution = {
            width: this.canvas.width,
            height: this.canvas.height
        };
        this.canvas.width = Math.round(newCanvasWidth);
        this.canvas.height = Math.round(newCanvasHeight);
        this.drawables.forEach((drawable) => {
            drawable.onResizeCanvas(scaleX, scaleY, this.canvas, prevCanvasResolution);
        })
    }

    whoScored(): Score | null
    {
        let scoreRef: Score | null = null;
        let ballBoundingBox = this.ball.BoundingBoxPosition;
        if (ballBoundingBox.left < 0)
            scoreRef = this.rightScore;
        else if (ballBoundingBox.right > this.canvas.width)
            scoreRef = this.leftScore;
        return scoreRef;
    }

    clearScreen()
    {
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    physicsUpdate()
    {
        this.ball.move(this.canvas, [ this.leftPaddle, this.rightPaddle ]);
        this.leftPaddle.move(this.canvas);
        this.rightPaddle.move(this.canvas);
    }

    async scoreUpdate()
    {
        if (this.ball.IsInPlay)
        {
            let player = this.whoScored();
            if (player)
            {
                player.Score += 1;
                this.ball.IsInPlay = false;
                await new Promise(resolve => setTimeout(resolve, 1000));
                this.ball.IsInPlay = true;
                this.ball.resetBall(this.canvas);
            }
        }
    }

    renderFrame()
    {
        this.physicsUpdate();
        this.scoreUpdate();
        this.clearScreen();
        this.drawables.forEach((drawable) => {
            drawable.draw(this.ctx);
        })
        requestAnimationFrame(this.renderFrame);
    }
}