import { Circle } from "./circle";
import { Transform } from "./transform";
import { IPhysicsObject } from "./interfaces";
import { BoundingBox, Resolution, Position, RigidBodyOptions, ScaleFactors, Direction } from "./types";
import { isInRange, normalizeRange } from "./utils";

export class Ball extends Circle implements IPhysicsObject
{
    private readonly SPECIALSHOT_SPEED_MULTIPLIER = 3;
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

    constructor(transform: Transform, color: string, speed: number, radius: number, direction: Direction, options: RigidBodyOptions = {} )
    {
        super(transform, color, radius, { SetActive: options.SetActive });
        this.velocityVectorX = direction.x * speed;
        this.velocityVectorY = direction.y * speed;
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

        if (isSideCollision) // Side collisions invert the X direction of motion
            this.VelocityVectorX = newVelocityVectorX * -referenceDirectionX * this.ReferenceSpeed;
        else                 // Top or bottom collisions continue the X direction of motion
            this.VelocityVectorX = newVelocityVectorX * referenceDirectionX * this.ReferenceSpeed;
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
        // Invert the X component of the velocity vector
            this.VelocityVectorX = -this.VelocityVectorX;
        // Current squared magnitude of velocity
        const currentSpeedSquared = this.VelocityVectorX * this.VelocityVectorX + this.VelocityVectorY * this.VelocityVectorY;

        // Check if the squared current speed is different from the squared reference speed
        if (currentSpeedSquared !== this.ReferenceSpeed * this.ReferenceSpeed)
        {
            const desiredSpeed = this.ReferenceSpeed;
            // Current magnitude of velocity
            const currentSpeed = Math.sqrt(currentSpeedSquared);

            // Current direction of motion
            let directionX = this.VelocityVectorX / currentSpeed;
            let directionY = this.VelocityVectorY / currentSpeed;

            // Apply the desired speed to the current direction
            this.VelocityVectorX = directionX * desiredSpeed;
            this.VelocityVectorY = directionY * desiredSpeed;
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

    private isSpecialShotCollision(collisionPointX: number, willCollideCanvas: boolean)
    {
        return isInRange(collisionPointX, -1, 1) && willCollideCanvas;
    }

    private specialShot(collidable: IPhysicsObject, collisionPointX: number, referenceResolution: Resolution): void {
        // Determine the direction of the special shot based on the side of the game board
        const directionX = this.Transform.position.x < referenceResolution.width / 2 ? 1 : -1;

        // Set the new X and Y velocity for the special shot
        this.VelocityVectorX = directionX * this.SPECIALSHOT_SPEED_MULTIPLIER;
        this.VelocityVectorY = 0;

        // Determine the Y position along the upper or lower edge of the canvas
        const edgePositionY = this.Transform.position.y < referenceResolution.height / 2 ? 0 : referenceResolution.height;

        // Set the ball's Y position to align with the edge of the canvas, accounting for the radius
        this.Transform.position.y = edgePositionY + this.HalfHeight * (edgePositionY === 0 ? 1 : -1);

        // Determine the teleportation distance based on collisionPointX and directionX
        // Here, we multiply by the object's width to determine the teleport distance to the right or left edge of the collidable
        const teleportDistance = collisionPointX * directionX * this.HalfWidth * 2;

        // Teleport the ball ahead of the collidable object on the X axis
        this.Transform.position.x += teleportDistance;

        // Log or otherwise notify that a special shot has occurred
        console.log("Special shot activated!");
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
            let willCollideCanvas: boolean = this.willCollideCanvas(referenceResolution);
            if (this.willCollideCanvas(referenceResolution))
                this.bounceY();
                physObjects.forEach((physObject) => {
                    if (this.willCollide(physObject))
                    {
                        const collisionPointX = this.whereWillCollideX(physObject);
                        if (this.isSpecialShotCollision(collisionPointX, willCollideCanvas)) // New method to determine special collision
                        {
                            this.specialShot(physObject, collisionPointX, referenceResolution); // New method to handle special shot
                        }
                        else
                        {
                            this.bounceBack(physObject);
                        }
                    }
                })
            this.Transform.position.x += this.VelocityVectorX * this.ReferenceSpeed;
            this.Transform.position.y += this.VelocityVectorY * this.ReferenceSpeed;
        }
    }
}

