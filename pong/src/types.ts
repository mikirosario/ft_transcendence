export type AspectRatio = { width: number, height: number };

export type Position = { x: number, y: number };

export interface IDrawable
{
    draw(ctx: CanvasRenderingContext2D): void;
}

export class Transform
{
    public position: Position;
    public rotation: number;

    constructor(position: Position, rotation: number)
    {
        this.position = position;
        this.rotation = rotation;
    }
}

export class Rectangle implements IDrawable
{
    private transform: Transform;
    private width: number;
    private height: number;
    private color: string;

    constructor(transform: Transform, color: string, width: number, height: number)
    {
        this.transform = transform;
        this.color = color;
        this.width = width;
        this.height = height;
    }

    public draw(ctx: CanvasRenderingContext2D): void
    {
        ctx.fillStyle = "black";
        ctx.fillRect(100, 200, this.width, this.height);
    }
}

export class Circle implements IDrawable
{
    private transform: Transform;
    private radius: number;
    private color: string;

    constructor(transform: Transform, color: string, radius: number)
    {
        this.transform = transform;
        this.color = color;
        this.radius = radius;
    }

    public draw(ctx: CanvasRenderingContext2D): void
    {
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(300, 350, this.radius, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fill();
    }
}

export class Text
{
    public transform: Transform;
    public text: string;
    public font: string = "75px fantasy";
    public color: string;

    constructor(transform: Transform, text: string, color: string, radius: number)
    {
        this.transform = transform;
        this.text = text;
        this.color = color;
    }

    public draw(ctx: CanvasRenderingContext2D): void
    {
        ctx.fillStyle = this.color;
        ctx.font = this.font;
        ctx.fillText(this.text, this.transform.position.x, this.transform.position.y);
    }
}