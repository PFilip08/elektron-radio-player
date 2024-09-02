import {DebugSaveToFile} from "../../modules/DebugMode.js";
import {logger} from "../../modules/Logger.js";
import {killPlayer, killPlayerForce, playMusic, playPlaylist} from "../../modules/MusicPlayer.js";
import {pathSecurityChecker} from "../../modules/Other.js";

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