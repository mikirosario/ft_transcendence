import { Position } from "./types.js";
import { IDrawable } from "./interfaces.js";
import { Transform } from "./transform.js";
import { AspectRatio } from "./aspect.ratio.js";

export class VerticalDashedLine implements IDrawable
{
    private isActive: boolean;
    private transform: Transform;
    private height: number;
    private width: number;
    private dashHeight: number;
    private color: string;
    private aspectRatio: AspectRatio;
    private dashAspectRatio: AspectRatio;

    public get IsActive(): boolean
    {
        return this.isActive;
    }
    public set IsActive(value: boolean)
    {
        this.isActive = value;
    }

    public get Width(): number {
        return this.width;
    }
    public set Width(value: number) {
        this.width = value;
        this.dashHeight = Math.round(value / this.DashAspectRatio.toNumber());
        this.height = Math.round(value / this.AspectRatio.toNumber());
    }

    public get Height(): number {
        return this.height;
    }
    public set Height(value: number) {
        this.height = value;
        this.width = Math.round(value * this.AspectRatio.toNumber());
    }

    private get AspectRatio(): AspectRatio {
        return this.aspectRatio;
    }
    private set AspectRatio(value: AspectRatio) {
        this.aspectRatio = value;
    }

    private get DashAspectRatio(): AspectRatio {
        return this.dashAspectRatio;
    }
    private set DashAspectRatio(value: AspectRatio) {
        this.dashAspectRatio = value;
    }

    private get DistToNextDash(): number {
        return this.dashHeight * 2;
    }


    constructor(transform: Transform, color: string, width: number, height: number, dashHeight: number, isActive: boolean = true)
    {
        this.transform = transform;
        this.color = color;
        this.width = width;
        this.height = height;
        this.dashHeight = dashHeight;
        this.isActive = isActive;
        this.aspectRatio = new AspectRatio(width, height);
        this.dashAspectRatio = new AspectRatio(width, dashHeight);
    }

    private getUpperLeftCorner(): Position
    {
        let halfWidth = Math.round(this.width * 0.5);
        let halfHeight = Math.round(this.height * 0.5);

        return { x: this.transform.position.x - halfWidth, y: this.transform.position.y - halfHeight};
    }

    public draw(ctx: CanvasRenderingContext2D): void
    {
        if (this.IsActive)
        {
            let upperLeftCornerPosition = this.getUpperLeftCorner();
            for (let i = 0; i <= this.height; i+=this.DistToNextDash)
            {
                ctx.fillStyle = this.color;
                ctx.fillRect(upperLeftCornerPosition.x, upperLeftCornerPosition.y + i, this.width, this.dashHeight);
            }
        }
    }
}