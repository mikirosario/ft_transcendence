import { Position } from "./types.js";
import { IDrawable } from "./interfaces.js";
import { Transform } from "./transform.js";

export class Rectangle implements IDrawable
{
    private isActive: boolean;
    private transform: Transform;
    private width: number;
    private height: number;
    private color: string;

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
    }

    public get Height() : number {
        return this.height;
    }
    public set Height(value : number) {
        this.height = value;
    }

    public get HalfHeight(): number {
        return Math.round(this.Height * 0.5);
    }
    public get HalfWidth(): number {
        return Math.round(this.Width * 0.5);
    }

    constructor(transform: Transform, color: string, width: number, height: number, isActive: boolean = true)
    {
        this.transform = transform;
        this.color = color;
        this.width = width;
        this.height = height;
        this.isActive = isActive;
    }

    private getUpperLeftCorner(): Position
    {
        return {
            x: this.transform.position.x - this.HalfWidth,
            y: this.transform.position.y - this.HalfHeight
        };
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
