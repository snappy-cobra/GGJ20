
export function model_main() {
    let game = new Game(20, 20, new HexPos(0,0,), new HexPos(2,3));
    game.update()
}

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
    
    constructor(width: Number, height: Number){
        this.ground = [];
        for (let x=0; x<width; ++x){
            this.ground[x] = [];
            for (let y=0; y<height; ++y){
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
    
    view(){
        return this.ground.map(l => l.map( tile => tile.name));
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

export class Game {
    street: Street;
    map: GameMap;
    
    constructor(width: Number, height: Number, street_start: HexPos, street_target: HexPos){
        this.map = new GameMap(width, height);
        this.street = new Street(street_start, street_target);
    }
    
    update() {
        this.street.grow(this.map);
    }
}
        
