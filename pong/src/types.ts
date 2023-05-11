import { ColorConstants } from "./colors.constants";
import { initGameCanvas } from "./init";

export type AspectRatio = { width: number, height: number };

export type Position = { x: number, y: number };

export type PhysicsObject = IMoveable & ICollidable;

export interface IDrawable
{
    draw(ctx: CanvasRenderingContext2D): void;
}

export interface IMoveable
{
    Transform: Transform;
    Speed: number;
    VelocityVectorX: number;
    VelocityVectorY: number;
    NextPosition: Position;
    move(): void;
}

export interface ICollider
{
    
}

export interface ICollidable
{
    Transform: Transform;
    IsCollidable: boolean;
    willCollideCanvas(canvas: HTMLCanvasElement): boolean;
    bounceY(): void;
    bounceX(): void;
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

export class Rectangle implements IDrawable, IMoveable, ICollidable
{
    private speed: number;
    private velocityVectorX: number;
    private velocityVectorY: number;
    private transform: Transform;
    private isCollidable: boolean;
    private width: number;
    private height: number;
    private color: string;

    public get Speed() : number {
        return this.speed;
    }
    public set Speed(value: number) {
        this.speed = value;
    }
    public get Transform(): Transform
    {
        return this.transform;
    }
    public set Transform(value: Transform)
    {
        this.transform = value;
    }
    public get IsCollidable(): boolean
    {
        return this.isCollidable;
    }
    public set IsCollidable(value: boolean)
    {
        this.isCollidable = value;
    }
    public get Width(): number
    {
        return this.width;
    }
    public set Width(value: number)
    {
        this.width = value;
    }
    public get Height() : number
    {
        return this.height;
    }
    public set Height(value : number)
    {
        this.height = value;
    }
    public get VelocityVectorX() : number
    {
        return this.velocityVectorX;
    }
    public get VelocityVectorY() : number {
        return this.velocityVectorY;
    }
    public get NextPosition(): Position
    {
        return {
            x: this.Transform.position.x + this.VelocityVectorX,
            y: this.Transform.position.y + this.VelocityVectorY
        };
    }

    constructor(transform: Transform, color: string, width: number, height: number, speed: number, isCollidable: boolean = false)
    {
        this.transform = transform;
        this.color = color;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.isCollidable = isCollidable;
        this.velocityVectorX = 0;
        this.velocityVectorY = 0;
    }

    public bounceY()
    {
        this.velocityVectorY = 0;
    }

    public bounceX()
    {
        this.velocityVectorX = 0;
    }

    private getUpperLeftCorner(): Position
    {
        let halfWidth = Math.round(this.width * 0.5);
        let halfHeight = Math.round(this.height * 0.5);

        return { x: this.transform.position.x - halfWidth, y: this.transform.position.y - halfHeight};
    }

    public willCollideCanvas(canvas: HTMLCanvasElement): boolean
    {
        let willCollide: boolean = false;
        if (this.isCollidable)
        {
            let halfHeight = Math.round(this.height * 0.5);
            let nextPosition = this.NextPosition;
            willCollide = (
                nextPosition.y + halfHeight > canvas.height
                || nextPosition.y - halfHeight < 0
                );
        }
        return willCollide;
    }

    public move()
    {
        this.Transform.position.x += this.velocityVectorX;
        this.Transform.position.y += this.VelocityVectorY;
    }

    public draw(ctx: CanvasRenderingContext2D): void
    {
        let upperLeftCornerPosition = this.getUpperLeftCorner();
        ctx.fillStyle = "black";
        ctx.fillRect(upperLeftCornerPosition.x, upperLeftCornerPosition.y, this.width, this.height);
    }
}

export class Circle implements IDrawable, IMoveable, ICollidable
{
    private transform: Transform;
    private isCollidable: boolean;
    private speed: number;
    private velocityVectorX: number;
    private velocityVectorY: number;
    private radius: number;
    private color: string;
    
    public get Speed(): number
    {
        return this.speed;
    }
    public set Speed(value: number)
    {
        this.speed = value;
        this.velocityVectorX = value;
        this.velocityVectorY = value;
    }
    public get Transform(): Transform
    {
        return this.transform;
    }
    public set Transform(value: Transform)
    {
        this.transform = value;
    }
    public get IsCollidable(): boolean
    {
        return this.isCollidable;
    }
    public set IsCollidable(value: boolean)
    {
        this.isCollidable = value;
    }
    public get VelocityVectorX() : number
    {
        return this.velocityVectorX;
    }
    public get VelocityVectorY() : number
    {
        return this.velocityVectorY;
    }
    public get NextPosition(): Position
    {
        return {
            x: this.Transform.position.x + this.VelocityVectorX,
            y: this.Transform.position.y + this.VelocityVectorY
        };
    }

