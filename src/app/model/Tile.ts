export enum TextureType {
    Mountain = 0,
    Grass = 1,
    Forest = 2,
    Farm = 3,
    Street = 4,

    Sreet_AA = 4, Sreet_AB = 4, Sreet_AC = 4, Sreet_AD = 4, Sreet_AE = 4, Sreet_AF = 4,
    Sreet_BA = 4, Sreet_BB = 4, Sreet_BC = 4, Sreet_BD = 4, Sreet_BE = 4, Sreet_BF = 4,
    Sreet_CA = 4, Sreet_CB = 4, Sreet_CC = 4, Sreet_CD = 4, Sreet_CE = 4, Sreet_CF = 4,
    Sreet_DA = 4, Sreet_DB = 4, Sreet_DC = 4, Sreet_DD = 4, Sreet_DE = 4, Sreet_DF = 4,
    Sreet_EA = 4, Sreet_EB = 4, Sreet_EC = 4, Sreet_ED = 4, Sreet_EE = 4, Sreet_EF = 4,
    Sreet_FA = 4, Sreet_FB = 4, Sreet_FC = 4, Sreet_FD = 4, Sreet_FE = 4, Sreet_FF = 4,
}

export class Tile {
    accessibility: number;
    name: string; // for debugging
    type: TextureType;
    animStrength: Float32Array;

    private static nranimStrengths = [[0,0], [0,0], [0,0]];
    constructor(name: string, accessibility: number, typ: TextureType){
        this.accessibility = accessibility;
        this.name = name;
        this.type = typ;
        this.animStrength = new Float32Array(2);
        if (typ == TextureType.Mountain)       {this.animStrength[0] = 0;  this.animStrength[1] = 0; }
        else if (typ == TextureType.Grass)     {this.animStrength[0] = 1;  this.animStrength[1] = 0; }
        else if (typ == TextureType.Forest)    {this.animStrength[0] = 0;  this.animStrength[1] = 1; }
        else if (typ == TextureType.Farm)      {this.animStrength[0] = 1;  this.animStrength[1] = 1; }
        else                                   {this.animStrength[0] = Math.random();  this.animStrength[1] =  Math.random(); }
        Object.freeze(this);
    }
}

export var tiles = {
    Street: ()=> new Tile("street", 0, TextureType.Street),
    Grass: ()=> new Tile("grass", 1, TextureType.Grass),
    Mountain: ()=> new Tile("mountain", 0.01, TextureType.Mountain),
    Forest: ()=> new Tile("forest", 0.5, TextureType.Forest),
    Farm: ()=> new Tile("farm", 1, TextureType.Farm)
}
