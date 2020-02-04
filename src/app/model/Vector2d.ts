import {HexPos} from "./HexPos";

export function vector2d_from_hex(source: HexPos, destination: HexPos) {
    let real_mine = source.real_position();
    let real_other = destination.real_position();
    return new Vector2d(real_mine.x - real_other.x, real_mine.y - real_other.y);
}

export class Vector2d {
    x:number;
    y:number;

    constructor(x:number, y:number) {
        this.x = x;
        this.y = y;
    }

    magnitude() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    unit() {
        let magnitude = this.magnitude();
        return new Vector2d(this.x/magnitude, this.y/magnitude);
    }

    multiply_scalar(a: number) {
        return new Vector2d(this.x*a, this.y*a);
    }

    sum(a: Vector2d) {
        return new Vector2d(this.x + a.x, this.y + a.y);
    }
}