
import {HexPos, Direction} from "./HexPos";

const Y = 8;

export enum TextureType {
    Mountain = 0,
    Grass = 2,
    Forest = 3,
    Street = 4,
    Farm = 5,
    Water = 1,
    Harbor = 6,


    Street_AA = 1*Y+0,      Street_AB = 1*Y+1,      Street_AC = 1*Y+2,      Street_AD = 1*Y+3,      Street_AE = 1*Y+4,      Street_AF = 1*Y+5, 
    Street_BA = Street_AB,  Street_BB = 2*Y+1,      Street_BC = 2*Y+2,      Street_BD = 2*Y+3,      Street_BE = 2*Y+4,      Street_BF = 2*Y+5, 
    Street_CA = Street_AC,  Street_CB = Street_BC,  Street_CC = 3*Y+2,      Street_CD = 3*Y+3,      Street_CE = 3*Y+4,      Street_CF = 3*Y+5, 
    Street_DA = Street_AD,  Street_DB = Street_BD,  Street_DC = Street_CD,  Street_DD = 4*Y+3,      Street_DE = 4*Y+4,      Street_DF = 4*Y+5, 
    Street_EA = Street_AE,  Street_EB = Street_BE,  Street_EC = Street_CE,  Street_ED = Street_DE,  Street_EE = 5*Y+4,      Street_EF = 5*Y+5, 
    Street_FA = Street_AF,  Street_FB = Street_BF,  Street_FC = Street_CF,  Street_FD = Street_DF,  Street_FE = Street_EF,  Street_FF = 6*Y+5, 
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
        else if (typ == TextureType.Water)     {this.animStrength[0] = Math.random();  this.animStrength[1] =  Math.random(); }
        else                                   {this.animStrength[0] = 0;  this.animStrength[1] =  0; }
//         Object.freeze(this);
    }
}
class Street extends Tile {
    constructor(prev: Direction = null, next: Direction = null){
        let tex;
        if (!next){
            var str = "Street_"+(<string>prev)+(<string>prev);
            tex = (<any>TextureType)[str];
        } else {
            var str = "Street_"+(<string>next)+(<string>prev);
            tex = (<any>TextureType)[str];
        }
        super("street", 0, tex);
    }
}

class Mountain extends Tile { constructor(){ super("mountain", 0, TextureType.Mountain); }}
class Forest extends Tile   { constructor(){ super("forest", 0.5, TextureType.Forest); }}
class Grass extends Tile    { constructor(){ super("grass", 1, TextureType.Grass); }}
class Farm extends Tile     { constructor(){ super("farm", 1, TextureType.Farm); }}
class Ocean extends Tile { constructor(){ super("ocean", 0, TextureType.Water); }}

class Harbor extends Tile {
    constructor(){
        super("harbor", 1, TextureType.Harbor);
    }
}

class StreetHead extends Tile {
    target: HexPos;
    prev: Direction
    constructor(target: HexPos, prev: Direction = null){
        let tex = (prev)? (<any>TextureType)["Street_"+(<string>prev)+(<string>prev)] : TextureType.Street;
        super("street", 0, tex);
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
    Ocean,
    Harbor
};
