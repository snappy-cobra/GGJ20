import {HexPos, directions, invert} from "./HexPos";
import {tiles, Tile} from "./Tile";


export class GameMap {
    ground: Tile[][];
    width: number;
    height: number;

    constructor(width: number, height: number, ground: Tile[][]){
        this.width = width;
        this.height = height;
        this.ground = ground;
        this.ground[0][0] = new tiles.StreetHead(new HexPos(width - 1, height - 1));
    }
    
    update(){
        let updated: boolean[][] = [];
        for (let x=0; x<this.width; ++x){
            updated[x] = [];
            for (let y=0; y<this.height; ++y){
                updated[x][y] = false;
            }
        }
        for (let pos of this.valid_positions()){
            if (updated[pos.x][pos.y]){
                continue;
            }
            updated[pos.x][pos.y] = true;
            let tile = this.get_tile(pos);
            if (tile instanceof tiles.StreetHead){
                this.ground[pos.x][pos.y] = new tiles.Street(tile.prev);
                let next = this.planned_next_dir(pos, tile.target);
                if (next){
                    let nextpos = pos.move(next);
                    this.set_tile(nextpos, new tiles.StreetHead(tile.target, invert(next)));
                    updated[nextpos.x][nextpos.y] = true;
                    this.set_tile(pos, new tiles.Street(tile.prev, next));
                }
            }
        }
    }
    
    valid_positions(){
        let positions: HexPos[] = [];
        for (let x=0; x<this.width; ++x){
            for (let y=0; y<this.height; ++y){
                positions.push(new HexPos(x, y));
            }
        }
        return positions;
    }

    get_tile(place: HexPos): Tile{
        return (this.ground[place.x] || [])[place.y] // Yes, I know...
    }

    set_tile(place: HexPos, tile: Tile){
        this.ground[place.x][place.y] = tile;
    }

    next_dir(place: HexPos, target: HexPos){
        if (place.equals(target)){
            return null;
        }
        let neighbours = place.get_neighbours();
        let best = null, best_score = 0;
        for (let dir of directions){
            let neighbour = place.move(dir);
            let neighbour_tile = this.get_tile(neighbour);
            if (!neighbour_tile) continue;
            let score = place.direction_score(neighbour, target) * neighbour_tile.accessibility;
            if (score > best_score) {
                best_score = score;
                best = dir;
            }
        }
        return best;
    }

    place_mountain(pos: HexPos) {
        this.ground[pos.x][pos.y] = new tiles.Mountain();
    }

    view(){
        return this.ground.map(l => l.map( tile => tile));
    }

    random_hexPos() {
        let x = Math.floor(Math.random() * this.width);
        let y = Math.floor(Math.random() * this.height);
        return new HexPos(x, y);
    }
    
    planned_next_dir(place: HexPos, target: HexPos){
        if (place.equals(target)){
            return null;
        }
        let best_cost = Infinity;
        let best_dir = null
        for (let dir of directions){
            let neighbour = place.move(dir)
            if (!this.get_tile(neighbour)) continue;
            let cost = this.shortest_path_cost(place, target);
            if (cost < best_cost){
                best_cost = cost;
                best_dir = dir;
            }
        }
        return best_dir;
    }
    
    shortest_path_cost(start: HexPos, end: HexPos){
        // A*
        let visited = new Set();
        
        let frontier: [number, number, HexPos][] = [[start.distance_to(end), 0, start]];
        while (frontier.length){
            let [estimate, cost, current] = frontier.shift();
            if (visited.has(current.hash())) continue;
            visited.add(current.hash());
            if (current.equals(end)){
                return cost;
            }
            for (let neighbour of current.get_neighbours()){
                let tile = this.get_tile(neighbour);
                if (!tile) continue;
                let newcost = cost + 1 / tile.accessibility;
                if (newcost >= Infinity) continue;
                let entry: [number, number, HexPos] = [newcost + neighbour.distance_to(end), newcost, neighbour];
                for (let i=0; i<frontier.length; ++i){
                    if (frontier[i] >= entry){
                        frontier.splice(i, 0, entry);
                    }
                }
                frontier.push();
                frontier.sort();
            }
        }
        return Infinity;
    }
}



