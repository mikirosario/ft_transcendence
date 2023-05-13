import { Position } from "./types.js";
import { IDrawable } from "./interfaces.js";
import { Transform } from "./transform.js";

export class Text implements IDrawable
{
    private isActive: boolean;
    public transform: Transform;
    public text: string;
    public font: string;
    public fontSize: number;
    public color: string;

    public get IsActive(): boolean
    {
        return this.isActive;
    }
    public set IsActive(value: boolean)
    {
        this.isActive = value;
    }

    constructor(transform: Transform, text: string, color: string, fontSize: number, isActive: boolean = true)
    {
        this.transform = transform;
        this.text = text;
        this.color = color;
        this.fontSize = fontSize;
        this.font = `${fontSize}px press_start_2p, monospace`;
        this.isActive = isActive;
    }

    private getUpperLeftCorner(): Position
    {
        let halfWidth = Math.round(this.fontSize * 0.5);
        let halfHeight = Math.round(this.fontSize * 0.5);

        return { x: this.transform.position.x - halfWidth, y: this.transform.position.y - halfHeight};
    }

    public draw(ctx: CanvasRenderingContext2D): void
    {
        if (this.IsActive)
        {
            let upperLeftCornerPosition = this.getUpperLeftCorner();
            ctx.fillStyle = this.color;
            ctx.font = this.font;
            ctx.fillText(this.text, upperLeftCornerPosition.x, this.transform.position.y);
        }
    }
}