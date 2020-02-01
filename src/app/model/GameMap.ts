import {HexPos} from "./HexPos";
import {tiles, Tile} from "./Tile";

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
                let content = tiles.Grass;
                if (Math.random() < 0.1){
                    content = tiles.Mountain;
                } else if (Math.random() < 0.1){
                    content = tiles.Forest;
                }
                this.ground[x][y] = content;
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

    place_mountain(pos: HexPos) {
        this.ground[pos.x][pos.y] = tiles.Mountain;
    }

    view(){
        return this.ground.map(l => l.map( tile => tile.type));
    }
}
