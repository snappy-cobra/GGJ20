import {RealPos} from "./RealPos";

export class HexPos {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    real_position() {
        return new RealPos(
            this.x + this.y * 0.5,
            this.y * Math.sqrt(3/4)
        );
    }

    get_neighbours() {
        return [
            new HexPos(this.x + 1, this.y),
            new HexPos(this.x - 1, this.y),
            new HexPos(this.x, this.y + 1),
            new HexPos(this.x, this.y - 1),
            new HexPos(this.x + 1, this.y - 1),
            new HexPos(this.x - 1, this.y + 1)
        ];
    }

    direction_to(other: HexPos){
        return this.real_position().direction_to(other.real_position());
    }

    direction_score(neighbour: HexPos, target: HexPos) {
        let dist = Math.abs((this.direction_to(target) - this.direction_to(neighbour)) / (2*Math.PI));
        if (dist > 0.5){
            dist = 1 - dist;
        }
        return 1 - dist * 2;
    }
}