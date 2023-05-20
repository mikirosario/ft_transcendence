import { ColorConstants } from "./colors.constants.js"
import { Resolution } from "./types.js";

export function getGameCanvas(canvasElement: HTMLElement | null): HTMLCanvasElement {
    if (!canvasElement || !(canvasElement instanceof HTMLCanvasElement)) { 
      throw new Error('Canvas element with id "pong" could not be loaded.');
    }
    return canvasElement as HTMLCanvasElement;
}

export function getGameRenderingContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
    let context: CanvasRenderingContext2D | null = canvas.getContext("2d");
    if (!context || !(context instanceof CanvasRenderingContext2D)) {
        throw new Error('2D canvas rendering context could not be loaded.');
    }
    return context as CanvasRenderingContext2D;
}

export async function fetchColorConstants(): Promise<ColorConstants> {
    const response = await fetch("./colors.constants.json");
    const colorConstants = await response.json();
    return colorConstants;
}

export function initGameCanvas(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, resolution: Resolution, canvasColor: string) {
    canvas.width = resolution.width;
    canvas.height = resolution.height;
}
