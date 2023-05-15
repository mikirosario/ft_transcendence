import { Position, BoundingBox } from "./types.js";
import { Alignment } from "./alignment.js";
import { Transform } from "./transform.js";

export interface IDrawable
{
    IsActive: boolean;
    draw(ctx: CanvasRenderingContext2D): void;
}

export interface IPhysicsObject
{
    Transform: Transform;
    Speed: number;
    HalfHeight: number;
    HalfWidth: number;
    VelocityVectorX: number;
    VelocityVectorY: number;
    NextPosition: Position;
    move(canvas: HTMLCanvasElement, collidables: IPhysicsObject[]): void;
    IsColliderActive: boolean;
    BoundingBoxNextPosition: BoundingBox;
    BoundingBoxPosition: BoundingBox;
    willCollideCanvas(canvas: HTMLCanvasElement): boolean;
    willCollide(collidable: IPhysicsObject): boolean;
}

export interface IUIObject
{
    Alignment: Alignment;
}
