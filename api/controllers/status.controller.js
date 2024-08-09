import {DebugSaveToFile} from "../../modules/DebugMode.js";
import {logger} from "../../modules/Logger.js";
import {getPlaylistName, playlistSongQuery, playlistListQuery, getPlayingSong} from "../../modules/MusicPlayer.js";

export async function queryPlaylist(req, res) {
    try {
        const id = req.query.id;
        const playlistName = getPlaylistName(id);
        logger('log', `Otrzymano request od ${req.hostname} ${req.get('User-Agent')}!`, 'LocalAPI - queryPlaylist');
        if (playlistName != id && playlistName != 'nicość') {
            const playlistSongsName = await playlistSongQuery(id);
            return res.status(201).json(
                {
                    playlistName: playlistName,
                    playlistSongsName: playlistSongsName
                }
            )
        }
        return res.status(500).send('Nie znaleziono playlisty o podanym ID!');
    } catch (e) {
        logger('verbose', 'Wystąpił błąd podczas próby wylistowania piosenek znajdujących się na playliscie!', 'LocalAPI - queryPlaylist');
        if (global.debugmode === true) {
            DebugSaveToFile('LocalAPI', 'query/playlist/songs', 'catched_error', e);
            logger('verbose', `Stacktrace został zrzucony do debug/`, 'LocalAPI - queryPlaylist');
        }
        throw e;
    }
}

export async function queryPlayingMusic(req, res) {
    try {
        logger('log', `Otrzymano request od ${req.hostname} ${req.get('User-Agent')}!`, 'LocalAPI - queryPlayingMusic');
        let [ isPlaying, songName, playedTime, toPlayTime ] = await getPlayingSong();
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
        throw e;
    }
}

export async function queryPlaylistList(req, res) {
    try {
        logger('log', `Otrzymano request od ${req.hostname} ${req.get('User-Agent')}!`, 'LocalAPI - queryPlaylistList');
        let playlistListFromFiles = await playlistListQuery()
        let playlistListNames = {};
        playlistListFromFiles.forEach((playlistID, index) => {
            let playlistName = getPlaylistName(playlistID)
            if (playlistName != playlistID) {
                playlistListNames[index + 1] = getPlaylistName(playlistID);
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
        throw e;
    }
}