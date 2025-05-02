import goodNight from "../../audio/good-night.mp3";
import greaterThanOne from "../../audio/greater-than-one.mp3";
import outOfTime from "../../audio/out-of-time.mp3";
import tryingToFeelAlive from "../../audio/trying-to-feel-alive.mp3";
import enjoyTheShow from "../../audio/enjoy-the-show.mp3";
import russianRoulette from "../../audio/russian-roulette.mp3";
import iWasNeverThere from "../../audio/i-was-never-there.mp3";
import illusion from "../../audio/illusion.mp3";
import fellowFeeling from "../../audio/fellow-feeling.mp3";
import tearsInTheRain from "../../audio/tears-in-the-rain.mp3";
import withoutAWarning from "../../audio/without-a-warning.mp3";

export type Song = {
    index: number;
    title: string;
    artist: string;
    albumImg: string;
    audioFile: string;
};

type SongMap = {
    [title: string]: Song;
};

export const songs: SongMap = {
    "Good-Night": {
        index: 0,
        title: "Good-Night",
        artist: "Unknown Artist",
        albumImg:
            "https://images.pexels.com/photos/266604/pexels-photo-266604.jpeg?cs=srgb&dl=pexels-pixabay-266604.jpg&fm=jpg",
        audioFile: goodNight
    },
    "Greater Than One": {
        index: 1,
        title: "Greater Than One",
        artist: "Ericdoa",
        albumImg: "https://images.genius.com/4e894524053564ac5301858a4744cc89.1000x1000x1.png",
        audioFile: greaterThanOne
    },
    "Out of Time": {
        index: 2,
        title: "Out of Time",
        artist: "The Weeknd",
        albumImg:
            "https://media.pitchfork.com/photos/61d5fa911b710fb5ce48ed9f/master/pass/The-Weeknd-Dawn-FM.jpg",
        audioFile: outOfTime
    },
    "Trying to Feel Alive": {
        index: 3,
        title: "Trying to Feel Alive",
        artist: "Porter Robinson",
        albumImg: "https://upload.wikimedia.org/wikipedia/en/0/07/Porter_Robinson_-_Nurture.png",
        audioFile: tryingToFeelAlive
    },
    "Enjoy the Show": {
        index: 4,
        title: "Enjoy the Show",
        artist: "The Weeknd",
        albumImg: "https://i.scdn.co/image/ab67616d0000b273982320da137d0de34410df61",
        audioFile: enjoyTheShow
    },
    "Russian Roulette": {
        index: 5,
        title: "Russian Roulette",
        artist: "Porter Robinson",
        albumImg:
            "https://i.ytimg.com/vi/N6w-UzfGX0c/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGGUgWig6MA8=&rs=AOn4CLC1kr39PiUr3i_lYIjlizhATEefkg",
        audioFile: russianRoulette
    },
    "I Was Never There": {
        index: 6,
        title: "I Was Never There",
        artist: "The Weeknd",
        albumImg:
            "https://upload.wikimedia.org/wikipedia/en/4/4d/MyDearMelancholy_-_album_by_The_Weeknd.jpg",
        audioFile: iWasNeverThere
    },
    "Illusion": {
        index: 7,
        title: "Illusion",
        artist: "Last Heroes",
        albumImg:
            "https://i1.sndcdn.com/artworks-2YaDeI5C5LGu-0-t500x500.jpg",
        audioFile: illusion
    },
    "Fellow Feeling": {
        index: 8,
        title: "Fellow Feeling",
        artist: "Porter Robinson",
        albumImg:
            "https://upload.wikimedia.org/wikipedia/en/e/eb/Porter_Robinson_-_Worlds.jpg",
        audioFile: fellowFeeling
    },
    "Tears In The Rain": {
        index: 9,
        title: "Tears In The Rain",
        artist: "The Weeknd",
        albumImg:
            "https://upload.wikimedia.org/wikipedia/en/e/ed/The_Weeknd_-_Kiss_Land.png",
        audioFile: tearsInTheRain
    },
    "Without A Warning": {
        index: 10,
        title: "Without A Warning",
        artist: "The Weeknd",
        albumImg:
            "https://i.scdn.co/image/ab67616d0000b273982320da137d0de34410df61",
        audioFile: withoutAWarning
    }
};

export const playlist: string[] = [
    "Good-Night",
    "Greater Than One",
    "Out of Time",
    "Trying to Feel Alive",
    "Enjoy the Show",
    "Russian Roulette",
    "I Was Never There",
    "Illusion",
    "Fellow Feeling",
    "Tears In The Rain",
    "Without A Warning"
];
