import {Game} from "./Game";
import {HexPos} from "./HexPos";

export function model_main() {
    let game = new Game(20, 20, new HexPos(0,0,), new HexPos(2,3));
    game.update()
}







