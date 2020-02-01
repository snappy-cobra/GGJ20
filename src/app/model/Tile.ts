
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

    constructor(accessibility: number, type: TileType){
        this.accessibility = accessibility;
        this.type = type;
    }


    private static nrs = [1, 0.5, 0];
    public static create(drawtile: TileType){
        return new Tile(this.nrs[drawtile], drawtile);
    }
}
