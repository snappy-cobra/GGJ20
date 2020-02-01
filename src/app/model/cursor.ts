import {HexPos, Direction} from "./HexPos";
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
        if (event.code == "KeyW"){this.position = this.position.move(Direction.TopLeft);}
        if (event.code == "KeyE"){this.position = this.position.move(Direction.TopRight);}
        if (event.code == "KeyD"){this.position = this.position.move(Direction.Right);}
        if (event.code == "KeyX"){this.position = this.position.move(Direction.BottomRight);}
        if (event.code == "KeyZ"){this.position = this.position.move(Direction.BottomLeft);}
        if (event.code == "KeyA"){this.position = this.position.move(Direction.Left);}
        console.log(this.position);
        if (event.code == 'Enter') {
            this.gameMap.place_mountain(this.position)
        }
    }
}
