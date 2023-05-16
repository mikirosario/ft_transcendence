import { Position, Plane } from "./types.js";
import { IDrawable } from "./interfaces.js";
import { Transform } from "./transform.js";
import { AspectRatio } from "./aspect.ratio.js";

export class Rectangle implements IDrawable
{
    private isActive: boolean;
    private transform: Transform;
    private width: number;
    private height: number;
    private color: string;
    private aspectRatio: AspectRatio;

    private originalWidth: number;
    private originalHeight: number;
    private relativeX: number;
    private relativeY: number;

    public get IsActive(): boolean {
        return this.isActive;
    }
    public set IsActive(value: boolean) {
        this.isActive = value;
    }

    public get Transform(): Transform {
        return this.transform;
    }
    public set Transform(value: Transform) {
        this.transform = value;
    }

    public get Width(): number {
        return this.width;
    }
    public set Width(value: number) {
        this.width = value;
        //this.height = Math.round(value / this.AspectRatio.toNumber());
    }

    public get Height() : number {
        return this.height;
    }
    public set Height(value : number) {
        this.height = value;
        //this.width = Math.round(value * this.AspectRatio.toNumber());
    }

    public get HalfHeight(): number {
        return Math.round(this.Height * 0.5);
    }
    public get HalfWidth(): number {
        return Math.round(this.Width * 0.5);
    }

    private get AspectRatio(): AspectRatio {
        return this.aspectRatio;
    }
    private set AspectRatio(value: AspectRatio) {
        this.aspectRatio = value;
    }

    constructor(transform: Transform, color: string, width: number, height: number, canvas: HTMLCanvasElement, isActive: boolean = true)
    {
        this.transform = transform;
        this.color = color;
        this.width = width;
        this.height = height;
        this.isActive = isActive;
        this.aspectRatio = new AspectRatio(this.Width, this.Height);

        this.originalWidth = width;
        this.originalHeight = height;
        this.relativeX = this.transform.position.x / canvas.width;
        this.relativeY = this.transform.position.y / canvas.height;
    }

    private getUpperLeftCorner(): Position
    {
        return {
            x: this.transform.position.x - this.HalfWidth,
            y: this.transform.position.y - this.HalfHeight
        };
    }

    public onResizeCanvas(scaleX: number, scaleY: number, canvas: HTMLCanvasElement, prevCanvasDimensions: Plane): void
    {
        this.width = Math.round(this.originalWidth * scaleX);
        this.height = Math.round(this.originalHeight * scaleY);
        const relativeY = this.transform.position.y / prevCanvasDimensions.height;
        this.transform.position.x = Math.round(this.relativeX * canvas.width);
        this.transform.position.y = Math.round(relativeY * canvas.height);
    }

    public draw(ctx: CanvasRenderingContext2D): void
    {
        if (this.IsActive)
        {
            let upperLeftCornerPosition = this.getUpperLeftCorner();
            ctx.fillStyle = this.color;
            ctx.fillRect(upperLeftCornerPosition.x, upperLeftCornerPosition.y, this.Width, this.Height);
        }
    }
}
