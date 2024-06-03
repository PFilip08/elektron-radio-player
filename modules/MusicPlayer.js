import { exec } from 'child_process';
import * as path from "path";
import fs from "fs";

function playMusic(filename) {
    if(!fs.existsSync(`./mp3/${filename}/`)) return console.log('Brak pliku!!');
    const buffer = path.resolve(`./mp3/${filename}.mp3`);

    exec(`cvlc --one-instance --play-and-exit ${buffer}`);
    console.log('--------Play Music--------');
    console.log('Muzyka gra...');
    console.log('Gra aktualnie: ', buffer);
    console.log('--------Play Music--------');
}

function playOnDemand(filename) {
    if(!fs.existsSync(`./mp3/onDemand/${filename}/`)) return console.log('Brak pliku!!');
    const buffer = path.resolve(`./mp3/onDemand/${filename}.mp3`);

    exec(`cvlc --one-instance --loop ${buffer}`);
    console.log('--------Play Music (On Demand Mode)--------');
    console.log('Muzyka gra...');
    console.log('Gra aktualnie: ', buffer);
    console.log('--------Play Music (On Demand Mode)--------');
}

function playPlaylist(playlistID) {
    if(!fs.existsSync(`./mp3/${playlistID}/`)) return console.log('Brak pliku!!');
    const buffer = path.resolve(`./mp3/${playlistID}/`)
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