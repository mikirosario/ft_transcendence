import { ColorConstants } from "./colors.constants";
import { initGameCanvas } from "./init";

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

    private getUpperLeftCorner(): Position
    {
        let halfWidth = Math.round(this.width * 0.5);
        let halfHeight = Math.round(this.height * 0.5);

        return { x: this.transform.position.x - halfWidth, y: this.transform.position.y - halfHeight};
    }

    public draw(ctx: CanvasRenderingContext2D): void
    {
        let upperLeftCornerPosition = this.getUpperLeftCorner();
        ctx.fillStyle = "black";
        ctx.fillRect(upperLeftCornerPosition.x, upperLeftCornerPosition.y, this.width, this.height);
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
        ctx.arc(this.transform.position.x, this.transform.position.y, this.radius, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fill();
    }
}

export class VerticalDashedLine implements IDrawable
{
    private transform: Transform;
    private width: number;
    private height: number;
    private dashHeight: number;
    private color: string;

    constructor(transform: Transform, color: string, width: number, height: number, dashHeight: number)
    {
        this.transform = transform;
        this.color = color;
        this.width = width;
        this.height = height;
        this.dashHeight = dashHeight;
    }

    private getUpperLeftCorner(): Position
    {
        let halfWidth = Math.round(this.width * 0.5);
        let halfHeight = Math.round(this.height * 0.5);

        return { x: this.transform.position.x - halfWidth, y: this.transform.position.y - halfHeight};
    }

    public draw(ctx: CanvasRenderingContext2D): void
    {
        let upperLeftCornerPosition = this.getUpperLeftCorner();
        for (let i = 0; i <= this.height; i+=15)
        {
            ctx.fillStyle = "black";
            ctx.fillRect(upperLeftCornerPosition.x, upperLeftCornerPosition.y + i, this.width, this.dashHeight);
        }
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

export class Pong
{
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private aspectRatio: AspectRatio;
    private backgroundColor: string;
    private net: VerticalDashedLine;
    private leftPaddle: Rectangle;
    private rightPaddle: Rectangle;
    private ball: Circle;
    private drawables: IDrawable[];

    constructor(
        canvas: HTMLCanvasElement,
        context: CanvasRenderingContext2D,
        aspectRatio: AspectRatio,
        backgroundColor: string)
    {
        this.canvas = canvas;
        this.ctx = context;
        this.aspectRatio = aspectRatio;
        this.backgroundColor = backgroundColor;
        this.net = new VerticalDashedLine(new Transform( {x: Math.round(this.canvas.width * 0.5), y: Math.round(this.canvas.height * 0.5) }, 1), "black", 5, this.canvas.height, 10);
        this.leftPaddle = new Rectangle(new Transform({ x: 100, y: Math.round(this.canvas.height * 0.5) }, 1), "black", 10, 100);
        this.rightPaddle = new Rectangle(new Transform({ x: this.canvas.width - 100, y: Math.round(this.canvas.height * 0.5) }, 1), "black", 10, 100);
        this.ball = new Circle(new Transform({ x: Math.round(this.canvas.width * 0.5), y: Math.round(this.canvas.height * 0.5) }, 1), "white", 10);
        this.drawables = [ this.net, this.leftPaddle, this.rightPaddle, this.ball ];
        this.renderFrame = this.renderFrame.bind(this);
        requestAnimationFrame(this.renderFrame);
    }

    clearScreen()
    {
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    renderFrame()
    {
        this.clearScreen();
        this.drawables.forEach((drawable) => {
            drawable.draw(this.ctx);
        requestAnimationFrame(this.renderFrame)
    })
}

}