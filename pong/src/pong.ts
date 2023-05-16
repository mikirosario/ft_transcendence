import { getGameCanvas, getGameRenderingContext, initGameCanvas, fetchColorConstants } from "./init.js";
import { Plane } from "./types.js";
import { IDrawable } from "./interfaces.js";
import { showError } from "./utils.js";
import { AspectRatio } from "./aspect.ratio.js";
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
        const aspectRatio: AspectRatio = new AspectRatio(640, 480);
        const colorConstants = await fetchColorConstants();
        canvasBackgroundColor = colorConstants.canvasBackgroundColor;
        initGameCanvas(canvas, ctx, aspectRatio, canvasBackgroundColor);
        const pong = new Pong(canvas, ctx, aspectRatio, canvasBackgroundColor);
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
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private aspectRatio: AspectRatio;
    private backgroundColor: string;
    private net: VerticalDashedLine;
    private leftPaddle: Paddle;
    private rightPaddle: Paddle;
    private ball: Ball;
    private leftScore: Score;
    private rightScore: Score;
    private drawables: IDrawable[];

    private originalCanvasWidth: number;
    private originalCanvasHeight: number;

    constructor(
        canvas: HTMLCanvasElement,
        context: CanvasRenderingContext2D,
        aspectRatio: AspectRatio,
        backgroundColor: string)
    {
        this.canvas = canvas;
        this.ctx = context;
        this.aspectRatio = aspectRatio;
        this.backgroundColor = backgroundColor;
        this.net = new VerticalDashedLine(new Transform( {x: Math.round(this.canvas.width * 0.5), y: Math.round(this.canvas.height * 0.5) }, 1), "black", 5, this.canvas.height, 10, this.canvas);
        this.leftPaddle = new Paddle(new Transform({ x: 100, y: Math.round(this.canvas.height * 0.5) }, 1), "black", 10, 100, 5, this.canvas, true);
        this.rightPaddle = new Paddle(new Transform({ x: this.canvas.width - 100, y: Math.round(this.canvas.height * 0.5) }, 1), "black", 10, 100, 5, this.canvas, true);
        this.ball = new Ball(new Transform({ x: Math.round(this.canvas.width * 0.5), y: Math.round(this.canvas.height * 0.5) }, 1), "white", 1, 10, this.canvas, true);
        this.leftScore = new Score(new Alignment(HorizontalAnchor.LEFT, VerticalAnchor.TOP), "pongmaster", "white", 20);
        this.rightScore = new Score(new Alignment(HorizontalAnchor.RIGHT, VerticalAnchor.TOP), "ponginator", "white", 20);
        this.drawables = [ this.net, this.leftPaddle, this.rightPaddle, this.ball, this.leftScore, this.rightScore ];
        this.originalCanvasWidth =aspectRatio.Width;
        this.originalCanvasHeight = aspectRatio.Height;
        this.renderFrame = this.renderFrame.bind(this);
        document.addEventListener("keydown", (event) => {
            onKeyDown(event, this.leftPaddle, this.rightPaddle);
        })
        document.addEventListener("keyup", (event) => {
            onKeyUp(event, this.leftPaddle, this.rightPaddle);
        })
        this.resizeCanvas(window.innerWidth, window.innerHeight);
        window.addEventListener('resize', () => {
            this.resizeCanvas(window.innerWidth, window.innerHeight);
        });
        requestAnimationFrame(this.renderFrame);
    }

    public resizeCanvas(newWindowWidth: number, newWindowHeight: number): void
    {
        const verticalMargin = 200;
        const availableHeight = newWindowHeight - verticalMargin;
        const windowAspectRatio = new AspectRatio(newWindowWidth, availableHeight);
        let newCanvasWidth = newWindowWidth * 0.7;
        let newCanvasHeight = newCanvasWidth / (this.originalCanvasWidth / this.originalCanvasHeight);

        if (newCanvasHeight > availableHeight)
        {
            newCanvasHeight = availableHeight;
            newCanvasWidth = newCanvasHeight * (this.originalCanvasWidth / this.originalCanvasHeight);
        }

        const scaleX = newCanvasWidth / this.originalCanvasWidth;
        const scaleY = newCanvasHeight / this.originalCanvasHeight;
        const prevCanvasDimensions: Plane = {
            width: this.canvas.width,
            height: this.canvas.height
        };
        this.canvas.width = Math.round(newCanvasWidth);
        this.canvas.height = Math.round(newCanvasHeight);
        this.drawables.forEach((drawable) => {
            drawable.onResizeCanvas(scaleX, scaleY, this.canvas, prevCanvasDimensions);
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