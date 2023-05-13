import { Position } from "./types.js";

export class Transform
{
    public position: Position;
    public rotation: number;

    constructor(position: Position, rotation: number)
    {
        this.position = position;
        this.rotation = rotation;
    }
}