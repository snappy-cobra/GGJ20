export class RealPos {
    x: number;
    y: number;


    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    direction_to(other: RealPos){
        return Math.atan2(this.y - other.y, this.x - other.x);
    }
}