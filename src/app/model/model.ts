


export function modelmain() {
    
    let a = new HexPos(0, 0);
    let b = new HexPos(3,2);
    let best_n = a.grow_neighbour(b);
    console.log(best_n.x, best_n.y)
}

export class HexPos {
    x = 0;
    y = 0;
    
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    
    real_position() {
        return {
            x: this.x + this.y * 0.5,
            y: this.y * Math.sqrt(3/4)
        }
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
    
    direction_to(other: HexPos) {
        return Math.atan2(other.y - this.y, other.x - this.x);
    }
    
    direction_score(target: HexPos, neighbour: HexPos) {
        return Math.abs(((this.direction_to(target) - this.direction_to(neighbour)) / (2*Math.PI)) % 1);
    }

    grow_neighbour(goal: HexPos) {
        let vec_a_factor = 0.2;
        let vec_a = vector2d_from_hex(this, goal).unit().multiply_scalar(vec_a_factor);

        let max_value = -1;
        let max_neighbour = null;

        let neighbours = this.get_neighbours();
        for (let n of neighbours) {
            let vec_n = vector2d_from_hex(this, n);
            let cur_value = vec_n.sum(vec_a).magnitude();
            console.log(n.x, n.y, cur_value);
            if (cur_value > max_value) {
                max_value = cur_value;
                max_neighbour = n;
            }
        }
        return max_neighbour
    }
}

function vector2d_from_hex(source: HexPos, destination: HexPos) {
    let real_mine = source.real_position();
    let real_other = destination.real_position();
    return new vector2d(real_mine.x - real_other.x, real_mine.y - real_other.y);
}

class vector2d {
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
        return new vector2d(this.x/magnitude, this.y/magnitude);
    }

    multiply_scalar(a: number) {
        return new vector2d(this.x*a, this.y*a);
    }

    sum(a: vector2d) {
        return new vector2d(this.x + a.x, this.y + a.y);
    }

}
