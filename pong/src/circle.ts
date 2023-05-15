import { IDrawable } from "./interfaces.js";
import { Transform } from "./transform.js";

export class Circle implements IDrawable
{
    private isActive: boolean;
    private transform: Transform;
    private radius: number;
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

    public get HalfHeight(): number {
        return this.radius;
    }
    public get HalfWidth(): number {
        return this.radius;
    }

    public get Color(): string {
        return this.color;
    }
    public set Color(value: string) {
        //Color validation??
        this.color = value;
    }

    constructor(transform: Transform, color: string, radius: number, isActive: boolean = true)
    {
        this.transform = transform;
        this.color = color;
        this.radius = radius;
        this.isActive = isActive;
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
