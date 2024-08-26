import {exec} from 'child_process';
import * as path from "path";
import fs from "fs";
import {logger} from "./Logger.js";
import {DebugSaveToFile} from './DebugMode.js';
import {parseFile} from 'music-metadata';
import VLC from 'vlc-client';
import {uint8ArrayToBase64} from 'uint8array-extras';

function getPlaylistName(id) {
    logger('verbose', `Pobieranie nazwy playlisty o ID: ${parseInt(id)}`, 'getPlaylistName');
    switch (parseInt(id)) {
        case 0: return 'nicość';
        case 1: return 'Klasyczna';
        case 2: return 'POP';
        case 3: return 'RAP';
        case 4: return 'ROCK';
        case 5: return 'Soundtracki';
        default: return id;
    }
}
async function getPlayingSong() {
    try {
        const timeout = new Promise((_, reject) => 
            setTimeout(() => reject(
                logger('verbose', 'Czas wykonania funkcji przekroczony!', 'getPlayingSong'),
                new Error('Czas wykonania funkcji przekroczony'
                )), 4000)
        );
        const vlcOperation = (async () => {
            const vlc = new VLC.Client({
                ip: '127.0.0.1',
                port: Number(process.env.VLC_PORT) || 4212,
                password: process.env.VLC_PASSWORD
            });
            let vlcPlaying = await vlc.isPlaying();
            if (vlcPlaying) {
                const isPlaying = await vlc.isPlaying();
                const metadata = await vlc.getFileName();
                const toPlayed = await vlc.getLength();
                const played = await vlc.getTime();
                const title = metadata.replace(/\.(mp3)$/, '');
                return [ isPlaying, title, played, toPlayed ];
            } else {
                return [false, 'Nic aktualnie nie gra', null, null];
            }
        })();
        return await Promise.race([vlcOperation, timeout]);
    } catch (e) {
        if (global.debugmode === true) {
            logger('error', `Wystąpił błąd podczas próby pobrania aktualnie granej piosenki!`, 'getPlayingSong');
            DebugSaveToFile('MusicPlayer', 'getPlayingSong', 'catched_error', e);
            logger('verbose',`Stacktrace został zrzucony do /debug`,'getPlayingSong');
        }
        return [false, 'Nic aktualnie nie gra'];
    }
}
async function playlistSongQuery(playlistID) {
    const getMetadata = async (filePath) => {
        try {
            const metadata = await parseFile(filePath);
            const title = metadata.common.title || path.basename(filePath, path.extname(filePath));
            const artist = metadata.common.artist || 'Nieznany artysta';
            const cover = metadata.common.picture || 'taboret';
            let coverData;
            if (cover === "taboret") coverData = cover;
            else cover[0].data=(uint8ArrayToBase64(cover[0].data)); coverData = cover[0];
            return { title, artist, coverData };
        } catch (error) {
            logger('error', `Wystąpił błąd podczas próby odczytania metadanych z pliku ${filePath}`, 'queryPlaylistSongQuery');
            if (global.debugmode === true) {
                DebugSaveToFile('MusicPlayer', 'queryPlaylistSongQuery', 'catched_error', error);
                logger('verbose',`Stacktrace został zrzucony do /debug`,'queryPlaylistSongQuery');    
            }
            return { title: path.basename(filePath, path.extname(filePath)), artist: 'Nieznany Artysta' };
        }
    };

    const files = fs.readdirSync(`./mp3/${playlistID}`);
    const mp3Files = files.filter(file => path.extname(file).toLowerCase() === '.mp3');

    const metadataPromises = mp3Files.map(file => {
        const filePath = path.join(`./mp3/${playlistID}`, file);
        return getMetadata(filePath);
    });

    return Promise.all(metadataPromises);
}

async function playlistListQuery() {
    try {
        const files = fs.readdirSync('./mp3', { recursive: true });
        const folders = files.filter(file => fs.lstatSync(path.join('./mp3', file)).isDirectory() && file !== 'onDemand');
        logger('verbose', `Zwracanie listy folderów...`, 'playlistListQuery');
        return folders;
    } catch (err) {
        logger('error', `Wystąpił błąd podczas próby odczytania folderu mp3`, 'playlistListQuery');
        console.error('Wystąpił błąd podczas próby odczytania folderu mp3', err);
        if (global.debugmode === true) {
            DebugSaveToFile('MusicPlayer', 'playlistListQuery', 'catched_error', err);
            logger('verbose',`Stacktrace został zrzucony do /debug`,'playlistListQuery');
        }
    }
}

function playMusic(filename) {
    logger('verbose', `Odtwarzanie muzyki o nazwie: ${filename}`, 'playMusic');
    logger('verbose', `Sprawdzanie czy plik istnieje...`, 'playMusic');
    if(!fs.existsSync(`./mp3/${filename}.mp3`)) return logger('error','Brak pliku!', 'playMusic');
    logger('verbose', `Plik istnieje! Granie pliku muzycznego...`, 'playMusic');
    const buffer = path.resolve(`./mp3/${filename}.mp3`);

    exec(`cvlc -I http --http-host 127.0.0.1 --http-port ${process.env.VLC_PORT || 4212} --http-password ${process.env.VLC_PASSWORD} --one-instance --play-and-exit ${buffer}`);
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
            DebugSaveToFile('MusicPlayer', 'playOnDemand', 'catched_error', e);
            logger('verbose',`Stacktrace został zrzucony do /debug`,'playOnDemand');
        }
    }
    exec(`cvlc -I http --http-host 127.0.0.1 --http-port ${process.env.VLC_PORT || 4212} --http-password ${process.env.VLC_PASSWORD} --one-instance --loop ${buffer}`);
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
    let buffer = path.resolve(`./mp3/${playlistID}/`)
    buffer = path.normalize(`./mp3/${playlistID}/`)
    exec(`cvlc -I http --http-host 127.0.0.1 --http-port ${process.env.VLC_PORT || 4212} --http-password ${process.env.VLC_PASSWORD} --one-instance -Z --play-and-exit ${buffer}`);
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
export { playMusic, killPlayer, playPlaylist, playOnDemand, playlistSongQuery, playlistListQuery, getPlaylistName, getPlayingSong};