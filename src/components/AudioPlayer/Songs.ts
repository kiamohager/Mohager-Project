import goodNight from "../../audio/good-night.mp3";
import greaterThanOne from "../../audio/greater-than-one.mp3";
import outOfTime from "../../audio/out-of-time.mp3";
import tryingToFeelAlive from "../../audio/trying-to-feel-alive.mp3";
import enjoyTheShow from "../../audio/enjoy-the-show.mp3";

export type Song = {
    index: number;
    title: string;
    albumImg: string | null;
    audioFile: string;
};

type SongMap = {
    [title: string]: Song;
};

export const songs: SongMap = {
    "Good-Night": {
        index: 0,
        title: "Good-Night",
        albumImg: "https://images.pexels.com/photos/266604/pexels-photo-266604.jpeg?cs=srgb&dl=pexels-pixabay-266604.jpg&fm=jpg",
        audioFile: goodNight
    },
    "Greater Than One": {
        index: 1,
        title: "Greater Than One",
        albumImg: "https://images.genius.com/4e894524053564ac5301858a4744cc89.1000x1000x1.png",
        audioFile: greaterThanOne
    },
    "Out of Time": {
        index: 2,
        title: "Out of Time",
        albumImg:
            "https://media.pitchfork.com/photos/61d5fa911b710fb5ce48ed9f/master/pass/The-Weeknd-Dawn-FM.jpg",
        audioFile: outOfTime
    },
    "Trying to Feel Alive": {
        index: 3,
        title: "Trying to Feel Alive",
        albumImg: "https://upload.wikimedia.org/wikipedia/en/0/07/Porter_Robinson_-_Nurture.png",
        audioFile: tryingToFeelAlive
    },
    "Enjoy the Show": {
        index: 4,
        title: "Enjoy the Show",
        albumImg: "https://i.scdn.co/image/ab67616d0000b273982320da137d0de34410df61",
        audioFile: enjoyTheShow
    }
};

export const playlist: string[] = ["Good-Night", "Greater Than One", "Out of Time", "Trying to Feel Alive", "Enjoy the Show"];
