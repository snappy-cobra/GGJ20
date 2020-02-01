
import {DrawTile} from "./drawtile";

export class Tile {
    name: string;
    accessibility: number;
    draw: DrawTile;
    constructor(name: string, accessibility: number, drawtile: DrawTile){
        this.name = name;
        this.accessibility = accessibility;
        this.draw = drawtile;
    }
}
