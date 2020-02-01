import {Street} from "./Street";
import {GameMap} from "./GameMap";
import {HexPos} from "./HexPos";
import {Cursor} from "./cursor";
import {MapMaker} from "./MapMaker";

export class Game {
    street: Street;
    map: GameMap;
    cursor: Cursor;
    mapMaker: MapMaker;

    constructor(width: number, height: number, street_start: HexPos, street_target: HexPos){
        this.mapMaker = new MapMaker(width, height);
        //this.map = new GameMap(width, height, this.mapMaker);
        this.cursor = new Cursor(new HexPos(10,10), this.map);
        this.street = new Street(street_start || new HexPos(0, 0), street_target || new HexPos(width - 1, height - 1));
    }

    update(deltaTime : number) {
        //this.street.grow(this.map, deltaTime);
        this.mapMaker.mapStep();
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
        let grid = this.mapMaker.view();
        return {
            width: this.mapMaker.width,
            height: this.mapMaker.height,
            tiles: grid
        }
    }
}
