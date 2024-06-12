import { exec } from 'child_process';
import * as path from "path";
import fs from "fs";
import {logger} from "./Logger.js";

function getPlaylistName(id) {
    switch (id) {
        case 0: return 'nicość';
        case 1: return 'Klasyczna';
        case 2: return 'POP';
        case 3: return 'RAP';
        case 4: return 'ROCK';
        case 5: return 'Soundtracki';
        default: return id;
    }
}

function playMusic(filename) {
    if(!fs.existsSync(`./mp3/${filename}.mp3`)) return logger('error','Brak pliku!!', 'playMusic');
    const buffer = path.resolve(`./mp3/${filename}.mp3`);

    exec(`cvlc --one-instance --play-and-exit ${buffer}`);
    logger('task','--------Play Music--------', 'playMusic');
    logger('task','Muzyka gra...', 'playMusic');
    logger('task',`Gra aktualnie: ${buffer}`, 'playMusic');
    logger('task','--------Play Music--------', 'playMusic');
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
    if(!fs.existsSync(`./mp3/${playlistID}/`)) return logger('error','Brak playlisty o podanym numerze!!', 'playPlaylist');
    const buffer = path.resolve(`./mp3/${playlistID}/`)

    exec(`cvlc --one-instance -Z --play-and-exit ${buffer}`);
    logger('task','--------Play Playlist - random--------', 'playPlaylist');
    logger('task','Playlista gra...', 'playPlaylist');
    logger('task',`Gra aktualnie playlista: ${getPlaylistName(playlistID)}`, 'playPlaylist');
    logger('task','--------Play Playlist - random--------', 'playPlaylist');
}

function killPlayer() {
    exec(`cvlc --one-instance vlc://quit`);
    logger('task','--------Kill Player--------', 'killPlayer');
    logger('task','Plejer ubity', 'killPlayer');
    logger('task','--------Kill Player--------', 'killPlayer');
}
export { playMusic, killPlayer, playPlaylist, playOnDemand };