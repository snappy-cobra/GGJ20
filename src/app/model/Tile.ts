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
    animStrength: Float32Array;

    private static nranimStrengths = [[0,0], [0,0], [0,0]];
    constructor(accessibility: number, type: TileType){
        this.accessibility = accessibility;
        this.type = type;
        this.animStrength = new Float32Array(2);
        if (type == TileType.Mountain)  {this.animStrength[0] = 0;  this.animStrength[1] = 0; }
        else if (type == TileType.Grass)     {this.animStrength[0] = 1;  this.animStrength[1] = 0; }
        else if (type == TileType.Forest)    {this.animStrength[0] = 0;  this.animStrength[1] = 1; }
        else if (type == TileType.Farm)      {this.animStrength[0] = 1;  this.animStrength[1] = 1; }
        else                            {this.animStrength[0] = Math.random();  this.animStrength[1] =  Math.random(); }
    }


    private static nrs = [1, 0.5, 0];
    public static create(drawtile: TileType){
        return new Tile(this.nrs[drawtile], drawtile);
    }
}
