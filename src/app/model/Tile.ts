
import {HexPos, Direction} from "./HexPos";

export enum TextureType {
    Mountain = 0,
    Grass = 2,
    Forest = 3,
    Street = 4,
    Farm = 5,


    Street_AA = 4, Street_AB = 4, Street_AC = 4, Street_AD = 4, Street_AE = 4, Street_AF = 4,
    Street_BA = 4, Street_BB = 4, Street_BC = 4, Street_BD = 4, Street_BE = 4, Street_BF = 4,
    Street_CA = 4, Street_CB = 4, Street_CC = 4, Street_CD = 4, Street_CE = 4, Street_CF = 4,
    Street_DA = 4, Street_DB = 4, Street_DC = 4, Street_DD = 4, Street_DE = 4, Street_DF = 4,
    Street_EA = 4, Street_EB = 4, Street_EC = 4, Street_ED = 4, Street_EE = 4, Street_EF = 4,
    Street_FA = 4, Street_FB = 4, Street_FC = 4, Street_FD = 4, Street_FE = 4, Street_FF = 4,
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
//         Object.freeze(this);
    }
}
class Street extends Tile {
    constructor(prev: Direction = null, next: Direction = null){
        let tex;
        if (!prev || !next){
            tex = TextureType.Street;
        } else {
            console.log(prev, next);
            tex = TextureType["Street_"+(<string>prev)+(<string>next)];
        }
        super("street", 0, TextureType.Street);
    }
}

class Mountain extends Tile {
    constructor(){
        super("mountain", 0, TextureType.Mountain);
    }
}

class Forest extends Tile {
    constructor(){
        super("forest", 0.5, TextureType.Forest);
    }
}

class Grass extends Tile {
    constructor(){
        super("grass", 1, TextureType.Grass);
    }
}

class Farm extends Tile {
    constructor(){
        super("farm", 1, TextureType.Farm);
    }
}

class StreetHead extends Tile {
    target: HexPos;
    prev: Direction
    constructor(target: HexPos, prev: Direction = null){
        super("street", 0, TextureType.Street);
        this.target = target;
        this.prev = prev;
    }
}

export var tiles = {
    Street,
    Grass,
    Mountain,
    Forest,
    Farm,
    StreetHead,
};
