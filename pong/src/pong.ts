import { getGameCanvas, getGameRenderingContext, initGameCanvas, fetchColorConstants } from "./init.js";
import { showError } from "./utils.js";
import { AspectRatio, IDrawable, Rectangle, Circle, Transform } from "./types.js";

let canvasBackgroundColor: string;

async function main() {
    try
    {
        const canvasElement: HTMLElement | null = document.getElementById('pong');
        const canvas = getGameCanvas(canvasElement);
        const ctx = getGameRenderingContext(canvas);
        const aspectRatio: AspectRatio = { width: 858, height: 525 };
        const colorConstants = await fetchColorConstants();
        canvasBackgroundColor = colorConstants.canvasBackgroundColor;
        const leftPaddle = new Rectangle(new Transform({ x: 0, y: 0 }, 1), "black", 10, 100);
        const circle = new Circle(new Transform({ x: 200, y: 200 }, 0), "white", 10);
        const drawables: IDrawable[] = [ leftPaddle, circle ];
        initGameCanvas(canvas, ctx, aspectRatio, canvasBackgroundColor);
        setInterval(() => { renderFrame(drawables, ctx, canvas, canvasBackgroundColor); }, 1000);
    }
    catch (err: any)
    {
        showError(err.message)
    }
}

function clearScreen(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, background: string)
{
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function renderFrame(drawables: IDrawable[], ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, background: string)
{
    clearScreen(ctx, canvas, background);
    drawables.forEach((drawable) => {
        drawable.draw(ctx);
    })
}



window.onload = function() {
    main();
}

