export enum TileType {
    berg = 0,
    gras = 1,
    bos = 2,
    farm = 3,
}

export class Tile {
    public type: TileType;

    constructor() {
        this.type = (Math.random() < 0.5)? TileType.berg : TileType.gras;
    }
}

export class MooieCode {
    public tiles: Tile[][];
    public width = 20;
    public height = 20;

    constructor() {
        this.tiles = [];

        for(var x: number = 0; x < this.width; x++) {
            this.tiles[x] = [];
            for(var y: number = 0; y < this.height; y++) {
                this.tiles[x][y] = new Tile();
            }
        }
    }
}