
export enum TileType {
    Mountain = 0,
    Grass = 2,
    Forest = 3,
    Farm = 5,
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
