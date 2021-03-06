import {MapMaker} from "../MapMaker";
import {Direction, HexPos} from "../HexPos";
import {tiles} from "../Tile";

export class Road {
    mapMaker: MapMaker;

    constructor(mapMaker: MapMaker) {
        this.mapMaker = mapMaker;
        let start_pos = this.find_left_start();
        this.set_harbor(start_pos);
        if (this.mapMaker.on_map(start_pos.move(Direction.Left))) {
            this.mapMaker.set_tile(start_pos.move(Direction.Left), new tiles.Boat());
        }
        this.mapMaker.start_road = start_pos;
        let end_pos = this.find_right_end();
        this.set_harbor(end_pos);
        if (this.mapMaker.on_map(end_pos.move(Direction.Right))) {
            this.mapMaker.set_tile(end_pos.move(Direction.Right), new tiles.Boat());
        }
        this.mapMaker.end_road = end_pos;
    }


    set_harbor(pos: HexPos) {
        this.mapMaker.set_tile(pos, new tiles.Harbor())
    }

    placable(pos: HexPos) {
        return this.mapMaker.get_tile(pos) instanceof tiles.Grass;
    }

    find_left_start() {
        for (let x=0; x<this.mapMaker.width; x++) {
            for (let y=0; y<this.mapMaker.height; y+=2) {
                let pos = new HexPos(x, y);
                if (this.placable(pos)) {
                    return pos;
                }
            }
            for (let y=1; y<this.mapMaker.height; y+=2) {
                let pos = new HexPos(x, y);
                if (this.placable(pos)) {
                    return pos;
                }
            }
        }
    }

    find_right_end() {
        for (let x=this.mapMaker.width-1; x>=0; x--) {
            for (let y=1; y<this.mapMaker.height; y+=2) {
                let pos = new HexPos(x, y);
                if (this.placable(pos)) {
                    return pos;
                }
            }
            for (let y=0; y<this.mapMaker.height; y+=2) {
                let pos = new HexPos(x, y);
                if (this.placable(pos)) {
                    return pos;
                }
            }
        }
    }
}
