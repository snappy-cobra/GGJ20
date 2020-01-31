


export function modelmain() {
    
    let map = new GameMap();
    let street = new Street(new HexPos(0, 0), new HexPos(5, 5));
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
        for (let x=0; x<20; ++x){
            this.ground[x] = [];
            for (let y=0; y<20; ++y){
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

class Street {
    head: HexPos;
    tail: HexPos[];
    target: HexPos;
    
    constructor(begin: HexPos, end: HexPos){
        this.head = begin;
        this.tail = [];
        this.target = end;
    }
    
    grow(map: GameMap){
        let next = map.next_tile(this.head, this.target);
        this.tail.push(this.head);
        this.head = next;
    }
}


