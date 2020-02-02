import SONG_1_PATH from '../../music/song_1.wav';

const NUM_SONGS = 1;

export class MusicPlayer {

    playlist : HTMLAudioElement[];
    load_count: number;

    constructor() {
        this.playlist = [];
        this.load_count = 0;
        let audio: HTMLAudioElement = new Audio(SONG_1_PATH);
        audio.addEventListener('loadeddata', () => {
            this.load_count++;
        });
        audio.addEventListener('ended', () => {
            this.play_random_song();
        });

        this.playlist.push(audio);
    }

    play() {
        if (this.load_count != NUM_SONGS) {
            setTimeout(function() { this.play() }, 200)
            return;
        }
        this.play_random_song();
    }

    play_random_song() {
        let random_pick = Math.floor((Math.random() * this.playlist.length));
        this.playlist[random_pick].play();
    }
}