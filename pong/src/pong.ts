import { getGameCanvas, getGameRenderingContext, initGameCanvas, fetchColorConstants } from "./init.js";
import { showError } from "./utils.js";

async function main() {
    try
    {
        const canvasElement: HTMLElement | null = document.getElementById('pong');
        const canvas = getGameCanvas(canvasElement);
        const ctx = getGameRenderingContext(canvas);
        const aspectRatio = 858 / 525; // Original aspect ratio (width/height)
        const colorConstants = await fetchColorConstants();
        const canvasBackgroundColor = colorConstants.canvasBackgroundColor;
        //initGameCanvas(canvas, ctx, aspectRatio, canvasBackgroundColor);
    }
    catch (err: any)
    {
        showError(err.message)
    }
}

main();
