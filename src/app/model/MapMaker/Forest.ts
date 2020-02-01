import {MapMaker} from "../MapMaker";
import {HexPos} from "../HexPos";
import {Tile, tiles} from "../Tile";

export class Forest {
    mapMaker: MapMaker;
    cur_forest_number: number;
    max_forest_number: number;

    constructor(mapMaker: MapMaker, start_forest_number:number, max_forest_number: number) {
        this.mapMaker = mapMaker;
        this.cur_forest_number = 0;
        this.max_forest_number = max_forest_number;
        this.forest_init(start_forest_number);
        this.generate_forest();
    }

    forest_init(start_amount: number){
        for (let i=0; i<start_amount; i++) {
            this.set_forest(this.random_forestless_tile());
        }
    }

    set_forest(pos: HexPos) {
        this.mapMaker.set_tile(pos, new tiles.Forest());
        this.cur_forest_number += 1;
    }

    random_forestless_tile() {
        let hexPos;
        do {
            hexPos = this.mapMaker.random_hexPos();
        } while (this.mapMaker.get_tile(hexPos) instanceof tiles.Mountain || this.mapMaker.get_tile(hexPos) instanceof tiles.Forest);
        return hexPos
    }

    grow_forest_neighbour(hexPos: HexPos) {
        let suitable_neighbours = [];
        for (let n of hexPos.get_neighbours()) {
            let tile = this.mapMaker.get_tile(n);
            if (tile == undefined) {
                continue;
            }
            if (tile instanceof tiles.Mountain || tile instanceof tiles.Forest) {
                continue;
            }
            suitable_neighbours.push(n);
        }
        if (suitable_neighbours.length < 1) {
            return
        }
        let winner = suitable_neighbours[Math.floor(Math.random() * suitable_neighbours.length)];
        this.set_forest(winner);
    }

    forest_update() {
        let hexPos: HexPos;
        do {
            hexPos = this.mapMaker.random_hexPos();
        } while (!(this.mapMaker.get_tile(hexPos) instanceof tiles.Forest));
        this.grow_forest_neighbour(hexPos)
    }

    generate_forest() {
        while (this.cur_forest_number < this.max_forest_number) {
            this.forest_update()
        }
    }
}