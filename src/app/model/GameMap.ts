
import {HexPos, Direction, directions, invert} from "./HexPos";
import {tiles, Tile} from "./Tile";
import {Map} from "./Map";
import {Game} from "./Game";

export class GameMap extends Map{
    game: Game;
    dynamism: number;
    

    constructor(game: Game, width: number, height: number, ground: Tile[][], start_road: HexPos, end_road: HexPos, dynamism: number = 0){
        super(width, height, ground, start_road, end_road);
        this.dynamism = dynamism;
        this.game = game;
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
                if (!next){
                    next = this.next_dir(pos, tile.target);
                }
                if (next){
                    let nextpos = pos.move(next);
                    if (this.get_tile(nextpos) instanceof tiles.Harbor){
                        this.game.level_won();
                    } else {
                        this.set_tile(nextpos, new tiles.StreetHead(tile.target, invert(next)));
                    }
                    updated[nextpos.x][nextpos.y] = true;
                    this.set_tile(pos, new tiles.Street(tile.prev, next));
                } else {
                    this.game.level_lost();
                }
            } else if (tile instanceof tiles.Boat){
                let neighbour = pos.get_neighbours()[Math.random()*6 |0];
                let other = this.get_tile(neighbour);
                if (other instanceof tiles.Ocean){
                    this.set_tile(neighbour, tile);
                    this.set_tile(pos, other);
                }
            } else if (tile instanceof tiles.Forest){
                if (Math.random()< 0.005*this.dynamism){
                    this.set_tile(pos, new tiles.Fire());
                }
            } else if (tile instanceof tiles.Fire){
                tile.to_live -= 1;
                if (tile.to_live <= 0){
                    this.set_tile(pos, new tiles.Grass());
                }
                let neighbour = pos.get_neighbours()[Math.random()*6 |0];
                let other = this.get_tile(neighbour);
                if (Math.random() < 0.5 * this.dynamism && (other instanceof tiles.Forest || other instanceof tiles.Farm)){
                    this.set_tile(neighbour, new tiles.Fire());
                }
            } else if (tile instanceof tiles.Grass){
                let forests = pos.get_neighbours().filter(p=>this.get_tile(p) instanceof tiles.Forest).length;
                if (Math.random() < (0.0005 + 0.01 * forests) * this.dynamism){
                    this.set_tile(pos, new tiles.Forest());
                }
            }
        }
    }

    place_mountain(place: HexPos) {
        let tile = this.get_tile(place);
        if (tile == undefined) {
            return false;
        }
        if (tile instanceof tiles.Mountain || tile instanceof tiles.Harbor || tile instanceof tiles.Street || tile instanceof tiles.StreetHead || tile instanceof tiles.Farm) {
            return false;
        }
        this.set_tile(place, new tiles.Mountain());
        return true;
    }
    
    grab_mountain(place: HexPos){
        
        let tile = this.get_tile(place);
        if (tile instanceof tiles.Mountain) {
            this.set_tile(place, new tiles.Crushed());
            return true;
        }
        return false;
    }

    set_tile(place: HexPos, tile: Tile) {
        if (this.ground[place.x][place.y] instanceof tiles.Farm) {
            this.game.level_lost();
        }
        super.set_tile(place, tile);
    }

    view(){
        return this.ground;
    }

    planned_next_dir(place: HexPos, target: HexPos){
        if (place.equals(target)){
            return null;
        }
        let [cost, path] = this.shortest_path_cost(place, target);
        if (cost == Infinity){
            return null;
        }
        return path[0];
    }
}



