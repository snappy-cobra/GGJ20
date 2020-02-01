import {HexPos} from "./HexPos";
import {Tile} from "./Tile"
import {TileType, DrawTile} from "./drawtile"

var Grass = new Tile("grass", 1, new DrawTile(TileType.Grass));
var Forest = new Tile("forest", 0.5, new DrawTile(TileType.Forest));
var Mountain = new Tile("mountain", 0, new DrawTile(TileType.Mountain));

export class GameMap {
    ground: Tile[][];
    width: number;
    height: number;

    constructor(width: number, height: number){
        this.width = width;
        this.height = height;
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
        return this.ground.map(l => l.map( tile => tile.draw));
    }
}
