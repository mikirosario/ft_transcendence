export class AspectRatio
{
    private width: number;
    private height: number;

    public get Width() {
        return this.width;
    }
    public set Width(value: number) {
        this.width = value;
    }

    public get Height() {
        return this.height;
    }
    public set Height(value: number) {
        this.height = value;
    }

    public constructor(width: number, height: number)
    {
        this.width = width;
        this.height = height;
    }

    public toNumber(): number
    {
        return this.Width / this.Height;
    }
}
