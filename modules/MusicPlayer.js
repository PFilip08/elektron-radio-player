import { exec } from 'child_process';
import * as path from "path";

function playMusic(filename) {
    // const stream = fs.createReadStream('./Twilight.mp3');
    const buffer = path.resolve(`./mp3/${filename}.mp3`);

    exec(`cvlc --one-instance --play-and-exit ${buffer}`);
    console.log('--------Play Music--------');
    console.log('Muzyka gra...');
    console.log('Gra aktualnie: ', buffer);
    console.log('--------Play Music--------');
}

function playOnDemand(filename) {
    const buffer = path.resolve(`./mp3/onDemand/${filename}.mp3`);

    exec(`cvlc --one-instance --loop ${buffer}`);
    console.log('--------Play Music (On Demand Mode)--------');
    console.log('Muzyka gra...');
    console.log('Gra aktualnie: ', buffer);
    console.log('--------Play Music (On Demand Mode)--------');
}

function playPlaylist(playlistID) {
    const buffer = path.resolve(`./mp3/${playlistID}/`);
    console.log(buffer);

    exec(`cvlc --one-instance -Z --play-and-exit ${buffer}`);
    console.log('--------Play Playlist - random--------');
    console.log('Muzyka gra...');
    console.log('Gra aktualnie: ', buffer);
    console.log('--------Play Playlist - random--------');
}

function killPlayer() {
    exec(`cvlc --one-instance vlc://quit`);
    console.log('--------Play Music--------')
    console.log('Plejer ubity');
    console.log('--------Play Music--------')
}
export { playMusic, killPlayer, playPlaylist, playOnDemand };