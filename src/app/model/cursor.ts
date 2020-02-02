import {HexPos, Direction} from "./HexPos";
import {GameMap} from "./GameMap";
import {tiles} from "./Tile";

export function add_cursor(gameMap: GameMap) {
    return new Cursor(new HexPos(10,10), gameMap);
}

export class Cursor {
    position: HexPos;
    gameMap: GameMap;
    has_mountain: boolean;

    constructor(position: HexPos, gameMap: GameMap) {
        this.position = position;
        this.gameMap = gameMap;
        this.has_mountain = false;
    }

    on_input (code: string) {
        if (code == "KeyW") {this.position = this.position.move(Direction.TopLeft);}
        if (code == "KeyE") {this.position = this.position.move(Direction.TopRight);}
        if (code == "KeyD") {this.position = this.position.move(Direction.Right);}
        if (code == "KeyX") {this.position = this.position.move(Direction.BottomRight);}
        if (code == "KeyZ") {this.position = this.position.move(Direction.BottomLeft);}
        if (code == "KeyA") {this.position = this.position.move(Direction.Left);}
        if (code == 'Enter'){this.onclick();}
        if (code == "mouse"){this.onclick();}
    }
        
    onclick(){
        if (this.has_mountain){
            if (this.gameMap.place_mountain(this.position)){
                // success
                this.has_mountain = false;
            }
        } else {
            if (this.gameMap.grab_mountain(this.position)){
                this.has_mountain = true;
            }
        }
    }
}
    
