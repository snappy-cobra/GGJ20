


export function modelmain() {
    
    let a = new HexPos(0, 0);
    console.log(a.get_neighbours());
    
    
}

export class HexPos {
    x = 0
    y = 0
    
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    
    real_position() {
        return {
            x: this.x + this.y * 0.5,
            y: this.y + Math.sqrt(3/4)
        }
    }
    
    get_neighbours() {
        return [
            new HexPos(this.x + 1, this.y),
            new HexPos(this.x - 1, this.y),
            new HexPos(this.x, this.y + 1),
            new HexPos(this.x, this.y - 1),
            new HexPos(this.x + 1, this.y + 1),
            new HexPos(this.x - 1, this.y - 1)
        ];
    }
    
    direction_to(other: HexPos){
        return Math.atan2(other.y - this.y, other.x - this.x);
    }
    
    direction_score(target: HexPos, neighbour: HexPos) {
        return Math.abs(((this.direction_to(target) - this.direction_to(neighbour)) / (2*Math.PI)) % 1)
    }  
}
