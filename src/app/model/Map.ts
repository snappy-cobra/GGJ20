import {Tile, tiles} from "./Tile";
import {directions, HexPos, invert} from "./HexPos";

export class Map {
    ground: Tile[][];
    width: number;
    height: number;
    start_road: HexPos;
    end_road: HexPos;

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
}

