import { Position } from "./types.js";
import { IDrawable, IUIObject } from "./interfaces.js";
import { Alignment, HorizontalAnchor, VerticalAnchor } from "./alignment.js";
import { Transform } from "./transform.js";
import { centerPositionInRangeX, centerPositionInRangeY } from "./utils.js";

export class Text implements IDrawable, IUIObject
{
    private isActive: boolean;
    private alignment: Alignment;
    private transform: Transform;
    private text: string;
    private fontSize: number;
    private color: string;
    private font: string;

    public get IsActive(): boolean {
        return this.isActive;
    }
    public set IsActive(value: boolean) {
        this.isActive = value;
    }

    private get Transform(): Transform {
        return this.transform;
    }

    public get Text(): string
    {
        return this.text;
    }
    public set Text(value: string)
    {
        this.text = value;
    }

    public get Alignment(): Alignment {
        return this.alignment;
    }
    public set Alignment(value: Alignment) {
        this.alignment = value;
    }

    public get FontSize(): number {
        return this.fontSize;
    }
    public set FontSize(value: number) {
        this.fontSize = value;
    }

    public get Color(): string {
        return this.color;
    }
    public set Color(value: string) {
        this.color = value;
    }

    public get Height(): number {
        return this.FontSize;
    }

    public get Width(): number {
        return Math.round(this.FontSize * this.Text.length);
    }

    public get HalfHeight(): number {
        return Math.round(this.Height * 0.5);
    }

    public get HalfWidth(): number {
        return Math.round(this.Width * 0.5);
    }

    constructor(alignment: Alignment, text: string, color: string, fontSize: number, isActive: boolean = true)
    {
        this.alignment = alignment;
        this.transform = new Transform();
        this.text = text;
        this.color = color;
        this.fontSize = fontSize;
        this.font = `${fontSize}px press_start_2p, monospace`;
        this.isActive = isActive;
    }

    private alignmentToPosition(canvas: HTMLCanvasElement): Position
    {
        let newPosition: Position = { x: 0, y: 0};
        switch (this.Alignment.Horizontal)
        {
            case HorizontalAnchor.LEFT:
                centerPositionInRangeX(newPosition, 0, Math.round(canvas.width * 0.5));
                break;
            case HorizontalAnchor.RIGHT:
                centerPositionInRangeX(newPosition, Math.round(canvas.width * 0.5), canvas.width);
                break;
            default:
                centerPositionInRangeX(newPosition, 0, canvas.width);
        }
        switch (this.Alignment.Vertical)
        {
            case VerticalAnchor.TOP:
                centerPositionInRangeY(newPosition, 0, Math.round(canvas.height * 0.25));
                break;
            case VerticalAnchor.BOTTOM:
                centerPositionInRangeY(newPosition, Math.round(canvas.height * 0.75), canvas.height);
                break;
            default:
                centerPositionInRangeY(newPosition, 0, canvas.height);
        }

        return newPosition;
    }

    public draw(ctx: CanvasRenderingContext2D): void
    {
        if (this.IsActive)
        {
            this.Transform.position = this.alignmentToPosition(ctx.canvas);
            ctx.fillStyle = this.color;
            ctx.textAlign = "center";
            ctx.font = this.font;
            ctx.fillText(this.text, this.Transform.position.x, this.Transform.position.y);
        }
    }
}
