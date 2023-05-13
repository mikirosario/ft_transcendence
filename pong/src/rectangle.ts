import { Position, BoundingBox, PlayerInputs } from "./types.js";
import { IDrawable, IPhysicsObject } from "./interfaces.js";
import { Transform } from "./transform.js";

export class Rectangle implements IDrawable, IPhysicsObject
{
    private isActive: boolean;
    private playerInputs: PlayerInputs;
    private speed: number;
    private velocityVectorX: number;
    private velocityVectorY: number;
    private transform: Transform;
    private isColliderActive: boolean;
    private width: number;
    private height: number;
    private color: string;

    public get IsActive(): boolean
    {
        return this.isActive;
    }
    public set IsActive(value: boolean)
    {
        this.isActive = value;
    }
    public get PlayerInputs(): PlayerInputs
    {
        return this.playerInputs;
    }
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
    public get IsColliderActive(): boolean
    {
        return  this.IsActive && this.isColliderActive;
    }
    public set IsColliderActive(value: boolean)
    {
        this.isColliderActive = value;
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
    public set VelocityVectorX(value: number) {
        this.velocityVectorX = value;
    }
    public get VelocityVectorY() : number {
        return this.velocityVectorY;
    }
    public set VelocityVectorY(value: number) {
        this.velocityVectorY = value;
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
            top: nextPosition.y - this.HalfHeight,
            bottom: nextPosition.y + this.HalfHeight,
            right: nextPosition.x + this.HalfWidth,
            left: nextPosition.x - this.HalfWidth
        }
    }
    private get HalfHeight(): number
    {
        return Math.round(this.height * 0.5);
    }
    private get HalfWidth(): number
    {
        return Math.round(this.width * 0.5);
    }

    constructor(transform: Transform, color: string, width: number, height: number, speed: number, isColliderActive: boolean = false, isActive: boolean = true)
    {
        this.transform = transform;
        this.color = color;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.isColliderActive = isColliderActive;
        this.velocityVectorX = 0;
        this.velocityVectorY = 0;
        this.playerInputs = { up: false, down: false };
        this.isActive = isActive;
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
        if (this.IsColliderActive)
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

    public move(canvas: HTMLCanvasElement, collidables: IPhysicsObject[] = [])
    {
        if (this.IsActive && !this.willCollideCanvas(canvas))
        {
            this.Transform.position.x += this.VelocityVectorX;
            this.Transform.position.y += this.VelocityVectorY;
        }
    }

    public draw(ctx: CanvasRenderingContext2D): void
    {
        if (this.IsActive)
        {
            let upperLeftCornerPosition = this.getUpperLeftCorner();
            ctx.fillStyle = this.color;
            ctx.fillRect(upperLeftCornerPosition.x, upperLeftCornerPosition.y, this.width, this.height);
        }
    }
}
