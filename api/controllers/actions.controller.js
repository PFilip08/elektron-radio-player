import {DebugSaveToFile} from "../../modules/DebugMode.js";
import {logger} from "../../modules/Logger.js";
import {killPlayer, killPlayerForce, playMusic, playPlaylist} from "../../modules/MusicPlayer.js";
import {pathSecurityChecker, sterylizatorIP} from "../../modules/Other.js";
import {removeFiles} from "../../modules/MusicDownloader.js";
import VLC from "vlc-client";
import {exec} from "child_process";
import * as fs from "fs";

export let szuffle = 'true';

// killPlayer
export async function kill(req, res) {
    try {
        const force = req.query.force;
        logger('log', `Otrzymano request od ${sterylizatorIP(req.connection.remoteAddress)} ${req.get('User-Agent')}!`, 'LocalAPI - killPlayer');
        if (force !== undefined) {
            killPlayerForce();
            return res.status(201).send('force gut');
        }
        killPlayer();
        return res.status(201).send('gut');
    } catch (e) {
        logger('verbose', 'Wystąpił błąd podczas próby zatrzymania odtwarzacza', 'LocalAPI - killPlayer');
        if (global.debugmode === true) {
            DebugSaveToFile('LocalAPI', 'kill', 'catched_error', e);
            logger('verbose', `Stacktrace został zrzucony do debug/`, 'LocalAPI - killPlayer');
        }
        return res.status(500).send('Błąd; Skontaktuj się z działem taboretów; '+e);
    }
}

// playMusic
export async function pMusic(req, res) {
    try {
        const file = req.query.file;
        logger('log', `Otrzymano request od ${sterylizatorIP(req.connection.remoteAddress)} ${req.get('User-Agent')}!`, 'LocalAPI - pMusic');
        if (!file) {
            return res.status(400).send('Nie podano nazwy pliku!');
        }
        let secuCheck = pathSecurityChecker(file);
        if (secuCheck.includes('_ATTEMPT')) {
            logger('warn', `Próba odtworzenia pliku z niebezpieczną ścieżką! Funkcja wykryła naruszenie: ${secuCheck} od IP: ${sterylizatorIP(req.connection.remoteAddress)}`, 'LocalAPI - pMusic');
            return res.status(403).send('Niebezpieczna ścieżka!');
        }
        playMusic(file);
        return res.status(201).send('gut');
    } catch (e) {
        logger('verbose', 'Wystąpił błąd podczas próby odtworzenia pliku', 'LocalAPI - pMusic');
        if (global.debugmode === true) {
            DebugSaveToFile('LocalAPI', 'play', 'catched_error', e);
            logger('verbose', `Stacktrace został zrzucony do debug/`, 'LocalAPI - pMusic');
        }
        return res.status(500).send('Błąd; Skontaktuj się z działem taboretów; '+e);
    }
}

// playMusic
export async function pPlaylist(req, res) {
    try {
        const id = req.query.id;
        logger('log', `Otrzymano request od ${sterylizatorIP(req.connection.remoteAddress)} ${req.get('User-Agent')}!`, 'LocalAPI - pPlaylist');
        if (!id) {
            return res.status(400).send('Nie podano numeru playlisty!');
        }
        let secuCheck = pathSecurityChecker(id);
        if (secuCheck.includes('_ATTEMPT')) {
            logger('warn', `Próba odtworzenia playlisty z niebezpieczną ścieżką! Funkcja wykryła naruszenie: ${secuCheck} od IP: ${sterylizatorIP(req.connection.remoteAddress)}`, 'LocalAPI - pPlaylist');
            return res.status(403).send('Niebezpieczna ścieżka!');
        }
        playPlaylist(id);
        return res.status(201).send('gut');
    } catch (e) {
        logger('verbose', 'Wystąpił błąd podczas próby odtworzenia playlisty', 'LocalAPI - pPlaylist');
        if (global.debugmode === true) {
            DebugSaveToFile('LocalAPI', 'playPlaylist', 'catched_error', e);
            logger('verbose', `Stacktrace został zrzucony do debug/`, 'LocalAPI - pPlaylist');
        }
        return res.status(500).send('Błąd; Skontaktuj się z działem taboretów; '+e);
    }
}

export async function vlcPlay(req, res) {
    try {
        const vlc = new VLC.Client({
            ip: '127.0.0.1',
            port: Number(process.env.VLC_PORT) || 4212,
            password: process.env.VLC_PASSWORD
        });
        logger('log', `Otrzymano request od ${sterylizatorIP(req.connection.remoteAddress)} ${req.get('User-Agent')}!`, 'LocalAPI - vlcPlay');
        await vlc.togglePlay();
        return res.status(201).send('gut');
    } catch (e) {
        logger('verbose', 'Wystąpił błąd podczas próby zmiany odtwarzania', 'LocalAPI - vlcPlay');
        if (global.debugmode === true) {
            DebugSaveToFile('LocalAPI', 'vlcPlay', 'catched_error', e);
            logger('verbose', `Stacktrace został zrzucony do debug/`, 'LocalAPI - vlcPlay');
        }
        return res.status(500).send('Błąd; Skontaktuj się z działem taboretów; '+e);
    }
}

