import {HexPos} from "./HexPos";

export function add_cursor() {
    return new Cursor(new HexPos(10,10));
}

export class Cursor {
    position: HexPos;

    constructor(position: HexPos) {
        this.position = position;

        document.addEventListener('keydown', this.key_down_function.bind(this));
    }

    key_down_function(event: KeyboardEvent) {
        console.log(this.position)
        if (event.code == 'KeyW') {
            this.position.x -= 1;
            this.position.y += 1;
        }
        if (event.code == 'KeyE') {
            this.position.y += 1;
        }
        if (event.code == 'KeyD') {
            this.position.x += 1;
        }
        if (event.code == 'KeyX') {
            this.position.x += 1;
            this.position.y -= 1;
        }
        if (event.code == 'KeyZ') {
            this.position.y -= 1;
        }
        if (event.code == 'KeyA') {
            this.position.x -= 1;
        }
    }
}