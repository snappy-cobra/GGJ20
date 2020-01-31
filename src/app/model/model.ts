


export function modelmain() {
    
    let a = new HexPos(0, 0);
    console.log(a.get_neighbours());
    for (let neighbour of a.get_neighbours()){
        console.log(a.direction_to(neighbour)/ Math.PI)
    }
}



export class Vec2 {
    x = 0
    y = 0
    
    
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    
    direction_to(other: Vec2){
        return Math.atan2(this.y - other.y, this.x - other.x);
    }
    
}

export class HexPos {
    x = 0;
    y = 0;
    
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    
    real_position() {
        return new Vec2(
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
            new HexPos(this.x + 1, this.y + 1),
            new HexPos(this.x - 1, this.y - 1)
        ];
    }
    
    direction_to(other: HexPos){
        return this.real_position().direction_to(other.real_position());
    }
    
    direction_score(target: HexPos, neighbour: HexPos) {
        return Math.abs(((this.direction_to(target) - this.direction_to(neighbour)) / (2*Math.PI)) % 1)
    }  
}