export async function vlcNext(req, res) {
    try {
        const vlc = new VLC.Client({
            ip: '127.0.0.1',
            port: Number(process.env.VLC_PORT) || 4212,
            password: process.env.VLC_PASSWORD
        });
        logger('log', `Otrzymano request od ${sterylizatorIP(req.connection.remoteAddress)} ${req.get('User-Agent')}!`, 'LocalAPI - vlcNext');
        await vlc.next();
        return res.status(201).send('gut');
    } catch (e) {
        logger('verbose', 'Wystąpił błąd podczas próby zmiany piosenki', 'LocalAPI - vlcNext');
        if (global.debugmode === true) {
            DebugSaveToFile('LocalAPI', 'vlcNext', 'catched_error', e);
            logger('verbose', `Stacktrace został zrzucony do debug/`, 'LocalAPI - vlcNext');
        }
        return res.status(500).send('Błąd; Skontaktuj się z działem taboretów; '+e);
    }
}

export async function vlcPrevious(req, res) {
    try {
        const vlc = new VLC.Client({
            ip: '127.0.0.1',
            port: Number(process.env.VLC_PORT) || 4212,
            password: process.env.VLC_PASSWORD
        });
        logger('log', `Otrzymano request od ${sterylizatorIP(req.connection.remoteAddress)} ${req.get('User-Agent')}!`, 'LocalAPI - vlcPrevious');
        await vlc.previous();
        return res.status(201).send('gut');
    } catch (e) {
        logger('verbose', 'Wystąpił błąd podczas próby zmiany piosenki', 'LocalAPI - vlcPrevious');
        if (global.debugmode === true) {
            DebugSaveToFile('LocalAPI', 'vlcPrevious', 'catched_error', e);
            logger('verbose', `Stacktrace został zrzucony do debug/`, 'LocalAPI - vlcPrevious');
        }
        return res.status(500).send('Błąd; Skontaktuj się z działem taboretów; '+e);
    }
}

export async function vlcSzuffle(req, res) {
    try {
        const state = req.query.state;
        logger('log', `Otrzymano request od ${sterylizatorIP(req.connection.remoteAddress)} ${req.get('User-Agent')}!`, 'LocalAPI - vlcSzuffle');
        if (state === 'check') return res.status(200).send(szuffle);
        if (!state) return res.status(400).send('Nie podano stanu!');
        szuffle=state;
        return res.status(201).send(`Szuffle ${state}`);
    } catch (e) {
        logger('verbose', 'Wystąpił błąd podczas próby zmiany stanu', 'LocalAPI - vlcSzuffle');
        if (global.debugmode === true) {
            DebugSaveToFile('LocalAPI', 'vlcSzuffle', 'catched_error', e);
            logger('verbose', `Stacktrace został zrzucony do debug/`, 'LocalAPI - vlcSzuffle');
        }
        return res.status(500).send('Błąd; Skontaktuj się z działem taboretów; '+e);
    }
}

export async function delFiles(req, res) {
    try {
        const path = `./mp3/${req.query.path}/`;
        logger('log', `Otrzymano request od ${sterylizatorIP(req.connection.remoteAddress)} ${req.get('User-Agent')}!`, 'LocalAPI - delFiles');
        if (!path) {
            return res.status(400).send('Nie podano ścieżki do pliku!');
        }
        await removeFiles(path);
        return res.status(200).send('usunło chyba');
    } catch (e) {
        logger('verbose', 'Wystąpił błąd podczas próby usuwania plików', 'LocalAPI - delFiles');
        if (global.debugmode === true) {
            DebugSaveToFile('LocalAPI', 'delFiles', 'catched_error', e);
            logger('verbose', `Stacktrace został zrzucony do debug/`, 'LocalAPI - delFiles');
        }
        return res.status(500).send('Błąd; Skontaktuj się z działem taboretów; '+e);
    }
}

export async function normalize(req, res) {
    try {
        const playlist = req.query.playlist;
        const pathDir = './mp3/';
        const fullPath = pathDir+playlist;
        console.log(fullPath);
        if (fullPath.includes('../')) return res.status(511).send('a dzie masło roota?!?!1');
        // console.log(fs.existsSync(fullPath), fs.lstatSync(fullPath).isDirectory());
        if (!fs.existsSync(fullPath) || !fs.lstatSync(fullPath).isDirectory()) return res.status(406).send('playlista nie istnieje lub to nie playlista!!');
        // console.log('dupa2');
        const dupa = await new Promise((resolve, reject) => {
            // console.log('dupa3');
            exec(`mp3gain -r -c ${fullPath}/*`, (error, stdout, stderr) => {
                logger('verbose', "\n"+ stdout, 'LocalAPI - normalize');
                if (global.debugmode === true) {
                    DebugSaveToFile('LocalAPI', 'normalize', 'mp3gain_output', stdout);
                    logger('verbose', `Zapisano do debug/`, 'LocalAPI - normalize');
                }
                if (error) {
                    logger('error', `Błąd podczas próby normalizacji dźwięku przy użyciu mp3gain: ${error.message}`, 'LocalAPI - normalize');
                    if (global.debugmode === true) {
                        DebugSaveToFile('LocalAPI', 'normalize', 'mp3gain_error', error);
                        logger('verbose', `Stacktrace został zrzucony do debug/`, 'LocalAPI - normalize');
                    }
                    reject(error);
                    return res.status(400).send('error/brakplikuf!!');
                }
                resolve(stdout);
            });
        });
        return res.status(200).send(dupa);
    } catch (e) {
        logger('verbose', 'Wystąpił błąd podczas próby normalizacji!', 'LocalAPI - normalize');
        if (global.debugmode === true) {
            DebugSaveToFile('LocalAPI', 'normalize', 'catched_error', e);
            logger('verbose', `Stacktrace został zrzucony do debug/`, 'LocalAPI - normalize');
        }
        return res.status(500).send('Błąd; Skontaktuj się z działem taboretów; '+e);
    }
}