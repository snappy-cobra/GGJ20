
export enum TileType {
    Mountain = 0,
    Grass = 1,
    Forest = 2,
    Farm = 3,
    Street = 4
}

export class Tile {
    accessibility: number;
    type: TileType;
    name: string; // for debugging

    constructor(name: string, accessibility: number, typ: TileType){
        this.accessibility = accessibility;
        this.type = typ;
        this.name = name;
    }
}

export var tiles = {
    Street: new Tile("street", 0, TileType.Street),
    Grass: new Tile("grass", 1, TileType.Grass),
    Mountain: new Tile("mountain", 0, TileType.Mountain),
    Forest: new Tile("forest", 0.5, TileType.Forest),
    Farm: new Tile("farm", 1, TileType.Farm)
}
