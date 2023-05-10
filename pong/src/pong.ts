import { getGameCanvas, getGameRenderingContext, initGameCanvas, fetchColorConstants } from "./init.js";
import { showError } from "./utils.js";
import { AspectRatio, IDrawable, Rectangle, Circle, Transform, Pong } from "./types.js";

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
        initGameCanvas(canvas, ctx, aspectRatio, canvasBackgroundColor);
        const pong = new Pong(canvas, ctx, aspectRatio, canvasBackgroundColor);
    }
    catch (err: any)
    {
        showError(err.message)
    }
}

window.onload = function() {
    main();
}

