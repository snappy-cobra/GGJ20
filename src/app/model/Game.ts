import {Street} from "./Street";
import {GameMap} from "./GameMap";
import {Direction, HexPos} from "./HexPos";
import {Cursor} from "./cursor";
import {make_map, MapMaker} from "./MapMaker";
import {MetaGame} from "./MetaGame";

const DELAY_FAST = 0.25;
const DELAY_NORMAL = 1;

export class Game {
//     street: Street;
    meta_game: MetaGame;
    map: GameMap;
    cursor: Cursor;
    mapMaker: MapMaker;
    delay: number;
    wait: number = 3;

    constructor(meta_game: MetaGame, width: number, height: number, intensity: number) {
        this.meta_game = meta_game;
        this.mapMaker = make_map(width, height, intensity);
        this.map = new GameMap(this, width, height, this.mapMaker.ground, this.mapMaker.start_road, this.mapMaker.end_road);
        //this.map = new GameMap(width, height, this.mapMaker);
        this.cursor = new Cursor(new HexPos(10,10), this.map);
        document.addEventListener('keydown', this.speed_up.bind(this));
        document.addEventListener('keyup', this.speed_down.bind(this));
        this.delay = DELAY_NORMAL;
//         this.street = new Street(street_start || new HexPos(0, 0), street_target || new HexPos(width - 1, height - 1));
    }

    update(deltaTime : number) {
        //this.street.grow(this.map, deltaTime);
        // TODO: WAT DOET DIT: this.mapMaker.mapStep();
//         this.street.grow(this.map, deltaTime);
        this.wait -= deltaTime;
        if (this.wait > 0){
            return;
        }
        this.wait += this.delay;
        this.map.update()
    }

    speed_up(event: KeyboardEvent) {
        if (event.code == "Space") {
            this.delay = DELAY_FAST;
            this.wait = Math.min(this.delay, this.wait);
        }
    }

    speed_down(event: KeyboardEvent) {
        if (event.code == "Space") {
            this.delay = DELAY_NORMAL;
        }
    }

    level_won() {
        this.meta_game.win_single_game()
    }

    level_lost() {
        console.log("ITS LOSSST")
        this.meta_game.lost_single_game()
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
