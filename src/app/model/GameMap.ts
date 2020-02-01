
import {HexPos, directions, invert} from "./HexPos";
import {tiles, Tile} from "./Tile";
import { Heapq } from "ts-heapq";

export class GameMap {
    ground: Tile[][];
    width: number;
    height: number;
    start_road: HexPos;
    end_road: HexPos;
    lives: number = 3;

    constructor(width: number, height: number, ground: Tile[][], start_road: HexPos, end_road: HexPos){
        this.width = width;
        this.height = height;
        this.ground = ground;
        this.start_road = start_road;
        this.end_road = end_road;
        if (start_road){
            this.set_tile(start_road, new tiles.StreetHead(end_road));
        }
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

    on_map(pos: HexPos) {
        return (pos.x >= 0 && pos.x < this.width) && (pos.y >= 0 && pos.y < this.height)
    }

    get_tile(place: HexPos): Tile{
        return (this.ground[place.x] || [])[place.y] // Yes, I know...
    }

    set_tile(place: HexPos, tile: Tile){
        if (this.ground[place.x][place.y] instanceof tiles.Farm){
            this.lives -= 1;
        }

        this.ground[place.x][place.y] = tile;
    }

    next_dir(place: HexPos, target: HexPos) {
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

    view(){
        return this.ground;
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
            let tile = this.get_tile(neighbour)
            if (!tile) continue;
            let [cost, path] = this.shortest_path_cost(neighbour, target);
            cost += 1/tile.accessibility;
            if (cost < best_cost){
                best_cost = cost;
                best_dir = dir;
            }
        }
        return best_dir;
    }
    
    shortest_path_cost(start: HexPos, end: HexPos): [number, HexPos[]]{
        // A*
        let visited = new Set();
        let frontier = new Heapq<[number, number, HexPos, HexPos[]]>([], (a, b) => a[0] < b[0]);
        frontier.push([start.distance_to(end), 0, start, []]);
        while (frontier.length()){
            let [estimate, cost, current, path] = frontier.pop();
            if (visited.has(current.hash())) continue;
            visited.add(current.hash());
            if (current.equals(end)){
                return [cost, path];
            }
            for (let neighbour of current.get_neighbours()){
                let tile = this.get_tile(neighbour);
                if (!tile) continue;
                let newcost = cost + 1 / tile.accessibility;
                if (newcost >= Infinity) continue;
                let entry: [number, number, HexPos, HexPos[]] = [newcost + neighbour.distance_to(end), newcost, neighbour, path.concat([current])];
                frontier.push(entry);
            }
        }
        return [Infinity, []];
    }
}



