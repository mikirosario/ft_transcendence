export type Position = { x: number, y: number };

export type Resolution = { width: number, height: number }

export type BoundingBox = { top: number, bottom: number, right: number, left: number};

export type PlayerInputs = { up: boolean, down: boolean };

export type PhysicsOptions = { SetCollider?: boolean };

export type DrawableOptions = { SetActive?: boolean };

export type RigidBodyOptions = PhysicsOptions & DrawableOptions;
