import {RealPos} from "./RealPos";

export enum Direction {
    TopLeft = "B",
    TopRight = "C",
    Right = "D",
    BottomRight = "E",
    BottomLeft = "F",
    Left = "A"
    
}


export function invert(dir: Direction) {
    if (dir == Direction.TopRight){return Direction.BottomLeft;}
    if (dir == Direction.TopLeft){return Direction.BottomRight;}
    if (dir == Direction.Left){return Direction.Right;}
    if (dir == Direction.BottomLeft){return Direction.TopRight;}
    if (dir == Direction.BottomRight){return Direction.TopLeft;}
    if (dir == Direction.Right){return Direction.Left;}
    
}

export var directions: Direction[] = [
    Direction.TopLeft,
    Direction.TopRight,
    Direction.Right,
    Direction.BottomRight,
    Direction.BottomLeft,
    Direction.Left
]


export class HexPos {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        Object.freeze(this);
    }

    real_position() {
        return new RealPos(this);
    }
    
    move(dir: Direction) {
        if (dir == Direction.Right){
            return new HexPos(this.x + 1, this.y);
        }
        if (dir == Direction.Left){
            return new HexPos(this.x - 1, this.y);
        }
        if (this.y & 1){ // y is odd
            switch (dir){
                case Direction.TopLeft:
                    return new HexPos(this.x, this.y+1);
                case Direction.TopRight:
                    return new HexPos(this.x+1, this.y+1);
                case Direction.BottomLeft:
                    return new HexPos(this.x, this.y-1);
                case Direction.BottomRight:
                    return new HexPos(this.x+1, this.y-1);
            }
        } else {
            switch (dir){
                case Direction.TopLeft:
                    return new HexPos(this.x-1, this.y+1);
                case Direction.TopRight:
                    return new HexPos(this.x, this.y+1);
                case Direction.BottomLeft:
                    return new HexPos(this.x-1, this.y-1);
                case Direction.BottomRight:
                    return new HexPos(this.x, this.y-1);
            }
        }
    }

    get_neighbours(): HexPos[] {
        return directions.map(dir => this.move(dir));
    }

    direction_to(other: HexPos){
        return this.real_position().direction_to(other.real_position());
    }
    
    distance_to(other: HexPos){
        return this.real_position().distance_to(other.real_position());
    }

    direction_score(neighbour: HexPos, target: HexPos) {
        let dist = Math.abs((this.direction_to(target) - this.direction_to(neighbour)) / (2*Math.PI));
        if (dist > 0.5){
            dist = 1 - dist;
        }
        return 1 - dist * 2;
    }
    
    equals(other: HexPos){
        return this.x == other.x && this.y == other.y;
    }
    
    hash(): string{
        return JSON.stringify(this);
    }
}
