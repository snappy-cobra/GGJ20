import {Game} from "./Game";

let END_DELAY = 3000; // milliseconds

export class MetaGame {
    cur_game: Game;
    width: number;
    height: number;
    lives: number;
    score: number;
    paused: boolean;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.lives = 3;
        this.score = 0;
        this.paused = false;
        this.cur_game = new Game(this, width, height);
    }

    new_game() {
        this.cur_game = new Game(this, this.width, this.height)
    }

    win_single_game() {
        this.paused = true;
        setTimeout(()=>{
            this.score += 1;
            console.log("Current score:", this.score);
            this.new_game();
            this.paused = false;
        }, END_DELAY);
    }

    lost_single_game() {
        this.paused = true;
        setTimeout(()=>{
            this.lives -= 1;
            if (this.lives > 0) {
                this.new_game();
            } else {
                this.lost_the_world();
            }
            this.paused = false;
        }, END_DELAY);
    }

    lost_the_world() {
        console.log("ALL is lost")
    }

    new_world() {
        this.lives = 3;
        this.new_game()
    }

    update(deltaTime: number) {
        if (!this.paused){
            this.cur_game.update(deltaTime)
        }
    }
}
