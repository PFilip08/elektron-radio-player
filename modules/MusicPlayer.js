import { exec } from 'child_process';
import * as path from "path";
import fs from "fs";
import {logger} from "./Logger.js";

function playMusic(filename) {
    if(!fs.existsSync(`./mp3/${filename}.mp3`)) return logger('error','Brak pliku!!', 'playMusic');
    const buffer = path.resolve(`./mp3/${filename}.mp3`);

    exec(`cvlc --one-instance --play-and-exit ${buffer}`);
    logger('TASK','--------Play Music--------', 'playMusic');
    logger('TASK','Muzyka gra...', 'playMusic');
    logger('TASK',`Gra aktualnie: ${buffer}`, 'playMusic');
    logger('TASK','--------Play Music--------', 'playMusic');
}

function playOnDemand(filename) {
    if(!fs.existsSync(`./mp3/onDemand/${filename}.mp3`)) return logger('error','Brak pliku!!', 'playOnDemand');
    const buffer = path.resolve(`./mp3/onDemand/${filename}.mp3`);

    exec(`cvlc --one-instance --loop ${buffer}`);
    logger('task','--------Play Music (On Demand Mode)--------', 'playOnDemand');
    logger('task','Muzyka gra...', 'playOnDemand');
    logger('task',`Gra aktualnie: ${buffer}`, 'playOnDemand');
    logger('task','--------Play Music (On Demand Mode)--------', 'playOnDemand');
}

function playPlaylist(playlistID) {
    if(!fs.existsSync(`./mp3/${playlistID}/`)) return logger('error','Brak pliku!!', 'playPlaylist');
    const buffer = path.resolve(`./mp3/${playlistID}/`)
    console.log(buffer);

    exec(`cvlc --one-instance -Z --play-and-exit ${buffer}`);
    logger('task','--------Play Playlist - random--------', 'playPlaylist');
    logger('task','Muzyka gra...', 'playPlaylist');
    logger('task',`Gra aktualnie: ${buffer}`, 'playPlaylist');
    logger('task','--------Play Playlist - random--------', 'playPlaylist');
}

function killPlayer() {
    exec(`cvlc --one-instance vlc://quit`);
    logger('task','--------Kill Player--------', 'killPlayer');
    logger('task','Plejer ubity', 'killPlayer');
    logger('task','--------Kill Player--------', 'killPlayer');
}
export { playMusic, killPlayer, playPlaylist, playOnDemand };