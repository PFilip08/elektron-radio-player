import { exec } from 'child_process';
import * as path from "path";
import fs from "fs";
import {logger} from "./Logger.js";

function getPlaylistName(id) {
    logger('verbose', `Pobieranie nazwy playlisty o ID: ${id}`, 'getPlaylistName');
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
    logger('verbose', `Odtwarzanie muzyki o nazwie: ${filename}`, 'playMusic');
    logger('verbose', `Sprawdzanie czy plik istnieje...`, 'playMusic');
    if(!fs.existsSync(`./mp3/${filename}.mp3`)) return logger('error','Brak pliku!', 'playMusic');
    logger('verbose', `Plik istnieje! Granie pliku muzycznego...`, 'playMusic');
    const buffer = path.resolve(`./mp3/${filename}.mp3`);

    exec(`cvlc --one-instance --play-and-exit ${buffer}`);
    logger('task','--------Play Music--------', 'playMusic');
    logger('task','Muzyka gra...', 'playMusic');
    logger('task',`Gra aktualnie: ${buffer}`, 'playMusic');
    logger('task','--------Play Music--------', 'playMusic');
}

function playOnDemand(filename) {
    logger('verbose', `Odtwarzanie muzyki na żądanie o nazwie: ${filename}`, 'playOnDemand');
    logger('verbose', `Sprawdzanie czy plik istnieje...`, 'playOnDemand');
    if(!fs.existsSync(`./mp3/onDemand/${filename}`) && !fs.existsSync(`./mp3/onDemand/${filename}.mp3`)) return logger('error','Brak pliku!!', 'playOnDemand');
    logger('verbose', `Plik istnieje! Granie pliku muzycznego...`, 'playOnDemand');
    let buffer = path.resolve(`./mp3/onDemand/${filename}.mp3`);
    logger('verbose', `Sprawdzanie czy plik jest folderem...`, 'playOnDemand');
    try {
        if (fs.lstatSync(`./mp3/onDemand/${filename}`).isDirectory()) buffer = path.resolve(`./mp3/onDemand/${filename}`); logger('verbose', `Plik jest folderem`, 'playOnDemand');
    } catch (e) {
        logger('verbose', `Plik nie jest folderem`, 'playOnDemand');
        if (global.debugmode === true) {
            fs.mkdirSync("./debug/MusicPlayer/playOnDemand/", { recursive: true }, (e) => {
                logger('verbose', colors.red('Nie można utworzyć folderu /debug/MusicPlayer/playOnDemand/'), 'playOnDemand');
                console.log(e);
            });
            fs.writeFileSync("debug/MusicPlayer/playOnDemand/catched_error.txt", error.stack, 'utf8', (e) => {
                logger('verbose', colors.red('Nie można zapisać pliku catched_error.txt'), 'playOnDemand');
                console.log(e);
            });
            logger('verbose',`Stacktrace został zrzucony do /debug`,'playOnDemand');
        }
    }
    exec(`cvlc --one-instance --loop ${buffer}`);
    logger('task','--------Play Music (On Demand Mode)--------', 'playOnDemand');
    logger('task','Muzyka gra...', 'playOnDemand');
    logger('task',`Gra aktualnie: ${buffer}`, 'playOnDemand');
    logger('task','--------Play Music (On Demand Mode)--------', 'playOnDemand');
}

function playPlaylist(playlistID) {
    logger('verbose', `Odtwarzanie playlisty o ID: ${playlistID}`, 'playPlaylist');
    logger('verbose', `Sprawdzanie czy folder o podanym ID istnieje...`, 'playPlaylist');
    if(!fs.existsSync(`./mp3/${playlistID}/`)) return logger('error','Brak playlisty o podanym numerze!!', 'playPlaylist');
    logger('verbose', `Folder istnieje! Granie playlisty...`, 'playPlaylist');
    const buffer = path.resolve(`./mp3/${playlistID}/`)

    exec(`cvlc --one-instance -Z --play-and-exit ${buffer}`);
    logger('task','--------Play Playlist - random--------', 'playPlaylist');
    logger('task','Playlista gra...', 'playPlaylist');
    logger('task',`Gra aktualnie playlista: ${getPlaylistName(playlistID)}`, 'playPlaylist');
    logger('task','--------Play Playlist - random--------', 'playPlaylist');
}

function killPlayer() {
    logger('verbose', `Ubijanie plejera...`, 'killPlayer');
    exec(`cvlc --one-instance vlc://quit`);
    logger('task','--------Kill Player--------', 'killPlayer');
    logger('task','Plejer ubity', 'killPlayer');
    logger('task','--------Kill Player--------', 'killPlayer');
}
export { playMusic, killPlayer, playPlaylist, playOnDemand };