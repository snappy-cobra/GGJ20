import {directions, HexPos} from "../HexPos";
import {Tile, TileType} from "../Tile";
import {MapMaker} from "../MapMaker";

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
        } while (this.mapMaker.get_tile(hexPos).type == TileType.Mountain);
        return hexPos
    }

    mountain_init(start_amount: number) {
        for (let i=0; i<start_amount; i++) {
            this.mapMaker.set_tile(this.random_mountainless_tile(), new Tile(1, TileType.Mountain));
            this.mountain_number += 1;
        }
    }

    new_walking_tile() {
        this.walking_tile = this.random_mountainless_tile()
    }

    found_location(hexPos: HexPos) {
        //TODO: CHECK BIJ MERGE
        this.mapMaker.set_tile(hexPos, new Tile(0, TileType.Mountain));
        this.mountain_number += 1;
        this.new_walking_tile()
    }

    random_step() {
        let dir = directions[Math.floor(Math.random() * 6)];
        let resulting_pos = this.walking_tile.move(dir);
        if ((resulting_pos.x < 0 || resulting_pos.x > this.mapMaker.width) || (resulting_pos.y < 0 || resulting_pos.y > this.mapMaker.height)) {
            this.new_walking_tile();
            return
        }
        this.walking_tile = this.walking_tile.move(dir);
    }

    mountain_update() {
        for (let n of this.walking_tile.get_neighbours()) {
            //TODO for merge checken of dit nog werkt
            let t = this.mapMaker.get_tile(n);
            if (t != undefined && t.type == TileType.Mountain) {
                this.found_location(this.walking_tile);
                return;
            }
        }
        this.random_step()
    }

    generate_mountain_range(){
        while (this.mountain_number < this.max_mountain_number) {
            this.mountain_update()
        }
    }
}