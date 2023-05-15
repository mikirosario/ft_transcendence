import { Position, BoundingBox } from "./types.js";
import { IDrawable, IPhysicsObject } from "./interfaces.js";
import { Transform } from "./transform.js";
import { normalizeRange, isInRange } from "./utils.js";

export class Circle implements IDrawable, IPhysicsObject
{
    private isActive: boolean;
    private isInPlay: boolean;
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
    public get IsInPlay(): boolean
    {
        return this.IsActive && this.isInPlay;
    }
    public set IsInPlay(value: boolean)
    {
        this.isInPlay = value;
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
    public get HalfHeight(): number
    {
        return this.radius;
    }
    public get HalfWidth(): number
    {
        return this.radius;
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
    public get BoundingBoxPosition(): BoundingBox
    {
        return {
            top: this.Transform.position.y - this.radius,
            bottom: this.Transform.position.y + this.radius,
            right: this.Transform.position.x + this.radius,
            left: this.Transform.position.x - this.radius
        }
    }
    private set VelocityVectorX(value: number)
    {
        this.velocityVectorX = value;
    }
    private set VelocityVectorY(value: number)
    {
        this.velocityVectorY = value;
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

        this.isInPlay = true;
    }

    public bounceY()
    {
        this.VelocityVectorY *= -1;
    }

    public bounceX()
    {
        this.VelocityVectorX *= -1;
    }

    public bounceBack(physObject: IPhysicsObject)
    {
        const QUARTER_CIRCLE_IN_RADIANS = Math.PI * 0.25;
        const originalDirectionX = Math.sign(this.VelocityVectorX);
        const collisionPointY = this.whereWillCollideY(physObject);
        const isSideCollision = isInRange(collisionPointY, -1, 1);
        const bounceAngleInRadians = collisionPointY * QUARTER_CIRCLE_IN_RADIANS;
        const newVelocityVectorX = this.Speed * Math.cos(bounceAngleInRadians);

        if (isSideCollision) // Side collisions invert the X direction of motion
            this.VelocityVectorX = newVelocityVectorX * -originalDirectionX;
        else                 // Top or bottom collisions continue the X direction of motion
            this.VelocityVectorX = newVelocityVectorX * originalDirectionX;
        // Update the Y component of the velocity
        this.VelocityVectorY = this.Speed * Math.sin(bounceAngleInRadians);
    }

    public move(canvas: HTMLCanvasElement, physObjects: IPhysicsObject[] = [])
    {
        if (this.IsActive)
        {
            if (this.willCollideCanvas(canvas))
                this.bounceY();
            physObjects.forEach((physObject) => {
                if (this.willCollide(physObject))
                    this.bounceBack(physObject);
            })
            this.Transform.position.x += this.VelocityVectorX;
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

    public willCollide(collidable: IPhysicsObject): boolean
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

    public resetBall(canvas: HTMLCanvasElement) // Todo: Move to derived Ball class
    {
        this.Transform.position = {
            x: Math.round(canvas.width * 0.5),
            y: Math.round(canvas.height * 0.5)
        }
        this.VelocityVectorX = -this.VelocityVectorX;
    }

    public draw(ctx: CanvasRenderingContext2D): void
    {
        if (this.IsActive)
        {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.transform.position.x, this.transform.position.y, this.radius, 0, Math.PI * 2, false);
            ctx.closePath();
            ctx.fill();
        }
    }
    
    /*
    ** Returns a normalized float from -1 to 1 indicating the point of collision
    ** on the 'collidable' Y axis where 0 is the middle point.
    **
    ** Returned values above 1 or below -1 are out of bounds and will not
    ** collide on this axis.
    */
    private whereWillCollideY(collidable: IPhysicsObject): number
    {
        let halfOffsetRange = collidable.HalfHeight;
        return normalizeRange(this.NextPosition.y - collidable.NextPosition.y, -halfOffsetRange, halfOffsetRange);
    }

    /*
    ** Returns a normalized float from -1 to 1 indicating the point of collision
    ** on the 'collidable' X axis where 0 is the middle point.
    **
    ** Returned values above 1 or below -1 are out of bounds and will not
    ** collide on this axis.
    */
    private whereWillCollideX(collidable: IPhysicsObject): number
    {
        let halfOffsetRange = collidable.HalfWidth;
        return normalizeRange(this.NextPosition.x - collidable.NextPosition.x, -halfOffsetRange, halfOffsetRange);
    }
}