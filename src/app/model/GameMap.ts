import {HexPos} from "./HexPos";
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
                this.ground[pos.x][pos.y] = new tiles.Street();
                let next = this.next_tile(pos, tile.target);
                if (next != null){
                    this.ground[next.x][next.y] = tile;
                    updated[next.x][next.y] = true;
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

    get_tile(place: HexPos){
        return (this.ground[place.x] || [])[place.y] // Yes, I know...
    }

    set_tile(place: HexPos, tile: Tile){
        this.ground[place.x][place.y] = tile;
    }

    next_tile(place: HexPos, target: HexPos){
        if (place.equals(target)){
            return null;
        }
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
        this.ground[pos.x][pos.y] = new tiles.Mountain();
    }

    view(){
        return this.ground.map(l => l.map( tile => tile));
    }

    random_hexPos() {
        let x = Math.floor(Math.random() * this.width);
        let y = Math.floor(Math.random() * this.height);
        return new HexPos(x, y)
    }
}
