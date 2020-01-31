


export function modelmain() {
    
    let a = new HexPos(0, 0);
    let b = new HexPos(5, 5);
    console.log(a.get_neighbours());
    for (let neighbour of a.get_neighbours()){
        console.log(neighbour, a.direction_score(neighbour, b))
    }
    
    let map = new GameMap();
    let street = new HexPos(0, 0);
    while (street.hash() != b.hash()){
        console.log(street);
        street = map.next_tile(street, b);
    }
}



export class Vec2 {
    x: number;
    y: number;
    
    
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    
    direction_to(other: Vec2){
        return Math.atan2(this.y - other.y, this.x - other.x);
    }
    
}

export class HexPos {
    x: number;
    y: number;
    
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
    
    hash(){
        // turn it into an immutable type
        return JSON.stringify(this);
    }
}


function distmod1(a: number, b: number) {
    return 
}

class Tile {
    name: string;
    accessibility: number;
    constructor(name: string, accessibility: number){
        this.name = name;
        this.accessibility = accessibility;
    }
}

var Grass = new Tile("grass", 1);
var Forest = new Tile("forest", 0.5);
var Mountain = new Tile("mountain", 0);

class GameMap {
    ground: Tile[][];
    
    constructor(){
        this.ground = [];
        for (let x=0; x<10; ++x){
            this.ground[x] = []
            for (let y=0; y<10; ++y){
                this.ground[x][y] = Grass;
            }
        }
    }
    
    get_tile(place: HexPos){
        return (this.ground[place.x] || [])[place.y] // Yes, I know...
    }
    
    next_tile(place: HexPos, target: HexPos){
        let neighbours = place.get_neighbours();
        let best = null, best_score = 0;
        for (let neighbour of neighbours){
            let neighbour_tile = this.get_tile(neighbour);
            if (!neighbour_tile) continue;
            let score = place.direction_score(neighbour, target) * neighbour_tile.accessibility;
            if (score > best_score) {
                best_score = score;
                best = neighbour;
            }
        }
        return best;
    }
}



