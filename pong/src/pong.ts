import { getGameCanvas, getGameRenderingContext, initGameCanvas, fetchColorConstants } from "./init.js";
import { showError } from "./utils.js";
import { AspectRatio, IDrawable, PlayerInputs } from "./types.js";
import { Transform } from "./transform.js";
import { Rectangle } from "./rectangle.js";
import { Circle } from "./circle.js";
import { Text } from "./text.js";
import { VerticalDashedLine } from "./net.js";


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
        const aspectRatio: AspectRatio = { width: 858, height: 525 };
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

export class Pong
{
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private aspectRatio: AspectRatio;
    private backgroundColor: string;
    private net: VerticalDashedLine;
    private leftPaddle: Rectangle;
    private rightPaddle: Rectangle;
    private ball: Circle;
    private leftScore: Text;
    private rightScore: Text;
    private leftPlayerInputs: PlayerInputs = { up: false, down: false };
    private rightPlayerInputs: PlayerInputs = { up: false, down: false };
    private drawables: IDrawable[];

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
        this.net = new VerticalDashedLine(new Transform( {x: Math.round(this.canvas.width * 0.5), y: Math.round(this.canvas.height * 0.5) }, 1), "black", 5, this.canvas.height, 10);
        this.leftPaddle = new Rectangle(new Transform({ x: 100, y: Math.round(this.canvas.height * 0.5) }, 1), "black", 10, 100, 5, true);
        this.rightPaddle = new Rectangle(new Transform({ x: this.canvas.width - 100, y: Math.round(this.canvas.height * 0.5) }, 1), "black", 10, 100, 5, true);
        this.ball = new Circle(new Transform({ x: Math.round(this.canvas.width * 0.5), y: Math.round(this.canvas.height * 0.5) }, 1), "white", 1, 10, true);
        this.leftScore = new Text(new Transform({ x: Math.round(this.canvas.width * 0.25), y: Math.round(this.canvas.height * 0.2) }, 1), "0", "white", 75);
        this.rightScore = new Text(new Transform({ x: Math.round(this.canvas.width * 0.75), y: Math.round(this.canvas.height * 0.2) }, 1), "0", "white", 75);
        this.drawables = [ this.net, this.leftPaddle, this.rightPaddle, this.ball, this.leftScore, this.rightScore ];
        this.renderFrame = this.renderFrame.bind(this);
        document.addEventListener("keydown", (event) => {
            if (event.isComposing)
                return;
            if (event.code === "KeyW" && this.leftPlayerInputs.up == false)
            {
                this.leftPlayerInputs.up = true;
                this.leftPaddle.VelocityVectorY += -1;
            }
            else if (event.code === "KeyS" && this.leftPlayerInputs.down == false)
            {
                this.leftPlayerInputs.down = true;
                this.leftPaddle.VelocityVectorY += 1;
            }
        })
        document.addEventListener("keyup", (event) => {
            if (event.code === "KeyW" && this.leftPlayerInputs.up == true)
            {
                this.leftPlayerInputs.up = false;
                this.leftPaddle.VelocityVectorY += 1;
            }
            else if (event.code === "KeyS" && this.leftPlayerInputs.down == true)
            {
                this.leftPlayerInputs.down = false;
                this.leftPaddle.VelocityVectorY += -1;
            }
        })
        requestAnimationFrame(this.renderFrame);
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

    renderFrame()
    {
        this.physicsUpdate();
        this.clearScreen();
        this.drawables.forEach((drawable) => {
            drawable.draw(this.ctx);
        })
        requestAnimationFrame(this.renderFrame);
    }
}