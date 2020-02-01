

export enum TileType {
    Mountain = 0,
    Grass = 1,
    Forest = 2,
    Farm = 3,
    Street = 4
}

export class DrawTile {
    public type: TileType;

    constructor(typ: TileType) {
        this.type = typ;
    }
}

