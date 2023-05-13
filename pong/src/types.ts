import { Transform } from "./transform.js";

export type AspectRatio = { width: number, height: number };

export type Position = { x: number, y: number };

export type BoundingBox = { top: number, bottom: number, right: number, left: number};

export type PlayerInputs = { up: boolean, down: boolean };

export interface IDrawable
{
    IsActive: boolean;
    draw(ctx: CanvasRenderingContext2D): void;
}

export interface IPhysicsObject
{
    Transform: Transform;
    Speed: number;
    VelocityVectorX: number;
    VelocityVectorY: number;
    NextPosition: Position;
    move(canvas: HTMLCanvasElement, collidables: IPhysicsObject[]): void;
    bounceY(): void;
    bounceX(): void;
    IsColliderActive: boolean;
    BoundingBoxNextPosition: BoundingBox;
    willCollideCanvas(canvas: HTMLCanvasElement): boolean;
    willCollide(collidable: IPhysicsObject): boolean;
}
