import { Socket } from "socket.io-client";
import { Paddle } from "./paddle";
import { InputState } from "./types";

export function onKeyDown(event: KeyboardEvent, p1: Paddle, p2: Paddle, socket: Socket): void
{
    if (event.isComposing)
                return;
    if (event.code === "KeyW" && p1.PlayerInputs.up == false)
    {
        p1.PlayerInputs.up = true;
        let inputState: InputState = {
            paddleVelocityVectorY: -1
        }
        socket.emit('input', inputState);
    }
    else if (event.code === "ArrowUp" && p2.PlayerInputs.up == false)
    {
        p2.PlayerInputs.up = true;
        let inputState: InputState = {
            paddleVelocityVectorY: -1
        }
        socket.emit('input', inputState);
    }
    else if (event.code === "KeyS" && p1.PlayerInputs.down == false)
    {
        p1.PlayerInputs.down = true;
        let inputState: InputState = {
            paddleVelocityVectorY: 1
        }
        socket.emit('input', inputState);
    }
    else if (event.code === "ArrowDown" && p2.PlayerInputs.down == false)
    {
        p2.PlayerInputs.down = true;
        let inputState: InputState = {
            paddleVelocityVectorY: 1
        }
        socket.emit('input', inputState);
    }
}

export function onKeyUp(event: KeyboardEvent, p1: Paddle, p2: Paddle, socket: Socket): void
{
    if (event.code === "KeyW" && p1.PlayerInputs.up == true)
    {
        p1.PlayerInputs.up = false;
        let inputState: InputState = {
            paddleVelocityVectorY: 1
        }
        socket.emit('input', inputState);
    }
    else if (event.code === "ArrowUp" && p2.PlayerInputs.up == true)
    {
        p2.PlayerInputs.up = false;
        let inputState: InputState = {
            paddleVelocityVectorY: 1
        }
        socket.emit('input', inputState);
    }
    else if (event.code === "KeyS" && p1.PlayerInputs.down == true)
    {
        p1.PlayerInputs.down = false;
        let inputState: InputState = {
            paddleVelocityVectorY: -1
        }
        socket.emit('input', inputState);
    }
    else if (event.code === "ArrowDown" && p2.PlayerInputs.down == true)
    {
        p2.PlayerInputs.down = false;
        let inputState: InputState = {
            paddleVelocityVectorY: -1
        }
        socket.emit('input', inputState);
    }
}
