import { IDrawable, Position } from "./types.js";
import { Transform } from "./transform.js";

export class VerticalDashedLine implements IDrawable
{
    private isActive: boolean;
    private transform: Transform;
    private width: number;
    private height: number;
    private dashHeight: number;
    private color: string;

    public get IsActive(): boolean
    {
        return this.isActive;
    }
    public set IsActive(value: boolean)
    {
        this.isActive = value;
    }

    constructor(transform: Transform, color: string, width: number, height: number, dashHeight: number, isActive: boolean = true)
    {
        this.transform = transform;
        this.color = color;
        this.width = width;
        this.height = height;
        this.dashHeight = dashHeight;
        this.isActive = isActive;
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
            for (let i = 0; i <= this.height; i+=15)
            {
                ctx.fillStyle = "black";
                ctx.fillRect(upperLeftCornerPosition.x, upperLeftCornerPosition.y + i, this.width, this.dashHeight);
            }
        }
    }
}