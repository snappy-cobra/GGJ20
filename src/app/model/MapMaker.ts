import {GameMap} from "./GameMap";
import {MountainRange} from "./MapMaker/MountainRange";
import {Tile, tiles} from "./Tile";

enum Fase {
    mountain,
    grass
}

export class MapMaker extends GameMap{
    fase: Fase;
    mountainRange: MountainRange;

    constructor(width: number, height: number) {
        let ground: Tile[][] = [];
        for (let x=0; x<width; ++x){
            ground[x] = [];
            for (let y=0; y<height; ++y){
                ground[x][y] = new tiles.Grass();
            }
        }
        super(width, height, ground);
        this.fase = Fase.mountain;
        this.mountainRange = new MountainRange(this, 4,40)
    }

    mapStep() {
        //this.mountainRange.mountain_update();
    }
}