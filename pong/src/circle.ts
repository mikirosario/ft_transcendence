import { Position, BoundingBox } from "./types.js";
import { IDrawable, IPhysicsObject } from "./interfaces.js";
import { Transform } from "./transform.js";

export class Circle implements IDrawable, IPhysicsObject
{
    private isActive: boolean;
    private transform: Transform;
    private isColliderActive: boolean;
    private speed: number;
    private velocityVectorX: number;
    private velocityVectorY: number;
    private radius: number;
    private color: string;
    
    public get IsActive(): boolean
    {
        return this.isActive;
    }
    public set IsActive(value: boolean)
    {
        this.isActive = value;
    }
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
    public get IsColliderActive(): boolean
    {
        return this.IsActive && this.isColliderActive;
    }
    public set IsColliderActive(value: boolean)
    {
        this.isColliderActive = value;
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
    public get BoundingBoxNextPosition(): BoundingBox
    {
        let nextPosition = this.NextPosition;
        return {
            top: nextPosition.y - this.radius,
            bottom: nextPosition.y + this.radius,
            right: nextPosition.x + this.radius,
            left: nextPosition.x - this.radius
        }
    }

    constructor(transform: Transform, color: string, speed: number, radius: number, isColliderActive: boolean = false, isActive: boolean = true)
    {
        this.transform = transform;
        this.color = color;
        this.radius = radius;
        this.speed = speed;
        this.velocityVectorX = -speed;
        this.velocityVectorY = speed;
        this.isColliderActive = isColliderActive;
        this.isActive = isActive;
    }

    public bounceY()
    {
        this.velocityVectorY *= -1;
    }

    public bounceX()
    {
        this.velocityVectorX *= -1;
    }

    public move(canvas: HTMLCanvasElement, physObjects: IPhysicsObject[] = [])
    {
        if (this.IsActive)
        {
            if (this.willCollideCanvas(canvas))
                this.bounceY();
            physObjects.forEach((physObject) => {
                if (this.willCollide(physObject))
                    this.bounceX();
            })
            this.Transform.position.x += this.velocityVectorX;
            this.Transform.position.y += this.VelocityVectorY;
        }
    }

    public willCollideCanvas(canvas: HTMLCanvasElement): boolean
    {
        let willCollide: boolean = false;
        if (this.IsColliderActive)
        {
            let nextPosition = this.NextPosition;
            willCollide = (
                nextPosition.y + this.radius > canvas.height
                || nextPosition.y - this.radius < 0
                );
        }
        return willCollide;
    }

    willCollide(collidable: IPhysicsObject): boolean
    {
        let willCollide: boolean = false;
        if (this.IsColliderActive)
        {
            let thisBoundingBox = this.BoundingBoxNextPosition;
            let otherBoundingBox = collidable.BoundingBoxNextPosition;
            willCollide = !(
                otherBoundingBox.right <= thisBoundingBox.left
                || otherBoundingBox.top >= thisBoundingBox.bottom
                || otherBoundingBox.left >= thisBoundingBox.right
                || otherBoundingBox.bottom <= thisBoundingBox.top
            )
        }
        return willCollide;
    }

    public draw(ctx: CanvasRenderingContext2D): void
    {
        if (this.IsActive)
        {
            ctx.fillStyle = "white";
            ctx.beginPath();
            ctx.arc(this.transform.position.x, this.transform.position.y, this.radius, 0, Math.PI * 2, false);
            ctx.closePath();
            ctx.fill();
        }
    }
}