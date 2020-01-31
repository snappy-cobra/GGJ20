import {Street} from "./Street";
import {GameMap} from "./GameMap";
import {HexPos} from "./HexPos";

export class Game {
    street: Street;
    map: GameMap;

    constructor(width: Number, height: Number, street_start: HexPos, street_target: HexPos){
        this.map = new GameMap(width, height);
        this.street = new Street(street_start, street_target);
    }

    update() {
        this.street.grow(this.map);
    }
}