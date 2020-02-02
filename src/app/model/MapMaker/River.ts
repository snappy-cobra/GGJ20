import {Direction, directions, HexPos, invert} from "../HexPos";
import {MapMaker} from "../MapMaker";
import {tiles, TextureType, Tile} from "../Tile";

export class River{
    mapMaker: MapMaker;

    constructor(mapMaker: MapMaker, num_rivers: Number, possible_starts: HexPos[]) {
        this.mapMaker = mapMaker;
        for (let i=0; i<num_rivers; i++) {
            let index = Math.floor(Math.random() * possible_starts.length);
            this.create_river(possible_starts[index]);
            possible_starts.splice(index, 1);
        }
    }

    placable(pos: HexPos) {
        let tile = this.mapMaker.get_tile(pos);
        if (tile == undefined) {
            return false;
        }
        return !(tile instanceof tiles.Mountain || tile instanceof tiles.River || tile instanceof tiles.Harbor);
    }

    set_river(pos: HexPos, in_dir: Direction, out_dir: Direction) {
        if (TextureType[this.mapMaker.get_tile(pos).type].toString().startsWith("River_"))
            this.mapMaker.set_tile(pos, new Tile("River_CROSSINS", 0.125, TextureType.River_CROSSINS));
        else
            this.mapMaker.set_tile(pos, new tiles.River(out_dir, in_dir));
    }

    create_river(starter_pos: HexPos) {
        console.log(starter_pos);
        let real_start_point = this.search_start_point(starter_pos);
        //this.set_river(real_start_point, null, null);
        let real_end_point = this.select_end();
        //this.set_river(real_end_point, null, null);
        if (real_start_point != undefined) {
            this.generate_river(real_start_point, real_end_point);
        }
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
        let cur = start;
        let prev_dir = null;
        for (let i=0; i<40; i++) {
            for (let d of directions) {
                let n = cur.move(d);
                let tile = this.mapMaker.get_tile(n);
                if (tile == undefined) {
                    return
                } else if (tile instanceof tiles.Ocean) {
                    this.set_river(cur, prev_dir, d);
                    return;
                }
            }
            let dir = this.mapMaker.next_dir(cur, end);
            if (dir == undefined) {
                return;
            }
            this.set_river(cur, prev_dir, dir);
            cur = cur.move(dir);
            prev_dir = invert(dir);
        }
    }
}