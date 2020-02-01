import {GameMap} from "./GameMap";
import {MountainRange} from "./MapMaker/MountainRange";
import {Tile, tiles} from "./Tile";
import {Forest} from "./MapMaker/Forest";
import {Farm} from "./MapMaker/Farm";
import {Grass} from "./MapMaker/Grass";
import {Road} from "./MapMaker/Road";
import {River} from "./MapMaker/River";

enum Fase {
    mountain,
    forest
}

export class MapMaker extends GameMap{
    mountainRange: MountainRange;
    forest: Forest;
    farm: Farm;

    constructor(width: number, height: number) {
        let ground: Tile[][] = [];
        for (let x=0; x<width; ++x){
            ground[x] = [];
            for (let y=0; y<height; ++y){
                ground[x][y] = new tiles.Ocean();
            }
        }
        super(width, height, ground, null, null);
        new Grass(this,5, 300);
        console.log("Builded Grass");
        new Road(this);
        console.log("Builded Harbors");
        this.mountainRange = new MountainRange(this, 4,50);
        console.log("Builded Mountains");
        this.forest = new Forest(this, 8, 70);
        console.log("Builded Forest");
        new River(this, 2, this.mountainRange.mountain_startpoints);
        console.log("Builded Rivers");
        this.farm = new Farm(this, 1, 15);
        console.log("Builded Farms")
    }

    mapStep() {
        //this.mountainRange.mountain_update();
    }
}