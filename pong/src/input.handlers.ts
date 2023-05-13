import { Rectangle } from "./rectangle.js";

export function onKeyDown(event: KeyboardEvent, p1: Rectangle, p2: Rectangle): void
{
    if (event.isComposing)
                return;
    if (event.code === "KeyW" && p1.PlayerInputs.up == false)
    {
        p1.PlayerInputs.up = true;
        p1.VelocityVectorY += -1;
    }
    else if (event.code === "ArrowUp" && p2.PlayerInputs.up == false)
    {
        p2.PlayerInputs.up = true;
        p2.VelocityVectorY += -1;
    }
    else if (event.code === "KeyS" && p1.PlayerInputs.down == false)
    {
        p1.PlayerInputs.down = true;
        p1.VelocityVectorY += 1;
    }
    else if (event.code === "ArrowDown" && p2.PlayerInputs.down == false)
    {
        p2.PlayerInputs.down = true;
        p2.VelocityVectorY += 1;
    }
}

export function onKeyUp(event: KeyboardEvent, p1: Rectangle, p2: Rectangle): void
{
    if (event.code === "KeyW" && p1.PlayerInputs.up == true)
    {
        p1.PlayerInputs.up = false;
        p1.VelocityVectorY += 1;
    }
    else if (event.code === "ArrowUp" && p2.PlayerInputs.up == true)
    {
        p2.PlayerInputs.up = false;
        p2.VelocityVectorY += 1;
    }
    else if (event.code === "KeyS" && p1.PlayerInputs.down == true)
    {
        p1.PlayerInputs.down = false;
        p1.VelocityVectorY += -1;
    }
    else if (event.code === "ArrowDown" && p2.PlayerInputs.down == true)
    {
        p2.PlayerInputs.down = false;
        p2.VelocityVectorY += -1;
    }
}