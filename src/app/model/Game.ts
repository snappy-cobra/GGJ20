import {Street} from "./Street";
import {GameMap} from "./GameMap";
import {HexPos} from "./HexPos";
import {Cursor} from "./cursor";
import {MapMaker} from "./MapMaker";

const DELAY = 2;

export class Game {
//     street: Street;
    map: GameMap;
    cursor: Cursor;
    mapMaker: MapMaker;
    wait: number = DELAY;

    constructor(width: number, height: number, street_start: HexPos, street_target: HexPos){
        this.mapMaker = new MapMaker(width, height);
        this.map = new GameMap(width, height, this.mapMaker.ground);
        //this.map = new GameMap(width, height, this.mapMaker);
        this.cursor = new Cursor(new HexPos(10,10), this.map);
//         this.street = new Street(street_start || new HexPos(0, 0), street_target || new HexPos(width - 1, height - 1));
    }

    update(deltaTime : number) {
        //this.street.grow(this.map, deltaTime);
        this.mapMaker.mapStep();
//         this.street.grow(this.map, deltaTime);
        this.wait -= deltaTime;
        if (this.wait > 0){
            return;
        }
        this.wait += DELAY;
        this.map.update()
    }
    
    view() {
        // todo: change this back to map
        /*let grid = this.map.view();
        // todo: include street
        return {
            width: this.map.width,
            height: this.map.height,
            tiles: grid
        }*/
        let grid = this.map.view();
        return {
            width: this.map.width,
            height: this.map.height,
            tiles: grid
        }
    }
}
