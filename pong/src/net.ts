import { DrawableOptions, Position, Resolution } from "./types.js";
import { IDrawable } from "./interfaces.js";
import { Transform } from "./transform.js";
import { PositionRatio } from "./position.ratio.js";

export class VerticalDashedLine implements IDrawable
{
    private isActive: boolean;
    private transform: Transform;
    private height: number;
    private width: number;
    private dashHeight: number;
    private color: string;
    private originalWidth: number;
    private originalHeight: number;
    private originalDashHeight: number;
    private originalPositionRatioX: PositionRatio;
    private originalPositionRatioY: PositionRatio;

    public get IsActive(): boolean
    {
        return this.isActive;
    }
    public set IsActive(value: boolean)
    {
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

    public get Height(): number {
        return this.height;
    }
    public set Height(value: number) {
        this.height = value;
    }
    
    public get HalfWidth(): number {
        return Math.round(this.Width * 0.5);
    }

    public get HalfHeight(): number {
        return Math.round(this.Height * 0.5);
    }

    public get DashHeight(): number {
        return this.dashHeight;
    }
    public set DashHeight(value: number) {
        this.dashHeight = value;
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

    private get OriginalDashHeight(): number {
        return this.originalDashHeight;
    }

    private get OriginalPositionRatioX(): PositionRatio {
        return this.originalPositionRatioX;
    }

    private get OriginalPositionRatioY(): PositionRatio {
        return this.originalPositionRatioY;
    }

    private get DistToNextDash(): number {
        return this.DashHeight * 2;
    }


    constructor(transform: Transform, color: string, width: number, height: number, dashHeight: number, referenceResolution: Resolution, options: DrawableOptions = {})
    {
        this.transform = transform;
        this.color = color;
        this.width = width;
        this.height = height;
        this.dashHeight = dashHeight;
        this.isActive = options.SetActive === undefined ? true : options.SetActive;
        this.originalHeight = height;
        this.originalWidth = width;
        this.originalDashHeight = dashHeight;
        this.originalPositionRatioX = new PositionRatio(this.Transform.position.x, referenceResolution.width);
        this.originalPositionRatioY = new PositionRatio(this.Transform.position.y, referenceResolution.height);
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
        this.Width = Math.round(this.OriginalWidth * scaleX);
        this.Height = Math.round(this.OriginalHeight * scaleY);
        this.DashHeight = Math.round(this.OriginalDashHeight * scaleY);
        this.Transform.position.x = this.OriginalPositionRatioX.getResizedPosition(canvas.width);
        this.Transform.position.y = this.OriginalPositionRatioY.getResizedPosition(canvas.height);
    }

    public draw(ctx: CanvasRenderingContext2D): void
    {
        if (this.IsActive)
        {
            let upperLeftCornerPosition = this.getUpperLeftCorner();
            for (let i = 0; i <= this.Height; i+=this.DistToNextDash)
            {
                ctx.fillStyle = this.Color;
                ctx.fillRect(upperLeftCornerPosition.x, upperLeftCornerPosition.y + i, this.Width, this.DashHeight);
            }
        }
    }
}