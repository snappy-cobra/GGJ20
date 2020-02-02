import {Game} from "./Game";

export class MetaGame {
    cur_game: Game;
    width: number;
    height: number;
    lives: number;
    score: number

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.lives = 3;
        this.score = 0;
        this.cur_game = new Game(this, width, height, this.score);
    }

    new_game() {
        this.cur_game = new Game(this, this.width, this.height, this.score)
    }

    win_single_game() {
        this.score += 1;
        console.log("Current score:", this.score);
        this.new_game();
    }

    lost_single_game() {
        this.lives -= 1;
        if (this.lives > 0) {
            this.new_game();
        } else {
            this.lost_the_world();
        }
    }

    lost_the_world() {
        console.log("ALL is lost")
    }

    new_world() {
        this.lives = 3;
        this.new_game()
    }

    update(deltaTime: number) {
        this.cur_game.update(deltaTime)
    }
}