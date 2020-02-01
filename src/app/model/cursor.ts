import {HexPos} from "./HexPos";
import {GameMap} from "./GameMap";

export function add_cursor(gameMap: GameMap) {
    return new Cursor(new HexPos(10,10), gameMap);
}

export class Cursor {
    position: HexPos;
    gameMap: GameMap;

    constructor(position: HexPos, gameMap: GameMap) {
        this.position = position;
        this.gameMap = gameMap;

        document.addEventListener('keydown', this.key_down_function.bind(this));
    }

    key_down_function(event: KeyboardEvent) {
        console.log(this.position)
        if (event.code == 'KeyW') {
            this.position.x -= 1;
            this.position.y += 1;
        }
        if (event.code == 'KeyE') {
            this.position.y += 1;
        }
        if (event.code == 'KeyD') {
            this.position.x += 1;
        }
        if (event.code == 'KeyX') {
            this.position.x += 1;
            this.position.y -= 1;
        }
        if (event.code == 'KeyZ') {
            this.position.y -= 1;
        }
        if (event.code == 'KeyA') {
            this.position.x -= 1;
        }
        if (event.code == 'Enter') {
            this.gameMap.place_mountain(this.position)
        }
    }
}