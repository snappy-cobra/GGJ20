import {MapMaker} from "../MapMaker";
import {HexPos} from "../HexPos";
import {Tile, tiles} from "../Tile";

export class Grass {
    mapMaker: MapMaker;
    cur_grass_number: number;
    max_grass_number: number;
    max_tries = 100;

    constructor(mapMaker: MapMaker, start_forest_number:number, max_forest_number: number) {
        this.mapMaker = mapMaker;
        this.cur_grass_number = 0;
        this.max_grass_number = max_forest_number;
        this.grass_init(start_forest_number);
        this.generate_grass();
    }

    placable(pos: HexPos) {
        return this.mapMaker.get_tile(pos) instanceof tiles.Ocean
    }

    grass_init(start_amount: number){
        for (let i=0; i<start_amount; i++) {
            this.set_grass(this.random_grass_tile());
        }
    }

    set_grass(pos: HexPos) {
        this.mapMaker.set_tile(pos, new tiles.Grass());
        this.cur_grass_number += 1;
    }

    random_grass_tile() {
        let hexPos;
        do {
            hexPos = this.mapMaker.somewhere_center_pos();
        } while (this.mapMaker.get_tile(hexPos) instanceof tiles.Grass);
        return hexPos
    }

    current_grasss() {
        let valid_positions = this.mapMaker.valid_positions();
        let all_grasss = [];
        for (let pos of valid_positions) {
            if (this.mapMaker.get_tile(pos) instanceof tiles.Grass) {
                all_grasss.push(pos)
            }
        }
        return all_grasss
    }

    try_placing_grass(pos: HexPos) {
        if (!this.mapMaker.on_map(pos)) {
            return
        }
        if (this.placable(pos)){
            this.set_grass(pos);
        }
    }


    grass_update() {
        let all_grass = this.current_grasss();
        let neighbour_positions :HexPos[] = [];
        for (let grass of all_grass) {
            neighbour_positions = neighbour_positions.concat(grass.get_neighbours())
        }
        for (let n of neighbour_positions) {
            if (this.cur_grass_number >= this.max_grass_number) {
                return
            }
            this.try_placing_grass(n);
        }
    }

    generate_grass() {
        let tries = 0;
        while (this.cur_grass_number < this.max_grass_number) {
            this.grass_update();
            if (tries > this.max_tries) {
                this.grass_init(1);
                tries = 0;
            }
            tries += 1;
        }
    }
}