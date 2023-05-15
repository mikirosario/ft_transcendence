import { Text } from "./text.js";
import { Transform } from "./transform.js";

export class Score extends Text
{
    score: number = 0;

    
    public get Score(): number
    {
        return this.score;
    }
    public set Score(value: number)
    {
        this.score = value;
        this.text = value.toString();
    }
    
    constructor(transform: Transform, text: string, color: string, fontSize: number, isActive: boolean = true)
    {
        super(transform, text, color, fontSize, isActive);
    }
}
