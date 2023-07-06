import { Rectangle } from "./rectangle";
import { Transform } from "./transform";
import { IPhysicsObject, IStateSynchronizationObject } from "./interfaces";
import { PlayerInputs, BoundingBox, Position, RigidBodyOptions, Resolution, ScaleFactors, GameState } from "./types";

export class Paddle extends Rectangle implements IPhysicsObject, IStateSynchronizationObject
{
    private isColliderActive: boolean;
    private playerInputs: PlayerInputs;
    private speed: number;
    private velocityVectorX: number;
    private velocityVectorY: number;
    private referenceSpeed: number;
    
    public get IsColliderActive(): boolean {
        return  this.IsActive && this.isColliderActive;
    }
    public set IsColliderActive(value: boolean) {
        this.isColliderActive = value;
    }

    public get PlayerInputs(): PlayerInputs {
        return this.playerInputs;
    }

    public get Speed() : number {
        return this.speed;
    }
    public set Speed(value: number) {
        this.speed = value;
    }

    public get VelocityVectorX() : number {
        return this.velocityVectorX;
    }
    public set VelocityVectorX(value: number) {
        this.velocityVectorX = value;
    }

    public get VelocityVectorY(): number {
        return this.velocityVectorY;
    }
    public set VelocityVectorY(value: number) {
        this.velocityVectorY = value;
    }

    public get ReferenceSpeed(): number {
        return this.referenceSpeed;
    }
    private set ReferenceSpeed(value: number) {
        this.referenceSpeed = value;
    }

    public get NextPosition(): Position {
        return {
            x: this.Transform.position.x + this.VelocityVectorX,
            y: this.Transform.position.y + this.VelocityVectorY
        };
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

    constructor(transform: Transform, color: string, width: number, height: number, speed: number, referenceResolution: Resolution, options: RigidBodyOptions = {})
    {
        super(transform, color, width, height, referenceResolution, { SetActive: options.SetActive });
        this.speed = speed;
        this.isColliderActive = options.SetCollider === undefined ? false : options.SetCollider;
        this.velocityVectorX = 0;
        this.velocityVectorY = 0;
        this.playerInputs = { up: false, down: false };
        this.referenceSpeed = speed;
    }

    public willCollideCanvas(canvas: HTMLCanvasElement): boolean
    {
        let willCollide: boolean = false;
        if (this.IsColliderActive)
        {
            let halfHeight = this.HalfHeight;
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

    public onResizeCanvas(scaleFactors: ScaleFactors, currentCanvasResolution: Resolution, prevCanvasResolution: Resolution): void
    {
        super.onResizeCanvas(scaleFactors, currentCanvasResolution, prevCanvasResolution);
        this.rescaleSpeed(scaleFactors);
    }

    public move(canvas: HTMLCanvasElement, collidables: IPhysicsObject[] = [])
    {
        if (this.IsActive && !this.willCollideCanvas(canvas))
        {
            this.Transform.position.x += this.VelocityVectorX * this.Speed;
            this.Transform.position.y += this.VelocityVectorY * this.Speed;
        }
    }

    synchronizeState(gameState: GameState, scaleFactors: ScaleFactors): void
    {
        //this.updateSpeed(scaleFactors, gameState.ball.ReferenceSpeed);
        // this.VelocityVectorX = gameState.ball.VelocityVectorX;
        // this.VelocityVectorY = gameState.ball.VelocityVectorY;

    }
}
