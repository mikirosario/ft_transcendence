import { DrawableOptions, Position, Resolution } from "./types.js";
import { IDrawable } from "./interfaces.js";
import { Transform } from "./transform.js";
import { PositionRatio } from "./position.ratio.js";

export class Rectangle implements IDrawable
{
    private isActive: boolean;
    private transform: Transform;
    private width: number;
    private height: number;
    private color: string;

    private originalWidth: number;
    private originalHeight: number;
    private originalPositionRatioX: PositionRatio;

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

    public get HalfWidth(): number {
        return Math.round(this.Width * 0.5);
    }

    public get HalfHeight(): number {
        return Math.round(this.Height * 0.5);
    }

    public get Color(): string {
        return this.color;
    }
    public set Color(value: string) {
        this.color = value;
    }

    private get OriginalWidth(): number {
        return this.originalWidth;
    }

    private get OriginalHeight(): number {
        return this.originalHeight;
    }

    private get OriginalPositionRatioX(): PositionRatio {
        return this.originalPositionRatioX;
    }

    constructor(transform: Transform, color: string, width: number, height: number, referenceResolution: Resolution, options: DrawableOptions = {})
    {
        this.transform = transform;
        this.color = color;
        this.width = width;
        this.height = height;
        this.isActive = options.SetActive === undefined ? true : options.SetActive;
        this.originalWidth = width;
        this.originalHeight = height;
        this.originalPositionRatioX = new PositionRatio(this.Transform.position.x, referenceResolution.width);
    }

    private getUpperLeftCorner(): Position
    {
        return {
            x: this.transform.position.x - this.HalfWidth,
            y: this.transform.position.y - this.HalfHeight
        };
    }

    public onResizeCanvas(scaleX: number, scaleY: number, canvas: HTMLCanvasElement, prevCanvasResolution: Resolution): void
    {
        this.width = Math.round(this.originalWidth * scaleX);
        this.height = Math.round(this.originalHeight * scaleY);
        const prevPositionRatioY = new PositionRatio(this.Transform.position.y, prevCanvasResolution.height);
        this.transform.position.x = this.OriginalPositionRatioX.getResizedPosition(canvas.width);
        this.transform.position.y = prevPositionRatioY.getResizedPosition(canvas.height);
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
