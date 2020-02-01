import {HexPos} from "./HexPos";
import {vector2d_from_hex} from './Vector2d'
import {GameMap} from "./GameMap";
import { tiles} from "./Tile";

export class Street {
    head: HexPos;
    tail: HexPos[];
    target: HexPos;
    nextGrowTime: number = 0;
    time: number = 0;

    constructor(begin: HexPos, end: HexPos){
        this.head = begin;
        this.tail = [];
        this.target = end;
    }

    grow(map: GameMap, deltaTime : number){
        this.time += deltaTime;
        if (this.nextGrowTime < this.time) {   
            this.nextGrowTime = this.time + 0.1;

            let next = map.next_tile(this.head, this.target);
            if (next){
                map.ground[next.x][next.y] = tiles.Street;
                this.tail.push(this.head);
                this.head = next;
            }
        }
    }

    next_tile_thijs(goal: HexPos) {
        let vec_a_factor = 0.2;
        let vec_a = vector2d_from_hex(this.head, goal).unit().multiply_scalar(vec_a_factor);

        let max_value = -1;
        let max_neighbour = null;

        let neighbours = this.head.get_neighbours();
        for (let n of neighbours) {
            let vec_n = vector2d_from_hex(this.head, n);
            let cur_value = vec_n.sum(vec_a).magnitude();
            console.log(n.x, n.y, cur_value);
            if (cur_value > max_value) {
                max_value = cur_value;
                max_neighbour = n;
            }
        }
        return max_neighbour
    }
}
