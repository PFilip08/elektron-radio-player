import {DebugSaveToFile} from "../../modules/DebugMode.js";
import {logger} from "../../modules/Logger.js";
import {getPlaylistName, playlistSongQuery, playlistListQuery, getPlayingSong} from "../../modules/MusicPlayer.js";
import { pathSecurityChecker } from "../../modules/Other.js";

const playlistCache = new Map();
export async function queryPlaylist(req, res) {
    let timestamp= new Date(Date.now()).toLocaleString('pl', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    });
    try {
        const id = req.query.id;
        const force = req.query.nocache;
        const forceall = req.query.cacheclean;
        let playlistName = getPlaylistName(id);

        if (forceall === 'true') {
            if (!playlistCache.size) {
                logger('verbose', `Cache playlist jest pusty!`, 'LocalAPI - queryPlaylist');
                return res.status(400).send('Cache playlist jest pusty!');
            }
            logger('verbose', `Wyczyszczono cache playlist!`, 'LocalAPI - queryPlaylist');
            playlistCache.clear();
            return res.status(200).send('Wyczyszczono cache playlist!');
        }
        if (!id) {
            return res.status(400).send('Nie podano nazwy lub ID playlisty!');
        }
        let secuCheck = pathSecurityChecker(id);
        if (secuCheck.includes('_ATTEMPT')) {
            logger('warn', `Próba odtworzenia pliku z niebezpieczną ścieżką! Funkcja wykryła naruszenie: ${secuCheck} od IP: ${req.hostname}`, 'LocalAPI - queryPlaylist');
            return res.status(403).send('Niebezpieczna ścieżka!');
        }
        if (playlistCache.has(id) && !playlistName.includes('onDemand') && force !== 'true') {
            const cachedData = playlistCache.get(id);
            logger('verbose', `Zwrócono z cache: ${cachedData}`, 'LocalAPI - queryPlaylist');
            return res.status(200).json(cachedData);
        }
        if (playlistName.includes('onDemand')) {
            playlistName = 'Playlista na żądanie - ' + playlistName.replace('onDemand/', '').replace(/_/g, ' ');
        }
        if (playlistName !== id && playlistName !== 'nicość' || playlistName.includes('onDemand')) {
            const playlistSongsName = await playlistSongQuery(id);
            const playlistResponse = {
                playlistName: playlistName,
                Date: timestamp,
                playlistSongsName: playlistSongsName
            }
            playlistCache.set(id, playlistResponse);

            return res.status(201).json(playlistResponse);
        }
        return res.status(500).send('Nie znaleziono playlisty o podanym ID!');
    } catch (e) {
        logger('verbose', 'Wystąpił błąd podczas próby wylistowania piosenek znajdujących się na playliscie!', 'LocalAPI - queryPlaylist');
        if (global.debugmode === true) {
            DebugSaveToFile('LocalAPI', 'query/playlist/songs', 'catched_error', e);
            logger('verbose', `Stacktrace został zrzucony do debug/`, 'LocalAPI - queryPlaylist');
        }
        return res.status(500).send('Nie znaleziono playlisty o podanym ID!');
    }
}

export async function queryPlayingMusic(req, res) {
    try {
        logger('verbose', `Otrzymano request od ${req.hostname} ${req.get('User-Agent')}!`, 'LocalAPI - queryPlayingMusic');
        const [ isPlaying, songName, playedTime, toPlayTime ] = await getPlayingSong();
        return res.status(201).json(
            {
                isPlaying: isPlaying,
                playingSongName: songName,
                time: {
                    played: playedTime,
                    toPlay: toPlayTime
                }
            }
        )
    } catch (e) {
        logger('verbose', 'Wystąpił błąd podczas próby sprawdzenia jaka muzyka gra aktualnie!', 'LocalAPI - queryPlayingMusic');
        if (global.debugmode === true) {
            DebugSaveToFile('LocalAPI', 'query/playing', 'catched_error', e);
            logger('verbose', `Stacktrace został zrzucony do debug/`, 'LocalAPI - queryPlayingMusic');
        }
    }
}

export async function queryPlaylistList(req, res) {
    try {
        logger('verbose', `Otrzymano request od ${req.hostname} ${req.get('User-Agent')}!`, 'LocalAPI - queryPlaylistList');
        const playlistListFromFiles = await playlistListQuery()
        let playlistListNames = {};
        playlistListFromFiles.forEach((playlistID, index) => {
            const playlistName = getPlaylistName(playlistID)
            if (playlistName !== playlistID) {
                playlistListNames[index + 1] = getPlaylistName(playlistID);
            } else if (playlistName.includes('onDemand/')) {
                playlistListNames[index + 1] = 'Playlista na żądanie - ' + playlistName.replace('onDemand/', '').replace(/_/g, ' ');
            } else if (!Number.isInteger(parseInt(playlistName))) {
                playlistListNames[index + 1] = 'Playlista NIEPRAWIDŁOWA!!!';
            } else {
                playlistListNames[index + 1] = 'Nieznana playlista';
            }
        });
        return res.status(201).json(
            {
                playlistNames: playlistListNames,
                playlistList: playlistListFromFiles
            }
        )
    } catch (e) {
        logger('verbose', 'Wystąpił błąd podczas próby wylistowania playlist', 'LocalAPI - queryPlaylistList');
        if (global.debugmode === true) {
            DebugSaveToFile('LocalAPI', 'query/playlist/list', 'catched_error', e);
            logger('verbose', `Stacktrace został zrzucony do debug/`, 'LocalAPI - queryPlaylistList');
        }
    }
}