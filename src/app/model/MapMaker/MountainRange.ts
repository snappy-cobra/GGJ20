import {directions, HexPos} from "../HexPos";
import {MapMaker} from "../MapMaker";
import {tiles} from "../Tile";

export class MountainRange {
    mountain_number: number;
    max_mountain_number: number;
    walking_tile: HexPos;
    mapMaker: MapMaker;

    constructor(mapMaker: MapMaker, start_mountain_number:number, max_mountain_number: number) {
        this.mapMaker = mapMaker;
        this.mountain_number = 0;
        this.max_mountain_number = max_mountain_number;
        this.mountain_init(start_mountain_number);
        this.new_walking_tile();
        this.generate_mountain_range();
    }

    random_mountainless_tile() {
        let hexPos;
        do {
            hexPos = this.mapMaker.random_hexPos();
        } while (this.mapMaker.get_tile(hexPos) instanceof tiles.Mountain);
        return hexPos
    }

    mountain_init(start_amount: number) {
        for (let i=0; i<start_amount; i++) {
            console.log("start");
            this.set_mountain(this.random_mountainless_tile());
        }
    }

    new_walking_tile() {
        this.walking_tile = this.random_mountainless_tile()
    }

    found_location(hexPos: HexPos) {
        if ((hexPos.x < 0 || hexPos.x >= this.mapMaker.width) || (hexPos.y < 0 || hexPos.y >= this.mapMaker.height)) {
            console.log("NOPEEE");
            this.new_walking_tile();
            return
        }
        this.set_mountain(hexPos);
        this.new_walking_tile();
    }

    random_step() {
        let dir = directions[Math.floor(Math.random() * 6)];
        let resulting_pos = this.walking_tile.move(dir);
        let outside_allowed = 2;
        if ((resulting_pos.x < -outside_allowed || resulting_pos.x >= this.mapMaker.width+outside_allowed)
            || (resulting_pos.y < -outside_allowed || resulting_pos.y >= this.mapMaker.height+outside_allowed)) {
            this.new_walking_tile();
            return
        }
        this.walking_tile = this.walking_tile.move(dir);
    }

    mountain_update() {
        for (let n of this.walking_tile.get_neighbours()) {
            //TODO for merge checken of dit nog werkt
            let t = this.mapMaker.get_tile(n);
            if (t != undefined && t instanceof tiles.Mountain) {
                this.found_location(this.walking_tile);
                return;
            }
        }
        this.random_step()
    }

    set_mountain(pos: HexPos) {
        console.log("HIEIEEER", pos);
        this.mapMaker.set_tile(pos, new tiles.Mountain());
        this.mountain_number += 1;
    }

    generate_mountain_range(){
        while (this.mountain_number < this.max_mountain_number) {
            this.mountain_update()
        }
    }
}