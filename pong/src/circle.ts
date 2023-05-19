import { IDrawable } from "./interfaces.js";
import { PositionRatio } from "./position.ratio.js";
import { Transform } from "./transform.js";
import { Resolution, DrawableOptions } from "./types.js";

export class Circle implements IDrawable
{
    private isActive: boolean;
    private transform: Transform;
    private radius: number;
    private color: string;
    private originalRadius: number;
    
    public get IsActive(): boolean {
        return this.isActive;
    }
    public set IsActive(value: boolean) {
        this.isActive = value;
    }

    public get Color(): string {
        return this.color;
    }
    public set Color(value: string) {
        //Color validation??
        this.color = value;
    }

    public get Transform(): Transform {
        return this.transform;
    }
    public set Transform(value: Transform) {
        this.transform = value;
    }

    public get Height(): number {
        return Math.round(this.radius * 2);
    }
    public set Height(value: number) {
        this.radius = Math.round(this.radius * 0.5);
    }

    public get Width(): number {
        return Math.round(this.radius * 2);
    }
    public set Width(value: number) {
        this.radius = Math.round(this.radius * 0.5);
    }

    public get HalfHeight(): number {
        return this.radius;
    }

    public get HalfWidth(): number {
        return this.radius;
    }

    private get OriginalRadius(): number {
        return this.originalRadius;
    }

    constructor(transform: Transform, color: string, radius: number, options: DrawableOptions = {} )
    {
        this.transform = transform;
        this.color = color;
        this.radius = radius;
        this.isActive = options.SetActive === undefined ? true : options.SetActive;
        this.originalRadius = radius;
    }

    public onResizeCanvas(scaleX: number, scaleY: number, canvas: HTMLCanvasElement,  prevCanvasResolution: Resolution): void
    {
        const scale = Math.min(scaleX, scaleY);
        const prevPositionRatioX = new PositionRatio(this.Transform.position.x, prevCanvasResolution.width);
        const prevPositionRatioY = new PositionRatio(this.Transform.position.y, prevCanvasResolution.height);
        this.radius = Math.round(this.originalRadius * scale);
        this.transform.position.x = prevPositionRatioX.getResizedPosition(canvas.width);
        this.transform.position.y = prevPositionRatioY.getResizedPosition(canvas.height);
    }

    public draw(ctx: CanvasRenderingContext2D): void
    {
        if (this.IsActive)
        {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.transform.position.x, this.transform.position.y, this.radius, 0, Math.PI * 2, false);
            ctx.closePath();
            ctx.fill();
        }
    }
}
