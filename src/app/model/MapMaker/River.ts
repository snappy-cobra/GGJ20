import {HexPos} from "../HexPos";
import {MapMaker} from "../MapMaker";
import {tiles} from "../Tile";
import {MountainRange} from "./MountainRange";

export class River{
    mapMaker: MapMaker;

    constructor(mapMaker: MapMaker, num_rivers: Number, possible_starts: HexPos[]) {
        this.mapMaker = mapMaker
        for (let i=0; i<num_rivers; i++) {
            let index = Math.floor(Math.random() * possible_starts.length);
            this.create_river(possible_starts[index]);
            possible_starts.splice(index, 1);
        }
    }

    placable(pos: HexPos) {
        if (this.mapMaker.get_tile(pos) == undefined) {
            return false;
        }
        return !(this.mapMaker.get_tile(pos) instanceof MountainRange);
    }

    set_river(pos: HexPos) {
        this.mapMaker.set_tile(pos, new tiles.River());
    }

    create_river(starter_pos: HexPos) {
        console.log(starter_pos)
        let real_start_point = this.search_start_point(starter_pos);
        this.set_river(real_start_point);
        let real_end_point = this.select_end();
        this.set_river(real_end_point);
        this.generate_river(real_start_point, real_end_point);
    }

    select_end() {
        let x: number;
        let y: number;
        if (Math.floor(Math.random() * 2) % 2) {
            //Case x axis
            if (Math.floor(Math.random() * 2) % 2) {
                y = 0;
            } else {
                y = this.mapMaker.height-1;
            }
            x = Math.floor(Math.random() * this.mapMaker.width)
        } else {
            //Case y axis
            if (Math.floor(Math.random() * 2) % 2) {
                x = 0;
            } else {
                x = this.mapMaker.width-1;
            }
            y = Math.floor(Math.random() * this.mapMaker.height)
        }
        return new HexPos(x, y);
    }

    search_start_point(starter_pos: HexPos) {
        let neighbours = starter_pos.get_neighbours();
        while (true) {
            for (let n of neighbours) {
                if (this.placable(n)) {
                    return n;
                }
            }
            for (let n of neighbours) {
                neighbours.concat(n.get_neighbours())
            }
        }
    }

    generate_river(start: HexPos, end:HexPos) {
        let dir = this.mapMaker.next_dir(start, end)
        console.log(dir)
    }
}