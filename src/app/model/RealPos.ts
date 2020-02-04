import {HexPos} from "./HexPos";

export class RealPos {
    x: number;
    y: number;


    constructor(hexPos: HexPos) {
        let x = hexPos.x;
        if ((hexPos.y % 2) == 1) {
            x += 0.5
        }
        this.x = x;
        this.y = hexPos.y * Math.sqrt(3/4)
        //this.x + this.y * 0.5,
        //this.y * Math.sqrt(3/4)
        Object.freeze(this);
    }

    direction_to(other: RealPos){
        return Math.atan2(this.y - other.y, this.x - other.x);
    }
    
    distance_to(other: RealPos){
        return Math.hypot(this.x - other.x, this.y - other.y);
    }
}
