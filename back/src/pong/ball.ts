import { Circle } from "./circle";
import { Transform } from "./transform";
import { IPhysicsObject } from "./interfaces";
import { BoundingBox, Resolution, Position, RigidBodyOptions, ScaleFactors } from "./types";
import { isInRange, normalizeRange } from "./utils";

export class Ball extends Circle implements IPhysicsObject
{
    private isColliderActive: boolean;
    private isInPlay: boolean;
    private velocityVectorX: number;
    private velocityVectorY: number;
    private referenceSpeed: number;

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
        return this.referenceSpeed;
    }
    public set Speed(value: number) {
        this.referenceSpeed = value;
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

    public get ReferenceSpeed(): number {
        return this.referenceSpeed;
    }
    private set ReferenceSpeed(value: number) {
        this.referenceSpeed = value;
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
        this.velocityVectorX = -1;
        this.velocityVectorY = 1;
        this.isColliderActive = options.SetCollider === undefined ? false : options.SetCollider;
        this.isInPlay = true;
        this.referenceSpeed = speed;
    }

    public bounceY()
    {
        console.log("bounced");
        this.VelocityVectorY *= -1;
    }

    public bounceX()
    {
        this.VelocityVectorX *= -1;
    }

    public bounceBack(physObject: IPhysicsObject)
    {
        const QUARTER_CIRCLE_IN_RADIANS = Math.PI * 0.25;
        const referenceDirectionX = Math.sign(this.VelocityVectorX);
        const collisionPointY = this.whereWillCollideY(physObject);
        const isSideCollision = isInRange(collisionPointY, -1, 1);
        const bounceAngleInRadians = collisionPointY * QUARTER_CIRCLE_IN_RADIANS;
        const newVelocityVectorX = Math.cos(bounceAngleInRadians);

        console.log("I am bouncing back!");
        if (isSideCollision) // Side collisions invert the X direction of motion
            this.VelocityVectorX = newVelocityVectorX * -referenceDirectionX;
        else                 // Top or bottom collisions continue the X direction of motion
            this.VelocityVectorX = newVelocityVectorX * referenceDirectionX;
        // Update the Y component of the velocity
        this.VelocityVectorY = Math.sin(bounceAngleInRadians);
    }
    
    public willCollideCanvas(canvas: Resolution): boolean
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
        
        public resetBall(currentResolution: Resolution)
        {
            this.Transform.position = {
                x: Math.round(currentResolution.width * 0.5),
            y: Math.round(currentResolution.height * 0.5)
        }
        this.VelocityVectorX = -this.VelocityVectorX;
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

    private rescaleSpeed(scaleFactors: ScaleFactors)
    {
        const scale = Math.min(scaleFactors.scaleX, scaleFactors.scaleY);
        this.Speed = this.ReferenceSpeed * scale;
    }

    public updateSpeed(scaleFactors: ScaleFactors, newSpeed: number): void
    {
        this.ReferenceSpeed = newSpeed;
        this.rescaleSpeed(scaleFactors);
    }
    
    public move(referenceResolution: Resolution, physObjects: IPhysicsObject[] = [])
    {
        if (this.IsActive)
        {
            if (this.willCollideCanvas(referenceResolution))
                this.bounceY();
            physObjects.forEach((physObject) => {
                if (this.willCollide(physObject))
                    this.bounceBack(physObject);
            })
            this.Transform.position.x += this.VelocityVectorX * this.ReferenceSpeed;
            this.Transform.position.y += this.VelocityVectorY * this.ReferenceSpeed;
        }
    }
}

