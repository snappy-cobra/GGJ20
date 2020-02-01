import {Street} from "./Street";
import {GameMap} from "./GameMap";
import {HexPos} from "./HexPos";
import {Cursor} from "./cursor";

const DELAY = 1;

export class Game {
//     street: Street;
    map: GameMap;
    cursor: Cursor;
    wait: number = 0;

    constructor(width: number, height: number, street_start: HexPos, street_target: HexPos){
        this.map = new GameMap(width, height);
        this.cursor = new Cursor(new HexPos(10,10), this.map);
//         this.street = new Street(street_start || new HexPos(0, 0), street_target || new HexPos(width - 1, height - 1));
    }

    update(deltaTime : number) {
//         this.street.grow(this.map, deltaTime);
        this.wait =- deltaTime;
        if (this.wait > 0){
            return;
        }
        this.wait += DELAY;
        this.map.update()
    }
    
    view() {
        let grid = this.map.view();
        // todo: include street
        return {
            width: this.map.width,
            height: this.map.height,
            tiles: grid
        }
    }
}
