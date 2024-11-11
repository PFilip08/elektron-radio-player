import {DebugSaveToFile} from "../../modules/DebugMode.js";
import {logger} from "../../modules/Logger.js";
import {killPlayer, killPlayerForce, playMusic, playPlaylist} from "../../modules/MusicPlayer.js";
import {pathSecurityChecker} from "../../modules/Other.js";
import VLC from "vlc-client";

export let szuffle = true;

// killPlayer
export async function kill(req, res) {
    try {
        const force = req.query.force;
        logger('log', `Otrzymano request od ${req.hostname} ${req.get('User-Agent')}!`, 'LocalAPI - killPlayer');
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
    }
}

// playMusic
export async function pMusic(req, res) {
    try {
        const file = req.query.file;
        logger('log', `Otrzymano request od ${req.hostname} ${req.get('User-Agent')}!`, 'LocalAPI - pMusic');
        if (!file) {
            return res.status(400).send('Nie podano nazwy pliku!');
        }
        let secuCheck = pathSecurityChecker(file);
        if (secuCheck.includes('_ATTEMPT')) {
            logger('warn', `Próba odtworzenia pliku z niebezpieczną ścieżką! Funkcja wykryła naruszenie: ${secuCheck} od IP: ${req.hostname}`, 'LocalAPI - pMusic');
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
    }
}

// playMusic
export async function pPlaylist(req, res) {
    try {
        const id = req.query.id;
        logger('log', `Otrzymano request od ${req.hostname} ${req.get('User-Agent')}!`, 'LocalAPI - pPlaylist');
        if (!id) {
            return res.status(400).send('Nie podano numeru playlisty!');
        }
        let secuCheck = pathSecurityChecker(id);
        if (secuCheck.includes('_ATTEMPT')) {
            logger('warn', `Próba odtworzenia playlisty z niebezpieczną ścieżką! Funkcja wykryła naruszenie: ${secuCheck} od IP: ${req.hostname}`, 'LocalAPI - pPlaylist');
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
    }
}

export async function vlcPlay(req, res) {
    try {
        const vlc = new VLC.Client({
            ip: '127.0.0.1',
            port: Number(process.env.VLC_PORT) || 4212,
            password: process.env.VLC_PASSWORD
        });
        logger('log', `Otrzymano request od ${req.hostname} ${req.get('User-Agent')}!`, 'LocalAPI - vlcPlay');
        await vlc.togglePlay();
        return res.status(201).send('gut');
    } catch (e) {
        logger('verbose', 'Wystąpił błąd podczas próby zmiany odtwarzania', 'LocalAPI - vlcPlay');
        if (global.debugmode === true) {
            DebugSaveToFile('LocalAPI', 'vlcPlay', 'catched_error', e);
            logger('verbose', `Stacktrace został zrzucony do debug/`, 'LocalAPI - vlcPlay');
        }
    }
}

export async function vlcNext(req, res) {
    try {
        const vlc = new VLC.Client({
            ip: '127.0.0.1',
            port: Number(process.env.VLC_PORT) || 4212,
            password: process.env.VLC_PASSWORD
        });
        logger('log', `Otrzymano request od ${req.hostname} ${req.get('User-Agent')}!`, 'LocalAPI - vlcNext');
        await vlc.next();
        return res.status(201).send('gut');
    } catch (e) {
        logger('verbose', 'Wystąpił błąd podczas próby zmiany piosenki', 'LocalAPI - vlcNext');
        if (global.debugmode === true) {
            DebugSaveToFile('LocalAPI', 'vlcNext', 'catched_error', e);
            logger('verbose', `Stacktrace został zrzucony do debug/`, 'LocalAPI - vlcNext');
        }
    }
}

export async function vlcPrevious(req, res) {
    try {
        const vlc = new VLC.Client({
            ip: '127.0.0.1',
            port: Number(process.env.VLC_PORT) || 4212,
            password: process.env.VLC_PASSWORD
        });
        logger('log', `Otrzymano request od ${req.hostname} ${req.get('User-Agent')}!`, 'LocalAPI - vlcPrevious');
        await vlc.previous();
        return res.status(201).send('gut');
    } catch (e) {
        logger('verbose', 'Wystąpił błąd podczas próby zmiany piosenki', 'LocalAPI - vlcPrevious');
        if (global.debugmode === true) {
            DebugSaveToFile('LocalAPI', 'vlcPrevious', 'catched_error', e);
            logger('verbose', `Stacktrace został zrzucony do debug/`, 'LocalAPI - vlcPrevious');
        }
    }
}

export async function vlcSzuffle(req, res) {
    try {
        const state = req.query.state;
        logger('log', `Otrzymano request od ${req.hostname} ${req.get('User-Agent')}!`, 'LocalAPI - vlcSzuffle');
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
    }
}