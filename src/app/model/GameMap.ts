import {HexPos} from "./HexPos";
import {Tile} from "./Tile"
import {TileType} from "./Tile"
import {MapMaker} from "./MapMaker";

export class GameMap {
    ground: Tile[][];
    width: number;
    height: number;

    constructor(width: number, height: number, ground: Tile[][]){
        this.width = width;
        this.height = height;
        this.ground = ground;
    }

    get_tile(place: HexPos){
        return (this.ground[place.x] || [])[place.y] // Yes, I know...
    }

    set_tile(place: HexPos, tile: Tile){
        this.ground[place.x][place.y] = tile;
        console.log("TESSTTT");
        console.log(tile);
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

    place_mountain(pos: HexPos) {
        this.ground[pos.x][pos.y] = Tile.create(TileType.Mountain)
    }

    view(){
        return this.ground.map(l => l.map( tile => tile.type));
    }

    random_hexPos() {
        let x = Math.floor(Math.random() * this.width);
        let y = Math.floor(Math.random() * this.height);
        return new HexPos(x, y)
    }
}
