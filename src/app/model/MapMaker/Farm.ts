import {MapMaker} from "../MapMaker";
import {HexPos} from "../HexPos";
import {Tile, tiles} from "../Tile";

export class Farm {
    mapMaker: MapMaker;
    cur_farm_number: number;
    max_farm_number: number;
    max_tries = 100;

    constructor(mapMaker: MapMaker, start_forest_number:number, max_forest_number: number) {
        this.mapMaker = mapMaker;
        this.cur_farm_number = 0;
        this.max_farm_number = max_forest_number;
        this.farm_init(start_forest_number);
        this.generate_farm();
    }

    farm_init(start_amount: number){
        for (let i=0; i<start_amount; i++) {
            this.set_farm(this.random_farm_tile());
        }
    }

    set_farm(pos: HexPos) {
        this.mapMaker.set_tile(pos, new tiles.Farm());
        this.cur_farm_number += 1;
    }

    random_farm_tile() {
        let hexPos;
        do {
            hexPos = this.mapMaker.somewhere_center_pos();
        } while (this.mapMaker.get_tile(hexPos) instanceof tiles.Grass);
        return hexPos
    }

    current_farms() {
        let valid_positions = this.mapMaker.valid_positions();
        let all_farms = [];
        for (let pos of valid_positions) {
            if (this.mapMaker.get_tile(pos) instanceof tiles.Farm) {
                all_farms.push(pos)
            }
        }
        return all_farms
    }

    try_placing_farm(pos: HexPos) {
        if (!this.mapMaker.on_map(pos)) {
            return
        }
        if (this.mapMaker.get_tile(pos) instanceof tiles.Grass){
            this.set_farm(pos);
        }
    }


    farm_update() {
        let all_farms = this.current_farms();
        let neighbour_positions :HexPos[] = [];
        for (let farm of all_farms) {
            neighbour_positions = neighbour_positions.concat(farm.get_neighbours())
        }
        for (let n of neighbour_positions) {
            if (this.cur_farm_number >= this.max_farm_number) {
                return
            }
            this.try_placing_farm(n);
        }
    }

    generate_farm() {
        let tries = 0;
        while (this.cur_farm_number < this.max_farm_number) {
            this.farm_update();
            if (tries > this.max_tries) {
                this.farm_init(1);
                tries = 0;
            }
            tries += 1;
        }
    }
}