    constructor(transform: Transform, color: string, speed: number, radius: number, isCollidable: boolean = false)
    {
        this.transform = transform;
        this.color = color;
        this.radius = radius;
        this.speed = speed;
        this.velocityVectorX = speed;
        this.velocityVectorY = speed;
        this.isCollidable = isCollidable;
    }

    public bounceY()
    {
        this.velocityVectorY *= -1;
    }

    public bounceX()
    {
        this.velocityVectorX *= -1;
    }

    public move()
    {
        this.Transform.position.x += this.velocityVectorX;
        this.Transform.position.y += this.VelocityVectorY;
    }

    public rectangleCollision(rectangle: Rectangle): boolean {
        let rectangleCenter = rectangle.Transform.position;

        let closestX = Math.max(rectangleCenter.x - rectangle.Width / 2, Math.min(this.Transform.position.x, rectangleCenter.x + rectangle.Width / 2));
        let closestY = Math.max(rectangleCenter.y - rectangle.Height / 2, Math.min(this.Transform.position.y, rectangleCenter.y + rectangle.Height / 2));
    
        let dx = this.Transform.position.x - closestX;
        let dy = this.Transform.position.y - closestY;
    
        return (dx * dx + dy * dy) < (this.radius * this.radius);
    }

    public willCollideCanvas(canvas: HTMLCanvasElement): boolean
    {
        let willCollide: boolean = false;
        if (this.isCollidable)
        {
            let nextPosition = this.NextPosition;
            willCollide = (
                nextPosition.y + this.radius > canvas.height
                || nextPosition.y - this.radius < 0
                );
        }
        return willCollide;
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

export class Text implements IDrawable
{
    public transform: Transform;
    public text: string;
    public font: string;
    public fontSize: number;
    public color: string;

    constructor(transform: Transform, text: string, color: string, fontSize: number)
    {
        this.transform = transform;
        this.text = text;
        this.color = color;
        this.fontSize = fontSize;
        this.font = `${fontSize}px press_start_2p, monospace`;
    }

    private getUpperLeftCorner(): Position
    {
        let halfWidth = Math.round(this.fontSize * 0.5);
        let halfHeight = Math.round(this.fontSize * 0.5);

        return { x: this.transform.position.x - halfWidth, y: this.transform.position.y - halfHeight};
    }

    public draw(ctx: CanvasRenderingContext2D): void
    {
        let upperLeftCornerPosition = this.getUpperLeftCorner();
        ctx.fillStyle = this.color;
        ctx.font = this.font;
        ctx.fillText(this.text, upperLeftCornerPosition.x, this.transform.position.y);
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
    private leftScore: Text;
    private rightScore: Text;
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
        this.leftPaddle = new Rectangle(new Transform({ x: 100, y: Math.round(this.canvas.height * 0.5) }, 1), "black", 10, 100, 5);
        this.rightPaddle = new Rectangle(new Transform({ x: this.canvas.width - 100, y: Math.round(this.canvas.height * 0.5) }, 1), "black", 10, 100, 5);
        this.ball = new Circle(new Transform({ x: Math.round(this.canvas.width * 0.5), y: Math.round(this.canvas.height * 0.5) }, 1), "white", 1, 10, true);
        this.leftScore = new Text(new Transform({ x: Math.round(this.canvas.width * 0.25), y: Math.round(this.canvas.height * 0.2) }, 1), "0", "white", 75);
        this.rightScore = new Text(new Transform({ x: Math.round(this.canvas.width * 0.75), y: Math.round(this.canvas.height * 0.2) }, 1), "0", "white", 75);
        this.drawables = [ this.net, this.leftPaddle, this.rightPaddle, this.ball, this.leftScore, this.rightScore ];
        this.renderFrame = this.renderFrame.bind(this);
        requestAnimationFrame(this.renderFrame);
    }

    clearScreen()
    {
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    update(ball: PhysicsObject | null = null)
    {
        //apply inputs
        //apply physics
        if (ball != null)
        {
            //moves bottom-right by default; randomize, maybe
            if (ball.willCollideCanvas(this.ctx.canvas))
                ball.bounceY();
            ball.move();
        }
    }

    renderFrame()
    {
        this.update(this.ball);
        this.clearScreen();
        this.drawables.forEach((drawable) => {
            drawable.draw(this.ctx);
        })
        requestAnimationFrame(this.renderFrame);
    }
}