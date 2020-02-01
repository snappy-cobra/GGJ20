import {Street} from "./Street";
import {GameMap} from "./GameMap";
import {HexPos} from "./HexPos";
import {Cursor} from "./cursor";

export class Game {
    street: Street;
    map: GameMap;
    cursor: Cursor;

    constructor(width: Number, height: Number, street_start: HexPos, street_target: HexPos){
        this.map = new GameMap(width, height);
        this.street = new Street(street_start, street_target);
        this.cursor = new Cursor(new HexPos(10,10), this.map);
    }

    update() {
        this.street.grow(this.map);
    }
}