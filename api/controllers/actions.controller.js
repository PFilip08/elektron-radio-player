import {DebugSaveToFile} from "../../modules/DebugMode.js";
import {logger} from "../../modules/Logger.js";
import {killPlayer, playMusic, playPlaylist} from "../../modules/MusicPlayer.js";
import {pathSecurityChecker} from "../../modules/Other.js";

// killPlayer
export async function kill(req, res) {
    try {
        logger('log', `Otrzymano request od ${req.hostname} ${req.get('User-Agent')}!`, 'LocalAPI - killPlayer');
        killPlayer();
        return res.status(201).send('gut');
    } catch (e) {
        logger('verbose', 'Wystąpił błąd podczas próby zatrzymania odtwarzacza', 'LocalAPI - killPlayer');
        DebugSaveToFile('LocalAPI', 'kill', 'catched_error', e);
        throw e;
    }
}

// playMusic
export async function pMusic(req, res) {
    try {
        const file = req.query.file;
        let secuCheck = pathSecurityChecker(file);
        if (secuCheck.includes('_ATTEMPT')) {
            logger('warn', `Próba odtworzenia pliku z niebezpieczną ścieżką! Funkcja wykryła naruszenie: ${secuCheck} od IP: ${req.hostname}`, 'LocalAPI - pMusic');
            return res.status(403).send('Niebezpieczna ścieżka!');
        }
        logger('log', `Otrzymano request od ${req.hostname} ${req.get('User-Agent')}!`, 'LocalAPI - pMusic');
        playMusic(file);
        return res.status(201).send('gut');
    } catch (e) {
        logger('verbose', 'Wystąpił błąd podczas próby odtworzenia pliku', 'LocalAPI - pMusic');
        DebugSaveToFile('LocalAPI', 'play', 'catched_error', e);
        throw e;
    }
}

// playMusic
export async function pPlaylist(req, res) {
    try {
        const id = req.query.id;
        logger('log', `Otrzymano request od ${req.hostname} ${req.get('User-Agent')}!`, 'LocalAPI - pPlaylist');
        let secuCheck = pathSecurityChecker(id);
        if (secuCheck.includes('_ATTEMPT')) {
            logger('warn', `Próba odtworzenia playlisty z niebezpieczną ścieżką! Funkcja wykryła naruszenie: ${secuCheck} od IP: ${req.hostname}`, 'LocalAPI - pPlaylist');
            return res.status(403).send('Niebezpieczna ścieżka!');
        }
        playPlaylist(id);
        return res.status(201).send('gut');
    } catch (e) {
        logger('verbose', 'Wystąpił błąd podczas próby odtworzenia playlisty', 'LocalAPI - pPlaylist');
        DebugSaveToFile('LocalAPI', 'playPlaylist', 'catched_error', e);
        throw e;
    }
}