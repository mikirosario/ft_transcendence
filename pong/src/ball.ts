import { Circle } from "./circle.js";
import { Transform } from "./transform.js";
import { IPhysicsObject } from "./interfaces.js";
import { BoundingBox, Resolution, Position, RigidBodyOptions } from "./types.js";
import { isInRange, normalizeRange } from "./utils.js";

export class Ball extends Circle implements IPhysicsObject
{
    private isColliderActive: boolean;
    private isInPlay: boolean;
    private speed: number;
    private velocityVectorX: number;
    private velocityVectorY: number;
    private originalSpeed: number;

    public get IsColliderActive(): boolean {
        return this.IsActive && this.isColliderActive;
    }
    public set IsColliderActive(value: boolean) {
        this.isColliderActive = value;
    }

    public get IsInPlay(): boolean {
        return this.IsActive && this.isInPlay;
    }
    public set IsInPlay(value: boolean) {
        this.isInPlay = value;
    }

    public get Speed(): number {
        return this.speed;
    }
    public set Speed(value: number) {
        this.speed = value;
        this.VelocityVectorX = value;
        this.VelocityVectorY = value;
    }

    public get VelocityVectorX() : number {
        return this.velocityVectorX;
    }
    private set VelocityVectorX(value: number) {
        this.velocityVectorX = value;
    }

    public get VelocityVectorY() : number {
        return this.velocityVectorY;
    }
    private set VelocityVectorY(value: number) {
        this.velocityVectorY = value;
    }

    public get NextPosition(): Position {
        return {
            x: this.Transform.position.x + this.VelocityVectorX,
            y: this.Transform.position.y + this.VelocityVectorY
        };
    }

    public get OriginalSpeed(): number {
        return this.originalSpeed;
    }
    private set OriginalSpeed(value: number) {
        this.originalSpeed = value;
    }

    public get BoundingBoxNextPosition(): BoundingBox {
        let nextPosition = this.NextPosition;
        return {
            top: nextPosition.y - this.HalfHeight,
            bottom: nextPosition.y + this.HalfHeight,
            right: nextPosition.x + this.HalfWidth,
            left: nextPosition.x - this.HalfWidth
        }
    }

    public get BoundingBoxPosition(): BoundingBox {
        return {
            top: this.Transform.position.y - this.HalfHeight,
            bottom: this.Transform.position.y + this.HalfHeight,
            right: this.Transform.position.x + this.HalfWidth,
            left: this.Transform.position.x - this.HalfWidth
        }
    }

    constructor(transform: Transform, color: string, speed: number, radius: number, options: RigidBodyOptions = {} )
    {
        super(transform, color, radius, { SetActive: options.SetActive });
        this.speed = speed;
        this.velocityVectorX = -speed;
        this.velocityVectorY = speed;
        this.isColliderActive = options.SetCollider === undefined ? false : options.SetCollider;
        this.isInPlay = true;
        this.originalSpeed = speed;
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
                nextPosition.y + this.HalfHeight > canvas.height
                || nextPosition.y - this.HalfHeight < 0
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

    public resetBall(canvas: HTMLCanvasElement)
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
            ctx.fillStyle = this.Color;
            ctx.beginPath();
            ctx.arc(this.Transform.position.x, this.Transform.position.y, this.HalfWidth, 0, Math.PI * 2, false);
            ctx.closePath();
            ctx.fill();
        }
    }
    
    /**
     * Returns a normalized floating point number from -1 to 1 indicating the
     * point of collision on the 'collidable' Y axis, where 0 is the middle
     * point.
     * 
     * Returned values above 1 or below -1 are out of bounds and will not
     * collide on this axis.
     * @param collidable The other object that this object is colliding with.
     * @returns The normalized collision point.
     */
    private whereWillCollideY(collidable: IPhysicsObject): number
    {
        let halfOffsetRange = collidable.HalfHeight;
        return normalizeRange(this.NextPosition.y - collidable.NextPosition.y, -halfOffsetRange, halfOffsetRange);
    }

    /**
     * Returns a normalized floating point number from -1 to 1 indicating the
     * point of collision on the 'collidable' X axis, where 0 is the middle
     * point.
     * 
     * Returned values above 1 or below -1 are out of bounds and will not
     * collide on this axis.
     * @param collidable The other object that this object is colliding with.
     * @returns The normalized collision point.
     */
    private whereWillCollideX(collidable: IPhysicsObject): number
    {
        let halfOffsetRange = collidable.HalfWidth;
        return normalizeRange(this.NextPosition.x - collidable.NextPosition.x, -halfOffsetRange, halfOffsetRange);
    }

    public onResizeCanvas(scaleX: number, scaleY: number, canvas: HTMLCanvasElement, prevCanvasResolution: Resolution): void
    {
        super.onResizeCanvas(scaleX, scaleY, canvas, prevCanvasResolution);
        const scale = Math.min(scaleX, scaleY);
        this.speed = this.originalSpeed * scale;
        const directionX = Math.sign(this.velocityVectorX);
        const directionY = Math.sign(this.velocityVectorY);
        this.velocityVectorX = directionX * this.speed;
        this.velocityVectorY = directionY * this.speed;
    }
}
