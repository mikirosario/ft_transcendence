import { Position, BoundingBox, Plane } from "./types.js";
import { Alignment } from "./alignment.js";
import { Transform } from "./transform.js";

export interface IDrawable
{
    IsActive: boolean;
    Height: number;
    Width: number;
    draw(ctx: CanvasRenderingContext2D): void;
    onResizeCanvas(scaleX: number, scaleY: number, canvas: HTMLCanvasElement, prevCanvasDimensions: Plane): void;
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