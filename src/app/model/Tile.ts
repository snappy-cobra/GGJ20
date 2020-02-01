export enum TileType {
    Mountain = 0,
    Grass = 1,
    Forest = 2,
    Farm = 3,
    Street = 4
}

export class Tile {
    accessibility: number;
    name: string; // for debugging
    type: TileType;
    animStrength: Float32Array;

    private static nranimStrengths = [[0,0], [0,0], [0,0]];
    constructor(name: string, accessibility: number, typ: TileType){
        this.accessibility = accessibility;
        this.name = name;
        this.type = typ;
        this.animStrength = new Float32Array(2);
        if (typ == TileType.Mountain)       {this.animStrength[0] = 0;  this.animStrength[1] = 0; }
        else if (typ == TileType.Grass)     {this.animStrength[0] = 1;  this.animStrength[1] = 0; }
        else if (typ == TileType.Forest)    {this.animStrength[0] = 0;  this.animStrength[1] = 1; }
        else if (typ == TileType.Farm)      {this.animStrength[0] = 1;  this.animStrength[1] = 1; }
        else                                {this.animStrength[0] = Math.random();  this.animStrength[1] =  Math.random(); }
        Object.freeze(this);
    }
}

export var tiles = {
    Street: ()=> new Tile("street", 0, TileType.Street),
    Grass: ()=> new Tile("grass", 1, TileType.Grass),
    Mountain: ()=> new Tile("mountain", 0.01, TileType.Mountain),
    Forest: ()=> new Tile("forest", 0.5, TileType.Forest),
    Farm: ()=> new Tile("farm", 1, TileType.Farm)
}
