
import {MountainRange} from "./MapMaker/MountainRange";
import {Tile, tiles} from "./Tile";
import {Forest} from "./MapMaker/Forest";
import {Farm} from "./MapMaker/Farm";
import {Grass} from "./MapMaker/Grass";
import {Road} from "./MapMaker/Road";
import {River} from "./MapMaker/River";
import {Map} from "./Map";

enum Fase {
    mountain,
    forest
}

export class MapMaker extends Map{
    mountainRange: MountainRange;
    forest: Forest;
    farm: Farm;

    constructor(width: number, height: number, intensity: number) {
        let ground: Tile[][] = [];
        for (let x=0; x<width; ++x){
            ground[x] = [];
            for (let y=0; y<height; ++y){
                ground[x][y] = new tiles.Ocean();
            }
        }

        let grass_start = 5;
        let grass_num = 300-intensity*10;

        let mountain_start = 4-Math.floor(intensity/8);
        let mountain_num = 54-Math.floor(Math.sqrt(intensity+1))*4;

        let forest_start = 8;
        let forest_num = 70;

        let rivers_num = 2 + Math.floor(Math.random()*3);

        let farm_start = 1 + Math.floor(intensity/2);
        let farm_num = 13 + intensity*2;

        super(width, height, ground, null, null);
        new Grass(this, grass_start, grass_num);
        console.log("Builded Grass");
        new Road(this);
        console.log("Builded Harbors");
        this.mountainRange = new MountainRange(this, mountain_start, mountain_num);
        console.log("Builded Mountains");
        this.forest = new Forest(this, forest_start, forest_num);
        console.log("Builded Forest");
        new River(this, rivers_num, this.mountainRange.mountain_startpoints);
        console.log("Builded Rivers");
        this.farm = new Farm(this, farm_start, farm_num);
        console.log("Builded Farms");

        if (!this.shortest_path_cost(this.start_road, this.end_road)) {
            console.log("Invalid map, generating new one");
        }
    }
}

export function make_map(width: number, height: number, intensity: number) {
    let mapMaker: MapMaker;
    do {
        mapMaker = new MapMaker(width, height, intensity)
    } while (!mapMaker.shortest_path_cost(mapMaker.start_road, mapMaker.end_road));
    return mapMaker;
}