export class Player
{
    private score: number = 0;

    public get Score(): number {
        return this.score;
    }
    public set Score(value: number) {
        this.score = value;
    }
}